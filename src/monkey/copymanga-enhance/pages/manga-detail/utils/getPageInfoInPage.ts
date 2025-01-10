import { PageInfo } from "../../../scripts/types";
import { genScrollToFn } from "../../../utils/genScrollToFn";

const windowScrollTo = genScrollToFn(window)
const getCurrentCount = () => $('.comicContent-list > li > img').length
const getTotalCount = () => Number((document.getElementsByClassName('comicCount')[0] as HTMLDivElement).innerText)

const getPageInfo = () => {
  const list: string[] = []
  $(".comicContent-list > li > img").each((_, el) => {
    list.push($(el).data("src"))
  });
  const footerElements = $<HTMLAnchorElement>('.footer a')
  const info: PageInfo = {
    images: list,
    title: $('.header').get(0)?.innerText,
    menuUrl: footerElements.get(3)?.href,
    prevUrl: footerElements.get(1)?.className.includes('prev-null') ? undefined : footerElements.get(1)?.href,
    nextUrl: footerElements.get(2)?.className.includes('prev-null') ? undefined : footerElements.get(2)?.href,
  }
  console.log('PageInfo:', info)
  return info
}

async function refreshPageImages() {
  const nextTime = 15
  let [cur, total] = [0, 0]
  return new Promise((resolve) => {
    const id = setInterval(() => {
      total = getTotalCount()
      cur = getCurrentCount()
      if (total === 0) return
      console.log('Process:', getCurrentCount(), '/', getTotalCount())
      if (cur >= total) {
        clearInterval(id)
        return resolve(undefined)
      }
      windowScrollTo(0)
      windowScrollTo(document.getElementsByClassName('comicContent')[0].clientHeight, true)
    }, nextTime)
  })
}
export default async function getPageInfoInPage() {
  windowScrollTo(0)
  await refreshPageImages()
  windowScrollTo(0)
  return getPageInfo()
}
