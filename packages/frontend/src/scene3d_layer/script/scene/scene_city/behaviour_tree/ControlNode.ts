import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { controlNode, behaviourTreeNodeExecuteResult, behaviourTreeData, behaviourTreeNodeResult, behaviourTreeKey } from "../type/StateType"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getFinishedResult, getActionNodeId, isFinishedId, isNeedJumpToFinishedNode, isRunning, resetFinish, getActionNodeFunc } from "./BehaviourTreeManager"
import { state } from "../../../../type/StateType"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene"
import { Console } from "meta3d-jiehuo-abstract"

let _controlNode = (state: state, key: behaviourTreeKey, children: Array<behaviourTreeData>, initialBehaviourTreeNodeExecuteResult, stopBehaviourTreeNodeExecuteResult): Promise<behaviourTreeNodeResult> => {
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

        if (isNeedJumpToFinishedNode(state, key)) {
            if (!NullableUtils.isNullable(child.actionNode)) {
                let actionNode = NullableUtils.getExn(child.actionNode)

                let actionResult
                if (isFinishedId(state, key, getActionNodeId(actionNode))) {
                    actionResult = getFinishedResult(state, key)

                    state = resetFinish(state, key)


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
            || isRunning(state, key)
        ) {
            return Promise.resolve([state, result])
        }

        if (!child.returnFailCondition(state)) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        }

        if (!child.returnSuccessCondition(state)) {
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        }

        if (!NullableUtils.isNullable(child.actionNode)) {
            let actionNode = NullableUtils.getExn(child.actionNode)

            return getActionNodeFunc(actionNode)(state, getActionNodeId(actionNode), NullableUtils.map(
                config => {
                    return config(state)
                },
                child.config
            ))
        }

        let controlNode = NullableUtils.getExn(child.controlNode)

        Console.log(child.name)

        return controlNode(state, key, child.children)
    }, [state, initialBehaviourTreeNodeExecuteResult])
}

export let selector: controlNode = (state, key, children) => {
    return _controlNode(state, key, children, behaviourTreeNodeExecuteResult.Fail, NullableUtils.return_(behaviourTreeNodeExecuteResult.Success))
}

export let sequence: controlNode = (state, key, children) => {
    return _controlNode(state, key, children, behaviourTreeNodeExecuteResult.Success, NullableUtils.return_(behaviourTreeNodeExecuteResult.Fail))
}

export let parrel: controlNode = (state, key, children) => {
    return _controlNode(state, key, children, behaviourTreeNodeExecuteResult.Fail, NullableUtils.getEmpty())
}
