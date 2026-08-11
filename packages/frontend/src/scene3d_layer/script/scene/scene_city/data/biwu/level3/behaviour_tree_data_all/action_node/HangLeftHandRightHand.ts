import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { getLevelData, setLevelData } from "../../../../../CityScene"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "../../../../../type/StateType"
import { triggerAction, triggerActionWithCompleteFunc } from "../../../../../behaviour_tree/action_node/Utils"
import { actionName } from "../../DataType"
import * as Girl from "../../../../../manage/biwu/Girl";
import { attackType, getCustomData, handType, setAttackType, setCustomData } from "../BehaviourTreeData"
import { getKey } from "../BehaviourTreeData"
import { markFinish } from "../../../../../behaviour_tree/BehaviourTreeManager"

export let handLeftHandRigthHand: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("handLeftHandRigthHand")

    return triggerActionWithCompleteFunc(state, [
        Girl.triggerAction,
        (state, id) => {
            state = setAttackType(state, usedGirl, handType.LeftHandRightHand, attackType.Protect, attackType.BeatAttack)

            return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success, getKey())
        }
    ], usedGirl, actionName.HangLeftHandRightHand as any, id, getKey())
}