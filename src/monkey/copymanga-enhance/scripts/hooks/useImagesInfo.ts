import { computed, ref, unref } from "../library/vue";
import store from "../store";
import usePageInfo from "./usePageInfo";

const imagesRef = ref(Array(store.info.get().images.length).fill(undefined))

const useImagesInfo = () => {
  const { valueRef: pageInfoRef } = usePageInfo()
  const loadedCount = computed(() => unref(imagesRef).filter(Boolean).length)
  const total = computed(() => unref(pageInfoRef).images.length)
  const loading = computed(() => unref(loadedCount) !== unref(total))
  const loaded = computed(() => unref(loadedCount) === unref(total))

  const loadFinish = (index: number, content: any = {}) => {
    if (unref(total) <= index) {
      return console.error('index out of range')
    }
    imagesRef.value.splice(index, 1, content)
  }
  return {
    valueRef: imagesRef,
    total,
    loading,
    loaded,
    loadFinish,
  }
}

export default useImagesInfo;
