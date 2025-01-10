import { ref } from "../../../scripts/library/vue"
import store from "../store"
import { PageInfo } from "../../../scripts/types"

const usePageInfo = () => {
  const valueRef = ref(store.info.get() as PageInfo)
  return {
    valueRef,
  }
}

export default usePageInfo
