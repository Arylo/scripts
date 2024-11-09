import { ComicDirection } from "../../constant";
import useImagesInfo from "../../hooks/useImagesInfo";
import useMode from "../../hooks/useMode";
import useWhitePage from "../../hooks/useWhitePage";
import { computed, defineComponent, unref } from "../../library/vue";
import htmlContent from "./template.html";

export default defineComponent({
  template: htmlContent,
  setup () {
    const { valueRef: modeRef } = useMode()
    const {
      valueRef: hasWhitePage,
      toggle: toggleWhitePage,
    } = useWhitePage()
    // const { loaded } = useImagesInfo()
    const canWhitePage = computed(() => {
      if (![ComicDirection.LTR, ComicDirection.RTL].includes(unref(modeRef))) {
        return false
      }
      return true
      // return unref(loaded)
    })
    return {
      hasWhitePage,
      toggleWhitePage,
      canWhitePage,
    }
  },
})
