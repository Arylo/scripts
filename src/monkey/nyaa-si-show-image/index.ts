function handleUserJavsubs91() {
  const markdownElement = $('div[markdown-text]')
  if (markdownElement.length) {
    const markdownMatches = markdownElement[0].innerText.match(/\[!\[.+\]\((.+)\)\]\((.+)\)/)
    if (markdownMatches) {
      const imageUrl = markdownMatches[1]
      const targetUrl = markdownMatches[2]
      markdownElement[0].innerHTML = `<a href="${targetUrl}"><img src="${imageUrl}"></a>`
    }
  }
  const imageElements = $('a > img')
  if (imageElements.length) {
    let imageSrc = imageElements.attr('src')
    if (!imageSrc) return
    const parentLinkUrl = imageElements.parent().attr('href')
    if (!parentLinkUrl) return
    imageSrc = imageSrc.replace('//th', '/i')
    const urlSegments = parentLinkUrl.split('/')
    imageSrc += '/'
    imageSrc += urlSegments[urlSegments.length - 1]
    imageElements.attr('src', imageSrc)
    imageElements.on('error', function () {
      setTimeout(function () {
        const separator = imageSrc.indexOf('?') === -1 ? '?' : '&'
        imageElements.attr('src', `${imageSrc}${separator}refresh=${Date.now()}`)
      }, Number(Math.random() * 2000))
    })
  }
}

setTimeout(() => {
  const userLinks = $('.col-md-5 a[title="User"]')

  if (userLinks.length && userLinks.text() === 'javsubs91') {
    switch (userLinks.text()) {
      case 'javsubs91': handleUserJavsubs91()
    }
  }
}, 50)
