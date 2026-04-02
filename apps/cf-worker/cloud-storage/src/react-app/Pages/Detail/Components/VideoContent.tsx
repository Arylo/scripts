import { FileInfo } from '../../../../types/types'

export default function VideoContent(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  const rawUrl = `/api/files/file/${fileInfo.name}`
  return (
    <video
      className="size-full"
      crossOrigin="use-credentials"
      controls
      src={rawUrl}
      preload="auto"
    ></video>
  )
}
