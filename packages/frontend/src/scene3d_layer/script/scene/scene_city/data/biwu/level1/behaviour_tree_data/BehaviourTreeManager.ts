import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
// import * as WalkAlong from "./action_node/WalkAlong"
import { state } from "../../../../../../../type/StateType"
import { getKey as getKeyBehaviourTreeData } from "../../../behaviour_tree_data/utils/BehaviourTreeDataUtils"
import { walkToTarget } from "../../../../behaviour_tree/action_node/WalkToTarget"
import { rest } from "../../../../behaviour_tree/action_node/Rest"
import { stomp } from "../../../../behaviour_tree/action_node/Stomp"
import { pickdown } from "../../../../behaviour_tree/action_node/Pickdown"
import { jumpStomp } from "../../../../behaviour_tree/action_node/JumpStomp"
import { stompRub } from "../../../../behaviour_tree/action_node/StompRub"
import { selectAttackAction } from "../../../../behaviour_tree/action_node/SelectAttackAction"
import { selectTarget } from "./action_node/SelectTarget"
import { getUsedGirl } from "../../../../manage/biwu/Utils"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case BehaviourTreeData.actionNode.SelectTarget:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(selectTarget, generateId())
            )

        case BehaviourTreeData.actionNode.SelectAttackAction:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(selectAttackAction, generateId())
            )

        case BehaviourTreeData.actionNode.WalkToTarget:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(walkToTarget, generateId())
            )
        case BehaviourTreeData.actionNode.Rest:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rest, generateId())
            )
        case BehaviourTreeData.actionNode.Stomp:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(stomp, generateId())
            )
        case BehaviourTreeData.actionNode.JumpStomp:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(jumpStomp, generateId())
            )
        case BehaviourTreeData.actionNode.StompRub:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(stompRub, generateId())
            )
        case BehaviourTreeData.actionNode.Pickdown:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(pickdown, generateId())
            )


        default:
            return NullableUtils.getEmpty()
    }
}

export let getKey = getKeyBehaviourTreeData

export let initWhenImportScene = (state: state) => {
    // state = LightStomp.initWhenImportScene(state)

    let usedGirl = getUsedGirl()

    state = BehaviourTreeManager.buildTree(state, usedGirl, getKey(), buildActionNode)

    return BehaviourTreeManager.initWhenImportScene(state)
}

export let getSettingFactorAffectBiggerRate = BehaviourTreeManager.getSettingFactorAffectBiggerRate

export let hasTarget = BehaviourTreeManager.hasTarget

export let getVeryNearestTargetCount = BehaviourTreeManager.getVeryNearestTargetCount

export let update = BehaviourTreeManager.update

// export let dispose = (state: state) => {
//     return BehaviourTreeManager.dispose(state).then(state => {
//         return LightStomp.dispose(state)
//     })
// }
export let dispose = BehaviourTreeManager.dispose