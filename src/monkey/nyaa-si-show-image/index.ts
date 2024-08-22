setTimeout(() => {
  const elems = $('.col-md-5 a[title="User"]')

  if (elems.length && elems.text() === 'javsubs91') {
    const pendMKElem = $('div[markdown-text]')
    if (pendMKElem.length) {
      const matches = pendMKElem[0].innerText.match(/\[!\[.+\]\((.+)\)\]\((.+)\)/)
      if (matches) {
        pendMKElem[0].innerHTML = `<a href="${matches[2]}"><img src="${matches[1]}"></a>`
      }
    }
    const elems = $('a > img')
    if (elems.length) {
      let imgUrl = elems.attr('src')
      if (!imgUrl) return
      const linkUrl = elems.parent().attr('href')
      if (!linkUrl) return
      // console.log(imgUrl, linkUrl)
      imgUrl = imgUrl.replace('//th', '/i')
      const list = linkUrl.split('/')
      imgUrl += '/'
      imgUrl += list[list.length - 1]
      elems.attr('src', imgUrl)
      elems.on('error', function () {
        setTimeout(function () {
          elems.attr('src', imgUrl + (imgUrl.indexOf('?') === -1 ? '?' : '&') + 'refresh=' + Date.now())
        }, Number(Math.random() * 2000))
      })
    }
  }

}, 50)
