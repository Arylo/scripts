import { computed, onMounted, unref } from "../vue";
import usePageInfo from "./usePageInfo";
import useWhitePage from "./useWhitePage";
import useScrollBy from "./useScrollBy";

export default function useKeyWatcher () {
  const pageInfoRef = usePageInfo()
  const prevUrlRef = computed(() => unref(pageInfoRef).prevUrl)
  const nextUrlRef = computed(() => unref(pageInfoRef).nextUrl)
  const [_, setWhitePage] = useWhitePage()
  const { scrollUp, scrollDown } = useScrollBy()
  onMounted(() => {
    const prevUrl = unref(prevUrlRef)
    const nextUrl = unref(nextUrlRef)
    window.addEventListener('keyup', (event) => {
      const { code } = event
      switch (code.toLowerCase()) {
        case 'ArrowLeft'.toLowerCase():
          prevUrl && (window.location.href = prevUrl)
          break
        case 'ArrowRight'.toLowerCase():
          nextUrl && (window.location.href = nextUrl)
          break
        case 'ArrowUp'.toLowerCase():
          event.preventDefault()
          scrollUp()
          break
        case 'Space'.toLowerCase():
        case 'ArrowDown'.toLowerCase():
          event.preventDefault()
          scrollDown()
          break
        case 'MetaLeft'.toLowerCase():
        case 'ControlLeft'.toLowerCase():
          setWhitePage(false)
          break
        case 'MetaRight'.toLowerCase():
        case 'ControlRight'.toLowerCase():
          setWhitePage(true)
          break
      }
    })
  })
}
