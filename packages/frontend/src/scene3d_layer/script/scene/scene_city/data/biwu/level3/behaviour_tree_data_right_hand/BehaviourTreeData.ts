import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import * as BehaviourTreeData from "../../../behaviour_tree_data/BehaviourTreeData"
import * as BehaviourTreeDataAll from "../behaviour_tree_data_all/BehaviourTreeData"
import { eventName } from "../GameEventData"
import { isFinish } from "../../../../scenario/Command"
import { getFightRate, getRestRateFactor } from "../../Utils"
import { getLevelData, setLevelData } from "../../../../CityScene"
import { Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"

export enum extendActionNode {
    Add,
    OneFingerAttack,
    BeatAttack,
}

export type actionNode = BehaviourTreeData.actionNode | extendActionNode
export const actionNode = { ...BehaviourTreeData.actionNode, ...extendActionNode }




// export enum attackType {
//     None,
//     OneFinger
// }

export type data = {
    // attackType: attackType,
    // isHang: boolean,

    originBoneLocalPosition: nullable<Vector3>,
    tweens: Array<tween>,
}

export let getKey = () => "BehaviourTreeData_right_hand"

export let getCustomData = (state: state) => {
    return getLevelData<data>(state, getKey())
}

export let setCustomData = (state: state, data: data) => {
    return setLevelData<data>(state, getKey(), data)
}

export let initWhenImportScene = (state: state) => {
    state = setCustomData(state, {
        // attackType: attackType.None,
        // isHang: false,
        originBoneLocalPosition: NullableUtils.getEmpty(),
        tweens: [],
    })

    return state
}


// let _getAttackType = (state: state) => {
//     return getCustomData(state).attackType
// }

export let getData = ([
]): behaviourTreeData<actionNode> => {
    return {
        returnFailCondition: (state: state) => {
            return BehaviourTreeDataAll.getCustomData(state).rightHandAttackType != BehaviourTreeDataAll.attackType.None
        },
        node: controlNode.Selector,
        children: [
            {
                returnFailCondition: (state: state) => NumberUtils.isRandomRate(BehaviourTreeDataAll.getCustomData(state).getRestRateFunc(state) * getRestRateFactor(state)),
                node: actionNode.Rest,
                children: []
            },
            {
                name: "fightRightHand",
                returnFailCondition: (state: state) => true,
                node: controlNode.Selector,
                children: [
                    {
                        returnFailCondition: (state: state) => {
                            let data = BehaviourTreeDataAll.getCustomData(state)

                            return data.rightHandAttackType == BehaviourTreeDataAll.attackType.Add
                                && data.isCanAddFunc(state)
                        },
                        node: actionNode.Add,
                        children: []
                    },
                    {
                        returnFailCondition: (state: state) => {
                            return BehaviourTreeDataAll.getCustomData(state).rightHandAttackType == BehaviourTreeDataAll.attackType.OneFingerAttack
                        },
                        node: actionNode.OneFingerAttack,
                        children: []
                    },
                    {
                        returnFailCondition: (state: state) => {
                            return BehaviourTreeDataAll.getCustomData(state).rightHandAttackType == BehaviourTreeDataAll.attackType.BeatAttack
                        },
                        node: actionNode.BeatAttack,
                        children: []
                    },
                ]
            },
        ]
    }
}