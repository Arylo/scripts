import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { uploadFileGuest } from '../../../requests/uploadFileGuest'
import { formatFileSize } from '../../../utils/formatFileSize'

interface UploadFilesProps {
  onUploadSuccess?: () => void
  onCancel?: () => void
}

interface FileWithStatus {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function UploadFiles({ onUploadSuccess, onCancel }: UploadFilesProps) {
  const { code } = useParams<{ code: string }>()
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const uploadSingleFileMutation = useMutation({
    mutationFn: uploadFileGuest,
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[]
      const newFiles: FileWithStatus[] = files.map((file) => ({
        file,
        status: 'pending',
      }))
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[]
      const newFiles: FileWithStatus[] = files.map((file) => ({
        file,
        status: 'pending',
      }))
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setCurrentUploadIndex(0)
    setUploadError(null)

    // 重置所有文件状态为pending
    setSelectedFiles((prev) =>
      prev.map((item) => ({ ...item, status: 'pending', error: undefined })),
    )

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentUploadIndex(i)

        // 更新当前文件状态为uploading
        setSelectedFiles((prev) => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], status: 'uploading' }
          return newFiles
        })

        try {
          await uploadSingleFileMutation.mutateAsync(selectedFiles[i].file)

          // 更新当前文件状态为success
          setSelectedFiles((prev) => {
            const newFiles = [...prev]
            newFiles[i] = { ...newFiles[i], status: 'success' }
            return newFiles
          })
        } catch (error) {
          // 更新当前文件状态为error
          setSelectedFiles((prev) => {
            const newFiles = [...prev]
            newFiles[i] = {
              ...newFiles[i],
              status: 'error',
              error: error instanceof Error ? error.message : '上传失败',
            }
            return newFiles
          })
          throw error
        }
      }

      // 所有文件上传完成
      queryClient.invalidateQueries({ queryKey: ['files', code] })
      onUploadSuccess?.()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '上传过程中发生错误')
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles, uploadSingleFileMutation, queryClient, code, onUploadSuccess])

  const handleCancel = useCallback(() => {
    setSelectedFiles([])
    setUploadError(null)
    onCancel?.()
  }, [onCancel])

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const handleClearAll = useCallback(() => {
    setSelectedFiles([])
    setUploadError(null)
  }, [])

  const getStatusColor = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-200 text-green-800'
      case 'uploading':
        return 'bg-blue-100 border-blue-200 text-blue-800'
      case 'error':
        return 'bg-red-100 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getStatusIcon = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'uploading':
        return '⏳'
      case 'error':
        return '❌'
      default:
        return '📄'
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {selectedFiles.length > 0 ? (
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-medium text-gray-700">
                  已选择 {selectedFiles.length} 个文件
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  清除全部
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedFiles.map((fileWithStatus, index) => (
                <div
                  key={`${fileWithStatus.file.name}-${index}`}
                  className={`p-3 rounded-lg border ${getStatusColor(fileWithStatus.status)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{getStatusIcon(fileWithStatus.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium truncate">{fileWithStatus.file.name}</div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                          disabled={isUploading}
                        >
                          {!isUploading ? '移除' : ''}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>{formatFileSize(fileWithStatus.file.size)}</div>
                        <div className="capitalize">{fileWithStatus.status}</div>
                      </div>
                      {fileWithStatus.error && (
                        <div className="mt-1 text-xs text-red-600">{fileWithStatus.error}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg transition-colors duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    上传中 ({currentUploadIndex + 1}/{selectedFiles.length})
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg">↑</span>
                  <span>上传所有文件 ({selectedFiles.length})</span>
                </>
              )}
            </button>
          </div>

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm">{uploadError}</div>
            </div>
          )}

          {!isUploading && selectedFiles.some((file) => file.status === 'error') && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-700 text-sm">部分文件上传失败，请移除错误文件后重试</div>
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
            <div className="text-lg font-medium text-gray-700 mb-2">拖放文件到此区域</div>
            <div className="text-gray-500 mb-6">或点击下方按钮选择文件</div>
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileSelect} multiple />
              <div className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
                <span className="text-lg">📎</span>
                <span>选择文件</span>
              </div>
            </label>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            支持多文件上传，可一次选择多个文件
          </div>
        </div>
      )}
    </div>
  )
}
