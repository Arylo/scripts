import { onMounted } from "../vue";
import genScrollTo from "../../utils/genScrollTo";

export default function useScrollBy () {
  let scrollTo: ReturnType<typeof genScrollTo> | null = null

  const getScrollElement = () => {
    const element = document.querySelector('.direction-wrapper') as HTMLElement | null
    return element
  }

  const getScrollStep = () => {
    const appBody = getScrollElement()
    return appBody?.clientHeight ?? window.innerHeight
  }

  const scrollBy = (delta: number) => {
    if (!scrollTo) return
    scrollTo(getScrollElement()?.scrollTop! + delta, true)
  }

  const scrollUp = () => {
    scrollBy(-getScrollStep())
  }
  const scrollDown = () => {
    scrollBy(getScrollStep())
  }

  onMounted(() => {
    scrollTo = genScrollTo(getScrollElement()!)
  })


  return { scrollUp, scrollDown }
}
