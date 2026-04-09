export const STATUS_CODE = {
  MISS_CODE: 400000,

  INVALID_CODE: 403000,
} as const

export const STATUS_MAP = {
  [STATUS_CODE.MISS_CODE]: 'Missing key code',
  [STATUS_CODE.INVALID_CODE]: 'Code is inactive',
} as const
