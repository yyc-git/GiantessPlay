import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
// import * as WalkAlong from "./action_node/WalkAlong"
import { state } from "../../../../../../../type/StateType"
import { getKey as getKeyBehaviourTreeData } from "../../../behaviour_tree_data/BehaviourTreeData"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    // switch (node) {
    //     case actionNode.WalkAlong:
    //         return NullableUtils.return_(
    //             BehaviourTreeManager.wrapActionNode(WalkAlong.walkAlong, generateId())
    //         )
    //     default:
    return BehaviourTreeManager.buildActionNode(node as any)
    // }
}

export let getKey = getKeyBehaviourTreeData

export let initWhenImportScene = (state: state) => {
    // state = LightStomp.initWhenImportScene(state)

    state = BehaviourTreeManager.buildTree(state, getKey(), buildActionNode)

    return Promise.resolve(state)
}

export let getSettingFactorAffectRate = BehaviourTreeManager.getSettingFactorAffectRate

export let hasTarget = BehaviourTreeManager.hasTarget

export let getNearestTargetCount = BehaviourTreeManager.getNearestTargetCount

export let update = BehaviourTreeManager.update

// export let dispose = (state: state) => {
//     return BehaviourTreeManager.dispose(state).then(state => {
//         return LightStomp.dispose(state)
//     })
// }
export let dispose = BehaviourTreeManager.dispose