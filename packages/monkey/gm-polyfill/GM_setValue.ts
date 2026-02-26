declare global {
  interface Window {
    GM_setValue<T>(key: string, value: T): undefined;
  }
}

export function GM_setValue(...args: Parameters<Window['GM_setValue']>): ReturnType<Window['GM_setValue']> {
  if (typeof window.GM_setValue !== 'function') {
    throw new Error('GM_setValue is not available')
  }
  return window.GM_setValue(...args)
}
