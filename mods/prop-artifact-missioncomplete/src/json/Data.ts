import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { propData, propType, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Artifact_MissionComplete"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "通关",
            [languageKey.Description]: "通过本关",
        },
        [language.English]: {
            [languageKey.Title]: "Pass Level",
            [languageKey.Description]: "Pass Level",
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