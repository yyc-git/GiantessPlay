import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
// import * as BehaviourTreeManager from "../../../../behaviour_tree/BE"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import * as LightStomp from "./action_node/LightStomp"
import { state } from "../../../../../../../type/StateType"
import { selectTarget } from "./action_node/SelectTarget"
import { stomp } from "./action_node/Stomp"
import { triggerGameEvent } from "./action_node/TriggerGameEvent"
import { pickup } from "./action_node/Pickup"
import { pinch } from "./action_node/Pinch"
import { pickdown } from "./action_node/Pickdown"
import { getKey as getKeyBehaviourTreeData } from "../../../behaviour_tree_data/BehaviourTreeData"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case BehaviourTreeData.actionNode.LightStomp:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(LightStomp.lightStomp, generateId())
            )
        case BehaviourTreeData.actionNode.SelectTarget:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(selectTarget, generateId())
            )
        case BehaviourTreeData.actionNode.Stomp:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(stomp, generateId())
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
        default:
            return BehaviourTreeManager.buildActionNode(node as any)
    }
}

export let getKey = getKeyBehaviourTreeData

export let initWhenImportScene = (state: state) => {
    // if (isGiantessRoad(state)) {
    //     return Promise.resolve(state)
    // }

    state = BehaviourTreeData.initWhenImportScene(state)

    state = LightStomp.initWhenImportScene(state)

    state = BehaviourTreeManager.buildTree(state, getKey(), buildActionNode)

    return Promise.resolve(state)
}

export let getSettingFactorAffectRate = BehaviourTreeManager.getSettingFactorAffectRate

export let hasTarget = BehaviourTreeManager.hasTarget

export let getNearestTargetCount = BehaviourTreeManager.getNearestTargetCount

export let update = BehaviourTreeManager.update

export let dispose = (state: state) => {
    return BehaviourTreeManager.dispose(state).then(state => {
        return LightStomp.dispose(state)
    })
}