import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, targetType } from "../../type/StateType"
import { markFinish } from "../BehaviourTreeManager"
import { Console } from "meta3d-jiehuo-abstract"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"
// import { isCanRest } from "../../../../../mod/PropOtherMod"

export let rest: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("rest")

    // if (!isCanRest(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }

    state = markIsRunning(state, usedGirl, true)

    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     return markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success)
    // }, 50))
    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success)
    }, 2))

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}