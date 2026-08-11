import { api } from "type-api/src/Type"
import { forceSize, stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Other_Run"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "疾跑",
            [languageKey.Description]: "30秒内速度*10倍，受到攻击会移除效果",
        },
        [language.English]: {
            [languageKey.Title]: "Run",
            [languageKey.Description]: "10x speed in 30s, be attacked will remove effect",
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
        // isOutLevelBuild: true,
        isOutLevelBuild: false,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            return api.isBossLevel(state)
        default:
            return false
    }
}