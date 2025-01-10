import { ref } from "../../../scripts/library/vue"
import useSizeChange from "./useSizeChange"

const eleRef = ref<HTMLElement | null>(null)

export default function useBodySize() {
  const widthRef = ref(0)
  const heightRef = ref(0)
  useSizeChange(eleRef, ({ width: w }) => {
    if (w === 0) return
    const { clientWidth: width, clientHeight: height } = document.getElementById('body') as HTMLElement
    widthRef.value = width
    heightRef.value = height
  })
  return {
    widthRef,
    heightRef,
    inject (ele: HTMLElement | null) {
      eleRef.value = ele
    },
  }
}
