export const genScrollTo = (el: Window | Element) => (top: number, isSmooth = false) => el.scrollTo({
  top,
  left: 0,
  behavior: isSmooth ? 'smooth' : 'auto',
})

export const comic = window.location.pathname.split('/')[2]
export const chapter = window.location.pathname.split('/')[4]
