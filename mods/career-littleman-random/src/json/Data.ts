import { getBlockName, getCareerFeatureData, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_LittleMan_Random"

export enum languageKey {
    Title,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "随机",
        },
        [language.English]: {
            [languageKey.Title]: "Random",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.MostHigh,

        // characterType: getCharacterType(),

        getCareerFeatureData: (state) => {
            return getCareerFeatureData(api, state)
        }
        // getPositiveDescriptionFunc: (state) => {
        //     return getCareerFeatureData(api, state).filter(([data, _]) => data.positive).reduce((result, [data, value]) => {
        //         return api.ArrayUtils.push(
        //             result, data.getDescriptionFunc(state, value)
        //         )
        //     }, [])
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return getCareerFeatureData(api, state).filter(([data, _]) => !data.positive).reduce((result, [data, value]) => {
        //         return api.ArrayUtils.push(
        //             result, data.getDescriptionFunc(state, value)
        //         )
        //     }, [])
        // },
        // applyFunc: (state, characterType_) => {
        //     return api.ArrayUtils.reducePromise(
        //         getCareerFeatureData(api, state),
        //         (state, [data, value]) => {
        //             return data.applyFunc(state, characterType_, value, data.name)
        //         },
        //         state
        //     )
        // },
    }
}

export let getCharacterType = () => characterType.LittleMan

let _getImageSrc = () => getImagePath("icon")
