import './pages/manga-list'
import './pages/manga-index'
import './pages/manga-detail'
import { render } from './pages/manga-detail/components/Index/new'
import { getPageInfo, refreshImage, windowScrollTo } from './scripts/old'
import store from './pages/manga-detail/store'

// setTimeout(() => {
//   const cacheContent = store.info.get()
//   if (cacheContent && cacheContent.images.length) {
//     return render()
//   }
//   refreshImage(() => {
//     windowScrollTo(0)
//     const info = getPageInfo()
//     store.info.save(info)
//     render()
//   })
// }, 25)
