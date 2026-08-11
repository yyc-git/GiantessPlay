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

export let getName = () => "Career_FootFetish"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "足控者",
        },
        [language.English]: {
            [languageKey.Title]: "Foot Fetish",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.High,

        // characterType: getCharacterType(),

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.CharmNearFoot]: 1,
            [careerFeatureName.ConvertToFriendCampForPutToShoe]: api.getNullableCareerFeautreDataValue(),
            [careerFeatureName.EnhenceByFreeShoe]: 0.2,
        })
        // getPositiveDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription1),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription2)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return []
        // },
        // applyFunc: (state, characterType) => {
        //     return Promise.resolve(state)
        // },
    }
}

export let getCharacterType = () => characterType.Giantess

let _getImageSrc = () => getImagePath("icon")
