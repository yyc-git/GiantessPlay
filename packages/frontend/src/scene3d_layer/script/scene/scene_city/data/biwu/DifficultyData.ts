import { readState } from "../../../../../../business_layer/State"
import { getLanguageTextData, languageKey, getLanguageTextVariableData, languageVariableKey } from "../../../../../internation/Data"
import { computeLevel, computeRatio, difficultyData, rewardLevel } from "../difficulty/DifficultyData"
import { getDifficultyData2 as getDifficultyData2Utils, name as nameUtils } from "../utils/DifficultyDataUtils"

export enum name {
    EnhenceArmy = "EnhenceArmy",
    EnhenceBossGiantess = "EnhenceBossGiantess",
}

export let getDifficultyData = (): difficultyData<name> => {
    return [
        {
            name: nameUtils.AddCommonArmyCount,
            title: getLanguageTextData(readState(), languageKey.AddCommonArmyCount),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddCommonArmyCount)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.4,
            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.5,

            heat: 0,
            // minHeat: -2,
            // minHeat: -5,
            minHeat: 0,
            // maxHeat: 20,
            maxHeat: 8,

            // rewardLevel: rewardLevel.Middle,
            rewardLevel: rewardLevel.High,
            // rewardLevel: rewardLevel.VeryHigh1,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setArmyCountRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
        {
            name: nameUtils.AddEliteArmyCount,
            title: getLanguageTextData(readState(), languageKey.AddEliteArmyCount),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddEliteArmyCount)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.4,
            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.5,

            heat: 0,
            // minHeat: -5,
            minHeat: 0,
            // maxHeat: 20,
            maxHeat: 8,

            // rewardLevel: rewardLevel.High,
            rewardLevel: rewardLevel.VeryHigh,
            // rewardLevel: rewardLevel.VeryHigh2,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEliteArmyCountRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
        ...getDifficultyData2Utils() as any,

        {
            name: name.EnhenceArmy,
            title: getLanguageTextData(readState(), languageKey.EnhenceArmy),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.EnhenceArmy)(Math.round(computeLevel(heat)))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: 0,
            maxHeat: 10,

            rewardLevel: rewardLevel.Middle,

            getTextFunc: (state, d) => {
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEnhenceArmyLevel(state, computeLevel(heat))
            },
        },
        {
            name: name.EnhenceBossGiantess,
            title: getLanguageTextData(readState(), languageKey.EnhenceBossGiantess),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.EnhenceBossGiantess)(Math.round(computeLevel(heat)))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: 0,
            maxHeat: 10,

            // rewardLevel: rewardLevel.VeryHigh,
            rewardLevel: rewardLevel.VeryHigh2,

            getTextFunc: (state, d) => {
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEnhenceBossGiantessLevel(state, computeLevel(heat))
            },
        },
    ]
}