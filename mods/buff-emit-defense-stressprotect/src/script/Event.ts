import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { setState, getState, createState, getProtocolName, getBuffArmyBlockName, getBuffGiantessBlockName, getBuffLittleManBlockName, getBuffBossBlockName } from "./Utils"
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
    let hasBuff
    if (api.hasBuff(state, buffService.getName(), targetName, usedGirl_)) {
        switch (userData.weaponValue.type) {
            case weaponType.Body:
                userData = {
                    ...userData,
                    damage: userData.damage * 0.5
                }
                break
            default:
                userData = {
                    ...userData,
                    damage: userData.damage * 0.2
                }
                break
        }

        hasBuff = true
    }
    else {
        hasBuff = false
    }

    return [userData, hasBuff]
}

let _handleDamageArmyHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBuffArmyBlockName())


    let d = _handleDamage(api, state, buffService, userData.name, api.NullableUtils.getEmpty(), userData)
    userData = d[0]
    let hasBuff = d[1]


    let buff = api.findBuff(state, getName(), userData.name, api.NullableUtils.getEmpty())

    let promise
    if (!api.NullableUtils.isNullable(buff) && userData.forceSize > api.getArmyFullHp(state, userData.name) * 0.25 && !hasBuff) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        promise = buffService.addBuff(api, state, userData.name, computeValue(level))
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => [state, userData])
}


let _handleDamageLittleManHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBuffLittleManBlockName())


    let d = _handleDamage(api, state, buffService, userData.name, api.NullableUtils.getEmpty(), userData)
    userData = d[0]
    let hasBuff = d[1]


    let buff = api.findBuff(state, getName(), userData.name, api.NullableUtils.getEmpty())

    let promise
    if (!api.NullableUtils.isNullable(buff) && userData.forceSize > api.getLittleManFullHp(state) * 0.25 && !hasBuff) {
        // if (!api.NullableUtils.isNullable(buff) && userData.forceSize > 20 && !hasBuff) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount
        // if (level > 0 && userData.forceSize > 200 * 0.25 && !hasBuff) {
        promise = buffService.addBuff(api, state, computeValue(level))
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => [state, userData])
}


let _handleDamageGiantessHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let { usedGirl } = userData

    let buffService
    if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
        buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBuffGiantessBlockName())
    }
    else {
        buffService = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBuffBossBlockName())
    }

    let d = _handleDamage(api, state, buffService, userData.name, api.NullableUtils.return_(usedGirl), userData)
    userData = d[0]
    let hasBuff = d[1]

    let buff = api.findBuff(state, getName(), userData.name, usedGirl)

    let promise
    if (!api.NullableUtils.isNullable(buff) && userData.forceSize > api.girl.getFullHp(state, usedGirl) * 0.25 && !hasBuff) {
        // if (!api.NullableUtils.isNullable(buff) && userData.forceSize > 20 && !hasBuff) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        promise = buffService.addBuff(api, state, api.NullableUtils.return_(usedGirl), computeValue(level))
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => [state, userData])
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
