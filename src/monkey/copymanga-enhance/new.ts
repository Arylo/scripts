import { comic, genScrollTo, pickImageRGBs as pickImageRGBsByElement } from "./common"

declare const Vue: any

const ComicDirection = {
  LTR: 'ltr',
  RTL: 'rtl',
  TTB: 'ttb',
}

const ClickAction = {
  PREV_PAGE: 'prev_page',
  NEXT_PAGE: 'next_page',
}

const PrivateKey = {
  INIT: 'init',
}

const ActionZones = [{
  names: ['left', ClickAction.PREV_PAGE]
}, {
  names: ['top', 'right', ClickAction.PREV_PAGE]
}, {
  names: ['bottom', 'right', ClickAction.NEXT_PAGE]
}]

export const render = ({ info, preFn = Function }: { info: any, preFn: Function }) => {
  preFn()
  new Vue({
    el: '#app',
    data: {
      ...info,
      mode: GM_getValue(`${comic}.direction.mode`, ComicDirection.RTL),
      actionZones: [],
      imageInfos: Array(info.images.length).fill(undefined),
      hasWhitePage: false,
    },
    computed: {
      ComicDirection: () => ComicDirection,
      ClickAction: () => ClickAction,
      ActionZones: () => ActionZones,
      canWhitePage () {
        const that = (this as any)
        if (![ComicDirection.LTR, ComicDirection.RTL].includes(that.mode)) {
          return false
        }
        return that.imageInfos.filter(Boolean).length === info.images.length
      },
    },
    methods: {
      async imageLoaded (e: any, index: number) {
        const that = (this as any)
        const el = e.target as HTMLImageElement
        that.imageInfos.splice(index, 1, {
          width: el.width,
          height: el.height,
        })
        if (that.mode === ComicDirection.LTR) {
          // console.log(index, await pickImageRGBsByElement(e.target, 5))
        }
      },
      addWhitePage () {
        const that = (this as any)
        that.hasWhitePage = true
      },
      removeWhitePage () {
        const that = (this as any)
        that.hasWhitePage = false
      },
      selectMode (evt: InputEvent) {
        const that = (this as any)
        const value = (evt.target as HTMLSelectElement)?.value
        that.switchMode(value)
        GM_setValue(`${comic}.direction.mode`, value)
      },
      switchMode (mode: string) {
        const that = (this as any)
        that.mode = mode
      },
      onActionZoneClick (zone: typeof ActionZones[0]) {
        const that = (this as any)
        const element = document.body
        const containerElement = document.getElementsByClassName('images')[0]
        const containerScrollTo = genScrollTo(containerElement)
        const { names } = zone
        const headerHeight = document.getElementsByClassName("header")[0].clientHeight
        const nextAction = [
          names.includes(ClickAction.PREV_PAGE) ? ClickAction.PREV_PAGE : undefined,
          names.includes(ClickAction.NEXT_PAGE) ? ClickAction.NEXT_PAGE : undefined,
        ].filter(Boolean)[0]
        if ([ComicDirection.LTR, ComicDirection.RTL].includes(that.mode)) {
          const offsetTops = [...document.getElementsByClassName('comic')].map(el => (el as HTMLImageElement).offsetTop - headerHeight)
          const currentTop = containerElement.scrollTop
          for (let i = 0; i < offsetTops.length - 1; i++) {
            if (nextAction === ClickAction.PREV_PAGE) {
              if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                containerScrollTo(offsetTops[i], true)
                break
              }
            }
            if (nextAction === ClickAction.NEXT_PAGE) {
              if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                containerScrollTo(offsetTops[i + 1], true)
                break
              }
            }
          }
        } else if (that.mode === ComicDirection.TTB) {
          let nextTop = nextAction === ClickAction.PREV_PAGE ?
            containerElement.scrollTop - element.clientHeight :
            containerElement.scrollTop + element.clientHeight
          nextTop += headerHeight
          nextTop = Math.max(0, nextTop)
          containerScrollTo(nextTop, true)
        }
      },
      [PrivateKey.INIT]() {
        // const that = (this as any)
      },
    },
    mounted () {
      const that = (this as any)
      window.onresize = () => {
        that[PrivateKey.INIT]()
      }
      that[PrivateKey.INIT]()
    },
  })
}
