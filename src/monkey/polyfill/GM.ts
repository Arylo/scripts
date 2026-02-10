import GM_addStyle from './GM_addStyle'

declare global {
  interface Window {
    GM: {
      addStyle: typeof GM_addStyle,
    };
  }
}

if (typeof window.GM === 'undefined') {
  window.GM = {
    addStyle: GM_addStyle,
  }
}

window.GM.addStyle ??= GM_addStyle

export default window.GM
