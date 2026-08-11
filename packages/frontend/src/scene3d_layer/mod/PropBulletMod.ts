import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn } from "./Mod";
import { service } from "prop-bullet-protocol/src/service/ServiceType"
// import {  updateParticleCollision } from "../script/scene/scene_city/manage/city1/ArmyManager";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { bulletPropName, gunName, propData, propName } from "../script/scene/scene_city/type/StateType";
import { removeParticle } from "../script/scene/scene_city/utils/ArmyUtils2";
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { modProtocolName } from "./data/ModData";

export let getWeaponBasicBulletBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-bullet-protocol", "prop-bullet-basic")
}

export let getWeaponSubMachineBulletBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-bullet-protocol", "prop-bullet-submachine")
}

export let getWeaponShotBulletBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-bullet-protocol", "prop-bullet-shot")
}

export let getWeaponBiggerBulletBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-bullet-protocol", "prop-bullet-bigger")
}

export let getWeaponSmallerBulletBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-bullet-protocol", "prop-bullet-smaller")
}

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "prop-bullet-basic",
        "prop-bullet-submachine",
        "prop-bullet-shot",
        "prop-bullet-bigger",
        "prop-bullet-smaller",
    ])
}

// let _getAllServices = (state):Array<service> => {
//     return [
//         getWeaponBasicBulletBlockService(state),
//         getWeaponSubMachineBulletBlockService(state),
//         getWeaponShotBulletBlockService(state),
//         getWeaponBiggerBulletBlockService(state),
//         getWeaponSmallerBulletBlockService(state),
//     ]
// }

let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.PropBulletProtocol, blockName)
    })
}

let _getAllServices = (state): Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "propBullet")
}

export let updateAllParticleCollisions = (state: state, updateParticleCollisionFunc) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise(
        _getAllServices(state),
        (state, service) => {
            return updateParticleCollisionFunc(state, [
                api.NullableUtils.map(func => func(api), service.handleHitStatic),
                api.NullableUtils.map(func => func(api), service.handleHitGirl),
                api.NullableUtils.map(func => func(api), service.handleHitArmy),
                api.NullableUtils.map(func => func(api), service.handleHitLittleMan),

                service.getAllParticlesForCollisionCheck(api),
                service.getPointBox,
                removeParticle
            ],
                service.getWeaponValue(api, state),
                service.getWeaponName()
            )
        },
        state
    )
}

export let getAllPropData = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<Array<propData>, service>(
        _getAllServices(state),
        (result, service) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(getPropData => ArrayUtils.push(
                    result,
                    getPropData(api, state)
                ), service.getPropData),
                result
            )
        },
        []
    )
}

export let getWeaponValue = (state: state, weaponName: string) => {
    let api = getModAPI(state)

    return NullableUtils.getExn(_getAllServices(state).find(service => {
        return service.getWeaponName() == weaponName
    })).getWeaponValue(api, state)
}

export let getEmitFunc = (state: state, weaponName: string) => {
    let api = getModAPI(state)

    return NullableUtils.getExn(_getAllServices(state).find(service => {
        return service.getWeaponName() == weaponName
    })).emitParticleEmit(api)
}

export let getEmitSoundResourceId = (state: state, weaponName: string) => {
    return NullableUtils.getExn(_getAllServices(state).find(service => {
        return service.getWeaponName() == weaponName
    })).getEmitSoundResourceId()
}

export let isLockable = (state: state, weaponName: string) => {
    switch (weaponName) {
        case gunName.LaserGun:
        case gunName.RocketGun:
            return true
        default:
            return NullableUtils.getWithDefault(
                NullableUtils.map(
                    service => service.isLockable(),
                    _getAllServices(state).find(service => {
                        return service.getWeaponName() == weaponName
                    })),
                false
            )
    }
}

// export let getWeaponImageBase64 = (state: state, weaponName: string) => {
//     let api = getModAPI(state)

//     return NullableUtils.getExn(_getAllServices(state).find(service => {
//         return service.getWeaponName() == weaponName
//     })).getWeaponImageBase64(api, state)
// }

export let getWeaponImagePath = (state: state, weaponName: string) => {
    // let api = getModAPI(state)

    return NullableUtils.getExn(_getAllServices(state).find(service => {
        return service.getWeaponName() == weaponName
    })).getWeaponImagePath()
}

export let isDisable = (state: state, name: propName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<boolean, service>(
        _getAllServices(state),
        (result, service) => {
            if (result) {
                return result
            }

            return NullableUtils.getWithDefault(
                NullableUtils.map(isDisable => isDisable(api, state, name), service.isDisable),
                result
            )
        },
        false
    )
}

export let getAllWeaponNames = (state: state) => {
    return [
        getWeaponBasicBulletBlockService(state),
        getWeaponShotBulletBlockService(state),
        getWeaponSubMachineBulletBlockService(state),
    ].map(service => service.getWeaponName())
}