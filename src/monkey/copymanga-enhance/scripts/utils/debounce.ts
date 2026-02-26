type AnyFunction = (...args: any[]) => any

export type DebouncedFunction<T extends AnyFunction> = ((...args: Parameters<T>) => void) & {
  cancel: () => void,
  flush: () => ReturnType<T> | undefined,
}

export default function debounce<T extends AnyFunction> (fn: T, wait = 0): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let latestArgs: Parameters<T> | undefined
  let latestThis: ThisParameterType<T>
  let result: ReturnType<T> | undefined

  const invoke = () => {
    timer = undefined
    if (!latestArgs) {
      return result
    }
    result = fn.apply(latestThis, latestArgs)
    latestArgs = undefined
    return result
  }

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    latestArgs = args
    latestThis = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      invoke()
    }, wait)
  } as DebouncedFunction<T>

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    latestArgs = undefined
  }

  debounced.flush = () => {
    if (!timer) {
      return result
    }
    clearTimeout(timer)
    return invoke()
  }

  return debounced
}
