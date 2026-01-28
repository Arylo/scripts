import GM_addStyle from '../polyfill/GM_addStyle'
import css from './style.css'

setTimeout(() => GM_addStyle(css), 25)

export {}
