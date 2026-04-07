/**
 * 格式化文件大小为人类可读的格式
 * @param size 文件大小（字节）
 * @param decimals 保留的小数位数，默认为2
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(size: number, decimals: number = 2): string {
  if (size === 0) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  // 计算应该使用的单位索引
  // 当 size >= 1000 时使用下一个单位（例如：1000B -> 0.98KB）
  let i = 0
  while (size >= 1000 && i < sizes.length - 1) {
    size /= k
    i++
  }

  // 格式化数字，保留指定的小数位数
  const formattedSize = size.toFixed(dm)
  // 移除不必要的尾随零和小数点
  const cleanSize = formattedSize.replace(/(\.0*|(?<=\.\d*?)0*)$/, '')

  return cleanSize + ' ' + sizes[i]
}
