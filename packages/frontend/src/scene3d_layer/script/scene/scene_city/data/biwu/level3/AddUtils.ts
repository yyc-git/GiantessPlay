import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, difficulty, result } from "../../../type/StateType"
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
import * as BehaviourTreeDataAll from "./behaviour_tree_data_all/BehaviourTreeData"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as ArmyManager from "../../../manage/biwu/level3/ArmyManager"
import { getBone } from "../../../utils/MMDUtils"
import { getGirl, getName } from "../../../girl/Girl"
import { getCollisionPartOBB } from "../../../girl/Collision"
import { getPositionY } from "../../../manage/city1/Army"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getDownTarget } from "./ActionNodeUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAddSoundResourceId } from "../../../manage/biwu/level3/ManageScene"
import { getIsDebug } from "../../../../Scene"
import { getGirlVolume } from "../../../utils/SoundUtils"
import { getBiwuSetting } from "../../../CityScene"

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
// const _b1 = /*@__PURE__*/ new Box3();


type data = {
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
    // let factor, hangFactor
    // if (isHard(state)) {
    //     factor = 2
    //     hangFactor = 1.5
    // }
    // else {
    //     factor = 1
    //     hangFactor = 1
    // }
    let factor = 1

    return {
        // downForce: 8 * factor,
        // rubForce: 3 * factor,
        // // expandSize: 2,
        // expandSize: 1.8,
        // backTime: 500,
        upTime: 1500,
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

let _buildKeyForDeferByTime = () => "Add_DeferByTime"

// let _setCurrentTweens = (state: state, tweens: Array<tween>) => {
//     return setCustomData(state, {
//         ...getCustomData(state),
//         tweens
//     })
// }

let _findArmyAddData = (state: state) => {
    return NullableUtils.getWithDefault(
        BehaviourTreeDataAll.getCustomData(state).armyAddData.find(d => {
            return d.condition(state) && NumberUtils.isRandomRate(d.rate(state))
        }),
        ArrayUtils.getLast(BehaviourTreeDataAll.getCustomData(state).armyAddData)
    )
}

let _addArmy = (state: state, { generateFuncs, count, offset, isOnBreast }: BehaviourTreeDataAll.armyAddSingleData, worldPosition) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getAddSoundResourceId(), getIsDebug(state), getGirlVolume(state, LittleManTransform.getWorldPosition(state)))))


    let factor
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
            factor = 0.5
            break
        case difficulty.Easy:
            factor = 0.8
            break
        case difficulty.Middle:
            factor = 1
            break
        case difficulty.Hard:
            factor = 1.2
            break
        case difficulty.VeryHard:
            factor = 1.5
            break
    }
    count = isOnBreast ? 1 : NumberUtils.greaterThan(Math.round(count * factor
        * NumberUtils.getRandomFloat(0.5, 1.5)
    ), 1)


    return ArmyManager.generate(state, generateFuncs, count,
        worldPosition,
        offset,
        isOnBreast
    )
}

let _downAndUp = (state,
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

    let boneWorldPosition = bone.getWorldPosition(new Vector3())

    let armyAddSingleData = _findArmyAddData(state)

    let worldPosition = armyAddSingleData.position(state)
    worldPosition = worldPosition.clone().setY(getPositionY(state, ArmyManager.getGirlPositionYKey(), worldPosition.x, worldPosition.z))


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
                // return _addArmy(state, armyAddSingleData).then(state => {
                return _addArmy(state, armyAddSingleData, worldPosition).then(state => {
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
        getDownTarget(state, worldPosition, 5, "右人指３", "右腕ＩＫ"),
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

export let add = (
    [
        getBoneFunc,
        isFootIKBoneFunc,
        getOriginBoneLocalPositionFunc,
        setOriginBoneLocalPositionFunc,
        markIsActionFunc,
        markIsNotActionFunc,
        setCurrentTweensFunc,
    ],
    actionName_,
    key): actionNodeFunc => {
    return (state, id) => {
        Console.log("add")

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

