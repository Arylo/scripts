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
  imageUrls.forEach((imageUrl, index) => {
    const currentImageInfo = imageInfos[index]
    const currentImageObjects = [{ index, url: imageUrl, type: currentImageInfo?.type ?? PageType.LOADING }]
    if (!useWhitePage && currentImageInfo?.type === PageType.PORTRAIT) {
      currentImageObjects.unshift({ index: index - 0.5, url: imageUrl, type: PageType.WHITE_PAGE })
      useWhitePage = true
    }
    currentImageObjects.forEach((obj) => {
      const latestGroup = groupList[groupList.length - 1]
      if (
        groupList.length === 0 ||
        latestGroup.length === 2 ||
        [PageType.LANDSCAPE, PageType.LOADING].includes(latestGroup?.[0].type) ||
        currentImageInfo?.type === PageType.LANDSCAPE
      ) {
        groupList.push([])
      }
      groupList[groupList.length - 1].push(obj)
    })
  })

  return groupList
}
