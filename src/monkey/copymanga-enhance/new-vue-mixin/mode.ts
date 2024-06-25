import { comic } from "../common";
import { ComicDirection } from "../constant";
import { MixinThis } from "../types";

const ModeMixin = () => ({
  data: {
    mode: GM_getValue(`${comic}.direction.mode`, ComicDirection.RTL),
  },
  computed: {
    ComicDirection: () => ComicDirection,
  },
  methods: {
    selectMode (evt: InputEvent) {
      const value = (evt.target as HTMLSelectElement)?.value
      this.switchMode(value)
      GM_setValue(`${comic}.direction.mode`, value)
    },
    switchMode (mode: string) {
      const that = (this as any)
      that.mode = mode
    },
  }
})

export type ModeMixinThis = MixinThis<ReturnType<typeof ModeMixin>>

export default ModeMixin
