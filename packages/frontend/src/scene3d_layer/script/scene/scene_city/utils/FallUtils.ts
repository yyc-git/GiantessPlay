import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"
import { isDestoryRelatedStates, isNotDamageState } from "./FSMStateUtils"

export let computeFallTime = (api: api, previousData, currentData) => {
    // return api.computeFallTime(api, previousData, currentData)
    return api.NumberUtils.clamp(api.vector3.distanceTo(currentData, previousData) / 25 * 2000, 700, 8000)
    // return 10000
    // return api.NumberUtils.clamp(api.vector3.distanceTo(currentData, previousData) / 25 * 2000, 700, 8000) * 3
}

export let isChangeToFallState = (state: state, stateMachine) => {
    return !isDestoryRelatedStates(stateMachine)
}