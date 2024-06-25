import { genScrollTo } from "../common";
import { ActionZones, ClickAction, ComicDirection } from "../constant";
import { MixinThis } from "../types";

const ActionMixin = () => ({
  computed: {
    ClickAction: () => ClickAction,
    ActionZones: () => ActionZones,
  },
  methods: {
    onJumpPage (nextAction: ClickAction) {
      const that = (this as any)
      const element = document.body
      const containerElement = document.getElementsByClassName('images')[0]
      const containerScrollTo = genScrollTo(containerElement)
      const headerHeight = document.getElementsByClassName("header")[0].clientHeight

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
    onActionZoneClick (zone: typeof ActionZones[0]) {
      const that = (this as any)
      const { names } = zone
      const nextAction = [
        names.includes(ClickAction.PREV_PAGE) ? ClickAction.PREV_PAGE : undefined,
        names.includes(ClickAction.NEXT_PAGE) ? ClickAction.NEXT_PAGE : undefined,
      ].filter(Boolean)[0]
      that.onJumpPage(nextAction)
    },
  },
  mounted () {
    const that = (this as any)
    window.addEventListener('keyup', ({ code }) => {
      switch (code.toLowerCase()) {
        case 'ArrowLeft'.toLowerCase():
          that.prevUrl && (window.location.href = that.prevUrl)
          break;
        case 'ArrowRight'.toLowerCase():
          that.nextUrl && (window.location.href = that.nextUrl)
          break;
        case 'ArrowUp'.toLowerCase():
          that.onJumpPage(ClickAction.PREV_PAGE)
          break;
        case 'Space'.toLowerCase():
        case 'ArrowDown'.toLowerCase():
          that.onJumpPage(ClickAction.NEXT_PAGE)
          break;
        case 'ControlLeft'.toLowerCase():
          that.hasWhitePage = false;
          break;
        case 'ControlRight'.toLowerCase():
          that.hasWhitePage = true;
          break;
      }
    })
  },
})

export type ActionMixinThis = MixinThis<ReturnType<typeof ActionMixin>>

export default ActionMixin
