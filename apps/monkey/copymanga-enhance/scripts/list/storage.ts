import { GM_getValue, GM_setValue } from '@scripts/gm-polyfill'

const STORAGE_KEY = 'copymanga.list.records'

/** 某一天的收录快照 */
export interface DayRecord {
  /** 排名第一的 comic ID */
  latest: string
  /** 紧随其后的 3 个 comic ID（最多 3 个，不足则少） */
  after: string[]
  /** 之前的 3 个 comic ID（从匹配时回填，最多 3 个） */
  before: string[]
}

/** 全部记录，key 为 YYYY-MM-DD */
export type Records = Record<string, DayRecord>

/** 获取今日日期字符串 YYYY-MM-DD */
export const getTodayDate = (): string => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** 加载全部记录 */
export const loadRecords = (): Records => {
  return (GM_getValue(STORAGE_KEY, null) || {}) as Records
}

/** 保存全部记录 */
export const saveRecords = (records: Records): void => {
  GM_setValue(STORAGE_KEY, records)
}

/**
 * 用四元组 [latest, after0, after1, after2] 匹配已有记录
 * 返回匹配到的日期和记录，若无则返回 null
 */
export const findMatchingRecord = (
  records: Records,
  ids: [string, ...string[]],
): { date: string; record: DayRecord } | null => {
  for (const [date, record] of Object.entries(records)) {
    const expected = [record.latest, ...record.after]
    // 按实际存在的 after 数量比较，避免长度不匹配
    if (expected.length !== ids.length) continue
    if (expected.every((id, idx) => id === ids[idx])) {
      return { date, record }
    }
  }
  return null
}

/**
 * 在记录的 before 数组中查找 comicId
 * 返回匹配到的日期和记录，若无则返回 null
 */
export const findRecordByBefore = (
  records: Records,
  comicId: string,
): { date: string; record: DayRecord } | null => {
  for (const [date, record] of Object.entries(records)) {
    if (record.before.includes(comicId)) {
      return { date, record }
    }
  }
  return null
}
