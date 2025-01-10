import { chapter, comic } from "../../../constant"

const CACHE_KEY = `${comic}.hasWhitePage.${chapter}`

export function get (): boolean {
  return JSON.parse(GM_getValue(CACHE_KEY, JSON.stringify(false)))
}

export function save (value: boolean) {
  GM_setValue(CACHE_KEY, JSON.stringify(value))
}
