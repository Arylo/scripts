import GM_addStyle from '../../polyfill/GM_addStyle'
import css from './ci_cd.css';

if (location.pathname.endsWith('/-/settings/ci_cd')) {
  setTimeout(() => GM_addStyle(css), 25)
}
