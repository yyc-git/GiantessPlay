import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getProtocolName, getBlockName, setState, getState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { computeValue } from "../json/Data"

let _pickPropRangeDistanceFactorForLittleManHandler = (api: api, state, _) => {
    let level = getLittleManLevel(api, state)

    return computeValue(level)
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.onForGetData(state, api.event.getPickPropRangeDistanceFactorForLittleManEventName(), _pickPropRangeDistanceFactorForLittleManHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getPickPropRangeDistanceFactorForLittleManEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
