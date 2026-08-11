import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../../internation/Data"
import { readState } from "../../../../../state/State"
import { computeLevel, computeRatio, difficultyData, rewardLevel } from "../difficulty/DifficultyData"

export enum name {
    AddCommonArmyCount = "AddCommonArmyCount",
    AddEliteArmyCount = "AddEliteArmyCount",
    AddArmyDamage = "AddArmyDamage",
    SubPlayerRestoreHp = "SubPlayerRestoreHp",
    AddArmyHp = "AddArmyHp",
    EnhenceEliteGiantess = "EnhenceEliteGiantess",
}

export let getDifficultyData2 = (): difficultyData<name> => {
    return [
        {
            name: name.AddArmyDamage,
            title: getLanguageTextData(readState(), languageKey.AddArmyDamage),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddArmyDamage)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.4,

            heat: 0,
            minHeat: -2,
            maxHeat: 5,

            rewardLevel: rewardLevel.High,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEnemyDamageRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
        {
            name: name.AddArmyHp,
            title: getLanguageTextData(readState(), languageKey.AddArmyHp),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddArmyHp)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.4,

            heat: 0,
            minHeat: -2,
            maxHeat: 5,

            rewardLevel: rewardLevel.Middle,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEnemyHpRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },

        {
            name: name.SubPlayerRestoreHp,
            title: getLanguageTextData(readState(), languageKey.SubPlayerRestoreHp),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.SubPlayerRestoreHp)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            ratioOfOneHeat: 0.2,

            heat: 0,
            minHeat: -4,
            maxHeat: 5,

            rewardLevel: rewardLevel.Middle,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setRestoreHpRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
        {
            name: name.EnhenceEliteGiantess,
            title: getLanguageTextData(readState(), languageKey.EnhenceEliteGiantess),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                // return funcData.getLanguageTextVariableData(readState(), languageVariableKey.EnhenceEliteGiantess)(Math.round(computeLevel(heat)))
                return funcData.getLanguageTextVariableData(state, languageVariableKey.EnhenceEliteGiantess)(Math.round(computeLevel(heat)))
            },

            ratioOfOneHeat: 1,

            heat: 0,
            minHeat: -9,
            maxHeat: 10,


            rewardLevel: rewardLevel.High,

            getTextFunc: (state, d) => {
                // if (d.heat < 0) {
                //     return `${Math.round(d.ratioOfOneHeat * d.heat * 10)}%`
                // }

                // return `${Math.round(d.ratioOfOneHeat * d.heat * 100)}%`
                return String(d.heat)
            },
            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEnhenceEliteGiantessLevel(state, computeLevel(heat))
            },
        },
    ]
}

export let getDifficultyData = (): difficultyData<name> => {
    return [
        ...getDifficultyData2(),
        {
            name: name.AddCommonArmyCount,
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
            // maxHeat: 20,
            minHeat: -2,
            maxHeat: 8,

            // rewardLevel: rewardLevel.Middle,
            // rewardLevel: rewardLevel.VeryHigh1,
            rewardLevel: rewardLevel.High,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setArmyCountRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
        {
            name: name.AddEliteArmyCount,
            title: getLanguageTextData(readState(), languageKey.AddEliteArmyCount),
            getDescriptionFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.getLanguageTextVariableData(state, languageVariableKey.AddEliteArmyCount)(Math.round(computeRatio(heat, ratioOfOneHeat) * 100))
            },

            // ratioOfOneHeat: 0.4,
            // ratioOfOneHeat: 0.2,
            ratioOfOneHeat: 0.5,

            heat: 0,
            // minHeat: -5,
            // maxHeat: 20,
            minHeat: -2,
            maxHeat: 8,

            // rewardLevel: rewardLevel.High,
            rewardLevel: rewardLevel.VeryHigh,
            // rewardLevel: rewardLevel.VeryHigh2,

            applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
                return funcData.setEliteArmyCountRatio(state, computeRatio(heat, ratioOfOneHeat))
            },
        },
    ]
}
