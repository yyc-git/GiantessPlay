import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getId, getIdExn, getKey, getTarget, hasTarget, isRunning, markFinish, removeId, setId } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, getPivotWorldPosition } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../manage/city1/PathFind"
import { actionName, animationName } from "../../data/DataType"
import { finish, handleFailCase, lookatTarget as lookatTargetUtils, triggerActionAndNotMarkFinish, triggerAction, triggerActionWithCompleteFunc } from "./Utils"
import { getCurrentPose } from "../../girl/Pose"
import { Console } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getStompBlockService, getLeftStompBlockService } from "../../../../../mod/SkillGiantessMod"
import { Event } from "meta3d-jiehuo-abstract"
import { getStartKeepStompEventName, getEndStompBackEventName } from "../../../../../utils/EventUtils"
import { getLevelData, setLevelData } from "../../CityScene"
import { lookatTarget } from "./Stomp"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"
import { triggerAction as triggerGirlAction } from "../../girl/Girl"

const _v1 = /*@__PURE__*/ new Vector3();

let _finish = (state, usedGirl, id, result) => {
    let actionName_ = getLeftStompBlockService(state).getActionName()

    return finish(state, usedGirl, id, actionName_, result)
}

export let leftStomp: actionNodeFunc = (state, usedGirl, id, config) => {
    Console.log(`leftStomp`)

    if (!hasTarget(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    let actionName_ = getLeftStompBlockService(state).getActionName()
    state = setId(state, usedGirl, actionName_, id)

    // state = markIsRunning(state, usedGirl,true)

    state = lookatTarget(state, usedGirl)

    return triggerActionAndNotMarkFinish(state, usedGirl, getStompBlockService(state).getActionName(), id,
        (state) => {
            return _finish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Fail)
        }
    )
}

let _startKeepStompHandler = (state: state, { userData }) => {
    let { usedGirl } = userData
    let actionName_ = getLeftStompBlockService(state).getActionName()

    return NullableUtils.getWithDefault(
        NullableUtils.map(id => {
            // return triggerActionAndNotMarkFinish(state, actionName_, id).then(TupleUtils.getTuple2First)
            // return triggerAction(state, usedGirl, actionName_, id).then(TupleUtils.getTuple2First)
            return triggerActionWithCompleteFunc(state, [
                triggerGirlAction,
                state => {
                    return _finish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success)
                }
            ], usedGirl, actionName_, id).then(TupleUtils.getTuple2First)
        }, getId(state, usedGirl, actionName_)),
        Promise.resolve(state)
    )
}

// let _stompBackEndHandler = (state: state, { userData }) => {
//     let actionName_ = getLeftStompBlockService(state).getActionName()

//     return NullableUtils.getWithDefault(
//         NullableUtils.map(id => {
//             return _finish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success)
//         }, getId(state, usedGirl,  actionName_)),
//         Promise.resolve(state)
//     )
// }

export let initWhenImportScene = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getStartKeepStompEventName(), _startKeepStompHandler))
    // state = setAbstractState(state, Event.on(getAbstractState(state), getEndStompBackEventName(), _stompBackEndHandler))

    return state
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getStartKeepStompEventName(), _startKeepStompHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getEndStompBackEventName(), _stompBackEndHandler))

    return state
}