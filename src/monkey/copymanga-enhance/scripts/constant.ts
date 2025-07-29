import parseConstant from './utils/parseConstant'

export const comic = parseConstant(globalThis.location?.pathname).comic as string
export const chapter = parseConstant(globalThis.location?.pathname).chapter as string
