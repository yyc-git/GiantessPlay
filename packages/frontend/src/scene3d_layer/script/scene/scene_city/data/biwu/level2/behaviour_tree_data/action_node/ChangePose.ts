import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "../../../../../type/StateType"
import { actionName } from "../../DataType"

export let changePose: actionNodeFunc = (state, usedGirl, id, config) => {
    Console.log(`changePose: ${config}`)

    //     let actionName_
    //     switch (NullableUtils.getExn(config)) {
    //         case actionName.None:
    //             return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    //         default:
    //             actionName_ = NullableUtils.getExn(config)
    //             break
    //     }

    //     return triggerAction(state, usedGirl, actionName_, id)
    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}
