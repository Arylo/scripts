const pending = (...msg: any[]) => console.log('[ ]', ...msg)
const success = (...msg: any[]) => console.log('[√]', ...msg)
const fail = (...msg: any[]) => console.log('[x]', ...msg)
const info = (...msg: any[]) => console.log('>>>', ...msg)

const logger = {
  pending,
  success,
  fail,
  info,
}

export default logger
