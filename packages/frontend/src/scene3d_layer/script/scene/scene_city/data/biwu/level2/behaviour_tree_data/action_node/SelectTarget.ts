import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
// import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
// import { triggerAction } from "../../../../../manage/biwu/Girl";
import { state } from "../../../../../../../../type/StateType";
import * as LittleManTransform from "../../../../../little_man/Transform";
import * as LittleMan from "../../../../../little_man/LittleMan";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils";
import { selectLittleMan } from "../../../../../behaviour_tree/action_node/SelectTarget";


const _v1 = /*@__PURE__*/ new Vector3();

export let selectTarget: actionNodeFunc = (state, id) => {
    Console.log("selectTarget")

    return selectLittleMan(state, false)
}
