import css from './style.css';

if (location.pathname.endsWith('/-/settings/ci_cd')) {
  setTimeout(() => GM_addStyle(css), 25)
}
