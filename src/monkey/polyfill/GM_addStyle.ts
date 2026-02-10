declare global {
  interface Window {
    GM_addStyle(cssContent: string): any;
  }
}


if (typeof window.GM_addStyle === 'undefined') {
  window.GM_addStyle = function GM_addStyle(cssContent) {
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
}

export default window.GM_addStyle
