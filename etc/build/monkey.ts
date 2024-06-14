import path from 'path'
import fs from 'fs'
import * as esbuild from 'esbuild'
import { ROOT_PATH, githubInfo } from '../consts'

const srcPath = path.resolve(ROOT_PATH, 'src/monkey')
const outPath = path.resolve(ROOT_PATH, 'dist/monkey')

const pkgInfo = require(path.resolve(ROOT_PATH, 'package.json'))
const { domain, repo, branch } = githubInfo
const githubPrefix = `${domain}/${repo}/${branch}`

const parseFilenames = (filepath: string) => {
  const filename = path.basename(filepath, path.extname(filepath))
  return {
    raw: path.basename(filename),
    name: filename,
    meta: `${filename}.meta.js`,
    user: `${filename}.user.js`,
    min: `${filename}.min.js`,
    json: `${filename}.json`,
  }
}
const parseJsonPath = (filepath: string) => path.resolve(path.dirname(filepath), parseFilenames(filepath).json)
const paresBanner = (filepath: string, appendInfo = {}) => {
  const jsonPath = parseJsonPath(filepath)
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const { user, meta } = parseFilenames(filepath)

  const metaData = {
    ...jsonContent,
    ...appendInfo,
    author: pkgInfo.author,
    downloadURL: `${githubPrefix}/${user}`,
    updateURL: `${githubPrefix}/${meta}`,
  }
  const content = Object
    .entries(metaData)
    .sort(([key1], [key2]) => {
      const orderHead = ['name', 'description', 'version', 'author', 'namespace']
      const orderTail = ['downloadURL', 'updateURL', 'run-at', 'grant']
      const key1Order = [...orderHead, ...orderTail].indexOf(key1)
      const key2Order = [...orderHead, ...orderTail].indexOf(key2)

      let result = -1
      if (key1Order !== -1 && key2Order !== -1) {
        result = key1Order - key2Order
      } else if (key1Order !== -1) {
        result = key1Order >= orderHead.length ? 1 : -1
      } else if (key2Order !== -1) {
        result = key2Order >= orderHead.length ? -1 : 1
      } else {
        result = key1.localeCompare(key2)
      }
      return result
    })
    .reduce<string[]>((list, [key, value]) => {
      if (typeof value === 'string') {
        list.push(`@${key} ${value}`)
      } else if (Array.isArray(value)) {
        value.forEach((v) => typeof v === 'string' && list.push(`@${key} ${v}`))
      }
      return list
    }, [])
  const bannerContent = ['==UserScript==', ...content, '==/UserScript==']
  return bannerContent.map((content) => `// ${content}`).join('\n')
}

(() => {
  const filepaths = fs.readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => fs.statSync(filepath).isFile() && filepath.endsWith('.ts') && fs.statSync(parseJsonPath(filepath)).isFile())

  for (const filepath of filepaths) {
    const {
      meta,
      user,
    } = parseFilenames(filepath)
    const sourcePath = filepath
    const targetPath = path.resolve(outPath, user)
    console.log(`Building ${path.relative(srcPath, sourcePath)} --outfile=${targetPath} ...`)
    const banner = paresBanner(sourcePath)
    esbuild.buildSync({
      entryPoints: [sourcePath],
      bundle: true,
      banner: { js: banner },
      outfile: targetPath,
    })
    const metaPath = path.resolve(outPath, meta)
    fs.writeFileSync(metaPath, banner, 'utf-8')
    console.log(`Building ${path.relative(srcPath, sourcePath)} --outfile=${targetPath} ... Done!`)
  }
})()
