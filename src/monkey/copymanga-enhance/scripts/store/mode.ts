import { comic } from "../common"
import { ComicDirection } from "../constant"

const CACHE_KEY = `${comic}.direction.mode`

export function get (): ComicDirection {
  return GM_getValue(CACHE_KEY, ComicDirection.RTL)
}

export function save (value: ComicDirection) {
  GM_setValue(CACHE_KEY, value)
}
