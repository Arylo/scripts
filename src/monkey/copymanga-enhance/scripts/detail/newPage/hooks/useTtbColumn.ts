import storage from "../../storage"
import { onMounted, readonly, ref } from "../vue"

export type TtbColumn = 1 | 2 | 3

const ttbColumnRef = ref<TtbColumn>(storage.ttbColumn)

export default function useTtbColumn () {
  const ttbColumn = readonly(ttbColumnRef)
  function setter (value: TtbColumn) {
    ttbColumnRef.value = value
    storage.ttbColumn = value
  }
  onMounted(() => {
    setter(storage.ttbColumn)
  })
  return [ttbColumn, setter] as const
}
