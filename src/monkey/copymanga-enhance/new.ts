import { comic, genScrollTo } from "./common"

declare const Vue: any

const ComicDirection = {
  LTR: 'ltr',
  TTB: 'ttb',
}

export const render = ({ info, preFn = Function }: { info: object, preFn: Function }) => {
  preFn()
  new Vue({
    el: '#app',
    data: {
      ...info,
      mode: GM_getValue(`${comic}.direction.mode`, 'ltr'),
    },
    computed: {
      headerHeight: () => document.getElementsByClassName('header')[0].clientHeight,
      ComicDirection: () => ComicDirection,
    },
    methods: {
      imageLoaded(index: number) {
        // const that = (this as any)
        // const images = that.$refs.images as HTMLImageElement[]
        // const image = images[index]
      },
      switchMode(mode: string) {
        const that = (this as any)
        that.mode = mode
        GM_setValue(`${comic}.direction.mode`, mode)
      },
      onClick (e: PointerEvent) {
        const that = (this as any)
        const element = document.body
        const containerElement = document.getElementsByClassName('images')[0]
        const containerScrollTo = genScrollTo(containerElement)
        if (e.clientY < that.headerHeight) {
          return
        }
        const actionWidth = element.clientWidth * 0.3
        let nextAction!: 'left' | 'right'
        if (e.clientX < actionWidth) {
          nextAction = 'left'
        } else if (e.clientX > element.clientWidth - actionWidth) {
          nextAction = 'right'
        } else {
          return
        }
        if (that.mode === ComicDirection.LTR) {
          const offsetTops = [...document.getElementsByTagName('img')].map(el => el.offsetTop - that.headerHeight)
          const currentTop = containerElement.scrollTop
          for (let i = 0; i < offsetTops.length - 1; i++) {
            if (nextAction === 'left') {
              if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                containerScrollTo(offsetTops[i], true)
                break
              }
            }
            if (nextAction === 'right') {
              if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                containerScrollTo(offsetTops[i + 1])
                break
              }
            }
          }
        } else if (that.mode === ComicDirection.TTB) {
          let nextTop = nextAction === 'left' ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight
          nextTop += that.headerHeight
          nextTop = Math.max(0, nextTop)
          containerScrollTo(nextTop, true)
        }
      },
    },
  })
}
