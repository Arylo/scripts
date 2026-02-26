import cc from "classcat";
import { defineComponent, h } from '@scripts/gm-vue'

export default defineComponent({
  props: {
    class: {
      type: String,
      default: () => undefined,
    },
  },
  setup (props) {
    return () => h(
      'div',
      {
        ...props,
        class: cc([
          'white-page portrait size-px',
          props.class,
        ]),
      },
    )
  },
})
