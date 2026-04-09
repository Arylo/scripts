import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/Components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Checkbox } from '@/Components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/Components/ui/field'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Spinner } from '@/Components/ui/spinner'
import usePanPermsByPanId from '@/hooks/usePanPermsByPanId'
import { fetchAdminCodeDetail } from '@/requests/fetchAdminCodeDetail'
import diffDate from '@/utils/diffDate'
import { CODE_PERM_TYPE } from '../../../shared/constant'

export default function AdminCodeDetail() {
  const { pan_id, code_id } = useParams<{ pan_id: string; code_id: string }>()
  const nav = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['admin', 'code-detail', pan_id, code_id],
    queryFn: () => fetchAdminCodeDetail(pan_id!, code_id!),
    enabled: Boolean(pan_id) && Boolean(code_id),
  })

  const active = data?.data?.active ?? false

  const { mutate: toggleActive, isPending: isTogglingActive } = useMutation({
    mutationFn: (newActive: boolean) =>
      fetch(`/api/admin/pans/${pan_id}/codes/${code_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: newActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'code-detail', pan_id, code_id] })
    },
  })

  const [{ canDownload: canPanDownload, canUpload: canPanUpload, canDelete: canPanDelete }] =
    usePanPermsByPanId(pan_id!)

  const canDownloadPerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    return data?.data?.perms.find((p) => p.type === CODE_PERM_TYPE.canDownload)
  }, [data, isSuccess])
  const canDownload = useMemo(() => {
    if (canDownloadPerm && 'value' in canDownloadPerm && canDownloadPerm.value.length) {
      return JSON.parse(canDownloadPerm.value)
    }
    return canPanDownload
  }, [canDownloadPerm, canPanDownload])
  const { mutate: toggleCanDownload, isPending: isTogglingCanDownload } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canDownload)
      if (!canDownloadPerm || !('id' in canDownloadPerm)) {
        return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: CODE_PERM_TYPE.canDownload, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms/${canDownloadPerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'code-detail', pan_id, code_id] })
    },
  })

  const canUploadPerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    return data?.data?.perms.find((p) => p.type === CODE_PERM_TYPE.canUpload)
  }, [data, isSuccess])
  const canUpload = useMemo(() => {
    if (canUploadPerm && 'value' in canUploadPerm && canUploadPerm.value.length) {
      return JSON.parse(canUploadPerm.value)
    }
    return canPanUpload
  }, [canUploadPerm, canPanUpload])
  const { mutate: toggleCanUpload, isPending: isTogglingCanUpload } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canUpload)
      if (!canUploadPerm || !('id' in canUploadPerm)) {
        return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: CODE_PERM_TYPE.canUpload, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms/${canUploadPerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'code-detail', pan_id, code_id] })
    },
  })

  const canDeletePerm = useMemo(() => {
    if (!isSuccess) return { value: 'false' }
    return data?.data?.perms.find((p) => p.type === CODE_PERM_TYPE.canDelete)
  }, [data, isSuccess])
  const canDelete = useMemo(() => {
    if (canDeletePerm && 'value' in canDeletePerm && canDeletePerm.value.length) {
      return JSON.parse(canDeletePerm.value)
    }
    return canPanDelete
  }, [canDeletePerm, canPanDelete])
  const { mutate: toggleCanDelete, isPending: isTogglingCanDelete } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canDelete)
      if (!canDeletePerm || !('id' in canDeletePerm)) {
        return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: CODE_PERM_TYPE.canDelete, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/codes/${code_id}/perms/${canDeletePerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'code-detail', pan_id, code_id] })
    },
  })

  if (isLoading) {
    return <div className="p-6">正在加载 Code 详情...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl font-semibold">
            提取码详情
            {data?.data?.value && (
              <span className="ml-2 font-mono text-base text-muted-foreground">
                ({data.data.value})
              </span>
            )}
          </h1>
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => nav(`/admin/pans/${pan_id}`)}
          >
            返回分享盘
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-4 flex flex-col gap-4">
        <section>
          <h2 className="text-lg font-medium mb-2">提取码基础属性</h2>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>状态</FieldLegend>
              <FieldDescription>状态为关闭时，该提取码将无法用于访问分享盘</FieldDescription>
              <FieldGroup>
                <Field orientation="horizontal" className="min-h-10">
                  <RadioGroup
                    value={active ? 'enabled' : 'disabled'}
                    disabled={isLoading || isTogglingActive}
                    onValueChange={(v) => toggleActive(v === 'enabled')}
                  >
                    <div className="flex items-center gap-2">
                      {isLoading || isTogglingActive ? (
                        <Spinner data-icon="inline-start" />
                      ) : (
                        <RadioGroupItem value="enabled" className="cursor-pointer" />
                      )}
                      <Label>开启</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoading || isTogglingActive ? (
                        <Spinner data-icon="inline-start" />
                      ) : (
                        <RadioGroupItem value="disabled" className="cursor-pointer" />
                      )}
                      <Label>关闭</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </section>
        <section>
          <h2 className="text-lg font-medium mb-2">提取码权限</h2>
          <FieldGroup className="flex flex-row">
            <Field orientation="horizontal" className="min-h-10">
              {isLoading || isTogglingCanDownload ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Checkbox
                  className="cursor-pointer"
                  checked={canDownload}
                  id="code-can-download"
                  disabled={isLoading || isTogglingCanDownload}
                  onCheckedChange={() => toggleCanDownload()}
                />
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="code-can-download">
                  允许下载文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canDownloadPerm && '(当前为分享盘权限)'}
                  {canDownloadPerm &&
                    'id' in canDownloadPerm &&
                    `最后修改在${diffDate(canDownloadPerm.updatedAt)}`}
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="min-h-10">
              {isLoading || isTogglingCanUpload ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Checkbox
                  className="cursor-pointer"
                  checked={canUpload}
                  id="code-can-upload"
                  disabled={isLoading || isTogglingCanUpload}
                  onCheckedChange={() => toggleCanUpload()}
                />
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="code-can-upload">
                  允许上传文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canUploadPerm && '(当前为分享盘权限)'}
                  {canUploadPerm &&
                    'id' in canUploadPerm &&
                    `最后修改在${diffDate(canUploadPerm.updatedAt)}`}
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="min-h-10">
              {isLoading || isTogglingCanDelete ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Checkbox
                  className="cursor-pointer"
                  checked={canDelete}
                  id="code-can-delete"
                  disabled={isLoading || isTogglingCanDelete}
                  onCheckedChange={() => toggleCanDelete()}
                />
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="code-can-delete">
                  允许删除文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canDeletePerm && '(当前为分享盘权限)'}
                  {canDeletePerm &&
                    'id' in canDeletePerm &&
                    `最后修改在${diffDate(canDeletePerm.updatedAt)}`}
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </section>
      </CardContent>
    </>
  )
}
