import storage from '../../storage'
import { ref, onMounted, readonly } from "../vue";

export default function usePageInfo () {
  const rawData = ref(storage.pageInfo)
  onMounted(() => {
    rawData.value = storage.pageInfo
  })
  return readonly(rawData)
}
