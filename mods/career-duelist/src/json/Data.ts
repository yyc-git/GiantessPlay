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

export let getName = () => "Career_Duelist"

export enum languageKey {
    Title,
    PositiveDescription1,
    NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "决斗者",
            // [languageKey.PositiveDescription1]: "增加0.1运气",
            // // [languageKey.NegativeDescription1]: "每1分钟的最后5秒进入决斗时间（持续30秒）：关卡巨大娘的攻击目标锁定为玩家；新出现的敌人的攻击目标锁定为玩家，并根据玩家的属性进行加强（巨大娘、小人角色均受影响）",
            // [languageKey.NegativeDescription1]: "每1分钟的最后5秒进入决斗时间（持续30秒）：关卡巨大娘、敌人的攻击目标锁定为玩家；新出现的敌人会更强（巨大娘、小人角色均受影响）",
        },
        [language.English]: {
            [languageKey.Title]: "Duelist",
            // [languageKey.PositiveDescription1]: "Increase 0.1 luck",
            // [languageKey.NegativeDescription1]: "Every 5 seconds of the last minute, the duel time begins (lasting for 30 seconds): level giantess and enemies will target the player; newly appearing enemies will be stronger (character share)",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        // needGem: needGem.VeryHigh,
        needGem: needGem.Low,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseLuck]: 0.1,
            [careerFeatureName.Duelist]: api.getNullableCareerFeautreDataValue(),
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")
