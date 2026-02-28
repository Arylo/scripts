import { GM_addStyle } from '@scripts/gm-polyfill'
import cc from 'classcat'
import { DirectionMode, GRID_CELL_TYPE } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import { defineComponent, onMounted, unref, h } from '@scripts/gm-vue'
import css from './style.css'
import WhitePage from '../WhitePage';
import useImageList from "../../hooks/useImageList";
import useMouseType from '../../hooks/useMouseType';

export default defineComponent({
  setup () {
    onMounted(() => {
      GM_addStyle(css)
    })
    const [imagesRef] = useImageList()
    const [directionModeRef] = useDirectionMode()
    const [mouseTypeRef] = useMouseType()
    return () => h(
      'div',
      {
        id: 'app-body',
        class: cc([
          'app-body max-w-dvw',
          unref(directionModeRef),
          { 'cursor-pointer': unref(mouseTypeRef) === GRID_CELL_TYPE.PREV || unref(mouseTypeRef) === GRID_CELL_TYPE.NEXT },
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
