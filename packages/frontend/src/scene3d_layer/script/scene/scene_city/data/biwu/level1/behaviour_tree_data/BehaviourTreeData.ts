import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import { getFightRate } from "../../Utils"

export enum actionNode {
    WalkToTargetPosition = "WalkToTargetPosition",

    // SelectTarget = "SelectTarget",

    WalkToTarget = "WalkToTarget",
    Stomp = "Stomp",
    // BreastPress = "BreastPress",

    // Pickup = "Pickup",
    // Pinch = "Pinch",
    // Eat = "Eat",
    Pickdown = "Pickdown",

    // ChangePose = "ChangePose",

    // Bigger = "Bigger",

    Rest = "Rest",


    // ClearTarget = "ClearTarget",
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
                        name: "moveToTarget",
                        // returnSuccessCondition: (state: state) => {
                        //     // return !hasPickDataFunc(state)
                        //     return true
                        // },
                        returnFailCondition: (state: state) => {
                            // return hasTargetFunc(state) || !isChangeScalingFunc(state)
                            // return hasTargetFunc(state)
                            return true
                        },
                        node: controlNode.Selector,
                        children: [
                            // {
                            //     config: attackRange.Middle,
                            //     returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                            //     node: actionNode.WalkToTarget,
                            //     children: []
                            // },
                            {
                                config: (state: state) => {
                                    // if (isRandomRateFunc(1 / 2)) {
                                    //     return attackRange.Middle
                                    // }
                                    // return attackRange.Small
                                    return attackRange.Middle
                                },
                                returnFailCondition: (state: state) => true,
                                node: actionNode.WalkToTarget,
                                children: []
                            },
                        ]
                    },
                    {
                        name: "attack",
                        returnFailCondition: (state: state) => {
                            // return hasTargetFunc(state)
                            return true
                        },
                        node: controlNode.Selector,
                        children: [
                            {
                                returnFailCondition: (state: state) => {
                                    return true
                                },
                                node: actionNode.Stomp,
                                children: []
                            },
                        ]
                    },
                ]
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
        //         returnFailCondition: (state: state) => true,
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
        //                 name: "moveToTarget",
        //                 // returnSuccessCondition: (state: state) => {
        //                 //     // return !hasPickDataFunc(state)
        //                 //     return true
        //                 // },
        //                 returnFailCondition: (state: state) => {
        //                     // return hasTargetFunc(state) || !isChangeScalingFunc(state)
        //                     // return hasTargetFunc(state)
        //                     return true
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     // {
        //                     //     config: attackRange.Middle,
        //                     //     returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                     //     node: actionNode.WalkToTarget,
        //                     //     children: []
        //                     // },
        //                     {
        //                         config: (state: state) => {
        //                             // if (isRandomRateFunc(1 / 2)) {
        //                             //     return attackRange.Middle
        //                             // }
        //                             // return attackRange.Small
        //                             return attackRange.Middle
        //                         },
        //                         returnFailCondition: (state: state) => true,
        //                         node: actionNode.WalkToTarget,
        //                         children: []
        //                     },
        //                 ]
        //             },
        //             {
        //                 name: "attack",
        //                 returnFailCondition: (state: state) => {
        //                     // return hasTargetFunc(state)
        //                     return true
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         returnFailCondition: (state: state) => {
        //                             return true
        //                         },
        //                         node: actionNode.Stomp,
        //                         children: []
        //                     },
        //                 ]
        //             },
        //         ]
        //     },
        //     {
        //         returnFailCondition: (state: state) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]


    }
}