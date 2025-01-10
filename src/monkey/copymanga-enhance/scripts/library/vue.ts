import type VueType from "vue"
import type {
  unref as unrefType,
  ref as refType,
  computed as computedType,
  provide as provideType,
  inject as injectType,
  watch as watchType,
  defineComponent as defineComponentType,
  onMounted as onMountedType,
  onUnmounted as onUnmountedType,
} from "vue-demi"

export const Vue = window.Vue as typeof VueType
export const unref = (Vue as any).unref as typeof unrefType
export const ref = (Vue as any).ref as typeof refType
export const computed = (Vue as any).computed as typeof computedType
export const provide = (Vue as any).provide as typeof provideType
export const inject = (Vue as any).inject as typeof injectType
export const watch = (Vue as any).watch as typeof watchType
export const defineComponent = (Vue as any).defineComponent as typeof defineComponentType
export const onMounted = (Vue as any).onMounted as typeof onMountedType
export const onUnmounted = (Vue as any).onUnmounted as typeof onUnmountedType

export default {
  unref,
  ref,
  computed,
  provide,
  inject,
  watch,
  defineComponent,
  onMounted,
  onUnmounted,
}
export type * from 'vue'

import type { Ref } from 'vue'
export type MaybeRef<T> = T | Ref<T>
