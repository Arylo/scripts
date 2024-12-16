import path from 'path'
import buildFS from '../../../packages/buildFS'

export default function hasBannerFile(scriptRootPath: string) {
  const filepath = path.resolve(scriptRootPath, 'banner.json')
  return buildFS.isFile(filepath)
}
