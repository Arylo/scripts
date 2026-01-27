import { ACTION_GRID_MAP } from "../constant";
import { onMounted, readonly, ref, unref } from "../vue";
import useMouseGrid from "./useMouseGrid";
import useScrollBy from "./useScrollBy";

export default function useMouseWatcher () {
  const { scrollUp, scrollDown } = useScrollBy()
  const [mouseGridRef, setMouseGrid] = useMouseGrid()
  onMounted(() => {
    const appBody = document.querySelector('.app-body') as HTMLElement | null
    if (!appBody) return

    /**
     * ```markdown
     * |1|2|3|
     * |4|5|6|
     * ```
     */
    const getGridIndex = (x: number, y: number) => {
      const COUNT_COLUMN = 3
      const COUNT_ROW = 2
      const rect = appBody.getBoundingClientRect()
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return -1
      const colWidth = rect.width / COUNT_COLUMN
      const rowHeight = rect.height / COUNT_ROW
      const col = Math.min(COUNT_COLUMN - 1, Math.max(0, Math.floor((x - rect.left) / colWidth)))
      const row = Math.min(COUNT_ROW - 1, Math.max(0, Math.floor((y - rect.top) / rowHeight)))
      return row * COUNT_COLUMN + col + 1
    }

    const handleGridMove = (info: { x: number, y: number }) => {
      const gridIndex = getGridIndex(info.x, info.y)
      const currentGridIndex = unref(mouseGridRef)
      if (gridIndex === currentGridIndex) return
      setMouseGrid(gridIndex)
    }

    const handleGridClick = (info: { x: number, y: number }) => {
      const gridIndex = getGridIndex(info.x, info.y)
      if (ACTION_GRID_MAP.PREV.includes(gridIndex)) {
        return scrollUp()
      }
      if (ACTION_GRID_MAP.NEXT.includes(gridIndex)) {
        return scrollDown()
      }
    }

    appBody.addEventListener('mousemove', (event) => {
      const info = {
        x: event.clientX,
        y: event.clientY,
      }
      handleGridMove(info)
    })

    appBody.addEventListener('click', (event) => {
      const info = {
        x: event.clientX,
        y: event.clientY,
      }
      handleGridClick(info)
    })

    appBody.addEventListener('touchstart', (event) => {
      const touch = event.touches[0]
      if (!touch) return
      const info = {
        x: touch.clientX,
        y: touch.clientY,
      }
      handleGridClick(info)
    })
  })

  return {}
}
