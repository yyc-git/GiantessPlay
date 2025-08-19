import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import * as BehaviourTreeData from "../../../behaviour_tree_data/BehaviourTreeData"
import { eventName } from "../GameEventData"
import { isFinish } from "../../../../scenario/Command"
import { getFightRate } from "../../Utils"
import { getLevelData, getLevelDataExn, setLevelData } from "../../../../CityScene"
import { Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { isStressingState } from "../../../../utils/FSMStateUtils"
import { getStateMachine } from "../../../../girl/FSMState"

export enum extendActionNode {
    HangRightHand,
    HangTwoHands,
    HangLeftHandRightHand,

    RightHandDefaultToOneFinger,
    RightHandDefaultToBeat,
    RightHandDefaultToAdd,

    RightHandOneFingerToDefault,
    RightHandBeatToDefault,
    RightHandAddToDefault,

    TwoHandsDefaultToOneFinger,
    TwoHandsDefaultToBeat,

    TwoHandsOneFingerToDefault,
    TwoHandsBeatToDefault,


    KeepRightHandOneFinger,
    KeepRightHandBeat,
    KeepRightHandAdd,

    KeepTwoHandsOneFinger,
    KeepTwoHandsBeat,

    KeepLeftHandRightHand,

    BackRightHand,
    BackTwoHands,
    BackLeftHandRightHand,
}

export type actionNode = BehaviourTreeData.actionNode | extendActionNode
export const actionNode = { ...BehaviourTreeData.actionNode, ...extendActionNode }




export enum handType {
    None,

    RightHandOneFingerAttack,
    RightHandBeatAttack,
    RightHandAdd,

    TwoHandsOneFingerAttack,
    TwoHandsBeatAttack,

    LeftHandRightHand,
}

export enum attackType {
    None,

    OneFingerAttack,
    BeatAttack,

    Add,

    Protect,
}

export type armyAddSingleData = {
    generateFuncs: Array<[any, Array<any>]>,
    condition: (state: state) => boolean,
    position: (state: state) => Vector3,
    rate: (state: state) => number,
    count: number,
    offset: number,
    isOnBreast: boolean,
}

export type data = {
    handType: handType,
    // attackType: attackType,

    // isHang: boolean,

    // isChangeHandType: boolean,

    rightHandAttackType: attackType,
    leftHandAttackType: attackType,

    isRightHandAction: boolean,
    isLeftHandAction: boolean,


    isCanAddFunc: (state: state) => boolean,
    armyAddData: Array<armyAddSingleData>,
    getRestRateFunc: (state: state) => number,
}

export let getKey = () => "BehaviourTreeData_all"

export let getCustomData = (state: state) => {
    return getLevelDataExn<data>(state, getKey())
}

export let setCustomData = (state: state, data: data) => {
    return setLevelData<data>(state, getKey(), data)
}

export let getHandType = (state: state) => {
    return getCustomData(state).handType
}

export let setHandType = (state: state, handType_: handType) => {
    return setCustomData(state, {
        ...getCustomData(state),
        // isChangeHandType: d.handType != handType_,
        handType: handType_,

        rightHandAttackType: attackType.None,
        leftHandAttackType: attackType.None,
    })
}

export let setAttackType = (state: state, currentHandType, leftHandAttackType, rightHandAttackType) => {
    if (isStressingState(getStateMachine(state))
        || getCustomData(state).handType != currentHandType
    ) {
        return state
    }

    return setCustomData(state, {
        ...getCustomData(state),
        rightHandAttackType,
        leftHandAttackType
    })
}

export let resetAttackType = (state: state, currentHandType) => {
    if (getCustomData(state).handType != currentHandType) {
        return state
    }

    return setCustomData(state, {
        ...getCustomData(state),
        rightHandAttackType: attackType.None,
        leftHandAttackType: attackType.None,
    })
}

export let resetLeftHandAttackType = (state: state, currentHandType) => {
    if (getCustomData(state).handType != currentHandType) {
        return state
    }

    return setCustomData(state, {
        ...getCustomData(state),
        rightHandAttackType: attackType.None,
    })
}

export let resetRightHandAttackType = (state: state, currentHandType) => {
    if (getCustomData(state).handType != currentHandType) {
        return state
    }

    return setCustomData(state, {
        ...getCustomData(state),
        rightHandAttackType: attackType.None,
    })
}

export let isHandAttacking = (state: state) => {
    let { rightHandAttackType, leftHandAttackType } = getCustomData(state)

    return rightHandAttackType != attackType.None || leftHandAttackType != attackType.None
}

export let initWhenImportScene = (state: state) => {
    state = setCustomData(state, {
        handType: handType.None,
        // isHang: false,

        // isChangeHandType: false,

        rightHandAttackType: attackType.None,
        leftHandAttackType: attackType.None,

        isRightHandAction: false,
        isLeftHandAction: false,


        isCanAddFunc: (state) => false,
        armyAddData: [],
        getRestRateFunc: (state) => 0,
    })

    return state
}

// let _isHang = (state) => {
//     return getCustomData(state).isHang
// }



export let getData = ([
]): behaviourTreeData<actionNode> => {
    return {
        returnFailCondition: (state: state) => true,

        node: controlNode.Selector,
        children: [
            {
                name: "fightAll",
                returnFailCondition: (state: state) => {
                    return !isStressingState(getStateMachine(state))
                },
                node: controlNode.Selector,
                children: [
                    {
                        name: "RightHandAdd",
                        returnFailCondition: (state: state) => {
                            let data = getCustomData(state)

                            return data.handType == handType.RightHandAdd
                            // && data.isCanAddFunc(state)
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangRightHand,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandDefaultToAdd,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepRightHandAdd,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandAddToDefault,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackRightHand,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "RightHandOneFinger",
                        returnFailCondition: (state: state) => {
                            return getCustomData(state).handType == handType.RightHandOneFingerAttack
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangRightHand,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandDefaultToOneFinger,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepRightHandOneFinger,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandOneFingerToDefault,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackRightHand,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "RightHandBeat",
                        returnFailCondition: (state: state) => {
                            return getCustomData(state).handType == handType.RightHandBeatAttack
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangRightHand,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandDefaultToBeat,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepRightHandBeat,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.RightHandBeatToDefault,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackRightHand,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "TwoHandsOneFinger",
                        returnFailCondition: (state: state) => {
                            return getCustomData(state).handType == handType.TwoHandsOneFingerAttack
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangTwoHands,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.TwoHandsDefaultToOneFinger,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepTwoHandsOneFinger,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.TwoHandsOneFingerToDefault,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackTwoHands,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "TwoHandsBeat",
                        returnFailCondition: (state: state) => {
                            return getCustomData(state).handType == handType.TwoHandsBeatAttack
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangTwoHands,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.TwoHandsDefaultToBeat,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepTwoHandsBeat,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.TwoHandsBeatToDefault,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackTwoHands,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "LeftHandRightHand",
                        returnFailCondition: (state: state) => {
                            return getCustomData(state).handType == handType.LeftHandRightHand
                        },
                        node: controlNode.Sequence,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.HangLeftHandRightHand,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.KeepLeftHandRightHand,
                                children: []
                            },
                            {
                                returnSuccessCondition: (state: state) => true,
                                node: actionNode.BackLeftHandRightHand,
                                children: []
                            },
                        ]
                    },
                ]
            },
        ]
    }
}