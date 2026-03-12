import fs from 'fs'
import path from 'path'
import buildFS, { LS_TYPE } from '@scripts/build-fs'
import logger from '@scripts/logger'

const projectRootPath = process.cwd()
const sourcePath = path.resolve(projectRootPath, 'apps/qinglong/dist')
const targetPath = path.resolve(projectRootPath, 'dist/qinglong')

export default async function moveQinglongScripts() {
  // 检查源路径是否存在
  if (!buildFS.isFolder(sourcePath)) {
    logger.warn(`Source path does not exist: ${sourcePath}`)
    return
  }

  // 创建目标目录（如果不存在）
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  // 获取源路径中的所有文件
  const files = buildFS.ls(sourcePath, {
    types: [LS_TYPE.FILE],
    raw: true,
    recursive: false,
  })

  for (const sourceFile of files) {
    const filename = path.basename(sourceFile)
    const targetFile = path.resolve(targetPath, filename)

    await logger.inject(filename, async () => {
      logger.log(`Copying ${path.relative(projectRootPath, sourceFile)} to ${path.relative(projectRootPath, targetFile)} ...`)
      buildFS.copyFile(sourceFile, targetFile, { force: true })
      logger.log(`Copying ${path.relative(projectRootPath, sourceFile)} to ${path.relative(projectRootPath, targetFile)} ... Done`)
    })
  }

  logger.log(`All files copied from ${path.relative(projectRootPath, sourcePath)} to ${path.relative(projectRootPath, targetPath)}`)
}

// 如果直接运行此文件
if (require.main === module) {
  moveQinglongScripts().catch((error) => {
    logger.error(error)
    process.exit(1)
  })
}
