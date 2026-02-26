import { describe, expect, test, vi } from 'vitest'
import debounce from './debounce'

describe(debounce.name, () => {
  test('should debounce and only invoke once with latest arguments', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced(1)
    debounced(2)
    debounced(3)

    expect(fn).not.toBeCalled()
    vi.advanceTimersByTime(99)
    expect(fn).not.toBeCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith(3)

    vi.useRealTimers()
  })

  test('should cancel pending invocation', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('hello')
    debounced.cancel()
    vi.advanceTimersByTime(100)

    expect(fn).not.toBeCalled()
    vi.useRealTimers()
  })

  test('should flush pending invocation immediately', () => {
    vi.useFakeTimers()
    const fn = vi.fn((value: number) => value * 2)
    const debounced = debounce(fn, 100)

    debounced(5)
    const result = debounced.flush()

    expect(result).toBe(10)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith(5)

    vi.advanceTimersByTime(100)
    expect(fn).toBeCalledTimes(1)
    vi.useRealTimers()
  })
})
