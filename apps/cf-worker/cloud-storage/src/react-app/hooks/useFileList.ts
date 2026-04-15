import { useMemo } from 'react'
import usePanInfo from './usePanInfo'

export default function useFileList(code: string) {
  const { data, isSuccess, ...rest } = usePanInfo(code)
  const newData = useMemo(() => {
    if (!isSuccess) return []
    return data?.data ?? []
  }, [isSuccess])
  const httpCode = useMemo(() => {
    if (!isSuccess) return -1
    return data?.code ?? -1
  }, [isSuccess])
  return {
    code: httpCode,
    data: newData,
    total: data?.total ?? 0,
    isSuccess,
    ...rest,
  }
}
