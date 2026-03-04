declare global {
  interface Window {
    GM_getResourceText(name: string): Promise<string>
  }
}

export function GM_getResourceText(
  ...args: Parameters<Window['GM_getResourceText']>
): ReturnType<Window['GM_getResourceText']> {
  if (typeof window.GM_getResourceText !== 'function') {
    throw new Error('GM_getResourceText is not available')
  }
  return window.GM_getResourceText(...args)
}
