import { test, expect, describe } from 'vitest'
import { findIndex } from './common'

describe(findIndex.name, () => {
  test('normal', () => {
    const targetValue = 2
    const index = findIndex([1, targetValue, 3], (item) => item === targetValue)
    expect(index).toBe(1)
  })

  test('start 1 index', () => {
    const targetValue = 2
    const index = findIndex([1, targetValue, 3], (item) => item === targetValue, { startIndex: [1, targetValue].indexOf(targetValue) })
    expect(index).toBe(1)
  })

  test('start 2 index', () => {
    const targetValue = 2
    const index = findIndex([1, targetValue, 3], (item) => item === targetValue, { startIndex: [1, targetValue].indexOf(targetValue) + 1 })
    expect(index).toBe(-1)
  })
})
