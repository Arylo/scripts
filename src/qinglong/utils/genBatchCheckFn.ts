export const genBatchCheckFn = (checkFn: (checkValue: string) => boolean) => {
  return (valueOrValues: string | string[], { lostExit = true } = {}) => {
    const values = (Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues])
      .filter(key => typeof key === 'string' && key.length > 0)
    let allPass = true
    for (const val of values) {
      const result = checkFn(val)
      if (!result) allPass = false
    }
    if (!allPass && lostExit) process.exit(1)
    return allPass
  }
}
