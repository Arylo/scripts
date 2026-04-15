import { describe, test, expect } from 'vitest'
import { formatFileSize } from './formatFileSize'

describe('formatFileSize', () => {
  test('should format 0 bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  test('should format bytes less than 1000 correctly', () => {
    expect(formatFileSize(1)).toBe('1.00 B')
    expect(formatFileSize(500)).toBe('500.00 B')
    expect(formatFileSize(999)).toBe('999.00 B')
  })

  test('should use KB when size is 1000 or more bytes', () => {
    expect(formatFileSize(1000)).toBe('0.98 KB') // 1000 / 1024 = 0.9766
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1500)).toBe('1.46 KB') // 1500 / 1024 = 1.4648
  })

  test('should use MB when size is 1024*1024 or more bytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.50 MB')
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1.00 MB') // 1MB - 1字节 = 1023.999KB >= 1000，所以使用MB
    expect(formatFileSize(1024 * 1024 * 1024 - 1)).toBe('1.00 GB') // 接近1GB但还差1字节 = 1023.999MB >= 1000，所以使用GB
  })

  test('should use GB when size is 1024^3 or more bytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
    expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.50 GB')
  })

  test('should handle custom decimal places', () => {
    expect(formatFileSize(1500, 0)).toBe('1 KB')
    expect(formatFileSize(1500, 1)).toBe('1.5 KB')
    expect(formatFileSize(1500, 3)).toBe('1.465 KB')
  })

  test('should handle very large sizes', () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1.00 TB')
    expect(formatFileSize(1024 * 1024 * 1024 * 1024 * 1024)).toBe('1.00 PB')
  })

  test('edge cases', () => {
    // 刚好1000字节
    expect(formatFileSize(1000)).toBe('0.98 KB')

    // 刚好1023字节（应该显示为字节）
    expect(formatFileSize(1023)).toBe('1023.00 B')

    // 刚好1024字节（应该显示为KB）
    expect(formatFileSize(1024)).toBe('1.00 KB')

    // 刚好1024*1024-1字节（应该显示为KB）
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.00 KB')

    // 刚好1024*1024字节（应该显示为MB）
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
  })
})
