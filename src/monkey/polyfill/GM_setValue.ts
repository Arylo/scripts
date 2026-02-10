declare global {
  interface Window {
    GM_setValue<T>(key: string, value: T): undefined;
  }
}

export default window.GM_setValue
