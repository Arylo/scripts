import { chapter, comic, findIndex } from "../common";
import { ComicDirection, PageType } from "../constant";
import { MixinThis, PageInfo } from "../types";

const ImageMixin = (info: PageInfo) => ({
  data: {
    hasWhitePage: JSON.parse(sessionStorage.getItem(`${comic}.hasWhitePage.${chapter}`) || 'false'),
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
      const rawImageList: string[] = that.images || []
      const curList = rawImageList.map((imageUrl, index) => ({ index, url: imageUrl, type: that.imageInfos[index]?.type ?? PageType.LOADING }))
      const hasWhitePage = that.canWhitePage
      let useWhitePage = !hasWhitePage
      const groups: any[][] = []
      function addImage (obj: any) {
        if (
          groups.length === 0 ||
          groups[groups.length - 1].length === 2 ||
          groups[groups.length - 1][0].type === PageType.LANDSCAPE
        ) groups.push([])
        groups[groups.length - 1].push(obj)
      }
      curList.forEach((imageObject) => {
        if (!useWhitePage && imageObject.type === PageType.PORTRAIT) {
          addImage({ ...imageObject, index: imageObject.index - 0.5, type: PageType.WHITE_PAGE })
          useWhitePage = true
        }
        addImage(imageObject)
      })
      return groups
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
      sessionStorage.setItem(`${comic}.hasWhitePage.${chapter}`, JSON.stringify(val))
    },
  },
})

export type ImageMixinThis = MixinThis<ReturnType<typeof ImageMixin>>

export default ImageMixin
