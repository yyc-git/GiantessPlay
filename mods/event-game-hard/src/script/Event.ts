import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { setState, createState, setLastHardTime } from "./Utils"

let _levelGiantessDestoyedHandler = (api: api, state: state, data) => {
    state = setLastHardTime(api, state, api.NullableUtils.getEmpty())

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLevelGiantessDestoyedEventName(), _levelGiantessDestoyedHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLevelGiantessDestoyedEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
