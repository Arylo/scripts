import usePageInfo from "../../hooks/usePageInfo";
import { computed, defineComponent, unref } from "../../library/vue";
import ImageState from "./components/ImageState";
import StateGroup from "./components/StateGroup";
import { cmBody, stateGroupContainer } from './CmBody.module.css'
import { useStateSize } from "../../hooks/useStateSize";

const STATE_REGION_SIZE = 2

export default defineComponent({
  setup() {
    const { valueRef: pageInfoRef } = usePageInfo()
    const { getStateSize, getStateSizes } = useStateSize()
    const statesRef = computed(() => {
      const { images = [] } = unref(pageInfoRef)
      return images.map((imageUrl, index) => ({
        details: {
          url: imageUrl,
          index,
        },
        COMP: ImageState,
      }))
    })
    const stateGroupRef = computed(() => {
      const states = unref(statesRef)
      const list = states
        .reduce((list, state) => {
          let currentGroupIndex = list.length - 1
          let currentGroup = list[currentGroupIndex] || []
          let curSize = getStateSizes(currentGroup)
          const stateSize = getStateSize(state)
          if (curSize + stateSize > STATE_REGION_SIZE) {
            currentGroup = []
            currentGroupIndex += 1
          }
          list[currentGroupIndex] = [...currentGroup, state]
          return list
        }, [[]] as any[][])
        .reduce<any[][]>((list, _, index, rawList) => {
          if (index % 2 === 0) return list
          list.push([rawList[index], rawList[index + 1]])
          return list
        }, [])

      return list
    })
    return () => (
      <div class={cmBody}>
        {stateGroupRef.value.map((stateGroups) => (<StateGroup>
          {stateGroups.map((stateGroup) => (<StateGroup class={stateGroupContainer}>
            {stateGroup.map(({ COMP, details }: any) => <COMP details={details} />)}
          </StateGroup>))}
        </StateGroup>))}
      </div>
    )
  },
})
