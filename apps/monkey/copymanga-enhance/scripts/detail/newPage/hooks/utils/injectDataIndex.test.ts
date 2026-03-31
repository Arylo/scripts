import { describe, expect, test } from 'vitest'
import { DirectionMode, PageType } from '../../constant'
import { injectDataIndexInternal } from './injectDataIndex'
import { ImageItem } from './types'

describe('injectDataIndexInternal', () => {
  // 创建测试用的 ImageItem
  const createImageItem = (key: string, pageType: PageType): ImageItem => ({
    component: 'div',
    props: { key, pageType },
  })

  test('should handle empty list', () => {
    const result = injectDataIndexInternal([], DirectionMode.LTR)
    expect(result).toEqual([])
  })

  describe('LTR mode', () => {
    test('should handle landscape pages in LTR mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.LANDSCAPE),
        createImageItem('img-2', PageType.LANDSCAPE),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(3)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('A')
    })

    test('should handle portrait pages in LTR mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(4)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('L')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('R')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('L')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('R')
    })

    test('should handle mixed landscape and portrait pages in LTR mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.LANDSCAPE),
        createImageItem('img-4', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(5)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('L')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('R')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('A')
      expect(result[4].props['data-index']).toBe(5)
      expect(result[4].props['data-side']).toBe('L')
    })

    test('should handle LTR mode with alternating landscape and portrait pages', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.LANDSCAPE),
        createImageItem('img-3', PageType.PORTRAIT),
        createImageItem('img-4', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(5)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('L')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('A')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('L')
      expect(result[4].props['data-index']).toBe(5)
      expect(result[4].props['data-side']).toBe('R')
    })
  })

  describe('RTL mode', () => {
    test('should handle portrait pages in RTL mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(4)
      expect(result[0].props['data-index']).toBe(2) // 1+1
      expect(result[0].props['data-side']).toBe('R')
      expect(result[1].props['data-index']).toBe(1) // 2-1
      expect(result[1].props['data-side']).toBe('L')
      expect(result[2].props['data-index']).toBe(4) // 3+1
      expect(result[2].props['data-side']).toBe('R')
      expect(result[3].props['data-index']).toBe(3) // 4-1
      expect(result[3].props['data-side']).toBe('L')
    })

    test('should handle mixed landscape and portrait pages in RTL mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.LANDSCAPE),
        createImageItem('img-4', PageType.PORTRAIT),
        createImageItem('img-5', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(6)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(3) // 2+1
      expect(result[1].props['data-side']).toBe('R')
      expect(result[2].props['data-index']).toBe(2) // 3-1
      expect(result[2].props['data-side']).toBe('L')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('A')
      expect(result[4].props['data-index']).toBe(6) // 5+1
      expect(result[4].props['data-side']).toBe('R')
      expect(result[5].props['data-index']).toBe(5) // 6-1
      expect(result[5].props['data-side']).toBe('L')
    })

    test('should handle RTL mode with alternating landscape and portrait pages', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.LANDSCAPE),
        createImageItem('img-3', PageType.PORTRAIT),
        createImageItem('img-4', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(5)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('R')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('A')
      expect(result[3].props['data-index']).toBe(5) // 4+1
      expect(result[3].props['data-side']).toBe('R')
      expect(result[4].props['data-index']).toBe(4) // 5-1
      expect(result[4].props['data-side']).toBe('L')
    })
  })

  describe('TTB mode', () => {
    test('should handle TTB mode (should behave like LTR for side calculation)', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.TTB)

      expect(result).toHaveLength(2)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
    })

    test('should handle TTB mode with landscape pages', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.LANDSCAPE),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.TTB)

      expect(result).toHaveLength(3)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('A')
    })
  })

  describe('Edge cases', () => {
    test('should handle single portrait page in LTR mode', () => {
      const items: ImageItem[] = [createImageItem('img-0', PageType.PORTRAIT)]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(1)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('L')
    })

    test('should handle single portrait page in RTL mode', () => {
      const items: ImageItem[] = [createImageItem('img-0', PageType.PORTRAIT)]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(1)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('R')
    })

    test('should handle single landscape page', () => {
      const items: ImageItem[] = [createImageItem('img-0', PageType.LANDSCAPE)]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(1)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
    })

    test('should handle odd number of portrait pages in LTR mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(3)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('L')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('R')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('L')
    })

    test('should handle odd number of portrait pages in RTL mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(3)
      expect(result[0].props['data-index']).toBe(2) // 1+1
      expect(result[0].props['data-side']).toBe('R')
      expect(result[1].props['data-index']).toBe(1) // 2-1
      expect(result[1].props['data-side']).toBe('L')
      expect(result[2].props['data-index']).toBe(3) // 单独处理
      expect(result[2].props['data-side']).toBe('R')
    })

    test('should handle consecutive landscape pages', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.LANDSCAPE),
        createImageItem('img-1', PageType.LANDSCAPE),
        createImageItem('img-2', PageType.LANDSCAPE),
        createImageItem('img-3', PageType.LANDSCAPE),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(4)
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('A')
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('A')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('A')
    })

    test('should handle complex mixed scenario in LTR mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.LANDSCAPE),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.PORTRAIT),
        createImageItem('img-4', PageType.LANDSCAPE),
        createImageItem('img-5', PageType.LANDSCAPE),
        createImageItem('img-6', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.LTR)

      expect(result).toHaveLength(7)
      // 索引0: 竖版，下一个是横版
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('L')
      // 索引1: 横版
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      // 索引2-3: 两个竖版
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('L')
      expect(result[3].props['data-index']).toBe(4)
      expect(result[3].props['data-side']).toBe('R')
      // 索引4-5: 两个横版
      expect(result[4].props['data-index']).toBe(5)
      expect(result[4].props['data-side']).toBe('A')
      expect(result[5].props['data-index']).toBe(6)
      expect(result[5].props['data-side']).toBe('A')
      // 索引6: 单个竖版
      expect(result[6].props['data-index']).toBe(7)
      expect(result[6].props['data-side']).toBe('L')
    })

    test('should handle complex mixed scenario in RTL mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.LANDSCAPE),
        createImageItem('img-2', PageType.PORTRAIT),
        createImageItem('img-3', PageType.PORTRAIT),
        createImageItem('img-4', PageType.LANDSCAPE),
        createImageItem('img-5', PageType.LANDSCAPE),
        createImageItem('img-6', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(7)
      // 索引0: 竖版，下一个是横版
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('R')
      // 索引1: 横版
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      // 索引2-3: 两个竖版（交换索引）
      expect(result[2].props['data-index']).toBe(4) // 3↔4
      expect(result[2].props['data-side']).toBe('R')
      expect(result[3].props['data-index']).toBe(3) // 4↔3
      expect(result[3].props['data-side']).toBe('L')
      // 索引4-5: 两个横版
      expect(result[4].props['data-index']).toBe(5)
      expect(result[4].props['data-side']).toBe('A')
      expect(result[5].props['data-index']).toBe(6)
      expect(result[5].props['data-side']).toBe('A')
      // 索引6: 单个竖版
      expect(result[6].props['data-index']).toBe(7)
      expect(result[6].props['data-side']).toBe('R')
    })

    test('should handle portrait followed by landscape in RTL mode', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.LANDSCAPE),
        createImageItem('img-2', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(3)
      // 索引0: 竖版，下一个是横版
      expect(result[0].props['data-index']).toBe(1)
      expect(result[0].props['data-side']).toBe('R')
      // 索引1: 横版
      expect(result[1].props['data-index']).toBe(2)
      expect(result[1].props['data-side']).toBe('A')
      // 索引2: 单个竖版
      expect(result[2].props['data-index']).toBe(3)
      expect(result[2].props['data-side']).toBe('R')
    })

    test('should verify data-index uniqueness and continuity', () => {
      const items: ImageItem[] = [
        createImageItem('img-0', PageType.PORTRAIT),
        createImageItem('img-1', PageType.PORTRAIT),
        createImageItem('img-2', PageType.LANDSCAPE),
        createImageItem('img-3', PageType.PORTRAIT),
        createImageItem('img-4', PageType.PORTRAIT),
        createImageItem('img-5', PageType.PORTRAIT),
      ]

      const result = injectDataIndexInternal(items, DirectionMode.RTL)

      expect(result).toHaveLength(6)

      // 检查所有 data-index 是否唯一
      const dataIndices = result.map((item) => item.props['data-index'])
      const uniqueIndices = new Set(dataIndices)
      expect(uniqueIndices.size).toBe(6)

      // 检查排序后是否为连续值
      const sortedIndices = [...dataIndices].sort((a, b) => a - b)
      expect(sortedIndices).toEqual([1, 2, 3, 4, 5, 6])

      // 验证具体值
      expect(result[0].props['data-index']).toBe(2) // 与索引1交换
      expect(result[0].props['data-side']).toBe('R')
      expect(result[1].props['data-index']).toBe(1) // 与索引0交换
      expect(result[1].props['data-side']).toBe('L')
      expect(result[2].props['data-index']).toBe(3) // 横版
      expect(result[2].props['data-side']).toBe('A')
      expect(result[3].props['data-index']).toBe(5) // 与索引4交换
      expect(result[3].props['data-side']).toBe('R')
      expect(result[4].props['data-index']).toBe(4) // 与索引3交换
      expect(result[4].props['data-side']).toBe('L')
      expect(result[5].props['data-index']).toBe(6) // 单独处理
      expect(result[5].props['data-side']).toBe('R')
    })
  })

  test('should preserve original props', () => {
    const originalItem: ImageItem = {
      component: 'img',
      props: {
        key: 'test-img',
        pageType: PageType.PORTRAIT,
        src: 'test.jpg',
        customProp: 'customValue',
      },
    }

    const result = injectDataIndexInternal([originalItem], DirectionMode.LTR)

    expect(result).toHaveLength(1)
    expect(result[0].component).toBe('img')
    expect(result[0].props.key).toBe('test-img')
    expect(result[0].props.pageType).toBe(PageType.PORTRAIT)
    expect(result[0].props.src).toBe('test.jpg')
    expect(result[0].props.customProp).toBe('customValue')
    expect(result[0].props['data-index']).toBe(1)
    expect(result[0].props['data-side']).toBe('L')
  })
})
