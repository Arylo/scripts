import { GM_getValue, GM_setValue } from '@scripts/gm-polyfill'
import { genStorage } from '@scripts/gen-storage'
import parseConstant from "../scripts/utils/parseConstant"
import { DirectionMode } from "../scripts/detail/newPage/constant"

export const getDirectionModeKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'direction', 'mode'].join('.'))
}

export const directionModeStorage = genStorage<DirectionMode>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})
