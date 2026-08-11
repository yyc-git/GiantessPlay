import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"


export let getBasicBulletHitSoundResourceId = () => "basic_bullet_gun_hit"

export let getBasicBulletEmmitSoundResourceId = () => "basic_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getGlbPath = (name) => _getPath(name, "glb")

export let getWeaponName = () => "Weapon_BasicBulletGun"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "普通子弹",
            [languageKey.Description]: "单点普通攻击",
        },
        [language.English]: {
            [languageKey.Title]: "Basic Bullet",
            [languageKey.Description]: "Single Basic Attack",
        },
    }
}

export let getPropData = (api: api, state: state): propData => {
    return {
        name: getWeaponName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),

        description: api.getLanguageDataByData(state, getTextData(), languageKey.Description),

        // imageSrc: api.getTextureImageBase64(state, getPropImageResourceId()),
        imageSrc: getPropImageResourcePath(),
        count: Infinity,
        type: propType.Bullet,
        characterType: characterType.LittleMan,
        isOutLevelBuild: false,
    }
}

// export let getWeaponImageResourceId = () => getImagePath("BasicGun")

export let getWeaponImageResourcePath = () => getImagePath("Gun")

export let getPropImageResourcePath = getWeaponImageResourcePath


// export let getWeaponImageBase64 = (api: api, state: state) => api.getTextureImageBase64(state, getWeaponImageResourceId())

export let getWeaponGlbResourceId = () => getGlbPath("gun")

export let isLockable = () => true

export let getWeaponValue = (api: api, state: state): weaponValue => {
    return {
        force: forceSize.VeryLow,
        // armorPiercingForceRatio: armorPiercingForceRatio.None,
        armorPiercingForceRatio: armorPiercingForceRatio.VeryLow2,
        // force: forceSize.High,
        type: weaponType.Impact,


        // emitSpeed: emitSpeed.VeryFast,
        // emitSpeed: emitSpeed.Fast,
        emitSpeed: emitSpeed.Middle,
        critRatio: critRatio.Zero,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        // emitterSpeed: emitterSpeed.MaxFast,
        emitterLife: emitterLife.Middle,
        // emitterLife: emitterLife.Short,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.One,

        meleeRange: api.NullableUtils.getEmpty(),
    }
}