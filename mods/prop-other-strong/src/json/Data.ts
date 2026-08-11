import { api } from "type-api/src/Type"
import { forceSize, stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getBuffProtocolName, getBuffStrongBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Other_Strong"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "霸体",
            // [languageKey.Description]: "10秒内霸体，不会被精英巨大娘踩倒",
            // [languageKey.Description]: "30秒内霸体，降低被踩倒、硬直几率，被压住也更容易起身",
            [languageKey.Description]: "30秒内霸体，降低被踩倒、硬直几率",
        },
        [language.English]: {
            [languageKey.Title]: "Strong",
            // [languageKey.Description]: "Strong within 30 seconds, reduce the chances of being stepped on or stun, and make it easier to stand up when pressed down",
            [languageKey.Description]: "Strong within 30 seconds, reduce the chances of being stepped on or stun",
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
        type: propType.Water,
        characterType: characterType.LittleMan,
        isOutLevelBuild: false,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            // return api.getLittleManValue(state).stressingRateFactor == stressingRateFactor.Zero
            return api.hasBuff(state, api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffStrongBlockName()).getName(),
                name,
                api.NullableUtils.getEmpty()
            )
        default:
            return false
    }
}