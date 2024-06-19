const getCurrentCount = () => $('.comicContent-list > li > img').length

const getTotalCount = () => Number(document.getElementsByClassName('comicCount')[0].innerText)

const refreshImage = (cb) => {
  const nextTime = 10
  let [cur, total] = [getCurrentCount(), getTotalCount()]
  console.log(getCurrentCount(), '/', getTotalCount())
  if (total === 0 || cur < total) {
    window.scrollTo(0, document.getElementsByClassName('comicContent')[0].clientHeight, true)
    cur = getCurrentCount()
    setTimeout(() => refreshImage(cb), nextTime)
    setTimeout(() => window.scrollTo(0, 0, true), nextTime / 2)
    return
  }
  cb()
}

setTimeout(() => {
  refreshImage(() => {
    $('.comicContent-list > li > img').each((_, el) => {
      el.src = el.dataset.src
    })
  })
}, 25)