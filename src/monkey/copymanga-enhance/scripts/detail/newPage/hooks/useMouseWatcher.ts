import throttle from '@scripts/throttle'
import { GRID_CELL_TYPE, GRID_MAP } from "../constant";
import { onMounted, ref, unref, watch } from '@scripts/gm-vue'
import useScrollBy from "./useScrollBy";
import useMouseOverPoint from './useMouseOverPoint';
import useMouseType from './useMouseType';
import useToast from './useToast';

export default function useMouseWatcher () {
  const { scrollUp, scrollDown } = useScrollBy()
  const [_, setMouseOverPoint] = useMouseOverPoint()
  const actionPointRef = ref({ col: -1, row: -1 })
  const [actionMouseTypeRef] = useMouseType(actionPointRef)

  onMounted(() => {
    const appBody = document.querySelector('.app-body') as HTMLElement | null
    if (!appBody) return

    const getGridPoint = (x: number, y: number) => {
      const COUNT_COLUMN = GRID_MAP[0].length
      const COUNT_ROW = GRID_MAP.length
      const rect = appBody.getBoundingClientRect()
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return { col: -1, row: -1 }
      const colWidth = rect.width / COUNT_COLUMN
      const rowHeight = rect.height / COUNT_ROW
      const col = Math.min(COUNT_COLUMN - 1, Math.max(0, Math.floor((x - rect.left) / colWidth)))
      const row = Math.min(COUNT_ROW - 1, Math.max(0, Math.floor((y - rect.top) / rowHeight)))
      return { col, row }
    }

    const handleGridMove = throttle((info: { x: number, y: number }) => {
      setMouseOverPoint(getGridPoint(info.x, info.y))
    }, 25)

    appBody.addEventListener('mousemove', (event) => {
      const info = {
        x: event.clientX,
        y: event.clientY,
      }
      handleGridMove(info)
    })

    appBody.addEventListener('mouseleave', () => {
      setMouseOverPoint({ col: -1, row: -1 })
    })

    const handleGridClick = () => {
      switch (unref(actionMouseTypeRef)) {
        case GRID_CELL_TYPE.PREV: return scrollUp()
        case GRID_CELL_TYPE.NEXT: return scrollDown()
      }
    }

    appBody.addEventListener('click', (event) => {
      actionPointRef.value = getGridPoint(event.clientX, event.clientY)
      handleGridClick()
    })

    appBody.addEventListener('touchstart', (event) => {
      const touch = event.touches[0]
      if (!touch) return
      actionPointRef.value = getGridPoint(touch.clientX, touch.clientY)
      handleGridClick()
    })
  })

  const [overMouseTypeRef] = useMouseType()
  const { showToast, hideToast } = useToast()
  watch(overMouseTypeRef, (type) => {
    switch (type) {
      case GRID_CELL_TYPE.PREV:
        showToast('上一页')
        break
      case GRID_CELL_TYPE.NEXT:
        showToast('下一页')
        break
      default:
        hideToast()
    }
  })

  return {}
}
