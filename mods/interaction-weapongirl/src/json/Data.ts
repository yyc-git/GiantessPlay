import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getCostFactor, getPropBasicBulletBlockName, getPropBulletProtocolName, getPropShotBulletBlockName, getPropSubmachineBulletBlockName } from "../script/Utils"
import { buffName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { field, weaponSingleData } from "interaction-protocol/src/service/ServiceType"
import { emitterCount, emitterLife, emitterSpeed, weaponName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "prop-bullet-protocol/src/service/ServiceType"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getBuyResourceId = () => "buy"

export let getOpenWeaponGirlResourceId = () => "open"

export enum languageKey {
    WeaponGirlDescription,
    LaserGun,
    RocketGun,
    BasicBulletGun,
    SubMachineBulletGun,
    ShotGun,

    emitterLife,
    emitterSpeed,
    emitterCount,
    force,
    emitSpeed,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.WeaponGirlDescription]: "开启武器女神",
            [languageKey.LaserGun]: "激光枪",
            [languageKey.RocketGun]: "火箭弹",
            [languageKey.BasicBulletGun]: "步枪",
            [languageKey.SubMachineBulletGun]: "冲锋枪",
            [languageKey.ShotGun]: "散弹枪",
            // [languageKey.emitterLife]: "子弹存在时间",
            [languageKey.emitterLife]: "射程",
            // [languageKey.emitterSpeed]: "子弹速度",
            [languageKey.emitterSpeed]: "子弹飞行速度",
            // [languageKey.emitterCount]: "子弹数量",
            [languageKey.emitterCount]: "弹丸数量",
            [languageKey.force]: "威力",
            [languageKey.emitSpeed]: "射速",
        },
        // [language.English]: {
        //     [languageKey.WeaponGirlDescription]: "Open Weapon Giantess",
        //     [languageKey.LaserGun]: "LaserGun",
        //     [languageKey.RocketGun]: "RocketGun",
        //     [languageKey.BasicBulletGun]: "BasicBulletGun",
        //     [languageKey.SubMachineBulletGun]: "SubMachineBulletGun",
        //     [languageKey.ShotGun]: "ShotGun",
        //     [languageKey.emitterLife]: "Bullet Life",
        //     [languageKey.emitterSpeed]: "Bullet Speed",
        //     [languageKey.emitterCount]: "Bullet Count",
        //     [languageKey.force]: "Force",
        //     [languageKey.emitSpeed]: "Rate of fire",
        // },
        [language.English]: {
            [languageKey.WeaponGirlDescription]: "Weapon Goddess",
            [languageKey.LaserGun]: "Laser Gun",
            [languageKey.RocketGun]: "Rocket Launcher",
            [languageKey.BasicBulletGun]: "Assault Rifle",
            [languageKey.SubMachineBulletGun]: "Submachine Gun",
            [languageKey.ShotGun]: "Shotgun",
            [languageKey.emitterLife]: "Range",
            [languageKey.emitterSpeed]: "Projectile Velocity",
            [languageKey.emitterCount]: "Projectile Count",
            [languageKey.force]: "Damage",
            [languageKey.emitSpeed]: "Fire Rate",
        }
    }
}

export let getWeaponGirlMapResourceId = () => 1051

export let getWeaponGirlResourceId = () => "weaponGirl"

export let getWeaponGirlResourcePath = () => _getPath(getWeaponGirlResourceId(), "glb")

export let getName = () => "Interaction_WeaponGirl"

export let getWeaponData = (api: api, state: state): Array<weaponSingleData> => {
    let costFactor = getCostFactor(api, state)

    return [
        {
            name: weaponName.LaserGun,
            text: api.getLanguageDataByData(state, getTextData(), languageKey.LaserGun),
            fields: [
                {
                    name: field.emitterLife,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                    ratio: 0.3,
                    // baseCoin: 80,
                    baseCoin: 300 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 10,
                    maxValue: 5,
                },
                {
                    name: field.emitterSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterSpeed),
                    ratio: 0.3,
                    baseCoin: 80 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 5,
                    maxValue: 12,
                },
                {
                    name: field.force,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.force),
                    ratio: 0.3,
                    baseCoin: 150 * costFactor,
                    // coinFactor: 1.5,
                    coinFactor: 2,
                    maxValue: 10,
                },
                {
                    name: field.emitSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitSpeed),
                    ratio: 0.1,
                    baseCoin: 120 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 10,
                    isInteger: true,
                    isSub: true,
                },
            ],
        },
        {
            name: weaponName.RocketGun,
            text: api.getLanguageDataByData(state, getTextData(), languageKey.RocketGun),
            fields: [
                {
                    name: field.emitterLife,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                    ratio: 0.3,
                    baseCoin: 200 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 10,
                    maxValue: 8,
                },
                {
                    name: field.emitterSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterSpeed),
                    ratio: 0.3,
                    baseCoin: 80 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 7,
                    maxValue: 5,
                },
                {
                    name: field.force,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.force),
                    ratio: 0.3,
                    // baseCoin: 150 * costFactor,
                    baseCoin: 300 * costFactor,
                    // coinFactor: 1.5,
                    coinFactor: 2,
                    maxValue: 10,
                },
                {
                    name: field.emitSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitSpeed),
                    ratio: 0.1,
                    baseCoin: 120 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 20,
                    isInteger: true,
                    isSub: true,
                },
            ],
        },

        {
            name: api.blockAPI.getBlockService<service>(state, getPropBulletProtocolName(), getPropBasicBulletBlockName()).getWeaponName(),
            text: api.getLanguageDataByData(state, getTextData(), languageKey.BasicBulletGun),
            fields: [
                // {
                //     name: field.emitterLife,
                //     text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                //     ratio: 0.3,
                //     baseCoin: 80,
                //     coinFactor: 1.5,
                //     // maxValue: 10,
                //     maxValue: 3,
                // },
                {
                    name: field.emitterLife,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                    ratio: 0.3,
                    // baseCoin: 80,
                    baseCoin: 300 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 10,
                    maxValue: 5,
                },
                {
                    name: field.emitterSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterSpeed),
                    ratio: 0.3,
                    baseCoin: 80 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 6,
                    maxValue: 12,
                },
                {
                    name: field.force,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.force),
                    ratio: 0.3,
                    baseCoin: 150 * costFactor,
                    // coinFactor: 1.5,
                    coinFactor: 2,
                    maxValue: 10,
                },
                {
                    name: field.emitSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitSpeed),
                    ratio: 0.1,
                    baseCoin: 120 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 5,
                    maxValue: 10,
                    isInteger: true,
                    isSub: true,
                },
            ],
        },
        {
            name: api.blockAPI.getBlockService<service>(state, getPropBulletProtocolName(), getPropSubmachineBulletBlockName()).getWeaponName(),
            text: api.getLanguageDataByData(state, getTextData(), languageKey.SubMachineBulletGun),
            fields: [
                // {
                //     name: field.emitterLife,
                //     text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                //     ratio: 0.3,
                //     baseCoin: 80,
                //     coinFactor: 1.5,
                //     // maxValue: 10,
                //     maxValue: 3,
                // },
                {
                    name: field.emitterLife,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                    ratio: 0.3,
                    // baseCoin: 80,
                    baseCoin: 300 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 10,
                    maxValue: 5,
                },
                {
                    name: field.emitterSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterSpeed),
                    ratio: 0.3,
                    baseCoin: 80 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 5,
                    // maxValue: 10,
                    maxValue: 8,
                },
                {
                    name: field.force,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.force),
                    ratio: 0.3,
                    baseCoin: 150 * costFactor,
                    // coinFactor: 1.5,
                    coinFactor: 2,
                    maxValue: 10,
                },
                {
                    name: field.emitSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitSpeed),
                    ratio: 0.1,
                    // baseCoin: 80,
                    baseCoin: 120 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 10,
                    isInteger: true,
                    isSub: true,
                },
            ],
        },
        {
            name: api.blockAPI.getBlockService<service>(state, getPropBulletProtocolName(), getPropShotBulletBlockName()).getWeaponName(),
            text: api.getLanguageDataByData(state, getTextData(), languageKey.ShotGun),
            fields: [
                {
                    name: field.emitterLife,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterLife),
                    ratio: 0.3,
                    baseCoin: 300 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 8,
                },
                {
                    name: field.emitterSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterSpeed),
                    ratio: 0.3,
                    baseCoin: 80 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 5,
                    // maxValue: 8,
                    // maxValue: 12,
                },
                {
                    name: field.emitterCount,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitterCount),
                    ratio: 0.3,
                    baseCoin: 200 * costFactor,
                    coinFactor: 1.5,
                    // maxValue: 5,
                    maxValue: 3,
                    isInteger: true,
                },
                {
                    name: field.force,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.force),
                    ratio: 0.3,
                    baseCoin: 300 * costFactor,
                    // coinFactor: 1.5,
                    coinFactor: 2,
                    maxValue: 10,
                },
                {
                    name: field.emitSpeed,
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.emitSpeed),
                    ratio: 0.1,
                    baseCoin: 300 * costFactor,
                    coinFactor: 1.5,
                    maxValue: 10,
                    isInteger: true,
                    isSub: true,
                },
            ],
        },
    ]
}

export let getInteractionConfig = () => {
    return {
        resourceId: getWeaponGirlMapResourceId(),
        rate: 0.01
        // rate: 0.8
    }
}

export let getLoadResourceIdData = () => {
    return {
        [getWeaponGirlMapResourceId()]: {
            loadResourceId: getWeaponGirlResourceId()
        },
    }
}

export let getTriggerData = (api: api, state: state) => {
    return {
        [getName()]: {
            description: api.getLanguageDataByData(state, getTextData(), languageKey.WeaponGirlDescription),
            imageSrc: _getPath("weapon", "png")
        },
    }
}