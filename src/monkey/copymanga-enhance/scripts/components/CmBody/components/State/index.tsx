import { defineComponent } from "../../../../library/vue";
import { state } from './State.module.css'

export default defineComponent({
  setup(_, {slots}) {
    return () => (
      <div class={state}>{slots.default ? slots.default() : undefined}</div>
    )
  }
})
