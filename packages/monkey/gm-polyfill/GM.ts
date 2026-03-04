import { GM_addStyle } from './GM_addStyle'

declare global {
  interface Window {
    GM?: {
      addStyle: typeof GM_addStyle
    }
  }
}

function resolveGM(): NonNullable<Window['GM']> {
  if (typeof window.GM === 'undefined') {
    window.GM = {
      addStyle: GM_addStyle,
    }
    return window.GM
  }

  window.GM.addStyle ??= GM_addStyle

  return window.GM
}

export const GM: NonNullable<Window['GM']> = {
  get addStyle() {
    return resolveGM().addStyle
  },
  set addStyle(value) {
    resolveGM().addStyle = value
  },
}
