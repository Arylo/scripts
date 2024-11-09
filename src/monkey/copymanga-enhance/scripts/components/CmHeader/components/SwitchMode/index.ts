import useMode from "../../../../hooks/useMode";
import { ComicDirection } from "../../../../constant";
import htmlContent from "./template.html";
import { defineComponent } from "../../../../library/vue";

export default defineComponent({
  template: htmlContent,
  setup () {
    const {
      valueRef: modeRef,
      switch: switchMode,
    } = useMode()
    const selectMode = (evt: InputEvent) => {
      const value = (evt.target as HTMLSelectElement)?.value as ComicDirection
      switchMode(value)
    }
    return {
      selectMode,
      switchMode,
      ComicDirection,
      mode: modeRef,
    }
  },
})
