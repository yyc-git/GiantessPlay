import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getProtocolName, getBlockName, setState, getState, getLittleManLastPosition, setLittleManLastPosition } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { computeValue } from "../json/Data"

let _isMoveEnough = (api: api, state: state) => {
    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(lastPosition => {
            return !api.isNearObject(
                api.getLittleManWorldPosition(state),
                lastPosition,
                // 2
                8
            )
        }, getLittleManLastPosition(api, state)),
        true
    )
}

let _updateHandler = (api: api, state, _) => {
    let level = getLittleManLevel(api, state)

    if (level > 0 && api.isLittleCharacterType(state) && _isMoveEnough(api, state)) {
        state = setLittleManLastPosition(api, state, api.getLittleManWorldPosition(state))

        state = api.addCurrentGunBullet(state, computeValue(level))
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
    state = api.event.on(state, api.event.getUpdateEventName(), _updateHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getUpdateEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
