import { STATUS_CODE as GENERAL_STATUS_CODE, STATUS_MAP as GENERAL_STATUS_MAP } from './general'

export const STATUS_CODE = {
  ...GENERAL_STATUS_CODE,
  FILE_UPDATE_SUCCESS: 200002,
} as const

export const STATUS_MAP = {
  ...GENERAL_STATUS_MAP,
  [STATUS_CODE.FILE_UPDATE_SUCCESS]: 'Update File success',
} as const
