import usePageInfo from "../../hooks/usePageInfo";
import { defineComponent } from "../../../../scripts/library/vue";
import { flex, flexCenter } from '../common.module.css'
import { cmHeader, link, title } from './CmHeader.module.css'

export default defineComponent({
  setup() {
    const { valueRef } = usePageInfo()
    return () => (
      <div class={[cmHeader, flex, flexCenter]}>
        <div>
          <a href={valueRef.value.prevUrl} class={[link]}>
            <span>上一话</span>
          </a>
          <a href={valueRef.value.menuUrl} class={[link, title]}>
            <span>{valueRef.value.title}</span>
          </a>
          <a href={valueRef.value.nextUrl} class={[link]}>
            <span>下一话</span>
          </a>
        </div>
      </div>
    )
  },
})
