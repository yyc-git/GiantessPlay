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

export let getName = () => "Career_Enterpriser"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    PositiveDescription3,
    // PositiveDescription4,
    NegativeDescription1,
    NegativeDescription2,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "企业家",
            // [languageKey.PositiveDescription1]: "获得的金币增加50%",
            // // [languageKey.PositiveDescription2]: "运气增加0.2",
            // [languageKey.PositiveDescription2]: "物品价格减少25%",
            // [languageKey.PositiveDescription3]: "商店物品种类增加25%",
            // // [languageKey.NegativeDescription1]: "每2分钟，本关获得的金币减少100%",
            // [languageKey.NegativeDescription1]: "商店购买后，金币减少100%",
            // // [languageKey.NegativeDescription2]: "减少50%伤害",
            // [languageKey.NegativeDescription2]: "减少25%伤害",
        },
        [language.English]: {
            [languageKey.Title]: "Enterpriser",
            // [languageKey.PositiveDescription1]: "The number of coins obtained has increased 50%",
            // // [languageKey.PositiveDescription2]: "Increase 0.2 luck",
            // [languageKey.PositiveDescription2]: "The price of the item has been reduced by 25%",
            // [languageKey.PositiveDescription3]: "The variety of items in the trade has increased by 25%",
            // // [languageKey.NegativeDescription1]: "Every two minutes, the coins obtained in this level decrease 100%",
            // [languageKey.NegativeDescription1]: "After buy in the trade, coin decrease 100%",
            // // [languageKey.NegativeDescription2]: "Decrease 50% damage",
            // [languageKey.NegativeDescription2]: "Decrease 25% damage",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.Middle,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseGetCoin]: 0.5,
            [careerFeatureName.IncreaseTradeVariety]: 0.25,
            [careerFeatureName.DecreaseItemPrice]: 0.25,
            [careerFeatureName.DecreaseCoinAfterBuyTrade]: 1,
            // [careerFeatureName.ReduceDamage]: 0.5,
            [careerFeatureName.ReduceDamage]: 0.25,
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")
