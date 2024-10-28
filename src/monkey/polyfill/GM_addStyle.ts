import { getGMWindow } from "./GM"

const w = getGMWindow()

if (typeof w.GM_addStyle === 'undefined') {
  w.GM_addStyle = function GM_addStyle(cssContent: string) {
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

if (typeof w.GM.addStyle === 'undefined') {
  w.GM.addStyle = GM_addStyle
}
