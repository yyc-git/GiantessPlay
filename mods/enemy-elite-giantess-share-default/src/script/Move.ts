import { api } from "type-api/src/Type"
import { getInitialQuaternion, getModelQueue, getModelQueueIndex, getState, getStateMachine, getWeaponProtocolName, getWeaponWalkBlockName, setState, setStateMachine, updateWeaponValue } from "./Utils"
import { armyValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { speed } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getMoveWorkFrameCount, getWalkResourceId } from "../json/Data"
import { service as weaponService } from "weapon-protocol/src/service/ServiceType";
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

let _hasMoveTween = (api) => (state, name) => {
    return getState(api, state).moveTweenMap.has(name)
}

let _getMoveTween = (api) => (state, name) => {
    return api.NullableUtils.getWithDefault(getState(api, state).moveTweenMap.get(name), [])
}

let _addMoveTweens = (api) => (state, name, tweens) => {
    return setState(api, state, {
        ...getState(api, state),
        moveTweenMap: api.MutableMapUtils.set(getState(api, state).moveTweenMap, name,
            api.ArrayUtils.pushArrs(
                _getMoveTween(api)(state, name),
                tweens
            )
        )
    })
}

let _getInitialEulerForMoveTween = (api: api) => () => {
    // return new Euler(0, -Math.PI / 2, 0)
    return api.NullableUtils.getEmpty()
}

let _buildIntervalName = (name) => `${name}_move`

let _handleEnterFunc = (api: api) => (state: state, name) => {
    let queue = getModelQueue(api)(state, name)

    let index = getModelQueueIndex(api)(state, name)

    let box = queue.getBox(index)

    let camp_ = api.getCampExn(state, name)

    let weaponService = api.blockAPI.getBlockService<weaponService>(state, getWeaponProtocolName(), getWeaponWalkBlockName())

    let weaponValue = weaponService.getWeaponValue(api, state)
    weaponValue = updateWeaponValue(api, weaponValue, box)


    let abstractState = api.Flow.addInterval(
        api.getAbstractState(state),
        [
            api.getAbstractState,
            api.setAbstractState,
            (state) => {
                let position = api.box3.getCenter(
                    box,
                    api.vector3.getTempVector1()
                )

                if (api.isMiddleGiantessOrBiggerByScale(api.computeScaleByBox(box))
                    // && api.isNearPlayer(state, position)
                ) {
                    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                        // api.SoundManager.buildNeedToPlaySoundData(getWalkResourceId(), api.getIsDebug(state), api.getVolume(state, weaponValue.emitterVolume, position, 0))
                        api.SoundManager.buildNeedToPlaySoundData(getWalkResourceId(), api.getIsDebug(state), api.getVolume(state, weaponValue.emitterVolume, position, 0, 0.05))
                    ))
                }

                return api.handleCollision(
                    state,
                    [
                        api.NullableUtils.map(func => func(api), weaponService.handleHitStatic),
                        api.NullableUtils.map(func => func(api), weaponService.handleHitGirl),
                        api.NullableUtils.map(func => func(api), weaponService.handleHitArmy),
                        api.NullableUtils.map(func => func(api), weaponService.handleHitLittleMan),
                    ],
                    api.NullableUtils.getEmpty(),
                    box,
                    position,
                    name,
                    camp_,
                    api.buildDownDirection(),
                    true,
                    weaponValue,
                    weaponService.getWeaponName(),
                    api.NullableUtils.return_(damageType.Direct),
                )
            }
        ],
        api.computeTimeSecond(state, getMoveWorkFrameCount(), name),
        _buildIntervalName(name)
    )


    // abstractState = api.Flow.addInterval(
    //     abstractState,
    //     [
    //         api.getAbstractState,
    //         api.setAbstractState,
    //         (state) => {
    //             return api.handleCollision(
    //                 state,
    //                 [
    //                     // api.NullableUtils.map(func => func(api), weaponService.handleHitStatic),
    //                     api.NullableUtils.getEmpty(),
    //                     api.NullableUtils.map(func => func(api), weaponService.handleHitGirl),
    //                     api.NullableUtils.map(func => func(api), weaponService.handleHitArmy),
    //                     api.NullableUtils.map(func => func(api), weaponService.handleHitLittleMan),
    //                 ],
    //                 api.NullableUtils.getEmpty(),
    //                 box,
    //                 api.box3.getCenter(
    //                     box,
    //                     api.vector3.getTempVector1()
    //                 ),
    //                 name,
    //                 camp_,
    //                 api.buildDownDirection(),
    //                 true,
    //                 weaponValue,
    //                 api.NullableUtils.return_(damageType.Direct),
    //             )

    //         }
    //     ],
    //     api.computeTimeSecond(getMoveWorkFrameCount2()),
    //     _buildIntervalName(name, 2)
    // )

    state = api.setAbstractState(state, abstractState)

    return state
}

let _handleExitFunc = (api: api) => (state: state, name) => {
    let abstractState = api.Flow.clearInterval(api.getAbstractState(state), _buildIntervalName(name))
    // abstractState = api.Flow.clearInterval(abstractState, _buildIntervalName(name, 2))

    state = api.setAbstractState(state, abstractState)

    return state
}

export let stopAndRemoveMoveDataAndTween = (api: api) => (state, name) => {
    api.ArticluatedAnimation.stopTweens(
        _getMoveTween(api)(state, name)
    )
    api.ArticluatedAnimation.removeTweens(
        api.getAbstractState(state), _getMoveTween(api)(state, name)
    )

    return setState(api, state, {
        ...getState(api, state),
        moveDataMap: api.MutableMapUtils.remove(getState(api, state).moveDataMap, name),
        moveTweenMap: api.MutableMapUtils.remove(getState(api, state).moveTweenMap, name),
    })
}

// TODO duplicate
export let createMoveState = (
    api: api,
    [
        getWalkClipIndexFunc,
        createInitialStateFunc,
    ],
    value: armyValue,
    categoryName
) => {
    return (state) => {
        return api.createMoveState([
            getModelQueueIndex(api),
            getModelQueue(api),
            (state, name) => {
                return api.setAbstractState(state, api.GPUSkin.playLoop(
                    api.getAbstractState(state),
                    name, getWalkClipIndexFunc(name)
                ))
            },
            (state, _, lODQueueIndex, name, position) => {
                // let shadowQueue = getShadowQueueFunc(state, name)

                // updateShadow(shadowQueue, lODQueueIndex, position)

                return state
            },
            _addMoveTweens(api),
            _getInitialEulerForMoveTween(api),
            (state, name) => {
                return api.NullableUtils.getExn(getState(api, state).moveDataMap.get(name))
            },
            (state, name, moveData) => {
                return setState(api, state, {
                    ...getState(api, state),
                    moveDataMap: api.MutableMapUtils.set(getState(api, state).moveDataMap, name, moveData)
                })
            },
            getStateMachine(api),
            setStateMachine(api),
            createInitialStateFunc,
            _hasMoveTween(api),
            _getMoveTween(api),
            stopAndRemoveMoveDataAndTween(api),
            (state, name, box) => {
                return api.isMaxArmySpeed() ? (100 as speed) : api.computeEliteGiantessMoveSpeed(state, name, box)
            },
            _handleEnterFunc(api),
            _handleExitFunc(api),
        ],
            api.quaternion.clone(getInitialQuaternion(api, state, categoryName))
        )
    }
}