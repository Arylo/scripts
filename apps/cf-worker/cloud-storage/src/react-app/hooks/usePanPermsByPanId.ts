import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchAdminPanDetail } from '@/requests/fetchAdminPanDetail'
import { PAN_PERM_DEFAULT_VALUE, PAN_PERM_TYPE } from '../../shared/constant'

export default function usePanPermsByPanId(panId: string) {
  const { data, isSuccess } = useQuery({
    queryKey: ['admin', 'pan-detail', panId],
    queryFn: () => fetchAdminPanDetail(panId),
    enabled: Boolean(panId),
  })
  const canDownloadPerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    const perm = data?.data?.perms.find((perm) => perm.type === PAN_PERM_TYPE.canDownload)
    return perm
  }, [data, isSuccess])
  const canDownload = useMemo(() => {
    if (canDownloadPerm && canDownloadPerm.value.length) {
      return JSON.parse(canDownloadPerm.value)
    }
    return PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canDownload]
  }, [canDownloadPerm])

  const canUploadPerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    const perm = data?.data?.perms.find((perm) => perm.type === PAN_PERM_TYPE.canUpload)
    return perm
  }, [data, isSuccess])
  const canUpload = useMemo(() => {
    if (canUploadPerm && canUploadPerm.value.length) {
      return JSON.parse(canUploadPerm.value)
    }
    return PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canUpload]
  }, [canUploadPerm])

  const canDeletePerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    const perm = data?.data?.perms.find((perm) => perm.type === PAN_PERM_TYPE.canDelete)
    return perm
  }, [data, isSuccess])
  const canDelete = useMemo(() => {
    if (canDeletePerm && canDeletePerm.value.length) {
      return JSON.parse(canDeletePerm.value)
    }
    return PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canDelete]
  }, [canDeletePerm])

  return [
    { canDownloadPerm, canDownload, canUploadPerm, canUpload, canDeletePerm, canDelete },
  ] as const
}
