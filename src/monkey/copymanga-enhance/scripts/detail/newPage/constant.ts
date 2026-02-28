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

export const GRID_CELL_TYPE = {
  PREV: 'PREV',
  NEXT: 'NEXT',
  SPACE: 'SPACE',
} as const

type GRID_CELL_TYPE = (typeof GRID_CELL_TYPE)[keyof typeof GRID_CELL_TYPE]

const fill = (value: GRID_CELL_TYPE, length: number) => Array.from({ length }, () => value)

export const GRID_MAP = (() => {
  const P = GRID_CELL_TYPE.PREV
  const N = GRID_CELL_TYPE.NEXT
  const S = GRID_CELL_TYPE.SPACE
  return [
    [...fill(P, 8)],
    [...fill(P, 8)],
    [...fill(P, 8)],
    [...fill(P, 3), ...fill(S, 2), ...fill(N, 3)],
    [...fill(P, 3), ...fill(S, 2), ...fill(N, 3)],
    [...fill(P, 3), ...fill(S, 2), ...fill(N, 3)],
    [...fill(P, 3), ...fill(S, 2), ...fill(N, 3)],
  ]
})()
