import { Console } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../type/StateType"
import { behaviourTreeData, controlNode } from "./BehaviourTreeDataType"

export enum actionNode {
    // SelectNearestBuilding = "SelectNearestBuilding",
    // SelectNearestSoldier = "SelectNearestSoldier",
    // SelectNearestTank = "SelectNearestTank",
    // SelectNearestCityzen = "SelectNearestCityzen",
    // SelectLittleMan = "SelectLittleMan",
    SelectTarget = "SelectTarget",

    WalkToTarget = "WalkToTarget",
    Stomp = "Stomp",
    BreastPress = "BreastPress",

    Pickup = "Pickup",
    Pinch = "Pinch",
    Eat = "Eat",
    Pickdown = "Pickdown",

    ChangePose = "ChangePose",

    Bigger = "Bigger",

    Rest = "Rest",


    ClearTarget = "ClearTarget",
}


export let getKey = () => "BehaviourTreeData"


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
                returnFailCondition: (state: state) => isRandomRateFunc(4 / 5),
                // returnFailCondition: (state: state) => true,
                node: controlNode.Sequence,
                children: [
                    {
                        // name: "handleFailCase",
                        name: "handleCase",
                        returnSuccessCondition: (state: state) => {
                            return true
                        },
                        node: controlNode.Parrel,
                        children: [
                            {
                                name: "handleMoveCollision",
                                returnSuccessCondition: (state: state) => {
                                    return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 1000
                                },
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        returnFailCondition: (state: state) => true,
                                        node: actionNode.Stomp,
                                        children: []
                                    },
                                    {
                                        name: "handleMoveCollisionForCrawl",
                                        returnSuccessCondition: (state: state) => {
                                            return isPoseFunc(state, pose.Crawl)
                                        },
                                        node: controlNode.Sequence,
                                        children: [
                                            {
                                                returnFailCondition: (state: state) => true,
                                                node: actionNode.BreastPress,
                                                children: []
                                            },
                                            {
                                                returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                                                node: actionNode.ChangePose,
                                                children: []
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                name: "handleHasTarget",
                                returnSuccessCondition: (state: state) => {
                                    return !hasPickDataFunc(state) && hasTargetFunc(state)
                                },
                                node: controlNode.Selector,
                                children: [
                                    {
                                        returnSuccessCondition: (state: state) => isRandomRateFunc(1 / 3),
                                        node: actionNode.ClearTarget,
                                        children: []
                                    },
                                ]
                            },
                            {
                                // name: "handleHpLow",
                                name: "handleBigger",
                                returnSuccessCondition: (state: state) => {
                                    // return isSmallGiantessFunc(state)
                                    return true
                                },
                                node: controlNode.Selector,
                                children: [
                                    {
                                        returnSuccessCondition: (state: state) => {
                                            let hpFactor
                                            if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.1) {
                                                hpFactor = 1 / 3
                                            }
                                            else if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.3) {
                                                hpFactor = 1 / 4
                                            }
                                            else {
                                                hpFactor = 0
                                            }
                                            let armyFactor
                                            if (
                                                getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
                                                getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7) {
                                                armyFactor = 1 / 4
                                            }
                                            else {
                                                armyFactor = 0
                                            }
                                            let scaleFactor
                                            if (!isSmallGiantessFunc(state)) {
                                                // scaleFactor = 0.04 * getSettingFactorAffectBiggerRateFunc(state)
                                                scaleFactor = 0.02 * getSettingFactorAffectBiggerRateFunc(state)
                                            }
                                            else {
                                                scaleFactor = 1
                                            }
                                            // Console.log(
                                            //     getNearestTargetCountFunc(state, targetType.Soldier), getNearestTargetCountFunc(state, targetType.MilltaryVehicle)
                                            // )
                                            return isRandomRateFunc((hpFactor + armyFactor) * scaleFactor * getSettingFactorAffectBiggerRateFunc(state))
                                        },
                                        node: actionNode.Bigger,
                                        children: [
                                        ]
                                    },
                                ]
                            },
                            {
                                name: "MakeStandMorePriorForArmy",
                                returnSuccessCondition: (state: state) => {
                                    return isPoseFunc(state, pose.Crawl)
                                },
                                node: controlNode.Selector,
                                children: [
                                    {
                                        returnSuccessCondition: (state: state) => {
                                            if (
                                                isSmallGiantessFunc(state)
                                                &&
                                                (
                                                    getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 5 ||
                                                    getNearestTargetCountFunc(state, targetType.Soldier) > 20 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 10
                                                )
                                            ) {
                                                return isRandomRateFunc(1 / 3)
                                            }
                                            else {
                                                return false
                                            }
                                        },
                                        // returnSuccessCondition: (state: state) => true,
                                        node: actionNode.ChangePose,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        // name: "selectTarget",
                        returnSuccessCondition: (state: state) => {
                            return !hasPickDataFunc(state) && !hasTargetFunc(state)
                        },
                        // node: controlNode.Selector,
                        node: actionNode.SelectTarget,
                        children: [
                            // {
                            //     returnFailCondition: (state: state) => {
                            //         if (getSelectTargetPriorFunc(state) == targetPrior.LittleMan) {
                            //             return true
                            //         }
                            //         return state.config.littleManConfig.isSelectLittleMan ? true : isRandomRateFunc(1 / 4)
                            //     },
                            //     node: actionNode.SelectLittleMan,
                            //     children: []
                            // },
                            // {
                            //     returnFailCondition: (state: state) => {
                            //         if (getSelectTargetPriorFunc(state) == targetPrior.MilltaryVehicle) {
                            //             return true
                            //         }
                            //         let factor
                            //         if (
                            //             getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 4
                            //         ) {
                            //             factor = 2
                            //         }
                            //         else {
                            //             factor = 1
                            //         }
                            //         return isRandomRateFunc(1 / 4 * factor)
                            //     },
                            //     node: actionNode.SelectNearestTank,
                            //     children: []
                            // },
                            // {
                            //     returnFailCondition: (state: state) => {
                            //         if (getSelectTargetPriorFunc(state) == targetPrior.Soldier) {
                            //             return true
                            //         }
                            //         let factor
                            //         if (getNearestTargetCountFunc(state, targetType.Soldier) > 8
                            //         ) {
                            //             factor = 2
                            //         }
                            //         else {
                            //             factor = 1
                            //         }
                            //         return isRandomRateFunc(1 / 4 * factor)
                            //     },
                            //     node: actionNode.SelectNearestSoldier,
                            //     children: []
                            // },
                            // {
                            //     // returnFailCondition: (state: state) => {
                            //     //     return true
                            //     // },
                            //     returnFailCondition: (state: state) => {
                            //         if (getSelectTargetPriorFunc(state) == targetPrior.Building) {
                            //             return true
                            //         }
                            //         return isRandomRateFunc(1 / 2)
                            //     },
                            //     node: actionNode.SelectNearestBuilding,
                            //     children: []
                            // },
                            // {
                            //     // returnFailCondition: (state: state) => {
                            //     //     return true
                            //     // },
                            //     // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                            //     // returnFailCondition: (state: state) => true,
                            //     returnFailCondition: (state: state) => {
                            //         if (getSelectTargetPriorFunc(state) == targetPrior.Cityzen) {
                            //             return true
                            //         }
                            //         return isRandomRateFunc(1 / 2)
                            //     },
                            //     node: actionNode.SelectNearestCityzen,
                            //     children: []
                            // },
                        ]
                    },
                    {
                        name: "moveToTarget",
                        returnSuccessCondition: (state: state) => {
                            return !hasPickDataFunc(state)
                        },
                        returnFailCondition: (state: state) => {
                            return hasTargetFunc(state) || !isChangeScalingFunc(state)
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
                                    // if (isRandomRateFunc(1 / 3)) {
                                    //     return attackRange.Middle
                                    // }
                                    // if (isRandomRateFunc(1 / 3)) {
                                    //     return attackRange.Small
                                    // }
                                    // return attackRange.Big
                                    if (isRandomRateFunc(1 / 2)) {
                                        return attackRange.Middle
                                    }
                                    return attackRange.Small
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
                            return hasTargetFunc(state)
                        },
                        node: controlNode.Selector,
                        children: [
                            {
                                returnFailCondition: (state: state) => {
                                    // return isRandomRateFunc(1 / 2)
                                    return true
                                },
                                node: actionNode.BreastPress,
                                children: []
                            },
                            {
                                returnFailCondition: (state: state) => {
                                    // return !hasPickDataFunc(state) && isRandomRateFunc(1 / 3)
                                    // if (hasPickDataFunc(state)) {
                                    //     return isRandomRateFunc(1 / 4)
                                    // }
                                    if (state.config.littleManConfig.isOnlyStomp) {
                                        return true
                                    }
                                    if (hasPickDataFunc(state)) {
                                        return false
                                    }
                                    return isRandomRateFunc(1 / 2)
                                },
                                node: actionNode.Stomp,
                                children: []
                            },
                            {
                                name: "pick",
                                returnFailCondition: (state: state) => {
                                    return isRandomRateFunc(1 / 2)
                                },
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        returnFailCondition: (state: state) => {
                                            return true
                                        },
                                        node: actionNode.Pickup,
                                        children: []
                                    },
                                    {
                                        name: "pickAttack",
                                        returnFailCondition: (state: state) => {
                                            return hasTargetFunc(state)
                                        },
                                        node: controlNode.Selector,
                                        children: [
                                            {
                                                returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
                                                // returnFailCondition: (state: state) => true,
                                                node: actionNode.Pinch,
                                                children: []
                                            },
                                            {
                                                returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                                                node: actionNode.Eat,
                                                children: []
                                            },
                                            {
                                                returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
                                                node: actionNode.Pickdown,
                                                children: []
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: "MakeStandMorePrior",
                        returnSuccessCondition: (state: state) => {
                            return isPoseFunc(state, pose.Crawl)
                        },
                        node: controlNode.Selector,
                        children: [
                            {
                                returnSuccessCondition: (state: state) => {
                                    return isRandomRateFunc(1 / 3)
                                },
                                // returnSuccessCondition: (state: state) => true,
                                node: actionNode.ChangePose,
                                children: []
                            },
                        ]
                    },
                ]
            },
            {
                returnFailCondition: (state: state) => {
                    let rate
                    if (isSmallGiantessFunc(state)) {
                        rate = 1 / 4
                    }
                    else {
                        // rate = 1 / 16 * getSettingFactorAffectBiggerRateFunc(state)
                        rate = 1 / 32 * getSettingFactorAffectBiggerRateFunc(state)
                    }
                    return isRandomRateFunc(rate * getSettingFactorAffectBiggerRateFunc(state))
                },
                // returnFailCondition: (state: state) => true,
                node: actionNode.Bigger,
                children: [
                ]
            },
            {
                // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
                returnFailCondition: (state: state) => {
                    let factor
                    if (
                        getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
                        getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7
                    ) {
                        factor = 0.5
                    }
                    else {
                        factor = 1
                    }
                    return isRandomRateFunc(1 / 6 * factor)
                },
                node: actionNode.ChangePose,
                children: [
                ]
            },
            {
                // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
                // returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
                // returnFailCondition: (state: state) => isRandomRateFunc(1 / 5),
                // returnFailCondition: (state: state) => true,
                // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2 * (1 / getSettingFactorAffectFirstBiggerRateFunc(state))),
                returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
                // returnFailCondition: (state: state) => true,
                node: actionNode.Rest,
                children: []
            }
        ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         returnFailCondition: (state: state) => isRandomRateFunc(4 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 // name: "handleFailCase",
        //                 name: "handleCase",
        //                 returnSuccessCondition: (state: state) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         returnSuccessCondition: (state: state) => {
        //                             return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 1000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                             {
        //                                 name: "handleMoveCollisionForCrawl",
        //                                 returnSuccessCondition: (state: state) => {
        //                                     return isPoseFunc(state, pose.Crawl)
        //                                 },
        //                                 node: controlNode.Sequence,
        //                                 children: [
        //                                     {
        //                                         returnFailCondition: (state: state) => true,
        //                                         node: actionNode.BreastPress,
        //                                         children: []
        //                                     },
        //                                     {
        //                                         returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                                         node: actionNode.ChangePose,
        //                                         children: []
        //                                     },
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "handleHasTarget",
        //                         returnSuccessCondition: (state: state) => {
        //                             return !hasPickDataFunc(state) && hasTargetFunc(state)
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => isRandomRateFunc(1 / 3),
        //                                 node: actionNode.ClearTarget,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         // name: "handleHpLow",
        //                         name: "handleBigger",
        //                         returnSuccessCondition: (state: state) => {
        //                             // return isSmallGiantessFunc(state)
        //                             return true
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => {
        //                                     let hpFactor
        //                                     if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.1) {
        //                                         hpFactor = 1 / 3
        //                                     }
        //                                     else if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.3) {
        //                                         hpFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         hpFactor = 0
        //                                     }
        //                                     let armyFactor
        //                                     if (
        //                                         getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //                                         getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7) {
        //                                         armyFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         armyFactor = 0
        //                                     }
        //                                     let scaleFactor
        //                                     if (!isSmallGiantessFunc(state)) {
        //                                         // scaleFactor = 0.04 * getSettingFactorAffectBiggerRateFunc(state)
        //                                         scaleFactor = 0.02 * getSettingFactorAffectBiggerRateFunc(state)
        //                                     }
        //                                     else {
        //                                         scaleFactor = 1
        //                                     }
        //                                     // Console.log(
        //                                     //     getNearestTargetCountFunc(state, targetType.Soldier), getNearestTargetCountFunc(state, targetType.MilltaryVehicle)
        //                                     // )
        //                                     return isRandomRateFunc((hpFactor + armyFactor) * scaleFactor * getSettingFactorAffectBiggerRateFunc(state))
        //                                 },
        //                                 node: actionNode.Bigger,
        //                                 children: [
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "MakeStandMorePriorForArmy",
        //                         returnSuccessCondition: (state: state) => {
        //                             return isPoseFunc(state, pose.Crawl)
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => {
        //                                     if (
        //                                         isSmallGiantessFunc(state)
        //                                         &&
        //                                         (
        //                                             getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 5 ||
        //                                             getNearestTargetCountFunc(state, targetType.Soldier) > 20 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 10
        //                                         )
        //                                     ) {
        //                                         return isRandomRateFunc(1 / 3)
        //                                     }
        //                                     else {
        //                                         return false
        //                                     }
        //                                 },
        //                                 // returnSuccessCondition: (state: state) => true,
        //                                 node: actionNode.ChangePose,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 // name: "selectTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state) && !hasTargetFunc(state)
        //                 },
        //                 // node: controlNode.Selector,
        //                 node: actionNode.SelectTarget,
        //                 children: [
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.LittleMan) {
        //                     //             return true
        //                     //         }
        //                     //         return state.config.littleManConfig.isSelectLittleMan ? true : isRandomRateFunc(1 / 4)
        //                     //     },
        //                     //     node: actionNode.SelectLittleMan,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.MilltaryVehicle) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (
        //                     //             getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 4
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestTank,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Soldier) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (getNearestTargetCountFunc(state, targetType.Soldier) > 8
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestSoldier,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Building) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestBuilding,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                     //     // returnFailCondition: (state: state) => true,
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Cityzen) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestCityzen,
        //                     //     children: []
        //                     // },
        //                 ]
        //             },
        //             {
        //                 name: "moveToTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state)
        //                 },
        //                 returnFailCondition: (state: state) => {
        //                     return hasTargetFunc(state) || !isChangeScalingFunc(state)
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
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Middle
        //                             // }
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Small
        //                             // }
        //                             // return attackRange.Big
        //                             if (isRandomRateFunc(1 / 2)) {
        //                                 return attackRange.Middle
        //                             }
        //                             return attackRange.Small
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
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         name: "pick",
        //                         returnFailCondition: (state: state) => {
        //                             return isRandomRateFunc(1 / 2)
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             {
        //                                 name: "pickAttack",
        //                                 returnFailCondition: (state: state) => {
        //                                     return hasTargetFunc(state)
        //                                 },
        //                                 node: controlNode.Selector,
        //                                 children: [
        //                                     {
        //                                         returnFailCondition: (state: state) => true,
        //                                         node: actionNode.Pickdown,
        //                                         children: []
        //                                     },
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 name: "MakeStandMorePrior",
        //                 returnSuccessCondition: (state: state) => {
        //                     return isPoseFunc(state, pose.Crawl)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         returnSuccessCondition: (state: state) => {
        //                             return isRandomRateFunc(1 / 3)
        //                         },
        //                         // returnSuccessCondition: (state: state) => true,
        //                         node: actionNode.ChangePose,
        //                         children: []
        //                     },
        //                 ]
        //             },
        //         ]
        //     },
        //     {
        //         returnFailCondition: (state: state) => {
        //             let rate
        //             if (isSmallGiantessFunc(state)) {
        //                 rate = 1 / 4
        //             }
        //             else {
        //                 // rate = 1 / 16 * getSettingFactorAffectBiggerRateFunc(state)
        //                 rate = 1 / 32 * getSettingFactorAffectBiggerRateFunc(state)
        //             }
        //             return isRandomRateFunc(rate * getSettingFactorAffectBiggerRateFunc(state))
        //         },
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Bigger,
        //         children: [
        //         ]
        //     },
        //     {
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //         returnFailCondition: (state: state) => {
        //             let factor
        //             if (
        //                 getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //                 getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7
        //             ) {
        //                 factor = 0.5
        //             }
        //             else {
        //                 factor = 1
        //             }
        //             return isRandomRateFunc(1 / 6 * factor)
        //         },
        //         node: actionNode.ChangePose,
        //         children: [
        //         ]
        //     },
        //     {
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2 * (1 / getSettingFactorAffectFirstBiggerRateFunc(state))),
        //         returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]

        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         returnFailCondition: (state: state) => isRandomRateFunc(4 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 // name: "handleFailCase",
        //                 name: "handleCase",
        //                 returnSuccessCondition: (state: state) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     // {
        //                     //     name: "handleMoveCollision",
        //                     //     returnSuccessCondition: (state: state) => {
        //                     //         return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 1000
        //                     //     },
        //                     //     node: controlNode.Sequence,
        //                     //     children: [
        //                     //         {
        //                     //             returnFailCondition: (state: state) => true,
        //                     //             node: actionNode.Stomp,
        //                     //             children: []
        //                     //         },
        //                     //         {
        //                     //             name: "handleMoveCollisionForCrawl",
        //                     //             returnSuccessCondition: (state: state) => {
        //                     //                 return isPoseFunc(state, pose.Crawl)
        //                     //             },
        //                     //             node: controlNode.Sequence,
        //                     //             children: [
        //                     //                 {
        //                     //                     returnFailCondition: (state: state) => true,
        //                     //                     node: actionNode.BreastPress,
        //                     //                     children: []
        //                     //                 },
        //                     //                 {
        //                     //                     returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                     //                     node: actionNode.ChangePose,
        //                     //                     children: []
        //                     //                 },
        //                     //             ]
        //                     //         },
        //                     //     ]
        //                     // },
        //                     {
        //                         name: "handleHasTarget",
        //                         returnSuccessCondition: (state: state) => {
        //                             return !hasPickDataFunc(state) && hasTargetFunc(state)
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => isRandomRateFunc(1 / 3),
        //                                 node: actionNode.ClearTarget,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         // name: "handleHpLow",
        //                         name: "handleBigger",
        //                         returnSuccessCondition: (state: state) => {
        //                             // return isSmallGiantessFunc(state)
        //                             return true
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => {
        //                                     let hpFactor
        //                                     if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.1) {
        //                                         hpFactor = 1 / 3
        //                                     }
        //                                     else if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.3) {
        //                                         hpFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         hpFactor = 0
        //                                     }
        //                                     let armyFactor
        //                                     if (
        //                                         getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //                                         getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7) {
        //                                         armyFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         armyFactor = 0
        //                                     }
        //                                     let scaleFactor
        //                                     if (!isSmallGiantessFunc(state)) {
        //                                         // scaleFactor = 0.04 * getSettingFactorAffectBiggerRateFunc(state)
        //                                         scaleFactor = 0.02 * getSettingFactorAffectBiggerRateFunc(state)
        //                                     }
        //                                     else {
        //                                         scaleFactor = 1
        //                                     }
        //                                     // Console.log(
        //                                     //     getNearestTargetCountFunc(state, targetType.Soldier), getNearestTargetCountFunc(state, targetType.MilltaryVehicle)
        //                                     // )
        //                                     return isRandomRateFunc((hpFactor + armyFactor) * scaleFactor * getSettingFactorAffectBiggerRateFunc(state))
        //                                 },
        //                                 node: actionNode.Bigger,
        //                                 children: [
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                     // {
        //                     //     name: "MakeStandMorePriorForArmy",
        //                     //     returnSuccessCondition: (state: state) => {
        //                     //         return isPoseFunc(state, pose.Crawl)
        //                     //     },
        //                     //     node: controlNode.Selector,
        //                     //     children: [
        //                     //         {
        //                     //             returnSuccessCondition: (state: state) => {
        //                     //                 if (
        //                     //                     isSmallGiantessFunc(state)
        //                     //                     &&
        //                     //                     (
        //                     //                         getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 5 ||
        //                     //                         getNearestTargetCountFunc(state, targetType.Soldier) > 20 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 10
        //                     //                     )
        //                     //                 ) {
        //                     //                     return isRandomRateFunc(1 / 3)
        //                     //                 }
        //                     //                 else {
        //                     //                     return false
        //                     //                 }
        //                     //             },
        //                     //             // returnSuccessCondition: (state: state) => true,
        //                     //             node: actionNode.ChangePose,
        //                     //             children: []
        //                     //         },
        //                     //     ]
        //                     // },
        //                 ]
        //             },
        //             {
        //                 // name: "selectTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state) && !hasTargetFunc(state)
        //                 },
        //                 // node: controlNode.Selector,
        //                 node: actionNode.SelectTarget,
        //                 children: [
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.LittleMan) {
        //                     //             return true
        //                     //         }
        //                     //         return state.config.littleManConfig.isSelectLittleMan ? true : isRandomRateFunc(1 / 4)
        //                     //     },
        //                     //     node: actionNode.SelectLittleMan,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.MilltaryVehicle) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (
        //                     //             getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 4
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestTank,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Soldier) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (getNearestTargetCountFunc(state, targetType.Soldier) > 8
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestSoldier,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Building) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestBuilding,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                     //     // returnFailCondition: (state: state) => true,
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Cityzen) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestCityzen,
        //                     //     children: []
        //                     // },
        //                 ]
        //             },
        //             {
        //                 name: "moveToTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state)
        //                 },
        //                 returnFailCondition: (state: state) => {
        //                     return hasTargetFunc(state) || !isChangeScalingFunc(state)
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
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Middle
        //                             // }
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Small
        //                             // }
        //                             // return attackRange.Big
        //                             if (isRandomRateFunc(1 / 2)) {
        //                                 return attackRange.Middle
        //                             }
        //                             return attackRange.Small
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
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         // return isRandomRateFunc(1 / 2)
        //                     //         return true
        //                     //     },
        //                     //     node: actionNode.BreastPress,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         // return !hasPickDataFunc(state) && isRandomRateFunc(1 / 3)
        //                     //         // if (hasPickDataFunc(state)) {
        //                     //         //     return isRandomRateFunc(1 / 4)
        //                     //         // }
        //                     //         if (state.config.littleManConfig.isOnlyStomp) {
        //                     //             return true
        //                     //         }
        //                     //         if (hasPickDataFunc(state)) {
        //                     //             return false
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.Stomp,
        //                     //     children: []
        //                     // },
        //                     {
        //                         name: "pick",
        //                         returnFailCondition: (state: state) => {
        //                             return isRandomRateFunc(1 / 2)
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             {
        //                                 name: "pickAttack",
        //                                 returnFailCondition: (state: state) => {
        //                                     return hasTargetFunc(state)
        //                                 },
        //                                 node: controlNode.Selector,
        //                                 children: [
        //                                     // {
        //                                     //     returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
        //                                     //     // returnFailCondition: (state: state) => true,
        //                                     //     node: actionNode.Pinch,
        //                                     //     children: []
        //                                     // },
        //                                     {
        //                                         returnFailCondition: (state: state) => true,
        //                                         node: actionNode.Eat,
        //                                         children: []
        //                                     },
        //                                     // {
        //                                     //     returnFailCondition: (state: state) => true,
        //                                     //     node: actionNode.Pickdown,
        //                                     //     children: []
        //                                     // },
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             // {
        //             //     name: "MakeStandMorePrior",
        //             //     returnSuccessCondition: (state: state) => {
        //             //         return isPoseFunc(state, pose.Crawl)
        //             //     },
        //             //     node: controlNode.Selector,
        //             //     children: [
        //             //         {
        //             //             returnSuccessCondition: (state: state) => {
        //             //                 return isRandomRateFunc(1 / 3)
        //             //             },
        //             //             // returnSuccessCondition: (state: state) => true,
        //             //             node: actionNode.ChangePose,
        //             //             children: []
        //             //         },
        //             //     ]
        //             // },
        //         ]
        //     },
        //     {
        //         returnFailCondition: (state: state) => {
        //             let rate
        //             if (isSmallGiantessFunc(state)) {
        //                 rate = 1 / 4
        //             }
        //             else {
        //                 // rate = 1 / 16 * getSettingFactorAffectBiggerRateFunc(state)
        //                 rate = 1 / 32 * getSettingFactorAffectBiggerRateFunc(state)
        //             }
        //             return isRandomRateFunc(rate * getSettingFactorAffectBiggerRateFunc(state))
        //         },
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Bigger,
        //         children: [
        //         ]
        //     },
        //     // {
        //     //     // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //     //     returnFailCondition: (state: state) => {
        //     //         let factor
        //     //         if (
        //     //             getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //     //             getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7
        //     //         ) {
        //     //             factor = 0.5
        //     //         }
        //     //         else {
        //     //             factor = 1
        //     //         }
        //     //         return isRandomRateFunc(1 / 6 * factor)
        //     //     },
        //     //     node: actionNode.ChangePose,
        //     //     children: [
        //     //     ]
        //     // },
        //     {
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2 * (1 / getSettingFactorAffectFirstBiggerRateFunc(state))),
        //         returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]


        // node: controlNode.Selector,
        // children: [
        //     {
        //         name: "fight",
        //         returnFailCondition: (state: state) => isRandomRateFunc(4 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         node: controlNode.Sequence,
        //         children: [
        //             {
        //                 // name: "handleFailCase",
        //                 name: "handleCase",
        //                 returnSuccessCondition: (state: state) => {
        //                     return true
        //                 },
        //                 node: controlNode.Parrel,
        //                 children: [
        //                     {
        //                         name: "handleMoveCollision",
        //                         returnSuccessCondition: (state: state) => {
        //                             return performance.now() - getGirlStateFunc(state).lastMoveCollisionedTime < 1000
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => true,
        //                                 node: actionNode.Stomp,
        //                                 children: []
        //                             },
        //                             {
        //                                 name: "handleMoveCollisionForCrawl",
        //                                 returnSuccessCondition: (state: state) => {
        //                                     return isPoseFunc(state, pose.Crawl)
        //                                 },
        //                                 node: controlNode.Sequence,
        //                                 children: [
        //                                     {
        //                                         returnFailCondition: (state: state) => true,
        //                                         node: actionNode.BreastPress,
        //                                         children: []
        //                                     },
        //                                     {
        //                                         returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                                         node: actionNode.ChangePose,
        //                                         children: []
        //                                     },
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "handleHasTarget",
        //                         returnSuccessCondition: (state: state) => {
        //                             return !hasPickDataFunc(state) && hasTargetFunc(state)
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => isRandomRateFunc(1 / 3),
        //                                 node: actionNode.ClearTarget,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         // name: "handleHpLow",
        //                         name: "handleBigger",
        //                         returnSuccessCondition: (state: state) => {
        //                             // return isSmallGiantessFunc(state)
        //                             return true
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => {
        //                                     let hpFactor
        //                                     if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.1) {
        //                                         hpFactor = 1 / 3
        //                                     }
        //                                     else if (getGirlStateFunc(state).hp < getGirlValueFunc().hp * 0.3) {
        //                                         hpFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         hpFactor = 0
        //                                     }
        //                                     let armyFactor
        //                                     if (
        //                                         getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //                                         getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7) {
        //                                         armyFactor = 1 / 4
        //                                     }
        //                                     else {
        //                                         armyFactor = 0
        //                                     }
        //                                     let scaleFactor
        //                                     if (!isSmallGiantessFunc(state)) {
        //                                         scaleFactor = 0.04 * getSettingFactorAffectBiggerRateFunc(state)
        //                                     }
        //                                     else {
        //                                         scaleFactor = 1
        //                                     }
        //                                     // Console.log(
        //                                     //     getNearestTargetCountFunc(state, targetType.Soldier), getNearestTargetCountFunc(state, targetType.MilltaryVehicle)
        //                                     // )
        //                                     return isRandomRateFunc((hpFactor + armyFactor) * scaleFactor * getSettingFactorAffectBiggerRateFunc(state))
        //                                 },
        //                                 node: actionNode.Bigger,
        //                                 children: [
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                     {
        //                         name: "MakeStandMorePriorForArmy",
        //                         returnSuccessCondition: (state: state) => {
        //                             return isPoseFunc(state, pose.Crawl)
        //                         },
        //                         node: controlNode.Selector,
        //                         children: [
        //                             {
        //                                 returnSuccessCondition: (state: state) => {
        //                                     if (
        //                                         isSmallGiantessFunc(state)
        //                                         &&
        //                                         (
        //                                             getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 5 ||
        //                                             getNearestTargetCountFunc(state, targetType.Soldier) > 20 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 10
        //                                         )
        //                                     ) {
        //                                         return isRandomRateFunc(1 / 3)
        //                                     }
        //                                     else {
        //                                         return false
        //                                     }
        //                                 },
        //                                 // returnSuccessCondition: (state: state) => true,
        //                                 node: actionNode.ChangePose,
        //                                 children: []
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 // name: "selectTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state) && !hasTargetFunc(state)
        //                 },
        //                 // node: controlNode.Selector,
        //                 node: actionNode.SelectTarget,
        //                 children: [
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.LittleMan) {
        //                     //             return true
        //                     //         }
        //                     //         return state.config.littleManConfig.isSelectLittleMan ? true : isRandomRateFunc(1 / 4)
        //                     //     },
        //                     //     node: actionNode.SelectLittleMan,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.MilltaryVehicle) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (
        //                     //             getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 4
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestTank,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Soldier) {
        //                     //             return true
        //                     //         }
        //                     //         let factor
        //                     //         if (getNearestTargetCountFunc(state, targetType.Soldier) > 8
        //                     //         ) {
        //                     //             factor = 2
        //                     //         }
        //                     //         else {
        //                     //             factor = 1
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 4 * factor)
        //                     //     },
        //                     //     node: actionNode.SelectNearestSoldier,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Building) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestBuilding,
        //                     //     children: []
        //                     // },
        //                     // {
        //                     //     // returnFailCondition: (state: state) => {
        //                     //     //     return true
        //                     //     // },
        //                     //     // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //                     //     // returnFailCondition: (state: state) => true,
        //                     //     returnFailCondition: (state: state) => {
        //                     //         if (getSelectTargetPriorFunc(state) == targetPrior.Cityzen) {
        //                     //             return true
        //                     //         }
        //                     //         return isRandomRateFunc(1 / 2)
        //                     //     },
        //                     //     node: actionNode.SelectNearestCityzen,
        //                     //     children: []
        //                     // },
        //                 ]
        //             },
        //             {
        //                 name: "moveToTarget",
        //                 returnSuccessCondition: (state: state) => {
        //                     return !hasPickDataFunc(state)
        //                 },
        //                 returnFailCondition: (state: state) => {
        //                     return hasTargetFunc(state) || !isChangeScalingFunc(state)
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
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Middle
        //                             // }
        //                             // if (isRandomRateFunc(1 / 3)) {
        //                             //     return attackRange.Small
        //                             // }
        //                             // return attackRange.Big
        //                             if (isRandomRateFunc(1 / 2)) {
        //                                 return attackRange.Middle
        //                             }
        //                             return attackRange.Small
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
        //                     return hasTargetFunc(state)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         name: "pick",
        //                         returnFailCondition: (state: state) => {
        //                             return true
        //                         },
        //                         node: controlNode.Sequence,
        //                         children: [
        //                             {
        //                                 returnFailCondition: (state: state) => {
        //                                     return true
        //                                 },
        //                                 node: actionNode.Pickup,
        //                                 children: []
        //                             },
        //                             {
        //                                 name: "pickAttack",
        //                                 returnFailCondition: (state: state) => {
        //                                     return hasTargetFunc(state)
        //                                 },
        //                                 node: controlNode.Selector,
        //                                 children: [
        //                                     {
        //                                         returnFailCondition: (state: state) => true,
        //                                         node: actionNode.Eat,
        //                                         children: []
        //                                     },
        //                                     {
        //                                         returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //                                         node: actionNode.Pickdown,
        //                                         children: []
        //                                     },
        //                                 ]
        //                             },
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 name: "MakeStandMorePrior",
        //                 returnSuccessCondition: (state: state) => {
        //                     return isPoseFunc(state, pose.Crawl)
        //                 },
        //                 node: controlNode.Selector,
        //                 children: [
        //                     {
        //                         returnSuccessCondition: (state: state) => {
        //                             return isRandomRateFunc(1 / 3)
        //                         },
        //                         // returnSuccessCondition: (state: state) => true,
        //                         node: actionNode.ChangePose,
        //                         children: []
        //                     },
        //                 ]
        //             },
        //         ]
        //     },
        //     {
        //         returnFailCondition: (state: state) => {
        //             let rate
        //             if (isSmallGiantessFunc(state)) {
        //                 rate = 1 / 4
        //             }
        //             else {
        //                 rate = 1 / 16 * getSettingFactorAffectBiggerRateFunc(state)
        //             }
        //             return isRandomRateFunc(rate * getSettingFactorAffectBiggerRateFunc(state))
        //         },
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Bigger,
        //         children: [
        //         ]
        //     },
        //     {
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //         returnFailCondition: (state: state) => {
        //             let factor
        //             if (
        //                 getNearestTargetCountFunc(state, targetType.MilltaryBuilding) > 3 ||
        //                 getNearestTargetCountFunc(state, targetType.Soldier) > 15 || getNearestTargetCountFunc(state, targetType.MilltaryVehicle) > 7
        //             ) {
        //                 factor = 0.5
        //             }
        //             else {
        //                 factor = 1
        //             }
        //             return isRandomRateFunc(1 / 6 * factor)
        //         },
        //         node: actionNode.ChangePose,
        //         children: [
        //         ]
        //     },
        //     {
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 4),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(2 / 3),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 5),
        //         // returnFailCondition: (state: state) => true,
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2 * (1 / getSettingFactorAffectFirstBiggerRateFunc(state))),
        //         returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => isRandomRateFunc(1 / 2),
        //         // returnFailCondition: (state: state) => true,
        //         node: actionNode.Rest,
        //         children: []
        //     }
        // ]


    }
}