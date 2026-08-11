import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { getLevelData, setLevelData } from "../../../../../CityScene"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "../../../../../type/StateType"
import { triggerAction, triggerActionWithCompleteFunc } from "../../../../../behaviour_tree/action_node/Utils"
import { actionName } from "../../DataType"
import * as Girl from "../../../../../manage/biwu/Girl";
import { attackType, getCustomData, handType, resetAttackType, setCustomData } from "../BehaviourTreeData"
import { getKey } from "../BehaviourTreeData"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager"
// import * as BehaviourTreeDataLeftHand from "../../behaviour_tree_data_left_hand/BehaviourTreeData"
// import * as BehaviourTreeDataRightHand from "../../behaviour_tree_data_right_hand/BehaviourTreeData"

export let twoHandsOneFingerToDefault: actionNodeFunc = (state, usedGirl, id ) => {
    Console.log("twoHandsOneFingerToDefault")

    return triggerActionWithCompleteFunc(state, [
        Girl.triggerAction,
        (state, id) => {
            state = resetAttackType(state, handType.TwoHandsOneFingerAttack)

            return markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success, getKey())
        }
    ], usedGirl, actionName.TwoHandsOneFingerToDefault as any, id, getKey())
}