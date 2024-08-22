import { MixinThis, PageInfo } from "../types"

const InitMixin = (info: PageInfo) => ({
  data: {
    ...info,
    imageInfos: Array(info.images.length).fill(undefined),
  },
})

export type InitMixinThis = MixinThis<ReturnType<typeof InitMixin>>

export default InitMixin
