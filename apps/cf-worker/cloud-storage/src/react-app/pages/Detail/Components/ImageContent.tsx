import { useMemo } from 'react'
import { FileInfo } from '../../../../shared/types/types'

export default function ImageContent(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  const rawUrl = useMemo(() => `/api/raw/${encodeURIComponent(fileInfo.originalName)}`, [fileInfo])
  return (
    <div className="grow flex justify-center items-center">
      <img src={rawUrl} />
    </div>
  )
}
