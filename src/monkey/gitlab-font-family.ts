import css from './gitlab-font-family.css'
import { appendStyleElement } from './utils/appendStyleElement'

setTimeout(() => appendStyleElement(css, 'append-font'), 25)

export {}
