import cc from "classcat";
import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import { DirectionMode } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import useImageInfoMap from "../../hooks/useImageInfoMap";
import useImageList from "../../hooks/useImageList";
import usePageInfo from "../../hooks/usePageInfo";
import useWhitePage from "../../hooks/useWhitePage";
import { defineComponent, onMounted, unref, computed, h, Fragment } from "../../vue";
import css from './style.css'
import useImageWidth from "../../hooks/useImageWidth";

export default defineComponent({
  setup () {
    const pageInfoRef = usePageInfo()
    const titleRef = computed(() => unref(pageInfoRef).title)
    const titleUrlRef = computed(() => unref(pageInfoRef).menuUrl)
    const prevUrlRef = computed(() => unref(pageInfoRef).prevUrl)
    const nextUrlRef = computed(() => unref(pageInfoRef).nextUrl)
    const imageListRef = useImageList()
    const imageInfoMapRef = useImageInfoMap()
    const loadingStatusRef = computed(() => {
      const total = unref(imageListRef).length
      const loaded = unref(imageInfoMapRef).filter(info => info).length
      return {
        total,
        loaded,
        hint: loaded === total ? '' : `已加载 (${loaded} / ${total})`,
      }
    })
    const [whitePageRef, setWhitePage] = useWhitePage()
    onMounted(() => {
      GM_addStyle(css)
    })

    const [directionModeRef, setDirectionMode] = useDirectionMode()
    const [imageWidthRef, setImageWidth] = useImageWidth()

    return () => h('div',
      {
        class: cc([
          'app-header',
          'max-w-dvw',
          'grid items-center gap-x-[5px]',
        ]),
      },
      [
        h(
          'div',
          {
            class: cc([
              'left-space',
              'flex flex-row justify-end items-center gap-x-[5px]',
            ]),
          },
          [
            unref(loadingStatusRef).hint ? h('div', { class: 'loading-hint text-white' }, unref(loadingStatusRef).hint) : h(Fragment),
            h('select', { onChange: (event: Event) => setDirectionMode((event.target as HTMLSelectElement).value as DirectionMode) }, [
              h('option', { value: DirectionMode.RTL, selected: unref(directionModeRef) === DirectionMode.RTL }, '日漫模式'),
              h('option', { value: DirectionMode.LTR, selected: unref(directionModeRef) === DirectionMode.LTR }, '普通模式'),
              h('option', { value: DirectionMode.TTB, selected: unref(directionModeRef) === DirectionMode.TTB }, '国漫模式'),
            ]),
          ],
        ),
        h(
          'a',
          {
            class: cc([
              'prev-comic',
              'text-gray text-center',
              { 'text-white cursor-pointer': unref(prevUrlRef) },
            ]),
            href: unref(prevUrlRef),
          },
          '上一页',
        ),
        h('a', { class: 'comic-title text-white cursor-pointer', href: unref(titleUrlRef) }, unref(titleRef)),
        h(
          'a',
          {
            class: cc([
              'next-comic',
              'text-gray text-center',
              { 'text-white cursor-pointer': unref(nextUrlRef) },
            ]),
            href: unref(nextUrlRef),
          },
          '下一页',
        ),
        h('div',
          {
            class: cc([
              'right-space',
              'flex flex-row justify-start items-center gap-x-[5px]',
            ]),
          },
          [
            [DirectionMode.RTL, DirectionMode.LTR].includes(unref(directionModeRef)) ?
              h('div', { class: 'white-page-toggle text-white cursor-pointer', onClick: () => setWhitePage(!unref(whitePageRef)) }, unref(whitePageRef) ? '已加空白页' : '未加空白页') :
              h(Fragment),
            [DirectionMode.TTB].includes(unref(directionModeRef)) ?
              h('select', { onChange: (event: Event) => setImageWidth(Number((event.target as HTMLSelectElement).value)) }, [
                h('option', { value: '100', selected: unref(imageWidthRef) === 100 }, '100%'),
                h('option', { value: '90', selected: unref(imageWidthRef) === 90 }, '90%'),
                h('option', { value: '80', selected: unref(imageWidthRef) === 80 }, '80%'),
                h('option', { value: '70', selected: unref(imageWidthRef) === 70 }, '70%'),
                h('option', { value: '60', selected: unref(imageWidthRef) === 60 }, '60%'),
                h('option', { value: '50', selected: unref(imageWidthRef) === 50 }, '50%'),
                h('option', { value: '40', selected: unref(imageWidthRef) === 40 }, '40%'),
              ]) :
              h(Fragment),
          ],
        ),
      ],
    )
  },
})
