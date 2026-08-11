import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { controlNode, behaviourTreeNodeExecuteResult, behaviourTreeData, behaviourTreeNodeResult, behaviourTreeKey } from "../type/StateType"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getFinishedResult, getActionNodeId, isFinishedId, isNeedJumpToFinishedNode, isRunning, resetFinish, getActionNodeFunc } from "./BehaviourTreeManager"
import { state } from "../../../../type/StateType"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene"
import { Console } from "meta3d-jiehuo-abstract"

/*! 
        selector:
            if return success, exit and return success 
            else all: return fail
        sequence:
            if return fail, exit and return fail
            else all: return success
*/
let _controlNode = (state: state, usedGirl, key: behaviourTreeKey, children: Array<behaviourTreeData>, initialBehaviourTreeNodeExecuteResult, stopBehaviourTreeNodeExecuteResult): Promise<behaviourTreeNodeResult> => {
    requireCheck(() => {
        // test("children.length should > 0", () => {
        //     return children.length > 0
        // })
        test("check data", () => {
            return children.reduce((result, data) => {
                if (!result) {
                    return result
                }

                if (
                    !NullableUtils.isNullable(data.actionNode)
                ) {
                    return data.children.length == 0
                }

                if (
                    !NullableUtils.isNullable(data.controlNode)
                ) {
                    return data.children.length > 0
                }

                throw new Error("err")
            }, true)
        })
    }, getIsDebug(state))

    // if (isNeedJumpToFinishedNode(state)) {
    //     return ArrayUtils.reducePromise(children, ([state, result]: [state, behaviourTreeNodeExecuteResult], child) => {
    //         // if (isRunning(state)) {
    //         //     return Promise.resolve([state, result])
    //         // }
    //         if (!NullableUtils.isNullable(child.actionNode)) {
    //             let actionNode = NullableUtils.getExn(child.actionNode)

    //             if (isFinishedId(state, getActionNodeId(actionNode))) {
    //                 state = resetFinish(state)

    //                 return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    //             }

    //             return Promise.resolve([state, result])
    //         }

    //         let controlNode = NullableUtils.getExn(child.controlNode)

    //         if (isFinishedId(state, getActionNodeId(controlNode))) {
    //             state = resetFinish(state)

    //             return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    //         }

    //         return controlNode(state, child.children)

    //     }, [state, initialBehaviourTreeNodeExecuteResult])
    // }


    return ArrayUtils.reducePromise(children, ([state, result]: [state, behaviourTreeNodeExecuteResult], child) => {
        // if (isRunning(state)) {
        //     return Promise.resolve([state, result])
        // }

        if (isNeedJumpToFinishedNode(state, usedGirl, key)) {
            if (!NullableUtils.isNullable(child.actionNode)) {
                let actionNode = NullableUtils.getExn(child.actionNode)

                let actionResult
                if (isFinishedId(state, usedGirl, key, getActionNodeId(actionNode))) {
                    actionResult = getFinishedResult(state, usedGirl, key)

                    state = resetFinish(state, usedGirl, key)


                    // let actionResult = behaviourTreeNodeExecuteResult.Success

                    // if (actionResult == stopBehaviourTreeNodeExecuteResult) {
                    //     return Promise.resolve([state, actionResult])
                    // }

                    // return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
                }
                else {
                    actionResult = behaviourTreeNodeExecuteResult.Success
                }

                return Promise.resolve([state, actionResult])
            }

            let controlNode = NullableUtils.getExn(child.controlNode)

            Console.log(`jump to ${child.name}`)

            // if (isFinishedId(state, getActionNodeId(controlNode))) {
            //     state = resetFinish(state)

            //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
            // }

            return controlNode(state, key, child.children)
        }


        if (NullableUtils.getWithDefault(
            NullableUtils.map(stopBehaviourTreeNodeExecuteResult => {
                return result == stopBehaviourTreeNodeExecuteResult
            }, stopBehaviourTreeNodeExecuteResult),
            false
        )
            || isRunning(state, usedGirl, key)
        ) {
            return Promise.resolve([state, result])
        }

        if (!child.conditionReturnFail(state, usedGirl)) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        if (!child.conditionReturnSuccess(state, usedGirl)) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        }

        if (!NullableUtils.isNullable(child.actionNode)) {
            let actionNode = NullableUtils.getExn(child.actionNode)

            return getActionNodeFunc(actionNode)(state, usedGirl, getActionNodeId(actionNode), NullableUtils.map(
                config => {
                    return config(state, usedGirl)
                },
                child.config
            ))
        }

        let controlNode = NullableUtils.getExn(child.controlNode)

        Console.log(child.name)

        return controlNode(state, key, child.children)
    }, [state, initialBehaviourTreeNodeExecuteResult])
}

export let selector = (usedGirl): controlNode => (state, key, children) => {
    return _controlNode(state, usedGirl, key, children, behaviourTreeNodeExecuteResult.Fail, NullableUtils.return_(behaviourTreeNodeExecuteResult.Success))
}

export let sequence = (usedGirl): controlNode => (state, key, children) => {
    return _controlNode(state, usedGirl, key, children, behaviourTreeNodeExecuteResult.Success, NullableUtils.return_(behaviourTreeNodeExecuteResult.Fail))
}

export let parrel = (usedGirl): controlNode => (state, key, children) => {
    return _controlNode(state, usedGirl, key, children, behaviourTreeNodeExecuteResult.Fail, NullableUtils.getEmpty())
}
