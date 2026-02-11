import { PageType } from "../constant";
import { ref } from "../vue";

const statusMap = ref<(false|{ width: number, height: number, type: PageType })[]>([])

export default function useImageInfoMap () {
  return statusMap
}
