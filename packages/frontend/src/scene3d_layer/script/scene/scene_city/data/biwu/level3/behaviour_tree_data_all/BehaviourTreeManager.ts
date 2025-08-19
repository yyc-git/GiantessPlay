import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionNode as actionNodeFromState } from "../../../../type/StateType"
import * as BehaviourTreeData from "./BehaviourTreeData"
import * as BehaviourTreeManager from "../../../../behaviour_tree/BehaviourTreeManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import { state } from "../../../../../../../type/StateType"
import { setLevelData } from "../../../../CityScene"
import { hangTwoHands } from "./action_node/HangTwoHands"
import { twoHandsDefaultToOneFinger } from "./action_node/TwoHandsDefaultToOneFinger"
import { keepTwoHandsOneFinger } from "./action_node/KeepTwoHandsOneFinger"
import { hangRightHand } from "./action_node/HangRightHand"
import { rightHandDefaultToOneFinger } from "./action_node/RightHandDefaultToOneFinger"
import { keepRightHandOneFinger } from "./action_node/KeepRightHandOneFinger"
import { backRightHand } from "./action_node/BackRightHand"
import { rightHandOneFingerToDefault } from "./action_node/RightHandOneFingerToDefault"
import { backTwoHands } from "./action_node/BackTwoHands"
import { twoHandsOneFingerToDefault } from "./action_node/TwoHandsOneFingerToDefault"
import { rightHandDefaultToBeat } from "./action_node/RightHandDefaultToBeat"
import { rightHandBeatToDefault } from "./action_node/RightHandBeatToDefault"
import { keepRightHandBeat } from "./action_node/KeepRightHandBeat"
import { twoHandsDefaultToBeat } from "./action_node/TwoHandsDefaultToBeat"
import { twoHandsBeatToDefault } from "./action_node/TwoHandsBeatToDefault"
import { keepTwoHandsBeat } from "./action_node/KeepTwoHandsBeat"
import { handLeftHandRigthHand } from "./action_node/HangLeftHandRightHand"
import { backLeftHandRightHand } from "./action_node/BackLeftHandRightHand"
import { keepLeftHandRightHand } from "./action_node/KeepLeftHandRightHand"
import { rightHandDefaultToAdd } from "./action_node/RightHandDefaultToAdd"
import { rightHandAddToDefault } from "./action_node/RightHandAddToDefault"
import { keepRightHandAdd } from "./action_node/KeepRightHandAdd"
// import * as OneFingerAttack from "./action_node/OneFingerAttack"
// import { hangRightHand } from "./action_node/HangRightHand"

export let buildActionNode = (node: BehaviourTreeData.actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case BehaviourTreeData.actionNode.HangRightHand:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(hangRightHand, generateId())
            )
        case BehaviourTreeData.actionNode.HangTwoHands:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(hangTwoHands, generateId())
            )
        case BehaviourTreeData.actionNode.HangLeftHandRightHand:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(handLeftHandRigthHand, generateId())
            )
        case BehaviourTreeData.actionNode.BackRightHand:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(backRightHand, generateId())
            )
        case BehaviourTreeData.actionNode.BackTwoHands:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(backTwoHands, generateId())
            )
        case BehaviourTreeData.actionNode.BackLeftHandRightHand:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(backLeftHandRightHand, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandDefaultToAdd:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandDefaultToAdd, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandDefaultToOneFinger:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandDefaultToOneFinger, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandDefaultToBeat:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandDefaultToBeat, generateId())
            )
        case BehaviourTreeData.actionNode.TwoHandsDefaultToOneFinger:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(twoHandsDefaultToOneFinger, generateId())
            )
        case BehaviourTreeData.actionNode.TwoHandsDefaultToBeat:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(twoHandsDefaultToBeat, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandAddToDefault:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandAddToDefault, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandOneFingerToDefault:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandOneFingerToDefault, generateId())
            )
        case BehaviourTreeData.actionNode.RightHandBeatToDefault:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(rightHandBeatToDefault, generateId())
            )
        case BehaviourTreeData.actionNode.TwoHandsOneFingerToDefault:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(twoHandsOneFingerToDefault, generateId())
            )
        case BehaviourTreeData.actionNode.TwoHandsBeatToDefault:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(twoHandsBeatToDefault, generateId())
            )
        case BehaviourTreeData.actionNode.KeepRightHandAdd:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepRightHandAdd, generateId())
            )
        case BehaviourTreeData.actionNode.KeepRightHandOneFinger:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepRightHandOneFinger, generateId())
            )
        case BehaviourTreeData.actionNode.KeepRightHandBeat:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepRightHandBeat, generateId())
            )
        case BehaviourTreeData.actionNode.KeepTwoHandsOneFinger:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepTwoHandsOneFinger, generateId())
            )
        case BehaviourTreeData.actionNode.KeepTwoHandsBeat:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepTwoHandsBeat, generateId())
            )
        case BehaviourTreeData.actionNode.KeepLeftHandRightHand:
            return NullableUtils.return_(
                BehaviourTreeManager.wrapActionNode(keepLeftHandRightHand, generateId())
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
    // state = OneFingerAttack.dispose(state)

    return BehaviourTreeManager.dispose(state)
    // .then(state => {
    //     return LightStomp.dispose(state)
    // })
}