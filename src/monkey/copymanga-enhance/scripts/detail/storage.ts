import GM_getValue from "../../../polyfill/GM_getValue"
import GM_setValue from "../../../polyfill/GM_setValue"
import genStorage from "../utils/genStorage"
import parseConstant from "../utils/parseConstant"
import { DirectionMode } from "./newPage/constant"
import { PageInfo } from "./types"


const getImageWidthKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'image', 'width'].join('.'))
}
const getWhitePageKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  const chapter = parseConstant(location?.pathname).chapter as string
  return Object.freeze([comic, chapter, 'hasWhitePage'].join('.'))
}
const getPageInfoKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  const chapter = parseConstant(location?.pathname).chapter as string
  return Object.freeze([comic, chapter, 'info'].join('.'))
}
const getDirectionModeKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'direction', 'mode'].join('.'))
}

const imageWidthStorage = genStorage<number>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})

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
  get imageWidth (): number {
    const imageWidthKey = getImageWidthKey()
    return imageWidthStorage.get(imageWidthKey, 100)
  },
  set imageWidth (value: number) {
    const imageWidthKey = getImageWidthKey()
    imageWidthStorage.set(imageWidthKey, value)
  },
  get whitePage (): boolean {
    const whitePageKey = getWhitePageKey()
    return whitePageStorage.get(whitePageKey, false)
  },
  set whitePage (value: boolean) {
    const whitePageKey = getWhitePageKey()
    whitePageStorage.set(whitePageKey, value)
  },
  get pageInfo (): PageInfo {
    const pageInfoKey = getPageInfoKey()
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
    const pageInfoKey = getPageInfoKey()
    pageInfoStorage.set(pageInfoKey, value)
  },
  get directionMode (): DirectionMode {
    const directionModeKey = getDirectionModeKey()
    return directionModeStorage.get(directionModeKey, DirectionMode.RTL)
  },
  set directionMode (value: DirectionMode) {
    const directionModeKey = getDirectionModeKey()
    directionModeStorage.set(directionModeKey, value)
  },
}
