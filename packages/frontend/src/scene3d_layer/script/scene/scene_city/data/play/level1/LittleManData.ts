import { state } from "../../../../../../type/StateType"
import { getIsDebug } from "../../../../Scene"
import { getLittleManSetting } from "../../../CityScene"
import { getCurrentModelData } from "../../../little_man/LittleMan"
import { littleManValue } from "../../../little_man_data/ValueType"
import { littleManStrength } from "../../../type/StateType"
import { excitement } from "../../DataType"

export let getValue = (state: state): littleManValue => {
    let factor, moveSpeedFactor
    switch (getLittleManSetting(state).littleManStrength) {
        case littleManStrength.Low:
            factor = 1
            moveSpeedFactor = 1
            break
        case littleManStrength.Middle:
            factor = 2
            moveSpeedFactor = 1.5
            break
        case littleManStrength.High:
            factor = 3
            moveSpeedFactor = 2
            break
        default:
            throw new Error("err")
    }

    let { hp, defenseFactor, moveSpeed } = getCurrentModelData(state)

    if (getIsDebug(state)) {
        hp *= 100
    }

    return {
        excitement: excitement.MostHigh,

        hp: hp * factor,

        defenseFactor: defenseFactor * factor,

        moveSpeed: moveSpeed * moveSpeedFactor,
    }
}