import storage from "../../storage"
import { DirectionMode } from "../constant"
import { onMounted, readonly, ref } from "../vue"

const directionModeRef = ref<DirectionMode>(storage.directionMode)

export default function useDirectionMode () {
  const directionMode = readonly(directionModeRef)
  function setter (mode: DirectionMode) {
    directionModeRef.value = mode
    storage.directionMode = mode
  }
  onMounted(() => {
    setter(storage.directionMode)
  })
  return [directionMode, setter] as const
}
