if (typeof (window as any).GM_addStyle == 'undefined') {
  (window as any).GM_addStyle = (cssContent: string) => {
    let head = document.getElementsByTagName('head')[0]
    if (head) {
      let style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.textContent = cssContent
      head.appendChild(style)
      return style
    }
    return null
  }
}
