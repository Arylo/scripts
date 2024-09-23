import store from "../store"

const usePageInfo = () => {
  return {
    valueRef: store.info.get(),
  }
}

export default usePageInfo
