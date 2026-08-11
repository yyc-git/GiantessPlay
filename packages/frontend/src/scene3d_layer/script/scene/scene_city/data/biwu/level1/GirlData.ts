import { state } from "../../../../../../type/StateType"
import { getAutoDifficulty } from "../../../difficulty/Difficulty"
import { updateBossGiantessValue } from "../../../difficulty/HeatImplementer"
import { getBossGirlDamageData, getLevelGirlDamageData } from "../../../girl/Utils"
import { autoDifficulty } from "../../../type/StateType"
import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, abstorbHpRate, } from "../../DataType"
import { getAllSkillDataForLevelOrBoss } from "../../GirlDataUtils"
import { girlValue } from "../../ValueType"

export let getValue = (state: state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale

    // hp = 150000 / 3
    hp = 20000
    restoreHpTime = 50000
    biggerMaxTime = 60000

    initialScale = 25

    // let factor
    // switch (getAutoDifficulty(state)) {
    //     case autoDifficulty.VeryEasy:
    //         factor = 0.25
    //         break
    //     case autoDifficulty.Easy:
    //         factor = 0.5
    //         break
    //     case autoDifficulty.Middle:
    //         factor = 1
    //         break
    //     case autoDifficulty.Hard:
    //         factor = 2
    //         break
    //     case autoDifficulty.VeryHard:
    //         factor = 3
    //         break
    // }

    return {
        ...getBossGirlDamageData(),

        maxExcitement: 100,
        scaleFactorWithExcitement: 1,
        initialScale: initialScale,

        // minScaleAsSmallGiantess: 10,
        // minScaleAsMiddleGiantess: 30,
        // minScaleAsBigGiantess: 50,
        volumeFactorForMiddleOrBigGiantess: 0.01,
        volumeFactorForSmallGiantess: 0.01,

        scaleIncrease: 10,
        // maxScale: 200,
        maxScale: 200,
        minScale: 8,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: 1,

        // hp: hp * factor,
        hp: hp,
        // hp: 3000000,
        // defenseFactor: 1,


        restoreHpTime: restoreHpTime,
        restoreHpSpeedRate: 1 / 100,
        abstorbHpRate: abstorbHpRate.Middle,

        allSkillData: getAllSkillDataForLevelOrBoss(state),


        // biggerSubExcitementTime: 20000,
        // biggerSubExcitementScalar: excitement.VeryLow,
        biggerMaxTime: biggerMaxTime,

        armorRatio: armorRatio.MostHigh,
        armorStrength: armorStrength.VeryLow3,
        stressingRateFactor: stressingRateFactor.Middle,
    }
}