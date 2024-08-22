import { chapter, comic, findIndex, group } from "../common";
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
    whitePageIndex () {
      const that = (this as any)
      if (!that.hasWhitePage || !that.isAllImagesLoaded) return -1
      const groupList = group(that.imageInfos, (info: any) => info?.type)
      if (groupList.length === 1) return 0
      if (groupList.length >= 2) {
        const [firstList] = groupList
        if (firstList.length !== 1 && firstList[0].type === PageType.PORTRAIT) return 0
      }
      if (groupList.length >= 3) {
        const [firstList, secondList] = groupList
        if (firstList.length === 1 && firstList[0].type === PageType.PORTRAIT) {
          return findIndex(
            that.imageInfos,
            (info: any) => info?.type === PageType.PORTRAIT,
            { startIndex: firstList.length + secondList.length }
          )
        }
      }
      return findIndex(that.imageInfos, (info: any) => info?.type === PageType.PORTRAIT)
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
