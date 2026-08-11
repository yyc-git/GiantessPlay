import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"


export let getShotBulletHitSoundResourceId = () => "shot_bullet_gun_hit"

export let getShotBulletEmmitSoundResourceId = () => "shot_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getGlbPath = (name) => _getPath(name, "glb")

export let getWeaponName = () => "Weapon_ShotBulletGun"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "散弹枪子弹",
            [languageKey.Description]: "多点普通攻击",
        },
        [language.English]: {
            [languageKey.Title]: "Shot Bullet",
            [languageKey.Description]: "Mutiple Common Attack",
        },
    }
}

export let getPropData = (api: api, state: state): propData => {
    return {
        name: getWeaponName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),

        description: api.getLanguageDataByData(state, getTextData(), languageKey.Description),

        imageSrc: getPropImageResourcePath(),
        count: 0,
        type: propType.Bullet,
        characterType: characterType.LittleMan,
        isOutLevelBuild: false,
    }
}

// export let getWeaponImageResourceId = () => getImagePath("ShotGun")

export let getWeaponImageResourcePath = () => getImagePath("Gun")

export let getPropImageResourcePath = getWeaponImageResourcePath

// export let getWeaponImageBase64 = (api: api, state: state) => api.getTextureImageBase64(state, getWeaponImageResourceId())

export let getWeaponGlbResourceId = () => getGlbPath("gun")

export let isLockable = () => false

export let getWeaponValue = (api: api, state: state): weaponValue => {
    return {
        // force: forceSize.VeryLow,
        // force: forceSize.Low2,
        force: forceSize.VeryLow,
        armorPiercingForceRatio: armorPiercingForceRatio.Low,
        // force: forceSize.High,
        type: weaponType.Impact,


        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Middle,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Short,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.More,

        meleeRange: api.NullableUtils.getEmpty(),

        customData: {
            // count: 10,
            minOffset: -0.1,
            maxOffset: 0.1,
        }
    }
}