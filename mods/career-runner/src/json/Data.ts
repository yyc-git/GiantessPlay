import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { careerFeatureName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_Runner"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    NegativeDescription1,
    NegativeDescription2,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "飞毛腿",
            // [languageKey.PositiveDescription1]: "移动速度增加100%",
            // [languageKey.PositiveDescription2]: "每1点移动速度增加10%近战伤害",
            // [languageKey.NegativeDescription1]: "护甲强度减20%",
            // [languageKey.NegativeDescription2]: "站立不动时，护甲强度为0，防御力减50%",
        },
        [language.English]: {
            [languageKey.Title]: "Scud",
            // [languageKey.PositiveDescription1]: "Move speed increase 100%",
            // [languageKey.PositiveDescription2]: "Every 1 move speed increase 10% melee damage",
            // [languageKey.NegativeDescription1]: "Armor strength decrease 20%",
            // [languageKey.NegativeDescription2]: "When stand, armor strength decrease to 0, defense decrease 50%",
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
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription2)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription1),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription2)
        //     ]
        // },
        // applyFunc: (state, characterType) => {
        //     state = api.LittleManBuildUtils.setArmorStrength(state, api.buildFuncData(state), (state, value) => {
        //         return value * 0.8
        //     })
        //     state = api.LittleManBuildUtils.setMoveSpeed(state, api.buildFuncData(state), (state, value) => {
        //         return value * 2
        //     })

        //     return Promise.resolve(state)
        // },
        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseMoveSpeed]: 1,
            [careerFeatureName.DecreaseArmorStrength]: 0.2,
            [careerFeatureName.IncreaseMeleeDamageByMoveSpeed]: 0.1,
            [careerFeatureName.DecreaseDefenseWhenNotMove]: 0.5,
        })
    }
}

export let getCharacterType = () => characterType.LittleMan

let _getImageSrc = () => getImagePath("icon")
