import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Artifact_SpecificGiantess"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "指定巨大娘人物",
            // [languageKey.Description]: "指定下一个城市关卡出现的野生巨大娘人物",
            // [languageKey.Description]: "指定后续城市关卡出现的野生巨大娘人物",
            // [languageKey.Description]: "指定下一个及以后的城市关卡出现的野生巨大娘人物",
            // [languageKey.Description]: "指定攻击城市关卡的野生巨大娘人物和其它关卡的Boss巨大娘人物（从下一关开始生效）",
            [languageKey.Description]: "指定攻击城市关卡的野生巨大娘人物和其它关卡的某一个Boss巨大娘人物（从下一关开始生效）（仅限白色和绿色人物）",
        },
        [language.English]: {
            [languageKey.Title]: "Specific giantess character",
            // [languageKey.Description]: "Specific wild giantess character in next city levels",
            [languageKey.Description]: "Designate the wild giantess character for the attack city level and a specific boss giantess character for other levels (effective from the next level onwards)(only can select white or green characters)",
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
        type: propType.Artifact,
        characterType: characterType.Both,
        isOutLevelBuild: true,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let getSoundResourcePath = () => getSoundPath("use")

export let getSoundResourceId = getSoundResourcePath

export let isDisable = (api: api, state: state, name) => {
    return false
}