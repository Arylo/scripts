import cc from 'classcat'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Card from '@/Components/Card/Card'
import { Button } from '@/Components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import diffDate from '@/utils/diffDate'
import useFileList from '../../hooks/useFileList'
import usePanPerms from '../../hooks/usePanPerms'
import { formatFileSize } from '../../utils/formatFileSize'
import UploadFiles from './Components/UploadFiles'
import { MODE } from './constant'

const Content = React.lazy(() => import('./Components/Content'))

export default function Detail() {
  const { code, fileHash } = useParams<{ code: string; fileHash: string }>()
  const [mode, setMode] = useState<MODE>(MODE.LIST)
  useEffect(() => {
    if (fileHash) setMode(MODE.DETAIL)
    else setMode(MODE.LIST)
  }, [fileHash])

  const { data: files, total, isLoading } = useFileList(code!)
  const { data: perms } = usePanPerms(code!)

  const nav = useNavigate()
  const goList = () => {
    nav(`/pan/${code}`)
  }
  const goDetail = (fileHash: string) => {
    nav(`/pan/${code}/${fileHash}`)
  }
  const goUpload = () => {
    if (perms.canUpload) setMode(MODE.UPLOAD)
  }

  const fileInfo = useMemo(() => {
    return files?.find((file) => file.hash === fileHash)
  }, [fileHash, files])

  const handleDownload = () => {
    if (!fileInfo || !perms.canDownload) return
    const link = document.createElement('a')
    link.href = `/api/raw/${fileInfo.hash}`
    link.download = fileInfo.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <div>正在获取分享盘...</div>
  }

  return (
    <div className="p-6 h-screen w-screen flex flex-col gap-2">
      <div className="flex flex-1 min-h-0 gap-4">
        <Card
          className={cc([
            'overflow-hidden flex flex-col gap-2 grow-1',
            {
              'max-w-[320px]': mode !== MODE.LIST,
            },
          ])}
        >
          <div className="flex flex-row-reverse">
            <Button
              variant="outline"
              className="cursor-pointer"
              size="lg"
              disabled={!perms.canUpload}
              onClick={() => goUpload()}
            >
              上传文件
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead
                  className={cc(['w-[120px] text-center', { hidden: mode !== MODE.LIST }])}
                >
                  文件大小
                </TableHead>
                <TableHead
                  className={cc(['w-[120px] text-center', { hidden: mode !== MODE.LIST }])}
                >
                  更新时间
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files?.map((file) => (
                <TableRow key={file.hash} onClick={() => goDetail(file.hash)}>
                  <TableCell>{file.originalName}</TableCell>
                  <TableCell className={cc([{ hidden: mode !== MODE.LIST }])}>
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className={cc([{ hidden: mode !== MODE.LIST }])}>
                    {diffDate(file.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>共 {total} 个文件</TableCaption>
          </Table>
        </Card>
        <Card
          className={cc([
            'overflow-hidden flex flex-col gap-2 grow-1',
            {
              hidden: mode === MODE.LIST,
            },
          ])}
        >
          <div className="flex flex-row justify-between">
            <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => goList()}>
              <span className="text-lg">←</span>
              <span>返回列表</span>
            </Button>
            {mode === MODE.DETAIL && (
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer"
                onClick={() => handleDownload()}
                disabled={!perms.canDownload}
              >
                <span className="text-lg">↓</span>
                <span>下载</span>
              </Button>
            )}
          </div>
          <React.Suspense fallback={'正在加载组件中...'}>
            {mode === MODE.DETAIL && <Content fileInfo={fileInfo!} />}
            {mode === MODE.UPLOAD && (
              <UploadFiles
                onUploadSuccess={() => setMode(MODE.LIST)}
                onCancel={() => setMode(MODE.LIST)}
              />
            )}
          </React.Suspense>
        </Card>
      </div>
    </div>
  )
}
