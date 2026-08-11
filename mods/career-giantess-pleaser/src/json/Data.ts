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

export let getName = () => "Career_Giantess_Pleaser"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    PositiveDescription3,
    // PositiveDescription4,
    NegativeDescription1,
    // NegativeDescription2,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "巨大娘取悦者",
            // [languageKey.PositiveDescription1]: "受到巨大娘的伤害减30%",
            // [languageKey.PositiveDescription2]: "对MMD巨大娘弱点的伤害增加100%",
            // // [languageKey.PositiveDescription3]: "造成MMD巨大娘硬直/兴奋/高潮后，您增加攻击力10%",
            // [languageKey.PositiveDescription3]: "MMD巨大娘硬直/兴奋/高潮后，您增加攻击力10%",
            // // [languageKey.PositiveDescription4]: "造成MMD巨大娘兴奋/高潮的概率提升50%",
            // // [languageKey.PositiveDescription3]: "造成巨大娘兴奋/高潮后，您增加攻击力10%",
            // // [languageKey.NegativeDescription1]: "因巨大娘的伤害而硬直/倒地的概率增加100%",
            // [languageKey.NegativeDescription1]: "硬直概率增加50%",
            // // [languageKey.NegativeDescription2]: "巨大娘动作速度增加50%",
        },
        [language.English]: {
            [languageKey.Title]: "Giantess Pleaser",
            // [languageKey.PositiveDescription1]: "Reduce 30% of damage caused by giantess",
            // [languageKey.PositiveDescription2]: "Increases damage to the weakness of MMD giantess by 100%",
            // // [languageKey.PositiveDescription3]: "After causing MMD giantess stun/excitement/climax, you increase your attack power by 10%",
            // [languageKey.PositiveDescription3]: "After MMD giantess stun/excitement/climax, you increase your attack power by 10%",
            // // [languageKey.PositiveDescription4]: "Increases the probability of causing MMD giantess to become excitement/climax by 50%",
            // // [languageKey.PositiveDescription3]: "After causing a giantess excitement/climax, you increase your attack power by 10%",
            // // [languageKey.NegativeDescription1]: "The probability of stun/falling to the ground by giantess increases 100%",
            // [languageKey.NegativeDescription1]: "The probability of stun increases 50%",
            // // [languageKey.NegativeDescription2]: "giantess's action speed increase 50%",
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
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription3)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription1),
        //         // api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription2)
        //     ]
        // },
        // applyFunc: (state, characterType) => {
        //     // state = api.GiantessBuildUtils.setDurationFactor(state, api.buildFuncData(state), (value) => {
        //     //     return value * 0.5
        //     // })
        //     // state = api.setEliteGiantessAnimationDurationFactor(state, 0.5)

        //     state = api.LittleManBuildUtils.setStressingRateFactor(state, api.buildFuncData(state), (_, value) => value * 1.5)

        //     return Promise.resolve(state)
        // },
        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseStubRate]: 0.5,
            [careerFeatureName.ReduceGiantessDamage]: 0.3,
            [careerFeatureName.IncreaseAttackWhenStubExcitementClimax]: 0.1,
            // [careerFeatureName.IncreaseExcitementClimaxRate]: 0.5,
            [careerFeatureName.IncreaseDamageMMDGiantessWeakness]: 1,
        })
    }
}

export let getCharacterType = () => characterType.LittleMan

let _getImageSrc = () => getImagePath("icon")
