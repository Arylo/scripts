import templateCss from './styles/template.css'

const specialParentSelectors = [
  ':not(li) > a',
  ':not(h1):not(h2):not(h3):not(h4):not(h5) >',
]

function parseFontString(selector: string = 'code, code *, pre:not(:has(code))') {
  const selectors = selector.split(',').reduce<string[]>((list, s) => {
    for (const ps of specialParentSelectors) {
      list.push(`${ps} ${s}`)
    }
    return list
  }, [])
  return templateCss.replace(/\*/g, selectors.join(', '))
}

setTimeout(() => {
  const fontCssContent = GM_getResourceText('font_css')
    .replace(/(\burl\(["'])/g, '$1https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/')
  GM_addStyle(fontCssContent)

  let selector = undefined
  switch (location.host) {
  }
  GM_addStyle(parseFontString(selector))
}, 25);
