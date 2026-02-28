import { readonly, ref } from '@scripts/gm-vue'

const mouseOverPointRef = ref({ col: -1, row: -1 })

export default function useMouseOverPoint () {
  const mouseOverPoint = readonly(mouseOverPointRef)
  function setter (value: { col: number, row: number }) {
    mouseOverPointRef.value = value
  }
  return [mouseOverPoint, setter] as const
}
