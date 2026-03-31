import { PageType } from '../../constant'

export type ImageItem = {
  component: any
  props: { key: string; pageType: PageType } & Record<string, any>
}
