import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, setState } from "./Utils"

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
