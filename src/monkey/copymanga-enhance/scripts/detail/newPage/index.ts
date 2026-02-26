import { createApp, h } from '@scripts/gm-vue'
import App from './component/App'
import tailwindCss from './tailwind.css'
import { GM_addStyle } from '@scripts/gm-polyfill'

export const render = () => {
  const app = createApp({
    setup () {
      GM_addStyle(tailwindCss)
      return () => h(App)
    },
  })
  app.mount('#app')
}
