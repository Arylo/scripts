import { chapter, comic } from "../common"
import { PageInfo } from "../types"

const CACHE_KEY = `${comic}.info.${chapter}`

export function get () {
  const content = sessionStorage.getItem(CACHE_KEY)
  if (content === null || typeof content === 'undefined') return content
  return Object.assign({
    prevUrl: void 0,
    nextUrl: void 0,
    menuUrl: void 0,
    title: void 0,
  }, JSON.parse(content)) as PageInfo
}

export function save (info: PageInfo) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(info))
}
