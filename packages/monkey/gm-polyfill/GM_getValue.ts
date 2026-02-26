declare global {
  interface Window {
    GM_getValue<T extends string | null | undefined>(key: string, defaultValue: T): T;
  }
}

export function GM_getValue(...args: Parameters<Window['GM_getValue']>): ReturnType<Window['GM_getValue']> {
  if (typeof window.GM_getValue !== 'function') {
    throw new Error('GM_getValue is not available')
  }
  return window.GM_getValue(...args)
}
