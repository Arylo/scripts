const addStyle = function GM_addStyle(cssContent: string) {
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

export const GM_addStyle = ((globalThis as any).GM_addStyle ?? addStyle) as typeof addStyle
export default GM_addStyle
