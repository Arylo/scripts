import { ComicDirection } from './constant'
import { MixinThis } from '../types'
import storage from '../storage'

const ModeMixin = () => ({
  data: {
    mode: ComicDirection.RTL,
  },
  computed: {
    ComicDirection: () => ComicDirection,
  },
  methods: {
    selectMode (evt: InputEvent) {
      const value = (evt.target as HTMLSelectElement)?.value
      this.switchMode(value)
      storage.directionMode = value as ComicDirection
    },
    switchMode (mode: string) {
      const that = (this as any)
      that.mode = mode
    },
  },
  mounted () {
    const that = (this as any)
    that.mode = storage.directionMode
  }
})

export type ModeMixinThis = MixinThis<ReturnType<typeof ModeMixin>>

export default ModeMixin
