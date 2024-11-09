import GM_addStyle from "./GM_addStyle"
import GM_info from "./GM_info"

const {
  info = GM_info,
  log = console.log.bind(console),
  addStyle = GM_addStyle,
  ...rest
} = (globalThis as any).GM = {} as any

export const GM = {
  info,
  log,
  addStyle,
  ...rest
}

export default GM
