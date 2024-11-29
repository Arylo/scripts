declare function GM_addStyle(content: string): any;
declare function GM_setValue(key: string, value: T): undefined;
declare function GM_getValue<T>(key: string, defaultValue: T): T
declare const GM_info: typeof console['info']
declare function GM_setClipboard(content: string, type: 'text' | 'html', callback: () => void): Promise<never>;

declare interface Window {
  GM: {
    addStyle: GM_addStyle,
    log: typeof console['log'],
    info: typeof console['info']
  },
  GM_addStyle: GM_addStyle,
  GM_setValue: GM_setValue,
  GM_getValue: GM_getValue,
  GM_setClipboard: GM_setClipboard,
}
