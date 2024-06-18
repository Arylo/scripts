import { genBatchCheckFn } from './genBatchCheckFn'
import logger from './logger'

export const checkVariables = genBatchCheckFn((key: string) => {
  const val = process.env[key]
  if (!val) {
    logger.fail(`Lost the environment variable (${key})`)
    return false
  }
  logger.success(`Found the environment variable (${key}) => ${val}`)
  return true
})
