import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { uploadFile } from '../../../utils/api'

interface UploadFilesProps {
  onUploadSuccess?: () => void
  onCancel?: () => void
}

export default function UploadFiles({ onUploadSuccess, onCancel }: UploadFilesProps) {
  const { keyId } = useParams<{ keyId: string }>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', keyId] })
      setSelectedFile(null)
      onUploadSuccess?.()
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
    onCancel?.()
  }, [onCancel])

  return (
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
                  <div className="font-medium text-gray-800 truncate">{selectedFile.name}</div>
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
            <div className="text-lg font-medium text-gray-700 mb-2">拖放文件到此区域</div>
            <div className="text-gray-500 mb-6">或点击下方按钮选择文件</div>
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileSelect} />
              <div className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
                <span className="text-lg">📎</span>
                <span>选择文件</span>
              </div>
            </label>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">支持所有类型的文件上传</div>
        </div>
      )}
    </div>
  )
}
