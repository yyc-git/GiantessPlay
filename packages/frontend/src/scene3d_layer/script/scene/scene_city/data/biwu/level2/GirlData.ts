import { state } from "../../../../../../type/StateType"
import { getIsSkipScenario } from "../../../../Scene"
import { updateBossGiantessValue } from "../../../difficulty/HeatImplementer"
import { getBossGirlDamageData, getLevelGirlDamageData } from "../../../girl/Utils"
import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, abstorbHpRate, } from "../../DataType"
import { getAllSkillDataForLevelOrBoss } from "../../GirlDataUtils"
import { girlValue } from "../../ValueType"

export let getValue = (state: state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale

    // hp = 150000
    // hp = 50000
    hp = 35000
    restoreHpTime = 50000
    biggerMaxTime = 60000

    initialScale = 25

    if (getIsSkipScenario(state)) {
        initialScale = 100
    }

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

        hp: hp,
        // hp: 1,
        // hp: 3000000,
        // defenseFactor: 1,
        // defenseFactor: defenseFactor.Low,


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