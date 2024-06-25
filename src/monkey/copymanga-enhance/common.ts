export const genScrollTo = (el: Window | Element) => (top: number, isSmooth = false) => el.scrollTo({
  top,
  left: 0,
  behavior: isSmooth ? 'smooth' : 'auto',
})

export const comic = globalThis.location?.pathname.split('/')[2]
export const chapter = globalThis.location?.pathname.split('/')[4]

export const findIndex = <T>(list: T[], predicate: (item: T) => boolean, opts?: { startIndex?: number }) => {
  const { startIndex = 0 } = opts || {}
  const targetList = list.slice(startIndex)
  const nextIndex = targetList.findIndex(predicate)
  if (nextIndex === -1) return nextIndex
  return nextIndex + startIndex
}

export const group = <T>(list: T[], groupFn: (item: T) => any) => {
  return list.reduce<T[][]>((acc, item, index) => {
    if (index === 0) {
      acc.push([item])
      return acc
    }
    const lastList = acc[acc.length - 1]
    const lastKey = groupFn(lastList[0])
    const curKey = groupFn(item)
    if (lastKey === curKey) {
      lastList.push(item)
    } else {
      acc.push([item])
    }
    return acc
  }, [])
}
