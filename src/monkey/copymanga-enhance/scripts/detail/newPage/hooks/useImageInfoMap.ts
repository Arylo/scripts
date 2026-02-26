import { PageType } from "../constant";
import { ref } from '@scripts/gm-vue'

const statusMap = ref<(false|{ width: number, height: number, type: PageType })[]>([])

export default function useImageInfoMap () {
  return statusMap
}
