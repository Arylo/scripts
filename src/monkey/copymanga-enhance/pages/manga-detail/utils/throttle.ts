function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null;

  return function (this: ThisType<any>, ...args: Parameters<T>) {
    lastArgs = args;
    if (timeoutId) return
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (lastArgs) {
        func.apply(this, lastArgs);
        lastArgs = null;
      }
    }, wait);
  } as T
}

export default throttle;
