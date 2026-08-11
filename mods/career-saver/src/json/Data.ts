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

export let getName = () => "Career_Saver"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "节俭者",
            // // [languageKey.PositiveDescription1]: "获得的金币增加20%",
            // [languageKey.PositiveDescription1]: "获得的金币增加10%",
            // // [languageKey.PositiveDescription2]: "每持有50金币，伤害增加1%",
            // [languageKey.PositiveDescription2]: "每持有50金币，伤害增加0.5%",
            // [languageKey.NegativeDescription1]: "物品价格增加50%",
        },
        [language.English]: {
            [languageKey.Title]: "Saver",
            // [languageKey.PositiveDescription1]: "The amount of coins obtained increases by 10%",
            // [languageKey.PositiveDescription2]: "For every 50 coins held, damage increases by 0.5%",
            // [languageKey.NegativeDescription1]: "The price of the item increase 50%",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.High,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseDamageByCoin]: 0.005,
            [careerFeatureName.IncreaseGetCoin]: 0.1,
            [careerFeatureName.IncreaseItemPrice]: 0.5,
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")
