import path from 'path'
import buildFS from '@scripts/build-fs'

export default function hasBannerFile(scriptRootPath: string) {
  const filepath = path.resolve(scriptRootPath, 'banner.json')
  return buildFS.isFile(filepath)
}
