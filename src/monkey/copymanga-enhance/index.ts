import css from './style.css'
import html from './template.html'
import { render } from './scripts/new'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'
import store from './scripts/store'

const renderNewPage = (info: any) => render({
  info,
  preFn: () => {
    document.body.innerHTML = html
    GM_addStyle(css)
  },
})

setTimeout(() => {
  const cacheContent = store.info.get()
  if (cacheContent) {
    return renderNewPage(cacheContent)
  }
  refreshImage(() => {
    windowScrollTo(0)
    const info = getPageInfo()
    store.info.save(info)
    renderNewPage(info)
  })
}, 25)
