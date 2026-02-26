import flow from "../../../../../utils/flow"
import WhitePage from '../component/WhitePage'
import { DirectionMode, PageType } from "../constant"
import { defineComponent, onMounted, readonly, ref, unref, watch } from "../vue"
import useDirectionMode from "./useDirectionMode"
import useImageInfoMap from "./useImageInfoMap"
import useRawImageList from "./useRawImageList"
import useWhitePage from "./useWhitePage"
import Image from "../component/Image"

type ImageItem = {
  component: ReturnType<typeof defineComponent> | string;
  props: { key: string; pageType: PageType; } & Record<string, any>;
}

export default function useImageList () {
  const rawImageListRef = useRawImageList()
  const infoMapRef = useImageInfoMap()
  const [whitePageRef] = useWhitePage()
  const [directionModeRef] = useDirectionMode()
  onMounted(() => refresh())
  watch(
    [
      whitePageRef,
      directionModeRef,
      rawImageListRef,
      infoMapRef,
    ],
    () => refresh()
  )

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
  const imagesRef = ref<ImageItem[]>([])
  function refresh () {
    const list = flow(
      unref(rawImageListRef),
      parseImages,
      addFirstWhitePage,
      injectWhitePages,
      injectDataIndex
    )
    imagesRef.value = list
  }

  return [readonly(imagesRef), refresh] as const
}
