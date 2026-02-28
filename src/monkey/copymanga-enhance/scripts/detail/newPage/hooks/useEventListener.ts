import { onBeforeUnmount, onMounted, toValue, unref, type MaybeRef, type MaybeRefOrGetter } from '@scripts/gm-vue'

interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}
export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap
export type ShadowRootEventName = keyof ShadowRootEventMap

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

function useEventListener<E extends keyof WindowEventMap>(
  event: MaybeRefOrGetter<E>,
  listener: MaybeRef<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: MaybeRefOrGetter<E>,
  listener: MaybeRef<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: MaybeRefOrGetter<E>,
  listener: MaybeRef<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<E extends keyof ShadowRootEventMap>(
  target: MaybeRefOrGetter<ShadowRoot | null | undefined>,
  event: MaybeRefOrGetter<E>,
  listener: MaybeRef<(this: ShadowRoot, ev: ShadowRootEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeRefOrGetter<HTMLElement> | null | undefined,
  event: MaybeRefOrGetter<E>,
  listener: MaybeRef<(this: HTMLElement, ev: HTMLElementEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<Names extends string, EventType = Event>(
  target: MaybeRefOrGetter<InferEventTarget<Names> | null | undefined>,
  event: MaybeRefOrGetter<Names>,
  listener: MaybeRef<GeneralEventListener<EventType>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function
function useEventListener<EventType = Event>(
  target: MaybeRefOrGetter<EventTarget> | null | undefined,
  event: MaybeRefOrGetter<string>,
  listener: MaybeRef<GeneralEventListener<EventType>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Function

function useEventListener(...args: unknown[]): Function {
  let target: MaybeRefOrGetter<EventTarget | null | undefined>
  let event: MaybeRefOrGetter<string>
  let listener: MaybeRef<GeneralEventListener>
  let options: MaybeRefOrGetter<boolean | AddEventListenerOptions> | undefined

  if (args.length >= 2 && (typeof args[0] === 'string' || typeof args[0] === 'function')) {
    target = window
    event = args[0] as MaybeRefOrGetter<string>
    listener = args[1] as MaybeRef<GeneralEventListener>
    options = args[2] as MaybeRefOrGetter<boolean | AddEventListenerOptions> | undefined
  }
  else {
    target = args[0] as MaybeRefOrGetter<EventTarget | null | undefined>
    event = args[1] as MaybeRefOrGetter<string>
    listener = args[2] as MaybeRef<GeneralEventListener>
    options = args[3] as MaybeRefOrGetter<boolean | AddEventListenerOptions> | undefined
  }

  let cleanup = () => {}

  const register = () => {
    const element = toValue(target)
    const eventName = toValue(event)
    const eventListener = unref(listener)
    const eventOptions = options === undefined ? undefined : toValue(options)

    if (!element || !eventName || !eventListener)
      return () => {}

    element.addEventListener(eventName, eventListener as EventListener, eventOptions)

    return () => {
      element.removeEventListener(eventName, eventListener as EventListener, eventOptions)
    }
  }

  const stop = () => {
    cleanup()
    cleanup = () => {}
  }

  onMounted(() => {
    stop()
    cleanup = register()
  })

  onBeforeUnmount(stop)

  return stop
}

export default useEventListener
