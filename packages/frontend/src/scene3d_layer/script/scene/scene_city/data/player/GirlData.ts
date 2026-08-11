import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getIsDebug, getIsProduction } from "../../../Scene"
import { getCurrentMMDCharacterName, getCurrentMMDCharacterNameByUsedGirl } from "../../girl/Girl"
// import { getLevelGirlDamageData, getPlayerGirlDamageData } from "../../girl/Utils"
// // import { getGiantessSetting, getLittleManSetting } from "../../CityScene"
// import { excitementIncrease, giantessScale, giantessStrength } from "../../type/StateType"
// import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, stressingRateFactor, } from "../DataType"
import { getAllSkillDataForPlayer } from "../GirlDataUtils"
import { girlValue, luck } from "../ValueType"
import { getAttributeData } from "../mmd/MMDData"
import { usedGirlEnum } from "../../type/StateType"

export let getValue = (state: state): girlValue => {
    // let hp, restoreHpTime, biggerMaxTime, initialScale, excitementIncreaseFactor
    // // switch (getGiantessSetting(state).giantessStrength) {
    // //     case giantessStrength.Low:
    // // hp = 20000
    // // hp = 1000
    // // hp = 200
    // // hp = 150
    // // hp = 200
    // hp = 300
    // // hp = 200
    // // hp = 1500
    // // restoreHpTime = 6000
    // // restoreHpTime = 3000
    // // restoreHpTime = 4000
    // restoreHpTime = 4500
    // // biggerMaxTime = 60000
    // biggerMaxTime = 30000
    // //         break
    // //     case giantessStrength.Middle:
    // //         hp = 30000
    // //         restoreHpTime = 5000
    // //         biggerMaxTime = 80000
    // //         break
    // //     case giantessStrength.High:
    // //         hp = 40000
    // //         restoreHpTime = 4500
    // //         biggerMaxTime = 90000
    // //         break
    // //     case giantessStrength.VeryHigh:
    // //         hp = 50000
    // //         restoreHpTime = 4000
    // //         biggerMaxTime = 100000
    // //         break
    // //     default:
    // //         throw new Error("err")
    // // }

    // // switch (getGiantessSetting(state).giantessScale) {
    // //     case giantessScale.Low:
    // // initialScale = 10
    // initialScale = 8
    // // initialScale = 200
    // let scaleIncrease = initialScale
    // //         break
    // //     case giantessScale.Middle:
    // //         initialScale = 20
    // //         break
    // //     case giantessScale.High:
    // //         initialScale = 40
    // //         break
    // //     case giantessScale.VeryHigh:
    // //         initialScale = 100
    // //         break
    // //     case giantessScale.MostHigh:
    // //         initialScale = 400
    // //         break
    // //     default:
    // //         throw new Error("err")
    // // }

    // // switch (getGiantessSetting(state).excitementIncrease) {
    // //     case excitementIncrease.Low:
    // //         excitementIncreaseFactor = 0.5
    // //         break
    // //     case excitementIncrease.Middle:
    // excitementIncreaseFactor = 1
    // //         break
    // //     case excitementIncrease.High:
    // //         excitementIncreaseFactor = 2
    // //         break
    // //     default:
    // //         throw new Error("err")
    // // }

    // if (getIsDebug(state)) {
    //     // hp *= 1000
    //     hp *= 100000
    // }

    // return {
    //     ...getPlayerGirlDamageData(),

    //     maxExcitement: 100,
    //     scaleFactorWithExcitement: 1,
    //     initialScale: initialScale,
    //     // initialScale: 1000,

    //     // minScaleAsSmallGiantess: 10,
    //     // minScaleAsMiddleGiantess: 30,

    //     // minScaleAsSmallGiantess: scaleIncrease,
    //     // minScaleAsMiddleGiantess: scaleIncrease * 2,
    //     // minScaleAsBigGiantess: scaleIncrease * 5,
    //     volumeFactorForMiddleOrBigGiantess: 0.01,
    //     volumeFactorForSmallGiantess: 0.01,

    //     // scaleIncrease: 10,
    //     scaleIncrease: scaleIncrease,
    //     // maxScale: 200,
    //     maxScale: 200,
    //     // maxScale: Infinity,
    //     minScale: 8,

    //     screenShakeDistanceFactor: 0.25,
    //     screenShakeTime: 150,

    //     excitementIncreaseFactor: excitementIncreaseFactor,

    //     hp: hp,
    //     // hp: 3000,
    //     // hp: 30000000,



    //     restoreHpTime: restoreHpTime,
    //     // restoreHpSpeedRate: 1 / 100,
    //     // restoreHpSpeedRate: 3 / 100,
    //     // restoreHpSpeedRate: 2 / 100,
    //     restoreHpSpeedRate: 1 / 100,
    //     abstorbHpRate: abstorbHpRate.Middle,

    //     allSkillData: getAllSkillDataForPlayer(),


    //     // biggerSubExcitementTime: 20000,
    //     // biggerSubExcitementScalar: excitement.VeryLow,
    //     biggerMaxTime: biggerMaxTime,

    //     luck: luck.Middle,
    //     armorRatio: armorRatio.Middle,
    //     // armorStrength: armorStrength.VeryLow3,
    //     armorStrength: armorStrength.VeryLow4,
    //     // stressingRateFactor: stressingRateFactor.Middle,
    //     stressingRateFactor: stressingRateFactor.High,
    // }


    let value = {
        ...NullableUtils.getExn(getAttributeData(state).find(data => data.mmdCharacter == getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGirl))),

        maxExcitement: 100,
        scaleFactorWithExcitement: 1,

        volumeFactorForMiddleOrBigGiantess: 0.01,
        volumeFactorForSmallGiantess: 0.01,


        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        allSkillData: getAllSkillDataForPlayer(state),
    }

    if (getIsDebug(state)) {
        value = {
            ...value,
            hp: 1000000000
        }
    }

    return value
}