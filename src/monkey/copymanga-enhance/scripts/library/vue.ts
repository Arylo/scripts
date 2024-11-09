import type VueType from "vue"
import type {
  unref as unrefType,
  ref as refType,
  computed as computedType,
  provide as provideType,
  inject as injectType,
  defineComponent as defineComponentType,
  onMounted as onMountedType,
} from "vue-demi"

export const Vue = window.Vue as typeof VueType
export const unref = (Vue as any).unref as typeof unrefType
export const ref = (Vue as any).ref as typeof refType
export const computed = (Vue as any).computed as typeof computedType
export const provide = (Vue as any).provide as typeof provideType
export const inject = (Vue as any).inject as typeof injectType
export const defineComponent = (Vue as any).defineComponent as typeof defineComponentType
export const onMounted = (Vue as any).onMounted as typeof onMountedType

export default {
  unref,
  ref,
  computed,
  provide,
  inject,
  defineComponent,
  onMounted,
}
