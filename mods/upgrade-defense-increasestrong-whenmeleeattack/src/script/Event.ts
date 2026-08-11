import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getProtocolName, getBlockName, setState, getState, setLittleManOldValue, getLittleManOldValue } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { computeValue } from "../json/Data"
import { getLittleManSwipingEndEventName, getLittleManSwipingStartEventName } from "frontend/src/scene3d_layer/utils/EventUtils"

let _swipingStartHandler = (api: api, state, _) => {
    let level = getLittleManLevel(api, state)

    if (level > 0) {
        // state = setLittleManOldValue(api, state, api.getLittleManValue(state).stressingRateFactor)

        // state = api.LittleManBuildUtils.setStressingRateFactor(state, api.buildFuncData(state), (_, value) => value * (1 - computeValue(level)))
        let levelValue = computeValue(level)
        state = setLittleManOldValue(api, state, levelValue)

        state = api.LittleManBuildUtils.setStressingRateFactor(state, api.buildFuncData(state), (_, value) => value * (1 - levelValue))
    }

    return Promise.resolve(state)
}

let _swipingEndHandler = (api: api, state, _) => {
    let level = getLittleManLevel(api, state)

    if (level > 0) {
        state = api.NullableUtils.getWithDefault(
            api.NullableUtils.map(oldValue => {
                state = api.LittleManBuildUtils.setStressingRateFactor(state, api.buildFuncData(state), (_, value) => value / (1 - oldValue))
            }, getLittleManOldValue(api, state)),
            state
        )
    }

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, getLittleManSwipingStartEventName(), _swipingStartHandler)
    state = api.event.on(state, getLittleManSwipingEndEventName(), _swipingEndHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, getLittleManSwipingStartEventName())
    state = api.event.offAll(state, getLittleManSwipingEndEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
