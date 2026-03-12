import { ref } from '@scripts/gm-vue'
import { PageType } from '../constant'

const statusMap = ref<(false | { width: number; height: number; type: PageType })[]>([])

export default function useImageInfoMap() {
  return statusMap
}
