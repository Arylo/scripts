declare global {
  interface Window {
    GM_getValue<T>(key: string, defaultValue: T): T;
  }
}

export default window.GM_getValue
