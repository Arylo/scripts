import parseConstant from '../utils/parseConstant'
import {
  findMatchingRecord,
  findRecordByBefore,
  getTodayDate,
  loadRecords,
  saveRecords,
} from './storage'

export default () => {
  const url = new URL(location.href)

  // Guard：ordering 不存在或为 -datetime_updated
  const ordering = url.searchParams.get('ordering')
  if (ordering !== null && ordering !== '-datetime_updated') return

  const theme = url.searchParams.get('theme')

  // Guard：必须是第一个 dd（时间排序）处于 active 状态
  const activeSortLink = document.querySelector('.classify-right a:has(dd:first-child.active)')
  if (!activeSortLink) return

  // 提取所有 comic ID（按 DOM 顺序）
  const links = document.querySelectorAll<HTMLAnchorElement>(
    '.exemptComic-box > .exemptComic_Item > .exemptComicItem-txt a',
  )
  const { comicIds, items } = Array.from(links).reduce<{
    comicIds: string[]
    items: Element[]
  }>(
    (acc, a) => {
      const { comic } = parseConstant(a.getAttribute('href') || '')
      if (comic) {
        acc.comicIds.push(comic)
        // 回溯到 .exemptComic_Item 用于后续追加标签
        acc.items.push(a.closest('.exemptComic_Item')!)
      }
      return acc
    },
    { comicIds: [], items: [] },
  )

  if (comicIds.length === 0) return

  const records = loadRecords()
  const today = getTodayDate()
  const recordsKey = theme ? `${today}|${theme}` : today

  // --- Step 2a：快照记录（仅首页 / 无 offset 或 offset=0） ---
  const offset = new URL(location.href).searchParams.get('offset')
  if (offset === null || offset === '0') {
    const latest = comicIds[0]
    const after = comicIds.slice(1, 4)
    const matchIds: [string, ...string[]] = [latest, ...after]

    if (!findMatchingRecord(records, matchIds)) {
      records[recordsKey] = { latest, after, before: [] }
    }
  }

  // --- Step 2b：匹配打标签（始终执行） ---
  for (let i = 0; i < comicIds.length; i++) {
    const item = items[i]

    if (i + 3 < comicIds.length) {
      // 有足够的后续漫画 → 正常匹配
      const ids: [string, ...string[]] = [
        comicIds[i],
        comicIds[i + 1],
        comicIds[i + 2],
        comicIds[i + 3],
      ]
      const match = findMatchingRecord(records, ids)
      if (match) {
        appendTag(item, match.date)

        // 更新 before：取当前位置前实际存在的 comic ID（最多 3 个）
        const beforeStart = Math.max(0, i - 3)
        const newBefore = comicIds.slice(beforeStart, i)
        if (
          newBefore.length !== match.record.before.length ||
          !newBefore.every((id, idx) => id === match.record.before[idx])
        ) {
          match.record.before = newBefore
        }
      }
    } else {
      // 末尾不够 3 个后续 → 用 before 回溯匹配
      const match = findRecordByBefore(records, comicIds[i])
      if (match) {
        appendTag(item, match.date)
      }
    }
  }

  // 保存可能被修改的 records（before 更新、新快照）
  saveRecords(records)
}

/** 在 .exemptComic_Item 末尾追加收录标签 */
function appendTag(item: Element, date: string) {
  // 避免重复添加
  if (item.querySelector('.copymanga-list-record-tag')) return
  const tag = document.createElement('div')
  tag.style.cssText = `text-align: center; font-size: 12px; color: #888; line-height: 12px;`
  tag.className = 'copymanga-list-record-tag'
  tag.textContent = `--${date}收录到这里--`
  item.appendChild(tag)
}
