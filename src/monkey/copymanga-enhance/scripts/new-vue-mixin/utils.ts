import { PageType } from './constant'

type imagesToImageGroupsOptions = {
  imageUrls: string[],
  imageInfos: {type: PageType}[],
  needWhitePage: boolean,
}

export function imagesToImageGroups ({
  imageUrls = [],
  imageInfos = [],
  needWhitePage = false,
}: imagesToImageGroupsOptions) {
  const groupList: { type: PageType, index: number, url: string }[][] = []
  let useWhitePage = !needWhitePage
  const currentImageList = imageUrls.map((imageUrl, index) => {
    const currentImageInfo = imageInfos[index]
    const currentImageObject = { index, url: imageUrl, type: currentImageInfo?.type ?? PageType.LOADING }
    return currentImageObject
  })
  if (needWhitePage) {
    currentImageList.forEach((imageObject, index) => {
      if (useWhitePage) return
      if (imageObject.type !== PageType.PORTRAIT) return
      if (currentImageList[index + 1]?.type === PageType.PORTRAIT) {
        currentImageList.splice(index, 0, {
          ...imageObject,
          index: index - 0.5,
          type: PageType.WHITE_PAGE,
        })
        useWhitePage = true
      }
    })
  }
  currentImageList.forEach((imageObject) => {
    const latestGroup = groupList[groupList.length - 1]
    if (
      groupList.length === 0 ||
      latestGroup.length === 2 ||
      [PageType.LANDSCAPE, PageType.LOADING].includes(latestGroup?.[0].type) ||
      imageObject.type === PageType.LANDSCAPE
    ) {
      groupList.push([])
    }
    groupList[groupList.length - 1].push(imageObject)
  })

  return groupList
}
