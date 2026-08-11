import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getParticleShareProtocolName, getParticleShareBlockName, getParticleBillboardIceOverwriteBlockName, getParticleProtocolName, setState, hasLittleManHandleArmy, addLittleManHandleArmy, getBuffProtocolName, getBuffArmyIceOverwriteBlockName, getBuffGiantessIceOverwriteBlockName, hasLittleManHandleGiantess, markLittleManHandleGiantess, clearLittleManHandleMaps } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { computeValue, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

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

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    if (userData.weaponValue.type == weaponType.Effect) {
        return Promise.resolve([state, userData])
    }

    let level = getLittleManLevel(api, state)

    let life = 3000
    // let size = 20
    let size = 40

    //// TODO restore
    let rate = 0.05
    // let rate = 0.3
    // let rate = 1

    //// TODO restore
    let armyValue = computeValue(level)
    // let armyValue = level * 0.8

    let position = api.getPositionParrelToGround(
        // api.TransformUtils.getPositionFromMatrix4(userData.transform)
        userData.damagePosition
    )
    // let position = userData.damagePosition


    if (level > 0 && userData.fromName == api.getLittleManName() && api.isRandomRate(rate)) {
        state = api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
            [
                api.blockAPI.getBlockService(state, getParticleProtocolName(), getParticleBillboardIceOverwriteBlockName()),
                state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBillboardIceOverwriteBlockName()),
                (state, blockState) => {
                    return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBillboardIceOverwriteBlockName(), blockState)
                }
            ],
            api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardIceOverwriteBlockName()).getParticleType(),
            {
                speed: 1,
                life: life,
                width: size,
                height: size,
                position: position.toArray(),
                resourceId: api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardIceOverwriteBlockName()).getImageId(),
            })


        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
        ))


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


        let id = api.generateId()

        let box = api.box3.setFromCenterAndSize(
            api.box3.getTempBox1(),
            position,
            api.vector3.set(
                api.vector3.getTempVector1(),
                size, 1, size
            )
        )
        let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyIceOverwriteBlockName())
        let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessIceOverwriteBlockName())

        return api.Flow.addInstantIntervalAndClear(
            state,
            [
                api.getAbstractState,
                api.setAbstractState,
                state => {
                    let armyNames = api.ArrayUtils.map(
                        api.ArrayUtils.filter(
                            api.checkRangeBoxCollisionWithArmy(
                                state,
                                box,
                                camp.Player
                            ),
                            ([_t, _b, name]) => {
                                return !hasLittleManHandleArmy(api, state, id, name)
                            }
                        ),
                        ([_t, _b, name]) => name
                    )

                    return api.ArrayUtils.reducePromise(
                        armyNames,
                        (state, name) => {
                            state = addLittleManHandleArmy(api, state, id, name)

                            // return api.addBuff(state,
                            //     armyBuffName, name, api.NullableUtils.getEmpty(),
                            //     life / 1000,
                            //     1,
                            //     characterType.None)
                            return armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), life / 1000, armyValue)
                        },
                        state
                    ).then(state => {
                        return api.ArrayUtils.reducePromise(
                            api.girl.getCurrentUsedGirls(state),
                            (state, usedGirl) => {
                                if (
                                    api.isUseGirl(state, usedGirl)
                                    // && api.isNearObject(
                                    //     position,
                                    //     api.getGirlPosition(state, usedGirl),
                                    //     size
                                    // )
                                    && api.box3.intersectsBox(
                                        box,
                                        api.girl.getGirlBox(state, usedGirl)
                                    )
                                    && !hasLittleManHandleGiantess(api, state, id)
                                ) {
                                    let giantessValue = api.girl.computeAttenuationByHeightForEffect(armyValue, state, usedGirl, api.NullableUtils.getEmpty())

                                    state = markLittleManHandleGiantess(api, state, id)

                                    // return api.addBuff(state,
                                    //     giantessBuffName, api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl),
                                    //     life / 1000,
                                    //     1,
                                    //     characterType.Giantess)
                                    return giantessBuffService.addBuff(api, state, api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl), life / 1000, giantessValue)
                                }

                                return Promise.resolve(state)
                            },
                            state
                        )
                    })
                },
                state => {
                    state = clearLittleManHandleMaps(api, state, id)

                    return Promise.resolve(state)
                }
            ],
            0.3,
            life / 1000
        ).then(state => [state, userData])
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
