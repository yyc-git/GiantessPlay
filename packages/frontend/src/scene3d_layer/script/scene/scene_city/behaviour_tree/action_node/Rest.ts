import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, targetType } from "../../type/StateType"
import { markFinish } from "../BehaviourTreeManager"
import { Console } from "meta3d-jiehuo-abstract"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"

export let rest: actionNodeFunc = (state, id) => {
    Console.log("rest")

    state = markIsRunning(state, true)

    state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return markFinish(state, id, behaviourTreeNodeExecuteResult.Success)
    }, 50))

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}