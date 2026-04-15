import { describe, test, expect } from 'vitest'
import diffDate from './diffDate'

const base = new Date('2026-04-08T12:00:00.000Z')

describe('diffDate', () => {
  test('相差天数时返回"X天前"', () => {
    const date = new Date('2026-04-05T12:00:00.000Z') // 3天前
    expect(diffDate(date, base)).toBe('3天前')
  })

  test('相差小时时返回"X小时前"', () => {
    const date = new Date('2026-04-08T07:00:00.000Z') // 5小时前
    expect(diffDate(date, base)).toBe('5小时前')
  })

  test('相差分钟时返回"X分钟前"', () => {
    const date = new Date('2026-04-08T11:30:00.000Z') // 30分钟前
    expect(diffDate(date, base)).toBe('30分钟前')
  })

  test('相差秒数时返回"X秒前"', () => {
    const date = new Date('2026-04-08T11:59:15.000Z') // 45秒前
    expect(diffDate(date, base)).toBe('45秒前')
  })

  test('同一时刻返回"刚刚"', () => {
    expect(diffDate(base, base)).toBe('刚刚')
  })

  test('未来时间返回"刚刚"', () => {
    const future = new Date('2026-04-09T12:00:00.000Z')
    expect(diffDate(future, base)).toBe('刚刚')
  })

  test('支持时间戳数字', () => {
    const date = base.getTime() - 2 * 60 * 1000 // 2分钟前
    expect(diffDate(date, base)).toBe('2分钟前')
  })

  test('支持字符串格式日期', () => {
    expect(diffDate('2026-04-07T12:00:00.000Z', base)).toBe('1天前')
  })

  test('不传 from 时使用当前时间（smoke test）', () => {
    const justNow = new Date(Date.now() - 500) // 0.5秒前
    const result = diffDate(justNow)
    expect(['刚刚', '1秒前']).toContain(result)
  })
})
