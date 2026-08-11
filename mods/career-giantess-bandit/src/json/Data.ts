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

export let getName = () => "Career_Giantess_Bandit"

export enum languageKey {
    Title,
    PositiveDescription1,
    NegativeDescription1,
    NegativeDescription2,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "匪徒",
            // [languageKey.PositiveDescription1]: "每分钟随机获得2个道具（仅限本轮使用）",
            // [languageKey.NegativeDescription1]: "你击杀一个军队单位后，本局未来生成的所有的军队单位会更强（巨大娘、小人角色均受影响）",
            // // [languageKey.NegativeDescription2]: "物品价格增加200%",
            // [languageKey.NegativeDescription2]: "物品价格增加100%",
        },
        [language.English]: {
            [languageKey.Title]: "Bandit",
            // [languageKey.PositiveDescription1]: "Randomly obtain 2 items every minute (only for use in this round)",
            // [languageKey.NegativeDescription1]: `When you defeat an army unit, all future army spawned in the current level will be stronger(character share)`,
            // // [languageKey.NegativeDescription2]: "The price of the item increase 200%",
            // [languageKey.NegativeDescription2]: "The price of the item increase 100%",
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
            [careerFeatureName.GetGoodsEveryMinute]: 2,
            [careerFeatureName.EnhenceArmyAfterBeat]: api.getNullableCareerFeautreDataValue(),
            // [careerFeatureName.IncreaseItemPrice]: 2,
            [careerFeatureName.IncreaseItemPrice]: 1,
        })
    }
}

export let getCharacterType = () => characterType.Giantess

let _getImageSrc = () => getImagePath("icon")
