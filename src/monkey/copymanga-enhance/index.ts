import css from './style.css'
import html from './template.html'
import { chapter, comic } from './scripts/common'
import { render } from './scripts/new'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'

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
    console.info('Found cache')
    const info = {
      prevUrl: void 0,
      nextUrl: void 0,
      menuUrl: void 0,
      ...JSON.parse(cacheContent),
    }
    return renderNewPage(info)
  } else {
    console.info('Non found cache')
  }
  refreshImage(() => {
    windowScrollTo(0)
    const  info = getPageInfo()
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(info))
    renderNewPage(info)
  })
}, 25)
