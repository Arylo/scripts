import { createApp, h } from './vue'
import App from './component/App'

export const render = () => {
  const app = createApp({
    setup () {
      return () => h(App)
    },
  })
  app.mount('#app')
}
