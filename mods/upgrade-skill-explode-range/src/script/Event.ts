import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getParticleShareProtocolName, getParticleShareBlockName, getParticleBillboardBlockName, getParticleProtocolName, setState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { camp, damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getSoundResourceId(),
                path: [getSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

let _buildEffectWeaponValue = (api, force, weaponType_) => {
    return api.buildEffectWeaponValue(
        force,
        armorPiercingForceRatio.Middle,
        weaponType_,
        critRatio.Zero
    )

}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    if (userData.weaponValue.type == weaponType.Effect) {
        return Promise.resolve([state, userData])
    }


    let level = getLittleManLevel(api, state)

    // let life = 3000
    let life = 500
    // let size = 10
    // let size = 30
    let size = 60

    //// TODO restore
    let rate = 0.05
    // let rate = 0.3
    // let rate = 1

    //// TODO restore
    let value = computeValue(level)
    // let value = level * 0.8

    let position = api.getPositionParrelToGround(
        // api.TransformUtils.getPositionFromMatrix4(userData.transform)
        userData.damagePosition
    )
    // let position = userData.damagePosition


    if (level > 0 && userData.fromName == api.getLittleManName() && api.isRandomRate(rate)) {
        state = api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
            [
                api.blockAPI.getBlockService(state, getParticleProtocolName(), getParticleBillboardBlockName()),
                state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBillboardBlockName()),
                (state, blockState) => {
                    return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBillboardBlockName(), blockState)
                }
            ],
            api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardBlockName()).getParticleType(),
            {
                speed: 1,
                life: life,
                width: size,
                height: size,
                position: position.toArray(),
                resourceId: api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardBlockName()).getImageId(),
            })


        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
        ))


        let box = api.box3.setFromCenterAndSize(
            api.box3.getTempBox1(),
            position,
            api.vector3.set(
                api.vector3.getTempVector1(),
                size, 1, size
            )
        )

        // let force = value * userData.damage
        let force = value * userData.forceSize
        let forceDirection = api.buildRandomDirectionInXZ()
        let damageType_ = damageType.Global
        let weaponType_ = weaponType.Effect
        let weaponValue_ = _buildEffectWeaponValue(api, force, weaponType_)

        // if (api.girl.isGirl(userData.name)) {
        //     state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
        //         // TODO update
        //         return api.setAbstractState(state, api.ParticleManager.emitSparkLightHit(api.getAbstractState(state), {
        //             speed: 1,
        //             life: 600,
        //             size: 5,
        //             position: damagePosition.toArray()
        //         }))
        //     })

        // }
        // else {
        //     state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
        //         // TODO update
        //         return api.setAbstractState(state, api.ParticleManager.emitSparkLightHit(api.getAbstractState(state), {
        //             speed: 1,
        //             life: 600,
        //             size: 5,
        //             position: damagePosition.toArray()
        //         }))
        //     })

        // }


        return api.damageWithMultipleData(
            state, [[force, forceDirection], [damageType_, weaponType_]],
            weaponValue_,
            userData.fromName,
            api.NullableUtils.getEmpty(),
            api.ArrayUtils.unzip(
                api.checkRangeBoxCollisionWithArmy(
                    state,
                    box,
                    camp.Player
                )
            )
        ).then(([state, _]) => {
            return api.ArrayUtils.reducePromise(api.girl.getCurrentUsedGirls(state), (state, usedGirl) => {
                if (
                    // api.isUseGirl(state, usedGirl)
                    api.isGiantessExceptPlayer(state, usedGirl)
                    // && api.box3.intersectsBox(
                    //     box,
                    //     api.girl.getGirlBox(state, usedGirl)
                    // )
                ) {
                    // return api.NullableUtils.getWithDefault(
                    //     api.NullableUtils.map(collisionPart => {
                    //         return api.damageGiantess(
                    //             state,
                    //             [force, damageType_, weaponType_],
                    //             userData.fromName,
                    //             collisionPart,
                    //             api.NullableUtils.return_(
                    //                 api.getPivotWorldPosition(state, usedGirl)
                    //             ),
                    //             weaponValue_,
                    //         )
                    //     }, api.queryAllOBBShapesCollisionWithBox(state, usedGirl, box, position)),
                    //     Promise.resolve(state)
                    // )

                    return api.ArrayUtils.reducePromise(
                        api.queryAllOBBShapesCollisionWithBox(state, usedGirl, box, position), (state, collisionPart) => {
                            force = api.girl.computeAttenuationByHeightForEffect(force, state, usedGirl, api.NullableUtils.getEmpty())

                            weaponValue_ = _buildEffectWeaponValue(api, force, weaponType_)

                            return api.damageGiantess(
                                state,
                                usedGirl,
                                [force, damageType_, weaponType_],
                                userData.fromName,
                                collisionPart,
                                api.NullableUtils.return_(
                                    // api.getPivotWorldPosition(state, usedGirl)
                                    api.getCollisionPartCenter(state, usedGirl, collisionPart)
                                ),
                                weaponValue_,
                            )
                        }, state
                    )
                }

                return Promise.resolve(state)
            }, state)
        }).then(state => [state, userData])
    }

    return Promise.resolve([state, userData])
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
