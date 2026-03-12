import { readonly, ref, unref } from '@scripts/gm-vue'

type Toast = {
  id: string
  content: string
  expiredAt?: number
}

const toastListRef = ref<Toast[]>([])

export default function useToastList() {
  const pushToast = (toast: Toast) => {
    if (toast.expiredAt && toast.expiredAt <= Date.now()) {
      return
    }
    const toastList = unref(toastListRef)
    toastList.push(toast)
    toastListRef.value = toastList
  }
  const removeToast = (id: string) => {
    const toastList = unref(toastListRef)
    const index = toastList.findIndex((t) => t.id === id)
    if (index !== -1) {
      toastList.splice(index, 1)
      toastListRef.value = toastList
    }
  }
  const updateToastContent = (id: string, content: string) => {
    const toastList = unref(toastListRef)
    const toast = toastList.find((t) => t.id === id)
    if (toast) {
      toast.content = content
      toastListRef.value = toastList
    }
  }
  const hasToast = (id: string) => {
    return toastListRef.value.some((t) => t.id === id)
  }
  const getToast = (id: string) => {
    const toastList = unref(toastListRef)
    return toastList.find((t) => t.id === id)
  }

  return [
    readonly(toastListRef),
    { pushToast, removeToast, updateToastContent, hasToast, getToast },
  ] as const
}
