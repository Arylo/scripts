import { useMemo } from 'react'
import { FileInfo } from '../../../../shared/types/types'

export default function VideoContent(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  const rawUrl = useMemo(() => `/api/raw/${encodeURIComponent(fileInfo.originalName)}`, [fileInfo])
  return (
    <video className="size-full" controls crossOrigin="use-credentials">
      <source src={rawUrl} type={fileInfo.mimetype} />
    </video>
  )
}
