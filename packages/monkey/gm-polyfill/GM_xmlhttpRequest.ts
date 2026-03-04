interface GMXmlHttpResponse {
  responseText: string
  status: number
  statusText: string
}

interface GMXmlHttpRequestDetails {
  method: string
  url: string
  onload: (response: GMXmlHttpResponse) => any
  onerror?: (error: any) => any
}

declare global {
  interface Window {
    GM_xmlhttpRequest(details: GMXmlHttpRequestDetails): void
  }
}

export function GM_xmlhttpRequest(
  ...args: Parameters<Window['GM_xmlhttpRequest']>
): ReturnType<Window['GM_xmlhttpRequest']> {
  if (typeof window.GM_xmlhttpRequest !== 'function') {
    throw new Error('GM_xmlhttpRequest is not available')
  }
  return window.GM_xmlhttpRequest(...args)
}

export function GM_xmlhttpRequestAsync(
  details: Omit<GMXmlHttpRequestDetails, 'onload' | 'onerror'>,
): Promise<GMXmlHttpResponse> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...details,
      onload: (response) => resolve(response),
      onerror: (error) => reject(error),
    })
  })
}
