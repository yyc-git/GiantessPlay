import { api } from "type-api/src/Type"
import { forceSize, stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Other_Use_GiantessCharacter"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "巨大娘人物使用",
            // [languageKey.Description]: "允许使用除默认以外的巨大娘人物。每次使用会消耗一个道具",
            [languageKey.Description]: "允许使用巨大娘人物。每次使用会消耗一个道具",
        },
        [language.English]: {
            [languageKey.Title]: "Giantess Character Use",
            // [languageKey.Description]: "Allow the use giantess characters other than the default. Each use will consume one item",
            [languageKey.Description]: "Allow the use giantess characters. Each use will consume one item",
        },
    }
}

export let getPropData = (api: api, state: state): propData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),

        description: api.getLanguageDataByData(state, getTextData(), languageKey.Description),

        imageSrc: getPropImageResourcePath(),
        count: 0,
        type: propType.Other,
        characterType: characterType.Both,
        isOutLevelBuild: true,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            return true
        default:
            return false
    }
}