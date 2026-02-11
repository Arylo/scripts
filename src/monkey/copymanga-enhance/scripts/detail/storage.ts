import GM_getValue from "../../../polyfill/GM_getValue"
import GM_setValue from "../../../polyfill/GM_setValue"
import { chapter, comic } from "../constant"
import genStorage from "../utils/genStorage"
import { DirectionMode } from "./newPage/constant"
import { PageInfo } from "./types"

const whitePageKey = Object.freeze([comic, chapter, 'hasWhitePage'].join('.'))
const pageInfoKey = Object.freeze([comic, chapter, 'info'].join('.'))
const directionModeKey = Object.freeze([comic, 'direction', 'mode'].join('.'))

const cacheMap = new Map<string, any>()

const whitePageStorage = genStorage<boolean>({
  save: (key, value) => localStorage.setItem(key, value),
  load: (key) => localStorage.getItem(key),
})

const pageInfoStorage = genStorage<PageInfo>({
  save: (key, value) => sessionStorage.setItem(key, value),
  load: (key) => sessionStorage.getItem(key),
})

const directionModeStorage = genStorage<DirectionMode>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})

export default {
  get whitePage (): boolean {
    return whitePageStorage.get(whitePageKey, false)
  },
  set whitePage (value: boolean) {
    whitePageStorage.set(whitePageKey, value)
  },
  get pageInfo (): PageInfo {
    const defaultValue: PageInfo = {
      images: [],
      title: void 0,
      prevUrl: void 0,
      nextUrl: void 0,
      menuUrl: void 0,
    }
    return pageInfoStorage.get(pageInfoKey, defaultValue)
  },
  set pageInfo (value: PageInfo) {
    pageInfoStorage.set(pageInfoKey, value)
  },
  get directionMode (): DirectionMode {
    return directionModeStorage.get(directionModeKey, DirectionMode.RTL)
  },
  set directionMode (value: DirectionMode) {
    directionModeStorage.set(directionModeKey, value)
  },
}
