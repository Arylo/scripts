import dayjs from 'dayjs'

export default function diffDate(date: string | Date | number, from?: string | Date | number) {
  const list = [
    [dayjs(from).diff(date, 'day'), '天前'],
    [dayjs(from).diff(date, 'hour'), '小时前'],
    [dayjs(from).diff(date, 'minute'), '分钟前'],
    [dayjs(from).diff(date, 'second'), '秒前'],
  ] as const

  for (const [diff, unit] of list) {
    if (diff > 0) return `${diff}${unit}`
  }

  return '刚刚'
}
