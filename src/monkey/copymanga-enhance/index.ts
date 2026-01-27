import html from './template.html'
import { render } from './scripts/newPage'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'
import storage from './scripts/storage'

const renderNewPage = () => {
  console.log('PageInfo:', storage.pageInfo)
  windowScrollTo(0)
  document.body.innerHTML = html
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://unpkg.com/vue@3/dist/vue.global.prod.js',
    onload: (res) => {
      const script = document.createElement('script')
      script.textContent = res.responseText
      document.head.appendChild(script)
      setTimeout(() => {
        render()
      }, 50)
    },
  })
  // render()
}

setTimeout(() => {
  let cacheContent = storage.pageInfo
  if (cacheContent?.images.length) {
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
