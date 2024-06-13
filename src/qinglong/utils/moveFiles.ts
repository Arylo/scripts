import { mv, ls } from '@js-sh/js-sh'

export const moveFiles = (targetFilters: string[], targetPath: string) => {

  const pendingFilepaths = targetFilters.reduce<string[]>((list, filter) => list.concat(ls(filter)), [])

  if (pendingFilepaths.length === 0) return false

  console.log(pendingFilepaths)

  pendingFilepaths.forEach(p => mv(p, targetPath))
}