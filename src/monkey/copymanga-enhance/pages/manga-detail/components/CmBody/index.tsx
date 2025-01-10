import usePageInfo from "../../hooks/usePageInfo";
import { computed, defineComponent, unref, ref } from "../../../../scripts/library/vue";
import ImageState from "./components/ImageState";
import StateGroup from "./components/StateGroup";
import { cmBody } from './CmBody.module.css'
import useSizeChange from "../../hooks/useSizeChange";
import useBodySize from "../../hooks/useBodySize";

const MAX_COMP_SIZE = 2

export default defineComponent({
  setup() {
    const { inject } = useBodySize()
    const { valueRef: pageInfoRef } = usePageInfo()
    const statesRef = computed(() => {
      const { images = [] } = unref(pageInfoRef)
      return images.map((imageUrl, index) => ({
        details: {
          type: 'image',
          url: imageUrl,
          index,
        },
        COMP: ImageState,
      }))
    })
    const stateGroupRef = computed(() => {
      const states = unref(statesRef)
      const list: Array<typeof states[number]>[] = []
      for (const state of states) {
        if (list.length === 0) list.push([])
        if (list[list.length - 1].length === MAX_COMP_SIZE) list.push([])
        list[list.length - 1].push(state)
      }
      return list
    })
    return () => (
      <div id="body">
        <div class={cmBody} ref={e => inject(e as any)}>
          <div>
            {stateGroupRef.value.map((stateGroups) => (<StateGroup>
              {stateGroups.map(({ COMP, details }: any) => <COMP details={details} />)}
            </StateGroup>))}
          </div>
        </div>
      </div>
    )
  },
})
