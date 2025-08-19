import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { lookatTarget } from "../../../../../behaviour_tree/action_node/Stomp";
import { judgeAttackRangeAndTriggerActionWithCompleteFunc, triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import * as Girl from "../../../../../manage/biwu/Girl";
import { isExcitementEnough, isZeroExcitement, subExcitement } from "../../../../../girl/Excitement";
import { excitement } from "../../../../DataType";
import { hasPickData } from "../../../../../girl/PickPose";
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager";
import { startQTE } from "./utils/QTEUtils";

let _getExcitement = () => {
    return excitement.Middle
    // return 0
}

export let canPickup = (state) => {
    return isExcitementEnough(state, _getExcitement())
}

export let pickup: actionNodeFunc = (state, id) => {
    Console.log("pickup")

    if (!canPickup(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    if (hasPickData(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    }

    // if (!_isTargetValid(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }

    let actionName_
    actionName_ = actionName.Pickup
    // switch (getCurrentPose(state)) {
    //     case pose.Stand:
    //         actionName_ = actionName.Pickup
    //         break
    //     case pose.Pick:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }

    state = lookatTarget(state)

    state = subExcitement(state, _getExcitement())

    return judgeAttackRangeAndTriggerActionWithCompleteFunc(state,
        [
            Girl.triggerAction,
            (state, id) => {
                if (!hasPickData(state)) {
                    return markFinish(state, id, behaviourTreeNodeExecuteResult.Fail)
                }

                return startQTE(state).then(state => {
                    return markFinish(state, id, behaviourTreeNodeExecuteResult.Success)
                })
            },
        ],
        // actionName_, id, attackRange.Small)
        actionName_, id, attackRange.Middle)
}
