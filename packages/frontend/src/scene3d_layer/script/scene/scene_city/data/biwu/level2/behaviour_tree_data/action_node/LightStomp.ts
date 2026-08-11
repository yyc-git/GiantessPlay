import { Vector3, Bone, Object3D, LinearTransfer, Box3 } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType, result, usedGirl } from "../../../../../type/StateType";
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
import { getBone, hasBone } from "../../../../../utils/MMDUtils";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
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
import { getCollisionPartOBB, updateAllCollisionShapes } from "../../../../../girl/Collision";
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
import { getCustomData, hasCustomData, phase, setCustomData } from "../BehaviourTreeData";
import { computeDamage } from "../../../ActionNodeUtils";
import { MMD } from "meta3d-jiehuo-abstract";
import { getNow } from "../../../../../Time";
import { addTweens } from "../../../../../TweenManager";
import { convertAutoDifficultyToRate } from "../../../../../difficulty/DifficultyUtils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";

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

let _getData = (state: state, usedGirl): data => {
    let factor, timeFactor
    if (isHard(state, usedGirl)) {
        factor = 2
        timeFactor = 1.5
    }
    else {
        factor = 1
        timeFactor = 1
    }

    let autoDifficultyToRateInvert = 1 - convertAutoDifficultyToRate(state)

    return {
        // downForce: 8 * factor,
        // rubForce: 3 * factor,

        // downForce: 4 * factor,
        // rubForce: 1.5 * factor,
        downForce: 3 * factor,
        rubForce: 1.2 * factor,


        // expandSize: 2,
        expandSize: 1.8,
        backTime: 500,
        upTime: 1000,
        rubToUpTime: 0.5,
        downToRubTime: 0.5,
        downToUpTime: 0.5,
        // downTime: 800 / factor,
        downTime: 800 / timeFactor,
        // followTime: 1000 / factor,
        // followTime: 1000,
        // hangTime: 1200 / timeFactor,
        // followTime: 1100,
        // followTime: NumberUtils.greaterThan((1000 * autoDifficultyToRateInvert) / timeFactor, 100),
        followTime: NumberUtils.clamp((1300 * autoDifficultyToRateInvert) / timeFactor, 200, 1000),
        // hangTime: 1400 / timeFactor,
        // hangTime: NumberUtils.greaterThan((1200 * autoDifficultyToRateInvert) / timeFactor, 150),
        hangTime: NumberUtils.clamp((1600 * autoDifficultyToRateInvert) / timeFactor, 600, 1200),

        // backRateWhenFinishUp: 0.2,
        backRateWhenFinishUp: 0.2,
        backRateWhenExceedRange: 0.5,

        rubMaxAmplitude: 0.6,
        rubTimeScalar: 1.5,
        // followMaxCount: 5,
        followMaxCount: 4,
    }
}

let _triggerAction = (state: state, usedGirl, id, actionName_): Promise<[state, any]> => {
    state = _setPhase(state, phase.Begin)

    return triggerAction(state, usedGirl, actionName_).then(([state, result_]) => {
        if (result_ == result.Fail) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        state = setId(state, usedGirl, actionName.LightStomp, id)

        state = markIsRunning(state, usedGirl, true)

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

let _expandRigthLimitRangeForFollow = (state, usedGirl, limitRange) => {
    return {
        ...limitRange,
        maxX: limitRange.maxX + _getData(state, usedGirl).expandSize
    }
}

let _expandLeftLimitRangeForFollow = (state, usedGirl, limitRange) => {
    return {
        ...limitRange,
        minX: limitRange.minX - _getData(state, usedGirl).expandSize

    }
}

let _isInLegRange = (state, bone, limitRange) => {
    let boneLocalPositionBefore = bone.position.clone()

    let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), LittleManTransform.getWorldPosition(state))

    let result = isInXZRange(bone.position, limitRange)

    bone.position.copy(boneLocalPositionBefore)

    return result
}

let _isInRightLegRange = (state, usedGirl) => {
    let d = getRightFootIKBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _isInLegRange(state, bone, _getRightLegLimitRange())
}

let _isInLeftLegRange = (state, usedGirl) => {
    let d = getLeftFootIKBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _isInLegRange(state, bone, _getLeftLegLimitRange())
}

export let lightStomp: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("lightStomp")

    // let actionName_
    // switch (getCurrentPose(state, usedGirl)) {
    //     case pose.Stand:
    //     case pose.Pick:
    //         actionName_ = actionName.Stomp
    //         break
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }


    // if (!hasTarget(state, usedGirl)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }

    // state = _lookatTarget(state, (state, lookatQuaternion)=>lookatQuaternion, usedGirl)

    // return triggerAction(state, usedGirl, actionName.HangRightLightStomp as any, id)

    if (_isInRightLegRange(state, usedGirl)) {
        return _triggerAction(state, usedGirl, id, actionName.HangRightLightStomp)
    }
    else if (_isInLeftLegRange(state, usedGirl)) {
        return _triggerAction(state, usedGirl, id, actionName.HangLeftLightStomp)
    }

    state = lookatTarget(state, (state, lookatQuaternion) => lookatQuaternion, usedGirl)

    if (_isInRightLegRange(state, usedGirl)) {
        return _triggerAction(state, usedGirl, id, actionName.HangRightLightStomp)
    }
    else if (_isInLeftLegRange(state, usedGirl)) {
        return _triggerAction(state, usedGirl, id, actionName.HangLeftLightStomp)
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}

// let _finishWhenIdle = (state: state, id) => {
//     if (!isCompletelyPlayingAnimation(state, animationName.Idle)) {
//         state = resetIsTriggerAction(state, usedGirl)
//         state = markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success)

//         let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)
//         MutableRecordUtils.remove(helper.ikBoneCustomData, actionName.HangRightLightStomp)


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

let _clearIKBoneCustomData = (state: state, usedGirl) => {
    if (MMD.hasMMDAnimationHelper(getAbstractState(state), usedGirl)) {
        MutableRecordUtils.remove(MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).ikBoneCustomData, actionName.LightStomp)
    }

    return state
}

export let isRightFootIKBone = (bone) => {
    return bone.name == "右足ＩＫ"
}

export let isLeftFootIKBone = (bone) => {
    return bone.name == "左足ＩＫ"
}

export let getRightFootIKBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, Girl.getGirl(state, usedGirl), "右足ＩＫ")
}

export let getLeftFootIKBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, Girl.getGirl(state, usedGirl), "左足ＩＫ")
}

let _createTween = (state: state,
    [
        isFootIKBoneFunc,
        updateBoneFunc,
        onCompleteFunc
    ], usedGirl: usedGirl,
    sourceObject, targetObject, time): [state, tween] => {
    return createTween(
        state, usedGirl,
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
    usedGirl: usedGirl,
    time
) => {
    let d = getBoneFunc(state, usedGirl)
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

                state = _clearIKBoneCustomData(state, usedGirl)

                // return triggerAction(state, usedGirl, backActionName).then(TupleUtils.getTuple2First).then(writeState)
                return onCompleteFunc(state).then(writeState)
            }
        ], usedGirl,
        {
            x: boneLocalPosition.x,
            y: boneLocalPosition.y,
            z: boneLocalPosition.z,
        }, {
        x: originBoneLocalPosition.x,
        y: originBoneLocalPosition.y,
        z: originBoneLocalPosition.z,
        // }, _getRandomTime(_getData(state, usedGirl).backTime))
    }, time)

    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Back)
    // state = _removeCurrentTween(state)
    state = _setCurrentTweens(state, [tween])

    state = addTweens(state, [tween])

    return state
}

let _back = (state: state,
    [getBoneFunc, isFootIKBoneFunc], usedGirl: usedGirl,
    backActionName) => {
    return backToHang(state,
        [getBoneFunc, isFootIKBoneFunc, state => {
            return triggerAction(state, usedGirl, backActionName).then(TupleUtils.getTuple2First)
        }], usedGirl,
        _getRandomTime(_getData(state, usedGirl).backTime)
    )
}

let _up = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    usedGirl: usedGirl,
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,
) => {
    let d = getBoneFunc(state, usedGirl)
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

                const rate = _getData(state, usedGirl).backRateWhenFinishUp

                if (NumberUtils.isRandomRate(rate)) {
                    state = _back(state,
                        [getBoneFunc, isFootIKBoneFunc], usedGirl,
                        backActionName)
                }
                else {
                    state = _handleLightStomp(state,
                        [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                        usedGirl,
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
        ], usedGirl,
        {
            x: boneLocalPosition.x,
            y: boneLocalPosition.y,
            z: boneLocalPosition.z,
        }, {
        x: boneLocalPositionBeforeDown.x,
        y: boneLocalPositionBeforeDown.y,
        z: boneLocalPositionBeforeDown.z,
    }, _getRandomTime(_getData(state, usedGirl).upTime))

    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Up)
    state = _setCurrentTweens(state, [tween])

    state = addTweens(state, [tween])

    return state
}

let _computeRubDamage = (state, usedGirl, boxBefore) => {
    const force = _getData(state, usedGirl).rubForce

    return computeDamage(state, usedGirl, boxBefore, buildDownDirection(), _getRandomForce(force)).then(TupleUtils.getTuple2First)
}

let _rub = (state: state,
    [
        getBoneFunc,
        isFootIKBoneFunc,
        isInLegRangeFunc
    ],
    usedGirl: usedGirl,
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,

    rubTimeScalar
) => {
    let d = getBoneFunc(state, usedGirl)
    state = d[0]
    let bone = d[1]

    let boneLocalPosition = bone.position.clone()


    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Rub)

    let boxBefore = getCollisionPartOBB(state, usedGirl, collisionPart_).clone()

    let tweens = playArticluatedAnimation(state,
        [
            object => {
                MutableRecordUtils.set(helper.ikBoneCustomData, actionName.LightStomp, (bone) => {
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
                    NumberUtils.getRandomFloat(_getData(state, usedGirl).rubMaxAmplitude / 2, _getData(state, usedGirl).rubMaxAmplitude),
                    rubTimeScalar
                ]
            },
            (allTweens) => {
                DamageUtils.handleTweenRepeatComplete3(
                    [
                        state => {
                            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, boxBefore.center))))

                            return _computeRubDamage(state, usedGirl, boxBefore)
                        },
                        state => {
                            return !getIsHit(state)
                        },
                        state => {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                return Promise.resolve(_up(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc], usedGirl,
                                    collisionPart_,
                                    backActionName,
                                    limitRange,
                                    otherFoorIKBone,
                                    boneLocalPositionBeforeDown,
                                ))
                            }, _getRandomTime(_getData(state, usedGirl).rubToUpTime), _buildKeyForDeferByTime()))

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
            NullableUtils.return_(() => {
                let state = readState()

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, boxBefore.center))))

                return _computeRubDamage(state, usedGirl, boxBefore).then(state => {
                    let _ = writeState(state)
                })
            })
        ],
        articluatedAnimationData
    )


    state = _setPhase(state, phase.Rub)
    // state = _removeCurrentTween(state)
    state = _setCurrentTweens(state, tweens)

    state = addTweens(state, tweens)

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

let _getDownTarget = (state: state, usedGirl, otherFoorIKBone, targetWorldPositionWhenHange, boneWorldPosition, collisionPart_) => {
    let worldPosition = NullableUtils.getExn(
        targetWorldPositionWhenHange
    )

    let bone2, d, boneName
    switch (collisionPart_) {
        case collisionPart.LeftFoot:
            boneName = "左つま先ＩＫ"
            break
        case collisionPart.RightFoot:
            boneName = "右つま先ＩＫ"
            break
        default:
            throw new Error("err")
    }

    let target = {
        x: worldPosition.x + _getDownOffset(),
        y: otherFoorIKBone.position.y * 1.08,
        z: worldPosition.z + _getDownOffset(),
    }

    if (!hasBone(Girl.getGirl(state, usedGirl), boneName)) {
        return target
    }

    d = getBone(state, usedGirl, Girl.getGirl(state, usedGirl), boneName)
    state = d[0]
    bone2 = d[1]

    let footBackDirection = boneWorldPosition.clone().sub(bone2.getWorldPosition(_v1)).normalize()
    let distance = footBackDirection.multiplyScalar(getCollisionPartOBB(state, usedGirl, collisionPart_).halfSize.z * 0.8)

    return {
        x: target.x + distance.x,
        y: target.y,
        z: target.z + distance.z,
    }
}

let _downAndUp = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    usedGirl: usedGirl,
    collisionPart_,
    backActionName,
    limitRange,
    targetWorldPositionWhenHange,
    otherFoorIKBone,
    boneLocalPositionBeforeDown,
) => {
    let d = getBoneFunc(state, usedGirl)
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

                const force = _getData(state, usedGirl).downForce

                let collisionPartOBB = getCollisionPartOBB(state, usedGirl, collisionPart_)

                const factor = 0.3
                let size = getGirlScale(state, usedGirl) * factor
                state = setAbstractState(state, ParticleManager.emitStompDust(getAbstractState(state),
                    {
                        speed: 10 * Math.max(getGirlScale(state, usedGirl) / 10, 1) * factor / 1.3,
                        changeLife: 500,
                        life: 3000,
                        size: size,
                        // position: getPositionParrelToObj(collisionPartOBB.center, LittleManTransform.getWorldPosition(state).y + 3).toArray()
                        position: getPositionParrelToObj(collisionPartOBB.center, 3).toArray()
                    }
                ))

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getLightStompSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, collisionPartOBB.center))))

                return computeDamage(state, usedGirl, collisionPartOBB, buildDownDirection(), _getRandomForce(force))
                    .then(([state, isHit]) => {
                        if (isHit) {
                            state = addExcitement(state, usedGirl, excitement.Low)
                        }

                        if (isHit && NumberUtils.isRandomRate(0.5)) {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                state = addExcitement(state, usedGirl, excitement.Low)

                                let rubTimeScalar = _getRandomTime(_getData(state, usedGirl).rubTimeScalar)

                                state = _rub(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                                    usedGirl,
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

                                return startQTE(state, usedGirl, 1)
                            }, _getRandomTime(_getData(state, usedGirl).downToRubTime), _buildKeyForDeferByTime()))
                        }
                        else {
                            state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                                return Promise.resolve(_up(state,
                                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                                    usedGirl,
                                    collisionPart_,
                                    backActionName,
                                    limitRange,
                                    otherFoorIKBone,
                                    boneLocalPositionBeforeDown,
                                ))
                            }, _getRandomTime(_getData(state, usedGirl).downToUpTime), _buildKeyForDeferByTime()))
                        }

                        writeState(state)
                    })
            }
        ],
        usedGirl,
        {
            x: boneWorldPosition.x,
            y: boneLocalPositionBeforeDown.y,
            z: boneWorldPosition.z,
        },
        _getDownTarget(state, usedGirl, otherFoorIKBone, targetWorldPositionWhenHange, boneWorldPosition, collisionPart_),
        _getRandomTime(_getData(state, usedGirl).downTime))
    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Down)
    state = _setCurrentTweens(state, [tween])

    state = addTweens(state, [tween])

    return state
}

let _follow = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    usedGirl: usedGirl,
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone,
    repeatCount
) => {
    let d = getBoneFunc(state, usedGirl)
    state = d[0]
    let bone = d[1]

    let boneWorldPosition = bone.getWorldPosition(new Vector3())

    let worldPosition = LittleManTransform.getWorldPosition(state)


    if (!isInLegRangeFunc(state, bone, limitRange)) {
        const rate = _getData(state, usedGirl).backRateWhenExceedRange

        if (NumberUtils.isRandomRate(rate)) {
            return _back(state,
                [getBoneFunc, isFootIKBoneFunc], usedGirl,
                backActionName)
        }


        // state = _setPhase(state, phase.Hang)

        return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
            return Promise.resolve(_follow(state,
                [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc], usedGirl,
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
                        usedGirl,
                        collisionPart_,
                        backActionName,
                        limitRange,
                        otherFoorIKBone,
                        repeatCount - 1
                    )

                    writeState(state)

                    return Promise.resolve()
                }


                let d = getBoneFunc(state, usedGirl)
                state = d[0]
                let bone = d[1]


                state = _setPhase(state, phase.None)

                state = _handleLightStomp(state,
                    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
                    usedGirl,
                    collisionPart_,
                    backActionName,
                    limitRange,
                    otherFoorIKBone, NullableUtils.return_(getNow(state)),
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
        ], usedGirl,
        {
            x: boneWorldPosition.x,
            y: boneWorldPosition.y,
            z: boneWorldPosition.z,
        }, {
        x: worldPosition.x,
        y: worldPosition.y,
        z: worldPosition.z,
    }, _getRandomTime(_getData(state, usedGirl).followTime))
    state = d2[0]
    let tween = d2[1]

    state = _setPhase(state, phase.Fllow)
    state = _setCurrentTweens(state, [tween])

    state = addTweens(state, [tween])

    return state
}

let _handleLightStomp = (state: state,
    [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc],
    usedGirl: usedGirl,
    collisionPart_,
    backActionName,
    limitRange,
    otherFoorIKBone: Bone, hangTime: nullable<number>, boneLocalPositionBeforeDown,
    targetWorldPositionWhenHange: nullable<Vector3>
) => {
    // if (getNow(state) - startTime > 5000) {
    // if (getNow(state) - startTime > 100000) {
    //     return _back(state,
    //         [getBoneFunc, isFootIKBoneFunc],
    //         backActionName,
    //         originBoneLocalPosition)
    // }

    if (!NullableUtils.isNullable(hangTime)) {
        hangTime = NullableUtils.getExn(hangTime)

        if (getNow(state) - hangTime >= _getRandomHangTime(_getData(state, usedGirl).hangTime)) {
            return _downAndUp(state,
                [getBoneFunc, isFootIKBoneFunc, isInLegRangeFunc], usedGirl,
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
                usedGirl,
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
            usedGirl,
            collisionPart_,
            backActionName,
            limitRange,
            otherFoorIKBone,
            NumberUtils.getRandomInteger(1, _getData(state, usedGirl).followMaxCount),
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

let _clearDeferData = (state: state) => {
    if (hasCustomData(state)) {
        NullableUtils.forEach(tweens => {
            ArticluatedAnimation.stopTweens(tweens)
        },
            getCustomData(state).tweens
        )
    }

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildKeyForDeferByTime()))

    // return markFinish(state, usedGirl, getIdExn(state, usedGirl, actionName.LightStomp), behaviourTreeNodeExecuteResult.Fail)
    // return Promise.resolve(state)
    return state

}

// export let stopCurrentTweens = (state: state) => {
export let handleChangeToStressing = (state: state) => {
    return _clearDeferData(state)
}

// let _removeCurrentTween = (state: state) => {
//     return removeCustomData(state, _getCustomDataKeyForCurrentTween())
// }

let _buildKeyForDeferByTime = () => "LightStomp_DeferByTime"

let _hangRightLightStompEndHandler = (state: state, { userData }) => {
    let { usedGirl } = userData

    let d = getLeftFootIKBone(state, usedGirl)
    state = d[0]
    let bone1 = d[1]


    d = getRightFootIKBone(state, usedGirl)
    state = d[0]
    let bone2 = d[1]

    state = _storeOriginBoneLocalPosition(state, bone2.position.clone()
    )


    // let startTime = getNow(state)


    state = _handleLightStomp(state,
        [getRightFootIKBone, isRightFootIKBone, _isInLegRange],
        usedGirl,
        collisionPart.RightFoot,
        actionName.BackRightLightStomp,
        _expandRigthLimitRangeForFollow(state, usedGirl, _getRightLegLimitRange()),
        bone1, NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
    )

    return Promise.resolve(state)
}

let _hangLeftLightStompEndHandler = (state: state, { userData }) => {
    let { usedGirl } = userData
    let d = getRightFootIKBone(state, usedGirl)
    state = d[0]
    let bone1 = d[1]


    d = getLeftFootIKBone(state, usedGirl)
    state = d[0]
    let bone2 = d[1]

    state = _storeOriginBoneLocalPosition(state, bone2.position.clone()
    )



    // let startTime = getNow(state)


    state = _handleLightStomp(state,
        [getLeftFootIKBone, isLeftFootIKBone, _isInLegRange],
        usedGirl,
        collisionPart.LeftFoot,
        actionName.BackLeftLightStomp,
        _expandLeftLimitRangeForFollow(state, usedGirl, _getLeftLegLimitRange()),
        bone1, NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
    )

    return Promise.resolve(state)
}

let _backLightStompEndHandler = (state: state, { userData }) => {
    let { usedGirl } = userData
    state = _setPhase(state, phase.None)

    return markFinish(state, usedGirl, getIdExn(state, usedGirl, actionName.LightStomp), behaviourTreeNodeExecuteResult.Success)
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

    state = stop(state)

    return state
}

export let stop = (state: state) => {
    state = ArrayUtils.reduce(Girl.getCurrentUsedGirls(state), (state, usedGirl) => {
        return _clearIKBoneCustomData(state, usedGirl)
    }, state)

    state = _clearDeferData(state)

    return state
}