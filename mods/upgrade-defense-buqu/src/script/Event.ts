import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getGiantessLevel, getGiantessOldValue, setGiantessOldValue, getLittleManLevel, getLittleManOldValue, removeLittleManOldValue, setLittleManOldValue, setState, removeGiantessOldValue } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue } from "../json/Data"

let _handleDamageLittleManHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let level = getLittleManLevel(api, state)

    let [v1, _] = computeValue(level)

    if (level > 0 && api.getLittleManHp(state) < api.getLittleManFullHp(state) * 0.2) {
        userData = {
            ...userData,
            damage: userData.damage * (1 - v1)
        }
    }

    return Promise.resolve([state, userData])
}

let _handleDamageGiantessHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let { usedGirl } = userData

    let level = getGiantessLevel(api, state, usedGirl)

    let [v1, _] = computeValue(level)

    if (level > 0
        && api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)
        && api.girl.getBodyHp(state, usedGirl) < api.girl.getFullHp(state, usedGirl) * 0.2) {
        userData = {
            ...userData,
            damage: userData.damage * (1 - v1)
        }
    }

    return Promise.resolve([state, userData])
}

let _updateLittleMan = (api, state) => {
    let level = getLittleManLevel(api, state)

    let [_, v2] = computeValue(level)

    if (level > 0) {
        if (api.getLittleManHp(state) < api.getLittleManFullHp(state) * 0.2) {
            if (api.NullableUtils.isNullable(getLittleManOldValue(api, state))) {
                state = setLittleManOldValue(api, state, v2)

                state = api.LittleManBuildUtils.setRestoreHpTime(state, api.buildFuncData(state), (_, value) => value * (1 - v2))
            }
        }
        else {
            if (!api.NullableUtils.isNullable(getLittleManOldValue(api, state))) {
                state = api.LittleManBuildUtils.setRestoreHpTime(state, api.buildFuncData(state), (_, value) => value / (1 - api.NullableUtils.getExn(getLittleManOldValue(api, state))))

                state = removeLittleManOldValue(api, state)
            }
        }
    }

    return state
}

let _updateGiantess = (api, state) => {
    let usedGirl = usedGirlEnum.PlayerGirl

    let level = getGiantessLevel(api, state, usedGirl)

    let [_, v2] = computeValue(level)

    if (level > 0 && api.isGiantessCharacterType(state)) {
        if (api.girl.getBodyHp(state, usedGirl) < api.girl.getFullHp(state, usedGirl) * 0.2) {
            if (api.NullableUtils.isNullable(getGiantessOldValue(api, state))) {
                state = setGiantessOldValue(api, state, v2)

                state = api.GiantessBuildUtils.setRestoreHpTime(state, api.buildFuncData(state), (_, value) => value * (1 - v2), usedGirl)
            }
        }
        else {
            if (!api.NullableUtils.isNullable(getGiantessOldValue(api, state))) {
                state = api.GiantessBuildUtils.setRestoreHpTime(state, api.buildFuncData(state), (_, value) => value / (1 - api.NullableUtils.getExn(getGiantessOldValue(api, state))), usedGirl)

                state = removeGiantessOldValue(api, state)
            }
        }
    }

    return state
}

let _updateHandler = (api: api, state, data) => {
    state = _updateLittleMan(api, state)
    state = _updateGiantess(api, state)

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageLittleManHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageGiantessHandler)
    state = api.event.on(state, api.event.getUpdateEventName(), _updateHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getHandleDamageLittleManEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getUpdateEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
