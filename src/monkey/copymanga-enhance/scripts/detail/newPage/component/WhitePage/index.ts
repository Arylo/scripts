import { defineComponent, h, mergeProps } from '@scripts/gm-vue'

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
      mergeProps({
        class: 'white-page portrait size-px',
      }, props),
    )
  },
})
