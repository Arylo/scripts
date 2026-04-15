export const MODE = {
  LIST: 'LIST',
  UPLOAD: 'UPLOAD',
  DETAIL: 'DETAIL',
} as const
export type MODE = (typeof MODE)[keyof typeof MODE]
