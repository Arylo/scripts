import ActionMixin from "./new-vue-mixin/action"
import ImageMixin from "./new-vue-mixin/image"
import InitMixin from "./new-vue-mixin/init"
import { PageInfo } from "./types"
import SwitchMode from './components/SwitchMode'
import ToggleWhitePage from './components/ToggleWhitePage'
import { Vue } from "./library/vue"
import useUserAgent from "./hooks/useUserAgent"

export const render = ({ info, preFn = (() => {}) }: { info: PageInfo, preFn: Function }) => {
  preFn()
  new Vue({
    el: '#app',
    components: {
      SwitchMode,
      ToggleWhitePage,
    },
    mixins: [
      InitMixin(info),
      ActionMixin(),
      ImageMixin(info),
    ] as const,
    setup () {
      const { platform } = useUserAgent()
      return {
        platform,
      }
    },
  })
}
