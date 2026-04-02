import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import cc from 'classcat'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FileInfo } from '../../../types/types.d'
import Card from '../../Components/Card/Card'
import { fetchFileList, uploadFile } from '../../utils/api'

const Content = React.lazy(() => import('./Content'))

export default function Detail() {
  const { keyId, fileName } = useParams<{ keyId: string; fileName: string }>()
  const [detailKey, setDetailKey] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()

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
  const isDetailMode = useMemo(() => !!detailKey && isSuccess, [detailKey])
  const fileInfo = useMemo(() => {
    return files?.find((file) => file.key === detailKey)
  }, [detailKey, files])
  const handleDownload = () => {
    if (!fileInfo) return
    const link = document.createElement('a')
    link.href = `/api/files/file/${fileInfo.name}`
    link.download = fileInfo.displayName ?? fileInfo.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  useEffect(() => {
    if (fileName) setDetailKey(files?.find((file) => file.name === fileName)?.key)
  }, [files])

  const nav = useNavigate()
  const goDetail = (key?: string) => {
    setDetailKey(key)
    if (!key) return nav(`/${keyId}`)
    const fileInfo = files?.find((file) => file.key === key)
    nav(`/${keyId}/${fileInfo?.name}`)
    setUploadMode(false)
  }

  const [isUploadMode, setUploadMode] = useState(false)
  useEffect(() => {
    if (isUploadMode) goDetail(undefined)
  }, [isUploadMode])

  // 上传相关状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', keyId] })
      setSelectedFile(null)
      setUploadMode(false)
    },
  })

  // 处理拖放事件
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }, [])

  const handleUpload = useCallback(() => {
    if (!selectedFile) return
    uploadMutation.mutate(selectedFile)
  }, [selectedFile, uploadMutation])

  const handleCancel = useCallback(() => {
    setSelectedFile(null)
    setUploadMode(false)
  }, [])

  return (
    <div className="p-6 size-full flex flex-col gap-2">
      {isLoading ? (
        <Card className="h-full flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-gray-600 font-medium">加载文件中...</div>
          </div>
        </Card>
      ) : (
        <>
          {/* 操作栏 */}
          <div className="flex flex-row justify-end gap-3">{isDetailMode ? <></> : null}</div>

          {/* 内容区域 */}
          {files ? (
            <div
              className={cc([
                'flex-1',
                isDetailMode || isUploadMode ? 'grid grid-cols-[320px_1fr] gap-4' : 'flex',
              ])}
            >
              {/* 文件列表 */}
              <Card
                className={cc([
                  'overflow-hidden flex flex-col gap-2',
                  isDetailMode || isUploadMode ? 'rounded-r-none' : 'flex-1',
                ])}
              >
                <div className="flex flex-row-reverse">
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => setUploadMode(true)}
                  >
                    <span className="text-lg">↑</span>
                    <span>上传文件</span>
                  </button>
                </div>
                <div className="flex flex-col h-full">
                  {/* 表头 */}
                  <div
                    className={cc([
                      'w-full flex flex-row items-center px-4 py-3',
                      'bg-gray-50 border-b border-gray-200',
                      'text-gray-600 font-medium text-sm',
                    ])}
                  >
                    <div className="grow-1">文件名</div>
                    {!isDetailMode ? (
                      <>
                        <div className="basis-[120px] text-center">文件大小</div>
                        <div className="basis-[140px] text-center">更新时间</div>
                      </>
                    ) : null}
                  </div>

                  {/* 文件列表项 */}
                  <div className="flex-1 overflow-y-auto">
                    {files.map((file) => (
                      <div
                        key={file.key}
                        className={cc([
                          'w-full flex flex-row items-center px-4 py-3',
                          'border-b border-gray-100 last:border-b-0',
                          'hover:bg-gray-50 active:bg-gray-100',
                          'transition-colors duration-150 group',
                          { 'cursor-pointer': isSuccess, 'bg-blue-50': detailKey === file.key },
                        ])}
                        onClick={() => goDetail(file.key)}
                      >
                        <div className="grow-1 flex items-center gap-3 truncate">
                          <div className="text-gray-400">📄</div>
                          <div className="flex-1 truncate">
                            <div className="font-medium text-gray-800 truncate">
                              {file.displayName ?? file.name}
                            </div>
                          </div>
                        </div>
                        {!isDetailMode ? (
                          <>
                            <div className="basis-[120px] text-center text-gray-600 text-sm">
                              {file.size}
                            </div>
                            <div className="basis-[140px] text-center text-gray-500 text-sm">
                              {file.updatedAt + ''}
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

              {/* 详情面板 */}
              {isDetailMode ? (
                <Card className="rounded-l-none flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => goDetail(undefined)}
                    >
                      <span className="text-lg">←</span>
                      <span>返回列表</span>
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={handleDownload}
                    >
                      <span className="text-lg">↓</span>
                      <span>下载</span>
                    </button>
                  </div>
                  <React.Suspense fallback={'正在加载组件中...'}>
                    <Content fileInfo={fileInfo!} />
                  </React.Suspense>
                </Card>
              ) : null}

              {isUploadMode ? (
                <Card className="rounded-l-none flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => setUploadMode(false)}
                    >
                      <span className="text-lg">←</span>
                      <span>返回列表</span>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6">
                    {selectedFile ? (
                      <div className="w-full max-w-md">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700">选择的文件:</span>
                            <button
                              onClick={() => setSelectedFile(null)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              清除
                            </button>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-400 text-xl">📄</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-800 truncate">
                                  {selectedFile.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200 flex-1"
                          >
                            取消
                          </button>
                          <button
                            onClick={handleUpload}
                            disabled={uploadMutation.isPending}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg transition-colors duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {uploadMutation.isPending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>上传中...</span>
                              </>
                            ) : (
                              <>
                                <span className="text-lg">↑</span>
                                <span>上传文件</span>
                              </>
                            )}
                          </button>
                        </div>
                        {uploadMutation.isError && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-red-600 text-sm">
                              {uploadMutation.error?.message || '上传失败'}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full max-w-md">
                        <div
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <div className="text-5xl mb-4 text-gray-400">📁</div>
                          <div className="text-lg font-medium text-gray-700 mb-2">
                            拖放文件到此区域
                          </div>
                          <div className="text-gray-500 mb-6">或点击下方按钮选择文件</div>
                          <label className="cursor-pointer">
                            <input type="file" className="hidden" onChange={handleFileSelect} />
                            <div className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
                              <span className="text-lg">📎</span>
                              <span>选择文件</span>
                            </div>
                          </label>
                        </div>
                        <div className="mt-6 text-center text-sm text-gray-500">
                          支持所有类型的文件上传
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
