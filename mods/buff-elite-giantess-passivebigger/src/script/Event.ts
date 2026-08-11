import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { setState, getState, createState } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { getBlockName, getProtocolName } from "./Utils";

let _getPassiveHeightIncrease = (api: api, excitement: number) => {
    // return Math.round(excitement / 5)
    // return excitement / 5
    // return excitement / 5 * 2.5
    // return api.NumberUtils.greaterThan(excitement / 20 * 2.5, 0.2)
    return api.NumberUtils.greaterThan(excitement / 20 * 20, 1)
}

let _updateGirlScale = (api: api, state: state, name) => {
    let data = api.scaleEliteGiantess(api, state, sizeY => {
        return sizeY + getState(api, state).customData.increaseHeight
    }, [api.getArmyTransformByName(state, name), api.getArmyBoxByName(state, name)], name)
    state = data[0]

    return state
}

let _destroyedHanlder = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBlockName())

    if (api.hasBuff(state, buffService.getName(), userData.fromName, api.NullableUtils.getEmpty())) {
        state = setState(api, state, {
            ...getState(api, state),
            customData: {
                increaseHeight: _getPassiveHeightIncrease(api, api.getExcitementByName(state, userData.toName))
            }
        })

        state = _updateGirlScale(api, state, userData.fromName)
    }


    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.getDestroyedEventName(), _destroyedHanlder)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.getDestroyedEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
