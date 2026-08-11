import { difficultyData, rewardLevel } from "frontend/src/scene3d_layer/script/scene/scene_city/data/difficulty/DifficultyData"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { name as name1 } from "frontend/src/scene3d_layer/script/scene/scene_city/data/play/level1/difficulty/DifficultyData"
import { name as name2 } from "frontend/src/scene3d_layer/script/scene/scene_city/data/utils/DifficultyDataUtils"

export enum languageKey {
    DecreaseCommonArmyCount,
}

export enum languageVariableKey {
    DecreaseCommonArmyCount,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.DecreaseCommonArmyCount]: "减少军队人数",
        },
        [language.English]: {
            [languageKey.DecreaseCommonArmyCount]: "decrease army amount",
        },
    }
}

export let getTextDataByVariable = () => {
    return {
        [language.Chinese]: {
            [languageVariableKey.DecreaseCommonArmyCount]: (value) => {
                if (value < 0) {
                    return `增加${-value}%刷新军队数量`
                }

                return `减少${value}%刷新军队数量`
            },
        },
        [language.English]: {
            [languageVariableKey.DecreaseCommonArmyCount]: (value) => {
                if (value < 0) {
                    return `increase${-value}%refresh army count`
                }

                return `decrease${value}%refresh army count`
            }
        },
    }
}


export enum name {
    DecreaseCommonArmyCount = "DecreaseCommonArmyCount",
    // EnhenceArmy = "EnhenceArmy",
}




export let getDifficultyData = (api: api, state: state): difficultyData<name> => {
    return [
        {
            name: name.DecreaseCommonArmyCount,
            title: api.getLanguageDataByData(state, getTextData(), languageKey.DecreaseCommonArmyCount),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseCommonArmyCount)(Math.round(funcData.computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.4,
            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.5,

            heat: 0,
            // minHeat: -20,
            // maxHeat: 5,
            minHeat: -8,
            maxHeat: 2,

            // rewardLevel: rewardLevel.Middle,
            // rewardLevel: rewardLevel.VeryHigh1,
            rewardLevel: rewardLevel.High,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                // return funcData.setArmyCountRatio(state, computeRatio(heat, ratioOfOneHeat))
                return funcData.setArmyCountRatio(state, api.computeRatio(-heat, ratioOfOneHeat))
            },
        },
        // ...api.getDifficultyDataPlayLevel().slice(1) as any,
        ...api.getDifficultyDataPlayLevel().filter(d => d.name != name1.EnhenceArmy && d.name != name2.AddCommonArmyCount
            && d.name != name1.DecreaseGenerateArmyInterval
        ) as any,
    ]
}