import CmHeader from '../CmHeader'
import CmBody from '../CmBody'
import { defineComponent } from "../../../../scripts/library/vue";
import css from './Container.module.css'

export default defineComponent({
  setup() {
    return () => (
      <div class={[css.container]}>
        <CmHeader />
        <CmBody />
      </div>
    )
  },
})
