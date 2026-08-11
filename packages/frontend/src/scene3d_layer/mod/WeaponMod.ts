import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn } from "./Mod";
import { service } from "weapon-protocol/src/service/ServiceType"
import { updateParticleCollision } from "../script/scene/scene_city/manage/city1/ArmyManager";
import { removeParticle } from "../script/scene/scene_city/utils/ArmyUtils2";
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { modProtocolName } from "./data/ModData";

// let _getWeaponMagicAttack1BlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "weapon-protocol", "weapon-magicattack1")
// }

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "weapon-magicattack1",
    ])
}

// let _getAllServices = (state):Array<service> => {
//     return [
//         _getWeaponMagicAttack1BlockService(state),
//     ]
// }

let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.WeaponProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "weapon")
}

export let updateAllParticleCollisions = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise(
        _getAllServices(state),
        (state, service) => {
            return updateParticleCollision(state, [
                api.NullableUtils.map(func => func(api), service.handleHitStatic),
                api.NullableUtils.map(func => func(api), service.handleHitGirl),
                api.NullableUtils.map(func => func(api), service.handleHitArmy),
                api.NullableUtils.map(func => func(api), service.handleHitLittleMan),

                api.NullableUtils.getExn(service.getAllParticlesForCollisionCheck)(api),
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