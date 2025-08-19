import { Vector3, Bone, Object3D, LinearTransfer, Box3 } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { triggerAction } from "../../../../../manage/biwu/Girl";
import { getIdExn, markFinish, setId } from "../../../../../behaviour_tree/BehaviourTreeManager";
import { state } from "../../../../../../../../type/StateType";
import { Event } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../../../state/State";
import { getBackLeftLightStompEndEventName, getBackRightLightStompEndEventName, getHangLeftLightStompEndEventName, getHangRightLightStompEndEventName, getQTEUpdateEventName } from "../../../../../../../../utils/EventUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import * as Girl from "../../../../../girl/Girl";
import { getBone } from "../../../../../utils/MMDUtils";
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { getAnimationBlendDuration } from "../../../../Data";
import * as LittleManTransform from "../../../../../little_man/Transform";
import * as LittleMan from "../../../../../little_man/LittleMan";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { isInXZRange } from "../../../../../manage/city1/soldier/utils/CommanderUtils";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { stateMachine, tween } from "meta3d-jiehuo-abstract/src/type/StateType";
import { computeForce, getCollisionPartOBB, updateAllCollisionShapes } from "../../../../../girl/Collision";
import * as DamageUtils from "../../../../../utils/DamageUtils";
import { getGirlWeaponType, getPositionParrelToObj } from "../../../../../girl/Utils";
import { getActualHeight } from "meta3d-utils/src/View";
import { buildDownDirection, buildRandomDirectionInXZ } from "../../../../../../../../utils/DirectionUtils";
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../../../DataUtils";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { getGirlScale } from "../../../../../CityScene";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getLightStompSoundResourceId, getRubSoundResourceId, isHard } from "../../../../../manage/biwu/level2/ManageScene";
import { getIsDebug } from "../../../../../../Scene";
import { getGirlVolume } from "../../../../../utils/SoundUtils";
import { getIsHit, pointdownHandle, startQTE } from "./utils/QTEUtils";
import { getPointerDownEventName } from "meta3d-jiehuo-abstract/src/Event";
import { addExcitement } from "../../../../../girl/Excitement";
import { excitement } from "../../../../DataType";
import { markIsRunning } from "../../../../../utils/BehaviourManagerUtils";
import { lookatTarget } from "../../../../../behaviour_tree/action_node/Utils";
import { makeBoxHeightMax } from "../../../../../utils/Box3Utils";
import { createTween } from "../../../Utils";
import { getCustomData, phase, setCustomData } from "../BehaviourTreeData";
import { computeDamage } from "../../../ActionNodeUtils";

const _v1 = /*@__PURE__*/ new Vector3();
const _b1 = /*@__PURE__*/ new Box3();

type data = {
    downForce: number,
    rubForce: number,
    expandSize: number,
    backTime: number,
    upTime: number,
    rubToUpTime: number,
    downToRubTime: number,
    downToUpTime: number,
    downTime: number,
    followTime: number,
    hangTime: number,

    backRateWhenFinishUp: number,
    backRateWhenExceedRange: number,

    rubMaxAmplitude: number,
    rubTimeScalar: number,
    followMaxCount: number,

}

let _getData = (state: state): data => {
    let factor, hangFactor
    if (isHard(state)) {
        factor = 2
        hangFactor = 1.5
    }
    else {
        factor = 1
        hangFactor = 1
    }

    return {
        downForce: 8 * factor,
        rubForce: 3 * factor,
        // expandSize: 2,
        expandSize: 1.8,
        backTime: 500,
        upTime: 1000,
        rubToUpTime: 0.5,
        downToRubTime: 0.5,
        downToUpTime: 0.5,
        downTime: 800 / factor,
        // followTime: 1000 / factor,
        followTime: 1000,
        hangTime: 1200 / hangFactor,

        // backRateWhenFinishUp: 0.2,
        backRateWhenFinishUp: 0.2,
        backRateWhenExceedRange: 0.5,

        rubMaxAmplitude: 0.6,
        rubTimeScalar: 1.5,
        // followMaxCount: 5,
        followMaxCount: 4,
    }
}

let _triggerAction = (state: state, id, actionName_): Promise<[state, any]> => {
    state = _setPhase(state, phase.Begin)

    return triggerAction(state, actionName_).then(([state, result_]) => {
        if (result_ == result.Fail) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        state = setId(state, actionName.LightStomp, id)

        state = markIsRunning(state, true)

        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    })
}

/*! 
MMD's x = webgl's x
MMD's -z = webgl's z
* 
*/
let _getRightLegLimitRange = () => {
    return {
        minX: -3.4,
        // maxX: 0.9,
        maxX: 0.9 + 0.2,
        minZ: 0.6,
        maxZ: 4.55,
    }
}


let _getLeftLegLimitRange = () => {
    // return {
    //     minX: -0.95,
    //     maxX: 3.3,
    //     minZ: -5.5,
    //     maxZ: -0.9
    // }
    return {
        // minX: -0.9,
        minX: -0.9 - 0.2,
        maxX: 3.4,
        // minZ: -4.55,
        // maxZ: -0.6,
        minZ: 0.6,
        maxZ: 4.55,
    }
}

let _expandRigthLimitRangeForFollow = (state, limitRange) => {
    return {
        ...limitRange,
        maxX: limitRange.maxX + _getData(state).expandSize
    }
}

let _expandLeftLimitRangeForFollow = (state, limitRange) => {
    return {
        ...limitRange,
        minX: limitRange.minX - _getData(state).expandSize

    }
}

let _isInLegRange = (state, bone, limitRange) => {
    let boneLocalPositionBefore = bone.position.clone()

    let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), LittleManTransform.getWorldPosition(state))

    let result = isInXZRange(bone.position, limitRange)

    bone.position.copy(boneLocalPositionBefore)

    return result
}

let _isInRightLegRange = (state) => {
    let d = getRightFootIKBone(state)
    state = d[0]
    let bone = d[1]

    return _isInLegRange(state, bone, _getRightLegLimitRange())
}

let _isInLeftLegRange = (state) => {
    let d = getLeftFootIKBone(state)
    state = d[0]
    let bone = d[1]

    return _isInLegRange(state, bone, _getLeftLegLimitRange())
}

export let lightStomp: actionNodeFunc = (state, id) => {
    Console.log("lightStomp")

    // let actionName_
    // switch (getCurrentPose(state)) {
    //     case pose.Stand:
    //     case pose.Pick:
    //         actionName_ = actionName.Stomp
    //         break
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }


    // if (!hasTarget(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }

    // state = _lookatTarget(state)

    // return triggerAction(state, actionName.HangRightLightStomp as any, id)

    if (_isInRightLegRange(state)) {
        return _triggerAction(state, id, actionName.HangRightLightStomp)
    }
    else if (_isInLeftLegRange(state)) {
        return _triggerAction(state, id, actionName.HangLeftLightStomp)
    }

    state = lookatTarget(state)

    if (_isInRightLegRange(state)) {
        return _triggerAction(state, id, actionName.HangRightLightStomp)
    }
    else if (_isInLeftLegRange(state)) {
        return _triggerAction(state, id, actionName.HangLeftLightStomp)
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}

// let _finishWhenIdle = (state: state, id) => {
//     if (!isCompletelyPlayingAnimation(state, animationName.Idle)) {
//         state = resetIsTriggerAction(state)
//         state = markFinish(state, id, behaviourTreeNodeExecuteResult.Success)

//         let helper = getMMDAnimationHelper(getAbstractState(state))
//         MutableMapUtils.remove(helper.ikBoneCustomData, actionName.HangRightLightStomp)


//         return state
//     }

//     return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
//         return Promise.resolve(_finishWhenIdle(state, id))
//     }, 5))
// }

// let _followLittleMan = (bone: Bone, state: state) => {
//     let worldPosition = LittleManTransform.getWorldPosition(state)

//     let beforeBoneLocalPosition = bone.position.clone()

//     let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), worldPosition)

//     bone.position.setY(beforeBoneLocalPosition.y)

//     const limitRange = {
//         minX: -3.4,
//         maxX: 0.9,
//         minZ: 0.6,
//         maxZ: 4.55,
//     }

//     if (!isInXZRange(bone.position, limitRange)) {
//         bone.position.copy(beforeBoneLocalPosition)
//     }
// }

let _followLittleMan = (bone: Bone, worldPosition, limitRange, state: state) => {
    let beforeBoneLocalPosition = bone.position.clone()

    let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), worldPosition)

    bone.position.setY(beforeBoneLocalPosition.y)

    if (!isInXZRange(bone.position, limitRange)) {
        bone.position.copy(beforeBoneLocalPosition)
    }

    // bone.position.setZ(bone.position.z + 5)
}

let _clearIKBoneCustomData = (state: state) => {
    MutableMapUtils.remove(getMMDAnimationHelper(getAbstractState(state)).ikBoneCustomData, actionName.LightStomp)

    return state
}

export let isRightFootIKBone = (bone) => {
    return bone.name == "右足ＩＫ"
}

export let isLeftFootIKBone = (bone) => {
    return bone.name == "左足ＩＫ"
}

export let getRightFootIKBone = (state: state) => {
    return getBone(state, Girl.getGirl(state), "右足ＩＫ")
}

export let getLeftFootIKBone = (state: state) => {
    return getBone(state, Girl.getGirl(state), "左足ＩＫ")
}

let _createTween = (state: state,
    [
        isFootIKBoneFunc,
        updateBoneFunc,
        onCompleteFunc
    ],
    sourceObject, targetObject, time): [state, tween] => {
    return createTween(
        state,
        [
            isFootIKBoneFunc,
            updateBoneFunc,
            onCompleteFunc
        ],
        sourceObject, targetObject, time,
        actionName.LightStomp
    )
}

export let backToHang = (state: state,
    [getBoneFunc, isFootIKBoneFunc, onCompleteFunc],
    time
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneLocalPosition = bone.position.clone()

    let originBoneLocalPosition = _getOriginBoneLocalPosition(state)

    let d2 = _createTween(state,
        [
            isFootIKBoneFunc,
            (bone, object) => {
                bone.position.copy(_v1.set(
                    object.x,
                    object.y,
                    object.z,
                ))
            },
            state => {
                state = _setPhase(state, phase.None)

                state = _clearIKBoneCustomData(state)

                // return triggerAction(state, backActionName).then(TupleUtils.getTuple2First).then(writeState)
                return onCompleteFunc(state).then(writeState)
            }
        ],
        {
            x: boneLocalPosition.x,
            y: boneLocalPosition.y,
            z: boneLocalPosition.z,
        }, {
        x: originBoneLocalPosition.x,
        y: originBoneLocalPosition.y,
        z: originBoneLocalPosition.z,
        // }, _getRandomTime(_getData(state).backTime))
    }, time)

    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Back)
    // state = _removeCurrentTween(state)
    state = _setCurrentTweens(state, [tween])

    return state
}

let _back = (state: state,
    [getBoneFunc, isFootIKBoneFunc],
    backActionName) => {
    return backToHang(state,
        [getBoneFunc, isFootIKBoneFunc, state => {
            return triggerAction(state, backActionName).then(TupleUtils.getTuple2First)
        }],
        _getRandomTime(_getData(state).backTime)
    )
}

let _up = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneLocalPosition = bone.position.clone()

    let d2 = _createTween(state,
        [
            isFootIKBoneFunc,
            (bone, object) => {
                bone.position.copy(_v1.set(
                    object.x,
                    object.y,
                    object.z,
                ))
            },
            state => {
                state = _setPhase(state, phase.None)

                const rate = _getData(state).backRateWhenFinishUp

                if (NumberUtils.isRandomRate(rate)) {
                    state = _back(state,
                        [getBoneFunc, isFootIKBoneFunc],
                        backActionName)
                }
                else {
                    state = _handleLightStomp(state,
                        [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                        collisionPart_,
                        backActionName,
                        limitRange,
                        otherFoorIKBone, NullableUtils.getEmpty(),
                        NullableUtils.getEmpty(),
                        NullableUtils.getEmpty()
                    )
                }

                writeState(state)

                return Promise.resolve()
            }
        ],
        {
            x: boneLocalPosition.x,
            y: boneLocalPosition.y,
            z: boneLocalPosition.z,
        }, {
        x: boneLocalPositionBeforeDown.x,
        y: boneLocalPositionBeforeDown.y,
        z: boneLocalPositionBeforeDown.z,
    }, _getRandomTime(_getData(state).upTime))

    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Up)
    state = _setCurrentTweens(state, [tween])

    return state
}

let _computeRubDamage = (state, boxBefore) => {
    const force = _getData(state).rubForce

    return computeDamage(state, boxBefore, buildDownDirection(), _getRandomForce(force)).then(TupleUtils.getTuple2First)
}

let _rub = (state: state,
    [
        getBoneFunc,
        isFootIKBoneFunc,
        isInLegRangeFunc
    ],
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,

    rubTimeScalar
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneLocalPosition = bone.position.clone()


    let helper = getMMDAnimationHelper(getAbstractState(state))

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Rub)

    let boxBefore = getCollisionPartOBB(state, collisionPart_).clone()

    let tweens = playArticluatedAnimation(state,
        [
            object => {
                MutableMapUtils.set(helper.ikBoneCustomData, actionName.LightStomp, (bone) => {
                    if (isFootIKBoneFunc(bone)) {
                        bone.position.copy(_v1.set(
                            object.x,
                            boneLocalPosition.y,
                            object.z,
                        ))
                    }
                })
            },
            state => {
                return boneLocalPosition
            },
            state => {
                return [
                    boneLocalPosition,
                    NumberUtils.getRandomFloat(_getData(state).rubMaxAmplitude / 2, _getData(state).rubMaxAmplitude),
                    rubTimeScalar
                ]
            },
            (allTweens) => {
                DamageUtils.handleTweenRepeatComplete3(
                    [
                        state => {
                            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

                            return _computeRubDamage(state, boxBefore)
                        },
                        state => {
                            return !getIsHit(state)
                        },
                        state => {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                return Promise.resolve(_up(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                                    collisionPart_,
                                    backActionName,
                                    limitRange,
                                    otherFoorIKBone,
                                    boneLocalPositionBeforeDown,
                                ))
                            }, _getRandomTime(_getData(state).rubToUpTime), _buildKeyForDeferByTime()))

                            return Promise.resolve(state)
                        },
                    ],
                    allTweens,
                    NumberUtils.getRandomInteger(
                        articluatedAnimationData.repeatCount,
                        articluatedAnimationData.repeatCount * 2
                    )
                )
            },
            () => {
                let state = readState()

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

                return _computeRubDamage(state, boxBefore).then(state => {
                    let _ = writeState(state)
                })
            }
        ],
        articluatedAnimationData
    )


    state = _setPhase(state, phase.Rub)
    // state = _removeCurrentTween(state)
    state = _setCurrentTweens(state, tweens)

    return state
}

let _getRandomForce = (force) => {
    return NumberUtils.getRandomFloat(force * 0.5, force * 1.5)
}

let _getRandomTime = _getRandomForce

let _getRandomHangTime = (value) => {
    return NumberUtils.getRandomFloat(value * 0.3, value * 2)
}

let _getDownOffset = () => {
    return NumberUtils.getRandomFloat(-2, 2)
}

let _getDownTarget = (state: state, otherFoorIKBone, targetWorldPositionWhenHange, boneWorldPosition, collisionPart_) => {
    let worldPosition = NullableUtils.getExn(
        targetWorldPositionWhenHange
    )

    let bone2, d
    switch (collisionPart_) {
        case collisionPart.LeftFoot:
            d = getBone(state, Girl.getGirl(state), "左つま先ＩＫ")
            state = d[0]
            bone2 = d[1]
            break
        case collisionPart.RightFoot:
            d = getBone(state, Girl.getGirl(state), "右つま先ＩＫ")
            state = d[0]
            bone2 = d[1]
            break
        default:
            throw new Error("err")
    }

    let footBackDirection = boneWorldPosition.clone().sub(bone2.getWorldPosition(_v1)).normalize()
    let distance = footBackDirection.multiplyScalar(getCollisionPartOBB(state, collisionPart_).halfSize.z * 0.8)

    return {
        x: worldPosition.x + _getDownOffset() + distance.x,
        y: otherFoorIKBone.position.y * 1.08,
        z: worldPosition.z + _getDownOffset() + distance.z,
    }
}

let _downAndUp = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    collisionPart_,
    backActionName,
    limitRange,
    targetWorldPositionWhenHange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneWorldPosition = bone.getWorldPosition(new Vector3())

    let d2 = _createTween(state,
        [
            isFootIKBoneFunc,
            (bone, object) => {
                let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), _v1.set(
                    object.x,
                    0,
                    object.z,
                ))

                bone.position.setY(object.y)


                // bone.position.setZ(bone.position.z - 0.2)
            },
            state => {
                state = _setPhase(state, phase.None)

                const force = _getData(state).downForce

                let collisionPartOBB = getCollisionPartOBB(state, collisionPart_)

                const factor = 0.3
                let size = getGirlScale(state) * factor
                state = setAbstractState(state, ParticleManager.emitStompDust(getAbstractState(state),
                    {
                        speed: 10 * Math.max(getGirlScale(state) / 10, 1) * factor / 1.3,
                        changeLife: 500,
                        life: 3000,
                        size: size,
                        // position: getPositionParrelToObj(collisionPartOBB.center, LittleManTransform.getWorldPosition(state).y + 3).toArray()
                        position: getPositionParrelToObj(collisionPartOBB.center, 3).toArray()
                    }
                ))

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getLightStompSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

                return computeDamage(state, collisionPartOBB, buildDownDirection(), _getRandomForce(force))
                    .then(([state, isHit]) => {
                        if (isHit) {
                            state = addExcitement(state, excitement.Low)
                        }

                        if (isHit && NumberUtils.isRandomRate(0.5)) {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                state = addExcitement(state, excitement.Low)

                                let rubTimeScalar = _getRandomTime(_getData(state).rubTimeScalar)

                                state = _rub(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                                    collisionPart_,
                                    backActionName,
                                    limitRange,
                                    otherFoorIKBone,
                                    boneLocalPositionBeforeDown,

                                    rubTimeScalar
                                )


                                // state = removeCustomData(state, _getCustomDataKeyForOriginBoneLocalPosition())

                                // return Event.trigger(state, getAbstractState, getQTEStartEventName(), buildQTEStartEventData(
                                //     0.5
                                // ))

                                return startQTE(state)
                            }, _getRandomTime(_getData(state).downToRubTime), _buildKeyForDeferByTime()))
                        }
                        else {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                return Promise.resolve(_up(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                                    collisionPart_,
                                    backActionName,
                                    limitRange,
                                    otherFoorIKBone,
                                    boneLocalPositionBeforeDown,
                                ))
                            }, _getRandomTime(_getData(state).downToUpTime), _buildKeyForDeferByTime()))
                        }

                        writeState(state)
                    })
            }
        ],
        {
            x: boneWorldPosition.x,
            y: boneLocalPositionBeforeDown.y,
            z: boneWorldPosition.z,
        },
        _getDownTarget(state, otherFoorIKBone, targetWorldPositionWhenHange, boneWorldPosition, collisionPart_),
        _getRandomTime(_getData(state).downTime))
    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Down)
    state = _setCurrentTweens(state, [tween])

    return state
}

let _follow = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    repeatCount
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneWorldPosition = bone.getWorldPosition(new Vector3())

    let worldPosition = LittleManTransform.getWorldPosition(state)


    if (!isInLegRangeFunc(state, bone, limitRange)) {
        const rate = _getData(state).backRateWhenExceedRange

        if (NumberUtils.isRandomRate(rate)) {
            return _back(state,
                [getBoneFunc, isFootIKBoneFunc],
                backActionName)
        }


        // state = _setPhase(state, phase.Hang)

        return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
            return Promise.resolve(_follow(state,
                [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                collisionPart_,
                backActionName,
                limitRange,
                otherFoorIKBone,
                repeatCount
            ))
        }, 1, _buildKeyForDeferByTime()))
    }
    // else {
    //     const rate = 0.2

    //     if (NumberUtils.isRandomRate(rate)) {
    //         return _back(state,
    //             [getBoneFunc, isFootIKBoneFunc],
    //             backActionName,
    //             originBoneLocalPosition)
    //     }
    // }


    let d2 = _createTween(state,
        [
            isFootIKBoneFunc,
            (bone, object) => {
                _followLittleMan(bone, _v1.set(
                    object.x,
                    object.y,
                    object.z,
                ),
                    limitRange,
                    state)
            },
            state => {
                if (repeatCount > 1) {
                    state = _follow(state,
                        [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                        collisionPart_,
                        backActionName,
                        limitRange,
                        otherFoorIKBone,
                        repeatCount - 1
                    )

                    writeState(state)

                    return Promise.resolve()
                }


                let d = getBoneFunc(state)
                state = d[0]
                let bone = d[1]


                state = _setPhase(state, phase.None)

                state = _handleLightStomp(state,
                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                    collisionPart_,
                    backActionName,
                    limitRange,
                    otherFoorIKBone, NullableUtils.return_(performance.now()),
                    NullableUtils.return_(
                        bone.position.clone()
                    ),
                    NullableUtils.return_(
                        LittleManTransform.getWorldPosition(state)
                    )
                )
                writeState(state)

                return Promise.resolve()
            }
        ],
        {
            x: boneWorldPosition.x,
            y: boneWorldPosition.y,
            z: boneWorldPosition.z,
        }, {
        x: worldPosition.x,
        y: worldPosition.y,
        z: worldPosition.z,
    }, _getRandomTime(_getData(state).followTime))
    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Fllow)
    state = _setCurrentTweens(state, [tween])

    return state
}

let _handleLightStomp = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone: Bone, hangTime: nullable<number>, boneLocalPositionBeforeDown,
    targetWorldPositionWhenHange: nullable<Vector3>
) => {
    // if (performance.now() - startTime > 5000) {
    // if (performance.now() - startTime > 100000) {
    //     return _back(state,
    //         [getBoneFunc, isFootIKBoneFunc],
    //         backActionName,
    //         originBoneLocalPosition)
    // }

    if (!NullableUtils.isNullable(hangTime)) {
        hangTime = NullableUtils.getExn(hangTime)

        if (performance.now() - hangTime >= _getRandomHangTime(_getData(state).hangTime)) {
            return _downAndUp(state,
                [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                collisionPart_,
                backActionName,
                limitRange,
                targetWorldPositionWhenHange,
                otherFoorIKBone,
                boneLocalPositionBeforeDown,
            )
        }

        state = _setPhase(state, phase.Hang)
        // state = _setPhase(state, phase.Fllow)

        state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
            return Promise.resolve(_handleLightStomp(state,
                [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                collisionPart_,
                backActionName,
                limitRange,
                otherFoorIKBone, hangTime, boneLocalPositionBeforeDown,
                targetWorldPositionWhenHange
            ))
        }, _getRandomTime(0.2), _buildKeyForDeferByTime()))

        return state
    }

    state = _setPhase(state, phase.Hang)

    state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return Promise.resolve(_follow(state,
            [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
            collisionPart_,
            backActionName,
            limitRange,
            otherFoorIKBone,
            NumberUtils.getRandomInteger(1, _getData(state).followMaxCount),
        ))
    }, 1))

    return state
}

// let _getCustomDataKeyForOriginBoneLocalPosition = () => "lightStomp_OriginBoneLocalPosition"

let _getOriginBoneLocalPosition = (state: state) => {
    return NullableUtils.getExn(getCustomData(state).originBoneLocalPosition)
}

let _storeOriginBoneLocalPosition = (state: state, originBoneLocalPosition) => {
    return setCustomData(state, {
        ...getCustomData(state),
        originBoneLocalPosition: NullableUtils.return_(originBoneLocalPosition)
    })
}

// let _getCustomDataKeyForPhase = () => "lightStomp_Phase"

export let getPhase = (state: state) => {
    return NullableUtils.getWithDefault(
        getCustomData(state).phase,
        phase.None,
    )
}

let _setPhase = (state: state, phase: phase) => {
    return setCustomData(state, {
        ...getCustomData(state),
        phase
    })
}

// let _getCustomDataKeyForCurrentTween = () => "lightStomp_CurrentTween"

// let _getCurrentTween = (state: state) => {
//     return getCustomDataExn<tween>(state, _getCustomDataKeyForCurrentTween())
// }

let _setCurrentTweens = (state: state, tweens: Array<tween>) => {
    return setCustomData(state, {
        ...getCustomData(state),
        tweens
    })
}

// export let stopCurrentTweens = (state: state) => {
export let handleChangeToStressing = (state: state) => {
    NullableUtils.forEach(tweens => {
        ArticluatedAnimation.stopTweens(tweens)
    },
        getCustomData(state).tweens
    )

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildKeyForDeferByTime()))

    // return markFinish(state, getIdExn(state, actionName.LightStomp), behaviourTreeNodeExecuteResult.Fail)
    // return Promise.resolve(state)
    return state
}

// let _removeCurrentTween = (state: state) => {
//     return removeCustomData(state, _getCustomDataKeyForCurrentTween())
// }

let _buildKeyForDeferByTime = () => "LightStomp_DeferByTime"

let _hangRightLightStompEndHandler = (state: state, { userData }) => {
    let d = getLeftFootIKBone(state)
    state = d[0]
    let bone1 = d[1]


    d = getRightFootIKBone(state)
    state = d[0]
    let bone2 = d[1]

    state = _storeOriginBoneLocalPosition(state, bone2.position.clone()
    )


    // let startTime = performance.now()


    state = _handleLightStomp(state,
        [getRightFootIKBone, isRightFootIKBone, _isInLegRange],
        collisionPart.RightFoot,
        actionName.BackRightLightStomp,
        _expandRigthLimitRangeForFollow(state, _getRightLegLimitRange()),
        bone1, NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
    )

    return Promise.resolve(state)
}

let _hangLeftLightStompEndHandler = (state: state, { userData }) => {
    let d = getRightFootIKBone(state)
    state = d[0]
    let bone1 = d[1]


    d = getLeftFootIKBone(state)
    state = d[0]
    let bone2 = d[1]

    state = _storeOriginBoneLocalPosition(state, bone2.position.clone()
    )



    // let startTime = performance.now()


    state = _handleLightStomp(state,
        [getLeftFootIKBone, isLeftFootIKBone, _isInLegRange],
        collisionPart.LeftFoot,
        actionName.BackLeftLightStomp,
        _expandLeftLimitRangeForFollow(state, _getLeftLegLimitRange()),
        bone1, NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
    )

    return Promise.resolve(state)
}

let _backLightStompEndHandler = (state: state, { userData }) => {
    state = _setPhase(state, phase.None)

    return markFinish(state, getIdExn(state, actionName.LightStomp), behaviourTreeNodeExecuteResult.Success)
}

// let _qteEndHandler = (state: state, { userData }) => {
//     let { isHit } = NullableUtils.getExn(userData)

//     state = setCustomData(state, _getCustomDataKeyForOriginBoneLocalPosition(), isHit)
//     state = setIsStart(state, false)

//     return Promise.resolve(state)
// }

export let initWhenImportScene = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getHangRightLightStompEndEventName(), _hangRightLightStompEndHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getHangLeftLightStompEndEventName(), _hangLeftLightStompEndHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getBackRightLightStompEndEventName(), _backLightStompEndHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getBackLeftLightStompEndEventName(), _backLightStompEndHandler))
    // state = setAbstractState(state, Event.on(getAbstractState(state), getQTEEndEventName(), _qteEndHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getPointerDownEventName(), pointdownHandle))

    return state
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getHangRightLightStompEndEventName(), _hangRightLightStompEndHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getHangLeftLightStompEndEventName(), _hangLeftLightStompEndHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getBackRightLightStompEndEventName(), _backLightStompEndHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getBackLeftLightStompEndEventName(), _backLightStompEndHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getQTEEndEventName(), _qteEndHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getPointerDownEventName(), pointdownHandle))

    state = _clearIKBoneCustomData(state)

    return state
}