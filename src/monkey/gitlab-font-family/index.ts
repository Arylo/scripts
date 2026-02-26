import { GM_addStyle } from '@scripts/gm-polyfill'
import css from './style.css'

setTimeout(() => GM_addStyle(css), 25)

export {}
