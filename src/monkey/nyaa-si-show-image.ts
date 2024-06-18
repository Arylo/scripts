setTimeout(() => {
  const userElems = $('.col-md-5 a[title="User"]')

  if (userElems.length && userElems.text() === 'javsubs91') {
    const imgElems = $('a > img')
    if (imgElems.length) {
      let imgUrl = imgElems.attr('src')
      if (!imgUrl) return
      const linkUrl = imgElems.parent().attr('href')
      if (!linkUrl) return

      if (imgUrl.includes('//th')) {
        let newImgUrl = imgUrl.replace('//th', '/i')
        const list = linkUrl.split('/')
        newImgUrl += '/'
        newImgUrl += list[list.length - 1]
        imgElems.attr('src', newImgUrl)
        imgElems.on('error', function () {
          setTimeout(function () {
            imgElems.attr('src', newImgUrl + (newImgUrl.indexOf('?') === -1 ? '?' : '&') + 'refresh=' + Date.now())
          }, Number(Math.random() * 2000))
        })
      }

    }
  }
}, 50)
