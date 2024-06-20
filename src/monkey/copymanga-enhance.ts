import css from './copymanga-enhance.css'
import html from './copymanga-enhance.html'
import { render } from './copymanga-enhance/new'
import { getPageInfo, refreshImage, windowScrollTo } from './copymanga-enhance/old'

setTimeout(() => {
  refreshImage(() => {
    windowScrollTo(0)
    render({
      info: getPageInfo(),
      preFn: () => {
        document.body.innerHTML = html
        GM_addStyle(css)
      },
    })
  })
}, 25)
