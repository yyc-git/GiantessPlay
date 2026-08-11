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

export let getName = () => "Career_Absorber"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "吸收者",
        },
        [language.English]: {
            [languageKey.Title]: "Absorber",
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
            [careerFeatureName.DamageControlledUnit]: 1,
            [careerFeatureName.AbsorbDeathControlledUnit]: 1,
            [careerFeatureName.DecreaseGiantessDefense]: 0.99,
            [careerFeatureName.IncreaseGiantessDamaged]: 0.5,
        })
    }
}

export let getCharacterType = () => characterType.Giantess

let _getImageSrc = () => getImagePath("icon")
