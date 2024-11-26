/**
 * @param {string} cssContent
 */
const addStyle = function GM_addStyle(cssContent: any) {
  if ((window as any).GM_addStyle) return (window as any).GM_addStyle(cssContent)
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

export const GM_addStyle = addStyle
export default GM_addStyle
