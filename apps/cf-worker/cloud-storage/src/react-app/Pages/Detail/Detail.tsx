import { useQuery } from '@tanstack/react-query'
import cc from 'classcat'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FileInfo } from '../../../shared/types/types'
import Card from '../../Components/Card/Card'
import { fetchFileList } from '../../requests/fetchFileList'
import { formatFileSize } from '../../utils/formatFileSize'
import UploadFiles from './Components/UploadFiles'
import { MODE } from './constant'

const Content = React.lazy(() => import('./Content'))

export default function Detail() {
  const { keyId, fileName } = useParams<{ keyId: string; fileName: string }>()
  const [mode, setMode] = useState<MODE>(MODE.LIST)
  useEffect(() => {
    if (fileName) setMode(MODE.DETAIL)
    else setMode(MODE.LIST)
  }, [fileName])

  const nav = useNavigate()
  const goList = () => {
    setMode(MODE.LIST)
    nav(`/${keyId}`)
  }
  const goUpload = () => {
    setMode(MODE.UPLOAD)
  }
  const goDetail = (name: string) => {
    setMode(MODE.DETAIL)
    nav(`/${keyId}/${name}`)
  }

  // 使用 react-query 获取文件列表
  const {
    data: files,
    isLoading,
    isSuccess,
  } = useQuery<FileInfo[], Error>({
    queryKey: ['files', keyId],
    queryFn: () => {
      if (!keyId) {
        return Promise.resolve([])
      }
      return fetchFileList(keyId)
    },
    select: (list) => {
      const sortByName = (a: FileInfo, b: FileInfo) => {
        const nameA = (a.displayName ?? a.name).toLowerCase()
        const nameB = (b.displayName ?? b.name).toLowerCase()
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' })
      }
      const withDisplayName = list.filter((file) => file.displayName).sort(sortByName)
      const withoutDisplayName = list.filter((file) => !file.displayName).sort(sortByName)

      return [...withDisplayName, ...withoutDisplayName]
    },
    enabled: true,
    retry: false,
  })
  const fileInfo = useMemo(() => {
    return files?.find((file) => file.name === fileName)
  }, [fileName, files])
  const handleDownload = () => {
    if (!fileInfo) return
    const link = document.createElement('a')
    link.href = `/api/files/file/${fileInfo.name}`
    link.download = fileInfo.displayName ?? fileInfo.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 h-screen w-screen flex flex-col gap-2">
      {isLoading ? (
        <>
          <Card className="h-full flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-gray-600 font-medium">加载文件中...</div>
            </div>
          </Card>
        </>
      ) : (
        <></>
      )}
      <div
        className={cc([
          'flex-1 min-h-0',
          mode !== MODE.LIST ? 'grid grid-cols-[320px_1fr] gap-4' : 'flex',
        ])}
      >
        <Card
          className={cc([
            'overflow-hidden flex flex-col gap-2 grow-1',
            mode !== MODE.LIST ? 'rounded-r-none' : 'flex-1 h-full',
          ])}
        >
          <div className="flex flex-row-reverse">
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              onClick={() => goUpload()}
            >
              <span className="text-lg">↑</span>
              <span>上传文件</span>
            </button>
          </div>
          <div className="grid grid-rows-[45px_1fr] grow min-h-0">
            {/* 表头 */}
            <div
              className={cc([
                'w-full flex flex-row items-center px-4 py-3',
                'bg-gray-50 border-b border-gray-200',
                'text-gray-600 font-medium text-sm',
                'shrink-0',
              ])}
            >
              <div className="grow-1">文件名</div>
              {mode === MODE.LIST ? (
                <>
                  <div className="basis-[120px] text-center">文件大小</div>
                  <div className="basis-[140px] text-center">更新时间</div>
                </>
              ) : null}
            </div>

            {/* 文件列表项 */}
            <div className="overflow-y-auto min-h-0">
              {(files || []).map((file) => (
                <div
                  key={file.key}
                  className={cc([
                    'w-full flex flex-row items-center px-4 py-3',
                    'border-b border-gray-100 last:border-b-0',
                    'hover:bg-gray-50 active:bg-gray-100',
                    'transition-colors duration-150 group',
                    { 'cursor-pointer': isSuccess, 'bg-blue-50': fileName === file.name },
                  ])}
                  onClick={() => goDetail(file.name)}
                >
                  <div className="grow-1 flex items-center gap-3 truncate">
                    <div className="text-gray-400">📄</div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-800 truncate">
                        {file.displayName ?? file.name}
                      </div>
                    </div>
                  </div>
                  {mode === MODE.LIST ? (
                    <>
                      <div className="basis-[120px] text-center text-gray-600 text-sm">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="basis-[140px] text-center text-gray-500 text-sm">
                        {dayjs(file.updatedAt).format('YYYY/MM/DD')}
                      </div>
                    </>
                  ) : (
                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {mode !== MODE.LIST ? (
          <>
            {/* 详情面板 */}
            <Card className="rounded-l-none flex flex-col gap-2">
              {mode === MODE.DETAIL ? (
                <>
                  <div className="flex flex-row justify-between">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => goList()}
                    >
                      <span className="text-lg">←</span>
                      <span>返回列表</span>
                    </button>
                    {isLoading ? (
                      <></>
                    ) : (
                      <>
                        <button
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                          onClick={handleDownload}
                        >
                          <span className="text-lg">↓</span>
                          <span>下载</span>
                        </button>
                      </>
                    )}
                  </div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <>
                      <React.Suspense fallback={'正在加载组件中...'}>
                        <Content fileInfo={fileInfo!} />
                      </React.Suspense>
                    </>
                  )}
                </>
              ) : null}

              {mode === MODE.UPLOAD ? (
                <>
                  <div className="flex flex-row justify-between">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => goList()}
                    >
                      <span className="text-lg">←</span>
                      <span>返回列表</span>
                    </button>
                  </div>
                  {isLoading ? (
                    <></>
                  ) : (
                    <UploadFiles
                      onUploadSuccess={() => setMode(MODE.LIST)}
                      onCancel={() => setMode(MODE.LIST)}
                    />
                  )}
                </>
              ) : null}
            </Card>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
