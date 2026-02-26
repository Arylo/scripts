import GM_getValue from "../../../../polyfill/GM_getValue"
import GM_setValue from "../../../../polyfill/GM_setValue"
import genStorage from "../../utils/genStorage"
import parseConstant from "../../utils/parseConstant"

export const getImageWidthKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'image', 'width'].join('.'))
}

export const imageWidthStorage = genStorage<number>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})
