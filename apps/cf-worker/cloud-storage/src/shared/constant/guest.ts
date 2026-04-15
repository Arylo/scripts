import { STATUS_CODE as GENERAL_STATUS_CODE, STATUS_MAP as GENERAL_STATUS_MAP } from './general'

export const STATUS_CODE = {
  ...GENERAL_STATUS_CODE,
  MISS_CODE: 400000,
  INVALID_CODE: 403000,
} as const

export const STATUS_MAP = {
  ...GENERAL_STATUS_MAP,
  [STATUS_CODE.MISS_CODE]: 'Missing key code',
  [STATUS_CODE.INVALID_CODE]: 'Code is inactive',
} as const
