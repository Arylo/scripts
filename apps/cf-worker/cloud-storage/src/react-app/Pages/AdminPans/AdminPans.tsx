import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import RemovePanButton from '@/Components/Button/RemovePanButton'
import { Button } from '@/Components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/Components/ui/hover-card'
import { Spinner } from '@/Components/ui/spinner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { createAdminPan, fetchAdminPans } from '@/requests/fetchAdminPans'
import diffDate from '@/utils/diffDate'

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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>分享盘ID</TableHead>
              <TableHead className="w-14">状态</TableHead>
              <TableHead className="w-22">更新时间</TableHead>
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
                  <HoverCard>
                    <HoverCardTrigger>{diffDate(pan.updatedAt)}</HoverCardTrigger>
                    <HoverCardContent className="text-center">
                      {dayjs(pan.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>{diffDate(pan.createdAt)}</HoverCardTrigger>
                    <HoverCardContent className="text-center">
                      {dayjs(pan.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => nav(`/admin/pans/${pan.id}`)}
                  >
                    编辑
                  </Button>
                  <RemovePanButton
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
