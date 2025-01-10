import { computed, unref, onMounted, onUnmounted, watch, MaybeRef } from "../../../scripts/library/vue";
import throttle from "../utils/throttle";

const noop = () => { }

const useSizeChange = (ele: MaybeRef<HTMLElement | null>, cb: (options: { width: number, height: number }) => any = noop) => {
  const tCb = throttle(cb, 50)
  const resizeObserver = new ResizeObserver((entries) => {
    const [entry] = entries
    const { clientWidth, clientHeight } = entry.target
    tCb({ width: clientWidth, height: clientHeight })
  })
  const start = () => {
    const element = unref(ele)
    if (!element) return
    resizeObserver.observe(element)
    tCb({ width: element.clientWidth, height: element.clientHeight })
  }
  const stop = () => {
    resizeObserver.disconnect()
  }
  onMounted(() => start())
  onUnmounted(() => stop())
  const target = computed(() => unref(ele))
  watch(target, () => {
    console.log('target change')
    stop()
    start()
  }, { immediate: true, flush: 'post' })
}

export default useSizeChange
