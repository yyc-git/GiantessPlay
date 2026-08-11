import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { setState, getState, createState, getProtocolName, getBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue, getName } from "../json/Data"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

// let _loadSceneResourceHandler = (api: api, state, _) => {
//     state = api.load.addResourceData(state,
//         [
//             {
//                 id: getSoundResourceId(),
//                 path: [getSoundResourcePath()],
//                 type: resourceType.Audio
//             },
//         ]
//     )

//     return Promise.resolve(state)
// }

let _handleDamage = (api, state, buffService, targetName, usedGirl_, userData) => {
    let buff = api.findBuff(state, buffService.getName(), targetName, usedGirl_)

    if (!api.NullableUtils.isNullable(buff)) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let [_, v2] = computeValue(level)

        if (api.NumberUtils.isRandomRate(v2)) {
            let factor
            switch (userData.weaponValue.type) {
                case weaponType.Common:
                    factor = 0
                    break
                case weaponType.Impact:
                    factor = 0.5
                    break
                case weaponType.Explode:
                    factor = 0.75
                    break
                default:
                    factor = 1
                    break
            }

            userData = {
                ...userData,
                damage: userData.damage * factor
            }
        }
    }

    return userData
}

let _handleDamageArmyHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBlockName())

    userData = _handleDamage(api, state, buffService, userData.name, api.NullableUtils.getEmpty(), userData)

    return Promise.resolve([state, userData])
}

let _handleDamageLittleManHandler = _handleDamageArmyHandler

let _handleDamageGiantessHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let { usedGirl } = userData

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBlockName())

    userData = _handleDamage(api, state, buffService, userData.name, api.NullableUtils.return_(usedGirl), userData)

    return Promise.resolve([state, userData])
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    // state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageArmyHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageGiantessHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageLittleManHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    // state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getHandleDamageLittleManEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
