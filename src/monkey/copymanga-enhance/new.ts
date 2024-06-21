import { comic, genScrollTo, pickImageRGBs as pickImageRGBsByElement } from "./common"

declare const Vue: any

const ComicDirection = {
  LTR: 'ltr',
  RTL: 'rtl',
  TTB: 'ttb',
}

const ClickAction = {
  PREV: 'prev',
  NEXT: 'next',
}

export const render = ({ info, preFn = Function }: { info: any, preFn: Function }) => {
  preFn()
  new Vue({
    el: '#app',
    data: {
      ...info,
      mode: GM_getValue(`${comic}.direction.mode`, 'ltr'),
      hintClasses: [],
      headerHeight: 0,
    },
    computed: {
      actionZones () {
        const that = (this as any)
        const element = document.body
        const actionWidth = element.clientWidth * 0.3
        return [{
          left: 0,
          top: 0,
          width: actionWidth,
          height: element.clientHeight - that.headerHeight,
          names: ['left', ClickAction.PREV]
        }, {
          top: 0,
          left: element.clientWidth - actionWidth,
          width: actionWidth,
          height: (element.clientHeight - that.headerHeight) * 0.4,
          names: ['top', 'right', ClickAction.PREV]
        }, {
          top: (element.clientHeight - that.headerHeight) * 0.4,
          left: element.clientWidth - actionWidth,
          width: actionWidth,
          height: (element.clientHeight - that.headerHeight) * 0.6,
          names: ['bottom', 'right', ClickAction.NEXT]
        }]
      },
      ComicDirection: () => ComicDirection,
      ClickAction: () => ClickAction,
    },
    methods: {
      async imageLoaded (e: any, index: number) {
        const that = (this as any)
        if (that.mode === ComicDirection.LTR) {
          // console.log(index, await pickImageRGBsByElement(e.target, 5))
        }
      },
      selectMode (evt: InputEvent) {
        const that = (this as any)
        const value = (evt.target as HTMLSelectElement)?.value
        console.log('switch mode', value)
        that.switchMode(value)
        GM_setValue(`${comic}.direction.mode`, value)
      },
      switchMode (mode: string) {
        const that = (this as any)
        that.mode = mode
      },
      getActionZone (evt: MouseEvent) {
        const that = (this as any)
        if (evt.clientY < that.headerHeight) {
          return
        }
        const zone = that.actionZones.find((zone: { top: number, left: number, width: number, height: number, names: string[] }) => {
          return evt.clientX >= zone.left && evt.clientX <= zone.left + zone.width && evt.clientY >= zone.top && evt.clientY <= zone.top + zone.height
        })
        return zone
      },
      onClick (evt: PointerEvent) {
        const that = (this as any)
        const zone = that.getActionZone(evt)
        if (!zone) {
          return
        }
        const element = document.body
        const containerElement = document.getElementsByClassName('images')[0]
        const containerScrollTo = genScrollTo(containerElement)

        const nextAction = [
          zone.names.includes(ClickAction.PREV) ? ClickAction.PREV : undefined,
          zone.names.includes(ClickAction.NEXT) ? ClickAction.NEXT : undefined,
        ].filter(Boolean)[0]
        if (that.mode === ComicDirection.LTR) {
          const offsetTops = [...document.getElementsByTagName('img')].map(el => el.offsetTop - that.headerHeight)
          const currentTop = containerElement.scrollTop
          for (let i = 0; i < offsetTops.length - 1; i++) {
            if (nextAction === ClickAction.PREV) {
              if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                containerScrollTo(offsetTops[i], true)
                break
              }
            }
            if (nextAction === ClickAction.NEXT) {
              if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                containerScrollTo(offsetTops[i + 1], true)
                break
              }
            }
          }
        } else if (that.mode === ComicDirection.TTB) {
          let nextTop = nextAction === ClickAction.PREV ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight
          nextTop += that.headerHeight
          nextTop = Math.max(0, nextTop)
          containerScrollTo(nextTop, true)
        }
      },
      onMouseMove(evt: MouseEvent) {
        const that = (this as any)
        const zone = that.getActionZone(evt)
        if (!zone) {
          return
        }
        that.hintClasses.splice(0, that.hintClasses.length)
        if (zone) {
          that.hintClasses.push(...zone.names)
        }
      },
      onBlur () {
        const that = (this as any)
        that.hintClasses.splice(0, that.hintClasses.length)
      },
      init() {
        const that = (this as any)
        that.headerHeight = document.getElementsByClassName("header")[0].clientHeight
      },
    },
    beforeMount () {
      const that = (this as any)
      that.init()
    },
    mounted () {
      const that = (this as any)
      window.onresize = () => {
        that.init()
      }
    },
  })
}
