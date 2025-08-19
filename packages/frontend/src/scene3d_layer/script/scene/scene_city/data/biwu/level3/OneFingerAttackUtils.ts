import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, result } from "../../../type/StateType"
import { markIsRunning } from "../../../utils/BehaviourManagerUtils"
import { getIdExn, markFinish, setId } from "../../../behaviour_tree/BehaviourTreeManager"
import { Vector3 } from "three"
import { createTween } from "../Utils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState, writeState } from "../../../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import * as LittleManTransform from "../../../little_man/Transform";
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { getDataFactor, getDownTarget } from "./ActionNodeUtils"
import { computeDamage } from "../ActionNodeUtils"
import { getCollisionPartOBB } from "../../../girl/Collision"
import { buildDownDirection } from "../../../../../../utils/DirectionUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getGirlVolume, getLittleManVolume, getVolume } from "../../../utils/SoundUtils"
import { getIsDebug } from "../../../../Scene"
import { getSwipingEmmitGirlSoundResourceId } from "../../../CityScene"
import { collisionPart } from "./CollisionShapeData"

const _v1 = /*@__PURE__*/ new Vector3();
// const _b1 = /*@__PURE__*/ new Box3();


type data = {
    force: number,
    // downForce: number,
    // rubForce: number,
    // expandSize: number,
    // backTime: number,
    upTime: number,
    // rubToUpTime: number,
    // downToRubTime: number,
    downToUpTime: number,
    downTime: number,
    // followTime: number,
    // hangTime: number,

    // backRateWhenFinishUp: number,
    // backRateWhenExceedRange: number,

    // rubMaxAmplitude: number,
    // rubTimeScalar: number,
    // followMaxCount: number,

}

let _getData = (state: state): data => {
    let factor = getDataFactor(state)

    return {
        force: 0.02 * factor,
        // downForce: 8 * factor,
        // rubForce: 3 * factor,
        // // expandSize: 2,
        // expandSize: 1.8,
        // backTime: 500,
        upTime: 2000,
        // rubToUpTime: 0.5,
        // downToRubTime: 0.5,
        downToUpTime: 0.5,
        downTime: 1200 / factor,
        // followTime: 1000 / factor,
        // followTime: 1000,
        // hangTime: 1200 / hangFactor,

        // // backRateWhenFinishUp: 0.2,
        // backRateWhenFinishUp: 0.2,
        // backRateWhenExceedRange: 0.5,

        // rubMaxAmplitude: 0.6,
        // rubTimeScalar: 1.5,
        // // followMaxCount: 5,
        // followMaxCount: 4,
    }
}

let _getRandomForce = (force) => {
    return NumberUtils.getRandomFloat(force * 0.5, force * 1.5)
}

let _getRandomTime = _getRandomForce

let _buildKeyForDeferByTime = () => "OneFingerAttack_DeferByTime"

// let _setCurrentTweens = (state: state, tweens: Array<tween>) => {
//     return setCustomData(state, {
//         ...getCustomData(state),
//         tweens
//     })
// }


let _downAndUp = (state,
    [getBoneFunc, isFootIKBoneFunc,
        getOriginBoneLocalPositionFunc,
        markIsNotActionFunc,
        setCurrentTweensFunc,
    ],
    collisionPart_,
    actionName_,
    key
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneWorldPosition = bone.getWorldPosition(new Vector3())

    let worldPosition = LittleManTransform.getWorldPosition(state)
    let downTarget
    switch (collisionPart_) {
        case collisionPart.RightFinger:
            downTarget = getDownTarget(state, worldPosition, 2, "右人指３", "右腕ＩＫ")
            break
        case collisionPart.LeftFinger:
            downTarget = getDownTarget(state, worldPosition, 2, "左人指３", "左腕ＩＫ")
            break
        default:
            throw new Error("err")
    }


    let d2 = createTween(state,
        [
            isFootIKBoneFunc,
            (bone, object) => {
                let _ = TransformUtils.setWorldPosition(bone, getAbstractState(state), _v1.set(
                    object.x,
                    object.y,
                    object.z,
                ))
            },
            state => {
                const force = _getData(state).force

                let collisionPartOBB = getCollisionPartOBB(state, collisionPart_)

                return computeDamage(state, collisionPartOBB, buildDownDirection(), _getRandomForce(force)).then(([state, isHit]) => {
                    if (isHit) {
                        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getSwipingEmmitGirlSoundResourceId(), getIsDebug(state), getGirlVolume(state, LittleManTransform.getWorldPosition(state)))))
                    }

                    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                        return Promise.resolve(_up(state,
                            [getBoneFunc, isFootIKBoneFunc,
                                getOriginBoneLocalPositionFunc,
                                markIsNotActionFunc,
                                setCurrentTweensFunc,
                            ],
                            actionName_,
                            key
                        )
                        )
                    }, _getRandomTime(_getData(state).downToUpTime), _buildKeyForDeferByTime()))

                    writeState(state)
                })
            }
        ],
        {
            x: boneWorldPosition.x,
            y: boneWorldPosition.y,
            // y: boneLocalPositionBeforeDown.y,
            z: boneWorldPosition.z,
        },

        downTarget,

        _getRandomTime(_getData(state).downTime),
        actionName_,
    )
    state = d2[0]
    let tween = d2[1]

    state = setCurrentTweensFunc(state, [tween])

    return state
}

let _up = (state: state,
    [getBoneFunc, isFootIKBoneFunc,
        getOriginBoneLocalPositionFunc,
        markIsNotActionFunc,
        setCurrentTweensFunc,
    ],
    actionName_,
    key
) => {
    let d = getBoneFunc(state)
    state = d[0]
    let bone = d[1]

    let boneLocalPosition = bone.position.clone()

    let boneLocalPositionBeforeDown = getOriginBoneLocalPositionFunc(state)

    let d2 = createTween(state,
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
                // state = BehaviourTreeDataAll.setCustomData(state, {
                //     ...BehaviourTreeDataAll.getCustomData(state),
                //     isLeftHandAction: false
                // })
                state = markIsNotActionFunc(state)


                state = _clearIKBoneCustomData(state, actionName_)


                return markFinish(state, getIdExn(state, actionName_), behaviourTreeNodeExecuteResult.Success, key).then(writeState)
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
    }, _getRandomTime(_getData(state).upTime),
        actionName_
    )

    state = d2[0]
    let tween = d2[1]

    state = setCurrentTweensFunc(state, [tween])

    return state
}

// let _getHandIKBone = (state: state) => {
//     return getBone(state, Girl.getGirl(state), "左腕ＩＫ")
// }

// let _isHandIKBone = (bone) => {
//     return bone.name == "左腕ＩＫ"
// }

export let attack = (
    [
        getBoneFunc,
        isFootIKBoneFunc,
        getOriginBoneLocalPositionFunc,
        setOriginBoneLocalPositionFunc,
        markIsActionFunc,
        markIsNotActionFunc,
        setCurrentTweensFunc,
    ],
    collisionPart_,
    actionName_,
    key): actionNodeFunc => {
    return (state, id) => {
        Console.log("attack")

        // state = BehaviourTreeDataAll.setCustomData(state, {
        //     ...BehaviourTreeDataAll.getCustomData(state),
        //     isLeftHandAction: true
        // })
        state = markIsActionFunc(state)

        state = markIsRunning(state, true, key)

        state = setId(state, actionName_, id)

        let d = getBoneFunc(state)

        state = d[0]
        let bone = d[1]

        // state = setCustomData(state, {
        //     ...getCustomData(state),
        //     originBoneLocalPosition: NullableUtils.return_(bone.position.clone())
        // })
        state = setOriginBoneLocalPositionFunc(state, bone.position.clone())

        state = _downAndUp(state,
            [getBoneFunc, isFootIKBoneFunc,
                getOriginBoneLocalPositionFunc,
                markIsNotActionFunc,
                setCurrentTweensFunc,
            ],
            collisionPart_,
            actionName_,
            key
        )

        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    }
}

let _clearIKBoneCustomData = (state: state, actionName_) => {
    MutableMapUtils.remove(getMMDAnimationHelper(getAbstractState(state)).ikBoneCustomData, actionName_)

    return state
}

// export let initWhenImportScene = (state: state) => {
//     // state = setAbstractState(state, Event.on(getAbstractState(state), getTwoHandsDefaultToOneFingerEndEventName(), _twoHandsDefaultToOneFingerEndHandler))

//     return state
// }

export let dispose = (state: state, actionName_) => {
    // state = setAbstractState(state, Event.off(getAbstractState(state), getTwoHandsDefaultToOneFingerEndEventName(), _twoHandsDefaultToOneFingerEndHandler))

    state = _clearIKBoneCustomData(state, actionName_)

    return state
}

