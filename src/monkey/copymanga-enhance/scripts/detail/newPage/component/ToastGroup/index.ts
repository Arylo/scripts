import { defineComponent, h, unref, watch, onMounted, computed } from "@scripts/gm-vue";
import useToastList from "../../hooks/useToastList";
import cc from "classcat";
import css from './style.css'
import { GM_addStyle } from "@scripts/gm-polyfill";
import useMouseOverPoint from "../../hooks/useMouseOverPoint";
import { GRID_MAP } from "../../constant";

export default defineComponent({
  setup () {
    onMounted(() => {
      GM_addStyle(css)
    })

    const [toastListRef, { removeToast }] = useToastList()
    let timer: ReturnType<typeof setTimeout> | null = null
    watch(toastListRef, (toastList) => {
      if (timer) clearTimeout(timer)
      if (toastList.length === 0) return
      const nearestExpiredAtToastList = toastList
        .filter(t => typeof t.expiredAt === 'number')
        .sort((a, b) => a.expiredAt! - b.expiredAt!)
        [0]
      if (!nearestExpiredAtToastList) return
      const duration = nearestExpiredAtToastList.expiredAt! - Date.now()
      if (duration <= 0) {
        removeToast(nearestExpiredAtToastList.id)
        return
      }
      timer = setTimeout(() => {
        removeToast(nearestExpiredAtToastList.id)
      }, duration)
    })
    const [mouseOverPointRef] = useMouseOverPoint()
    const overPointRef = computed(() => {
      let [
        top, left, bottom, right,
        topLeft, topRight, bottomLeft, bottomRight,
      ] = [
        false, false, false, false,
        false, false, false, false,
      ]
      const { row, col } = unref(mouseOverPointRef)
      if (row === -1 || col === -1) {
        return { top, left, bottom, right, topLeft, topRight, bottomLeft, bottomRight }
      }
      const COL_COUNT = GRID_MAP[0].length
      const ROW_COUNT = GRID_MAP.length
      const isTop = row < Math.floor(ROW_COUNT / 2)
      const isLeft = col < Math.floor(COL_COUNT / 2)
      top = isTop
      left = isLeft
      bottom = !isTop
      right = !isLeft
      topLeft = isTop && isLeft
      topRight = isTop && !isLeft
      bottomLeft = !isTop && isLeft
      bottomRight = !isTop && !isLeft
      return { top, left, bottom, right, topLeft, topRight, bottomLeft, bottomRight }
    })
    const isNonOver = computed(() => {
      const { top, bottom, left, right } = unref(overPointRef)
      return [top, bottom, left, right].every(v => v === false)
    })

    return () => h(
      'div',
      {
        popover: 'manual',
        id: 'toast-group',
        class: cc([
          'm-0 p-[5px] border-0 w-fit h-fit',
          'fixed left-0 w-dvw bg-transparent',
          {
            'top-auto': unref(overPointRef).top,
            'top-(--header-height)': unref(overPointRef).bottom || unref(isNonOver),
          },
          'flex gap-[5px] items-center',
          {
            'flex-col-reverse': unref(overPointRef).top,
            'flex-col': unref(overPointRef).bottom || unref(isNonOver),
          },
        ])
      },
      unref(toastListRef).map(toast => h(
        'div',
        {
          key: toast.id,
          class: 'toast-item text-white w-fit flex items-center',
        },
        toast.content
      ))
    )
  },
})
