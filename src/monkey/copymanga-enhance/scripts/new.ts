import ActionMixin from './new-vue-mixin/action'
import ImageMixin from './new-vue-mixin/image'
import InitMixin from './new-vue-mixin/init'
import ModeMixin from './new-vue-mixin/mode'

declare const Vue: any

export const render = () => {
  new Vue({
    el: '#app',
    mixins: [
      InitMixin(),
      ModeMixin(),
      ActionMixin(),
      ImageMixin(),
    ] as const,
  })
}
