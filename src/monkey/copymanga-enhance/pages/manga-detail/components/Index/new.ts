import Container from '../Container'
import { Vue } from "../../../../scripts/library/vue"
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
      Container,
    },
  })
}
