import { defineComponent } from "../../../../../../scripts/library/vue";
import { stateGroup } from './StateGroup.module.css'

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div class={stateGroup}>
        {slots.default ? slots.default() : undefined}
      </div>
    )
  },
})
