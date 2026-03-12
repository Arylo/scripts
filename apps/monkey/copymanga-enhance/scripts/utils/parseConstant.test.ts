import { describe, expect, test } from 'vitest'
import parseConstant from './parseConstant'

describe(parseConstant.name, () => {
  test('should parse comic and chapter from pathname', () => {
    const pathname = '/comic/comic123/chapter/chapter456'
    const result = parseConstant(pathname)
    expect(result).toEqual({ comic: 'comic123', chapter: 'chapter456' })
  })
  test('should return empty object if no match', () => {
    const pathname = '/some/other/path'
    const result = parseConstant(pathname)
    expect(result).toEqual({})
  })
  test('should handle pathname with only comic', () => {
    const pathname = '/comic/comic123'
    const result = parseConstant(pathname)
    expect(result).toEqual({ comic: 'comic123', chapter: undefined })
  })
})
