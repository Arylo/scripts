import { DirectionMode } from "./newPage/constant"
import { PageInfo } from "./types"
import { getImageWidthKey, imageWidthStorage } from "./storages/imageWidth"
import { getWhitePageKey, whitePageStorage } from "./storages/whitePage"
import { getPageInfoKey, pageInfoStorage } from "./storages/pageInfo"
import { getDirectionModeKey, directionModeStorage } from "../../storages/directionMode"
import { getTtbColumnKey, ttbColumnStorage } from "./storages/ttbColumn"

export default {
  get imageWidth (): number {
    const imageWidthKey = getImageWidthKey()
    return imageWidthStorage.get(imageWidthKey, 70)
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
  get ttbColumn (): 1 | 2 | 3 {
    const ttbColumnKey = getTtbColumnKey()
    const value = ttbColumnStorage.get(ttbColumnKey, 2)
    return [1, 2, 3].includes(value) ? value as 1 | 2 | 3 : 2
  },
  set ttbColumn (value: 1 | 2 | 3) {
    const ttbColumnKey = getTtbColumnKey()
    ttbColumnStorage.set(ttbColumnKey, value)
  },
}
