export const genScrollTo = (el: Window | Element) => (top: number, isSmooth = false) => el.scrollTo({
  top,
  left: 0,
  behavior: isSmooth ? 'smooth' : 'auto',
})

export const comic = window.location.pathname.split('/')[2]
export const chapter = window.location.pathname.split('/')[4]

interface RGB {
  r: number,
  g: number,
  b: number,
}

const pickImageRGB = (pixels: Uint8ClampedArray): RGB => {
  const rgbMap: { r: number[], g: number[], b: number[] } = { r: [], g: [], b: [] }
  for (let i = 0; i < pixels.length; i += 4) {
    rgbMap.r.push(pixels[i])
    rgbMap.g.push(pixels[i + 1])
    rgbMap.b.push(pixels[i + 2])
  }
  return {
    r: Math.round(rgbMap.r.reduce((a, b) => a + b) / rgbMap.r.length),
    g: Math.round(rgbMap.g.reduce((a, b) => a + b) / rgbMap.g.length),
    b: Math.round(rgbMap.b.reduce((a, b) => a + b) / rgbMap.b.length),
  }
}

export const pickImageRGBs = (el: HTMLImageElement, count: number) => {
  const PICK_WIDTH = 15
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const img = el
  const validCount = Math.round(Math.max(1, count))

  const map: { left: RGB[], right: RGB[] } = {
    left: [],
    right: [],
  }
  return new Promise<typeof map>((resolve) => {
    img.setAttribute('crossOrigin', 'anonymous')
    canvas.width = img.naturalWidth || img.offsetWidth || img.width
    canvas.height = img.naturalHeight || img.offsetHeight || img.height
    const preHeight = Math.floor(canvas.height / validCount)
    ctx.drawImage(img, 0, 0)

    try {
      // Left side
      for (let index = 0; index < validCount; index++) {
        const pixels = ctx.getImageData(0, preHeight * index, PICK_WIDTH, preHeight).data
        map.left.push(pickImageRGB(pixels))
      }
      // Right side
      for (let index = 0; index < validCount; index++) {
        const pixels = ctx.getImageData(canvas.width - PICK_WIDTH, preHeight * index, PICK_WIDTH, preHeight).data
        map.right.push(pickImageRGB(pixels))
      }
    } catch (error) {
      el.removeAttribute('crossOrigin')
      console.log(error)
    }

    resolve(map)
  })
}

export const colorDistance = (rgb1: RGB, rgb2: RGB) => {
  const rDiff = rgb2.r - rgb1.r;
  const gDiff = rgb2.g - rgb1.g;
  const bDiff = rgb2.b - rgb1.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}
