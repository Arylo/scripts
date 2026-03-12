import { onMounted, readonly, ref } from '@scripts/gm-vue'
import storage from '../../storage'

export default function usePageInfo() {
  const rawData = ref(storage.pageInfo)
  onMounted(() => {
    rawData.value = storage.pageInfo
  })
  return readonly(rawData)
}
