import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Artifact_GiantessController"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "巨大娘控制器",
            [languageKey.Description]: "控制最近的巨大娘",
        },
        [language.English]: {
            [languageKey.Title]: "Giantess Controller",
            [languageKey.Description]: "Control the nearest giantess",
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
        characterType: characterType.LittleMan,
        isOutLevelBuild: true,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let getSoundResourcePath = () => getSoundPath("use")

export let getSoundResourceId = getSoundResourcePath

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            return api.isBossLevel(state)
                || !api.hasLevelGiantessExceptPlayerGirl(state)
        // || (
        //     api.hasPickData(state, usedGirl)
        //     || api.isTriggerGirlAction(state, usedGirl,actionName.Pickup
        //     )
        // )
        default:
            return false
    }
}