import { getVueValue } from './shared'

export type { MaybeRef, MaybeRefOrGetter } from 'vue'

// Core

export const readonly = /* @__PURE__ */ getVueValue('readonly')

export const ref = /* @__PURE__ */ getVueValue('ref')

export const reactive = /* @__PURE__ */ getVueValue('reactive')

export const computed = /* @__PURE__ */ getVueValue('computed')

export const watch = /* @__PURE__ */ getVueValue('watch')

export const watchEffect = /* @__PURE__ */ getVueValue('watchEffect')

export const watchPostEffect = /* @__PURE__ */ getVueValue('watchPostEffect')

export const watchSyncEffect = /* @__PURE__ */ getVueValue('watchSyncEffect')

export const onWatcherCleanup = /* @__PURE__ */ getVueValue('onWatcherCleanup')

// Utilities

export const isRef = /* @__PURE__ */ getVueValue('isRef')

export const unref = /* @__PURE__ */ getVueValue('unref')

export const toValue = /* @__PURE__ */ getVueValue('toValue')

export const toRef = /* @__PURE__ */ getVueValue('toRef')

export const toRefs = /* @__PURE__ */ getVueValue('toRefs')

export const isProxy = /* @__PURE__ */ getVueValue('isProxy')

export const isReactive = /* @__PURE__ */ getVueValue('isReactive')

export const isReadonly = /* @__PURE__ */ getVueValue('isReadonly')

// Advanced

export const shallowRef = /* @__PURE__ */ getVueValue('shallowRef')

export const triggerRef = /* @__PURE__ */ getVueValue('triggerRef')

export const customRef = /* @__PURE__ */ getVueValue('customRef')

export const shallowReactive = /* @__PURE__ */ getVueValue('shallowReactive')

export const shallowReadonly = /* @__PURE__ */ getVueValue('shallowReadonly')

export const toRaw = /* @__PURE__ */ getVueValue('toRaw')

export const markRaw = /* @__PURE__ */ getVueValue('markRaw')

export const effectScope = /* @__PURE__ */ getVueValue('effectScope')

export const getCurrentInstance = /* @__PURE__ */ getVueValue('getCurrentInstance')

export const onScopeDispose = /* @__PURE__ */ getVueValue('onScopeDispose')

// Lifecycle

export const onMounted = /* @__PURE__ */ getVueValue('onMounted')

export const onUpdated = /* @__PURE__ */ getVueValue('onUpdated')

export const onUnmounted = /* @__PURE__ */ getVueValue('onUnmounted')

export const onBeforeMount = /* @__PURE__ */ getVueValue('onBeforeMount')

export const onBeforeUpdate = /* @__PURE__ */ getVueValue('onBeforeUpdate')

export const onBeforeUnmount = /* @__PURE__ */ getVueValue('onBeforeUnmount')

export const onErrorCaptured = /* @__PURE__ */ getVueValue('onErrorCaptured')

export const onActivated = /* @__PURE__ */ getVueValue('onActivated')

export const onDeactivated = /* @__PURE__ */ getVueValue('onDeactivated')

// Dependency Injection

export const provide = /* @__PURE__ */ getVueValue('provide')

export const inject = /* @__PURE__ */ getVueValue('inject')

export const hasInjectionContext = /* @__PURE__ */ getVueValue('hasInjectionContext')

// Helper

export const useSlots = /* @__PURE__ */ getVueValue('useSlots')

export const useTemplateRef = /* @__PURE__ */ getVueValue('useTemplateRef')

export const useId = /* @__PURE__ */ getVueValue('useId')
