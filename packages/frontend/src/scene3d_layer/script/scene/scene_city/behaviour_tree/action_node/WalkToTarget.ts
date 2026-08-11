import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { clearTarget, getTarget, hasTarget, markFinish } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { computeGirlBoxAndSetToState, getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, getPivotWorldPosition, setCenterExceptY, setGirlRotation, setGirlRotationAndLock, setPivotWorldPositionAndUpdateBox, unlockGirlRotation } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGridForGirl, getStep, isGetGridForGirlBigger } from "../../manage/city1/PathFind"
import { getIsDebug, getIsNotTestPerf } from "../../../Scene"
import { getGirlScale, setGirlPosition } from "../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { characterType, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"

import { getAllValidAttackRanges, getAttackRangeFactor, isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { isMoveCollisioned } from "../../girl/Move"
import { getCurrentPose } from "../../girl/Pose"
import { actionName } from "../../data/DataType"
import { isChangeScaling } from "../../girl/Animation"
import { Console } from "meta3d-jiehuo-abstract"
import { isControlledState } from "../../utils/FSMStateUtils"
import { getStateMachine } from "../../girl/FSMState"
import { lookatTarget } from "./Utils"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"
import { getModAPI } from "../../Mod"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { buildNameByUsedGirl, getCurrentUsedGirls } from "../../girl/Girl"

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

export let computeAndSetDirectionData = (state: state, usedGirl, previousPosition: Vector2, nextPosition: Vector2): state => {
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

    return setAbstractState(state, CameraControls.setGiantessDirectionData(getAbstractState(state), usedGirl, [
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

let _lookatTarget = (state: state, usedGirl) => {
    return lookatTarget(state, (state, lookatQuaternion) => lookatQuaternion, usedGirl)
}

export let stopMove = (state: state, usedGirl, id, result) => {
    state = setAbstractState(state, CameraControls.resetGiantessDirectionData(getAbstractState(state), usedGirl))

    return markFinish(state, usedGirl, id, result)
}

// let _isNotMove = (state: state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map((lastGirlPosition) => {
//             return getGirlPosition(state, usedGirl).equals(
//                 lastGirlPosition
//             )
//         }, getBehaviourTreeState(state).lastGirlPosition),
//         false
//     )
// }

export let isReach = (state, usedGirl, nextPoint: Vector2) => {
    let factor = 1
    switch (getCurrentPose(state, usedGirl)) {
        case pose.Stand:
        case pose.Pick:
            factor = 1
            break
        case pose.Crawl:
            factor = 2
            break
    }

    return Vector2Utils.isNearlyEqual(convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl)), nextPoint, Math.pow(1.5 * getGirlScale(state, usedGirl) / 10, 2) * factor)
}

export let isFarawayFromPath = (state: state, usedGirl, previousPoint: Vector2, nextPoint: Vector2) => {
    let currentPoint = convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl))

    return currentPoint.distanceTo(previousPoint) + currentPoint.distanceTo(nextPoint) > 1.5 * nextPoint.distanceTo(previousPoint)
    // return currentPoint.distanceTo(previousPoint) + currentPoint.distanceTo(nextPoint) > 2

    // return convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl)).distanceTo(
    //     nextPoint
    // ) >= 6 * getStep(getGridForGirl(state))
}

let _getMoveKey = (usedGirl) => `${usedGirl}_MoveKey`

let _move = (state: state, usedGirl, id, pathIndex, path, attackRange): Promise<state> => {
    let stopMoveResult = NullableUtils.getEmpty()

    if (!hasTarget(state, usedGirl)) {
        return stopMove(state, usedGirl, id, behaviourTreeNodeExecuteResult.Fail)
    }


    if (pathIndex + 1 >= path.length
        || isInGirlAttackRange(state, usedGirl, NullableUtils.getExn(getTarget(state, usedGirl)).getPositionFunc(state), attackRange, NullableUtils.getEmpty())
        // || isMoveCollisioned(state)
    ) {
        stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Success)
    }
    else if (
        isMoveCollisioned(state, usedGirl)
        || isChangeScaling(state, usedGirl)
        || isControlledState(state, getStateMachine(state, usedGirl))
    ) {
        stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Fail)
    }

    if (!NullableUtils.isNullable(stopMoveResult)) {
        state = _lookatTarget(state, usedGirl)

        return stopMove(state, usedGirl, id, NullableUtils.getExn(stopMoveResult))
    }



    state = computeAndSetDirectionData(state, usedGirl, path[pathIndex], path[pathIndex + 1])

    // state = setBehaviourTreeState(state, {
    //     ...getBehaviourTreeState(state),
    //     lastGirlPosition: NullableUtils.return_(getGirlPosition(state, usedGirl).clone())
    // })

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        if (isReach(state, usedGirl, path[pathIndex + 1])) {
            state = setPivotWorldPositionAndUpdateBox(state, usedGirl, convertPathPointToVec3Position(path[pathIndex + 1]))
            // state = setPivotWorldPositionAndUpdateBox(state, path[pathIndex + 1])


            // let { isAliveFunc } = getTarget(state, usedGirl)
            // if (!isAliveFunc(state)) {
            //     state = stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)

            //     return Promise.resolve(state)
            // }
            if (!hasTarget(state, usedGirl)) {
                return stopMove(state, usedGirl, id, behaviourTreeNodeExecuteResult.Fail)
            }



            return _move(state, usedGirl, id, pathIndex + 1, path, attackRange)
        }
        else if (isFarawayFromPath(state, usedGirl, path[pathIndex], path[pathIndex + 1])) {
            Console.warn(`far away from ${path[pathIndex + 1].toArray()}`)

            // Console.warn(
            //     convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl)),
            //     convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl)).distanceTo(
            //         path[pathIndex + 1]
            //     )
            // )


            return stopMove(state, usedGirl, id, behaviourTreeNodeExecuteResult.Fail)
        }

        return _move(state, usedGirl, id, pathIndex, path, attackRange)
    }, 1, _getMoveKey(usedGirl))))
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


export let optimizeFirstPathPoint = (path: Array<Vector2>, state: state, usedGirl) => {
    if (path.length < 2) {
        return path
    }

    let firstPoint = path[0]
    let secondPoint = path[1]

    if (firstPoint.distanceTo(secondPoint) < getStep(getGridForGirl(state, usedGirl)) * 0.8) {
        return path.slice(1)
    }

    return path
}

let _computeFindPathRangeSquared = (state: state, usedGirl, attackRange_: attackRange): number => {
    // if (isGetGridForGirlBigger(state)) {
    //     return NullableUtils.getEmpty<number>()
    // }

    let { type } = NullableUtils.getExn(getTarget(state, usedGirl))

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
            getGirlScale(state, usedGirl) * 0.8
            * (getStep(getGridForGirl(state, usedGirl)) / 10),
            minValue,
            8
        ), 2) * factor * rangeFactor
}

// let getPivotWorldPosition = (state: state) => {
//     switch (getCurrentPose(state, usedGirl)) {
//         case pose.Stand:
//         case pose.Pick:
//             return getGirlPosition(state, usedGirl)
//         case pose.Crawl:
//             return getCenter(state)
//     }
// }

// let setPivotWorldPositionAndUpdateBox = (state: state, position: Vector2) => {
//     switch (getCurrentPose(state, usedGirl)) {
//         case pose.Stand:
//         case pose.Pick:
//             return setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(position))
//         case pose.Crawl:
//             return setCenterExceptY(state, position)
//     }
// }

let _isCannotAttack = (state, usedGirl, position) => {
    return getAllValidAttackRanges(state, usedGirl).filter(attackRange => {
        return isInGirlAttackRange(state, usedGirl, position, attackRange, NullableUtils.getEmpty())
    }).length == 0
}

export let walkToTarget: actionNodeFunc = (state, usedGirl, id, config) => {
    Console.log(`walkToTarget: ${config}`)

    if (!hasTarget(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    let { getPositionFunc } = getTarget(state, usedGirl)

    let attackRange = NullableUtils.getExn(config)

    let position = getPositionFunc(state)

    if (isInGirlAttackRange(state, usedGirl, position, attackRange, NullableUtils.getEmpty())) {
        // state = _lookatTarget(state, (state, lookatQuaternion)=>lookatQuaternion, usedGirl)

        // return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        return stopMove(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success).then(state => {
            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    }


    // let girlPosition = getPivotWorldPosition(state, usedGirl)

    let finder = PathFind.createAStarFinder()

    // finder.diagonalMovement

    // const minInterval = 50

    let data = PathFind.findPath(getAbstractState(state), finder,
        // convertVec3PositionToPathPoint(girlPosition),
        convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl)),
        convertVec3PositionToPathPoint(position),
        false,
        getGridForGirl(state, usedGirl),
        buildNameByUsedGirl(usedGirl),
        getIsDebug(state),
        // minInterval,
        NullableUtils.getEmpty(),
        NullableUtils.return_(_computeFindPathRangeSquared(state, usedGirl, attackRange))
    )
    state = setAbstractState(state, data[0])
    let path = data[1]

    // Console.log(path)

    // Console.log(
    //     convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl))
    // )

    if (path.length > 1) {
        // path = _removeDiagonalMovementPathPoint(path)

        // state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[0]))

        path = optimizeFirstPathPoint(path, state, usedGirl)
        state = setPivotWorldPositionAndUpdateBox(state, usedGirl, convertPathPointToVec3Position(path[0]))



        // Console.log(
        //     convertVec3PositionToPathPoint(getPivotWorldPosition(state, usedGirl))
        // )


        if (getIsDebug(state) && getIsNotTestPerf(state)) {
            PathFind.showFindedPath(getAbstractState(state), path, NumberUtils.randomHexColor(), 0.005)
        }


        state = markIsRunning(state, usedGirl, true)


        // state = setGirlRotation(state, NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion))
        state = unlockGirlRotation(state, usedGirl)


        return _move(state, usedGirl, id, 0, path, attackRange).then(state => {
            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    }

    // state = markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success)

    // return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])

    if (_isCannotAttack(state, usedGirl, position)) {
        state = clearTarget(state, usedGirl)
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}

export let remove = (state: state, usedGirl) => {
    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _getMoveKey(usedGirl)))

    return state
}

export let dispose = (state: state) => {
    state = ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
        return remove(state, usedGirl)
    }, state)

    return state
}