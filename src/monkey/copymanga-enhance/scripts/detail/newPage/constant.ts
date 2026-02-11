export enum DirectionMode {
  LTR = 'ltr',
  RTL = 'rtl',
  TTB = 'ttb',
}

export enum PageType {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
  LOADING = 'loading',
  WHITE_PAGE = 'white_page',
}

const GRID_CELL_TYPE = {
  PREV: 'PREV',
  NEXT: 'NEXT',
  SPACE: 'SPACE',
} as const

const GRID_MAP = (() => {
  const P = GRID_CELL_TYPE.PREV
  const N = GRID_CELL_TYPE.NEXT
  const S = GRID_CELL_TYPE.SPACE
  return [
    [P, P, P, P, P, P, P],
    [P, P, P, P, P, P, P],
    [P, P, S, S, N, N, N],
    [P, P, S, S, N, N, N],
    [P, P, S, S, N, N, N],
  ]
})()

export const GRID_COLUMN = Math.max(...GRID_MAP.map(row => row.length))
export const GRID_ROW = GRID_MAP.length
export const ACTION_GRID_MAP = GRID_MAP.reduce((acc, row, rowIndex) => {
  row.forEach((cell, cellIndex) => {
    acc[cell] = acc[cell] || []
    acc[cell].push(rowIndex * GRID_COLUMN + cellIndex + 1)
  })
  return acc
}, {} as Record<typeof GRID_CELL_TYPE[keyof typeof GRID_CELL_TYPE], number []>)
