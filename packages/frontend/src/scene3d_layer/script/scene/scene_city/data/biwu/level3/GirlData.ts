import { state } from "../../../../../../type/StateType"
import { getIsSkipScenario } from "../../../../Scene"
import { getBiwuSetting } from "../../../CityScene"
import { difficulty } from "../../../type/StateType"
import { actionName, excitement } from "../../DataType"
import { girlValue } from "../../ValueType"

export let getValue = (state: state): girlValue => {
    let hp, restoreHpTime, biggerMaxTime, initialScale

    // hp = 150000 * 2.5
    hp = 150000 * 2.3
    restoreHpTime = 50000
    biggerMaxTime = 60000

    // initialScale = 25

    // if (getIsSkipScenario(state)) {
    initialScale = 200
    // }


    let factor
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
        case difficulty.Easy:
            factor = 0.8
            break
        case difficulty.Middle:
        // factor = 1
        // break
        case difficulty.Hard:
        // factor = 1.3
        // break
        case difficulty.VeryHard:
            // factor = 1.5
            factor = 1
            break
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

        hp: hp * factor,
        // hp: 1,
        // hp: hp/10,
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