import cc from "classcat";
import type { PropType } from "vue";
import { defineComponent, h, toRefs, unref } from "../../vue";
import { PageType } from "../../constant";

export type ImageItem = {
  component: ReturnType<typeof defineComponent> | string;
  props: { key: string; pageType: PageType; } & Record<string, any>;
}

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<Readonly<ImageItem[]>>,
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
    const {
      images: imagesRef,
      class: classRef,
      style: styleRef,
    } = toRefs(props)
    return () => h(
      'div',
      {
        class: cc([
          'rtl:flex ltr:flex flex-wrap justify-center',
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
              'flex justify-center basic-[100%]',
            ]),
            ...Object.fromEntries(Object.entries(componentProps).filter(([k]) => k.startsWith('data-')))
          },
          [h(component, { ...componentProps })],
        ))
    )
  },
})
