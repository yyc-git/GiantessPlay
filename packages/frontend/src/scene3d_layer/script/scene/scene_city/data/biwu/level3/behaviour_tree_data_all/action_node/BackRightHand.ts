import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../type/StateType"
import { getLevelData, setLevelData } from "../../../../../CityScene"
import { actionNodeFunc } from "../../../../../type/StateType"
import { triggerAction } from "../../../../../behaviour_tree/action_node/Utils"
import { actionName } from "../../DataType"
import * as Girl from "../../../../../manage/biwu/Girl";
import { getCustomData, setCustomData } from "../BehaviourTreeData"
import { getKey } from "../BehaviourTreeData"

export let backRightHand: actionNodeFunc = (state, id) => {
    Console.log("backRightHand")

    return triggerAction(state, actionName.BackRightHand as any, id, Girl.triggerAction, getKey())
}