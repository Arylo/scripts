import { useMemo } from 'react'
import usePanInfo from './usePanInfo'

export default function usePanPerms(code: string) {
  const { data, isSuccess, ...rest } = usePanInfo(code)
  const newData = useMemo(() => {
    // 如果请求失败，默认没有任何权限
    if (!isSuccess) return { canDownload: false, canUpload: false, canDelete: false }
    return data?.perms ?? { canDownload: false, canUpload: false, canDelete: false }
  }, [isSuccess])
  const httpCode = useMemo(() => {
    if (!isSuccess) return -1
    return data?.code ?? -1
  }, [isSuccess])
  return {
    code: httpCode,
    data: newData,
    isSuccess,
    ...rest,
  }
}
