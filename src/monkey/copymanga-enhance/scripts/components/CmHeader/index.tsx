import usePageInfo from "../../hooks/usePageInfo";
import { defineComponent } from "../../library/vue";
import { cmHeader } from './CmHeader.module.css'

export default defineComponent({
  setup() {
    const { valueRef } = usePageInfo()
    return () => (
      <div class={cmHeader}>
        <div>
          <a href={valueRef.value.prevUrl} class="btn">
            <span>上一话</span>
          </a>
          <a href={valueRef.value.menuUrl} class="title">
            <span>{valueRef.value.title}</span>
          </a>
          <a href={valueRef.value.nextUrl} class="btn">
            <span>下一话</span>
          </a>
        </div>
      </div>
    )
  },
})
