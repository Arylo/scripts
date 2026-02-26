import { DirectionMode } from "../detail/newPage/constant"
import { directionModeStorage, getDirectionModeKey } from "../../storages/directionMode"

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
