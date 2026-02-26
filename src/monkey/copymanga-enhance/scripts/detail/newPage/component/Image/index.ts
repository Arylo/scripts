import { DirectionMode, PageType } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import useImageInfoMap from "../../hooks/useImageInfoMap";
import useRawImageList from "../../hooks/useRawImageList";
import useImageWidth from "../../hooks/useImageWidth";
import { defineComponent, h, ref, unref } from '@scripts/gm-vue'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup (props, { emit }) {
    const pageType = ref(PageType.PORTRAIT)
    const rawImageListRef = useRawImageList()
    const imageInfoMapRef = useImageInfoMap()
    const [directionModeRef] = useDirectionMode()
    const [imageWidthRef] = useImageWidth()
    const onLoad = (e: Event) => {
      const index = unref(rawImageListRef).indexOf(props.src)
      const element = e.target as HTMLImageElement
      const [width, height] = [element.naturalWidth, element.naturalHeight]
      const type = width > height ? PageType.LANDSCAPE : PageType.PORTRAIT
      imageInfoMapRef.value[index] = {
        width,
        height,
        type,
      }
      pageType.value = type
      emit('loaded')
    }
    return () => h(
      'img',
      {
        class: `comic-image ${unref(pageType)} ltr:w-auto ltr:h-(--body-height) rtl:w-auto rtl:h-(--body-height)`,
        style: unref(directionModeRef) === DirectionMode.TTB ? { 'max-width': `${unref(imageWidthRef)}%` } : {},
        src: props.src,
        onLoad,
      },
    )
  },
})
