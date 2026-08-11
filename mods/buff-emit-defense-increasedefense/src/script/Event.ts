import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, setState, getBuffProtocolName, getBuffArmyIncreaseDefenseBlockName, getBuffGiantessIncreaseDefenseBlockName, getBuffLittleManIncreaseDefenseBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue, getName } from "../json/Data"

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    // let buff = api.findBuff(state, getName(), userData.fromName, api.isUseGirl(state, usedGirl) ? usedGirl : api.NullableUtils.getEmpty())

    // let buff = api.findBuff(state, getName(), userData.name, api.isUseGirl(state, usedGirl) ? usedGirl : api.NullableUtils.getEmpty())
    let buff
    if (api.girl.isGirl(userData.name)) {
        let usedGirl = api.girl.getUsedGirlByName(userData.name)
        buff = api.findBuff(state, getName(), userData.name, usedGirl)
    }
    else {
        buff = api.findBuff(state, getName(), userData.name, api.NullableUtils.getEmpty())
    }


    if (!api.NullableUtils.isNullable(buff)) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = computeValue(level)

        if (level > 0) {
            let name = userData.name

            let promise
            if (api.girl.isGirl(name)) {
                let usedGirl = api.girl.getUsedGirlByName(userData.name)
                let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessIncreaseDefenseBlockName())

                promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), value)
            }
            else if (name == api.getLittleManName()) {
                let littleManBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffLittleManIncreaseDefenseBlockName())

                promise = littleManBuffService.addBuff(api, state, name, value)
            }
            else if (api.isArmy(state, name)) {
                let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyIncreaseDefenseBlockName())

                promise = armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), value)
            }

            return promise.then(state => [state, userData])
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
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getHandleDamageLittleManEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
