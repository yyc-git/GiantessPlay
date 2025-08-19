import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import * as BehaviourTreeData from "../../../behaviour_tree_data/BehaviourTreeData"
import { canStomp } from "./action_node/Stomp"
import { eventName } from "../GameEventData"
import { isFinish } from "../../../../scenario/Command"
import { isHard } from "../../../../manage/biwu/level2/ManageScene"
import { getFightRate } from "../../Utils"
import { canPickup } from "./action_node/Pickup"
import { getLevelData, getLevelDataExn, setLevelData } from "../../../../CityScene"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"

export enum extendActionNode {
    LightStomp = "LightStomp",

    TriggerGameEvent = "TriggerGameEvent",

    Rest = "Rest",
}

export type actionNode = BehaviourTreeData.actionNode | extendActionNode
export const actionNode = { ...BehaviourTreeData.actionNode, ...extendActionNode }


export enum phase {
    None,
    Begin,
    Hang,
    Fllow,
    Down,
    Up,
    Rub,
    Back
}


export type data = {
    tweens: Array<tween>,
    phase: phase,
    originBoneLocalPosition: nullable<Vector3>,

    moveLineLeft: number,
    activeLineLeft: number,
    isHit: boolean,
    isStart: boolean,
}

export let getKey = () => "BehaviourTreeData"

export let getCustomData = (state: state) => {
    return getLevelDataExn<data>(state, getKey())
}

export let setCustomData = (state: state, data: data) => {
    return setLevelData<data>(state, getKey(), data)
}

export let initWhenImportScene = (state: state) => {
    state = setCustomData(state, {
        tweens: [],
        phase: phase.None,
        originBoneLocalPosition: NullableUtils.getEmpty(),
        moveLineLeft: 0,
        activeLineLeft: 0,
        isHit: false,
        isStart: false,
    })

    return state
}





export let getData = ([
    getSettingFactorAffectBiggerRateFunc,
    // getSelectTargetPriorFunc,

    isRandomRateFunc,
    hasPickDataFunc,
    hasTargetFunc,
    // getGirlValueFunc,
    // getGirlScaleFunc
    isSmallGiantessFunc,
    getGirlStateFunc,
    getGirlValueFunc,
    isChangeScalingFunc,
    isPoseFunc,
    getNearestTargetCountFunc,
    // hasTargetNearFunc
]): behaviourTreeData<actionNode> => {
    return {
        returnFailCondition: (state: state) => true,

        node: controlNode.Selector,
        children: [
            {
                name: "fight",
                returnFailCondition: (state: state) => isRandomRateFunc(getFightRate(state)),
                node: controlNode.Sequence,
                children: [
                    {
                        name: "handleCase",
                        returnSuccessCondition: (state: state) => {
                            return true
                        },
                        node: controlNode.Parrel,
                        children: [
                            {
                                name: "handleMoveCollision",
                                returnSuccessCondition: (state: state) => {
                                    return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
                                },
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.Stomp,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        returnSuccessCondition: (state: state) => {
                            return !hasTargetFunc(state)
                        },
                        node: actionNode.SelectTarget,
                        children: []
                    },
                    {
                        name: "attack",
                        returnFailCondition: (state: state) => {
                            return hasTargetFunc(state)
                        },
                        node: controlNode.Selector,
                        children: [
                            {
                                returnFailCondition: (state: state) => hasPickDataFunc(state),
                                node: actionNode.Pickdown,
                                children: []
                            },
                            {
                                name: "stomp",
                                returnFailCondition: (state: state) => isRandomRateFunc(1 / 3) && canStomp(state),
                                // returnFailCondition: (state: state) => true,
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        config: (state: state) => {
                                            return attackRange.Middle
                                        },
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.WalkToTarget,
                                        children: []
                                    },
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.Stomp,
                                        children: []
                                    },
                                ]
                            },
                            {
                                name: "lightStomp",
                                returnFailCondition: (state: state) => isRandomRateFunc(3 / 4),
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        config: (state: state) => {
                                            return attackRange.Small
                                        },
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.WalkToTarget,
                                        children: []
                                    },
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.LightStomp,
                                        children: []
                                    },
                                ]
                            },
                            {
                                name: "pick",
                                returnFailCondition: (state: state) => {
                                    return canPickup(state)
                                },
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        config: (state: state) => {
                                            return attackRange.Small
                                        },
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.WalkToTarget,
                                        children: []
                                    },
                                    {
                                        returnFailCondition: (state: state) => {
                                            return true
                                        },
                                        node: actionNode.Pickup,
                                        children: []
                                    },
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.Pinch,
                                        children: []
                                    },
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.Pickdown,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                config: (state: state) => {
                    if (isHard(state)) {
                        return eventName.PickdownArmy_Hard
                    }
                    return eventName.PickdownArmy_Normal
                },
                returnFailCondition: (state: state) => !hasPickDataFunc(state) && isFinish(state) && isRandomRateFunc(1 / 5),
                // returnFailCondition: (state: state) => true,
                node: actionNode.TriggerGameEvent,
                children: []
            },
            {
                returnFailCondition: (state: state) => true,
                node: actionNode.Rest,
                children: []
            }
        ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         returnFailCondition: (state: state) => isRandomRateFunc(getFightRate(state)),
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 name: "handleCase",
        //                 returnSuccessCondition: (state: state) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         returnSuccessCondition: (state: state) => {
        //                             return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasTargetFunc(state)
        //                 },
        //                 node: actionNode.SelectTarget,
        //                 children: []
        //             },
        //             {
        //                 name: "attack",
        //                 returnFailCondition: (state: state) => {
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         returnFailCondition: (state: state) => hasPickDataFunc(state),
        //                         node: actionNode.Pickdown,
        //                         children: []
        //                     },
        //                     {
        //                         name: "pick",
        //                         returnFailCondition: (state: state) => {
        //                             return true
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state) => {
        //                                     return attackRange.Small
        //                                 },
        //                                 returnFailCondition: (state: state) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 returnFailCondition: (state: state) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             // {
        //                             //     returnFailCondition: (state: state) => true,
        //                             //     node: actionNode.Pinch,
        //                             //     children: []
        //                             // },
        //                             {
        //                                 returnFailCondition: (state: state) => true,
        //                                 node: actionNode.Pickdown,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        // ]

    }
}