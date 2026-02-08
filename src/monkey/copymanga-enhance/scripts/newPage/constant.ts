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

/**
 * ```markdown
 * |1 |2 |3 |4 |5 |6 |7 |
 * |8 |9 |10|11|12|13|14|
 * |15|16|17|18|19|20|21|
 * |22|23|24|25|26|27|28|
 * |29|30|31|32|33|34|35|
 * ```
 */
export const GRID_COLUMN = 7
export const GRID_ROW = 5
export const ACTION_GRID_MAP = {
  PREV: [
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17,
    22, 23, 24,
    29, 30, 31,
  ],
  NEXT: [
    19, 20, 21,
    26, 27, 28,
    33, 34, 35,
  ],
}
