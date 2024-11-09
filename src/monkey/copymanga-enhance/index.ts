import { render } from './scripts/new'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'
import store from './scripts/store'

setTimeout(() => {
  const cacheContent = store.info.get()
  if (cacheContent && cacheContent.images.length) {
    return render()
  }
  refreshImage(() => {
    windowScrollTo(0)
    const info = getPageInfo()
    store.info.save(info)
    render()
  })
}, 25)
