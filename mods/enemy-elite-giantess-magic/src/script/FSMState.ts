import { api } from "type-api/src/Type";
import { getWeaponMagicAttack1BlockName, getShareBlockName, getShareProtocolName, getWeaponProtocolName, getWeaponStompHeavyBlockName } from "./Utils";
import { getControlledClipIndex, getIdleClipIndex, getMagicAttack1ClipIndex, getMagicAttack1EmitSoundResourceId, getStompHeavyClipIndex, getStompHeavySoundResourceId, getValue, getWalkClipIndex } from "../json/Data";
import { buildCategoryName } from "./Event";
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";
import { service as weaponService } from "weapon-protocol/src/service/ServiceType";
import { weaponValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType";
import { attackTarget, damageType, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "frontend/src/scene3d_layer/type/StateType";

enum attackWay {
    None,
    StompHeavy,
    MagicAttack1
}


export let createInitialState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createInitialState(api, getIdleClipIndex)

let _attack = (
    api: api,
    state,
    getDirectCollisionDirectionFunc,
    targetPosition,
    targetPart,
    eliteGiantessPosition,
    weaponValue: weaponValue,
    lodQueue,
    lODQueueIndex,
    name,
    camp_,

    weaponBlockName,
) => {
    let direction = api.vector3.normalize(api.vector3.sub(api.vector3.clone(targetPosition), eliteGiantessPosition))

    let box = lodQueue.getBox(lODQueueIndex)

    // let meleeRange = api.getMeleeRange(weaponValue.meleeRange, box, true)
    let meleeRange = weaponValue.meleeRange

    let sizeY = api.box3.getSize(box, api.vector3.getTempVector3()).y

    let center = api.vector3.add(
        // api.box3.getCenter(box, api.vector3.getTempVector1()),
        api.box3.getCenter(box, api.vector3.create(0, 0, 0)),
        api.vector3.setY(
            api.vector3.multiplyScalar(
                api.vector3.clone(direction),
                // meleeRange / 1.3
                meleeRange / 1.1
                // meleeRange / (1.1 * 1.5)
            ),
            - sizeY / 3
        )
    )

    let attackDirectBox = api.box3.setFromCenterAndSize(
        api.box3.createEmpty(),
        center,
        api.vector3.create(
            meleeRange / 3,
            // meleeRange / 1.5,
            sizeY / 3,
            meleeRange / 3
            // meleeRange / 1.5,
        )
    )
    let attackRangeBox = api.box3.setFromCenterAndSize(
        api.box3.createEmpty(),
        center,
        api.vector3.create(
            // meleeRange / 3,
            meleeRange / 1.5,
            sizeY / 3,
            // meleeRange / 3
            meleeRange / 1.5,
        )
    )


    let { emitterVolume } = weaponValue
    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getStompHeavySoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, center, 0))
    ))

    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())
    state = shareService.addEffect(api, state, box, center, attackRangeBox)


    if (api.getIsDebug(state)) {
        api.addBox3Helper(api.getAbstractState(state), api.getScene(state), attackDirectBox, 0x811100)
        api.addBox3Helper(api.getAbstractState(state), api.getScene(state), attackRangeBox, 0xf11100)
    }

    let weaponService = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), weaponBlockName)

    return api.handleCollision(
        state,
        [
            api.NullableUtils.map(func => func(api), weaponService.handleHitStatic),
            api.NullableUtils.map(func => func(api), weaponService.handleHitGirl),
            api.NullableUtils.map(func => func(api), weaponService.handleHitArmy),
            api.NullableUtils.map(func => func(api), weaponService.handleHitLittleMan),
        ],
        targetPart,
        attackRangeBox, center,
        name,
        camp_,
        // getDirectCollisionDirectionFunc(api, direction),
        direction,
        true,
        weaponValue,
        weaponService.getWeaponName(),
        api.NullableUtils.return_(damageType.Range),
    ).then(state => {
        return api.handleCollision(
            state,
            [
                api.NullableUtils.map(func => func(api), weaponService.handleHitStatic),
                api.NullableUtils.map(func => func(api), weaponService.handleHitGirl),
                api.NullableUtils.map(func => func(api), weaponService.handleHitArmy),
                api.NullableUtils.map(func => func(api), weaponService.handleHitLittleMan),
            ],
            targetPart,
            attackDirectBox, center,
            name,
            camp_,
            getDirectCollisionDirectionFunc(api, direction),
            true,
            weaponValue,
            weaponService.getWeaponName(),
            api.NullableUtils.return_(damageType.Direct),
        )
    })
}

let _stompHeavy = (
    api: api,
    state,
    targetPosition,
    targetPart,
    eliteGiantessPosition,
    weaponValue: weaponValue,
    lodQueue,
    lODQueueIndex,
    name,
    camp_,
) => {
    return _attack(
        api,
        state,
        (api, direction) => api.buildDownDirection(),
        targetPosition,
        targetPart,
        eliteGiantessPosition,
        weaponValue,
        lodQueue,
        lODQueueIndex,
        name,
        camp_,
        getWeaponStompHeavyBlockName(),
    )
}

// TODO duplicate
let _getStartLocalPositionFunc = (
    api,
    getStartLocalPositionFunc,
    lookatQuaternion,
    position,
    scale,
) => {
    return getStartLocalPositionFunc(api, scale)
        .applyQuaternion(lookatQuaternion)
        .add(
            position
        )
}

let _getStartLocalPosition = (api: api, scale) => {
    // return api.vector3.multiply(api.vector3.create(-0.915845, 7.97347, 4.49601), scale)
    // return api.vector3.multiply(api.vector3.create(-9.15845, 79.7347, 44.9601), scale)
    return api.vector3.multiply(api.vector3.create(-9.15845, 160, 44.9601), scale)
}

let _magicAttack1 = (api: api,
    state,
    targetPosition,
    lookatQuaternion,
    eliteGiantessPosition,
    eliteGiantessScale,
    armyValue,
    weaponValue: weaponValue,
    name,
) => {
    let {
        emitSpeed,
        emitPrecision
    } = armyValue
    let {
        emitterVolume,
        emitterSpeed,
        emitterLife,
        emitterSize,
        emitterCount,
    } = weaponValue

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getMagicAttack1EmitSoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, eliteGiantessPosition, 0))
    ))

    // state = api.setAbstractState(state, api.ParticleManager.emitFireball(api.getAbstractState(state), {
    //     fromName: name,
    //     camp: api.getCampExn(state, name),
    //     speed: emitterSpeed,
    //     life: emitterLife,
    //     size: emitterSize,
    //     position: _getStartLocalPositionFunc(
    //         api,
    //         _getStartLocalPosition,
    //         lookatQuaternion,
    //         eliteGiantessPosition,
    //         eliteGiantessScale,
    //     ).toArray(),
    //     direction: api.getShootDirection(
    //         targetPosition.clone().sub(eliteGiantessPosition).normalize(),
    //         emitPrecision
    //     ).toArray(),
    // }, api.getParticleNeedCollisionCheckLoopCount(state, emitterSpeed)))
    state = api.NullableUtils.getExn(api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponMagicAttack1BlockName())).emitParticleEmit(api, state, {
        fromName: name,
        camp: api.getCampExn(state, name),
        speed: emitterSpeed,
        life: emitterLife,
        size: emitterSize,
        count: emitterCount,
        position: _getStartLocalPositionFunc(
            api,
            _getStartLocalPosition,
            lookatQuaternion,
            eliteGiantessPosition,
            eliteGiantessScale,
        ).toArray(),
        direction: api.getShootDirection(
            targetPosition.clone().sub(eliteGiantessPosition).normalize(),
            emitPrecision
        ).toArray(),
    },
        api.getParticleNeedCollisionCheckLoopCount(state, emitterSpeed)
    )

    return Promise.resolve(state)
}

let _getAttackWay = (api: api, state, name) => {
    switch (api.getAttackTarget(state, name)) {
        case attackTarget.LittleMan:
        case attackTarget.Object:
        case attackTarget.Building:
            return attackWay.StompHeavy
        case attackTarget.Giantess:
            return attackWay.MagicAttack1
        case attackTarget.None:
        // throw new Error("err")
        default:
            return attackWay.None
    }
}

export let getWeaponValue = (api: api) => (state, name, box) => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    let value
    switch (_getAttackWay(api, state, name)) {
        case attackWay.StompHeavy:
            value = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponStompHeavyBlockName()).getWeaponValue(api, state)
            break
        case attackWay.MagicAttack1:
            value = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponMagicAttack1BlockName()).getWeaponValue(api, state)
            break
        case attackWay.None:
            return api.NullableUtils.getEmpty()
    }

    // return shareService.updateWeaponValue(api, value, getValue(api, state))
    return api.NullableUtils.return_(shareService.updateWeaponValue(api, value, box))
}

let _getWorkFrameCount = (shareService, attackWay_) => {
    switch (attackWay_) {
        case attackWay.StompHeavy:
            return shareService.getStompHeavyWorkFrameCount()
        case attackWay.MagicAttack1:
            return shareService.getMagicAttack1WorkFrameCount()
    }
}

export let createAttackState = (api: api, state) => (): fsm_state<state> => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return {
        name: objectStateName.Attack,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            let lODQueueIndex = shareService.getModelQueueIndex(api)(state, name)
            let lodQueue = shareService.getModelQueue(api)(state, name)

            state = shareService.attack(api,
                state,
                [
                    (state,
                        attackWay_,
                        targetPosition,
                        targetPart,
                        lookatQuaternion,
                        eliteGiantessPosition,
                        eliteGiantessScale,
                        armyValue,
                        weaponValue: weaponValue,
                    ) => {
                        return api.setAbstractState(state, api.Flow.addDeferExecFuncDataByTime(api.getAbstractState(state), (state) => {
                            let camp_ = api.getCampExn(state, name)

                            switch (attackWay_) {
                                case attackWay.StompHeavy:
                                    return _stompHeavy(
                                        api,
                                        state,
                                        targetPosition,
                                        targetPart,
                                        eliteGiantessPosition,
                                        weaponValue,
                                        lodQueue,
                                        lODQueueIndex,
                                        name,
                                        camp_,
                                    )
                                case attackWay.MagicAttack1:
                                    return _magicAttack1(
                                        api,
                                        state,
                                        targetPosition,
                                        lookatQuaternion,
                                        eliteGiantessPosition,
                                        eliteGiantessScale,
                                        armyValue,
                                        weaponValue,
                                        name,
                                    )
                            }
                        }, api.computeTimeSecond(state, _getWorkFrameCount(shareService, attackWay_), name), name))
                    },
                    (state, name, attackWay_) => {
                        switch (attackWay_) {
                            case attackWay.StompHeavy:
                                return getStompHeavyClipIndex(name)
                            case attackWay.MagicAttack1:
                                return getMagicAttack1ClipIndex(name)
                        }
                    },
                    getIdleClipIndex,
                    getWeaponValue(api),
                    _getAttackWay
                ],

                getValue(api, state),
                // shareService.getInitialQuaternion(api, state, modelName.MeleeGiantess),
                shareService.getInitialQuaternion(api, state, buildCategoryName(api, state)),

                name,
                // clipIndex,
                lodQueue, lODQueueIndex)

            return Promise.resolve(state)

        },
        exitFunc: shareService.exitFuncForCreateAttackState(api)
    }
}

export let createMoveState = (api, state) => {
    return api.blockAPI.getBlockService(state, getShareProtocolName(), getShareBlockName()).createMoveState(
        api,
        [
            getWalkClipIndex,
            createInitialState(api, state),
        ],
        getValue(api, state),
        // modelName.MeleeGiantess
        buildCategoryName(api, state)
    )
}

export let createPickedControlledState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createControlledState(api, getControlledClipIndex, objectStateName.PickedControlled)

export let createUBControlledState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createControlledState(api, getControlledClipIndex, objectStateName.UBControlled)

export let createBreastControlledState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createControlledState(api, getControlledClipIndex, objectStateName.BreastControlled)

export let createShoeControlledState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createControlledState(api, getControlledClipIndex, objectStateName.ShoeControlled)