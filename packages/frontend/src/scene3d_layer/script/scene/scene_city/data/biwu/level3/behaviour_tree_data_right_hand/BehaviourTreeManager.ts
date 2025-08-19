import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import { state } from "../../../../../../../type/StateType"
import { setLevelData } from "../../../../CityScene"
import * as Add from "./action_node/Add"
import * as OneFingerAttack from "./action_node/OneFingerAttack"
import * as BeatAttack from "./action_node/BeatAttack"
import { rest } from "./action_node/Rest"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case BehaviourTreeData.actionNode.Add:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(Add.add, generateId())
            )
        case BehaviourTreeData.actionNode.OneFingerAttack:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(OneFingerAttack.oneFingerAttack, generateId())
            )
        case BehaviourTreeData.actionNode.BeatAttack:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(BeatAttack.beatAttack, generateId())
            )
        case BehaviourTreeData.actionNode.Rest:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rest, generateId())
            )
        default:
            return BehaviourTreeManager.buildActionNode(node as any)
    }
}

export let initWhenImportScene = (state: state) => {
    state = BehaviourTreeData.initWhenImportScene(state)

    // state = OneFingerAttack.initWhenImportScene(state)



    state = BehaviourTreeManager.buildTree(state, BehaviourTreeData.getKey(), buildActionNode)

    return Promise.resolve(state)
}

// export let getSettingFactorAffectRate = BehaviourTreeManager.getSettingFactorAffectRate

// export let hasTarget = BehaviourTreeManager.hasTarget

// export let getNearestTargetCount = BehaviourTreeManager.getNearestTargetCount

export let update = state => BehaviourTreeManager.update(state, BehaviourTreeData.getKey())

export let dispose = (state: state) => {
    state = OneFingerAttack.dispose(state)
    state = BeatAttack.dispose(state)
    state = Add.dispose(state)

    return BehaviourTreeManager.dispose(state)
    // .then(state => {
    //     return LightStomp.dispose(state)
    // })
}