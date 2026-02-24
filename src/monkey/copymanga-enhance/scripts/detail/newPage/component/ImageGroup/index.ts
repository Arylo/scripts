import cc from "classcat";
import type { PropType } from "vue";
import { defineComponent, h, toRefs, unref } from "../../vue";
import { DirectionMode, PageType } from "../../constant";
import WhitePage from "../WhitePage";
import useDirectionMode from "../../hooks/useDirectionMode";

export type ImageItem = {
  component: ReturnType<typeof defineComponent> | string;
  props: { key: string; pageType: PageType; } & Record<string, any>;
}

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<ImageItem[]>,
      required: true,
    },
    class: {
      type: String,
      default: () => undefined,
    },
    style: {
      type: String,
      default: () => undefined,
    },
  },
  setup (props) {
    const [directionModeRef] = useDirectionMode()
    const {
      images: imagesRef,
      class: classRef,
      style: styleRef,
    } = toRefs(props)
    return () => h(
      'div',
      {
        class: cc([
          'flex flex-wrap justify-center',
          'snap-mandatory ltr:snap-y rtl:snap-y',
          unref(classRef),
        ]),
        style: unref(styleRef),
      },
      unref(imagesRef)
        .map(({ component, props: componentProps = {} }) => h(
          'div',
          {
            class: cc([
              'wrapper',
              'ltr:h-(--body-height) rtl:h-(--body-height)',
              'ltr:snap-center rtl:snap-center',
              'flex',
              { 'hidden': unref(directionModeRef) === DirectionMode.TTB && component === WhitePage },
            ]),
            ...Object.fromEntries(Object.entries(componentProps).filter(([k]) => k.startsWith('data-')))
          },
          [h(component, { ...componentProps })],
        ))
    )
  },
})
