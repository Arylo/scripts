import path from 'path'
import fs from 'fs'
import os from 'os'
import { nanoid } from 'nanoid'

function readFileSync(filepath: string) {
  return fs.readFileSync(filepath, 'utf-8')
}

function readJSONFileSync(filepath: string) {
  return JSON.parse(readFileSync(filepath))
}

function writeFileSync(filepath: string, data: any) {
  return fs.writeFileSync(filepath, data, 'utf-8')
}

function writeJSONFileSync(filepath: string, data: any) {
  return writeFileSync(filepath, JSON.stringify(data, null, 2))
}

function isFile (filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isFile()
}

function isFolder(filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory()
}

export enum LS_TYPE {
  FILE = 'file', FOLDER = 'folder',
}
const LS_DEFAULT_OPTIONS = {
  types: [LS_TYPE.FILE, LS_TYPE.FOLDER],
  raw: false,
  recursive: false,
}

function ls (targetPath: string, options?: Partial<typeof LS_DEFAULT_OPTIONS>) {
  const opts = Object.assign({}, LS_DEFAULT_OPTIONS, options)
  if (!isFolder(targetPath)) return []
  const filenames = fs.readdirSync(targetPath)
    .filter((filename) => {
      const realpath = path.resolve(targetPath, filename)
      return (opts.types.includes(LS_TYPE.FILE) && isFile(realpath)) ||
        (opts.types.includes(LS_TYPE.FOLDER) && isFolder(realpath))
    })
  if (!opts.raw) return filenames
  return filenames.map((filename) => path.resolve(targetPath, filename))
}

function copyFile(sourcePath: string, targetPath: string, { force = false } = {}) {
  if (fs.existsSync(targetPath) && !force) return
  fs.createReadStream(sourcePath).pipe(fs.createWriteStream(targetPath))
}

function createTempPath(suffix = '') {
  let tempPath = path.resolve(os.tmpdir(), nanoid())
  if (suffix) {
    tempPath += `.${suffix}`
  }
  return tempPath
}

export const buildFS = {
  readFileSync,
  readJSONFileSync,
  writeFileSync,
  writeJSONFileSync,
  isFile,
  isFolder,
  ls,
  copyFile,
  createTempPath,
}

export default buildFS
