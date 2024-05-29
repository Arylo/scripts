import { mv, cd, ls } from '@js-sh/js-sh'

const ROOT_PATH_KEY = 'ROOT_PATH'
const TARGET_PATH_KEY = 'TARGET_PATH'

const checkVariables = () => {
  let hasLostVariable = false
  for (const key of [ROOT_PATH_KEY, TARGET_PATH_KEY]) {
    const val = process.env[key]
    if (!val) {
      console.error(`[x] Lost the environment variable (${key})`)
      hasLostVariable = true
    } else {
      console.info(`[√] Found the environment variable (${key}) => ${val}`)
    }
  }
  if (hasLostVariable) process.exit(1)
}

const moveFiles = (targetPath) => {

  const pendingFilepaths = [...ls('./**/*.mp4'), ...ls('./**/*.mkv')]

  if (pendingFilepaths.length === 0) return false

  console.log(pendingFilepaths)

  pendingFilepaths.forEach(p => mv(p, targetPath))
}

checkVariables()

const {
  [ROOT_PATH_KEY]: ROOT_PATH,
  [TARGET_PATH_KEY]: TARGET_PATH,
} = process.env

cd(ROOT_PATH)

moveFiles(TARGET_PATH)

console.log(ls('./**/*.bt.xltd'))