import path from 'path'
import fs from 'fs'
import { ROOT_PATH } from '../consts'
import { buildScript, exportLatestDeployInfo, paresBanner, parseFilenames, parseJsonPath } from './monkey.utils'

const srcPath = path.resolve(ROOT_PATH, 'src/monkey')
const outPath = path.resolve(ROOT_PATH, 'dist/monkey')

;(async () => {
  const filepaths = fs.readdirSync(srcPath)
    .map((filename) => path.resolve(srcPath, filename))
    .filter((filepath) => fs.statSync(filepath).isFile() && filepath.endsWith('.ts') && fs.statSync(parseJsonPath(filepath)).isFile())

  for (const filepath of filepaths) {
    const {
      meta,
      user,
      deployJson
    } = parseFilenames(filepath)
    const sourcePath = filepath
    const targetPath = path.resolve(outPath, user)
    console.log(`Building ${path.relative(ROOT_PATH, sourcePath)} --outfile=${path.relative(ROOT_PATH, targetPath)} ...`)
    const deployInfo = await exportLatestDeployInfo(sourcePath)
    fs.writeFileSync(path.resolve(outPath, deployJson), JSON.stringify(deployInfo, null, 2), 'utf-8')
    const banner = paresBanner(sourcePath, { version: deployInfo.version })
    buildScript(sourcePath, {
      banner: { js: banner },
      outfile: targetPath,
    })
    const metaPath = path.resolve(outPath, meta)
    fs.writeFileSync(metaPath, banner, 'utf-8')
    console.log(`Building ${path.relative(ROOT_PATH, sourcePath)} --outfile=${path.relative(ROOT_PATH, targetPath)} ... Done!`)
  }
})()
