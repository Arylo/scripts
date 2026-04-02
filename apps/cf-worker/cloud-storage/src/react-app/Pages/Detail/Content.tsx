import React from 'react'
import { match, P } from 'ts-pattern'
import { FileInfo } from '../../../types/types'

const VideoContent = React.lazy(() => import('./Components/VideoContent'))
const ImageContent = React.lazy(() => import('./Components/ImageContent'))
const NotSupportContent = React.lazy(() => import('./Components/NotSupportContent'))

export default function Content(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  return (
    <>
      <React.Suspense fallback={'正在加载组件中...'}>
        {match(fileInfo.mime)
          .with(
            // .ts
            'video/mp2t',
            () => <NotSupportContent />,
          )
          .with(
            P.string.startsWith('video/'),
            P.string.startsWith('audio/'),
            // .m3u8
            'application/vnd.apple.mpegurl',
            // .m3u8
            'application/x-mpegURL',
            () => <VideoContent fileInfo={fileInfo} />,
          )
          .with(P.string.startsWith('image/'), () => <ImageContent fileInfo={fileInfo} />)
          .otherwise(() => (
            <NotSupportContent />
          ))}
      </React.Suspense>
    </>
  )
}
