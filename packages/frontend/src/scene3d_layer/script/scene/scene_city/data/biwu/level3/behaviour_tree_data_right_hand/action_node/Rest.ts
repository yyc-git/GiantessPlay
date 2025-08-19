import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../../state/State"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, targetType } from "../../../../../type/StateType"
import { Console } from "meta3d-jiehuo-abstract"
import { markIsRunning } from "../../../../../utils/BehaviourManagerUtils"
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager"
import { getKey } from "../BehaviourTreeData"

export let rest: actionNodeFunc = (state, id) => {
    Console.log("rest")

    state = markIsRunning(state, true, getKey())

    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        return markFinish(state, id, behaviourTreeNodeExecuteResult.Success, getKey())
    }, 2))

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}