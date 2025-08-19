import { state } from "../../../../../../type/StateType"
import { getGiantessSetting, getLittleManSetting } from "../../../CityScene"
import { excitementIncrease, giantessScale, giantessStrength } from "../../../type/StateType"
import { actionName, excitement } from "../../DataType"
import { girlValue } from "../../ValueType"

export let getValueForLittleManRoad = (state:state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale
    switch (getLittleManSetting(state).giantessStrength) {
        case giantessStrength.Low:
            hp = 100000
            restoreHpTime = 60000
            biggerMaxTime = 40000
            break
        case giantessStrength.Middle:
            hp = 150000
            restoreHpTime = 50000
            biggerMaxTime = 60000
            break
        case giantessStrength.High:
            hp = 200000
            restoreHpTime = 40000
            biggerMaxTime = 100000
            break
        case giantessStrength.VeryHigh:
            hp = 250000
            restoreHpTime = 30000
            biggerMaxTime = 150000
            break
        default:
            throw new Error("err")
    }

    switch (getLittleManSetting(state).giantessScale) {
        case giantessScale.Low:
            initialScale = 10
            break
        case giantessScale.Middle:
            initialScale = 20
            break
        case giantessScale.High:
            initialScale = 40
            break
        case giantessScale.VeryHigh:
            initialScale = 100
            break
        case giantessScale.MostHigh:
            initialScale = 400
            break
        default:
            throw new Error("err")
    }



    return {
        maxExcitement: 100,
        scaleFactorWithExcitement: 1,
        initialScale: initialScale,

        minScaleAsSmallGiantess: 10,
        minScaleAsMiddleGiantess: 30,
        volumeFactorForGiantess: 0.01,
        volumeFactorForNotGiantess: 0.01,

        minScale: 10,
        // maxScale: 200,
        maxScale: 400,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: 1,

        hp: hp,
        // hp: 3000000,
        defenseFactor: 1,


        restoreHpTime: restoreHpTime,
        restoreHpSpeedRate: 1 / 100,
        abstorbHpRate: 10 / 100,

        allSkillData: [
            {
                name: actionName.Bigger,
                excitement: excitement.MostHigh
            },
            {
                name: actionName.Smaller,
                excitement: excitement.Zero
            },

            {
                name: actionName.Pickup,
                excitement: excitement.High
            },
            {
                name: actionName.Stomp,
                excitement: excitement.Zero
            },
            {
                name: actionName.Run,
                excitement: excitement.Zero
            },
            {
                name: actionName.StandToCrawl,
                excitement: excitement.VeryHigh
            },
            {
                name: actionName.Eat,
                excitement: excitement.High
            },
            {
                name: actionName.Pinch,
                excitement: excitement.Middle
            },
            {
                name: actionName.Pickdown,
                excitement: excitement.Zero
            },
            {
                name: actionName.BreastPress,
                excitement: excitement.High
            },
            {
                name: actionName.CrawlToStand,
                excitement: excitement.Zero
            },
        ],


        // biggerSubExcitementTime: 20000,
        // biggerSubExcitementScalar: excitement.VeryLow,
        biggerMaxTime: biggerMaxTime,
    }
}

export let getValueForGiantessRoad = (state:state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale, excitementIncreaseFactor
    switch (getGiantessSetting(state).giantessStrength) {
        case giantessStrength.Low:
            hp = 20000
            restoreHpTime = 6000
            biggerMaxTime = 60000
            break
        case giantessStrength.Middle:
            hp = 30000
            restoreHpTime = 5000
            biggerMaxTime = 80000
            break
        case giantessStrength.High:
            hp = 40000
            restoreHpTime = 4500
            biggerMaxTime = 90000
            break
        case giantessStrength.VeryHigh:
            hp = 50000
            restoreHpTime = 4000
            biggerMaxTime = 100000
            break
        default:
            throw new Error("err")
    }

    switch (getGiantessSetting(state).giantessScale) {
        case giantessScale.Low:
            initialScale = 10
            break
        case giantessScale.Middle:
            initialScale = 20
            break
        case giantessScale.High:
            initialScale = 40
            break
        case giantessScale.VeryHigh:
            initialScale = 100
            break
        case giantessScale.MostHigh:
            initialScale = 400
            break
        default:
            throw new Error("err")
    }

    switch (getGiantessSetting(state).excitementIncrease) {
        case excitementIncrease.Low:
            excitementIncreaseFactor = 0.5
            break
        case excitementIncrease.Middle:
            excitementIncreaseFactor = 1
            break
        case excitementIncrease.High:
            excitementIncreaseFactor = 2
            break
        default:
            throw new Error("err")
    }

    return {
        maxExcitement: 100,
        scaleFactorWithExcitement: 1,
        initialScale: initialScale,

        minScaleAsSmallGiantess: 10,
        minScaleAsMiddleGiantess: 30,
        volumeFactorForGiantess: 0.01,
        volumeFactorForNotGiantess: 0.01,

        minScale: 10,
        // maxScale: 200,
        maxScale: 400,

        screenShakeDistanceFactor: 0.25,
        screenShakeTime: 150,

        excitementIncreaseFactor: excitementIncreaseFactor,

        hp: hp,
        // hp: 30000000,
        defenseFactor: 1,


        restoreHpTime: restoreHpTime,
        restoreHpSpeedRate: 1 / 100,
        abstorbHpRate: 10 / 100,

        allSkillData: [
            {
                name: actionName.Bigger,
                excitement: excitement.MostHigh
            },
            {
                name: actionName.Smaller,
                excitement: excitement.Zero
            },

            {
                name: actionName.Pickup,
                excitement: excitement.High
            },
            {
                name: actionName.Stomp,
                excitement: excitement.Zero
            },
            {
                name: actionName.Run,
                excitement: excitement.Zero
            },
            {
                name: actionName.StandToCrawl,
                excitement: excitement.VeryHigh
            },
            {
                name: actionName.Eat,
                excitement: excitement.High
            },
            {
                name: actionName.Pinch,
                excitement: excitement.Middle
            },
            {
                name: actionName.Pickdown,
                excitement: excitement.Zero
            },
            {
                name: actionName.BreastPress,
                excitement: excitement.High
            },
            {
                name: actionName.CrawlToStand,
                excitement: excitement.Zero
            },
        ],


        // biggerSubExcitementTime: 20000,
        // biggerSubExcitementScalar: excitement.VeryLow,
        biggerMaxTime: biggerMaxTime,
    }
}