import { genStorage } from '@scripts/gen-storage'
import { GM_getValue, GM_setValue } from '@scripts/gm-polyfill'
import { DirectionMode } from '../detail/newPage/constant'
import parseConstant from '../utils/parseConstant'

export const getDirectionModeKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'direction', 'mode'].join('.'))
}

export const directionModeStorage = genStorage<DirectionMode>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})
