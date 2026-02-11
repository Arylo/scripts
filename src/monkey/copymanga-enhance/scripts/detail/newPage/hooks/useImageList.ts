import { computed, unref } from "../vue"
import usePageInfo from "./usePageInfo"

export default function useImageList () {
  const pageInfoRef = usePageInfo()
  const imagesRef = computed(() => unref(pageInfoRef).images ?? [])
  return imagesRef
}
