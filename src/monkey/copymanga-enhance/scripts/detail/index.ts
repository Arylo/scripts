import html from './template.html'
import { render } from './newPage'
import { getPageInfo, refreshImage, windowScrollTo } from './old'
import storage from './storage'
import GM_getResourceText from '../../../polyfill/GM_getResourceText'

const renderNewPage = async () => {
  console.info('PageInfo:', storage.pageInfo)
  windowScrollTo(0)
  document.body.innerHTML = html
  console.info('Start request vue library')
  const textContent = await GM_getResourceText('vue')
  const script = document.createElement('script')
  script.textContent = textContent
  document.head.appendChild(script)
  setTimeout(() => {
    console.info('Start render new page')
    render()
  }, 50)
}


export default () => {
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
}
