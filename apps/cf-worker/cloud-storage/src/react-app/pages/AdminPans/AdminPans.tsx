import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import DeletePanButton from '@/components/Button/DeletePanButton'
import EditButton from '@/components/Button/EditButton'
import { Button } from '@/components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import DateHover from '@/pages/AdminCodes/DateHover'
import { createAdminPan, fetchAdminPans } from '@/requests/fetchAdminPans'

export default function AdminPans() {
  const nav = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'pans'],
    queryFn: fetchAdminPans,
  })

  const { mutate: handleCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminPan,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pans'] })
      nav(`/admin/pans/${res.data!.id}`)
    },
  })

  if (isLoading) {
    return <div className="p-6">正在加载分享盘列表...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>
  }

  const pans = data?.data || []

  return (
    <>
      <CardHeader>
        <CardTitle>全部分享盘</CardTitle>
        <CardAction>
          <Button
            variant="outline"
            disabled={isCreating || isLoading}
            onClick={() => handleCreate()}
            className="cursor-pointer"
          >
            {isCreating && <Spinner data-icon="inline-start" />}
            新增分享盘
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-4 flex flex-1 flex-col min-h-0 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>分享盘ID</TableHead>
              <TableHead className="w-14">状态</TableHead>
              <TableHead className="w-22">最后修改时间</TableHead>
              <TableHead className="w-22">创建时间</TableHead>
              <TableHead className="w-22">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pans.map((pan) => (
              <TableRow key={pan.id} className="hover:bg-muted">
                <TableCell>{pan.id}</TableCell>
                <TableCell>{pan.active ? '正常' : '停用'}</TableCell>
                <TableCell>
                  <DateHover value={pan.updatedAt} />
                </TableCell>
                <TableCell>
                  <DateHover value={pan.createdAt} />
                </TableCell>
                <TableCell className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <EditButton onClick={() => nav(`/admin/pans/${pan.id}`)} />
                  <DeletePanButton
                    panId={pan.id}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin', 'pans'] })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>共 {pans.length} 个 分享盘</TableCaption>
        </Table>
      </CardContent>
    </>
  )
}
