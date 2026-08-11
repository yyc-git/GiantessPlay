import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, abstorbHpRate, biggerMaxTime, } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { girlValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"

export let getValue = (api: api, state: state): girlValue => {
    let hp, restoreHpTime, initialScale
    // hp = 25000
    hp = 20000
    restoreHpTime = 60000

    initialScale = 10
    let scaleIncrease = 8

    if (api.getIsDebug(state)) {
        hp *= 100
    }

    return {
        // ...getLevelGirlDamageData(),
        defenseFactor: defenseFactor.Middle,
        attackFactor: attackFactor.VeryLow,
        critRatioFactor: critRatioFactor.VeryLow,
        //missRatio: missRatio.VeryLow,

        maxExcitement: 100,
        scaleFactorWithExcitement: 1,
        initialScale: initialScale,

        volumeFactorForMiddleOrBigGiantess: 0.01,
        volumeFactorForSmallGiantess: 0.01,

        scaleIncrease: scaleIncrease,

        // maxScale: 200,
        maxScale: +Infinity,
        minScale: 8,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: 1,

        hp: hp,


        restoreHpTime: restoreHpTime,
        restoreHpSpeedRate: 1 / 100,
        abstorbHpRate: abstorbHpRate.Middle,

        allSkillData: api.getAllSkillDataForLevelOrBoss(state),


        biggerMaxTime: biggerMaxTime.High ,

        armorRatio: armorRatio.MostHigh,
        armorStrength: armorStrength.VeryLow3,
        stressingRateFactor: stressingRateFactor.Middle,
    }
}