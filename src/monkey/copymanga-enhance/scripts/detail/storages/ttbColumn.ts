import GM_getValue from "../../../../polyfill/GM_getValue"
import GM_setValue from "../../../../polyfill/GM_setValue"
import genStorage from "../../utils/genStorage"
import parseConstant from "../../utils/parseConstant"

export const getTtbColumnKey = () => {
  const comic = parseConstant(location?.pathname).comic as string
  return Object.freeze([comic, 'ttb', 'column'].join('.'))
}

export const ttbColumnStorage = genStorage<number>({
  save: (key, value) => GM_setValue(key, value),
  load: (key) => GM_getValue(key, null),
})
