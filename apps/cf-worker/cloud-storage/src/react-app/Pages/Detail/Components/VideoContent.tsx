import '@videojs/react/video/skin.css'
import { createPlayer, videoFeatures } from '@videojs/react'
import { VideoSkin, Video } from '@videojs/react/video'
import { useMemo } from 'react'
import { FileInfo } from '../../../../types/types'

const Player = createPlayer({ features: videoFeatures })

export default function VideoContent(props: { fileInfo: FileInfo }) {
  const { fileInfo } = props
  const rawUrl = useMemo(() => `/api/files/file/${fileInfo.name}`, [fileInfo])
  return (
    <Player.Provider>
      <VideoSkin>
        <Video src={rawUrl} playsInline />
      </VideoSkin>
    </Player.Provider>
  )
}
