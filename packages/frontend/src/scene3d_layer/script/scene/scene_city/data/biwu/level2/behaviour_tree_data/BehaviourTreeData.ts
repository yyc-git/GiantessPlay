import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { attackRange, autoDifficulty, pose, targetType } from "../../../../type/StateType"
import { behaviourTreeData, controlNode } from "../../../behaviour_tree_data/BehaviourTreeDataType"
import * as BehaviourTreeData from "../../../behaviour_tree_data/utils/BehaviourTreeDataUtils"
import { eventName } from "../GameEventData"
import { isFinish } from "../../../../scenario/Command"
import { isHard } from "../../../../manage/biwu/level2/ManageScene"
import { getFightRate } from "../../Utils"
import { getLevelData, getLevelDataExn, hasLevelData, setLevelData } from "../../../../CityScene"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getNow } from "../../../../Time"
import { getModAPI } from "../../../../Mod"
import { readState } from "../../../../../../../state/State"
import { getAutoDifficulty } from "../../../../difficulty/Difficulty"
import { actionName } from "../DataType"
import { convertAutoDifficultyToRate } from "../../../../difficulty/DifficultyUtils"

export enum attackAction {
    None = "None",

    Rest = "Rest",

    Stomp = "Stomp",
    StompRub = "StompRub",
    // LeftStomp = "LeftStomp",
    JumpStomp = "JumpStomp",

    LightStomp = "LightStomp",

    Pickup = "Pickup",
    Pinch = "Pinch",
    Pickdown = "Pickdown",
}

export enum extendActionNode {
    ChangePose = "ChangePose",
    SelectAttackAction = "SelectAttackAction",

    LightStomp = "LightStomp",

    TriggerGameEvent = "TriggerGameEvent",

    WalkToTarget = "WalkToTarget",
    SelectTarget = "SelectTarget",

    Stomp = "Stomp",
    StompRub = "StompRub",
    JumpStomp = "JumpStomp",

    Pickup = "Pickup",
    Pinch = "Pinch",
    Pickdown = "Pickdown",

    Rest = "Rest",
}

// export type actionNode = BehaviourTreeData.actionNode | extendActionNode
// export const actionNode = { ...BehaviourTreeData.actionNode, ...extendActionNode }
export type actionNode = extendActionNode
export const actionNode = { ...extendActionNode }


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

export let hasCustomData = (state: state) => {
    return hasLevelData(state, getKey())
}

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
                conditionReturnFail: (state: state, usedGirl) => true,
                node: controlNode.Parrel,
                children: [
                    {
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return !api.hasTarget(state, usedGirl)
                        },
                        node: actionNode.SelectTarget,
                        children: []
                    },
                    // {
                    //     name: "attack",
                    //     conditionReturnFail: (state: state, usedGirl) => {
                    //         return hasTargetFunc(state)
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnFail: (state: state, usedGirl) => hasPickDataFunc(state, usedGirl),
                    //             node: actionNode.Pickdown,
                    //             children: []
                    //         },
                    //         {
                    //             name: "stomp",
                    //             // conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 3) && canStomp(state),
                    //             conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 3),
                    //             // conditionReturnFail: (state: state, usedGirl) => true,
                    //             node: controlNode.Sequence,
                    //             children: [
                    //                 {
                    //                     config: (state: state, usedGirl) => {
                    //                         return attackRange.PrecisionStompRange
                    //                     },
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.WalkToTarget,
                    //                     children: []
                    //                 },
                    //                 {
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.Stomp,
                    //                     children: []
                    //                 },
                    //             ]
                    //         },
                    //         {
                    //             name: "lightStomp",
                    //             conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(3 / 4),
                    //             node: controlNode.Sequence,
                    //             children: [
                    //                 {
                    //                     config: (state: state, usedGirl) => {
                    //                         return attackRange.PrecisionStompRange
                    //                     },
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.WalkToTarget,
                    //                     children: []
                    //                 },
                    //                 {
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.LightStomp,
                    //                     children: []
                    //                 },
                    //             ]
                    //         },
                    //         {
                    //             name: "pick",
                    //             conditionReturnSuccess: (state: state, usedGirl) => {
                    //                 // return canPickup(state)
                    //                 return true
                    //             },
                    //             node: controlNode.Sequence,
                    //             children: [
                    //                 {
                    //                     config: (state: state, usedGirl) => {
                    //                         return attackRange.PickRange
                    //                     },
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.WalkToTarget,
                    //                     children: []
                    //                 },
                    //                 {
                    //                     conditionReturnSuccess: (state: state, usedGirl) => {
                    //                         return true
                    //                     },
                    //                     node: actionNode.Pickup,
                    //                     children: []
                    //                 },
                    //                 {
                    //                     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                     node: actionNode.Pinch,
                    //                     children: []
                    //                 },
                    //                 // {
                    //                 //     conditionReturnSuccess: (state: state, usedGirl) => true,
                    //                 //     node: actionNode.Pickdown,
                    //                 //     children: []
                    //                 // },
                    //             ]
                    //         },
                    //     ]
                    // }

                    {
                        config: (state: state, usedGirl) => {
                            // switch (api.getCurrentPose(state, usedGirl)) {
                            //     case pose.Stand:
                            //         return actionName.None
                            //     case pose.Pick:
                            //         return actionName.Pickdown
                            //     default:
                            //         throw new Error("error")
                            // }
                            return actionName.None
                        },
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return api.hasTarget(state, usedGirl)
                        },
                        node: actionNode.ChangePose,
                        children: []
                    },
                    {
                        config: (state: state, usedGirl) => {
                            let firstLayerRateArr, secondLayerRateArr

                            switch (api.getCurrentPose(state, usedGirl)) {
                                case pose.Stand:
                                    if (api.isRandomRate(1 - getFightRate(state))) {
                                        return attackAction.Rest
                                    }

                                    firstLayerRateArr = [4 / 5, 1 / 5]
                                    // firstLayerRateArr = [4 / 5, 1000 / 5]
                                    secondLayerRateArr = [
                                        [1, 0.5 * convertAutoDifficultyToRate(state), 1, 2],
                                        // [1, 0.5 * convertAutoDifficultyToRate(state), 100, 2],
                                        // [1, 0.5 * convertAutoDifficultyToRate(state), 1, 200],
                                        [1]
                                    ]

                                    return api.selectOneByTwoLayerWeights(api, [
                                        [
                                            attackAction.StompRub,
                                            // attackAction.LeftStomp,
                                            attackAction.JumpStomp,
                                            attackAction.Stomp,

                                            attackAction.LightStomp,
                                        ],
                                        [
                                            attackAction.Pickup
                                        ]
                                    ],
                                        firstLayerRateArr,
                                        secondLayerRateArr
                                    )

                                case pose.Pick:
                                    if (api.isRandomRate(1 - getFightRate(state))) {
                                        return attackAction.Rest
                                    }

                                    firstLayerRateArr = [
                                        1
                                    ]

                                    return api.selectOneByWeight(api, [
                                        attackAction.Pinch,
                                    ],
                                        firstLayerRateArr,
                                    )

                                default:
                                    throw new Error("error")
                            }
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
                                                case attackAction.LightStomp:
                                                    // case attackAction.LeftStomp:
                                                    return attackRange.PrecisionStompRange
                                                case attackAction.JumpStomp:
                                                    return attackRange.JumpStompRange
                                                case attackAction.Pickup:
                                                case attackAction.Pinch:
                                                    return attackRange.PickRange
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
                                                    if (isHard(state, usedGirl)) {
                                                        return eventName.PickdownArmy_Hard
                                                    }
                                                    return eventName.PickdownArmy_Normal
                                                },
                                                conditionReturnFail: (state: state, usedGirl) => !hasPickDataFunc(state, usedGirl) && isFinish(state, usedGirl) && isRandomRateFunc(1 / 5),
                                                // conditionReturnFail: (state: state, usedGirl) => true,
                                                node: actionNode.TriggerGameEvent,
                                                children: []
                                            },

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
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.LightStomp
                                                },
                                                node: actionNode.LightStomp,
                                                children: []
                                            },

                                            {
                                                name: "pick",
                                                // conditionReturnFail: (state: state, usedGirl) => {
                                                //     // return api.isRandomRate(1 / 2)
                                                //     return false
                                                // },
                                                conditionReturnSuccess: (state: state, usedGirl) => {
                                                    // if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.PickRange)) {
                                                    //     return false
                                                    // }

                                                    // return _judgeRate(api, state, (api, state) => true)
                                                    // return api.getAttackAction(state, usedGirl) == attackAction.Pickup
                                                    return true
                                                },
                                                node: controlNode.Selector,
                                                children: [
                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.PickRange)) {
                                                                return false
                                                            }

                                                            return api.getAttackAction(state, usedGirl) == attackAction.Pickup
                                                        },
                                                        node: actionNode.Pickup,
                                                        children: []
                                                    },
                                                    {
                                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.Pinch
                                                        },
                                                        node: actionNode.Pinch,
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
                ]
            },
            // {
            //     config: (state: state, usedGirl) => {
            //         if (isHard(state, usedGirl)) {
            //             return eventName.PickdownArmy_Hard
            //         }
            //         return eventName.PickdownArmy_Normal
            //     },
            //     conditionReturnFail: (state: state, usedGirl) => !hasPickDataFunc(state, usedGirl) && isFinish(state, usedGirl) && isRandomRateFunc(1 / 5),
            //     // conditionReturnFail: (state: state, usedGirl) => true,
            //     node: actionNode.TriggerGameEvent,
            //     children: []
            // },
            // {
            //     conditionReturnSuccess: (state: state, usedGirl) => true,
            //     node: actionNode.Rest,
            //     children: []
            // }
        ]

        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(getFightRate(state)),
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 name: "handleCase",
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             return getNow(state) - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return !hasTargetFunc(state)
        //                 },
        //                 node: actionNode.SelectTarget,
        //                 children: []
        //             },
        //             {
        //                 name: "attack",
        //                 conditionReturnFail: (state: state, usedGirl) => {
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         name: "lightStomp",
        //                         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(3 / 4),
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.PrecisionStompRange
        //                                 },
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.LightStomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        // ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         conditionReturnFail: (state: state, usedGirl) => true,
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 name: "handleCase",
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             return getNow(state) - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return !hasTargetFunc(state)
        //                 },
        //                 node: actionNode.SelectTarget,
        //                 children: []
        //             },
        //             {
        //                 name: "attack",
        //                 conditionReturnFail: (state: state, usedGirl) => {
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         conditionReturnFail: (state: state, usedGirl) => hasPickDataFunc(state, usedGirl),
        //                         node: actionNode.Pickdown,
        //                         children: []
        //                     },
        //                     {
        //                         name: "stomp",
        //                         // conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 3) && canStomp(state),
        //                         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 3),
        //                         // conditionReturnFail: (state: state, usedGirl) => true,
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.Middle
        //                                 },
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "lightStomp",
        //                         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(3 / 4),
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.Small
        //                                 },
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.LightStomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "pick",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             // return canPickup(state)
        //                             return true
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.Small
        //                                 },
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.Pinch,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.Pickdown,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         config: (state: state, usedGirl) => {
        //             if (isHard(state, usedGirl)) {
        //                 return eventName.PickdownArmy_Hard
        //             }
        //             return eventName.PickdownArmy_Normal
        //         },
        //         conditionReturnFail: (state: state, usedGirl) => !hasPickDataFunc(state, usedGirl) && isFinish(state, usedGirl) && isRandomRateFunc(1 / 5),
        //         // conditionReturnFail: (state: state, usedGirl) => true,
        //         node: actionNode.TriggerGameEvent,
        //         children: []
        //     },
        //     {
        //         conditionReturnSuccess: (state: state, usedGirl) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(getFightRate(state)),
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 name: "handleCase",
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             return getNow(state) - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return !hasTargetFunc(state)
        //                 },
        //                 node: actionNode.SelectTarget,
        //                 children: []
        //             },
        //             {
        //                 name: "attack",
        //                 conditionReturnFail: (state: state, usedGirl) => {
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         conditionReturnFail: (state: state, usedGirl) => hasPickDataFunc(state, usedGirl),
        //                         node: actionNode.Pickdown,
        //                         children: []
        //                     },
        //                     // {
        //                     //     name: "stomp",
        //                     //     conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(1 / 3) && canStomp(state),
        //                     //     // conditionReturnFail: (state: state, usedGirl) => true,
        //                     //     node: controlNode.Sequence,
        //                     //     children: [
        //                     //         {
        //                     //             config: (state: state, usedGirl) => {
        //                     //                 return attackRange.Middle
        //                     //             },
        //                     //             conditionReturnSuccess: (state: state, usedGirl) => true,
        //                     //             node: actionNode.WalkToTarget,
        //                     //             children: []
        //                     //         },
        //                     //         {
        //                     //             conditionReturnSuccess: (state: state, usedGirl) => true,
        //                     //             node: actionNode.Stomp,
        //                     //             children: []
        //                     //         },
        //                     //     ]
        //                     // },
        //                     // {
        //                     //     name: "lightStomp",
        //                     //     conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(3 / 4),
        //                     //     node: controlNode.Sequence,
        //                     //     children: [
        //                     //         {
        //                     //             config: (state: state, usedGirl) => {
        //                     //                 return attackRange.Small
        //                     //             },
        //                     //             conditionReturnSuccess: (state: state, usedGirl) => true,
        //                     //             node: actionNode.WalkToTarget,
        //                     //             children: []
        //                     //         },
        //                     //         {
        //                     //             conditionReturnSuccess: (state: state, usedGirl) => true,
        //                     //             node: actionNode.LightStomp,
        //                     //             children: []
        //                     //         },
        //                     //     ]
        //                     // },
        //                     {
        //                         name: "pick",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             // return canPickup(state)
        //                             return true
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.Small
        //                                 },
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.Pinch,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnSuccess: (state: state, usedGirl) => true,
        //                                 node: actionNode.Pickdown,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         config: (state: state, usedGirl) => {
        //             if (isHard(state, usedGirl)) {
        //                 return eventName.PickdownArmy_Hard
        //             }
        //             return eventName.PickdownArmy_Normal
        //         },
        //         conditionReturnFail: (state: state, usedGirl) => !hasPickDataFunc(state, usedGirl) && isFinish(state, usedGirl) && isRandomRateFunc(1 / 5),
        //         // conditionReturnFail: (state: state, usedGirl) => true,
        //         node: actionNode.TriggerGameEvent,
        //         children: []
        //     },
        //     {
        //         conditionReturnSuccess: (state: state, usedGirl) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(getFightRate(state)),
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 name: "handleCase",
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         conditionReturnSuccess: (state: state, usedGirl) => {
        //                             return getNow(state) - getGirlStateFunc(state).lastMoveCollisionedTime < 5000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 conditionReturnSuccess: (state: state, usedGirl) => {
        //                     return !hasTargetFunc(state)
        //                 },
        //                 node: actionNode.SelectTarget,
        //                 children: []
        //             },
        //             {
        //                 name: "attack",
        //                 conditionReturnFail: (state: state, usedGirl) => {
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         conditionReturnFail: (state: state, usedGirl) => hasPickDataFunc(state, usedGirl),
        //                         node: actionNode.Pickdown,
        //                         children: []
        //                     },
        //                     {
        //                         name: "pick",
        //                         conditionReturnFail: (state: state, usedGirl) => {
        //                             return true
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 config: (state: state, usedGirl) => {
        //                                     return attackRange.Small
        //                                 },
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
        //                                 node: actionNode.WalkToTarget,
        //                                 children: []
        //                             },
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             // {
        //                             //     conditionReturnFail: (state: state, usedGirl) => true,
        //                             //     node: actionNode.Pinch,
        //                             //     children: []
        //                             // },
        //                             {
        //                                 conditionReturnFail: (state: state, usedGirl) => true,
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