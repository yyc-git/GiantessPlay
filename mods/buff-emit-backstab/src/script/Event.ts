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
    return 2.5 + 0.5 * level
}

let _isValidDamageType = (damageType_) => {
    switch (damageType_) {
        case damageType.Direct:
        case damageType.Range:
        case damageType.Global:
            // case damageType.Miss:
            return false
        default:
            return true
    }
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    // let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.return_(usedGirl))
    let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())

    if (!api.NullableUtils.isNullable(buff)
        && _isValidDamageType(userData.damageType)
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = _computeValue(level)

        if (level > 0
        ) {
            let name = userData.name
            let position = userData.damagePosition

            let isBack
            if (api.girl.isGirl(name)) {
                // let box = api.box3.applyMatrix4(
                //     api.box3.clone(
                //         api.girl.getGirlBox(state, usedGirl)
                //     ),
                //     api.TransformUtils.setQuaternionToMatrix4(
                //         api.matrix4.create(),
                //         api.girl.getRotation(state)
                //     )
                // )

                // let c = api.box3.getCenter(box, api.vector3.getTempVector1())
                // isBack = api.vector3.getX(position) > api.vector3.getX(c)
                isBack = api.girl.isBack(state, api.girl.getUsedGirlByName(name), userData.collisionPart, position)
            }
            else if (name == api.getLittleManName()) {
                isBack = api.littleMan.isBack(state, position)
            }
            else if (api.isCreature(state, name)) {
                isBack = api.isDamageArmyBack(state, name, position)
            }

            userData = {
                ...userData,
                damage: isBack ? Math.round(userData.damage * value) : userData.damage
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
