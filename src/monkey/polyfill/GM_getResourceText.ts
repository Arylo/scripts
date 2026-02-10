declare global {
  interface Window {
    GM_getResourceText(name: string): Promise<string>;
  }
}

export default window.GM_getResourceText
