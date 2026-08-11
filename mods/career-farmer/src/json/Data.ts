import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { missionFinishStatus } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { visibleData } from "frontend/src/scene3d_layer/script/scene/scene_city/behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { coin, experienceValue, gem } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { careerFeatureName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_Farmer"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    PositiveDescription3,
    NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "农夫",
            // // [languageKey.PositiveDescription1]: "获得的金币增加25%",
            // [languageKey.PositiveDescription1]: "获得的金币增加20%",
            // // [languageKey.PositiveDescription2]: "每分钟，获得的金币增加3%",
            // [languageKey.PositiveDescription2]: "每分钟，获得的金币增加2%",
            // [languageKey.PositiveDescription3]: "满血时捡起一个道具，获得的金币增加0.5%",
            // [languageKey.NegativeDescription1]: "奖励的道具数量减少50%",
        },
        [language.English]: {
            [languageKey.Title]: "Farmer",
            // [languageKey.PositiveDescription1]: "The number of coins obtained has increased 20%",
            // [languageKey.PositiveDescription2]: "Every minute, the amount of coins obtained increases by 2%",
            // [languageKey.PositiveDescription3]: "When picking up a item while at full health, the amount of coins obtained increases by 0.5%",
            // [languageKey.NegativeDescription1]: "The count of rewarded items is reduced by 50%",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.VeryHigh,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseGetCoin]: 0.20,
            [careerFeatureName.IncreaseGetCoinEveryMimute]: 0.02,
            [careerFeatureName.IncreaseGetCoinWithMaxHp]: 0.005,
            [careerFeatureName.DecreaseRewardPropCount]: 0.5,
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")
