import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { isTriggerAction, triggerAction as triggerGirlAction } from "../../girl/Girl"
import { attackRange, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, result } from "../../type/StateType"
import { getKey, getTarget, markFinish } from "../BehaviourTreeManager"
import { actionName } from "../../data/DataType"
import { id } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getPivotWorldPosition, setGirlRotationAndLock } from "../../girl/Utils"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"

let _trigger = (state: state, completeFunc, id, actionName_) => {
    if (!isTriggerAction(state, actionName_)) {
        // state = markFinish(state, id, behaviourTreeNodeExecuteResult.Success)
        return completeFunc(state, id)

        // return state
    }

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return _trigger(state, completeFunc, id, actionName_)
    }, 5)))
}

export let triggerActionWithCompleteFunc = (state: state, [triggerGirlActionFunc, completeFunc], actionName_: actionName, id: id, key = getKey()): Promise<behaviourTreeNodeResult> => {
    return triggerGirlActionFunc(state, actionName_).then(([state, result_]) => {
        if (result_ == result.Fail) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        state = markIsRunning(state, true, key)

        return _trigger(state, completeFunc, id, actionName_).then(state => {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        })
    })
}

export let judgeAttackRangeAndTriggerAction = (state: state, actionName_: actionName, id: id, range: attackRange): Promise<behaviourTreeNodeResult> => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ getPositionFunc }) => {
            if (!isInGirlAttackRange(state, getPositionFunc(state), range, NullableUtils.return_(actionName_))) {
                return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            }

            return triggerAction(state, actionName_, id)
        }, getTarget(state)),
        Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    )

}

export let judgeAttackRangeAndTriggerActionWithCompleteFunc = (state: state, [triggerGirlActionFunc, completeFunc], actionName_: actionName, id: id, range: attackRange): Promise<behaviourTreeNodeResult> => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ getPositionFunc }) => {
            if (!isInGirlAttackRange(state, getPositionFunc(state), range, NullableUtils.return_(actionName_))) {
                return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            }

            return triggerActionWithCompleteFunc(state, [triggerGirlActionFunc, completeFunc], actionName_, id)
        }, getTarget(state)),
        Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    )
}

export let triggerAction = (state: state, actionName_: actionName, id: id,
    triggerGirlActionFunc = triggerGirlAction,
    key = getKey()
): Promise<behaviourTreeNodeResult> => {
    return triggerActionWithCompleteFunc(state,
        [
            triggerGirlActionFunc,
            (state, id) => {
                return markFinish(state, id, behaviourTreeNodeExecuteResult.Success, key)
            }
        ],
        actionName_, id, key)
}

export let lookatTargetPosition = (state: state, handleLookatQuaternionFunc, targetPosition) => {
    let lookatQuaternion = TransformUtils.getLookatQuaternion(
        getPivotWorldPosition(state),
        targetPosition.clone().setY(0),
    )

    lookatQuaternion = handleLookatQuaternionFunc(state, lookatQuaternion)

    state = setGirlRotationAndLock(state, lookatQuaternion)

    return state
}

export let lookatTarget = (state: state, handleLookatQuaternionFunc = (state, lookatQuaternion) => lookatQuaternion) => {
    let { getPositionFunc } = NullableUtils.getExn(getTarget(state))

    return lookatTargetPosition(state, handleLookatQuaternionFunc, getPositionFunc(state))
}