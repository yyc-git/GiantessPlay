import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, collisionPart, damageType, result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { lookatTarget } from "../../../../../behaviour_tree/action_node/Stomp";
import { judgeAttackRangeAndTriggerActionWithCompleteFunc, lookatTargetPosition, triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import * as Girl from "../../../../../manage/biwu/Girl";
import { isExcitementEnough, isZeroExcitement, subExcitement } from "../../../../../girl/Excitement";
import { excitement } from "../../../../DataType";
import { hasPickData } from "../../../../../girl/PickPose";
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager";
import { getCenterPosition } from "../../Utils";

const _v1 = new Vector3();

export let pickdown: actionNodeFunc = (state, id) => {
    Console.log("pickdown")

    let actionName_
    actionName_ = actionName.Pickdown
    // switch (getCurrentPose(state)) {
    //     case pose.Stand:
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    //     case pose.Pick:
    //         actionName_ = actionName.Pickdown
    //         break
    // }

    state = lookatTargetPosition(state, (state, lookatQuaternion) => lookatQuaternion, _v1.fromArray(getCenterPosition()))

    return triggerAction(state, actionName_, id, Girl.triggerAction)
}