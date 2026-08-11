import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, setState } from "./Utils"
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

// let _getGetHpRatio = (fragileGrowthLevel) => {
// 	// return fragileGrowthLevel / 100 + 0.02
// 	return fragileGrowthLevel / 100 + 0.02
// }

// let _hitEffect = (api: api, state, position) => {
//     return api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
//         [
//             api.blockAPI.getBlockService(state, getParticleProtocolName(), getParticleBlockName()),
//             state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBlockName()),
//             (state, blockState) => {
//                 return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBlockName(), blockState)
//             }
//         ],
//         api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBlockName()).getParticleType(),
//         {
//             speed: 1,
//             life: 600,
//             size: 5,
//             position: position.toArray(),
//         })
// }

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    if (!api.NullableUtils.isNullable(api.findBuff(state, getName(), userData.name, api.NullableUtils.getEmpty()))) {
        userData = {
            ...userData,
            damage: userData.damage * 1.5
        }

        return Promise.resolve([state, userData])
    }


    let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())

    if (!api.NullableUtils.isNullable(buff)
        && !api.isEffect(userData.weaponValue.type)
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = computeValue(level)
        let armyValue = value * 10


        if (level > 0) {
            let fromName = userData.fromName

            if (fromName == api.getLittleManName()) {
                state = api.addLittleManHp(
                    state,
                    userData.damage * value
                )
            }
            else if (api.isArmy(state, fromName)) {
                state = api.setArmyHp(
                    state,
                    fromName,
                    api.NumberUtils.clamp(
                        api.getArmyHp(state, fromName) + userData.damage * armyValue,
                        0,
                        api.getArmyFullHp(state, fromName)
                    )
                )
            }

            // let name = userData.name

            // // if (name == api.getLittleManName()) {
            // // }
            // if (api.isArmy(state, name)) {
            //     state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
            //         return _hitEffect(api, state, damagePosition)
            //     })
            // }
            // else if (api.girl.isGirl(name)) {
            //     state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
            //         return _hitEffect(api, state, damagePosition)
            //     })
            // }
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
