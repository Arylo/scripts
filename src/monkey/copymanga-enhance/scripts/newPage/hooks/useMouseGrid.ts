import { readonly, ref } from "../vue"

const mouseFocusRef = ref<number>(-1)

export default function useMouseGrid () {
  const mouseGrid = readonly(mouseFocusRef)
  function setter (value: number) {
    mouseFocusRef.value = value
  }
  return [mouseGrid, setter] as const
}
