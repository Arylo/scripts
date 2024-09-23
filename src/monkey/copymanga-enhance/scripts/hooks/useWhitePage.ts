import { ref } from "../library/vue";
import store from '../store'

const cacheValueRef = ref(store.hasWhitePage.get())

const useWhitePage = () => {
  return {
    valueRef: cacheValueRef,
    toggle: (nextValue?: boolean) => {
      const value = typeof nextValue === 'undefined'
        ? !cacheValueRef.value
        : nextValue
      cacheValueRef.value = value
      store.hasWhitePage.save(value)
    },
  }
}

export default useWhitePage
