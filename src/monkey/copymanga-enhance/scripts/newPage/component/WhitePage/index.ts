import GM_addStyle from "../../../../../polyfill/GM_addStyle";
import { defineComponent, onMounted } from "../../vue";
import css from './style.css'

export default defineComponent({
  setup () {
    onMounted(() => {
      GM_addStyle(css)
    })
    return {}
  },
  template: '<div class="white-page portrait"></div>',
})
