export type PageInfo = {
  images: string[],
  title?: string,
  prevUrl?: string,
  nextUrl?: string,
  menuUrl?: string,
}

export type VueBaseData = Record<string, any>
export type VueBaseComputed = Record<string, Function>
export type VueBaseMethods = Record<string, Function>

export type VueMixin<D = VueBaseData, C = VueBaseComputed, M = VueBaseMethods> = {
  data?: D,
  computed?: C,
  methods?: M,
}

export type MixinThis<O extends VueMixin> = {
  [DK in keyof O['data']]: O['data'][DK];
} & {
  [CK in keyof O['computed']]: Readonly<ReturnType<O['computed'][CK]>>;
} & {
  [MK in keyof O['methods']]: O['methods'][MK];
}
