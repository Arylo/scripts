export const PAN_PERM_TYPE = {
  canDownload: 'canDownload',
  canUpload: 'canUpload',
  canDelete: 'canDelete',
} as const
export type PAN_PERM_TYPE = (typeof PAN_PERM_TYPE)[keyof typeof PAN_PERM_TYPE]

export const PAN_PERM_DEFAULT_VALUE = {
  [PAN_PERM_TYPE.canDownload]: false,
  [PAN_PERM_TYPE.canUpload]: false,
  [PAN_PERM_TYPE.canDelete]: false,
} as const
export type PAN_PERM_DEFAULT_VALUE = Record<PAN_PERM_TYPE, boolean>

export const CODE_PERM_TYPE = {
  canDownload: 'canDownload',
  canUpload: 'canUpload',
  canDelete: 'canDelete',
} as const
export type CODE_PERM_TYPE = (typeof CODE_PERM_TYPE)[keyof typeof CODE_PERM_TYPE]
