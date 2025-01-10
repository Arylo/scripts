import { PageType } from "../constant"
import useImagesInfo from "./useImagesInfo"

export const useStateSize = () => {
  const { valueRef: imagesRef } = useImagesInfo()
  const getStateSize = (state: { details: { index: number } }) => {
    const imageInfo = imagesRef.value[state.details.index]
    if (!imageInfo) {
      return 1
    }
    return imageInfo.direction === PageType.LANDSCAPE ? 2 : 1
  }
  const getStateSizes = (states: { details: { index: number } }[]) => {
    return states.reduce((sum, item) => (sum + getStateSize(item)), 0)
  }
  return { getStateSize, getStateSizes }
}
