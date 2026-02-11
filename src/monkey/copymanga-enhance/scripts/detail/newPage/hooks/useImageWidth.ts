import storage from "../../storage"
import { onMounted, readonly, ref } from "../vue"

const imageWidthRef = ref<number>(100)

export default function useImageWidth () {
  const imageWidth = readonly(imageWidthRef)
  function setter (value: number) {
    imageWidthRef.value = value
    storage.imageWidth = value
  }
  onMounted(() => {
    setter(storage.imageWidth)
  })
  return [imageWidth, setter] as const
}
