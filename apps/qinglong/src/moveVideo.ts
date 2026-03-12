import { cd, ls } from '@js-sh/js-sh'
import { checkVariables } from './utils/checkVariables'
import { moveFiles } from './utils/moveFiles'

const ROOT_PATH_KEY = 'MV_VIDEO_ROOT_PATH'
const TARGET_PATH_KEY = 'MV_VIDEO_TARGET_PATH'

checkVariables([ROOT_PATH_KEY, TARGET_PATH_KEY])

// oxfmt-ignore
const {
  [ROOT_PATH_KEY]: rootPath,
  [TARGET_PATH_KEY]: targetPath,
} = process.env

cd(rootPath as string)

moveFiles(['./**/*.mp4', './**/*.mkv', './**/*.avi'], targetPath as string)

console.log(ls('./**/*.bt.xltd'))
