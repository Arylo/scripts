import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import usePanPermsByPanId from '@/hooks/usePanPermsByPanId'
import { fetchAdminPanDetail } from '@/requests/fetchAdminPanDetail'
import diffDate from '@/utils/diffDate'
import { PAN_PERM_TYPE } from '../../../shared/constant'

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
  const active = data?.data?.active ?? false

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
    return <div className="p-6">正在加载 Pan 详情...</div>
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
          <Button variant="outline" className="cursor-pointer" onClick={() => nav('/admin/pans')}>
            返回列表
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-4 flex flex-col gap-4">
        <section>
          <h2 className="text-lg font-medium mb-2">分享盘基础属性</h2>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>状态</FieldLegend>
              <FieldDescription>
                当状态为为开启时, 则无法访问该分享盘中的任何资源, 包括文件和提取页面
              </FieldDescription>
              <FieldGroup>
                <Field orientation="horizontal" className="min-h-10">
                  <RadioGroup
                    value={active ? 'enabled' : 'disabled'}
                    disabled={isLoading || isTogglingActive}
                    onValueChange={(v) => toggleActive(v === 'enabled')}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="enabled"></RadioGroupItem>
                      <Label>开启</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="disabled"></RadioGroupItem>
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
              <Checkbox
                className="cursor-pointer"
                checked={canDownload}
                id="can-download"
                disabled={isLoading || isTogglingCanDownload}
                onCheckedChange={() => toggleCanDownload()}
              />
              <FieldContent>
                <FieldLabel className="cursor-pointer" htmlFor="can-download">
                  允许下载文件
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  {!canDownloadPerm && '(当前为默认权限)'}
                  {canDownloadPerm &&
                    'id' in canDownloadPerm &&
                    `最后修改在${diffDate(canDownloadPerm.updatedAt)}`}
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="min-h-10">
              <Checkbox
                className="cursor-pointer"
                checked={canUpload}
                id="can-upload"
                disabled={isLoading || isTogglingCanUpload}
                onCheckedChange={() => toggleCanUpload()}
              />
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
              <Checkbox
                className="cursor-pointer"
                checked={canDelete}
                id="can-delete"
                disabled={isLoading || isTogglingCanDelete}
                onCheckedChange={() => toggleCanDelete()}
              />
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
          <h2 className="text-lg font-medium mb-2">提取码列表</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code 值</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow
                  key={code.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => nav(`/admin/pans/${pan_id}/codes/${code.id}`)}
                >
                  <TableCell>{code.value || '-'}</TableCell>
                  <TableCell>{code.active ? '启用' : '禁用'}</TableCell>
                  <TableCell>{diffDate(code.createdAt)}</TableCell>
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
