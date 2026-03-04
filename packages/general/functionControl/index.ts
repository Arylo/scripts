export function headParams<HeadArgs extends unknown[], RestArgs extends unknown[], R>(
  fn: (...args: [...HeadArgs, ...RestArgs]) => R,
  ...headArgs: HeadArgs
): (...args: RestArgs) => R
export function headParams<A, R>(fn: (...args: A[]) => R, ...headArgs: A[]): (...args: A[]) => R
export function headParams(fn: (...args: any[]) => any, ...headArgs: any[]) {
  return (...args: any[]) => fn(...headArgs, ...args)
}

export function tailParams<RestArgs extends unknown[], TailArgs extends unknown[], R>(
  fn: (...args: [...RestArgs, ...TailArgs]) => R,
  ...tailArgs: TailArgs
): (...args: RestArgs) => R
export function tailParams<A, R>(fn: (...args: A[]) => R, ...tailArgs: A[]): (...args: A[]) => R
export function tailParams(fn: (...args: any[]) => any, ...tailArgs: any[]) {
  return (...args: any[]) => fn(...args, ...tailArgs)
}
