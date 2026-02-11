import storage from "../../storage"
import { onMounted, readonly, ref } from "../vue"

const whitePageRef = ref<boolean>(storage.whitePage)

export default function useWhitePage () {
  const whitePage = readonly(whitePageRef)
  function setter (value: boolean) {
    whitePageRef.value = value
    storage.whitePage = value
  }
  onMounted(() => {
    setter(storage.whitePage)
  })
  return [whitePage, setter] as const
}
