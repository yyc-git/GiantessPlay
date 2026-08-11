import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getName, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { createState } from "./FSMState"
import { collisionPart, damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "buff-protocol/src/service/ServiceType"
import { getBuffBlockName, getBuffExcitementBlockName, getBuffProtocolName, getBuffTiredBlockName, getProtocolName, getBlockName } from "./Utils"

let _hasTiredBuff = (api: api, state, usedGirl) => {
    let { getName, getTargetName } = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffTiredBlockName())

    return api.hasBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)
}

let _hasMaxExcitementBuff = (api: api, state, usedGirl) => {
    let { getName, getTargetName } = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffExcitementBlockName())

    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(buff => {
            return buff.superPositionCount == api.NullableUtils.getExn(api.findBuffData(state, getName())).maxSuperPositionCount
            // return buff.superPositionCount >= 1
        }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
        false
    )
}

let _computeExcitementCondition = (api: api, state, usedGirl) => {
    let { getName, getTargetName } = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName())

    let factor = api.NullableUtils.getWithDefault(
        api.NullableUtils.map(buff => {
            switch (buff.superPositionCount) {
                case 1:
                    return 1
                case 2:
                case 3:
                    return 2
                default:
                    throw new Error("err")
            }
        }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
        0
    )

    // return 30 + 20 * factor
    return api.NumberUtils.lessThan(10 + 20 * factor, 100)
}

let _isCanChange = (api: api, state, usedGirl, damageType_, damage) => {
    let excitement = api.getExcitement(state, usedGirl)

    let baseFactor = api.blockAPI.getBlockState<any>(state, getProtocolName(), getBlockName()).rate
    // let rate = baseFactor * (damage / forceSize.VeryHigh2) * (excitement / 100) * api.getGirlValue(state, usedGirl).stressingRateFactor
    // let rate = baseFactor * api.getForceFactor(api.girl.getBodyHp(state, usedGirl), damage, 0.15)
    // let rate = baseFactor * api.getForceFactor(api.girl.getBodyHp(state, usedGirl), damage, 0.005)
    let rate = baseFactor * api.getForceFactor(api.girl.getBodyHp(state, usedGirl), damage, 0.025 * 1.5)
        * (excitement / 100) * api.getGirlValue(state, usedGirl).stressingRateFactor
        * api.girl.getSkillStateFactor(state, usedGirl)

    return damageType_ == damageType.Weakness && excitement >= _computeExcitementCondition(api, state, usedGirl) && api.NumberUtils.isRandomRate(rate)
}

let _handleRemainHpHandler = (api: api, state, data) => {
    if (api.isBossLevel(state)) {
        return Promise.resolve(state)
    }

    let {
        getStateMachine, collisionPart, damagePosition, fromName,
        damageType, damage, usedGirl
    } = api.NullableUtils.getExn(data.userData)

    let stateMachine = getStateMachine(state, usedGirl)

    if (
        // (!api.StateMachine.isState(stateMachine, getName())
        (!api.isControlledState(state, stateMachine)
            && !api.isChangeCrawlPoseState(state, usedGirl)
            && api.isGiantessCharacterType(state)
            && !_hasTiredBuff(api, state, usedGirl)
            && !_hasMaxExcitementBuff(api, state, usedGirl)
        )
        && _isCanChange(api, state, usedGirl, damageType, damage)
    ) {
        return api.StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
            return api.girl.setStateMachine(usedGirl)(state, stateMachine)
        }, stateMachine, createState(api)(usedGirl), api.girl.buildNameByUsedGirl(usedGirl), [collisionPart, fromName, damagePosition])
    }

    return Promise.resolve(state)
}

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getSoundResourceId(),
                path: [getSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getHandleGiantessRemainHpEventName(), _handleRemainHpHandler)
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getHandleGiantessRemainHpEventName())
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())

    return state
}
