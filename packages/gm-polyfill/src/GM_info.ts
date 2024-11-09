export const GM_info = typeof (globalThis as any).GM_info !== 'undefined' ? (globalThis as any).GM_info : console.info.bind(console)
export default GM_info
