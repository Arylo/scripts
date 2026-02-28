import { useId } from '@scripts/gm-vue'
import useToastList from './useToastList'

export default function useToast() {
  const id = useId()
  const [_, { pushToast, removeToast, updateToastContent, getToast }] = useToastList()
  const hideToast = () => {
    removeToast(id)
  }
  const updateToast = (content: string) => {
    updateToastContent(id, content)
    return {
      hide: () => hideToast(),
      update: (newContent: string) => updateToast(newContent),
    }
  }
  const showToast = (content: string, duration?: number) => {
    const currentToast = getToast(id)
    if (currentToast) {
      return updateToastContent(id, content)
    }
    pushToast({ id, content, expiredAt: duration ? Date.now() + duration : undefined })
    return {
      hide: () => hideToast(),
      update: (newContent: string) => updateToast(newContent),
    }
  }
  return { showToast, hideToast }
}
