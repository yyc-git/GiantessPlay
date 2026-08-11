import { api } from "type-api/src/Type"
import { state as blockState } from "event-game-protocol/src/state/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getEventGameBlockName, getEventGameProtocolName, getProtocolName } from "../script/Utils"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { girlValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { autoDifficulty, camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getUsedGirl = () => "Level_Giantess_Protect_Boss2"

export let getCamp = () => camp.Giantess

export enum languageKey {
    // Title,
    // Description,
    Name,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            // [languageKey.Title]: "巨大娘",
            // [languageKey.Description]: "巨大娘1出现",
            [languageKey.Name]: "Boss2",
        },
        [language.English]: {
            // [languageKey.Title]: "Giantess",
            // [languageKey.Description]: "Giantess Appear",
            [languageKey.Name]: "Boss2",
        },
    }
}

export let getName = (api: api, state: state) => api.getLanguageDataByData(state, getTextData(), languageKey.Name)

let _updateGiantessValueByAutoDifficulty = (api: api, state: state, value: girlValue) => {
    let autoDifficultyOrigin = api.getAutoDifficulty(state)
    let autoDifficulty_ = api.getEnhenceAutoDifficulty(state, api.getEnhenceLevelGiantessLevel(state))

    if (api.getAutoDifficulty(state) == autoDifficulty.VeryEasy) {
        return value
    }

    let usedGirl = getUsedGirl()

    return {
        ...value,

        // initialScale: Math.round(api.computeNewValueByMultiply(value.initialScale, autoDifficulty_, 0.25)),
        initialScale: api.limitInitialScale(state, usedGirl, value.initialScale >= api.getMaxScale(state, value) ? value.initialScale : Math.round(api.computeNewValueByMultiply(value.initialScale, autoDifficultyOrigin, 0.5))),

        scaleIncrease: Math.round(api.computeNewValueByMultiply(value.scaleIncrease, autoDifficultyOrigin, 0.25)),
        // scaleIncrease: Math.round(api.computeNewValueByMultiply(value.scaleIncrease, autoDifficulty_, 0.5)),

        // minScaleAsSmallGiantess: Math.round(api.computeNewValueByMultiply(value.minScaleAsSmallGiantess, autoDifficulty_, 0.25)),
        // minScaleAsMiddleGiantess: Math.round(api.computeNewValueByMultiply(value.minScaleAsMiddleGiantess, autoDifficulty_, 0.25)),
        // minScaleAsBigGiantess: Math.round(api.computeNewValueByMultiply(value.minScaleAsBigGiantess, autoDifficulty_, 0.25)),


        // defenseFactor: api.computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.1),
        defenseFactor: api.computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.02),
        // attackFactor: api.computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.1),
        // attackFactor: api.computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.3),
        attackFactor: api.computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.03),
        critRatioFactor: api.computeNewValueByMultiply(value.critRatioFactor, autoDifficulty_, 0.2),
        //missRatio: api.computeNewValueByMultiply(value.missRatio, autoDifficulty_, 0.2),

        // hp: Math.round(api.computeNewValueByMultiply(value.hp, autoDifficulty_, 0.3)),
        // hp: Math.round(api.computeNewValueByMultiply(value.hp, autoDifficulty_, 0.5)),
        // hp: Math.round(api.computeNewValueByMultiply(value.hp, autoDifficulty_, 1)),
        hp: Math.round(api.computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 1)),

        restoreHpTime: Math.round(api.computeNewValueByDivid(value.restoreHpTime, autoDifficulty_, 0.1)),
        restoreHpSpeedRate: api.computeNewValueByMultiply(value.restoreHpSpeedRate, autoDifficulty_, 0.1),

        abstorbHpRate: api.computeNewValueByMultiply(value.abstorbHpRate, autoDifficulty_, 0.25),
    }
}

let _updateGiantessValueByTriggerCount = (api: api, state: state, value: girlValue) => {
    let judgeValue = api.NumberUtils.greaterThan(api.blockAPI.getBlockState<blockState>(state, getEventGameProtocolName(), getEventGameBlockName()).triggerCount - 1, 0)
    let usedGirl = getUsedGirl()

    return {
        ...value,

        initialScale: api.limitInitialScale(state, usedGirl, Math.round(api.computeNewValueByMultiply(value.initialScale, judgeValue, 0.5))),

        // scaleIncrease: Math.round(api.computeNewValueByMultiply(value.scaleIncrease, judgeValue, 0.5)),
        scaleIncrease: Math.round(api.computeNewValueByMultiply(value.scaleIncrease, judgeValue, 0.25)),

        defenseFactor: api.computeNewValueByMultiply(value.defenseFactor, judgeValue, 0.02),
        attackFactor: api.computeNewValueByMultiply(value.attackFactor, judgeValue, 0.03),
        critRatioFactor: api.computeNewValueByMultiply(value.critRatioFactor, judgeValue, 0.2),
        //missRatio: api.computeNewValueByMultiply(value.missRatio, judgeValue, 0.2),

        hp: Math.round(api.computeNewValueByMultiply(value.hp, judgeValue, 1)),

        restoreHpTime: Math.round(api.computeNewValueByDivid(value.restoreHpTime, judgeValue, 0.1)),
        restoreHpSpeedRate: api.computeNewValueByMultiply(value.restoreHpSpeedRate, judgeValue, 0.1),

        abstorbHpRate: api.computeNewValueByMultiply(value.abstorbHpRate, judgeValue, 0.25),
    }

}

export let updateGiantessValue = (api: api) => (state: state, value: girlValue) => {
    value = _updateGiantessValueByAutoDifficulty(api, state, value)
    let usedGirl = getUsedGirl()

    return api.updateLevelGiantessValue(state, usedGirl, _updateGiantessValueByTriggerCount(api, state, value))
}