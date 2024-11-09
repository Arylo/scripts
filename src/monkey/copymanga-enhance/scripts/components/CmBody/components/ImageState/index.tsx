import useImagesInfo from "../../../../hooks/useImagesInfo";
import { defineComponent } from "../../../../library/vue";
import State from "../State";
import { PageType } from "../../../../constant";

export default defineComponent({
  props: {
    details: Object,
  },
  setup(props) {
    const details = props.details as any
    const { loadFinish } = useImagesInfo()
    const parseImageDetail = (ele: HTMLImageElement) => {
      return {
        width: ele.naturalWidth,
        height: ele.naturalHeight,
        direction: ele.naturalWidth > ele.naturalHeight ? PageType.LANDSCAPE : PageType.PORTRAIT,
      }
    }
    return () => (
      <State>
        <img src={details.url} alt={`Image ${details.index + 1}`} onLoad={(e: any) => loadFinish(details.index, parseImageDetail(e.target))} />
      </State>
    )
  },
})
