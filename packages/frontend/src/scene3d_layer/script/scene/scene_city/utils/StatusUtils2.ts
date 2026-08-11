import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { usedGirl } from "../type/StateType"
import { getBiggerRemainTime } from "../girl/InitWhenImportScene"
import { nullable } from "block/src/Type"

export let handleStatusWithNumber = ([isValidCharacterTypeFunc, removeStatusFunc, addOrUpdateStatusFunc, hasStatusFunc, getImageSrcFunc]) => (state: state, getFunc, usedGirl: usedGirl, name: any, characterType_, isPositive = true, description = "") => {
    if (!isValidCharacterTypeFunc(state, characterType_)) {
        return state
    }

    let count = getFunc(state)

    // if (count <= 0) {
    if (NullableUtils.isNullable(count)) {
        state = removeStatusFunc(state, usedGirl, name, characterType_)
    }
    else if (hasStatusFunc(state, usedGirl, name, characterType_)) {
        state = addOrUpdateStatusFunc(state, getImageSrcFunc, usedGirl, name, count, isPositive, characterType_, description)
    }

    return state
}

export let handleStatusWithNumberWithoutJudgeHas = ([isValidCharacterTypeFunc, removeStatusFunc, addOrUpdateStatusFunc, getImageSrcFunc]) => (state: state, getFunc, usedGirl: usedGirl, name: any, characterType_, isPositive = true, description = "") => {
    if (!isValidCharacterTypeFunc(state, characterType_)) {
        return state
    }

    let count = getFunc(state)

    // if (count <= 0) {
    if (NullableUtils.isNullable(count)) {
        state = removeStatusFunc(state, usedGirl, name, characterType_)
    }
    else {
        state = addOrUpdateStatusFunc(state, getImageSrcFunc, usedGirl, name, count, isPositive, characterType_, description)
    }

    return state
}

export let getActiveBiggerRemainTime = (state: state, usedGirl): nullable<number> => {
    let result = Math.round(getBiggerRemainTime(state, usedGirl) / 1000)

    if (result <= 0) {
        return NullableUtils.getEmpty()
    }

    return NullableUtils.return_(result)
}