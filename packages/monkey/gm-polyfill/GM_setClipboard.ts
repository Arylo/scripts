declare global {
  interface Window {
    GM_setClipboard(content: string, type: 'text' | 'html', callback: () => any): Promise<never>;
  }
}

export function GM_setClipboard(...args: Parameters<Window['GM_setClipboard']>): ReturnType<Window['GM_setClipboard']> {
  if (typeof window.GM_setClipboard !== 'function') {
    throw new Error('GM_setClipboard is not available')
  }
  return window.GM_setClipboard(...args)
}
