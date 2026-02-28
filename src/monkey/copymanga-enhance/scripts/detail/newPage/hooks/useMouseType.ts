import { computed, MaybeRef, unref } from "@scripts/gm-vue"
import useMouseOverPoint from "./useMouseOverPoint"
import { GRID_CELL_TYPE, GRID_MAP } from "../constant"

export default function useMouseType (options?: MaybeRef<{ col: number, row: number }>) {
  const [mouseOverPointRef] = useMouseOverPoint()
  const mouseTypeRef = computed(() => {
    const { col, row } = unref(options) ?? unref(mouseOverPointRef)
    const result = col === -1 || row === -1 ?
      GRID_CELL_TYPE.SPACE :
      GRID_MAP[row]?.[col] ?? GRID_CELL_TYPE.SPACE
    return result
  })
  return [mouseTypeRef]
}
