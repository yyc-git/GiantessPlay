import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, autoDifficulty, pose, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import { getNow } from "../../../../Time"
import { getAutoDifficulty } from "../../../../difficulty/Difficulty"
import { getModAPI } from "../../../../Mod"
import { readState } from "../../../../../../../state/State"
import { convertAutoDifficultyToRate } from "../../../../difficulty/DifficultyUtils"

export enum attackAction {
    None = "None",

    Rest = "Rest",

    Stomp = "Stomp",
    StompRub = "StompRub",
    // LeftStomp = "LeftStomp",
    JumpStomp = "JumpStomp",

}

export enum actionNode {
    SelectAttackAction = "SelectAttackAction",

    WalkToTargetPosition = "WalkToTargetPosition",

    SelectTarget = "SelectTarget",

    WalkToTarget = "WalkToTarget",

    Stomp = "Stomp",
    StompRub = "StompRub",
    // LeftStomp = "LeftStomp",
    JumpStomp = "JumpStomp",

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


export let getFightRate = (state: state) => {
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            return 1 / 6
        case autoDifficulty.Easy:
            return 1 / 5
        case autoDifficulty.Middle:
        case autoDifficulty.Hard:
            return 1 / 4
        case autoDifficulty.VeryHard:
        case autoDifficulty.VeryHard1:
        case autoDifficulty.VeryHard2:
        case autoDifficulty.VeryHard3:
            return 1 / 3
        case autoDifficulty.VeryHard4:
        case autoDifficulty.VeryHard5:
            return 1 / 2
    }
}


export let getData = ([
    getSettingFactorAffectBiggerRateFunc,
    // getSelectTargetPriorFunc,

    isRandomRateFunc,
    hasPickDataFunc,
    hasTargetFunc,
    // getGirlValueFunc,
    // getGirlScaleFunc
    // isSmallGiantessFunc,
    getGirlStateFunc,
    getGirlValueFunc,
    isChangeScalingFunc,
    isPoseFunc,
    getVeryNearestTargetCountFunc,
    // hasTargetNearFunc
]): behaviourTreeData<actionNode> => {
    let api = getModAPI(readState())

    return {
        conditionReturnFail: (state: state, usedGirl) => true,

        node: controlNode.Selector,
        children: [
            {
                name: "handleCase",
                conditionReturnFail: (state: state, usedGirl) => {
                    return true
                },
                node: controlNode.Parrel,
                children: [
                    {
                        name: "handleMoveCollision",
                        // conditionReturnSuccess: (state: state, usedGirl) => {
                        conditionReturnFail: (state: state, usedGirl) => {
                            return api.getNow(state) - api.getUsedGirlData(state, usedGirl).lastMoveCollisionedTime < 1000
                        },
                        // node: controlNode.Sequence,
                        node: controlNode.Selector,
                        children: [
                            {
                                conditionReturnFail: (state: state, usedGirl) => api.isPose(state, pose.Stand) && api.hasTarget(state, usedGirl),
                                node: actionNode.Stomp,
                                children: []
                            },
                        ]
                    },
                ]
            },
            {
                name: "fight",
                // conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(getFightRate(state)),
                conditionReturnFail: (state: state, usedGirl) => true,
                node: controlNode.Parrel,
                children: [
                    // {
                    //     name: "moveToTarget",
                    //     // conditionReturnSuccess: (state: state, usedGirl) => {
                    //     //     // return !hasPickDataFunc(state, usedGirl)
                    //     //     return true
                    //     // },
                    //     conditionReturnFail: (state: state, usedGirl) => {
                    //         // return hasTargetFunc(state) || !isChangeScalingFunc(state)
                    //         // return hasTargetFunc(state)
                    //         return true
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         // {
                    //         //     config: attackRange.Middle,
                    //         //     conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 2),
                    //         //     node: actionNode.WalkToTarget,
                    //         //     children: []
                    //         // },
                    //         {
                    //             config: (state: state, usedGirl) => {
                    //                 // if (isRandomRateFunc(1 / 2)) {
                    //                 //     return attackRange.Middle
                    //                 // }
                    //                 // return attackRange.Small
                    //                 return attackRange.PrecisionStompRange
                    //             },
                    //             conditionReturnFail: (state: state, usedGirl) => true,
                    //             node: actionNode.WalkToTarget,
                    //             children: []
                    //         },
                    //     ]
                    // },
                    // {
                    //     name: "attack",
                    //     conditionReturnFail: (state: state, usedGirl) => {
                    //         // return hasTargetFunc(state)
                    //         return true
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnFail: (state: state, usedGirl) => {
                    //                 return true
                    //             },
                    //             node: actionNode.Stomp,
                    //             children: []
                    //         },
                    //     ]
                    // },
                    {
                        // name: "selectTarget",
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return !api.hasTarget(state, usedGirl)
                        },
                        node: actionNode.SelectTarget,
                        children: []
                    },
                    {
                        config: (state: state, usedGirl) => {
                            let firstLayerRateArr
                            // let armyFactor, hpFactor

                            if (api.isRandomRate(1 - getFightRate(state))) {
                                return attackAction.Rest
                            }

                            firstLayerRateArr = [1, 0.5 * convertAutoDifficultyToRate(state), 1]

                            return api.selectOneByWeight(api, [
                                attackAction.StompRub,
                                // attackAction.LeftStomp,
                                attackAction.JumpStomp,
                                attackAction.Stomp
                            ],
                                firstLayerRateArr,
                            )
                        },
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return api.hasTarget(state, usedGirl)
                        },
                        node: actionNode.SelectAttackAction,
                        children: []
                    },
                    {
                        name: "action",
                        conditionReturnSuccess: (state: state, usedGirl) => true,
                        node: controlNode.Selector,
                        children: [
                            {
                                conditionReturnFail: (state: state, usedGirl) => api.getAttackAction(state, usedGirl) == attackAction.Rest,
                                node: actionNode.Rest,
                                children: []
                            },
                            {
                                name: "moveAndAttack",
                                conditionReturnSuccess: (state: state, usedGirl) => api.hasTarget(state, usedGirl),
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        config: (state: state, usedGirl) => {
                                            switch (api.getAttackAction(state, usedGirl)) {
                                                case attackAction.Stomp:
                                                case attackAction.StompRub:
                                                    // case attackAction.LeftStomp:
                                                    return attackRange.PrecisionStompRange
                                                case attackAction.JumpStomp:
                                                    return attackRange.JumpStompRange
                                                case attackAction.None:
                                                default:
                                                    throw new Error("err")
                                            }
                                        },
                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                            return !api.hasPickData(state, usedGirl)
                                        },
                                        conditionReturnFail: (state: state, usedGirl) => {
                                            return api.hasTarget(state, usedGirl) && !api.isChangeScaling(state, usedGirl)
                                                && api.getAttackAction(state, usedGirl) != attackAction.None
                                        },
                                        node: actionNode.WalkToTarget,
                                        children: []
                                    },
                                    {
                                        name: "attack",
                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                            return api.hasTarget(state, usedGirl)
                                        },
                                        node: controlNode.Selector,
                                        children: [
                                            {
                                                config: (state: state, usedGirl) => {
                                                    return api.NumberUtils.getRandomInteger(1, 3)
                                                },
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.StompRub
                                                },
                                                node: actionNode.StompRub,
                                                children: []
                                            },
                                            // {
                                            //     conditionReturnFail: (state: state, usedGirl) => {
                                            //         if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                            //             return false
                                            //         }

                                            //         return api.getAttackAction(state, usedGirl) == attackAction.LeftStomp
                                            //     },
                                            //     node: actionNode.LeftStomp,
                                            //     children: []
                                            // },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.JumpStomp
                                                },
                                                node: actionNode.JumpStomp,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.Stomp
                                                },
                                                node: actionNode.Stomp,
                                                children: []
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                ]
            },
            // {
            //     conditionReturnFail: (state: state, usedGirl) => true,
            //     node: actionNode.Rest,
            //     children: []
            // }
        ]

    }
}