import { describe, it, expect } from 'vitest'
import { STATUS_CODE as ADMIN_STATUS_CODE, STATUS_MAP as ADMIN_STATUS_MAP } from './admin'
import { STATUS_CODE as GENERAL_STATUS_CODE } from './general'
import { STATUS_CODE as GUEST_STATUS_CODE, STATUS_MAP as GUEST_STATUS_MAP } from './guest'

describe('guest STATUS_CODE', () => {
  it('每个值都应该是6位数字', () => {
    Object.values(GUEST_STATUS_CODE).forEach((value) => {
      const valueStr = String(value)
      expect(valueStr).toHaveLength(6)
      expect(/^\d{6}$/.test(valueStr)).toBe(true)
    })
  })

  it('每个值的前3位应该是合法的HTTP状态码（100-599）', () => {
    Object.values(GUEST_STATUS_CODE).forEach((value) => {
      const httpStatusCode = Math.floor(value / 1000)
      expect(httpStatusCode).toBeGreaterThanOrEqual(100)
      expect(httpStatusCode).toBeLessThanOrEqual(599)
    })
  })
})

describe('guest STATUS_MAP', () => {
  it('所有键都应该来自STATUS_CODE中的值', () => {
    const statusMapKeys = Object.keys(GUEST_STATUS_MAP).map(Number)
    const statusCodeValues = Object.values(GUEST_STATUS_CODE)

    statusMapKeys.forEach((key) => {
      expect(statusCodeValues).toContain(key)
    })
  })
})

describe('admin STATUS_CODE', () => {
  it('每个值都应该是6位数字', () => {
    Object.values(ADMIN_STATUS_CODE).forEach((value) => {
      const valueStr = String(value)
      expect(valueStr).toHaveLength(6)
      expect(/^\d{6}$/.test(valueStr)).toBe(true)
    })
  })

  it('每个值的前3位应该是合法的HTTP状态码（100-599）', () => {
    Object.values(ADMIN_STATUS_CODE).forEach((value) => {
      const httpStatusCode = Math.floor(value / 1000)
      expect(httpStatusCode).toBeGreaterThanOrEqual(100)
      expect(httpStatusCode).toBeLessThanOrEqual(599)
    })
  })
})

describe('admin STATUS_MAP', () => {
  it('所有键都应该来自STATUS_CODE中的值', () => {
    const statusMapKeys = Object.keys(ADMIN_STATUS_MAP).map(Number)
    const statusCodeValues = Object.values(ADMIN_STATUS_CODE)

    statusMapKeys.forEach((key) => {
      expect(statusCodeValues).toContain(key)
    })
  })
})

describe('admin 与 guest STATUS_CODE', () => {
  it('各自的状态码（不含general）合并后应该是唯一的', () => {
    const combined = [
      ...Object.values(GUEST_STATUS_CODE),
      ...Object.values(ADMIN_STATUS_CODE),
    ].filter((value) => !Object.values(GENERAL_STATUS_CODE).includes(value as any))
    const uniqueValues = new Set(combined)
    expect(uniqueValues.size).toBe(combined.length)
  })
})
