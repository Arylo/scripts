import { test, expect, describe } from 'vitest'
import { imagesToImageGroups } from './utils'
import { PageType } from './constant'

describe(imagesToImageGroups.name, () => {
  test('Should group images correctly', () => {
    const imageUrls = ['image1.jpg', 'image2.jpg', 'image3.jpg']
    const imageInfos = [
      { type: PageType.LANDSCAPE },
      { type: PageType.PORTRAIT },
      { type: PageType.LANDSCAPE },
    ]
    const needWhitePage = true

    const result = imagesToImageGroups({ imageUrls, imageInfos, needWhitePage })

    expect(result).toEqual([
      [
        { type: PageType.LANDSCAPE, index: 0, url: 'image1.jpg' },
      ],
      [
        { type: PageType.WHITE_PAGE, index: 0.5, url: 'image2.jpg' },
        { type: PageType.PORTRAIT, index: 1, url: 'image2.jpg' },
      ],
      [
        { type: PageType.LANDSCAPE, index: 2, url: 'image3.jpg' },
      ],
    ])
  })
  test('Should handle empty image list', () => {
    const result = imagesToImageGroups({ imageUrls: [], imageInfos: [], needWhitePage: false })
    expect(result).toEqual([])
  })
  test('Should handle single image', () => {
    const imageUrls = ['image1.jpg']
    const imageInfos = [{ type: PageType.PORTRAIT }]
    const result = imagesToImageGroups({ imageUrls, imageInfos, needWhitePage: false })
    expect(result).toEqual([
      [
        { type: PageType.PORTRAIT, index: 0, url: 'image1.jpg' },
      ],
    ])
  })
  test('Should handle all landscape images', () => {
    const imageUrls = ['image1.jpg', 'image2.jpg']
    const imageInfos = [
      { type: PageType.LANDSCAPE },
      { type: PageType.LANDSCAPE },
    ]
    const result = imagesToImageGroups({ imageUrls, imageInfos, needWhitePage: false })
    expect(result).toEqual([
      [
        { type: PageType.LANDSCAPE, index: 0, url: 'image1.jpg' },
      ],
      [
        { type: PageType.LANDSCAPE, index: 1, url: 'image2.jpg' },
      ],
    ])
  })
  test('Should handle all portrait images with white page', () => {
    const imageUrls = ['image1.jpg', 'image2.jpg']
    const imageInfos = [
      { type: PageType.PORTRAIT },
      { type: PageType.PORTRAIT },
    ]
    const result = imagesToImageGroups({ imageUrls, imageInfos, needWhitePage: true })
    expect(result).toEqual([
      [
        { type: PageType.WHITE_PAGE, index: -0.5, url: 'image1.jpg' },
        { type: PageType.PORTRAIT, index: 0, url: 'image1.jpg' },
      ],
      [
        { type: PageType.PORTRAIT, index: 1, url: 'image2.jpg' },
      ],
    ])
  })
})
