import GM_addStyle from '../polyfill/GM_addStyle'
import templateCss from './styles/template.css'

const DEFAULT_PARENT_SELECTORS = [
  ':not(li) > a',
  ':not(h1):not(h2):not(h3):not(h4):not(h5) >',
]

const DEFAULT_CODE_SELECTORS = [
  'code',
  'code *',
  'pre:not(:has(code))',
]

function parseSelectors(selectors: string[], parentSelectors: string[]) {
  const realSelectors = selectors.reduce<string[]>((list, s) => {
    for (const ps of parentSelectors) {
      list.push(`${ps} ${s}`)
    }
    return list
  }, [])
  return realSelectors
}

function parseFontString(selectors: string[]) {
  return templateCss.replace(/\*/g, selectors.join(', '))
}

setTimeout(() => {
  const fontCssContent = GM_getResourceText('font_css')
    .replace(/(\burl\(["'])/g, '$1https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/')
  GM_addStyle(fontCssContent)

  const codeSelectors = DEFAULT_CODE_SELECTORS
  const parentSelectors = DEFAULT_PARENT_SELECTORS
  const selectors = parseSelectors(codeSelectors, parentSelectors)
  switch (location.host) {
    case 'react.dev':
      selectors.push('.sp-code-editor .cm-content')
      break
    case 'w3schools.com':
    case 'www.w3schools.com':
      selectors.push('.w3-code')
      break
  }
  GM_addStyle(parseFontString(selectors))
}, 25);
