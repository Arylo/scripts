export const genScrollToFn = (el: Window | Element) => (top: number, isSmooth = false) => el.scrollTo({
  top,
  left: 0,
  behavior: isSmooth ? 'smooth' : 'auto',
});
