import { api } from "type-api/src/Type";
import { getShareBlockName, getShareProtocolName, getWeaponKickLightBlockName, getWeaponProtocolName, getWeaponStompLightBlockName } from "./Utils";
import { getControlledClipIndex, getIdleClipIndex, getKickLightClipIndex, getStompLightClipIndex, getStompLightSoundResourceId, getValue, getWalkClipIndex } from "../json/Data";
import { buildCategoryName } from "./Event";
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";
import { service as weaponService } from "weapon-protocol/src/service/ServiceType";
import { meleeRange, weaponValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType";
import { attackTarget, damageType, objectStateName, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "frontend/src/scene3d_layer/type/StateType";

enum attackWay {
    None,
    StompLight,
    KickLight
}

export let createInitialState = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).createInitialState(api, getIdleClipIndex)

let _attack = (
    api: api,
    [computeBoxFunc, handleFunc],
    state,
    getCollisionDirectionFunc,
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


    let meleeRange = api.NullableUtils.getExn(
        weaponValue.meleeRange
    )


    let [center, attackRangeBox] = computeBoxFunc(api, box, meleeRange, direction)

    state = handleFunc(api, state, box, center, attackRangeBox)

    if (api.getIsDebug(state)) {
        api.addBox3Helper(api.getAbstractState(state), api.getScene(state), attackRangeBox, 0x811100)
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
        getCollisionDirectionFunc(api, direction),
        true,
        weaponValue,
        weaponService.getWeaponName(),
        api.NullableUtils.return_(damageType.Direct),
    )
}

let _stompLight = (
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
        [(api, box, meleeRange, direction) => {
            let sizeY = api.box3.getSize(box, api.vector3.getTempVector3()).y

            let center = api.vector3.add(
                // api.box3.getCenter(box, api.vector3.getTempVector1()),
                api.box3.getCenter(box, api.vector3.create(0, 0, 0)),
                api.vector3.setY(
                    api.vector3.multiplyScalar(
                        direction,
                        // meleeRange / (1.3 * 1.5)
                        meleeRange / (1.3)
                        // meleeRange / (1.3 * 1.2)
                    ),
                    - sizeY / 2
                )
            )
            let attackRangeBox = api.box3.setFromCenterAndSize(
                // api.box3.getTempBox1(),
                api.box3.createEmpty(),
                center,
                api.vector3.create(
                    meleeRange / 2,
                    // meleeRange,
                    sizeY / 2,
                    meleeRange / 2
                    // meleeRange
                )
            )

            return [center, attackRangeBox]
        },
        (api: api, state, box, center, attackRangeBox) => {
            let { emitterVolume } = weaponValue
            state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                api.SoundManager.buildNeedToPlaySoundData(getStompLightSoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, center, 0))
            ))

            state = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).addEffect(api, state, box, center, attackRangeBox)

            return state
        }
        ],
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
        getWeaponStompLightBlockName(),
    )
}

let _kickLight = (api: api,
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
        [(api, box, meleeRange, direction) => {
            let sizeY = api.box3.getSize(box, api.vector3.getTempVector1()).y

            let center = api.vector3.add(
                api.box3.getCenter(box, api.vector3.getTempVector2()),
                api.vector3.setY(
                    api.vector3.multiplyScalar(
                        api.vector3.clone(direction),
                        meleeRange / (1.3)
                        // meleeRange / (1.3 * 1.5)
                        // meleeRange / (1.3 * 1.2)
                    ),
                    sizeY / 3
                    // sizeY / 1.5
                )
            )
            let attackRangeBox = api.box3.setFromCenterAndSize(
                api.box3.getTempBox1(),
                center,
                api.vector3.create(
                    meleeRange / 1.5,
                    sizeY / 4,
                    // sizeY / 2,
                    meleeRange / 1.5
                )
            )

            return [center, attackRangeBox]

        },
        (api: api, state, box, center, attackRangeBox) => {
            return state
        }
        ],
        state,
        (api, direction) => direction,
        targetPosition,
        targetPart,
        eliteGiantessPosition,
        weaponValue,
        lodQueue,
        lODQueueIndex,
        name,
        camp_,
        getWeaponKickLightBlockName(),
    )
}

// let _isBiggerThanGirl = (api, state, shareService, armyValue) => {
let _isBiggerThanGirl = (api: api, state, usedGirl, box) => {
    if (usedGirl == usedGirlEnum.None) {
        return false
    }

    // return shareService.computeHeight(api, armyValue.scale) * 1.2 >= api.computeHeight(state, usedGirl)
    return api.getHeightByBox(box) >= api.getActualGirlHeight(state, usedGirl) * 1.2
}

let _getAttackWay = (api: api, state, name, box) => {
    // let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    switch (api.getAttackTarget(state, name)) {
        case attackTarget.LittleMan:
        case attackTarget.Object:
        case attackTarget.Building:
            return attackWay.StompLight
        case attackTarget.Giantess:
            if (_isBiggerThanGirl(api, state, api.getAttackTargetUsedGirl(state, name), box)) {
                return attackWay.StompLight
            }
            return attackWay.KickLight
        case attackTarget.None:
        // throw new Error("err")
        default:
            return attackWay.None
    }
}

export let getWeaponValue = (api: api) => (state, name, box) => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    let value
    switch (_getAttackWay(api, state, name, box)) {
        case attackWay.StompLight:
            value = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponStompLightBlockName()).getWeaponValue(api, state)
            break
        case attackWay.KickLight:
            value = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponKickLightBlockName()).getWeaponValue(api, state)
            break
        case attackWay.None:
            return api.NullableUtils.getEmpty()
    }

    // return shareService.updateWeaponValue(api, value, getValue(api, state))
    return api.NullableUtils.return_(shareService.updateWeaponValue(api, value, box))
}

let _getWorkFrameCount = (shareService, attackWay_) => {
    switch (attackWay_) {
        case attackWay.StompLight:
            return shareService.getStompLightWorkFrameCount()
        case attackWay.KickLight:
            return shareService.getKickLightWorkFrameCount()
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
                        _,
                        armyValue,
                        weaponValue: weaponValue,
                    ) => {
                        return api.setAbstractState(state, api.Flow.addDeferExecFuncDataByTime(api.getAbstractState(state), (state) => {
                            let camp_ = api.getCampExn(state, name)

                            switch (attackWay_) {
                                case attackWay.StompLight:
                                    return _stompLight(
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
                                case attackWay.KickLight:
                                    return _kickLight(
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
                            }
                        }, api.computeTimeSecond(state, _getWorkFrameCount(shareService, attackWay_), name), name))
                    },
                    (state, name, attackWay_) => {
                        switch (attackWay_) {
                            case attackWay.StompLight:
                                return getStompLightClipIndex(name)
                            case attackWay.KickLight:
                                return getKickLightClipIndex(name)
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
