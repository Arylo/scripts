import { directionModeStorage, getDirectionModeKey } from '../../storages/directionMode'
import { DirectionMode } from './newPage/constant'
import { getImageWidthKey, imageWidthStorage } from './storages/imageWidth'
import { getPageInfoKey, pageInfoStorage } from './storages/pageInfo'
import { getWhitePageKey, whitePageStorage } from './storages/whitePage'
import { PageInfo } from './types'

export default {
  get imageWidth(): number {
    const imageWidthKey = getImageWidthKey()
    return imageWidthStorage.get(imageWidthKey, 70)
  },
  set imageWidth(value: number) {
    const imageWidthKey = getImageWidthKey()
    imageWidthStorage.set(imageWidthKey, value)
  },
  get whitePage(): boolean {
    const whitePageKey = getWhitePageKey()
    return whitePageStorage.get(whitePageKey, false)
  },
  set whitePage(value: boolean) {
    const whitePageKey = getWhitePageKey()
    whitePageStorage.set(whitePageKey, value)
  },
  get pageInfo(): PageInfo {
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
  set pageInfo(value: PageInfo) {
    const pageInfoKey = getPageInfoKey()
    pageInfoStorage.set(pageInfoKey, value)
  },
  get directionMode(): DirectionMode {
    const directionModeKey = getDirectionModeKey()
    return directionModeStorage.get(directionModeKey, DirectionMode.RTL)
  },
  set directionMode(value: DirectionMode) {
    const directionModeKey = getDirectionModeKey()
    directionModeStorage.set(directionModeKey, value)
  },
}
