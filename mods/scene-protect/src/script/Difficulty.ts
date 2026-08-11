import { state as blockState } from "event-game-protocol/src/state/StateType"
import { armyValue, eliteGiantessValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { getEventGameProtectEliteBlockName, getEventGameProtocolName } from "./Utils"

export let updateArmyValue = <value extends armyValue>(api: api, state: state, armyValue: value): value => {
    return armyValue
}

let _updateEliteGiantessValueByTriggerCount = <value extends armyValue & eliteGiantessValue>(api: api, state: state, armyValue: value): value => {
    // let judgeValue = Math.floor(api.blockAPI.getBlockState<blockState>(state, getEventGameProtocolName(), getEventGameProtectEliteBlockName()).triggerCount / 5)
    let judgeValue = Math.floor(api.blockAPI.getBlockState<blockState>(state, getEventGameProtocolName(), getEventGameProtectEliteBlockName()).triggerCount / 4)

    // let enhenceEliteGiantessLevel = api.getEnhenceEliteGiantessLevel(state)

    // enhenceEliteGiantessLevel = enhenceEliteGiantessLevel >= 0 ? api.NumberUtils.greaterThan(enhenceEliteGiantessLevel * 0.25, 1)
    //     : api.NumberUtils.lessThan(-(4 / enhenceEliteGiantessLevel), 1)

    // judgeValue *= enhenceEliteGiantessLevel

    return {
        ...armyValue,
        // scale: api.computeNewValueByMultiply(armyValue.scale, judgeValue, 0.5),
        // scale: api.limitEliteGiantessScale(armyValue.scale, api.computeNewValueByMultiply(armyValue.scale, judgeValue, 0.2)),
        scale: api.limitEliteGiantessScale(armyValue.scale, api.computeNewValueByMultiply(armyValue.scale, judgeValue, 0.5)),

        defenseFactor: api.computeNewValueByMultiply(armyValue.defenseFactor, judgeValue, 0.04),
        attackFactor: api.computeNewValueByMultiply(armyValue.attackFactor, judgeValue, 0.02),

        // hp: Math.round(api.computeNewValueByMultiply(armyValue.hp, judgeValue, 0.5)),
        hp: Math.round(api.computeNewValueByMultiply(armyValue.hp, judgeValue, 0.2)),

        // moveSpeed: api.computeNewValueByMultiply(armyValue.moveSpeed, judgeValue, 0.3),

        // emitSpeedFactor: api.computeNewValueByMultiply(armyValue.emitSpeedFactor, judgeValue, 0.05),
        emitSpeedFactor: api.computeNewValueByDivid(armyValue.emitSpeedFactor, judgeValue, 0.05),
        critRatioFactor: api.computeNewValueByMultiply(armyValue.critRatioFactor, judgeValue, 0.1),
        //missRatio: api.computeNewValueByMultiply(armyValue.missRatio, judgeValue, 0.1),

        emitPrecision: api.computeNewValueByDivid(armyValue.emitPrecision, judgeValue, 0.2),
    } as value
}

export let updateEliteGiantessValue = <value extends armyValue & eliteGiantessValue>(api: api, state: state, eliteGiantessValue: value): value => {
    eliteGiantessValue = api.updateEliteGiantessValueDefault(state, eliteGiantessValue)

    return _updateEliteGiantessValueByTriggerCount(api, state, eliteGiantessValue)
}