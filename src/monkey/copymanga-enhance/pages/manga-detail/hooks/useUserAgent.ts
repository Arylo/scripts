import { computed, unref } from "../../../scripts/library/vue"

const useUserAgent = () => {
  const valueRef = computed(() => navigator.userAgent)
  const isWindows = computed(() => valueRef.value.includes('Windows NT'))
  const isMac = computed(() => valueRef.value.includes(' Mac OS '))
  const platform = computed(() => {
    if (unref(isWindows)) return 'windows'
    if (unref(isMac)) return 'mac'
    return 'unknown-platform'
  })
  return {
    valueRef,
    isWindows,
    isMac,
    platform,
  }
}

export default useUserAgent
