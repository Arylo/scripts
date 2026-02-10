declare global {
  interface Window {
    GM_setClipboard(content: string, type: 'text' | 'html', callback: () => any): Promise<never>;
  }
}

export default window.GM_setClipboard
