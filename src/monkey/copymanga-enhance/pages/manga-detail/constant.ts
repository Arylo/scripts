export enum ComicDirection {
  LTR = 'ltr',
  RTL = 'rtl',
  TTB = 'ttb',
}

export enum ClickAction {
  PREV_PAGE = 'prev_page',
  NEXT_PAGE = 'next_page',
}

export enum PageType {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
}

export const ActionZones = [{
  names: ['left', ClickAction.PREV_PAGE]
}, {
  names: ['top', 'right', ClickAction.PREV_PAGE]
}, {
  names: ['bottom', 'right', ClickAction.NEXT_PAGE]
}]
