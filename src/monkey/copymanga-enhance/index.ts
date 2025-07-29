import css from './style.css'
import html from './template.html'
import { render } from './scripts/new'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'
import storage from './scripts/storage'

const renderNewPage = () => {
  console.log('PageInfo:', storage.pageInfo)
  windowScrollTo(0)
  document.body.innerHTML = html
  GM_addStyle(css)
  render()
}

setTimeout(() => {
  let cacheContent = storage.pageInfo
  if (cacheContent) {
    console.info('Found cache')
    return renderNewPage()
  }
  console.info('Non found cache')
  refreshImage(() => {
    const info = getPageInfo()
    storage.pageInfo = Object.assign({
      prevUrl: void 0,
      nextUrl: void 0,
      menuUrl: void 0,
    }, info)
    renderNewPage()
  })
}, 25)
