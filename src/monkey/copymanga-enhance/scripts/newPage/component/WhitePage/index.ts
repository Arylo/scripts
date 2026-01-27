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
