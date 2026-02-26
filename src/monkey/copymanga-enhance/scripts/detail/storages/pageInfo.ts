import genStorage from "../../utils/genStorage"
import parseConstant from "../../utils/parseConstant"
import { PageInfo } from "../types"

export const getPageInfoKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  const chapter = parseConstant(location?.pathname).chapter as string
  return Object.freeze([comic, chapter, 'info'].join('.'))
}

export const pageInfoStorage = genStorage<PageInfo>({
  save: (key, value) => sessionStorage.setItem(key, value),
  load: (key) => sessionStorage.getItem(key),
})
