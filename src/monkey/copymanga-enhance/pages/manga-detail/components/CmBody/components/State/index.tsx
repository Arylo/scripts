import { defineComponent } from "../../../../../../scripts/library/vue";

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div>{slots.default ? slots.default() : undefined}</div>
    )
  }
})
