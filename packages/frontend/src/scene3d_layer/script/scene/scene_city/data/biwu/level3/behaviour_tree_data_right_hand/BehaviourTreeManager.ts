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
import { getUsedGirl } from "../../../../manage/biwu/Utils"

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
            // return BehaviourTreeManager.buildActionNode(node as any)
            return NullableUtils.getEmpty()
    }
}

export let initWhenImportScene = (state: state) => {
    let usedGirl = getUsedGirl()
    state = BehaviourTreeData.initWhenImportScene(state)

    // state = OneFingerAttack.initWhenImportScene(state)



    state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeData.getKey(), buildActionNode)

    return BehaviourTreeManager.initWhenImportScene(state)
}

// export let getSettingFactorAffectBiggerRate = BehaviourTreeManager.getSettingFactorAffectBiggerRate

// export let hasTarget = BehaviourTreeManager.hasTarget

// export let getVeryNearestTargetCount = BehaviourTreeManager.getVeryNearestTargetCount

export let update = state => BehaviourTreeManager.update(state, BehaviourTreeData.getKey())

export let dispose = (state: state) => {
    let usedGirl = getUsedGirl()
    state = OneFingerAttack.dispose(state, usedGirl)
    state = BeatAttack.dispose(state, usedGirl)
    state = Add.dispose(state, usedGirl)

    return BehaviourTreeManager.dispose(state)
    // .then(state => {
    //     return LightStomp.dispose(state)
    // })
}