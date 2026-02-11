import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import cc from 'classcat'
import { ACTION_GRID_MAP, DirectionMode, PageType } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import useImageInfoMap from "../../hooks/useImageInfoMap";
import useImageList from "../../hooks/useImageList";
import useWhitePage from "../../hooks/useWhitePage";
import { defineComponent, onMounted, unref, h, watch, ref } from "../../vue";
import Image from "../Image";
import css from './style.css'
import WhitePage from '../WhitePage';
import flow from "../../../../../../utils/flow";
import useMouseGrid from "../../hooks/useMouseGrid";

type ImageItem = {
  component: ReturnType<typeof defineComponent> | string;
  props: { key: string; pageType: PageType; } & Record<string, any>;
}

export default defineComponent({
  setup () {
    const [whitePageRef] = useWhitePage()
    const [directionModeRef] = useDirectionMode()
    const imageListRef = useImageList()
    const infoMapRef = useImageInfoMap()
    onMounted(() => {
      GM_addStyle(css)
      refresh()
    })
    watch(whitePageRef, () => refresh())
    watch(directionModeRef, () => refresh())
    watch(imageListRef, () => refresh())
    watch(infoMapRef, () => refresh())
    const onLoaded = () => {
      refresh()
    }
    const parseImages = (urls: readonly string[] = []): ImageItem[] => {
      const infoMap = unref(infoMapRef)
      return urls
        .map((src, index) => {
          const info = infoMap[index]
          const pageType: PageType = info && info.type === PageType.LANDSCAPE ? PageType.LANDSCAPE : PageType.PORTRAIT
          return {
            component: Image,
            props: {
              src,
              onLoaded,
              key: `image-${index}`,
              pageType,
            },
          }
        })
    }
    const addFirstWhitePage = (list: ImageItem[]): ImageItem[] => {
      if (list.length === 0) return list
      if (!unref(whitePageRef)) return list
      if (![DirectionMode.RTL, DirectionMode.LTR].includes(unref(directionModeRef))) return list

      let anchorIndex = -1
      for (let index = 0; index < list.length; index++) {
        const { props } = list[index]
        if (props.pageType === PageType.LANDSCAPE) {
          anchorIndex = -1
          continue
        }
        if (anchorIndex === -1) {
          anchorIndex = index
          continue
        }
        if (index - anchorIndex > 2) {
          list.splice(anchorIndex, 0, {
            component: WhitePage,
            props: { key: `white-page-${anchorIndex}`, class: 'manual', pageType: PageType.PORTRAIT },
          })
          break
        }
      }
      return list
    }
    const injectWhitePages = (list: ImageItem[]): ImageItem[] => {
      if (list.length === 0) return list
      if (![DirectionMode.RTL, DirectionMode.LTR].includes(unref(directionModeRef))) return list

      const tempList: ImageItem[][] = []
      for (let index = 0; index < list.length; index++) {
        const { props: { pageType } } = list[index]
        let lastGroupPageType = tempList.length > 0 ? tempList[tempList.length - 1][0].props.pageType : null
        if (pageType !== lastGroupPageType) {
          tempList.push([])
        }
        tempList[tempList.length - 1].push(list[index])
      }
      for (let groupIndex = 0; groupIndex < tempList.length; groupIndex++) {
        const group = tempList[groupIndex]
        if (group[0].props.pageType === PageType.LANDSCAPE) continue
        if (group.length % 2 === 0) continue
        group.push({
          component: WhitePage,
          props: { key: `white-page-group-${groupIndex}`, class: 'auto', pageType: PageType.PORTRAIT },
        })
      }
      if (
        tempList[tempList.length - 1][0].props.pageType === PageType.PORTRAIT &&
        tempList[tempList.length - 1].length % 4 !== 0
      ) {
        const groupIndex = tempList.length - 1
        const group = tempList[groupIndex]
        Array.from({ length: 4 - (group.length % 4) }).forEach((_, index) => {
          group.push({
            component: WhitePage,
            props: { key: `white-page-group-${groupIndex + index}-end`, class: 'auto end', pageType: PageType.PORTRAIT },
          })
        })
      }
      return tempList.flat();
    }
    const injectDataIndex = (list: ImageItem[]): ImageItem[] => {
      let portraitCount = 0
      return list.map((item, index) => {
        let targetIndex = index + 1
        let side = 'A'
        if (item.props.pageType === PageType.LANDSCAPE) {
          portraitCount = 0
          side = 'A'
        } else {
          portraitCount++
          if (DirectionMode.RTL === unref(directionModeRef)) {
            if (portraitCount % 2 === 0) {
              targetIndex -= 1
            } else {
              targetIndex += 1
            }
            side = portraitCount % 2 === 1 ? 'R' : 'L'
          }
          if (DirectionMode.LTR === unref(directionModeRef)) {
            side = portraitCount % 2 === 1 ? 'L' : 'R'
          }
        }
        return ({
          ...item,
          props: {
            ...item.props,
            'data-index': targetIndex,
            'data-side': side,
          },
        })
      })
    }
    const refresh = () => {
      const list = flow(
        unref(imageListRef),
        parseImages,
        addFirstWhitePage,
        injectWhitePages,
        injectDataIndex
      )
      imagesRef.value = list
    }
    const imagesRef = ref<ImageItem[]>([])

    const [mouseGridRef] = useMouseGrid()
    return () => h(
      'div',
      {
        class: cc([
          'app-body max-w-dvw',
          unref(directionModeRef),
          { 'cursor-pointer': [...ACTION_GRID_MAP.PREV, ...ACTION_GRID_MAP.NEXT].includes(unref(mouseGridRef)) },
        ])
      },
      [
        h(
          'div',
          { class: cc([
            'direction-wrapper',
            'w-dvw',
            'flex flex-wrap justify-center',
            'snap-mandatory ltr:snap-y rtl:snap-y',
          ]) },
          unref(imagesRef)
            .map(({ component, props }) => h(
              'div',
              {
                class: cc([
                  'wrapper',
                  'ltr:h-(--body-height) rtl:h-(--body-height)',
                  'ltr:snap-center rtl:snap-center',
                  'flex',
                  { 'hidden': unref(directionModeRef) === DirectionMode.TTB && component === WhitePage },
                ]),
                ...Object.fromEntries(Object.entries(props).filter(([k]) => k.startsWith('data-')))
              },
              [h(component, { ...props })],
            ))),
      ],
    )
  },
})
