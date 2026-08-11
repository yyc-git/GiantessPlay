import { actionNode, actionNodeFunc, attackAction, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, isMiddleGiantess, isBigGiantess } from "../../girl/Utils"
import * as BehaviourTreeManager from "../BehaviourTreeManager"
import { Console } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"

// export let selectAttackAction: actionNodeFunc = (state, usedGirl, id ) => {
//     Console.log("selectAttackAction")

//     let attackActions
//     if (BehaviourTreeManager.isBuildingTarget(state, usedGirl)) {
//         if (isBigGiantess(state, usedGirl)) {
//             attackActions = [
//                 attackAction.BreastPress,
//                 attackAction.Stomp,
//             ]
//         }
//         else {
//             attackActions = [
//                 attackAction.Stomp,
//             ]
//         }
//     }
//     else {
//         attackActions = [
//             attackAction.Stomp,
//             attackAction.BreastPress,
//             attackAction.Pinch,
//             attackAction.Eat,
//         ]
//     }

//     state = BehaviourTreeManager.setAttackAction(state, ArrayUtils.randomShuffle(attackActions)[0])

//     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
// }

export let selectAttackAction: actionNodeFunc = (state, usedGirl, id, config) => {
    Console.log(`selectAttackAction: ${config}`)

    let attackAction = NullableUtils.getExn(config)

    state = BehaviourTreeManager.setAttackAction(state, usedGirl, attackAction)

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}
