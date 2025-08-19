import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { getLevelData, setLevelData } from "../../../../../CityScene"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "../../../../../type/StateType"
import { triggerAction, triggerActionWithCompleteFunc } from "../../../../../behaviour_tree/action_node/Utils"
import { actionName } from "../../DataType"
import * as Girl from "../../../../../manage/biwu/Girl";
import { attackType, getCustomData, handType, setAttackType, setCustomData } from "../BehaviourTreeData"
import { getKey } from "../BehaviourTreeData"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager"
import * as BehaviourTreeDataLeftHand from "../../behaviour_tree_data_left_hand/BehaviourTreeData"
import * as BehaviourTreeDataRightHand from "../../behaviour_tree_data_right_hand/BehaviourTreeData"

export let twoHandsDefaultToBeat: actionNodeFunc = (state, id) => {
    Console.log("twoHandsDefaultToBeat")

    return triggerActionWithCompleteFunc(state, [
        Girl.triggerAction,
        (state, id) => {
            state = setAttackType(state, handType.TwoHandsBeatAttack, attackType.BeatAttack, attackType.BeatAttack)

            return markFinish(state, id, behaviourTreeNodeExecuteResult.Success, getKey())
        }
    ], actionName.TwoHandsDefaultToBeat as any, id, getKey())
}