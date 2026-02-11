import GM_addStyle from "../../../../../../polyfill/GM_addStyle";
import { DirectionMode } from "../../constant";
import useDirectionMode from "../../hooks/useDirectionMode";
import useImageInfoMap from "../../hooks/useImageInfoMap";
import useImageList from "../../hooks/useImageList";
import usePageInfo from "../../hooks/usePageInfo";
import useWhitePage from "../../hooks/useWhitePage";
import { defineComponent, onMounted, unref, computed, h, Fragment } from "../../vue";
import css from './style.css'

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

    return () => h('div', { class: 'app-header' }, [
      h(
        'div',
        { class: 'left-space' },
        [
          unref(loadingStatusRef).hint ? h('div', { class: 'loading-hint' }, unref(loadingStatusRef).hint) : h(Fragment),
          h('div', { class: 'white-page-toggle', onClick: () => setWhitePage(!unref(whitePageRef)) }, unref(whitePageRef) ? '已添加空白页' : '未添加空白页'),
        ],
      ),
      h(
        'a',
        { class: 'prev-comic', disabled: unref(prevUrlRef) ? undefined : '', href: unref(prevUrlRef) },
        '上一页',
      ),
      h('a', { class: 'comic-title', href: unref(titleUrlRef) }, unref(titleRef)),
      h(
        'a',
        { class: 'next-comic', disabled: unref(nextUrlRef) ? undefined : '', href: unref(nextUrlRef) },
        '下一页',
      ),
      h('div', { class: 'right-space' }, [
        h('select', { onChange: (event: Event) => setDirectionMode((event.target as HTMLSelectElement).value as DirectionMode) }, [
          h('option', { value: DirectionMode.RTL, selected: unref(directionModeRef) === DirectionMode.RTL }, '日漫模式'),
          h('option', { value: DirectionMode.LTR, selected: unref(directionModeRef) === DirectionMode.LTR }, '普通模式'),
          h('option', { value: DirectionMode.TTB, selected: unref(directionModeRef) === DirectionMode.TTB }, '国漫模式'),
        ]),
      ]),
    ])
  },
})
