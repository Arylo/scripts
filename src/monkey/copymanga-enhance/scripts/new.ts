import CmHeader from './components/CmHeader'
import CmBody from './components/CmBody'
import { onMounted, ref, Vue } from "./library/vue"
import useUserAgent from "./hooks/useUserAgent"
import css from './style.css'
import html from './template.html'
import { GM_addStyle } from 'gm-polyfill/dist/GM_addStyle'

export const render = ({ preFn = (() => {}) } = {}) => {
  document.body.innerHTML = html
  GM_addStyle(css)
  preFn()
  new Vue({
    el: '#app',
    components: {
      CmHeader,
      CmBody,
    },
    setup () {
      const { platform } = useUserAgent()
      return {
        platform,
      }
    },
  })
}
