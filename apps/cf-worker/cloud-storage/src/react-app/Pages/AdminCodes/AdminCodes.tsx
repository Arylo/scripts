import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import CodeAddressButton from '@/Components/Button/CodeAddressButton'
import DeleteCodeButton from '@/Components/Button/DeleteCodeButton'
import EditButton from '@/Components/Button/EditButton'
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
import DateHover from './DateHover'

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
      <CardContent className="mt-4 flex flex-1 flex-col min-h-0 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>提取码</TableHead>
              <TableHead>所属分享盘</TableHead>
              <TableHead className="w-14">状态</TableHead>
              <TableHead className="w-22">最后修改时间</TableHead>
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
                  <DateHover value={code.updatedAt} />
                </TableCell>
                <TableCell>
                  <DateHover value={code.createdAt} />
                </TableCell>
                <TableCell className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {code.value && <CodeAddressButton codeValue={code.value} />}
                  {code.panId && (
                    <EditButton onClick={() => nav(`/admin/pans/${code.panId}/codes/${code.id}`)} />
                  )}
                  {code.panId && (
                    <DeleteCodeButton
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
