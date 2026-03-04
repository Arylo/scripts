declare global {
  interface Window {
    GM_addStyle(cssContent: string): any
  }
}

export function GM_addStyle(
  ...args: Parameters<Window['GM_addStyle']>
): ReturnType<Window['GM_addStyle']> {
  if (typeof window.GM_addStyle === 'function') {
    return window.GM_addStyle(...args)
  }

  const [cssContent] = args
  const head = document.getElementsByTagName('head')[0]
  if (head) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('type', 'text/css')
    styleElement.textContent = cssContent
    head.appendChild(styleElement)
    return styleElement
  }
  return null
}
