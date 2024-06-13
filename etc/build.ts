import path from 'path'
import fs from 'fs'
import * as esbuild from 'esbuild'

const ROOT_PATH = path.resolve(__dirname, '..')
const pathMap = {
  qinglong: [path.resolve(ROOT_PATH, 'src/qinglong'), path.resolve(ROOT_PATH, 'dist/qinglong')],
}

const filepaths = fs.readdirSync(pathMap.qinglong[0])
  .map((filename) => path.resolve(pathMap.qinglong[0], filename))
  .filter((filepath) => fs.statSync(filepath).isFile() && filepath.endsWith('.ts'))

const dependencies = Object.keys(require(path.resolve(ROOT_PATH, 'package.json')).dependencies)

for (const filepath of filepaths) {
  console.log(`esbuild ${path.relative(pathMap.qinglong[0], filepath)} --outdir=${pathMap.qinglong[1]} ...`)
  esbuild.buildSync({
    entryPoints: [filepath],
    bundle: true,
    external: dependencies,
    outdir: pathMap.qinglong[1],
  })
  console.log(`esbuild ${path.relative(pathMap.qinglong[0], filepath)} --outdir=${pathMap.qinglong[1]} ... Done!`)
}
