export interface AuthConfig {
  prefixes: string[]
  actives: Array<{
    name: string
    displayName: string
  }>
}

export interface FileInfo {
  size: number
  name: string
  key: string
  mime: string
  displayName?: string
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

export type ListFilesResponseBody = ApiResponse<FileInfo[]> & { size: number }
