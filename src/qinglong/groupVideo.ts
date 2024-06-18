import fs from 'fs'
import path from 'path'
import { ls } from '@js-sh/js-sh'
import { checkVariables } from "./utils/checkVariables"
import { genBatchCheckFn } from './utils/genBatchCheckFn'
import logger from './utils/logger'

type RAW_FILE = {
  realPath: string,
  name: string,
  stat: fs.Stats,
  ino: number,
}

// --------------------------------------------------

const ROOT_PATH_KEY = 'GROUP_VIDEO_ROOT_PATH'
const TARGET_PATH_KEY = 'GROUP_VIDEO_TARGET_PATH'
const FOLDER_PREFIX = 'tag_'
const FILE_EXT = ['.mp4', '.mkv']
const TAG_FILTER_FNS: Array<(file: Readonly<RAW_FILE>) => string> = [
  (file) => {
    return file.stat.ctime.getFullYear().toString()
  },
]

// --------------------------------------------------

checkVariables([ROOT_PATH_KEY, TARGET_PATH_KEY])

const {
  [ROOT_PATH_KEY]: rootPath,
  [TARGET_PATH_KEY]: targetPath,
} = process.env as { [ROOT_PATH_KEY]: string, [TARGET_PATH_KEY]: string }

let devNode!: number

genBatchCheckFn((p: string) => {
  const stat = fs.statSync(p)
  if (!stat.isDirectory()) {
    logger.fail(`The path (${p}) is not a directory`)
    return false
  }
  if (!devNode) {
    devNode = stat.dev
  }
  logger.info(`The device node of the path (${p}) is ${stat.dev}`)
  if (devNode !== stat.dev) {
    logger.fail(`The device node of the path (${p}) is different from the other path`)
    return false
  }
  return true
})([rootPath, targetPath])

const fileListMap = FILE_EXT
  .reduce<string[]>((acc, ext) => {
    return [
      ...acc,
      ...ls(path.resolve(rootPath, `./*${ext}`)),
    ]
  }, [])
  .map((p) => {
    const stat = fs.statSync(p)
    const baseObj: Readonly<RAW_FILE> = Object.freeze({
      realPath: p,
      name: path.basename(p),
      stat,
      ino: stat.ino,
    })
    const { stat: _, ...restObj } = baseObj
    return {
      ...restObj,
      tags: TAG_FILTER_FNS.map((fn) => fn(baseObj)).filter(Boolean),
    }
  })

const tagSet = fileListMap.reduce<Set<string>>((set, { tags }) => {
  for (const tag of tags) {
    set.add(tag.toString())
  }
  return set
}, new Set())

for (const tag of [...tagSet]) {
  logger.info(`Start to process the tag (${tag}) ...`)

  const targetFolderPath = path.resolve(targetPath, `${FOLDER_PREFIX}${tag}`)
  if (!fs.existsSync(targetFolderPath)) {
    logger.pending(`Create the folder (${targetFolderPath}) ...`)
    fs.mkdirSync(targetFolderPath, { recursive: true })
    logger.success(`Create the folder (${targetFolderPath}) ... Done`)
  } else {
    logger.info(`The folder (${targetFolderPath}) has been created`)
  }

  const pendingFiles = fileListMap.filter((file) => file.tags.includes(tag))

  fs.readdirSync(targetFolderPath)
    .filter((filename) => filename !== pendingFiles.find((file) => file.name === filename)?.name)
    .forEach((filename) => {
      const targetFilePath = path.resolve(targetFolderPath, filename)
      logger.pending(`Unlink the file (${targetFilePath}) ...`)
      fs.unlinkSync(targetFilePath)
      logger.success(`Unlink the file (${targetFilePath}) ... Done`)
    })

  for (const file of pendingFiles) {
    const targetFilePath = path.resolve(targetFolderPath, file.name)
    if (!fs.existsSync(targetFilePath)) {
      logger.pending(`Link the file (${file.realPath}) to ${targetFilePath} ...`)
      fs.linkSync(file.realPath, targetFilePath)
      logger.success(`Link the file (${file.realPath}) to ${targetFilePath} ... Done`)
    } else if (file.ino === fs.statSync(targetFilePath).ino) {
      logger.info(`The file (${file.realPath}) has been linked to ${targetFilePath}`)
    } else if (file.ino !== fs.statSync(targetFilePath).ino) {
      logger.pending(`Unlink the file (${targetFilePath}) ...`)
      fs.unlinkSync(targetFilePath)
      logger.success(`Unlink the file (${targetFilePath}) ... Done`)
      logger.pending(`Link the file (${file.realPath}) to ${targetFilePath} ...`)
      fs.linkSync(file.realPath, targetFilePath)
      logger.success(`Link the file (${file.realPath}) to ${targetFilePath} ... Done`)
    }
  }

  logger.info(`Finish to process the tag (${tag})`)
}
