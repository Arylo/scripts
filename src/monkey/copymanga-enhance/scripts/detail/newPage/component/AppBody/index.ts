import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import cc from 'classcat'
import { ACTION_GRID_MAP, DirectionMode } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import { defineComponent, onMounted, unref, h, ref, watch } from "../../vue";
import css from './style.css'
import useMouseGrid from "../../hooks/useMouseGrid";
import ImageGroup from "../ImageGroup";
import useTtbColumn from "../../hooks/useTtbColumn";
import useImageList from "../../hooks/useImageList";
import useImageWidth from "../../hooks/useImageWidth";
import debounce from "../../../../utils/debounce";
import { useWindowSize } from "../../hooks/useWindowSize";

export default defineComponent({
  setup () {
    onMounted(() => {
      GM_addStyle(css)
    })
    const [imagesRef] = useImageList()
    const [directionModeRef] = useDirectionMode()
    const [mouseGridRef] = useMouseGrid()
    const [imageWidthRef] = useImageWidth()
    const [ttbColumnRef] = useTtbColumn()
    const { width: windowWidthRef } = useWindowSize()

    const imageGroupHeightRef = ref(0)
    const imageGroupRef = ref<InstanceType<typeof ImageGroup> | null>(null)
    const refreshImageGroupHeight = debounce(() => {
      const list = Array.from<HTMLElement>(unref(imageGroupRef)?.$el.children ?? [])
      const height = list.reduce((acc, child) => acc + child.clientHeight, 0)
      imageGroupHeightRef.value = height
    }, 50)
    watch(
      [
        imagesRef,
        directionModeRef,
        ttbColumnRef,
        imageGroupRef,
        imageWidthRef,
        windowWidthRef,
      ], () => {
        if (DirectionMode.TTB !== unref(directionModeRef)) return
        refreshImageGroupHeight()
      }
    )

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
          {
            class: cc([
              'direction-wrapper',
              'max-h-(--body-height)',
              'flex flex-row flex-wrap',
              'overflow-x-hidden overflow-y-auto',
            ]),
          },
          [
            h(
              ImageGroup,
              {
                class: cc([
                  'ltr:hidden rtl:hidden',
                  'overflow-hidden',
                  {
                    'hidden': unref(ttbColumnRef) === 1 || unref(ttbColumnRef) === 2,
                    'basic-[33%]': unref(ttbColumnRef) === 3,
                  }
                ]),
                images: unref(imagesRef),
                style: `height: ${unref(imageGroupHeightRef)}px`,
              },
            ),
            h(
              ImageGroup,
              {
                class: cc([
                  'ltr:hidden rtl:hidden',
                  'overflow-hidden',
                  {
                    'hidden': unref(ttbColumnRef) === 1,
                    'basic-[50%]': unref(ttbColumnRef) === 2,
                    'basic-[33%]': unref(ttbColumnRef) === 3,
                  },
                ]),
                images: unref(imagesRef),
                style: `height: ${unref(imageGroupHeightRef)}px`,
              },
            ),
            h(
              ImageGroup,
              {
                class: cc([
                  {
                    'w-dvw': DirectionMode.TTB !== unref(directionModeRef),
                    'flex': unref(ttbColumnRef) === 1,
                    'basic-[50%]': DirectionMode.TTB === unref(directionModeRef) && unref(ttbColumnRef) === 2,
                    'basic-[33%]': DirectionMode.TTB === unref(directionModeRef) && unref(ttbColumnRef) === 3,
                  },
                ]),
                images: unref(imagesRef),
                ref: imageGroupRef,
              },
            ),
          ],
        )
      ],
    )
  },
})
