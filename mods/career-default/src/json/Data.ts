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

export let getName = () => "Career_Default"

export enum languageKey {
    Title,
    PositiveDescription,
    NegativeDescription,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "普通人",
            // [languageKey.PositiveDescription]: "无",
            // [languageKey.NegativeDescription]: "无",
        },
        [language.English]: {
            [languageKey.Title]: "Ordinary People",
            // [languageKey.PositiveDescription]: "Empty",
            // [languageKey.NegativeDescription]: "Empty",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.Zero,

        // characterType: characterType.Both,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.Empty]: api.getNullableCareerFeautreDataValue()
        })
        // getPositiveDescriptionFunc: (state) => {
        //     return [api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription)]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription)]
        // },
        // applyFunc: (state) => {
        //     return Promise.resolve(state)
        // },
    }
}

// export let getCharacterType = () => characterType.LittleMan
export let getCharacterType = () => characterType.Both

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

let _getImageSrc = () => getImagePath("icon")
