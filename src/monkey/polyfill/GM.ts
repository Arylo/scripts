import '../../../types/monkey.d.ts'
import GM_addStyle from './GM_addStyle'

if (typeof window.GM === 'undefined') {
  window.GM = {
    addStyle: GM_addStyle,
  }
}

export default window.GM
