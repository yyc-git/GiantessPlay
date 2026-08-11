import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
// import * as BehaviourTreeManager from "../../../../behaviour_tree/BE"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import * as LightStomp from "./action_node/LightStomp"
import { state } from "../../../../../../../type/StateType"
// import { selectTarget } from "./action_node/utils/GiantessSelectTargetUtils"
import { triggerGameEvent } from "./action_node/TriggerGameEvent"
import { pickup } from "./action_node/Pickup"
import { pinch } from "./action_node/Pinch"
import { pickdown } from "./action_node/Pickdown"
import { getKey as getKeyBehaviourTreeData } from "../../../behaviour_tree_data/utils/BehaviourTreeDataUtils"
import { walkToTarget } from "../../../../behaviour_tree/action_node/WalkToTarget"
import { rest } from "../../../../behaviour_tree/action_node/Rest"
import { jumpStomp } from "../../../../behaviour_tree/action_node/JumpStomp"
import { stompRub } from "../../../../behaviour_tree/action_node/StompRub"
import { selectAttackAction } from "../../../../behaviour_tree/action_node/SelectAttackAction"
import { changePose } from "./action_node/ChangePose"
import { selectTarget } from "./action_node/SelectTarget"
import { stomp } from "../../../../behaviour_tree/action_node/Stomp"
import { getUsedGirl } from "../../../../manage/biwu/Utils"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case BehaviourTreeData.actionNode.SelectAttackAction:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(selectAttackAction, generateId())
            )
        case BehaviourTreeData.actionNode.ChangePose:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(changePose, generateId())
            )


        case BehaviourTreeData.actionNode.LightStomp:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(LightStomp.lightStomp, generateId())
            )
        case BehaviourTreeData.actionNode.WalkToTarget:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(walkToTarget, generateId())
            )
        case BehaviourTreeData.actionNode.SelectTarget:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(selectTarget, generateId())
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


        case BehaviourTreeData.actionNode.Pickup:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(pickup, generateId())
            )
        case BehaviourTreeData.actionNode.Pinch:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(pinch, generateId())
            )
        case BehaviourTreeData.actionNode.Pickdown:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(pickdown, generateId())
            )

        case BehaviourTreeData.actionNode.TriggerGameEvent:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(triggerGameEvent, generateId())
            )

        case BehaviourTreeData.actionNode.Rest:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rest, generateId())
            )
        default:
            // return BehaviourTreeManager.buildActionNode(node as any)
            return NullableUtils.getEmpty()
    }
}

export let getKey = getKeyBehaviourTreeData

export let initWhenImportScene = (state: state) => {
    // if (isGiantessCharacterType(state)) {
    //     return Promise.resolve(state)
    // }

    let usedGirl = getUsedGirl()

    state = BehaviourTreeData.initWhenImportScene(state)

    state = LightStomp.initWhenImportScene(state)

    state = BehaviourTreeManager.buildTree(state, usedGirl, getKey(), buildActionNode)

    return BehaviourTreeManager.initWhenImportScene(state)
}

export let getSettingFactorAffectBiggerRate = BehaviourTreeManager.getSettingFactorAffectBiggerRate

export let hasTarget = BehaviourTreeManager.hasTarget

export let getVeryNearestTargetCount = BehaviourTreeManager.getVeryNearestTargetCount

export let update = BehaviourTreeManager.update

export let dispose = (state: state) => {
    return BehaviourTreeManager.dispose(state).then(state => {
        return LightStomp.dispose(state)
    })
}

export let stop = (state: state) => {
    let usedGirl = getUsedGirl()

    return BehaviourTreeManager.stop(state, usedGirl).then(state => {
        return LightStomp.stop(state)
    })
}