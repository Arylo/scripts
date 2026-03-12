import fs from 'fs'
import path from 'path'
import buildFS, { LS_TYPE } from '@scripts/build-fs'
import logger from '@scripts/logger'

const projectRootPath = process.cwd()
const monkeyRootPath = path.resolve(projectRootPath, 'apps/monkey')
const targetPath = path.resolve(projectRootPath, 'dist/monkey')

function collectFilesRecursively(folderPath: string): string[] {
	const filepaths: string[] = []
	const entries = fs.readdirSync(folderPath, { withFileTypes: true })

	for (const entry of entries) {
		const entryPath = path.resolve(folderPath, entry.name)
		if (entry.isDirectory()) {
			filepaths.push(...collectFilesRecursively(entryPath))
			continue
		}
		if (entry.isFile()) {
			filepaths.push(entryPath)
		}
	}

	return filepaths
}

export default async function moveMonkeyScripts() {
	if (!buildFS.isFolder(monkeyRootPath)) {
		logger.warn(`Source path does not exist: ${monkeyRootPath}`)
		return
	}

	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath, { recursive: true })
	}

	const packagePaths = buildFS.ls(monkeyRootPath, {
		types: [LS_TYPE.FOLDER],
		raw: true,
		recursive: false,
	})

	for (const packagePath of packagePaths) {
		const sourceDistPath = path.resolve(packagePath, 'dist')
		if (!buildFS.isFolder(sourceDistPath)) {
			continue
		}

		const files = collectFilesRecursively(sourceDistPath)

		for (const sourceFile of files) {
			const relativeFilepath = path.relative(sourceDistPath, sourceFile)
			const targetFile = path.resolve(targetPath, relativeFilepath)
			const targetFolder = path.dirname(targetFile)
			if (!fs.existsSync(targetFolder)) {
				fs.mkdirSync(targetFolder, { recursive: true })
			}

			await logger.inject(relativeFilepath, async () => {
				logger.log(
					`Copying ${path.relative(projectRootPath, sourceFile)} to ${path.relative(projectRootPath, targetFile)} ...`,
				)
				buildFS.copyFile(sourceFile, targetFile, { force: true })
				logger.log(
					`Copying ${path.relative(projectRootPath, sourceFile)} to ${path.relative(projectRootPath, targetFile)} ... Done`,
				)
			})
		}
	}

	logger.log(
		`All files copied from ${path.relative(projectRootPath, monkeyRootPath)}/*/dist/** to ${path.relative(projectRootPath, targetPath)}`,
	)
}

if (require.main === module) {
	moveMonkeyScripts().catch((error) => {
		logger.error(error)
		process.exit(1)
	})
}
