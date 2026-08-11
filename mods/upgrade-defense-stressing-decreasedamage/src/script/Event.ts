import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getGiantessLevel, setState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue } from "../json/Data"

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

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let level = getGiantessLevel(api, state, userData.usedGirl)

    let value = computeValue(level)

    // if (level > 0 && api.isGiantessCharacterType(state)
    if (level > 0 && api.isUseGirl(state, userData.usedGirl)
        && api.isStressingState(state, api.girl.getStateMachine(state, userData.usedGirl))
    ) {
        userData = {
            ...userData,
            damage: userData.damage * (1 - value)
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
    // state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    // state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    // state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
