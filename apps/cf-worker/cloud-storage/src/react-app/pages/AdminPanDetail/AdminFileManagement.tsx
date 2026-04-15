import { useMutation, useQueryClient } from '@tanstack/react-query'
import cc from 'classcat'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useDropArea } from 'react-use'
import DeleteFileButton from '@/components/Button/DeleteFileButton'
import EditButton from '@/components/Button/EditButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { AdminDocItem } from '@/requests/fetchAdminPanDetail'
import { adminAxios } from '@/utils/adminFetch'
import { formatFileSize } from '@/utils/formatFileSize'

interface AdminFileManagementProps {
  panId: string
  docs: AdminDocItem[]
  isLoading: boolean
}

const Spinner = lazy(() => import('@/components/ui/spinner').then((m) => ({ default: m.Spinner })))
const Plus = lazy(() => import('lucide-react').then((m) => ({ default: m.Plus })))

export default function AdminFileManagement({ panId, docs, isLoading }: AdminFileManagementProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingDoc, setEditingDoc] = useState<AdminDocItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editHighlight, setEditHighlight] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState<number | null>(null)

  const { mutate: uploadSingleFile, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const { data, status } = await adminAxios.post<{
        code: number
        data: {
          hash: string
          filename: string
          mimetype: string
          size: number
        }
        message: string
      }>(`/api/admin/pans/${panId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (status >= 300) {
        throw new Error(data.message || '上传文件失败')
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', panId] })
      // 继续上传队列中的下一个文件
      setUploadQueue((prev) => prev.slice(1))
      setCurrentUploadingIndex((prev) => (prev !== null ? prev + 1 : null))
    },
    onError: (error) => {
      console.error('文件上传失败:', error)
      // 出错时清空队列
      setUploadQueue([])
      setCurrentUploadingIndex(null)
    },
  })

  const { mutate: updateFile, isPending: isUpdating } = useMutation({
    mutationFn: (doc: AdminDocItem) =>
      adminAxios.put(`/api/admin/pans/${panId}/files/${doc.hash}`, {
        originalName: editName,
        highlight: editHighlight,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', panId] })
      setEditingDoc(null)
    },
  })

  // 处理拖拽区域
  const [bond, { over }] = useDropArea({
    onFiles: (files) => {
      // 将所有拖拽的文件添加到上传队列
      setUploadQueue((prev) => [...prev, ...Array.from(files)])
    },
  })

  // 监听上传队列变化，自动上传
  useEffect(() => {
    if (uploadQueue.length > 0 && !isUploading && currentUploadingIndex !== null) {
      uploadSingleFile(uploadQueue[0])
    }
  }, [uploadQueue, isUploading, currentUploadingIndex, uploadSingleFile])

  // 初始化上传（当第一次添加文件到队列时）
  useEffect(() => {
    if (uploadQueue.length > 0 && currentUploadingIndex === null && !isUploading) {
      setCurrentUploadingIndex(0)
    }
  }, [uploadQueue, currentUploadingIndex, isUploading])

  const handleEditClick = (doc: AdminDocItem) => {
    setEditingDoc(doc)
    setEditName(doc.originalName)
    setEditHighlight(doc.highlight)
  }

  const handleSaveEdit = () => {
    if (editingDoc) {
      updateFile(editingDoc)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // 添加所有选中的文件到上传队列
      setUploadQueue((prev) => [...prev, ...Array.from(files)])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const uploadProgress =
    uploadQueue.length > 0 && currentUploadingIndex !== null
      ? `正在上传第${currentUploadingIndex}个(还有${uploadQueue.length}个)`
      : null

  return (
    <>
      <section>
        <h2 className="text-lg font-medium mb-4">文件管理</h2>

        {/* 上传区域 */}
        <Empty
          {...bond}
          className={cc([
            'border-2 transition-colors',
            isUploading || uploadProgress
              ? 'border-solid'
              : over
                ? 'border-dotted'
                : 'border-dashed',
            isUploading || uploadProgress ? 'cursor-progress' : 'cursor-pointer',
          ])}
          onClick={() => fileInputRef.current?.click()}
        >
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-transparent">
              {isUploading || uploadProgress ? (
                <>
                  <Suspense>
                    <Spinner className="size-9 text-muted-foreground" />
                  </Suspense>
                </>
              ) : (
                <>
                  <Suspense>
                    <Plus className="size-9 text-muted-foreground" />
                  </Suspense>
                </>
              )}
            </EmptyMedia>
            <EmptyTitle>
              {isUploading || uploadProgress ? `正在上传...` : `拖拽文件到此或点击选择`}
            </EmptyTitle>
            {uploadProgress && <EmptyDescription>{uploadProgress}</EmptyDescription>}
          </EmptyHeader>
          <EmptyContent>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              multiple
              disabled={isUploading || isLoading}
            />
          </EmptyContent>
        </Empty>

        {/* 文件列表表格 */}
        {docs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead className="w-20">文件大小</TableHead>
                <TableHead className="w-14">是否高亮</TableHead>
                <TableHead className="w-22">最后修改时间</TableHead>
                <TableHead className="w-22">创建时间</TableHead>
                <TableHead className="w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted">
                  <TableCell className="max-w-xs truncate" title={doc.originalName}>
                    {doc.originalName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(doc.size)}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={doc.highlight} readOnly className="cursor-default" />
                  </TableCell>
                  <TableCell>
                    <DateHover value={doc.updatedAt} />
                  </TableCell>
                  <TableCell>
                    <DateHover value={doc.createdAt} />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <EditButton
                      disabled={isUpdating || isLoading}
                      onClick={() => handleEditClick(doc)}
                    />
                    <DeleteFileButton
                      panId={panId}
                      fileHash={doc.hash}
                      disabled={isUpdating || isLoading}
                      onSuccess={() =>
                        queryClient.invalidateQueries({ queryKey: ['admin', 'pan-detail', panId] })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>共 {docs.length} 个文件</TableCaption>
          </Table>
        ) : (
          <Empty>
            <EmptyDescription>暂无文件</EmptyDescription>
          </Empty>
        )}
      </section>

      {/* 编辑文件对话框 */}
      <Dialog open={!!editingDoc}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>编辑文件</DialogTitle>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-name">文件名</Label>
                <Input
                  id="file-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="输入文件名"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="file-highlight"
                  checked={editHighlight}
                  onCheckedChange={(checked) => setEditHighlight(checked === true)}
                />
                <Label htmlFor="file-highlight" className="cursor-pointer">
                  标记为高亮
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" />}
              onClick={() => setEditingDoc(null)}
              disabled={isUpdating}
            >
              取消
            </DialogClose>
            <Button onClick={handleSaveEdit} disabled={isUpdating || !editName.trim()}>
              {isUpdating ? <Spinner data-icon="inline-start" /> : null}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
