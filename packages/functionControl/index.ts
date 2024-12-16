export function headParams<F extends (...args: any[]) => any>(fn: F, ...headArgs: Parameters<F>) {
  return (...args: Parameters<F>) => fn(...headArgs, ...args)
}

export function tailParams<F extends (...args: any[]) => any>(fn: F, ...tailArgs: Parameters<F>) {
  return (...args: Parameters<F>) => fn(...args, ...tailArgs)
}
