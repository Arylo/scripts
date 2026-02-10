import GM_getValue from "../../polyfill/GM_getValue"
import GM_setValue from "../../polyfill/GM_setValue"
import { chapter, comic } from "./constant"
import { DirectionMode } from "./newPage/constant"
import { PageInfo } from "./types"

const whitePageKey = Object.freeze([comic, chapter, 'hasWhitePage'].join('.'))
const pageInfoKey = Object.freeze([comic, chapter, 'info'].join('.'))
const directionModeKey = Object.freeze([comic, 'direction', 'mode'].join('.'))

const cacheMap = new Map<string, any>()

export default {
  get whitePage (): boolean {
    const key = whitePageKey
    const result = cacheMap.get(key) ?? JSON.parse(localStorage.getItem(key) || 'false')
    !cacheMap.has(key) && cacheMap.set(key, result)
    return result
  },
  set whitePage (value: boolean) {
    const key = whitePageKey
    const result = JSON.stringify(value)
    localStorage.setItem(key, result)
    cacheMap.set(key, value)
  },
  get pageInfo (): PageInfo {
    const defaultValue: PageInfo = {
      images: [],
      title: void 0,
      prevUrl: void 0,
      nextUrl: void 0,
      menuUrl: void 0,
    }
    const key = pageInfoKey
    const result = cacheMap.get(key) ?? JSON.parse(sessionStorage.getItem(key) ?? JSON.stringify(defaultValue))
    !cacheMap.has(key) && cacheMap.set(key, result)
    return result
  },
  set pageInfo (value: PageInfo) {
    const key = pageInfoKey
    const result = JSON.stringify(value)
    sessionStorage.setItem(key, result)
    cacheMap.set(key, value)
  },
  get directionMode (): DirectionMode {
    const key = directionModeKey
    const result = cacheMap.get(key) ?? GM_getValue(key, DirectionMode.RTL)
    !cacheMap.has(key) && cacheMap.set(key, result)
    return result
  },
  set directionMode (value: DirectionMode) {
    const key = directionModeKey
    GM_setValue(key, value)
    cacheMap.set(key, value)
  },
}
