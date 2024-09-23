import usePageInfo from "../../hooks/usePageInfo";
import { defineComponent, unref } from "../../library/vue";
import htmlContent from "./template.html";

export default defineComponent({
  template: htmlContent,
  setup () {
    const { valueRef } = usePageInfo()
    return {
      ...unref(valueRef)
    }
  },
})
