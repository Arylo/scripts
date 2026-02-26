import { describe, expect, test, vi } from 'vitest'
import throttle from './throttle'

describe(throttle.name, () => {
  test('should throttle frequent calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapped = throttle(fn, 100)

    wrapped()
    wrapped()
    wrapped()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  test('should support cancel', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapped = throttle(fn, 100)

    wrapped()
    wrapped()
    wrapped.cancel()
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  test('should support trailing false', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapped = throttle(fn, 100, { trailing: false })

    wrapped()
    wrapped()
    wrapped()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
