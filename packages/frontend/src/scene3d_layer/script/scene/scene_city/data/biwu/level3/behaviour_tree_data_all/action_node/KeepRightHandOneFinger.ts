import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { getLevelData, setLevelData } from "../../../../../CityScene"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, result } from "../../../../../type/StateType"
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils"
import { actionName } from "../../DataType"
// import * as Girl from "../../../../../manage/biwu/Girl";
// import { getCustomData, setCustomData } from "../BehaviourTreeData"
import { triggerAction } from "../../../../../manage/biwu/Girl"
import { markIsRunning } from "../../../../../utils/BehaviourManagerUtils"
import { getIdExn, markFinish, setId } from "../../../../../behaviour_tree/BehaviourTreeManager"
import { getKey } from "../BehaviourTreeData"
import { attackType, getCustomData } from "../BehaviourTreeData"
import { getAbstractState, setAbstractState } from "../../../../../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"

let _waitForFinish = (state: state) => {
    let { rightHandAttackType, isRightHandAction } = getCustomData(state)
    if (rightHandAttackType == attackType.None && !isRightHandAction) {
        return markFinish(state, getIdExn(state, actionName.RightHand), behaviourTreeNodeExecuteResult.Success, getKey())
    }

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return _waitForFinish(state)
    }, 5)))
}

export let keepRightHandOneFinger: actionNodeFunc = (state, id) => {
    Console.log("keepRightHandOneFinger")

    return triggerAction(state, actionName.KeepRightHandOneFinger as any).then(([state, result_]) => {
        if (result_ == result.Fail) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        state = setId(state, actionName.RightHand, id)

        state = markIsRunning(state, true, getKey())

        return _waitForFinish(state).then(state => {
            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    })
}