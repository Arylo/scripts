import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import { PageType } from "../../constant";
import useImageInfoMap from "../../hooks/useImageInfoMap";
import useImageList from "../../hooks/useImageList";
import { defineComponent, h, onMounted, ref, unref } from "../../vue";
import css from './style.css'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup (props, { emit }) {
    onMounted(() => {
      GM_addStyle(css)
    })
    const pageType = ref(PageType.PORTRAIT)
    const imageListRef = useImageList()
    const imageInfoMapRef = useImageInfoMap()
    const onLoad = (e: Event) => {
      const index = unref(imageListRef).indexOf(props.src)
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
    return () => h('img', { class: `comic-image ${unref(pageType)}`, src: props.src, onLoad })
  },
})
