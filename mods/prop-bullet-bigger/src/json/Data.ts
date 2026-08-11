import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"


export let getBulletHitSoundResourceId = () => "prop_bullet_gun_hit"

export let getBulletEmmitSoundResourceId = () => "prop_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getGlbPath = (name) => _getPath(name, "glb")

export let getWeaponName = () => "Weapon_BiggerBulletGun"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "变大子弹",
            [languageKey.Description]: "使巨大娘变大",
        },
        [language.English]: {
            [languageKey.Title]: "Bigger Bullet",
            [languageKey.Description]: "Make giantess bigger",
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
        count: 0,
        type: propType.Bullet,
        characterType: characterType.LittleMan,
        isOutLevelBuild: true,
    }
}

export let getWeaponImageResourcePath = () => getImagePath("Gun")

export let getPropImageResourcePath = () => getImagePath("prop")

export let getWeaponGlbResourceId = () => getGlbPath("gun")

export let isLockable = () => false

export let getWeaponValue = (api: api, state: state): weaponValue => {
    return {
        force: forceSize.None,
        armorPiercingForceRatio: armorPiercingForceRatio.None,
        type: weaponType.Magic,

        // emitSpeed: emitSpeed.VerySlow,
        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Zero,
        // explodeRange: explodeRange.Zero,
        explodeRange: explodeRange.VeryBig,


        emitterSpeed: emitterSpeed.MostFast,
        emitterLife: emitterLife.VeryLong,
        emitterSize: emitterSize.Big,
        emitterCollisionSize: emitterCollisionSize.Big,
        emitterVolume: emitterVolume.Big,
        emitterCount: emitterCount.One,

        meleeRange: api.NullableUtils.getEmpty(),
    }
}

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getWeaponName():
            return api.isBossLevel(state)
        default:
            return false
    }
}