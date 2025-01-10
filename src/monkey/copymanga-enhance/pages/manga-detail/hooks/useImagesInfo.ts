import type { Ref } from "vue";
import { genID } from "../../../utils/genID";
import Vue from "../../../scripts/library/vue";
import usePageInfo from "./usePageInfo";
import { PageType } from "../constant";

interface IImageInfo {
  width: number
  height: number
  direction: PageType
}

const imagesRef: Ref<Array<IImageInfo | false>> = Vue.ref([])

const useImagesInfo = () => {
  const { valueRef: pageInfoRef } = usePageInfo()
  const loadedCount = Vue.computed(() => Vue.unref(imagesRef).filter(Boolean).length)
  const total = Vue.computed(() => Vue.unref(pageInfoRef).images.length)
  const loading = Vue.computed(() => Vue.unref(loadedCount) !== Vue.unref(total))
  const loaded = Vue.computed(() => Vue.unref(loadedCount) === Vue.unref(total))

  const loadFinish = (index: number, detail: IImageInfo) => {
    if (Vue.unref(total) <= index) {
      return console.error('index out of range')
    }
    imagesRef.value.splice(index, 1, detail)
  }

  Vue.onMounted(() => {
    if (Vue.unref(imagesRef.value).length === 0) {
      imagesRef.value = Array(Vue.unref(pageInfoRef).images.length).fill(false)
    }
  })
  return {
    valueRef: imagesRef,
    total,
    loading,
    loaded,
    loadFinish,
  }
}

export default useImagesInfo;
