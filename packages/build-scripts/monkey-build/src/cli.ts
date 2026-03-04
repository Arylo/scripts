import path from 'path'
import entry from './entry'

const args = process.argv.slice(2)

// 处理 --help 参数
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: monkey-build [path] [options]

Arguments:
  path              The path to build (default: current directory)

Options:
  -h, --help        Show this help message
  -v, --version     Show version number

Examples:
  $ monkey-build
  $ monkey-build ./src/monkey/copymanga-enhance
  $ monkey-build /path/to/project
`)
  process.exit(0)
}

// 处理 --version 参数
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json')
  console.log(pkg.version)
  process.exit(0)
}

// 获取构建路径
const buildPath = args[0] ? path.resolve(process.cwd(), args[0]) : process.cwd()

;(async () => {
  try {
    await entry(buildPath)
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
})()
