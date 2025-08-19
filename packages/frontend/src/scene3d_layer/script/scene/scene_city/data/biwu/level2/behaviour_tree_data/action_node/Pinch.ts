import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { lookatTarget } from "../../../../../behaviour_tree/action_node/Stomp";
import { judgeAttackRangeAndTriggerActionWithCompleteFunc, triggerAction, triggerActionWithCompleteFunc } from "../../../../../behaviour_tree/action_node/Utils";
import * as Girl from "../../../../../manage/biwu/Girl";
import { isExcitementEnough, isZeroExcitement, subExcitement } from "../../../../../girl/Excitement";
import { excitement } from "../../../../DataType";
import { hasPickData } from "../../../../../girl/PickPose";
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager";
import { getIsHit } from "./utils/QTEUtils";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";

let _trigger = (state, id, actionName_, count) => {
    return triggerActionWithCompleteFunc(state, [
        Girl.triggerAction,
        state => {
            if (getIsHit(state) || count <= 0) {
                return markFinish(state, id, behaviourTreeNodeExecuteResult.Success)
            }

            return _trigger(state, id, actionName_, count - 1)
        }
    ], actionName_, id).then(TupleUtils.getTuple2First)
}

export let pinch: actionNodeFunc = (state, id) => {
    Console.log("pinch")

    let actionName_
    actionName_ = actionName.Pinch
    // switch (getCurrentPose(state)) {
    //     case pose.Stand:
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    //     case pose.Pick:
    //         actionName_ = actionName.Pinch
    //         break
    // }

    return _trigger(state, id, actionName_, NumberUtils.getRandomInteger(2, 4)).then(state => {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    })
}