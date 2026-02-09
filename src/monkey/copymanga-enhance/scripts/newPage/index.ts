import { createApp, h } from './vue'
import App from './component/App'
import tailwindCss from './tailwind.css'

export const render = () => {
  const app = createApp({
    setup () {
      GM_addStyle(tailwindCss)
      return () => h(App)
    },
  })
  app.mount('#app')
}
