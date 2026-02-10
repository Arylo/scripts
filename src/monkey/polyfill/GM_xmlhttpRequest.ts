interface GMXmlHttpResponse {
  responseText: string;
  status: number;
  statusText: string;
}

interface GMXmlHttpRequestDetails {
  method: string;
  url: string;
  onload: (response: GMXmlHttpResponse) => any;
  onerror?: (error: any) => any;
}

declare global {
  interface Window {
    GM_xmlhttpRequest(details: GMXmlHttpRequestDetails): void;
  }
}

export default window.GM_xmlhttpRequest

export function GM_xmlhttpRequestAsync(details: Omit<GMXmlHttpRequestDetails, 'onload' | 'onerror'>): Promise<GMXmlHttpResponse> {
  return new Promise((resolve, reject) => {
    window.GM_xmlhttpRequest({
      ...details,
      onload: (response) => resolve(response),
      onerror: (error) => reject(error),
    })
  })
}
