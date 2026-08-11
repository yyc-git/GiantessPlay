import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"

let _disposeHandler = ([getBlockStateFunc, setBlockStateFunc, createBlockStateFunc]) => (api: api, state: state, _) => {
    api.NullableUtils.forEach(geometry => {
        api.disposeGeometry(geometry)
    }, getBlockStateFunc(api, state).geometry)

    state = setBlockStateFunc(api, state, createBlockStateFunc(api))

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state, [getBlockStateFunc, setBlockStateFunc, createBlockStateFunc]) => {
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler([getBlockStateFunc, setBlockStateFunc, createBlockStateFunc]))

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
