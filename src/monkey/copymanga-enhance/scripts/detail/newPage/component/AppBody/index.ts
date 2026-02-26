import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import cc from 'classcat'
import { ACTION_GRID_MAP, DirectionMode } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import { defineComponent, onMounted, unref, h } from "../../vue";
import css from './style.css'
import WhitePage from '../WhitePage';
import useMouseGrid from "../../hooks/useMouseGrid";
import useImageList from "../../hooks/useImageList";

export default defineComponent({
  setup () {
    onMounted(() => {
      GM_addStyle(css)
    })
    const [imagesRef] = useImageList()
    const [directionModeRef] = useDirectionMode()
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
          {
            class: cc([
              'direction-wrapper',
              'w-dvw',
              'flex flex-wrap justify-center',
              'snap-mandatory ltr:snap-y rtl:snap-y',
            ]),
          },
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
