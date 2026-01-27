import '../../../types/monkey.d.ts'

if (typeof window.GM === 'undefined') {
  window.GM = {
    addStyle: GM_addStyle,
  }
}

export function getGMWindow () { return window }
