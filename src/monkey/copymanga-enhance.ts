import css from './copymanga-enhance.css'
import html from './copymanga-enhance.html'
import { chapter, comic } from './copymanga-enhance/common'
import { render } from './copymanga-enhance/new'
import { getPageInfo, refreshImage, windowScrollTo } from './copymanga-enhance/old'

const sessionStorageKey = `${comic}.info.${chapter}`

const renderNewPage = (info: any) => render({
  info,
  preFn: () => {
    document.body.innerHTML = html
    GM_addStyle(css)
  },
})

setTimeout(() => {
  let cacheContent = sessionStorage.getItem(sessionStorageKey)
  if (cacheContent) {
    const info = {
      prevUrl: void 0,
      nextUrl: void 0,
      menuUrl: void 0,
      ...JSON.parse(cacheContent),
    }
    return renderNewPage(info)
  }
  refreshImage(() => {
    windowScrollTo(0)
    const  info = getPageInfo()
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(info))
    renderNewPage(info)
  })
}, 25)
