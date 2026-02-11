import GM_getValue from "../../../polyfill/GM_getValue"
import GM_setValue from "../../../polyfill/GM_setValue"
import { DirectionMode } from "../detail/newPage/constant"
import genStorage from "../utils/genStorage"
import parseConstant from "../utils/parseConstant"

const directionModeStorage = genStorage<DirectionMode>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})

const getDirectionModeKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'direction', 'mode'].join('.'))
}

export default () => {
  const directionModeKey = getDirectionModeKey()
  const directionMode = directionModeStorage.get(directionModeKey)
  if (directionMode) return

  const changeTiaoTag = $('a[href^="/comics?theme=changtiao"]')
  if (changeTiaoTag.length) {
    directionModeStorage.set(directionModeKey, DirectionMode.TTB)
    return
  }

  const authors = $('a[href^="/author"]').text()
  if (/[\u0800-\u4e00]/.test(authors)) {
    console.log('Found Japanese author')
    directionModeStorage.set(directionModeKey, DirectionMode.RTL)
    return
  }
}
