import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { setState, getState, createState } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { getBlockName, getProtocolName } from "./Utils";
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType";

// let _getPassiveHeightIncrease = (api: api, excitement: number) => {
//     // return Math.round(excitement / 5)
//     // return excitement / 5
//     // return excitement / 5 * 2.5
//     return api.NumberUtils.greaterThan(excitement / 20 * 2.5, 0.2)
// }

let _updateGirlScale = (api: api, state: state, name) => {
    let data = api.scaleEliteGiantess(api, state, sizeY => {
        return sizeY + getState(api, state).customData.increaseHeight
    }, [api.getArmyTransformByName(state, name), api.getArmyBoxByName(state, name)], name)
    state = data[0]

    return state
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBlockName())

    if (api.hasBuff(state, buffService.getName(), userData.name, api.NullableUtils.getEmpty())
        && userData.damage > 0
    ) {
        // let increasedHeight = api.NumberUtils.clamp(userData.damage / forceSize.Middle, 0.2, 10)
        // let increasedHeight = api.NumberUtils.clamp(userData.damage / forceSize.Middle * 2, 0.2, 10)
        // let increasedHeight = api.NumberUtils.lessThan((userData.damage / forceSize.Middle) * 2, 10)
        // let increasedHeight = api.NumberUtils.clamp((userData.damage / forceSize.Middle) * 2, 1, 10)
        // let increasedHeight = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 40, 1, 10)

        // let increasedHeight = api.NumberUtils.clamp((userData.damage / api.getArmyFullHp(state, userData.name)) * 0.2 * api.getHeightByBox(userData.box), 0.2, api.getHeightByBox(userData.box) * 0.1) * 2

        let height = api.getHeightByBox(userData.box)
        // let increasedHeight = api.NumberUtils.clamp((userData.damage / api.getArmyFullHp(state, userData.name)) * 0.2 * height, api.NumberUtils.greaterThan(height * 0.01, 0.4), height * 0.1)
        height = api.NumberUtils.clamp(height, 1, 600)
        let increasedHeight = api.NumberUtils.clamp((userData.damage / api.getArmyFullHp(state, userData.name)) * 0.5 * height, api.NumberUtils.greaterThan(height * 0.005, 0.4), height * 0.1)

        state = setState(api, state, {
            ...getState(api, state),
            customData: {
                increaseHeight: increasedHeight
            }
        })

        state = _updateGirlScale(api, state, userData.name)
    }


    return Promise.resolve([state, userData])

}

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    // state = api.event.offAll(state, api.getDestroyedEventName())
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
