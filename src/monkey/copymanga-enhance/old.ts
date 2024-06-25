import { genScrollTo } from "./common"
import { PageInfo } from "./types"

const getCurrentCount = () => $('.comicContent-list > li > img').length
const getTotalCount = () => Number((document.getElementsByClassName('comicCount')[0] as HTMLDivElement).innerText)
export const windowScrollTo = genScrollTo(window)

export const refreshImage = (cb: Function) => {
  const nextTime = 15
  let [cur, total] = [getCurrentCount(), getTotalCount()]
  console.log('Process:', getCurrentCount(), '/', getTotalCount())
  if (total === 0 || cur < total) {
    windowScrollTo(document.getElementsByClassName('comicContent')[0].clientHeight, true)
    cur = getCurrentCount()
    setTimeout(() => {
      windowScrollTo(0)
      setTimeout(() => refreshImage(cb), nextTime)
    }, nextTime)
    return
  }
  cb()
}

export const getPageInfo = () => {
  const list: string[] = []
  $(".comicContent-list > li > img").each((_, el) => {
    list.push($(el).data("src"))
  });
  const footerElements = $<HTMLAnchorElement>('.footer a')
  const info: PageInfo = {
    images: list,
    title: $('.header').get(0)?.innerText,
    prevUrl: footerElements.get(1)?.className.includes('prev-null') ? undefined : footerElements.get(1)?.href,
    nextUrl: footerElements.get(2)?.className.includes('prev-null') ? undefined : footerElements.get(2)?.href,
  }
  return info
}
