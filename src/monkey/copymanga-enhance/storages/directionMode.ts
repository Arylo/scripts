import GM_getValue from "../../polyfill/GM_getValue"
import GM_setValue from "../../polyfill/GM_setValue"
import genStorage from "../scripts/utils/genStorage"
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
