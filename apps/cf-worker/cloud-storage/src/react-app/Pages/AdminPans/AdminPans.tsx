import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Button } from '@/Components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { fetchAdminPans } from '@/requests/fetchAdminPans'
import diffDate from '@/utils/diffDate'

export default function AdminPans() {
  const nav = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'pans'],
    queryFn: fetchAdminPans,
  })

  if (isLoading) {
    return <div className="p-6">正在加载 Pan 列表...</div>
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
          <Button variant="outline">新增分享盘</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pan ID</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pans.map((pan) => (
              <TableRow
                key={pan.id}
                className="hover:bg-muted cursor-pointer"
                onClick={() => nav(`/admin/pans/${pan.id}`)}
              >
                <TableCell>{pan.id}</TableCell>
                <TableCell>{pan.active ? '正常' : '停用'}</TableCell>
                <TableCell>{diffDate(pan.createdAt)}</TableCell>
                <TableCell>{diffDate(pan.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>共 {pans.length} 个 分享盘</TableCaption>
        </Table>
      </CardContent>
    </>
  )
}
