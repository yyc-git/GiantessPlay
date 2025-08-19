import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, result } from "../../../../../type/StateType"
import { markIsRunning } from "../../../../../utils/BehaviourManagerUtils"
import { getIdExn, markFinish, setId } from "../../../../../behaviour_tree/BehaviourTreeManager"
import { Vector3 } from "three"
import { createTween } from "../../../Utils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import * as LittleManTransform from "../../../../../little_man/Transform";
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { actionName, articluatedAnimationName } from "../../DataType"
import * as BehaviourTreeDataAll from "../../behaviour_tree_data_all/BehaviourTreeData"
import { getBone } from "../../../../../utils/MMDUtils"
import * as Girl from "../../../../../girl/Girl"
import { getCustomData, getKey, setCustomData } from "../BehaviourTreeData"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../../../DataUtils"
import * as DamageUtils from "../../../../../utils/DamageUtils";
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"

const _v1 = /*@__PURE__*/ new Vector3();
// const _b1 = /*@__PURE__*/ new Box3();


type data = {
    // downForce: number,
    // rubForce: number,
    // expandSize: number,
    // backTime: number,
    // upTime: number,
    // // rubToUpTime: number,
    // // downToRubTime: number,
    // downToUpTime: number,
    // downTime: number,
    // followTime: number,
    // hangTime: number,

    // backRateWhenFinishUp: number,
    // backRateWhenExceedRange: number,

    moveMaxAmplitude: number,
    moveTimeScalar: number,
    // followMaxCount: number,

}

let _getData = (state: state): data => {
    // let factor, hangFactor
    // if (isHard(state)) {
    //     factor = 2
    //     hangFactor = 1.5
    // }
    // else {
    //     factor = 1
    //     hangFactor = 1
    // }
    // let factor = 1

    return {
        // downForce: 8 * factor,
        // rubForce: 3 * factor,
        // // expandSize: 2,
        // expandSize: 1.8,
        // backTime: 500,
        // upTime: 1000,
        // rubToUpTime: 0.5,
        // downToRubTime: 0.5,
        // downToUpTime: 0.5,
        // downTime: 800 / factor,
        // followTime: 1000 / factor,
        // followTime: 1000,
        // hangTime: 1200 / hangFactor,

        // // backRateWhenFinishUp: 0.2,
        // backRateWhenFinishUp: 0.2,
        // backRateWhenExceedRange: 0.5,

        // moveMaxAmplitude: 0.6,
        // moveMaxAmplitude: 3,
        moveMaxAmplitude: 4,
        moveTimeScalar: 1.5,
        // // followMaxCount: 5,
        // followMaxCount: 4,
    }
}

// let _getRandomForce = (force) => {
//     return NumberUtils.getRandomFloat(force * 0.5, force * 1.5)
// }

// let _getRandomTime = _getRandomForce

// let _buildKeyForDeferByTime = () => "Protect_DeferByTime"

let _setCurrentTweens = (state: state, tweens: Array<tween>) => {
    return setCustomData(state, {
        ...getCustomData(state),
        tweens
    })
}


let _move = (state,
    // [_getHandIKBone, _isHandIKBone,
    //     getOriginBoneLocalPositionFunc,
    //     markIsNotActionFunc,
    //     setCurrentTweensFunc,
    // ],
    // actionName,
    // key
) => {
    // let d = _getHandIKBone(state)
    // state = d[0]
    // let bone = d[1]

    // let boneLocalPosition = bone.position.clone()
    let boneLocalPosition = NullableUtils.getExn(getCustomData(state).originBoneLocalPosition)

    let helper = getMMDAnimationHelper(getAbstractState(state))

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.MoveLeftHandProtect)

    let tweens = playArticluatedAnimation(state,
        [
            object => {
                MutableMapUtils.set(helper.ikBoneCustomData, actionName.LeftHandProtect, (bone) => {
                    if (_isHandIKBone(bone)) {
                        bone.position.setX(object.x)
                    }
                })
            },
            state => {
                return boneLocalPosition
            },
            state => {
                return [
                    boneLocalPosition,
                    NumberUtils.getRandomFloat(_getData(state).moveMaxAmplitude / 2, _getData(state).moveMaxAmplitude),
                    _getData(state).moveTimeScalar
                ]
            },
            (allTweens) => {
                DamageUtils.handleTweenRepeatComplete3(
                    [
                        state => {
                            // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

                            // return _computeRubDamage(state, boxBefore)
                            return Promise.resolve(state)
                        },
                        state => {
                            return true
                        },
                        state => {
                            state = BehaviourTreeDataAll.setCustomData(state, {
                                ...BehaviourTreeDataAll.getCustomData(state),
                                isLeftHandAction: false
                            })


                            state = _clearIKBoneCustomData(state, actionName.LeftHandProtect)


                            return markFinish(state, getIdExn(state, actionName.LeftHandProtect), behaviourTreeNodeExecuteResult.Success, getKey()).then(writeState)
                        },
                    ],
                    allTweens,
                    // NumberUtils.getRandomInteger(
                    //     articluatedAnimationData.repeatCount,
                    //     articluatedAnimationData.repeatCount * 2
                    // )
                    articluatedAnimationData.repeatCount
                )
            },
            () => {
                // let state = readState()

                // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRubSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

                // return _computeRubDamage(state, boxBefore).then(state => {
                //     let _ = writeState(state)
                // })
                return Promise.resolve()
            }
        ],
        articluatedAnimationData
    )

    state = _setCurrentTweens(state, tweens)

    return state
}

let _getHandIKBone = (state: state) => {
    return getBone(state, Girl.getGirl(state), "左腕ＩＫ")
}

let _isHandIKBone = (bone) => {
    return bone.name == "左腕ＩＫ"
}


export let protect: actionNodeFunc = (state, id) => {
    Console.log("protect")

    state = BehaviourTreeDataAll.setCustomData(state, {
        ...BehaviourTreeDataAll.getCustomData(state),
        isLeftHandAction: true
    })

    state = markIsRunning(state, true, getKey())

    state = setId(state, actionName.LeftHandProtect, id)

    let d = _getHandIKBone(state)

    state = d[0]
    let bone = d[1]

    state = setCustomData(state, {
        ...getCustomData(state),
        originBoneLocalPosition: NullableUtils.return_(bone.position.clone())
    })
    // state = setOriginBoneLocalPositionFunc(state, bone.position.clone())

    state = _move(state,
        // [_getHandIKBone, _isHandIKBone,
        //     getOriginBoneLocalPositionFunc,
        //     markIsNotActionFunc,
        //     setCurrentTweensFunc,
        // ],
        // actionName.LeftHandProtect,
        // key
    )

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}

let _clearIKBoneCustomData = (state: state, actionName) => {
    MutableMapUtils.remove(getMMDAnimationHelper(getAbstractState(state)).ikBoneCustomData, actionName)

    return state
}

export let dispose = (state: state) => {
    state = _clearIKBoneCustomData(state, actionName.LeftHandProtect)

    return state
}

