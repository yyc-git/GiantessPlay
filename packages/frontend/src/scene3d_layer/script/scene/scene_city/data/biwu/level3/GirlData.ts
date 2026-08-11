import { state } from "../../../../../../type/StateType"
import { getIsSkipScenario } from "../../../../Scene"
import { getAutoDifficulty } from "../../../difficulty/Difficulty"
import { updateBossGiantessValue } from "../../../difficulty/HeatImplementer"
import { getBossGirlDamageData, getLevelGirlDamageData } from "../../../girl/Utils"
import { autoDifficulty } from "../../../type/StateType"
import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, abstorbHpRate, } from "../../DataType"
import { getAllSkillDataForLevelOrBoss } from "../../GirlDataUtils"
import { girlValue } from "../../ValueType"

export let getValue = (state: state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale

    // hp = 150000 * 2.5
    // hp = 150000 * 2.3
    // hp = 100000
    hp = 60000
    restoreHpTime = 50000
    biggerMaxTime = 60000

    // initialScale = 25

    // if (getIsSkipScenario(state)) {
    initialScale = 200
    // }


    // let factor
    // switch (getAutoDifficulty(state)) {
    //     case autoDifficulty.VeryEasy:
    //     case autoDifficulty.Easy:
    //         factor = 0.8
    //         break
    //     case autoDifficulty.Middle:
    //     // factor = 1
    //     // break
    //     case autoDifficulty.Hard:
    //     // factor = 1.3
    //     // break
    //     case autoDifficulty.VeryHard:
    //         // factor = 1.5
    //         factor = 1
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
        maxScale: 400,
        minScale: 8,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: 1,

        // hp: hp * factor,
        hp: hp,
        // hp: 1,
        // hp: hp/10,
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