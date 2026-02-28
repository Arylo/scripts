import { directionModeStorage, getDirectionModeKey } from '../../storages/directionMode'
import { DirectionMode } from '../detail/newPage/constant'

const hasJapanese = (text: string) => /[\u0800-\u4e00]/.test(text)

export default () => {
  const directionModeKey = getDirectionModeKey()
  const directionMode = directionModeStorage.get(directionModeKey)
  if (directionMode) return

  const changeTiaoTag = $('a[href^="/comics?theme=changtiao"]')
  if (changeTiaoTag.length) {
    directionModeStorage.set(directionModeKey, DirectionMode.TTB)
    return
  }

  const bookName = $('h6').text()
  if (hasJapanese(bookName)) {
    console.log('Found Japanese book name')
    directionModeStorage.set(directionModeKey, DirectionMode.RTL)
    return
  }

  const bookAliasName = $('li:has(h6) + li > p').text()
  if (hasJapanese(bookAliasName)) {
    console.log('Found Japanese book alias name')
    directionModeStorage.set(directionModeKey, DirectionMode.RTL)
    return
  }

  const authors = $('a[href^="/author"]').text()
  if (hasJapanese(authors)) {
    console.log('Found Japanese author')
    directionModeStorage.set(directionModeKey, DirectionMode.RTL)
    return
  }
}
