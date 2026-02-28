import { genStorage } from '@scripts/gen-storage'
import { GM_getValue, GM_setValue } from '@scripts/gm-polyfill'
import parseConstant from '../../utils/parseConstant'

export const getImageWidthKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'image', 'width'].join('.'))
}

export const imageWidthStorage = genStorage<number>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})
