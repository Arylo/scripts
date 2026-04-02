import { FileInfo } from '../../../../types/types'

export default function ImageContent(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  const rawUrl = `/api/files/file/${fileInfo.name}`
  return <img src={rawUrl} />
}
