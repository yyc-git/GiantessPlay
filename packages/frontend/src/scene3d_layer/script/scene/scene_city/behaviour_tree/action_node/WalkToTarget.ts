import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getTarget, hasTarget, markFinish } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { computeGirlBox, getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, getPivotWorldPosition, setCenterExceptY, setGirlRotation, setGirlRotationAndLock, setPivotWorldPositionAndUpdateBox, unlockGirlRotation } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGridForGirl, getStep, isGetGridForGirlBigger } from "../../manage/city1/PathFind"
import { getCenter, getGirlState, getName, isTriggerAction, setGirlState, triggerAction } from "../../girl/Girl"
import { getIsDebug, getIsNotTestPerf } from "../../../Scene"
import { getGirlScale, setGirlPosition } from "../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { road, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"

import { getAttackRangeFactor, isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { isMoveCollisioned } from "../../girl/Move"
import { getCurrentPose } from "../../girl/Pose"
import { actionName } from "../../data/DataType"
import { isChangeScaling } from "../../girl/Animation"
import { Console } from "meta3d-jiehuo-abstract"
import { isStressingState } from "../../utils/FSMStateUtils"
import { getStateMachine } from "../../girl/FSMState"
import { lookatTarget } from "./Utils"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"

// enum faceAxis {
//     PX,
//     NX,
//     PZ,
//     NZ
// }


enum zone {
    PXNZ,
    PXPZ,
    NXPZ,
    NXNZ
}

export let computeAndSetDirectionData = (state: state, previousPosition: Vector2, nextPosition: Vector2): state => {
    let nextZone
    if (nextPosition.x >= previousPosition.x && nextPosition.y < previousPosition.y) {
        nextZone = zone.PXNZ
    }
    else if (nextPosition.x >= previousPosition.x && nextPosition.y >= previousPosition.y) {
        nextZone = zone.PXPZ
    }
    else if (nextPosition.x < previousPosition.x && nextPosition.y >= previousPosition.y) {
        nextZone = zone.NXPZ
    }
    else if (nextPosition.x < previousPosition.x && nextPosition.y < previousPosition.y) {
        nextZone = zone.NXNZ
    }
    else {
        throw new Error("err")
    }


    let forward = 0
    let back = 0
    let right = 0
    let left = 0

    // let distance = nextPosition.distanceTo(previousPosition)
    // let x = (nextPosition.x - previousPosition.x) / distance
    // let y = (nextPosition.y - previousPosition.y) / distance
    let ndir = nextPosition.clone().sub(previousPosition).normalize()
    let x = ndir.x
    let y = ndir.y

    switch (nextZone) {
        case zone.PXNZ:
            right = x
            forward = -y
            // back = -y
            break
        case zone.PXPZ:
            right = x
            back = y
            // forward = y
            break
        case zone.NXPZ:
            left = -x
            back = y
            // forward = y
            break
        case zone.NXNZ:
            left = -x
            forward = -y
            // back = -y
            break
    }

    return setAbstractState(state, CameraControls.setDirectionData(getAbstractState(state), road.Giantess, [
        forward,
        back,
        left,
        right
    ]))
}

export let convertPathPointToVec3Position = (pathPoint: Vector2) => {
    return new Vector3(pathPoint.x, 0, pathPoint.y)
}

export let convertVec3PositionToPathPoint = (position: Vector3) => {
    return new Vector2(position.x, position.z)
}

let _lookatTarget = (state: state) => {
    return lookatTarget(state)
}

export let stopMove = (state: state, id, result) => {
    state = setAbstractState(state, CameraControls.resetDirectionData(getAbstractState(state), road.Giantess))

    return markFinish(state, id, result)
}

// let _isNotMove = (state: state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map((lastGirlPosition) => {
//             return getGirlPosition(state).equals(
//                 lastGirlPosition
//             )
//         }, getBehaviourTreeState(state).lastGirlPosition),
//         false
//     )
// }

export let isReach = (state, nextPoint: Vector2) => {
    let factor = 1
    switch (getCurrentPose(state)) {
        case pose.Stand:
        case pose.Pick:
            factor = 1
            break
        case pose.Crawl:
            factor = 2
            break
    }

    return Vector2Utils.isNearlyEqual(convertVec3PositionToPathPoint(getPivotWorldPosition(state)), nextPoint, Math.pow(1.5 * getGirlScale(state) / 10, 2) * factor)
}

let _isFarawayFromPath = (state: state, previousPoint: Vector2, nextPoint: Vector2) => {
    let currentPoint = convertVec3PositionToPathPoint(getPivotWorldPosition(state))

    return currentPoint.distanceTo(previousPoint) + currentPoint.distanceTo(nextPoint) > 1.5 * nextPoint.distanceTo(previousPoint)

    // return convertVec3PositionToPathPoint(getPivotWorldPosition(state)).distanceTo(
    //     nextPoint
    // ) >= 6 * getStep(getGridForGirl(state))
}

let _move = (state: state, id, pathIndex, path, attackRange): Promise<state> => {
    let stopMoveResult = NullableUtils.getEmpty()

    if (!hasTarget(state)) {
        return stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)
    }


    if (pathIndex + 1 >= path.length
        || isInGirlAttackRange(state, NullableUtils.getExn(getTarget(state)).getPositionFunc(state), attackRange, NullableUtils.getEmpty())
        // || isMoveCollisioned(state)
    ) {
        stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Success)
    }
    else if (
        isMoveCollisioned(state)
        || isChangeScaling(state)
        || isStressingState(getStateMachine(state))
    ) {
        stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Fail)
    }

    if (!NullableUtils.isNullable(stopMoveResult)) {
        state = _lookatTarget(state)

        return stopMove(state, id, NullableUtils.getExn(stopMoveResult))
    }



    state = computeAndSetDirectionData(state, path[pathIndex], path[pathIndex + 1])

    // state = setBehaviourTreeState(state, {
    //     ...getBehaviourTreeState(state),
    //     lastGirlPosition: NullableUtils.return_(getGirlPosition(state).clone())
    // })

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        if (isReach(state, path[pathIndex + 1])) {
            state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[pathIndex + 1]))
            // state = setPivotWorldPositionAndUpdateBox(state, path[pathIndex + 1])


            // let { isAliveFunc } = getTarget(state)
            // if (!isAliveFunc(state)) {
            //     state = stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)

            //     return Promise.resolve(state)
            // }
            if (!hasTarget(state)) {
                return stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)
            }



            return _move(state, id, pathIndex + 1, path, attackRange)
        }
        else if (_isFarawayFromPath(state, path[pathIndex], path[pathIndex + 1])) {
            Console.warn(`far away from ${path[pathIndex + 1].toArray()}`)

            // Console.warn(
            //     convertVec3PositionToPathPoint(getPivotWorldPosition(state)),
            //     convertVec3PositionToPathPoint(getPivotWorldPosition(state)).distanceTo(
            //         path[pathIndex + 1]
            //     )
            // )


            return stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)
        }

        return _move(state, id, pathIndex, path, attackRange)
    }, 1)))
}

// let _removeDiagonalMovementPathPoint = (path: Array<Vector2>) => {
//     if (path.length < 2) {
//         return path
//     }

//     let firstPoint = path[0]
//     let secondPoint = path[1]

//     if (firstPoint.x != secondPoint.x && firstPoint.y != secondPoint.y) {
//         return path.slice(1)
//     }

//     return path
// }


export let optimizeFirstPathPoint = (path: Array<Vector2>, state: state) => {
    if (path.length < 2) {
        return path
    }

    let firstPoint = path[0]
    let secondPoint = path[1]

    if (firstPoint.distanceTo(secondPoint) < getStep(getGridForGirl(state)) * 0.8) {
        return path.slice(1)
    }

    return path
}

let _computeFindPathRangeSquared = (state: state, attackRange_: attackRange): number => {
    // if (isGetGridForGirlBigger(state)) {
    //     return NullableUtils.getEmpty<number>()
    // }

    let { type } = NullableUtils.getExn(getTarget(state))

    let factor, minValue
    switch (type) {
        case targetType.Building:
            factor = 1
            minValue = 4
            break
        default:
            // factor = 0.5
            // minValue = 2
            factor = 0.2
            minValue = 1
            break
    }

    let rangeFactor = getAttackRangeFactor(attackRange_)

    return Math.pow(
        NumberUtils.clamp(
            getGirlScale(state) * 0.8
            * (getStep(getGridForGirl(state)) / 10),
            minValue,
            8
        ), 2) * factor * rangeFactor
}

// let getPivotWorldPosition = (state: state) => {
//     switch (getCurrentPose(state)) {
//         case pose.Stand:
//         case pose.Pick:
//             return getGirlPosition(state)
//         case pose.Crawl:
//             return getCenter(state)
//     }
// }

// let setPivotWorldPositionAndUpdateBox = (state: state, position: Vector2) => {
//     switch (getCurrentPose(state)) {
//         case pose.Stand:
//         case pose.Pick:
//             return setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(position))
//         case pose.Crawl:
//             return setCenterExceptY(state, position)
//     }
// }

export let walkToTarget: actionNodeFunc = (state, id, config) => {
    Console.log("walkToTarget")

    if (!hasTarget(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    let { getPositionFunc } = getTarget(state)

    let attackRange = NullableUtils.getExn(config)

    let position = getPositionFunc(state)

    if (isInGirlAttackRange(state, position, attackRange, NullableUtils.getEmpty())) {
        // state = _lookatTarget(state)

        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    }


    // let girlPosition = getPivotWorldPosition(state)

    let finder = PathFind.createAStarFinder()

    // finder.diagonalMovement

    // const minInterval = 50

    let data = PathFind.findPath(getAbstractState(state), finder,
        // convertVec3PositionToPathPoint(girlPosition),
        convertVec3PositionToPathPoint(getPivotWorldPosition(state)),
        convertVec3PositionToPathPoint(position),
        getGridForGirl(state),
        getName(),
        getIsDebug(state),
        // minInterval,
        NullableUtils.getEmpty(),
        NullableUtils.return_(_computeFindPathRangeSquared(state, attackRange))
    )
    state = setAbstractState(state, data[0])
    let path = data[1]

    // Console.log(path)

    // Console.log(
    //     convertVec3PositionToPathPoint(getPivotWorldPosition(state))
    // )

    if (path.length > 1) {
        // path = _removeDiagonalMovementPathPoint(path)

        // state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[0]))

        path = optimizeFirstPathPoint(path, state)
        state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[0]))



        // Console.log(
        //     convertVec3PositionToPathPoint(getPivotWorldPosition(state))
        // )


        if (getIsDebug(state) && getIsNotTestPerf(state)) {
            PathFind.showFindedPath(getAbstractState(state), path, NumberUtils.randomHexColor(), 0.005)
        }


        state = markIsRunning(state, true)


        // state = setGirlRotation(state, NullableUtils.getExn(getGirlState(state).initialQuaternion))
        state = unlockGirlRotation(state)


        return _move(state, id, 0, path, attackRange).then(state => {
            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    }

    // state = markFinish(state, id, behaviourTreeNodeExecuteResult.Success)

    // return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}
