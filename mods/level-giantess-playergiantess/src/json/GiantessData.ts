import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, abstorbHpRate, biggerMaxTime, } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { girlValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"

export let getValue = (api: api, state: state): girlValue => {
    let hp, restoreHpTime, initialScale
    // switch (getLittleManSetting(state).giantessStrength) {
    //     case giantessStrength.Low:
    // hp = 100000
    // hp = 20000
    // hp = 15000
    // hp = 25000
    hp = 10000
    restoreHpTime = 60000
    //         break
    //     case giantessStrength.Middle:
    //         hp = 150000
    //         restoreHpTime = 50000
    //         biggerMaxTime = 60000
    //         break
    //     case giantessStrength.High:
    //         hp = 200000
    //         restoreHpTime = 40000
    //         biggerMaxTime = 100000
    //         break
    //     case giantessStrength.VeryHigh:
    //         hp = 250000
    //         restoreHpTime = 30000
    //         biggerMaxTime = 150000
    //         break
    //     default:
    //         throw new Error("err")
    // }

    // switch (getLittleManSetting(state).giantessScale) {
    //     case giantessScale.Low:
    // initialScale = 10
    initialScale = 8
    let scaleIncrease = initialScale
    //         break
    //     case giantessScale.Middle:
    //         initialScale = 20
    //         break
    //     case giantessScale.High:
    //         initialScale = 40
    //         break
    //     case giantessScale.VeryHigh:
    //         initialScale = 100
    //         break
    //     case giantessScale.MostHigh:
    //         initialScale = 400
    //         break
    //     default:
    //         throw new Error("err")
    // }


    if (api.getIsDebug(state)) {
        hp *= 100
    }


    return {
        defenseFactor: defenseFactor.VeryLow,
        attackFactor: attackFactor.VeryLow,
        critRatioFactor: critRatioFactor.VeryLow,
        //missRatio: missRatio.VeryLow,

        maxExcitement: 100,
        scaleFactorWithExcitement: 1,
        initialScale: initialScale,

        // minScaleAsSmallGiantess: 10,
        // minScaleAsMiddleGiantess: 30,
        // minScaleAsSmallGiantess: scaleIncrease,
        // minScaleAsMiddleGiantess: scaleIncrease * 2,
        // minScaleAsBigGiantess: scaleIncrease * 5,
        volumeFactorForMiddleOrBigGiantess: 0.01,
        volumeFactorForSmallGiantess: 0.01,

        // scaleIncrease: 10,
        scaleIncrease: scaleIncrease,
        // maxScale: 200,

        // maxScale: 200,
        // maxScale: 50,
        // maxScale: 200,

        // maxScale: 200,
        maxScale: 200,
        minScale: 8,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: 1,

        hp: hp,
        // hp: 100,
        // hp: 3000000,
        // defenseFactor: 1,


        restoreHpTime: restoreHpTime,
        restoreHpSpeedRate: 1 / 100,
        abstorbHpRate: abstorbHpRate.Middle,

        allSkillData: api.getAllSkillDataForLevelOrBoss(state),


        // biggerSubExcitementTime: 20000,
        // biggerSubExcitementScalar: excitement.VeryLow,
        biggerMaxTime: biggerMaxTime.High,

        armorRatio: armorRatio.MostHigh,
        armorStrength: armorStrength.VeryLow3,
        stressingRateFactor: stressingRateFactor.Middle,
    }

}