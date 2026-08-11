import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, setState } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { getName } from "../json/Data"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

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

let _computeValue = (level) => {
    return 1.5 + 0.5 * level
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())

    if (!api.NullableUtils.isNullable(buff)
        && api.isRemoteDamage(userData.weaponValue, userData.damageType)
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = _computeValue(level)

        if (level > 0
        ) {
            // let [remoteDistance, _] = api.computeRemoteDistance(userData.weaponValue.emitterLife, userData.weaponValue.emitterSpeed)
            // remoteDistance = api.NumberUtils.lessThan(remoteDistance, 1200)

            // let ratio = api.NumberUtils.clamp(
            //     api.vector3.distanceTo(
            //         userData.damagePosition,
            //         api.getPositionByName(state, userData.fromName)
            //     ) / remoteDistance,
            //     0,
            //     1
            // ) * value

            const middleDistance = 40

            let ratio = api.NumberUtils.clamp(
                api.vector3.distanceTo(
                    userData.damagePosition,
                    api.getPositionByName(state, userData.fromName)
                ) / middleDistance,
                1 / value,
                value
            )



            userData = {
                ...userData,
                damage: Math.round(userData.damage * ratio)
            }
        }
    }

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
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageHandler)
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
