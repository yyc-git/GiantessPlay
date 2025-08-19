import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { lookatTarget } from "../../../../../behaviour_tree/action_node/Stomp";
import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import * as Girl from "../../../../../manage/biwu/Girl";
import { isExcitementEnough, isZeroExcitement, subExcitement } from "../../../../../girl/Excitement";
import { excitement } from "../../../../DataType";

const _v1 = /*@__PURE__*/ new Vector3();

let _getExcitement = () => {
    return excitement.VeryHigh
}

export let canStomp = (state) => {
    return isExcitementEnough(state, _getExcitement())
}

export let stomp: actionNodeFunc = (state, id) => {
    Console.log("stomp")

    let actionName_ = actionName.Stomp

    if (!canStomp(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    state = lookatTarget(state)

    state = subExcitement(state, _getExcitement())

    return triggerAction(state, actionName_, id, Girl.triggerAction)
}
