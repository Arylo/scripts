const getCurrentCount = () => $('.comicContent-list > li > img').length

const getTotalCount = () => Number((document.getElementsByClassName('comicCount')[0] as HTMLDivElement).innerText)

const weScrollTo = (top: number, isSmooth = false) => window.scrollTo({
  top,
  left: 0,
  behavior: isSmooth ? 'smooth' : 'instant',
})

const refreshImage = (cb: Function) => {
  const nextTime = 10
  let [cur, total] = [getCurrentCount(), getTotalCount()]
  console.log('Process:', getCurrentCount(), '/', getTotalCount())
  if (total === 0 || cur < total) {
    weScrollTo(document.getElementsByClassName('comicContent')[0].clientHeight, true)
    cur = getCurrentCount()
    setTimeout(() => refreshImage(cb), nextTime)
    setTimeout(() => weScrollTo(0), nextTime / 2)
    return
  }
  cb()
}

setTimeout(() => {
  refreshImage(() => {
    weScrollTo(0)
    $<HTMLImageElement>('.comicContent-list > li > img').each((_, el) => {
      $(el).attr('src', $(el).data('src'))
    })
  })
}, 25)
