import { ref } from "../library/vue"
import store from "../store"
import { PageInfo } from "../types"

const usePageInfo = () => {
  const valueRef = ref(store.info.get() as PageInfo)
  return {
    valueRef,
  }
}

export default usePageInfo
