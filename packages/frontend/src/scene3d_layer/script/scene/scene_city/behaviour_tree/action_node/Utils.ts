import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { isTriggerAction, triggerAction as triggerGirlAction } from "../../girl/Girl"
import { attackRange, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, result, usedGirl } from "../../type/StateType"
import { getKey, getTarget, markFinish, removeId } from "../BehaviourTreeManager"
import { actionName } from "../../data/DataType"
import { id } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getPivotWorldPosition, setGirlRotationAndLock } from "../../girl/Utils"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"

let _trigger = (state: state, completeFunc, usedGirl, id, actionName_) => {
    if (!isTriggerAction(state, usedGirl, actionName_)) {
        // state = markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success)
        return completeFunc(state, id)

        // return state
    }

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return _trigger(state, completeFunc, usedGirl, id, actionName_)
    }, 5)))
}

export let triggerActionWithCompleteFunc = (state: state, [triggerGirlActionFunc, completeFunc], usedGirl: usedGirl, actionName_: actionName, id: id, key = getKey()): Promise<behaviourTreeNodeResult> => {
    // return triggerGirlActionFunc(state, actionName_, false, false).then(([state, result_]) => {
    return triggerGirlActionFunc(state, usedGirl, actionName_).then(([state, result_]) => {
        if (result_ == result.Fail) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            // return _trigger(state, completeFunc, id, actionName_).then(state => {
            //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            // })
        }

        state = markIsRunning(state, usedGirl, true, key)

        return _trigger(state, completeFunc, usedGirl, id, actionName_).then(state => {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        })
    })
}

// export let judgeAttackRangeAndTriggerAction = (state: state, actionName_: actionName, id: id, range: attackRange): Promise<behaviourTreeNodeResult> => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ getPositionFunc }) => {
//             if (!isInGirlAttackRange(state, usedGirl, getPositionFunc(state), range, NullableUtils.return_(actionName_))) {
//                 return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//             }

//             return triggerAction(state, usedGirl, actionName_, id)
//         }, getTarget(state, usedGirl)),
//         Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//     )

// }

// export let judgeAttackRangeAndTriggerActionWithCompleteFunc = (state: state, [triggerGirlActionFunc, completeFunc], actionName_: actionName, id: id, range: attackRange): Promise<behaviourTreeNodeResult> => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ getPositionFunc }) => {
//             if (!isInGirlAttackRange(state, usedGirl, getPositionFunc(state), range, NullableUtils.return_(actionName_))) {
//                 return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//             }

//             return triggerActionWithCompleteFunc(state, [triggerGirlActionFunc, completeFunc], actionName_, id)
//         }, getTarget(state, usedGirl)),
//         Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//     )
// }

export let triggerAction = (state: state, usedGirl, actionName_: actionName, id: id,
    triggerGirlActionFunc = triggerGirlAction,
    key = getKey()
): Promise<behaviourTreeNodeResult> => {
    return triggerActionWithCompleteFunc(state,
        [
            triggerGirlActionFunc,
            (state, id) => {
                return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success, key)
            }
        ],
        usedGirl,
        actionName_, id, key)
}

export let triggerActionAndNotMarkFinish = (state: state, usedGirl: usedGirl, actionName_: actionName, id: id,
    handleFailCaseFunc: any = (state) => {
        // throw new Error("error")
        return Promise.resolve(state)
    },
    triggerGirlActionFunc = triggerGirlAction,
    key = getKey()
): Promise<behaviourTreeNodeResult> => {
    return triggerActionWithCompleteFunc(state,
        [
            triggerGirlActionFunc,
            (state, id) => {
                return Promise.resolve(state)
            }
        ],
        usedGirl,
        actionName_, id, key).then(
            (data) => {
                return handleFailCase(data, handleFailCaseFunc)
            })
}

export let finish = (state, usedGirl: usedGirl, id, actionName, result = behaviourTreeNodeExecuteResult.Fail) => {
    state = removeId(state, usedGirl, actionName)

    return markFinish(state, usedGirl, id, result)
}


export let lookatTargetPosition = (state: state, handleLookatQuaternionFunc, usedGirl: usedGirl, targetPosition) => {
    let lookatQuaternion = TransformUtils.getLookatQuaternion(
        getPivotWorldPosition(state, usedGirl),
        targetPosition.clone().setY(0),
    )

    lookatQuaternion = handleLookatQuaternionFunc(state, lookatQuaternion)

    state = setGirlRotationAndLock(state, usedGirl, lookatQuaternion)

    return state
}

export let lookatTarget = (state: state, handleLookatQuaternionFunc = (state, lookatQuaternion) => lookatQuaternion, usedGirl: usedGirl) => {
    let { getPositionFunc } = NullableUtils.getExn(getTarget(state, usedGirl))

    return lookatTargetPosition(state, handleLookatQuaternionFunc, usedGirl, getPositionFunc(state))
}

export let handleFailCase = ([state, result], func: (state: state) => Promise<state>): Promise<[state, behaviourTreeNodeExecuteResult]> => {
    if (result == behaviourTreeNodeExecuteResult.Fail) {
        return func(state).then(state => [state, result])
    }

    return Promise.resolve([state, result])
}