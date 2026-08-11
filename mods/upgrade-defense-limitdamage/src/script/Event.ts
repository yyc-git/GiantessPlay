import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getGiantessLevel, getLittleManLevel, setState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue } from "../json/Data"


let _handleDamageHandler = (api: api, state: state, data, level, fullHp) => {
    let userData = api.NullableUtils.getExn(data.userData)

    // let level = getLittleManLevel(api, state)

    let [v1, v2] = computeValue(level)

    if (level > 0
        && api.isNotMaxForce(userData.forceSize)
    ) {
        let damage = api.NumberUtils.lessThan(userData.damage * (1 + v2), fullHp * v1)

        userData = {
            ...userData,
            damage
        }
    }

    return Promise.resolve([state, userData])
}

let _handleAfterDamageLittleManHandler = (api: api, state: state, data) => {
    return _handleDamageHandler(api, state, data, getLittleManLevel(api, state), api.getLittleManFullHp(state))
}

let _handleAfterDamageGiantessHandler = (api: api, state: state, data) => {
    let { usedGirl } = data.userData

    return _handleDamageHandler(api, state, data, getGiantessLevel(api, state, usedGirl), api.girl.getFullHp(state, usedGirl))
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.onWithUserData(state, api.event.getHandleAfterDamageLittleManEventName(), _handleAfterDamageLittleManHandler)
    state = api.event.onWithUserData(state, api.event.getHandleAfterDamageGiantessEventName(), _handleAfterDamageGiantessHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getHandleDamageLittleManEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
