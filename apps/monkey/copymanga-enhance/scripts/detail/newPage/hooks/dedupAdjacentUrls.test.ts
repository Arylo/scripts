import { describe, expect, test } from 'vitest'
import dedupAdjacentUrls from './dedupAdjacentUrls'

describe('dedupAdjacentUrls', () => {
  test('should handle empty list', () => {
    expect(dedupAdjacentUrls()).toEqual([])
    expect(dedupAdjacentUrls([])).toEqual([])
  })

  test('should keep a single item', () => {
    expect(dedupAdjacentUrls(['A'])).toEqual(['A'])
  })

  test('should remove adjacent duplicates', () => {
    expect(dedupAdjacentUrls(['A', 'A', 'B', 'B', 'C'])).toEqual(['A', 'B', 'C'])
  })

  test('should collapse fully duplicated list to one item', () => {
    expect(dedupAdjacentUrls(['A', 'A', 'A'])).toEqual(['A'])
  })

  test('should keep non-adjacent duplicates', () => {
    expect(dedupAdjacentUrls(['A', 'B', 'A'])).toEqual(['A', 'B', 'A'])
  })

  test('should preserve order in mixed sequence', () => {
    expect(dedupAdjacentUrls(['A', 'A', 'B', 'C', 'C', 'B', 'B', 'D'])).toEqual([
      'A',
      'B',
      'C',
      'B',
      'D',
    ])
  })
})
