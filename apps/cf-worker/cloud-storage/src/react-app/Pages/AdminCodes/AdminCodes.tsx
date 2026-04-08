import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
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
              <TableHead>所属 Pan</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow
                key={code.id}
                className="hover:bg-muted cursor-pointer"
                onClick={() => code.panId && nav(`/admin/pans/${code.panId}/codes/${code.id}`)}
              >
                <TableCell className="font-mono">{code.value ?? '-'}</TableCell>
                <TableCell>{code.panId ?? '-'}</TableCell>
                <TableCell>{code.active ? '正常' : '停用'}</TableCell>
                <TableCell>{diffDate(code.createdAt)}</TableCell>
                <TableCell>{diffDate(code.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>共 {codes.length} 个提取码</TableCaption>
        </Table>
      </CardContent>
    </>
  )
}
