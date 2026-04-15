import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router'
import BackButton from '@/components/Button/BackButton'
import CodeAddressButton from '@/components/Button/CodeAddressButton'
import DeleteCodeButton from '@/components/Button/DeleteCodeButton'
import EditButton from '@/components/Button/EditButton'
import { Button } from '@/components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import usePanPermsByPanId from '@/hooks/usePanPermsByPanId'
import { fetchAdminPanDetail } from '@/requests/fetchAdminPanDetail'
import { adminAxios } from '@/utils/adminFetch'
import diffDate from '@/utils/diffDate'
import { PAN_PERM_TYPE } from '../../../shared/constant/perm'
import AdminFileManagement from './AdminFileManagement'

export default function AdminPanDetail() {
  const { pan_id } = useParams<{ pan_id: string }>()
  const nav = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'pan-detail', pan_id],
    queryFn: () => fetchAdminPanDetail(pan_id!),
    enabled: Boolean(pan_id),
  })

  const queryClient = useQueryClient()

  const [{ canDownloadPerm, canDownload, canUploadPerm, canUpload, canDeletePerm, canDelete }] =
    usePanPermsByPanId(pan_id!)

  const { mutate: toggleCanDownload, isPending: isTogglingCanDownload } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canDownload)
      if (!canDownloadPerm || !('id' in canDownloadPerm)) {
        return fetch(`/api/admin/pans/${pan_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: PAN_PERM_TYPE.canDownload, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/perms/${canDownloadPerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', pan_id] })
    },
  })

  const { mutate: toggleCanUpload, isPending: isTogglingCanUpload } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canUpload)
      if (!canUploadPerm || !('id' in canUploadPerm)) {
        return fetch(`/api/admin/pans/${pan_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: PAN_PERM_TYPE.canUpload, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/perms/${canUploadPerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', pan_id] })
    },
  })

  const { mutate: toggleCanDelete, isPending: isTogglingCanDelete } = useMutation({
    mutationFn: () => {
      const newValue = JSON.stringify(!canDelete)
      if (!canDeletePerm || !('id' in canDeletePerm)) {
        return fetch(`/api/admin/pans/${pan_id}/perms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: PAN_PERM_TYPE.canDelete, value: newValue }),
        })
      }
      return fetch(`/api/admin/pans/${pan_id}/perms/${canDeletePerm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: newValue }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', pan_id] })
    },
  })

  const codes = data?.data?.codes || []
  const docs = data?.data?.docs || []
  const active = data?.data?.active ?? false

  const { mutate: createCode, isPending: isCreatingCode } = useMutation({
    mutationFn: () =>
      adminAxios.post<{ code: number; data: { code: { id: string } } }>(
        `/api/admin/pans/${pan_id}/codes`,
      ),
  })

  const { mutate: toggleActive, isPending: isTogglingActive } = useMutation({
    mutationFn: (newActive: boolean) =>
      fetch(`/api/admin/pans/${pan_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: newActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', pan_id] })
    },
  })

  if (isLoading) {
    return <div className="p-6">正在加载分享盘详情...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl font-semibold">分享盘详情</h1>
        </CardTitle>
        <CardAction>
          <BackButton onClick={() => nav('/admin/pans')}>返回列表</BackButton>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-4 flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto">
        <section>
          <h2 className="text-lg font-medium mb-2">分享盘基础属性</h2>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>状态</FieldLegend>
              <FieldDescription>
                当状态为为关闭时, 则无法访问该分享盘中的任何资源, 包括文件和提取页面
              </FieldDescription>
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
          <h2 className="text-lg font-medium mb-2">分享盘全局权限</h2>
          <FieldGroup className="flex flex-row">
            <Field orientation="horizontal" className="min-h-10">
              {isLoading || isTogglingCanDownload ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <>
                  <Checkbox
                    className="cursor-pointer"
                    checked={canDownload}
                    id="can-download"
                    disabled={isLoading || isTogglingCanDownload}
                    onCheckedChange={() => toggleCanDownload()}
                  />
                </>
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="can-download">
                  允许下载文件
                </FieldLabel>
                <FieldDescription className="text-xs">
                  {!canDownloadPerm && '(当前为默认权限)'}
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
                  id="can-upload"
                  disabled={isLoading || isTogglingCanUpload}
                  onCheckedChange={() => toggleCanUpload()}
                />
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="can-upload">
                  允许上传文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canUploadPerm && '(当前为默认权限)'}
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
                  id="can-delete"
                  disabled={isLoading || isTogglingCanDelete}
                  onCheckedChange={() => toggleCanDelete()}
                />
              )}
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="can-delete">
                  允许删除文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canDeletePerm && '(当前为默认权限)'}
                  {canDeletePerm &&
                    'id' in canDeletePerm &&
                    `最后修改在${diffDate(canDeletePerm.updatedAt)}`}
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </section>
        <section>
          <AdminFileManagement panId={pan_id!} docs={docs} isLoading={isLoading} />
        </section>
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">提取码列表</h2>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={isCreatingCode || isLoading}
              onClick={() => createCode()}
            >
              {isCreatingCode || isLoading ? <Spinner data-icon="inline-start" /> : null}
              新增提取码
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>提取码</TableHead>
                <TableHead className="w-14">状态</TableHead>
                <TableHead className="w-22">创建时间</TableHead>
                <TableHead className="w-14">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id} className="hover:bg-muted">
                  <TableCell>{code.value || '-'}</TableCell>
                  <TableCell>{code.active ? '启用' : '禁用'}</TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>{diffDate(code.createdAt)}</HoverCardTrigger>
                      <HoverCardContent className="text-center">
                        {dayjs(code.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    {code.value && <CodeAddressButton codeValue={code.value} />}
                    <EditButton onClick={() => nav(`/admin/pans/${pan_id}/codes/${code.id}`)} />
                    <DeleteCodeButton
                      panId={pan_id!}
                      codeId={code.id}
                      onSuccess={() =>
                        queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', pan_id] })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>共 {codes.length} 个提取码</TableCaption>
          </Table>
        </section>
      </CardContent>
    </>
  )
}
