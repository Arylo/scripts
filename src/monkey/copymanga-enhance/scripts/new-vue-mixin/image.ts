import { ComicDirection, PageType } from './constant'
import { MixinThis } from '../types'
import { imagesToImageGroups } from './utils'
import storage from '../storage'

const ImageMixin = () => ({
  data: {
    hasWhitePage: storage.whitePage,
  },
  computed: {
    currentImageCount () {
      const that = (this as any)
      return that.imageInfos.filter(Boolean).length
    },
    totalImageCount () {
      const that = (this as any)
      return that.imageInfos.length
    },
    isAllImagesLoaded () {
      const that = (this as any)
      return that.currentImageCount === that.totalImageCount
    },
    canWhitePage () {
      const that = (this as any)
      if (![ComicDirection.LTR, ComicDirection.RTL].includes(that.mode)) {
        return false
      }
      return that.isAllImagesLoaded
    },
    imageGroups () {
      const that = (this as any)
      return imagesToImageGroups({
        imageUrls: that.images || [],
        imageInfos: that.imageInfos || [],
        needWhitePage: that.hasWhitePage,
      })
    },
  },
  methods: {
    imageLoaded (e: any, index: number) {
      const that = (this as any)
      const el = e.target as HTMLImageElement
      that.imageInfos.splice(index, 1, {
        width: el.width,
        height: el.height,
        type: el.width > el.height ? PageType.LANDSCAPE : PageType.PORTRAIT,
      })
      if (that.mode === ComicDirection.LTR) {
      }
    },
    toggleWhitePage () {
      const that = (this as any)
      that.hasWhitePage = !that.hasWhitePage
    },
  },
  watch: {
    hasWhitePage (val: boolean) {
      storage.whitePage = val
    },
  },
})

export type ImageMixinThis = MixinThis<ReturnType<typeof ImageMixin>>

export default ImageMixin
