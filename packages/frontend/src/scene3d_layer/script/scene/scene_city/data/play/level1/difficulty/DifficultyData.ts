import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../../../../internation/Data"
import { readState } from "../../../../../../../state/State"
import { computeLevel, computeRatio, difficultyData, rewardLevel } from "../../../difficulty/DifficultyData"
import { getDifficultyData as getDifficultyDataUtils } from "../../../utils/DifficultyDataUtils"

export enum name {
    DecreaseGenerateArmyInterval = "DecreaseGenerateArmyInterval",
    EnhenceArmy = "EnhenceArmy",
    EnhenceLevelGiantess = "EnhenceLevelGiantess",
    AddMaxMMDGiantessCount = "AddMaxMMDGiantessCount",
    AllowFriendDamage = "AllowFriendDamage",
    RemoveMapEdgeZone = "RemoveMapEdgeZone",
}


export let getDifficultyData = (): difficultyData<name> => {
    return [
        ...getDifficultyDataUtils() as any,
        {
            name: name.DecreaseGenerateArmyInterval,
            title: getLanguageTextData(readState(), languageKey.DecreaseGenerateArmyInterval),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.DecreaseGenerateArmyInterval)(Math.round(funcData.computeRatio(heat, ratioOfOneHeat) * 100))
            },

            ratioOfOneHeat: 0.5,

            heat: 0,
            minHeat: -1,
            maxHeat: 2,

            rewardLevel: rewardLevel.Low,

            // getTextFunc: (state, d) => {
            //     return String(d.heat)
            // },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setDecreaseGenerateArmyIntervalRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
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
            name: name.EnhenceLevelGiantess,
            title: getLanguageTextData(readState(), languageKey.EnhenceLevelGiantess),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.EnhenceLevelGiantess)(Math.round(computeLevel(heat)))
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
                return funcData.setEnhenceLevelGiantessLevel(state, computeLevel(heat))
            },
        },
        {
            name: name.AddMaxMMDGiantessCount,
            title: getLanguageTextData(readState(), languageKey.AddMaxMMDGiantessCount),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddMaxMMDGiantessCount)(Math.round(computeLevel(heat)))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: -1,
            maxHeat: 1,

            // rewardLevel: rewardLevel.VeryHigh,
            rewardLevel: rewardLevel.High,

            getTextFunc: (state, d) => {
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setMaxMMDGiantessCountLevel(state, computeLevel(heat))

            },
        },
        {
            name: name.AllowFriendDamage,
            title: getLanguageTextData(readState(), languageKey.AllowFriendDamage),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AllowFriendDamage)(computeLevel(heat))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: 0,
            maxHeat: 1,

            rewardLevel: rewardLevel.Middle,

            getTextFunc: (state, d) => {
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setIsAllowFriendDamage(state, computeLevel(heat) > 0)
            },
        },
        {
            name: name.RemoveMapEdgeZone,
            title: getLanguageTextData(readState(), languageKey.RemoveMapEdgeZone),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.RemoveMapEdgeZone)(computeLevel(heat))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: 0,
            maxHeat: 1,

            rewardLevel: rewardLevel.Middle,

            getTextFunc: (state, d) => {
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setIsRemoveMapEdgeZone(state, computeLevel(heat) > 0)
            },
        },
    ]
}