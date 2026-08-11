import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName, getBuffBlockName, getBuffProtocolName, getProtocolName } from "../script/Utils"
import { propData, propType, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Artifact_GiantessStimulator"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "巨大娘刺激器",
            [languageKey.Description]: "击中弱点部位的伤害增加2倍；击中胸部可使其变大",
        },
        [language.English]: {
            [languageKey.Title]: "Giantess Stimulator",
            [languageKey.Description]: "Double the damage from hitting weak parts; Hitting the breast can make it bigger",
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
            let service = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName())

            return api.hasBuff(state, service.getName(), service.getTargetName(api), api.NullableUtils.getEmpty())
        default:
            return false
    }
}