const hyperlinkResource = () => {
  const mergeRequests = $('.merge-request:not([hyperlinked])')
  mergeRequests.each((_, mergeRequestEle) => {
    const href = $('.js-prefetch-document', mergeRequestEle).attr('href')
    if (!href) return
    const resourceUrl = href.replace(/\/-\/merge_requests\/\d+$/, '')
    const rawRefEle = $('.issuable-reference', mergeRequestEle)
    const rawRefName = rawRefEle.text()
    const [resourceName, number] = rawRefName.split('!')
    rawRefEle.html(`<a href="${resourceUrl}">${resourceName}</a>!${number}`)
    $(mergeRequestEle).attr('hyperlinked', '')
  })
}

if (location.pathname.endsWith('/dashboard/merge_requests')) {
  $('.issuable-list').on('mouseenter', hyperlinkResource)
  setTimeout(hyperlinkResource, 1000)
}
