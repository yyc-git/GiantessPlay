import { state } from "../../../../type/StateType"
import { isAlive as isAliveOctreeObjectUtils, isStatic } from "./OctreeObjectUtils"
import { isAlive as isAliveLODQueueObjectUtils } from "./LODQueueObjectUtils"

export let isAlive = (state: state, name: string) => {
    if (isStatic(state, name)) {
        return isAliveOctreeObjectUtils(state, name)
    }

    return isAliveLODQueueObjectUtils(state, name)
}