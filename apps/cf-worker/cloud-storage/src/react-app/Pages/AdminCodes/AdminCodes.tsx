import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import RemoveCodeButton from '@/Components/Button/RemoveCodeButton'
import { Button } from '@/Components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/Components/ui/hover-card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { fetchAdminCodes } from '@/requests/fetchAdminCodes'
import diffDate from '@/utils/diffDate'

export default function AdminCodes() {
  const nav = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'codes'],
    queryFn: fetchAdminCodes,
  })

  if (isLoading) {
    return <div className="p-6">正在加载提取码列表...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>
  }

  const codes = data?.data || []

  return (
    <>
      <CardHeader>
        <CardTitle>全部提取码</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>提取码</TableHead>
              <TableHead>所属分享盘</TableHead>
              <TableHead className="w-14">状态</TableHead>
              <TableHead className="w-22">更新时间</TableHead>
              <TableHead className="w-22">创建时间</TableHead>
              <TableHead className="w-14">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id} className="hover:bg-muted">
                <TableCell className="font-mono">{code.value ?? '-'}</TableCell>
                <TableCell>{code.panId ?? '-'}</TableCell>
                <TableCell>{code.active ? '正常' : '停用'}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>{diffDate(code.updatedAt)}</HoverCardTrigger>
                    <HoverCardContent className="text-center">
                      {dayjs(code.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>{diffDate(code.createdAt)}</HoverCardTrigger>
                    <HoverCardContent className="text-center">
                      {dayjs(code.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {code.panId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => nav(`/admin/pans/${code.panId}/codes/${code.id}`)}
                    >
                      编辑
                    </Button>
                  )}
                  {code.panId && (
                    <RemoveCodeButton
                      panId={code.panId}
                      codeId={code.id}
                      onSuccess={() =>
                        queryClient.invalidateQueries({ queryKey: ['admin', 'codes'] })
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>共 {codes.length} 个提取码</TableCaption>
        </Table>
      </CardContent>
    </>
  )
}
