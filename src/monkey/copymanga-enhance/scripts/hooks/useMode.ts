import { ComicDirection } from "../constant";
import { ref } from "../library/vue";
import store from '../store'

const cacheValueRef = ref(store.mode.get())

const useMode = () => {
  return {
    valueRef: cacheValueRef,
    switch (mode: ComicDirection) {
      cacheValueRef.value = mode
      store.mode.save(mode)
    },
  }
}

export default useMode
