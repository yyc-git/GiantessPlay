import { state } from "../../../../../type/StateType"
import { getIsDebug, getIsProduction } from "../../../Scene"
import { getCurrentModelData } from "../../little_man/LittleMan"
import { littleManValue } from "../../little_man_data/ValueType"
import { littleManStrength } from "../../type/StateType"
import { excitement } from "../DataType"
import { luck } from "../ValueType"

export let getValue = (state: state): littleManValue => {
    // let factor, moveSpeedFactor
    // switch (getLittleManSetting(state).littleManStrength) {
    //     case littleManStrength.Low:
    //         factor = 1
    //         moveSpeedFactor = 1
    //         break
    //     case littleManStrength.Middle:
    //         factor = 2
    //         moveSpeedFactor = 1.5
    //         break
    //     case littleManStrength.High:
    //         factor = 3
    //         moveSpeedFactor = 2
    //         break
    //     default:
    //         throw new Error("err")
    // }

    let { hp, defenseFactor, armorType, armorRatio, armorStrength, attackFactor, emitSpeedFactor, emitterLifeFactor, critRatioFactor, moveSpeed, stressingRateFactor } = getCurrentModelData(state)

    // if (getIsDebug(state)) {
    if (getIsDebug(state)) {
        hp *= 10000000
        // hp =10 as any
    }
    // else {
    //     // hp = 300 as any
    //     hp = 200 as any
    // }

    // defenseFactor = 0.5 as any
    // armorStrength = 100 as any
    return {
        excitement: excitement.MostHigh,

        hp, defenseFactor, armorType, armorRatio, armorStrength, attackFactor, emitSpeedFactor, emitterLifeFactor, critRatioFactor, moveSpeed, stressingRateFactor,

        // restoreHpTime: 3000,
        restoreHpTime: 4500,
        // restoreHpSpeedRate: 1 / 100,
        // restoreHpSpeedRate: 3 / 100,
        // restoreHpSpeedRate: 6 / 100,
        restoreHpSpeedRate: 1 / 100,
        // restoreHpSpeedRate: 0

        luck: luck.Middle,
    }
}