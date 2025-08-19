import { state } from "../../../../../../type/StateType"
import { getIsDebug } from "../../../../Scene"
import { getBiwuSetting, getLittleManSetting } from "../../../CityScene"
import { getCurrentModelData } from "../../../little_man/LittleMan"
import { littleManValue } from "../../../little_man_data/ValueType"
import { difficulty, littleManStrength } from "../../../type/StateType"
import { excitement } from "../../DataType"

export let getValue = (state: state): littleManValue => {
    let factor, moveSpeedFactor
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
        case difficulty.Easy:
            factor = 3
            moveSpeedFactor = 2
            break
        case difficulty.Middle:
            factor = 2
            moveSpeedFactor = 1.5
            break
        case difficulty.Hard:
        case difficulty.VeryHard:
            factor = 1
            moveSpeedFactor = 1
            break
    }

    let { hp, defenseFactor, moveSpeed } = getCurrentModelData(state)

    if (getIsDebug(state)) {
        hp *= 100
    }

    return {
        excitement: excitement.MostHigh,

        hp: hp * factor * 50,

        defenseFactor: defenseFactor * factor,

        moveSpeed: moveSpeed * moveSpeedFactor,
    }
}