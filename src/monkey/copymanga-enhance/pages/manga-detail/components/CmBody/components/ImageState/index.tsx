import { computed, defineComponent, ref } from "../../../../../../scripts/library/vue";
import State from "../State";
import { PageType } from "../../../../constant";
import useBodySize from "../../../../hooks/useBodySize";

export default defineComponent({
  props: {
    details: Object,
  },
  setup(props) {
    const details = props.details as any
    const { heightRef, widthRef } = useBodySize()
    const imgWidthRef = ref(0)
    const imgHeightRef = ref(0)
    const directionRef = ref(PageType.PORTRAIT)
    const parseImageDetail = (ele: HTMLImageElement) => {
      imgWidthRef.value = ele.naturalWidth
      imgHeightRef.value = ele.naturalHeight
      directionRef.value = ele.naturalWidth > ele.naturalHeight ? PageType.LANDSCAPE : PageType.PORTRAIT
    }
    const imgStyle = computed(() => {
      let width = undefined
      let height = undefined
      if (heightRef.value <= widthRef.value) {
        height = `${heightRef.value}px`
      } else {
        width = `${widthRef.value}px`
      }
      return {
        width,
        height,
        opacity: 0.05,
      }
    })
    return () => (
      <State>
        <img
          style={imgStyle.value}
          src={details.url}
          alt={`Image ${details.index + 1}`}
          onLoad={(e: any) => parseImageDetail(e.target)}
        />
      </State>
    )
  },
})
