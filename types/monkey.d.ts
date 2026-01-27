declare global {
  interface GMXmlHttpResponse {
    responseText: string;
    status: number;
    statusText: string;
  }

  function GM_addStyle(content: string): any;
  function GM_setValue<T>(key: string, value: T): undefined;
  function GM_getValue<T>(key: string, defaultValue: T): T;
  function GM_setClipboard(content: string, type: 'text' | 'html', callback: () => any): Promise<never>;
  function GM_getResourceText(name: string): string;
  function GM_xmlhttpRequest(details: {
    method: string;
    url: string;
    onload: (response: GMXmlHttpResponse) => any;
    onerror?: (error: any) => any;
  }): void;

  interface Window {
    GM: {
      addStyle: typeof GM_addStyle,
    };
    GM_addStyle: typeof GM_addStyle;
    GM_setValue: typeof GM_setValue;
    GM_getValue: typeof GM_getValue;
    GM_setClipboard: typeof GM_setClipboard;
    GM_getResourceText: typeof GM_getResourceText;
    GM_xmlhttpRequest: typeof GM_xmlhttpRequest;
  }
}

export {};
