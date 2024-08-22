import ActionMixin from "./new-vue-mixin/action"
import ImageMixin from "./new-vue-mixin/image"
import InitMixin from "./new-vue-mixin/init"
import ModeMixin from "./new-vue-mixin/mode"
import { PageInfo } from "./types"

declare const Vue: any

export const render = ({ info, preFn = Function }: { info: PageInfo, preFn: Function }) => {
  preFn()
  new Vue({
    el: '#app',
    mixins: [
      InitMixin(info),
      ModeMixin(),
      ActionMixin(),
      ImageMixin(info),
    ] as const,
  })
}
