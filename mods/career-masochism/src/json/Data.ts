import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { careerFeatureName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_Masochism"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    // PositiveDescription3,
    // PositiveDescription4,
    NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "受虐狂",
            // // [languageKey.PositiveDescription1]: "受到攻击后，增加5%伤害，20秒内叠加",
            // [languageKey.PositiveDescription1]: "生命上限增加100%",
            // [languageKey.PositiveDescription2]: "生命恢复强度增加100%",
            // // [languageKey.PositiveDescription4]: "护甲强度增加50%",
            // [languageKey.NegativeDescription1]: "减少100%伤害。受到攻击后，增加5%伤害，持续20秒",
        },
        [language.English]: {
            [languageKey.Title]: "Masochism",
            // [languageKey.PositiveDescription1]: "Maximum health increased by 100%",
            // [languageKey.PositiveDescription2]: "Heath regeneration increased by 100%",
            // // [languageKey.PositiveDescription4]: "Armor strength increase 50%",
            // [languageKey.NegativeDescription1]: "Decrease 100% damage. After be attacked, increase 5% damage, keep 20s",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.Middle,

        // characterType: getCharacterType(),

        // getPositiveDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription1),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription2),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription3),
        //         // api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription4)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription1),
        //     ]
        // },
        // applyFunc: (state, characterType_) => {
        //     switch (characterType_) {
        //         case characterType.LittleMan:
        //             state = api.LittleManBuildUtils.setHp(state, api.buildFuncData(state), (state, hp) => {
        //                 return hp * 2
        //             }, true)
        //             state = api.LittleManBuildUtils.setRestoreHpSpeedRate(state, api.buildFuncData(state), (state, value) => {
        //                 return value * 2
        //             })
        //             break
        //         case characterType.Giantess:
        //             state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => {
        //                 return hp * 2
        //             }, true, usedGirlEnum.PlayerGirl)
        //             state = api.GiantessBuildUtils.setRestoreHpSpeedRate(state, api.buildFuncData(state), (state, value) => {
        //                 return value * 2
        //             }, usedGirlEnum.PlayerGirl)
        //             break
        //     }

        //     return Promise.resolve(state)
        // },
        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseFullHp]: 1,
            [careerFeatureName.IncreaseRestoreHpStrength]: 1,
            [careerFeatureName.ReduceDamageButIncreaseWhenDamaged]: [1, 0.05, 20],
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")
