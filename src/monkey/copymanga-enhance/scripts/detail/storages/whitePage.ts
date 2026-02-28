import { genStorage } from '@scripts/gen-storage'
import parseConstant from '../../utils/parseConstant'

export const getWhitePageKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  const chapter = parseConstant(location?.pathname).chapter as string
  return Object.freeze([comic, chapter, 'hasWhitePage'].join('.'))
}

export const whitePageStorage = genStorage<boolean>({
  save: (key, value) => localStorage.setItem(key, value),
  load: (key) => localStorage.getItem(key),
})
