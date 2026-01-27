import useKeyWatcher from "../../hooks/useKeyWatcher";
import useMouseWatcher from "../../hooks/useMouseWatcher";
import { defineComponent, Fragment, h, onMounted } from "../../vue";
import AppBody from "../AppBody";
import AppHeader from "../AppHeader";
import css from './style.css'

export default defineComponent({
  setup () {
    useKeyWatcher()
    useMouseWatcher()
    onMounted(() => {
      GM_addStyle(css)
    })
    return () => h(Fragment, [
      h(AppHeader, { class: 'app-header' }),
      h(AppBody, { class: 'app-body' }, 'Comic Content'),
    ])
  },
})
