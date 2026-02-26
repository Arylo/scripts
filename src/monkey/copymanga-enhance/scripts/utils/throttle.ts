export type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

export default function throttle<T extends (...args: any[]) => any> (
  fn: T,
  wait = 300,
  options: ThrottleOptions = {},
) {
  const { leading = true, trailing = true } = options

  let timer: ReturnType<typeof setTimeout> | null = null
  let lastInvokeTime = 0
  let lastArgs: Parameters<T> | null = null
  let lastThis: ThisParameterType<T> | undefined

  const invoke = (time: number) => {
    lastInvokeTime = time
    const args = lastArgs as Parameters<T>
    const thisArg = lastThis as ThisParameterType<T>
    lastArgs = null
    lastThis = undefined
    fn.apply(thisArg, args)
  }

  const shouldInvoke = (time: number) => {
    if (lastInvokeTime === 0) return true
    return time - lastInvokeTime >= wait
  }

  const remainingWait = (time: number) => {
    const elapsed = time - lastInvokeTime
    return Math.max(wait - elapsed, 0)
  }

  const timerExpired = () => {
    timer = null
    if (trailing && lastArgs) {
      invoke(Date.now())
    }
  }

  const throttled = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now()

    if (!leading && lastInvokeTime === 0) {
      lastInvokeTime = now
    }

    lastArgs = args
    lastThis = this

    if (shouldInvoke(now)) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      invoke(now)
      return
    }

    if (!timer && trailing) {
      timer = setTimeout(timerExpired, remainingWait(now))
    }
  }

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastInvokeTime = 0
    lastArgs = null
    lastThis = undefined
  }

  throttled.flush = () => {
    if (!timer || !lastArgs) return
    clearTimeout(timer)
    timer = null
    invoke(Date.now())
  }

  return throttled as T & {
    cancel: () => void
    flush: () => void
  }
}
