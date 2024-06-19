import css from './copymanga-enhance.css'
import html from './copymanga-enhance.html'

declare const Vue: any

const comic = window.location.pathname.split('/')[2]
// const chapter = window.location.pathname.split('/')[4]

const getPageInfo = () => {
  const list: string[] = []
  $(".comicContent-list > li > img").each((_, el) => {
    list.push($(el).data("src"))
  });
  const footerElements = $<HTMLAnchorElement>('.footer a')
  return {
    images: list,
    title: $('.header').get(0)?.innerText,
    prevUrl: footerElements.get(1)?.className.includes('prev-null') ? undefined : footerElements.get(1)?.href,
    nextUrl: footerElements.get(2)?.className.includes('prev-null') ? undefined : footerElements.get(2)?.href,
  }
}

const initBodyDom = () => {
  document.body.innerHTML = html
  GM_addStyle(css)
}

const render = () => {
  const info = getPageInfo()
  console.table(info)
  initBodyDom()
  new Vue({
    el: '#app',
    data: {
      ...info,
      mode: GM_getValue(`${comic}.direction.mode`, 'ltr'),
    },
    methods: {
      imageLoaded(index: number) {
        // const that = (this as any)
        // const images = that.$refs.images as HTMLImageElement[]
        // const image = images[index]
      },
      switchMode(mode: string) {
        const that = (this as any)
        that.mode = mode
        GM_setValue(`${comic}.direction.mode`, mode)
      }
    },
  })
}

const getCurrentCount = () => $('.comicContent-list > li > img').length
const getTotalCount = () => Number((document.getElementsByClassName('comicCount')[0] as HTMLDivElement).innerText)
const weScrollTo = (top: number, isSmooth = false) => (window.scrollTo as Function)(top, 0, isSmooth)

const refreshImage = (cb: Function) => {
  const nextTime = 10
  let [cur, total] = [getCurrentCount(), getTotalCount()]
  console.log('Process:', getCurrentCount(), '/', getTotalCount())
  if (total === 0 || cur < total) {
    weScrollTo(document.getElementsByClassName('comicContent')[0].clientHeight, true)
    cur = getCurrentCount()
    setTimeout(() => refreshImage(cb), nextTime)
    setTimeout(() => weScrollTo(0), nextTime / 2)
    return
  }
  cb()
}
setTimeout(() => {
  refreshImage(() => {
    weScrollTo(0)
    render()
  })
}, 25)
