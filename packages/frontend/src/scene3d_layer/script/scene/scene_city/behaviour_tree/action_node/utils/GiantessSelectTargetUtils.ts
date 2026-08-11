import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { actionNode, actionNodeFunc, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, personality, targetType, usedGirl, usedGirlEnum } from "../../../type/StateType"
import { getPersonality, getVeryNearestTargetCount, markFinish, setTarget } from "../../BehaviourTreeManager"
import { state } from "../../../../../../type/StateType"
import { Box3, CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, getPivotWorldPosition, getActualHeight, getGiantessCamp } from "../../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../../manage/city1/PathFind"
import { isPlayerGiantess, isTriggerAction, triggerAction } from "../../../girl/Girl"
import { getIsDebug } from "../../../../Scene"
import { getGirlScale, isLittleCharacterType, setGirlPosition } from "../../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { characterType, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"
import { getNearGirlDistance, isInGirlAttackRange, isNearGirl } from "../../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import * as LittleMan from "../../../little_man/LittleMan"
import * as LittleManTransform from "../../../little_man/Transform"
import { getStateMachine, isBuildings } from "../../../manage/city1/Buildings"
import * as Citiyzen from "../../../manage/city1/Citiyzen"
import * as Soldier from "../../../manage/city1/soldier/Soldier"
import * as MilltaryVehicle from "../../../manage/city1/milltary_vehicle/MilltaryVehicle"
import * as Tank from "../../../manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../../../manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../../../manage/city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "../../../manage/city1/milltary_building/MilltaryBuilding"
import * as ShellTurret from "../../../manage/city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../../manage/city1/milltary_building/MissileTurret"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Console } from "meta3d-jiehuo-abstract"
import * as EliteGiantessMod from "../../../../../../mod/EliteGiantessMod"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getRandomBoxEdgePoint } from "../../../utils/Box3Utils"
import { getGiantessControllerBlockState, getSelectTargetPrior } from "../../../../../../mod/PropOtherMod"
import { targetPrior } from "prop-artifact-giantesscontroller/src/script/State"
import { isNotAttackLittleMan } from "../../../utils/AttackTargetUtils"
import { hasPickData } from "../../../girl/PickPoseUtils"
import { getNearDistance } from "../../../manage/city1/WholeScene"
import { getAllAliveArmyData, getFsmStateData } from "../../../utils/ArmyUtils"
import { getLockedAttackTargetToPlayer } from "../../../manage/mission/Mission"
import { getCampExn } from "../../../manage/city1/Army"
// import { buildAPI } from "../../../../../../mod/Mod"

const _q = new Quaternion();
const _v1 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

export type visibleData = {
    index: staticLODContainerIndex | lodQueueIndex,
    name: name,
    // position: nullable<Vector3>,
    position: Vector3,
    queue: nullable<LODQueue>,
}

export let getAllAliveBuildingData = (state: state): Array<visibleData> => {
    let abstractState = getAbstractState(state)

    return LOD.getAllStaticLODContainerIndices(abstractState).filter(index => {
        // return LOD.getStatus(abstractState, index).isVisible && isBuildings(LOD.getName(abstractState, index))
        // return LOD.getStatus(abstractState, index).isCollisionable && isBuildings(LOD.getName(abstractState, index))
        return LOD.isAlive(abstractState, index) && isBuildings(LOD.getName(abstractState, index))
    }).map(index => {
        return {
            index: index,
            name: LOD.getName(abstractState, index),
            // position: TransformUtils.getPositionFromMatrix4(LOD.getTransform(abstractState, index)),
            position: getRandomBoxEdgePoint(LOD.getBox(abstractState, index)),
            queue: NullableUtils.getEmpty()
        }
    })
}

let _getAllAliveDynamicData = (state: state, [getAllModelQueuesFunc, getModelQueueIndexFunc]): Array<visibleData> => {
    let abstractState = getAbstractState(state)

    return getAllModelQueuesFunc(state).reduce((result, queue) => {
        return result.concat(queue.getAliveNames().map(name => [queue, name]))
    }, [])
        .map(([queue, name]) => {
            let index = getModelQueueIndexFunc(state, name)

            return {
                index: index,
                name: name,
                position: TransformUtils.getPositionFromMatrix4(queue.getTransform(index)),
                // position: NullableUtils.getEmpty(),
                queue: NullableUtils.return_(queue)
            }
        })
}

let _getAllAliveCityzenData = (state: state): Array<visibleData> => {
    return _getAllAliveDynamicData(state, [Citiyzen.getAllModelQueues, Citiyzen.getModelQueueIndex])
}

export let getAllAliveSoldierData = (state: state): Array<visibleData> => {
    return _getAllAliveDynamicData(state, [Soldier.getAllModelQueues, Soldier.getModelQueueIndex])
}

export let getAllAliveMilltaryVehicleData = (state: state): Array<visibleData> => {
    return _getAllAliveDynamicData(state, [Tank.getAllModelQueues, MilltaryVehicle.getModelQueueIndex]).concat(
        _getAllAliveDynamicData(state, [MissileVehicle.getAllModelQueues, MilltaryVehicle.getModelQueueIndex])
    ).concat(
        _getAllAliveDynamicData(state, [FlameVehicle.getAllModelQueues, FlameVehicle.getModelQueueIndex])
    )
}

export let getAllAliveMilltaryBuildingData = (state: state): Array<visibleData> => {
    return _getAllAliveDynamicData(state, [ShellTurret.getAllModelQueues, MilltaryBuilding.getModelQueueIndex]).concat(
        _getAllAliveDynamicData(state, [MissileTurret.getAllModelQueues, MissileTurret.getModelQueueIndex])
    )
}

export let getAllAliveEliteGiantessData = (state: state): Array<visibleData> => {
    // return _getAllAliveDynamicData(state, [EliteGiantess.getAllModelQueues, EliteGiantess.getModelQueueIndex])
    return _getAllAliveDynamicData(state, [EliteGiantessMod.getAllModelQueues, EliteGiantessMod.getModelQueueIndex])
}

let _filterCamp = (data: Array<visibleData>, state, camp_) => {
    return data.filter(d => {
        return getCampExn(state, d.name) != camp_
    })
}

let _findRandomNearPosition = (data: Array<visibleData>, state, targetPosition: Vector3, range: number, camp_): nullable<visibleData> => {
    data = _filterCamp(data, state, camp_)

    if (data.length == 0) {
        return NullableUtils.getEmpty()
    }

    // range *= range

    // return NumberUtils.randomSelect(data.slice(1).reduce<Array<visibleData>>((result, d) => {
    return NumberUtils.randomSelect(data.reduce<Array<visibleData>>((result, d) => {
        let { position } = d

        let distance = position.distanceTo(targetPosition)

        if (distance > range) {
            return result
        }

        // if (distance < result[1]) {
        //     return [d, distance]
        // }
        return ArrayUtils.push(result, d)
        // }, [[], data[0].position.distanceToSquared(targetPosition)])
    }, [])
    )
}

let _findNearPosition = (data: Array<visibleData>, state, targetPosition: Vector3, camp_, distance): Array<visibleData> => {
    data = _filterCamp(data, state, camp_)

    if (data.length == 0) {
        return []
    }

    return data.reduce((result, d) => {
        let { position } = d

        if (position.distanceTo(targetPosition) < distance) {
            return ArrayUtils.push(result, d)
        }

        return result
    }, [])
}

let _findNearstPosition = (data: Array<visibleData>, state, targetPosition: Vector3, camp_): nullable<visibleData> => {
    data = _filterCamp(data, state, camp_)

    if (data.length == 0) {
        return NullableUtils.getEmpty()
    }

    if (data.length == 1) {
        return NullableUtils.return_(data[0])
    }

    return NullableUtils.return_(
        TupleUtils.getTuple2First(
            data.slice(1).reduce<[visibleData, number]>((result, d) => {
                let { position } = d

                let distance = position.distanceTo(targetPosition)

                if (distance < result[1]) {
                    return [d, distance]
                }

                return result
            }, [data[0], data[0].position.distanceTo(targetPosition)])
        )
    )
}


export let selectLittleMan = (state, usedGirl, isJudgeNear): Promise<behaviourTreeNodeResult> => {
    if (
        !isLittleCharacterType(state)
        ||
        // !state.config.littleManConfig.isSelectLittleMan
        isNotAttackLittleMan(state)
        || (
            isJudgeNear
            &&
            !isNearGirl(state, LittleManTransform.getPosition(state))
        )
    ) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    Console.log("selectLittleMan")

    state = setTarget(state, usedGirl, {
        isAliveFunc: (state) => {
            return true
        },
        getPositionFunc: (state) => {
            return LittleManTransform.getPosition(state)
        },
        getStateMachineFunc: (state, name) => {
            return LittleMan.getStateMachine(state)
        },

        name: LittleMan.getName(),
        index: NullableUtils.getEmpty(),
        type: targetType.LittleMan
    }, LittleMan.getBox(state))

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}

export let findRandomNearData = (state, getAllAliveDynamicDataFunc, position, range, camp_) => {
    return _findRandomNearPosition(getAllAliveDynamicDataFunc(state), state, position, range, camp_)
}

export let findNearestData = (state, getAllAliveDynamicDataFunc, position, camp_) => {
    return _findNearstPosition(getAllAliveDynamicDataFunc(state), state, position, camp_)
}

export let findNearData = (state, getAllAliveDynamicDataFunc, position, camp_, distance) => {
    return _findNearPosition(getAllAliveDynamicDataFunc(state), state, position, camp_, distance)
}


// let _selectRandomNearDynamicObj = (getAllAliveDynamicDataFunc, targetType_): (state: state, usedGirl: usedGirl, isJudgeNear: boolean, range?: number) => Promise<behaviourTreeNodeResult> => {
//     // return (state: state, isJudgeNear, range = 100 * Math.sqrt(getActualHeight(state)) / 4) => {
//     return (state: state, usedGirl, isJudgeNear, range = getNearGirlDistance(state, usedGirl)) => {
//         return NullableUtils.getWithDefault(
//             NullableUtils.map(
//                 nearestData => {
//                     if (isJudgeNear && !isNearGirl(state, nearestData.position)) {
//                         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//                     }

//                     Console.log(`selectRandomNearDynamicObj:${nearestData.name}`)


//                     state = setTarget(state, usedGirl, {
//                         isAliveFunc: (state) => {
//                             // return LOD.isAlive(getAbstractState(state), nearestData.index)
//                             return NullableUtils.getExn(nearestData.queue).isAlive(nearestData.index)
//                         },
//                         getPositionFunc: (state) => {
//                             return TransformUtils.getPositionFromMatrix4(NullableUtils.getExn(nearestData.queue).getTransform(nearestData.index))
//                         },
//                         getStateMachineFunc: (state, name) => {
//                             return TupleUtils.getTuple2Last(NullableUtils.getExn(getFsmStateData(state, name)))
//                         },

//                         // position: nearestData.position,
//                         name: nearestData.name,
//                         index: NullableUtils.return_(nearestData.index),
//                         type: targetType_
//                     }, NullableUtils.getExn(nearestData.queue).getBox(nearestData.index))

//                     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
//                 },
//                 isJudgeNear ?
//                     _findRandomNearPosition(getAllAliveDynamicDataFunc(state), state, getPivotWorldPosition(state, usedGirl), range, getGiantessCamp(state, usedGirl))
//                     :
//                     NullableUtils.getWithDefaultFunc(_findRandomNearPosition(getAllAliveDynamicDataFunc(state), state, getPivotWorldPosition(state, usedGirl), range, getGiantessCamp(state, usedGirl)),
//                         () => _findNearstPosition(getAllAliveDynamicDataFunc(state), state, getPivotWorldPosition(state, usedGirl), getGiantessCamp(state, usedGirl))
//                     )
//             ),
//             Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//         )
//     }
// }

let _selectRandomNearDynamicObj = (targetType_): (state: state, usedGirl: usedGirl, nearestData: visibleData) => Promise<behaviourTreeNodeResult> => {
    // return (state: state, isJudgeNear, range = 100 * Math.sqrt(getActualHeight(state)) / 4) => {
    return (state: state, usedGirl, nearestData: visibleData) => {
        Console.log(`selectRandomNearDynamicObj:${nearestData.name}`)


        state = setTarget(state, usedGirl, {
            isAliveFunc: (state) => {
                // return LOD.isAlive(getAbstractState(state), nearestData.index)
                return NullableUtils.getExn(nearestData.queue).isAlive(nearestData.index)
            },
            getPositionFunc: (state) => {
                return TransformUtils.getPositionFromMatrix4(NullableUtils.getExn(nearestData.queue).getTransform(nearestData.index))
            },
            getStateMachineFunc: (state, name) => {
                return TupleUtils.getTuple2Last(NullableUtils.getExn(getFsmStateData(state, name)))
            },

            // position: nearestData.position,
            name: nearestData.name,
            index: NullableUtils.return_(nearestData.index),
            type: targetType_
        }, NullableUtils.getExn(nearestData.queue).getBox(nearestData.index))

        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])

    }
}

export let selectRandomNearCityzen = _selectRandomNearDynamicObj(targetType.Cityzen)

export let selectRandomNearSoldier = _selectRandomNearDynamicObj(targetType.Soldier)

export let selectRandomNearMilltaryVehicle = _selectRandomNearDynamicObj(targetType.MilltaryVehicle)

export let selectRandomNearMilltaryBuilding = _selectRandomNearDynamicObj(targetType.MilltaryBuilding)

export let selectRandomNearEliteGiantess = _selectRandomNearDynamicObj(targetType.EliteGiantess)

export let selectRandomNearBuilding = (state, usedGirl, range = 100): Promise<behaviourTreeNodeResult> => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            nearestData => {
                Console.log(`selectRandomNearBuilding: ${nearestData.name}`)

                state = setTarget(state, usedGirl, {
                    isAliveFunc: (state) => {
                        return LOD.isAlive(getAbstractState(state), nearestData.index)
                    },
                    getPositionFunc: (state) => {
                        return nearestData.position
                    },
                    getStateMachineFunc: (state, name) => {
                        return getStateMachine(state, name)
                    },

                    name: nearestData.name,
                    index: NullableUtils.return_(nearestData.index),
                    type: targetType.Building
                }, LOD.getBox(getAbstractState(state), nearestData.index))

                return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
            },
            NullableUtils.getWithDefaultFunc(_findRandomNearPosition(getAllAliveBuildingData(state), state, getPivotWorldPosition(state, usedGirl), range, getGiantessCamp(state, usedGirl)),
                () => _findNearstPosition(getAllAliveBuildingData(state), state, getPivotWorldPosition(state, usedGirl), getGiantessCamp(state, usedGirl))
            )
        ),
        Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    )
}

export let selectTargetBySelectTargetPrior = (state, usedGirl) => {
    // switch (getLittleManSettingInGame(state).selectTargetPrior) {
    // let  getModAPI(state)

    // if (hasPickData(state, usedGirl)) {

    // }

    let pivotPosition = getPivotWorldPosition(state, usedGirl)
    let camp = getGiantessCamp(state, usedGirl)

    // switch (getGiantessControllerBlockState(state).selectTargetPrior) {
    switch (getSelectTargetPrior(state, usedGirl)) {
        case targetPrior.LittleMan:
            return selectLittleMan(state, usedGirl, false)
        case targetPrior.MilltaryVehicle:
            return NullableUtils.getWithDefault(
                NullableUtils.map((data) => {
                    return selectRandomNearMilltaryVehicle(state, usedGirl, data)
                },
                    _findNearstPosition(getAllAliveMilltaryBuildingData(state), state, pivotPosition, camp)
                ),
                Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            )
        case targetPrior.MilltaryBuilding:
            return NullableUtils.getWithDefault(
                NullableUtils.map((data) => {
                    return selectRandomNearMilltaryBuilding(state, usedGirl, data)
                },
                    _findNearstPosition(getAllAliveMilltaryBuildingData(state), state, pivotPosition, camp)
                ),
                Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            )
        case targetPrior.Soldier:
            return NullableUtils.getWithDefault(
                NullableUtils.map((data) => {
                    return selectRandomNearSoldier(state, usedGirl, data)
                },
                    _findNearstPosition(getAllAliveSoldierData(state), state, pivotPosition, camp)
                ),
                Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            )
        // case targetPrior.Cityzen:
        //     return selectRandomNearCityzen(state, false)
        case targetPrior.Building:
            return selectRandomNearBuilding(state, usedGirl)
        case targetPrior.EliteGiantess:
            return NullableUtils.getWithDefault(
                NullableUtils.map((data) => {
                    return selectRandomNearEliteGiantess(state, usedGirl, data)
                },
                    _findNearstPosition(getAllAliveEliteGiantessData(state), state, pivotPosition, camp)
                ),
                Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
            )
        default:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }
}


export let selectTargetByDefault = (state, usedGirl) => {
    if (getLockedAttackTargetToPlayer(state) && !isPlayerGiantess(state, usedGirl)) {
        return selectLittleMan(state, usedGirl, false)
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}

let _decideFactorByNearestTargetCount = (nearestTargetCount, personality_, count1, count2) => {
    let factor
    switch (personality_) {
        case personality.Aggressive:
            if (
                nearestTargetCount > count2
            ) {
                factor = 3
            }
            else if (nearestTargetCount > count1) {
                factor = 2
            }
            else {
                factor = 1
            }
            break
        case personality.Strategic:
        case personality.Defensive:
            if (
                nearestTargetCount > count2
            ) {
                // factor = 0.25
                factor = 1
            }
            else if (nearestTargetCount > count1) {
                // factor = 0.5
                factor = 2
            }
            else {
                // factor = 1
                factor = 3
            }
            break
        default:
            factor = 1
            break
    }

    return factor
}

export let selectTarget = (state: state, usedGirl, isSelectLittleMan, isSelectEliteGiantess, isSelectBuilding = true) => {
    let data = getAllAliveArmyData(state)
    let personality_ = getPersonality(state, usedGirl)
    let pivotPosition = getPivotWorldPosition(state, usedGirl)
    let camp = getGiantessCamp(state, usedGirl)

    let selectRate = {
        [personality.Strategic]: {
            isSelectEliteGiantessRate: 2,
            isSelectLittleManRate: 3,
            isSelectBuildingRate: 0.5,
            isSelectSoldierRate: 1,
            isSelectMilltaryVehicleRate: 1.5,
            isSelectMilltaryBuildingRate: 2
        },
        [personality.Aggressive]: {
            isSelectEliteGiantessRate: 1,
            isSelectLittleManRate: 1,
            isSelectBuildingRate: 1,
            isSelectSoldierRate: 1,
            isSelectMilltaryVehicleRate: 1,
            isSelectMilltaryBuildingRate: 1
        },
        [personality.Defensive]: {
            isSelectEliteGiantessRate: 2,
            isSelectLittleManRate: 0.7,
            isSelectBuildingRate: 0.1,
            isSelectSoldierRate: 1.2,
            isSelectMilltaryVehicleRate: 1.5,
            isSelectMilltaryBuildingRate: 2
        },
        [personality.Playful]: {
            isSelectEliteGiantessRate: 1.5,
            isSelectLittleManRate: 1.5,
            isSelectBuildingRate: 1.2,
            isSelectSoldierRate: 1.5,
            isSelectMilltaryVehicleRate: 1,
            isSelectMilltaryBuildingRate: 1
        },
    }

    // 收集所有可能的目标及其权重
    let targetOptions: Array<{ type: targetType, weight: number, nearestData: nullable<visibleData> }> = []

    // 精英巨大娘
    if (isSelectEliteGiantess) {
        let nearestData = _findNearstPosition(getAllAliveEliteGiantessData(state), state, pivotPosition, camp)
        if (!NullableUtils.isNullable(nearestData)) {
            let nearestTargetCount = getVeryNearestTargetCount(state, data, targetType.EliteGiantess)
            let factor = _decideFactorByNearestTargetCount(nearestTargetCount, personality_, 2, 5)
            let weight = selectRate[personality_].isSelectEliteGiantessRate * factor
            targetOptions.push({
                type: targetType.EliteGiantess,
                weight: weight,
                nearestData: nearestData
            })
        }
    }

    // 小人物
    if (isSelectLittleMan) {
        // 对于小人物，我们需要特殊处理，因为它没有使用 _findNearstPosition
        let littleManPosition = LittleManTransform.getPosition(state)
        // let distance = littleManPosition.distanceTo(pivotPosition)
        if (isNearGirl(state, littleManPosition)) {
            let weight = selectRate[personality_].isSelectLittleManRate
            targetOptions.push({
                type: targetType.LittleMan,
                weight: weight,
                nearestData: {
                    index: NullableUtils.getEmpty(),
                    name: LittleMan.getName(),
                    position: littleManPosition,
                    queue: NullableUtils.getEmpty()
                } as visibleData
            })
        }
    }

    // 军事建筑
    let milltaryBuildingNearest = _findNearstPosition(getAllAliveMilltaryBuildingData(state), state, pivotPosition, camp)
    if (!NullableUtils.isNullable(milltaryBuildingNearest)) {
        let nearestTargetCount = getVeryNearestTargetCount(state, data, targetType.MilltaryBuilding)
        let factor = _decideFactorByNearestTargetCount(nearestTargetCount, personality_, 2, 5)
        let weight = selectRate[personality_].isSelectMilltaryBuildingRate * factor
        targetOptions.push({
            type: targetType.MilltaryBuilding,
            weight: weight,
            nearestData: milltaryBuildingNearest
        })
    }

    // 军事车辆
    let milltaryVehicleNearest = _findNearstPosition(getAllAliveMilltaryVehicleData(state), state, pivotPosition, camp)
    if (!NullableUtils.isNullable(milltaryVehicleNearest)) {
        let nearestTargetCount = getVeryNearestTargetCount(state, data, targetType.MilltaryVehicle)
        let factor = _decideFactorByNearestTargetCount(nearestTargetCount, personality_, 4, 8)
        let weight = selectRate[personality_].isSelectMilltaryVehicleRate * factor
        targetOptions.push({
            type: targetType.MilltaryVehicle,
            weight: weight,
            nearestData: milltaryVehicleNearest
        })
    }

    // 士兵
    let soldierNearest = _findNearstPosition(getAllAliveSoldierData(state), state, pivotPosition, camp)
    if (!NullableUtils.isNullable(soldierNearest)) {
        let nearestTargetCount = getVeryNearestTargetCount(state, data, targetType.Soldier)
        let factor = _decideFactorByNearestTargetCount(nearestTargetCount, personality_, 4, 8)
        let weight = selectRate[personality_].isSelectSoldierRate * factor
        targetOptions.push({
            type: targetType.Soldier,
            weight: weight,
            nearestData: soldierNearest
        })
    }

    // 建筑
    if (isSelectBuilding) {
        let buildingNearest = _findNearstPosition(getAllAliveBuildingData(state), state, pivotPosition, camp)
        if (!NullableUtils.isNullable(buildingNearest)) {
            let weight = selectRate[personality_].isSelectBuildingRate * 2 // 乘以2保持与原逻辑一致
            targetOptions.push({
                type: targetType.Building,
                weight: weight,
                nearestData: buildingNearest
            })
        }
    }

    // 如果没有可选目标，直接返回失败
    if (targetOptions.length === 0) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    // 根据权重随机选择一个目标类型
    let totalWeight = targetOptions.reduce((sum, option) => sum + option.weight, 0)
    let randomValue = Math.random() * totalWeight
    let currentWeight = 0
    let selectedOption = null

    for (let option of targetOptions) {
        currentWeight += option.weight
        if (randomValue <= currentWeight) {
            selectedOption = option
            break
        }
    }

    if (!selectedOption) {
        selectedOption = targetOptions[0] // 保底选择第一个
    }

    // 根据选择的类型执行相应的选择函数
    switch (selectedOption.type) {
        case targetType.EliteGiantess:
            return selectRandomNearEliteGiantess(state, usedGirl, selectedOption.nearestData).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected EliteGiantess (nearest)`)
                }
                return [state, result]
            })
        case targetType.LittleMan:
            return selectLittleMan(state, usedGirl, false).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected LittleMan (nearest)`)
                }
                return [state, result]
            })
        case targetType.MilltaryBuilding:
            return selectRandomNearMilltaryBuilding(state, usedGirl, selectedOption.nearestData).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected MilltaryBuilding (nearest)`)
                }
                return [state, result]
            })
        case targetType.MilltaryVehicle:
            return selectRandomNearMilltaryVehicle(state, usedGirl, selectedOption.nearestData).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected MilltaryVehicle (nearest)`)
                }
                return [state, result]
            })
        case targetType.Soldier:
            return selectRandomNearSoldier(state, usedGirl, selectedOption.nearestData).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected Soldier (nearest)`)
                }
                return [state, result]
            })
        case targetType.Building:
            return selectRandomNearBuilding(state, usedGirl).then(([state, result]) => {
                if (result === behaviourTreeNodeExecuteResult.Success) {
                    Console.log(`selectTarget: Selected Building (nearest)`)
                }
                return [state, result]
            })
        default:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }
}
