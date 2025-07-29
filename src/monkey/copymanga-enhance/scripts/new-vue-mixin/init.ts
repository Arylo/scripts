import storage from '../storage'
import { MixinThis } from '../types'

const InitMixin = () => ({
  data: {
    imageInfos: [],
  },
  computed: {
    pageInfo () {
      return storage.pageInfo ?? {}
    },
    images () {
      const that = (this as any)
      return that.pageInfo?.images || []
    },
    prevUrl () {
      const that = (this as any)
      return that.pageInfo?.prevUrl
    },
    menuUrl () {
      const that = (this as any)
      return that.pageInfo?.menuUrl
    },
    title () {
      const that = (this as any)
      return that.pageInfo?.title
    },
    nextUrl () {
      const that = (this as any)
      return that.pageInfo?.nextUrl
    },
  },
  mounted () {
    const that = (this as any)
    that.imageInfos = Array(that.pageInfo?.images.length).fill(undefined)
  }
})

export type InitMixinThis = MixinThis<ReturnType<typeof InitMixin>>

export default InitMixin
