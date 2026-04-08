export interface FileInfo {
  id: string
  hash: string
  mimetype: string
  originalName: string
  highlight: boolean
  size: number
  createdAt: number
  updatedAt: number
}

export interface ApiResponse<T> {
  code: number
  size?: number
  data?: T
  error?: string
  message?: string
}

export interface ListFilesRequestBody {
  pwd: string
}

export type PanInfoResponseBody = ApiResponse<FileInfo[]> & {
  perms: { canDownload: boolean; canUpload: boolean }
  total: number
}
