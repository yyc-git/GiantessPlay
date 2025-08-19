import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, targetPrior, targetType } from "../../type/StateType"
import { getNearestTargetCount, markFinish, setTarget } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, getPivotWorldPosition } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../manage/city1/PathFind"
import { getGirlState, getName, isTriggerAction, setGirlState, triggerAction } from "../../girl/Girl"
import { getIsDebug } from "../../../Scene"
import { getGirlScale, getLittleManSettingInGame, setGirlPosition } from "../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { road, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"
import { isInGirlAttackRange, isNearGirl } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import * as LittleMan from "../../little_man/LittleMan"
import * as LittleManTransform from "../../little_man/Transform"
import { isBuildings } from "../../manage/city1/Buildings"
import * as Citiyzen from "../../manage/city1/Citiyzen"
import * as Soldier from "../../manage/city1/soldier/Soldier"
import * as MilltaryVehicle from "../../manage/city1/milltary_vehicle/MilltaryVehicle"
import * as Tank from "../../manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../../manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../../manage/city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "../../manage/city1/milltary_building/MilltaryBuilding"
import * as ShellTurret from "../../manage/city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../manage/city1/milltary_building/MissileTurret"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Console } from "meta3d-jiehuo-abstract"

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

let _getAllAliveBuildingData = (state: state): Array<visibleData> => {
    let abstractState = getAbstractState(state)

    return LOD.getAllStaticLODContainerIndices(abstractState).filter(index => {
        // return LOD.getStatus(abstractState, index).isVisible && isBuildings(LOD.getName(abstractState, index))
        // return LOD.getStatus(abstractState, index).isCollisionable && isBuildings(LOD.getName(abstractState, index))
        return LOD.isAlive(abstractState, index) && isBuildings(LOD.getName(abstractState, index))
    }).map(index => {
        return {
            index: index,
            name: LOD.getName(abstractState, index),
            position: TransformUtils.getPositionFromMatrix4(LOD.getTransform(abstractState, index)),
            queue: NullableUtils.getEmpty()
        }
    })
}

let _getAllAliveDynamicData = (state: state, [getAllModelQueuesFunc, getModelQueueIndexFunc]): Array<visibleData> => {
    let abstractState = getAbstractState(state)

    return getAllModelQueuesFunc(state).reduce((result, queue) => {
        return result.concat(queue.getAliveNames(abstractState).map(name => [queue, name]))
    }, [])
        .map(([queue, name]) => {
            let index = getModelQueueIndexFunc(state, name)

            return {
                index: index,
                name: name,
                position: TransformUtils.getPositionFromMatrix4(queue.transforms[index]),
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

let _findNearstPosition = (data: Array<visibleData>, targetPosition: Vector3): nullable<visibleData> => {
    if (data.length == 0) {
        return NullableUtils.getEmpty()
    }

    return NullableUtils.return_(
        TupleUtils.getTuple2First(
            data.slice(1).reduce<[visibleData, number]>((result, d) => {
                let { position } = d

                let distance = position.distanceToSquared(targetPosition)

                if (distance < result[1]) {
                    return [d, distance]
                }

                return result
            }, [data[0], data[0].position.distanceToSquared(targetPosition)])
        )
    )
}


export let selectLittleMan = (state, isJudgeNear): Promise<behaviourTreeNodeResult> => {
    if (
        // !state.config.littleManConfig.isSelectLittleMan
        isJudgeNear
        &&
        !isNearGirl(state, LittleManTransform.getPosition(state))) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    Console.log("selectLittleMan")

    state = setTarget(state, {
        isAliveFunc: (state) => {
            return true
        },
        getPositionFunc: (state) => {
            return LittleManTransform.getPosition(state)
        },

        name: LittleMan.getName(),
        index: NullableUtils.getEmpty(),
        type: targetType.LittleMan
    }, LittleMan.getBox(state))

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}


let _selectNearestDynamicObj = (getAllAliveDynamicDataFunc, targetType_): (state: state, isJudgeNear: boolean) => Promise<behaviourTreeNodeResult> => {
    return (state: state, isJudgeNear) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(
                nearstData => {
                    if (isJudgeNear && !isNearGirl(state, nearstData.position)) {
                        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
                    }

                    Console.log(`selectNearestDynamicObj:${nearstData.name}`)


                    state = setTarget(state, {
                        isAliveFunc: (state) => {
                            return LOD.isAlive(getAbstractState(state), nearstData.index)
                        },
                        getPositionFunc: (state) => {
                            return TransformUtils.getPositionFromMatrix4(NullableUtils.getExn(nearstData.queue).transforms[nearstData.index])
                        },

                        // position: nearstData.position,
                        name: nearstData.name,
                        index: NullableUtils.return_(nearstData.index),
                        type: targetType_
                    }, nearstData.queue.boxes[nearstData.index])

                    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
                },
                _findNearstPosition(getAllAliveDynamicDataFunc(state), getPivotWorldPosition(state))
            ),
            Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        )
    }
}

let _selectNearestCityzen = _selectNearestDynamicObj(_getAllAliveCityzenData, targetType.Cityzen)

let _selectNearestSoldier = _selectNearestDynamicObj(getAllAliveSoldierData, targetType.Soldier)

let _selectNearestMilltaryVehicle = _selectNearestDynamicObj(getAllAliveMilltaryVehicleData, targetType.MilltaryVehicle)

let _selectNearestMilltaryBuilding = _selectNearestDynamicObj(getAllAliveMilltaryBuildingData, targetType.MilltaryBuilding)

let _selectNearestBuilding = (state): Promise<behaviourTreeNodeResult> => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            nearstData => {
                Console.log(`selectNearestBuilding: ${nearstData.name}`)

                state = setTarget(state, {
                    isAliveFunc: (state) => {
                        return LOD.isAlive(getAbstractState(state), nearstData.index)
                    },
                    getPositionFunc: (state) => {
                        return nearstData.position
                    },

                    name: nearstData.name,
                    index: NullableUtils.return_(nearstData.index),
                    type: targetType.Building
                }, LOD.getBox(getAbstractState(state), nearstData.index))

                return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
            },
            _findNearstPosition(_getAllAliveBuildingData(state), getPivotWorldPosition(state))
        ),
        Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    )
}

export let selectTarget: actionNodeFunc = (state, id) => {
    switch (getLittleManSettingInGame(state).selectTargetPrior) {
        case targetPrior.LittleMan:
            return selectLittleMan(state, false)
        case targetPrior.MilltaryVehicle:
            return _selectNearestMilltaryVehicle(state, false)
        case targetPrior.MilltaryBuilding:
            return _selectNearestMilltaryBuilding(state, false)
        case targetPrior.Soldier:
            return _selectNearestSoldier(state, false)
        case targetPrior.Cityzen:
            return _selectNearestCityzen(state, false)
        case targetPrior.Building:
            return _selectNearestBuilding(state)
        default:
            break
    }


    let factor

    // if (state.config.littleManConfig.isSelectLittleMan ? true : NumberUtils.isRandomRate(1 / 4)) {
    if (NumberUtils.isRandomRate(1 / 4)) {
        return selectLittleMan(state, true)
    }

    if (
        getNearestTargetCount(state, targetType.MilltaryBuilding) > 2
    ) {
        factor = 2
    }
    else {
        factor = 1
    }
    if (NumberUtils.isRandomRate(1 / 4 * factor)) {
        return _selectNearestMilltaryBuilding(state, true)
    }


    if (
        getNearestTargetCount(state, targetType.MilltaryVehicle) > 4
    ) {
        factor = 2
    }
    else {
        factor = 1
    }
    if (NumberUtils.isRandomRate(1 / 4 * factor)) {
        return _selectNearestMilltaryVehicle(state, true)
    }

    if (getNearestTargetCount(state, targetType.Soldier) > 8
    ) {
        factor = 2
    }
    else {
        factor = 1
    }
    if (NumberUtils.isRandomRate(1 / 4 * factor)) {
        return _selectNearestSoldier(state, true)
    }

    if (NumberUtils.isRandomRate(1 / 2)) {
        return _selectNearestBuilding(state)
    }

    return _selectNearestCityzen(state, true)
}