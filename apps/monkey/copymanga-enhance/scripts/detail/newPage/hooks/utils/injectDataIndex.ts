import { DirectionMode, PageType } from '../../constant'
import { ImageItem } from './types'

export function injectDataIndexInternal(
  list: ImageItem[],
  directionMode: DirectionMode,
): ImageItem[] {
  const newList = list.map((item, index) => {
    return {
      ...item,
      props: {
        ...item.props,
        'data-index': index + 1,
        'data-side': 'U',
      },
    }
  })
  for (let i = 0; i < newList.length; i++) {
    const [first, second] = [newList[i], newList[i + 1]]
    if (first.props.pageType === PageType.LANDSCAPE) {
      first.props['data-side'] = 'A'
      continue
    }
    if (directionMode === DirectionMode.TTB) {
      first.props['data-side'] = 'A'
      continue
    }
    if (!second) {
      first.props['data-side'] = directionMode === DirectionMode.RTL ? 'R' : 'L'
      break
    }
    if (second.props.pageType === PageType.LANDSCAPE) {
      first.props['data-side'] = directionMode === DirectionMode.RTL ? 'R' : 'L'
      second.props['data-side'] = 'A'
    } else {
      ;[first.props['data-side'], second.props['data-side']] =
        directionMode === DirectionMode.RTL ? ['R', 'L'] : ['L', 'R']
      if (directionMode === DirectionMode.RTL) {
        ;[first.props['data-index'], second.props['data-index']] = [
          second.props['data-index'],
          first.props['data-index'],
        ]
      }
    }
    i += 1
  }

  return newList
}
