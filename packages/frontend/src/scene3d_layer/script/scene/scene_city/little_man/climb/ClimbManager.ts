import { Box3, Quaternion, Ray, Vector3 } from "three"
import { cameraType, state } from "../../../../../type/StateType"
import { isPlayingAnimationByWeight, updateAnimation } from "../../little_man/Animation"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { getCameraType, getOrbitControlsTarget, lookat } from "../../LittleManCamera"
import { getIsDebug } from "../../../Scene"
import { getBox, getCurrentModelData, getMovableRanges, getLittleMan, getStateMachine, setGunInititalTransform, setStateMachine, show, updateFsmState, updateStatus } from "../../little_man/LittleMan"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCurrentGun } from "../../little_man/Gun"
import { updateAimHud } from "../../little_man/Shoot"
import { updateAnimationCollision } from "../../little_man/Collision"
import { Device } from "meta3d-jiehuo-abstract"
import { computeTransformForCamera } from "../../Camera"
import { road } from "meta3d-jiehuo-abstract/src/type/StateType"
import { computeSpeed, computeTranslate, directMove, rotate, translate } from "../../little_man/Move"
import { getPosition, getWorldPosition, setRotation } from "../../little_man/Transform"
import { getCollisionPartOBB, queryAllOBBShapesCollisionWithBox } from "../../girl/Collision"
import { climb, climbDirection, climbPlane, collisionPart, xzRange } from "../../type/StateType"
import { actionName, animationName } from "../../little_man_data/DataType"
import { degToRad } from "three/src/math/MathUtils"
import { getState, setState, useCamera, useNoCameraControl } from "../../CityScene"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getGirlState } from "../../girl/Girl"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { createClimbState, createInitialState } from "../FSMState"
import { triggerAction } from "../Action"
import { Event } from "meta3d-jiehuo-abstract"
import { getBonePositionYOffset, setBonePositionYOffset } from "../../utils/BoneUtils"
import { getLittleManAnimationChangeEventName } from "../../../../../utils/EventUtils"
import { Camera } from "meta3d-jiehuo-abstract"
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { isInXZRange } from "../../manage/city1/soldier/utils/CommanderUtils"
import { isNotInMovableRanges } from "../Utils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getClimbToDownSoundResourceId, getClimbToTopSoundResourceId } from "../../little_man_data/Const"
import { getLittleManVolume } from "../../utils/SoundUtils"
// import { getPositionY } from "../../manage/city1/Army"
import { getGirlPositionYKey } from "../../manage/biwu/level3/ArmyManager"

const _q = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

export let getClimbState = (state: state) => {
    return NullableUtils.getExn(getState(state).climb)
}

export let setClimbState = (state: state, climbState: climb) => {
    return setState(state, {
        ...getState(state),
        climb: NullableUtils.return_(climbState)
    })
}

let _project = (vector: Vector3, planeNormal: Vector3) => {
    return vector.clone().sub(planeNormal.clone().multiplyScalar(vector.clone().dot(planeNormal)))
}

let _getProjectOnPlane = (state, vector: Vector3, planeNormal: Vector3, climbDirection_, climbPlane_) => {
    switch (climbPlane_) {
        case climbPlane.None:
            throw new Error("err")
        case climbPlane.Verticle:
            switch (climbDirection_) {
                case climbDirection.Verticle:
                case climbDirection.None:
                    return _project(vector, planeNormal)
                case climbDirection.Horrizon:
                    // let result = planeNormal.clone().cross(_v1.set(0, 1, 0)).multiplyScalar(0.1)
                    let result = planeNormal.clone().cross(_getGroundNormal()).normalize().multiplyScalar(vector.length())
                    if (vector.x < 0) {
                        return result
                    }

                    return result.negate()
                // case climbDirection.None:
                //     throw new Error("err")
            }
        case climbPlane.Horrizon:
            switch (climbDirection_) {
                case climbDirection.Verticle:
                case climbDirection.Horrizon:
                    throw new Error("err")
                case climbDirection.None:
                    return _project(vector, planeNormal)
            }
    }
}

export let intersect = (obb, ray): nullable<[Vector3, Vector3]> => {
    return obb.intersectRay(
        ray,
        [
            new Vector3(),
            new Vector3(),
        ]
    )
    // if (!NullableUtils.isNullable(result)) {
    //     let [resultPosition, collisionNormal] = NullableUtils.getExn(result)

    //     return NullableUtils.return_([resultPosition, collisionNormal])
    // }

    // return NullableUtils.getEmpty()
}

// let _isCanClimb = (state: state, collisionNormal, climbDirection_) => {
let _isCanClimb = (collisionNormal) => {
    // let angle1 = getClimbState(state).currentCollisionNormal.angleTo(collisionNormal)

    // let angle2 = new Vector3(0, 1, 0).angleTo(collisionNormal)
    let angle1 = new Vector3(0, -1, 0).angleTo(collisionNormal)

    if (
        // climbDirection_ == climbDirection.Verticle
        // && angle <= degToRad(15)
        // && angle < degToRad(30)
        // && (
        // angle1 >= degToRad(60)
        // // && angle2 > degToRad(30)
        // && 
        // angle1 <= degToRad(15)
        angle1 <= degToRad(45)
        // )
    ) {
        return false
    }

    return true
}

// let _isClimbHorrizonOutsideAngle = (state, climbDirection_) => {
//     return climbDirection_ == climbDirection.Horrizon && !NullableUtils.isNullable(getClimbState(state).currentClimbedOBB)
// }

// let _isClimbVerticalOutsideAngle = (state, climbDirection_) => {
//     return climbDirection_ == climbDirection.Verticle && !NullableUtils.isNullable(getClimbState(state).currentClimbedOBB)
// }

// let _isNoneClimbDownOutsideAngle = (state, climbDirection_) => {
//     // return NullableUtils.isNullable(nextCollisionNormal) &&
//     return climbDirection_ == climbDirection.None && !NullableUtils.isNullable(getClimbState(state).currentClimbedOBB)
// }


// let _translateOnNormalPlane = (state, beforeVelocity, forwardVelocity, collisionNormal, climbDirection_): [state, Vector3] => {
//     let velocityOnPlane = _getProjectOnPlane(state, forwardVelocity, collisionNormal, climbDirection_)

//     state = setClimbState(state, {
//         ...getClimbState(state),
//         currentCollisionNormal: collisionNormal,
//         lastVelocity: velocityOnPlane
//     })


//     state = translate(state, velocityOnPlane)

//     if (climbDirection_ != climbDirection.Verticle) {
//         state = rotate(state, beforeVelocity)
//     }

//     return [state, velocityOnPlane]
// }

let _findNearestOBBData = (state: state, box, downRay, boxCenter): [nullable<OBB>, nullable<collisionPart>, nullable<[Vector3, Vector3]>] => {
    let downRayDetectDistance = box.getSize(_v1).length()

    let [downOBB, intersectedCollisionPart_, collisionData] = getAllCollisionShapeOBBData(state).reduce<[nullable<OBB>, nullable<collisionPart>, nullable<[Vector3, Vector3]>]>(([downOBB, intersectedCollisionPart_, collisionData], [collisionPart_, obb]) => {
        // if (obb.intersectsBox3(box)) {
        //     let d = intersect(obb, downRay)

        //     if (!NullableUtils.isNullable(collisionData)) {
        //         if (!NullableUtils.isNullable(d)
        //             && NullableUtils.getExn(d)[0].distanceTo(boxCenter) < NullableUtils.getExn(collisionData)[0].distanceTo(boxCenter)
        //         ) {
        //             return [NullableUtils.return_(obb), d]
        //         }

        //         return [downOBB, collisionData]
        //     }


        //     return NullableUtils.getWithDefault(
        //         NullableUtils.map(d => {
        //             return [NullableUtils.return_(obb), d]
        //         }, d),
        //         [NullableUtils.getEmpty(), NullableUtils.getEmpty()]
        //     )
        // }
        let d = intersect(obb, downRay)

        if (!NullableUtils.isNullable(collisionData)) {
            if (!NullableUtils.isNullable(d)
                && NullableUtils.getExn(d)[0].distanceTo(boxCenter) < NullableUtils.getExn(collisionData)[0].distanceTo(boxCenter)
            ) {
                return [NullableUtils.return_(obb), NullableUtils.return_(collisionPart_), d]
            }

            return [downOBB, intersectedCollisionPart_, collisionData]
        }


        return NullableUtils.getWithDefault(
            NullableUtils.map(d => {
                return [NullableUtils.return_(obb), NullableUtils.return_(collisionPart_), d]
            }, d),
            [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
        )


        // return [downOBB, collisionData]
    }, [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()])


    if (
        !NullableUtils.isNullable(collisionData)
        && NullableUtils.getExn(collisionData)[0].distanceTo(boxCenter) < downRayDetectDistance) {
        return [downOBB, intersectedCollisionPart_, collisionData]
    }

    return [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
}

// let _getDownOBB = (state: state, box, downRay) => {
//     let expandedBox = _expandBox(box.clone())

//     return NullableUtils.getExn(TupleUtils.getTuple2First(_findNearestOBBData(state, expandedBox, downRay, box.getCenter(new Vector3()))))
//     // return TupleUtils.getTuple2First(getAllCollisionShapeOBBs(state).reduce<[nullable<OBB>, nullable<Vector3>]>(([downOBB, collisionPosition], obb) => {
//     //     // if (!NullableUtils.isNullable(downOBB)) {
//     //     //     return downOBB
//     //     // }

//     //     if (obb.intersectsBox3(expandedBox)) {
//     //         let d = intersect(obb, downRay)

//     //         if (!NullableUtils.isNullable(collisionPosition)) {
//     //             if (!NullableUtils.isNullable(d)
//     //                 && NullableUtils.getExn(d)[0].distanceTo(center) < NullableUtils.getExn(collisionPosition).distanceTo(center)
//     //             ) {
//     //                 return [NullableUtils.return_(obb), NullableUtils.getExn(d)[0]]
//     //             }

//     //             return [downOBB, collisionPosition]
//     //         }


//     //         // return [NullableUtils.return_(obb), NullableUtils.getExn(d)[0]]
//     //         return NullableUtils.getWithDefault(
//     //             NullableUtils.map(d => {
//     //                 return [NullableUtils.return_(obb), d[0]]
//     //             }, d),
//     //             // [downOBB, collisionPosition]
//     //             [NullableUtils.getEmpty(), NullableUtils.getEmpty()]
//     //         )
//     //     }

//     //     return [downOBB, collisionPosition]
//     //     // if (obb.intersectsBox3(expandedBox) && !NullableUtils.isNullable(intersect(obb, downRay))) {
//     //     //     return NullableUtils.return_(obb)
//     //     // }

//     //     // return NullableUtils.getEmpty()
//     // }, [NullableUtils.getEmpty(), NullableUtils.getEmpty()]))
// }

let _computeClimbDirection = (state: state, forward, side, climbPlane_) => {
    switch (climbPlane_) {
        case climbPlane.Verticle:
            return Math.abs(forward) > Math.abs(side) ? climbDirection.Verticle : climbDirection.Horrizon
        case climbPlane.Horrizon:
        case climbPlane.None:
            return climbDirection.None
        default:
            throw new Error("err")
    }
}

let _computeForwardVelocity = (state, delta, forward, side, climbDirection_, velocity) => {
    let horrizonVelocity = _computeTranslateInHorrizon(state, delta, side)
    let verticalVelocity = _computeTranslateInVertical(state, delta, forward)

    let v
    switch (climbDirection_) {
        case climbDirection.Verticle:
            v = verticalVelocity
            break
        case climbDirection.Horrizon:
            v = horrizonVelocity
            break
        case climbDirection.None:
            v = velocity
            break
        default:
            throw new Error("err")
    }

    return v
}

let _computeForwardVelocityOnPlane = (state, delta, forward, side, climbDirection_, velocity) => {
    if (getClimbState(state).climbPlane == climbPlane.None) {
        return velocity
    }

    return _getProjectOnPlane(state, _computeForwardVelocity(state, delta, forward, side, climbDirection_, velocity), getClimbState(state).currentCollisionNormal, climbDirection_,
        getClimbState(state).climbPlane
    )
}

let _getRayStartPoint = (box) => {
    return box.getCenter(new Vector3())
}

let _getBoxBottomPoint = (box) => {
    return box.getCenter(new Vector3()).sub(
        _v1.set(0, box.getSize(_v2).y / 2, 0)
    )
}

let _getBoxTopPoint = (box) => {
    return box.getCenter(new Vector3()).add(
        _v1.set(0, box.getSize(_v2).y / 2, 0)
    )
}

let _buildDownRay = (state: state, startPoint, collisionNormal = getClimbState(state).currentCollisionNormal) => {
    return new Ray(startPoint, collisionNormal.clone().negate())
}

export let getAllCollisionShapeOBBs = (state: state) => {
    let { collisionShapeMap } = getGirlState(state)

    return Array.from(collisionShapeMap.values())
    // return globalThis[0,0,0]
}

export let getAllCollisionShapeOBBData = (state: state) => {
    let { collisionShapeMap } = getGirlState(state)

    return Array.from(collisionShapeMap.entries())
}


let _handleDownRayIntersectWithShortHeightVerticalPlaneCase = (state, box, expandedBox, forwardVelocity, [intersectedOBB, intersectedCollisionPart_, collisionData]) => {
    if (_getClimbPlane(getClimbState(state).currentCollisionNormal) == climbPlane.Horrizon) {
        if (!NullableUtils.isNullable(collisionData)) {
            let [_, collisionNormal] = NullableUtils.getExn(collisionData)

            if (_getClimbPlane(collisionNormal) == climbPlane.Verticle) {
                let nextPoint = _outAlongNormalALittle(
                    _getBoxTopPoint(box).clone().add(forwardVelocity),
                    getClimbState(state).currentCollisionNormal
                )

                let downRay = _buildDownRay(state, nextPoint)

                return _findNearestOBBData(state, expandedBox, downRay, nextPoint)
            }
        }
    }

    return [intersectedOBB, intersectedCollisionPart_, collisionData]
}

let _computeNextCollisionData = (state, box, forwardVelocity): [nullable<[Vector3, Vector3, boolean]>, nullable<OBB>, nullable<collisionPart>] => {
    // let rayStartPoint = _getRayStartPoint(box)
    // let nextPoint = _getRayStartPoint(box).clone().add(getClimbState(state).lastVelocity)

    // let nextPoint = _getRayStartPoint(box).clone().add(forwardVelocity)
    let nextPoint = _outAlongNormalALittle(
        _getRayStartPoint(box).clone().add(forwardVelocity),
        getClimbState(state).currentCollisionNormal
    )

    // _offsetRayStartPoint = (box, velocity)


    // let nextPoint = _getRayStartPoint(box).clone().add(forwardVelocity.clone().multiplyScalar(5))

    // let nextPointForDownRay = _offsetRayStartPoint(_getRayStartPoint(box), getClimbState(state).currentCollisionNormal)

    // // let nextPoint = _getRayStartPoint(box).clone().add(forwardVelocity.clone().multiplyScalar(5))
    // let nextPointForForwardRay = _offsetRayStartPoint(_getRayStartPoint(box), forwardVelocity)
    // nextPointForForwardRay =
    //     NullableUtils.getWithDefault(
    //         NullableUtils.map(currentClimbedOBB => {
    //             let offsetOut = nextPointForForwardRay.clone().sub(currentClimbedOBB.center)
    //             // .normalize().multiplyScalar(1)

    //             // return nextPointForForwardRay.add(offsetOut)
    //             return _offsetRayStartPoint(nextPointForForwardRay, offsetOut)
    //         }, getClimbState(state).currentClimbedOBB),
    //         nextPointForForwardRay
    //     )

    let downRay, forwardRay
    // downRay = _buildDownRay(state, nextPointForDownRay)
    // forwardRay = new Ray(nextPointForForwardRay, forwardVelocity.clone().normalize())
    downRay = _buildDownRay(state, nextPoint)
    forwardRay = new Ray(nextPoint, forwardVelocity.clone().normalize())

    // let forwardRayDetectDistance = forwardVelocity.length() * 5


    // let [collisionData, _] = getAllCollisionShapeOBBs(state).reduce<[nullable<[Vector3, Vector3]>, boolean]>(([collisionData, isFind], obb) => {
    //     if (isFind) {
    //         return [collisionData, isFind]
    //     }

    //     if (obb.intersectsBox3(expandedBox)) {
    //         let d = intersect(obb, forwardRay)

    //         if (!NullableUtils.isNullable(d)) {
    //             let [collisionPosition, _] = NullableUtils.getExn(d)

    //             if (collisionPosition.distanceTo(nextPoint) <= forwardRayDetectDistance) {
    //                 return [
    //                     d, true
    //                 ]
    //             }
    //         }

    //         let d2 = intersect(obb, downRay)
    //         if (!NullableUtils.isNullable(collisionData)) {
    //             if (!NullableUtils.isNullable(d2)
    //                 && NullableUtils.getExn(d2)[0].distanceTo(nextPoint) < NullableUtils.getExn(collisionData)[0].distanceTo(nextPoint)
    //             ) {
    //                 return [
    //                     d2,
    //                     isFind
    //                 ]
    //             }

    //             return [collisionData, isFind]
    //         }

    //         return [
    //             d2,
    //             isFind
    //         ]
    //         // return [
    //         //     NullableUtils.getWithDefault(
    //         //         intersect(obb, downRay),
    //         //         collisionData,
    //         //     ),
    //         //     isFind,
    //         // ]
    //     }

    //     return [collisionData, isFind]
    // }, [NullableUtils.getEmpty(), false])

    let expandedBox = _expandBox(box.clone())

    let [collisionData, intersectedOBB, intersectedCollisionPart_] = getAllCollisionShapeOBBData(state).reduce<[nullable<[Vector3, Vector3]>, nullable<OBB>, nullable<collisionPart>]>(([collisionData, intersectedOBB, intersectedCollisionPart_], [collisionPart_, obb]) => {
        if (!NullableUtils.isNullable(collisionData)) {
            return [collisionData, intersectedOBB, intersectedCollisionPart_]
        }

        if (obb.intersectsBox3(expandedBox)) {
            let d = intersect(obb, forwardRay)

            if (!NullableUtils.isNullable(d)) {
                // let [collisionPosition, _] = NullableUtils.getExn(d)

                // if (collisionPosition.distanceTo(nextPoint) <= forwardRayDetectDistance) {
                return [d, NullableUtils.return_(obb), NullableUtils.return_(collisionPart_)]
                // }
            }
        }

        return [collisionData, intersectedOBB, intersectedCollisionPart_]
    }, [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()])

    if (!NullableUtils.isNullable(collisionData)) {
        // state = setClimbState(state, {
        //     ...getClimbState(state),
        //     // currentClimbedOBB: _getDownOBB(state, box, _buildDownRay(state, _getRayStartPoint(box), getClimbState(state).currentCollisionNormal))
        //     currentClimbedOBB: NullableUtils.getExn(intersectedOBB)
        // })

        let [collisionPosition, collisionNormal] = NullableUtils.getExn(collisionData)

        return [NullableUtils.return_([collisionPosition, collisionNormal, true]), intersectedOBB, intersectedCollisionPart_]
    }


    let [intersectedOBB2, intersectedCollisionPart2_, collisionData2] = _handleDownRayIntersectWithShortHeightVerticalPlaneCase(state, box, expandedBox, forwardVelocity, _findNearestOBBData(state, expandedBox, downRay, nextPoint))

    // if (!NullableUtils.isNullable(intersectedOBB2)) {
    //     state = setClimbState(state, {
    //         ...getClimbState(state),
    //         currentClimbedOBB: NullableUtils.getExn(intersectedOBB2)
    //     })
    // }
    // else {
    //     state = setClimbState(state, {
    //         ...getClimbState(state),
    //         currentClimbedOBB: NullableUtils.getEmpty()
    //     })
    // }

    // state = setClimbState(state, {
    //     ...getClimbState(state),
    //     currentClimbedOBB: intersectedOBB2
    // })


    return [NullableUtils.map(([collisionPosition, collisionNormal]) => {
        return [collisionPosition, collisionNormal, false]
    }, collisionData2), intersectedOBB2, intersectedCollisionPart2_]
}

// let _offsetRayStartPoint = (rayStartPoint: Vector3, offset: Vector3) => {
//     /*! expand offset(here by normalize) for obb intersect ray->bias?
//     * 
//     */
//     // return rayStartPoint.clone().add(offset.clone().normalize())
//     return rayStartPoint.clone().add(offset.clone().normalize().multiplyScalar(3))
// }

let _getCollisionNormalForOutsideAngle = (state, forwardVelocity, box) => {
    // let nextPoint = _getRayStartPoint(box).clone().add(forwardVelocity)
    // let nextPoint = _getRayStartPoint(box).clone().add(forwardVelocity.clone().multiplyScalar(10))



    // /*! expand offset for move out along normal a little and obb intersect ray->bias?
    // * 
    // */
    // let nextPoint = _getRayStartPoint(box).add(forwardVelocity.clone().normalize().multiplyScalar(100))
    // let nextPoint = _getRayStartPoint(box).add(forwardVelocity.clone().normalize())
    // let nextPoint = _getRayStartPoint(box).add(forwardVelocity)
    let nextPoint = _outAlongNormalALittle(
        _getRayStartPoint(box).clone().add(forwardVelocity),
        getClimbState(state).currentCollisionNormal.clone().negate()
    )


    // if (isMoveInAlongNormal) {
    //     nextPoint = nextPoint.add(
    //         _getOutNormalOffset(NullableUtils.getExn(getClimbState(state).currentCollisionNormal)).negate()
    //         // _getOutNormalOffset(NullableUtils.getExn(getClimbState(state).currentCollisionNormal)).negate().multiplyScalar(3)
    //     )
    // }

    let currentClimbedOBB = NullableUtils.getExn(getClimbState(state).currentClimbedOBB)

    let ray = new Ray(
        nextPoint,
        currentClimbedOBB.center.clone().sub(nextPoint).normalize()
    )

    let result = currentClimbedOBB.intersectRay(
        ray,
        [
            new Vector3(),
            new Vector3(),
        ]
    )

    return NullableUtils.getExn(result)[1]
}

let _computeTranslateInHorrizon = (state: state, delta, side) => {
    let speed_ = computeSpeed(state, delta)

    return new Vector3(speed_ * side, 0, 0)
}

let _computeTranslateInVertical = (state: state, delta, forward) => {
    let speed_ = computeSpeed(state, delta)

    return new Vector3(0, speed_ * forward, 0)
}

// let _getTranslateFactorInTurn = () => 20
// let _getTranslateFactorInTurn = () => 10
// let _getTranslateFactorInTurn = () => 3
// let _getTranslateFactorInTurn = () => 0

let _computeCurrentDataBasedOnLastStatusAndCurrentInput = (state, delta, forward, side, controlRotationAngle): [Vector3, climbDirection, Vector3] => {
    let velocity = computeTranslate(state, delta, forward, side, controlRotationAngle)

    velocity.setY(0)

    // let beforeVelocity = velocity.clone()

    let climbDirection_ = _computeClimbDirection(state, forward, side, getClimbState(state).climbPlane)

    let forwardVelocity = _computeForwardVelocityOnPlane(state, delta, forward, side, climbDirection_, velocity)

    // let horrizonVelocity = _computeTranslateInHorrizon(state, delta, side)
    // let verticalVelocity = _computeTranslateInVertical(state, delta, forward)

    return [velocity, climbDirection_, forwardVelocity]
}

let _handleCanNotClimb = (state, box): [state, Vector3] => {
    let resultVelocity = new Vector3(0, 0, 0)

    // state = setClimbState(state, {
    //     ...getClimbState(state),
    //     // lastVelocity: resultVelocity,
    //     currentClimbedOBB: _getDownOBB(state, box, _buildDownRay(state, _getRayStartPoint(box)))
    // })

    return [state, resultVelocity]
}

let _rotate = (state, collisionNormal) => {
    return setRotation(state, TransformUtils.getLookatQuaternion(
        _v1.set(0, 0, 0),
        collisionNormal.clone().negate()
    ))
}

let _getClimbPlane = (collisionNormal) => {
    let angle = _getGroundNormal().angleTo(collisionNormal)
    if (
        // angle < degToRad(130) && angle > degToRad(40)
        angle <= degToRad(150) && angle >= degToRad(45)
    ) {
        return climbPlane.Verticle
    }

    return climbPlane.Horrizon
}

let _updateClimbPlane = (state: state, climbPlane: climbPlane) => {
    return setClimbState(state, {
        ...getClimbState(state),
        climbPlane
    })
}

let _correctBoxCenter = (state, box, climbDirection_, nextCollisionPosition, isFromForwardRay) => {
    if (isFromForwardRay) {
        return state
    }

    if (climbDirection_ == climbDirection.Verticle && !Vector3Utils.isNearlyEqual(
        box.getCenter(_v1),
        nextCollisionPosition,
        0.001
    )
        // && !isFromForwardRay
    ) {
        state = translate(state,
            nextCollisionPosition.clone().sub(
                box.getCenter(_v1)
            )
        )
    }
    else if (climbDirection_ == climbDirection.None &&
        box.getCenter(_v1).y - nextCollisionPosition.y != box.getSize(_v2).y / 2
        // && !isFromForwardRay
        // !NumberUtils.between(
        //     box.getCenter(_v1).y - nextCollisionPosition.y,
        //     box.getSize(_v2).y / 2 * 0.99,
        //     box.getSize(_v2).y / 2 * 1.01
        // )
    ) {
        // console.log("translate: ",
        //     box.getSize(_v2).y / 2 - (box.getCenter(_v3).y - nextCollisionPosition.y)
        // )
        state = translate(state,
            _v1.set(0,
                box.getSize(_v2).y / 2 - (box.getCenter(_v3).y - nextCollisionPosition.y)
                , 0)
        )
    }


    return state
}


let _handleClimbOnPlane = (state, box, delta, velocity, [nextCollisionPosition, nextCollisionNormal, isFromForwardRay], forward, side): [state, Vector3] => {
    // let nextClimbPlane
    // let angle = new Vector3(0, 1, 0).angleTo(nextCollisionNormal)
    // if (
    //     // angle < degToRad(130) && angle > degToRad(40)
    //     angle <= degToRad(150) && angle >= degToRad(45)
    // ) {
    //     // state = setClimbState(state, {
    //     //     ...getClimbState(state),
    //     //     climbPlane: climbPlane.Verticle
    //     // })
    //     nextClimbPlane = climbPlane.Verticle
    // }
    // else {
    //     // state = setClimbState(state, {
    //     //     ...getClimbState(state),
    //     //     climbPlane: climbPlane.Horrizon
    //     // })
    //     nextClimbPlane = climbPlane.Horrizon
    // }





    let climbPlane = _getClimbPlane(nextCollisionNormal)


    // if (_isBeginClimbVertical(state, getClimbState(state).climbPlane, nextCollisionNormal)) {
    //     state = _handleBeginClimbVertical(state, box, [nextCollisionPosition, nextCollisionNormal])
    // }


    let climbDirection_ = _computeClimbDirection(state, forward, side, climbPlane)

    let forwardVelocity = _computeForwardVelocity(state, delta, forward, side, climbDirection_, velocity)


    let velocityOnPlane = _getProjectOnPlane(state, forwardVelocity, nextCollisionNormal, climbDirection_, climbPlane)


    if (
        !state.config.isNotMoveCollision
        &&
        isNotInMovableRanges(
            box.getCenter(new Vector3()).add(velocityOnPlane)
            , getMovableRanges(state)
        )) {
        return [state, new Vector3(0, 0, 0)]
    }


    // console.log("climb on p:", velocityOnPlane)



    state = _updateClimbPlane(state, climbPlane)


    state = translate(state, velocityOnPlane)

    // if (climbDirection_ != climbDirection.Verticle) {
    // if (climbDirection_ == climbDirection.None) {
    //     state = rotate(state, beforeVelocity)
    // }

    switch (climbDirection_) {
        case climbDirection.Verticle:
        case climbDirection.Horrizon:
            state = _rotate(state, nextCollisionNormal)
            break
        case climbDirection.None:
            state = rotate(state, velocity)
            break
    }
    // if (climbDirection_ == climbDirection.Verticle) {
    //     state = _rotate(state, nextCollisionNormal)
    // }
    // else if (climbDirection_ == climbDirection.None) {
    //     state = rotate(state, beforeVelocity)
    // }


    state = setClimbState(state, {
        ...getClimbState(state),
        currentCollisionNormal: nextCollisionNormal,
    })

    if (_isRestoreCamera(state)) {
        /*! move out a little more to avoid climb again when move in next loop
        * 
        */
        state = translate(
            state,
            velocityOnPlane.normalize()
        )
    }


    state = _correctBoxCenter(state, box, climbDirection_, nextCollisionPosition, isFromForwardRay)


    state = _switchCameraControls(state)

    return [state, velocityOnPlane]
}

let _handleOutisideAngle = (state, velocityOnPlane, newCollisionNormal) => {
    state = translate(state, velocityOnPlane)

    // state = translate(state, newCollisionNormal)

    state = setClimbState(state, {
        ...getClimbState(state),
        currentCollisionNormal: newCollisionNormal,
        // rayStartPointOffsetForComputeNextCollisionNormal: newCollisionNormal.clone().multiplyScalar(velocityOnPlane.length())
        // rayStartPointOffsetForComputeNextCollisionNormal: newCollisionNormal
        // rayStartPointOffsetForComputeNextCollisionNormal: newCollisionNormal.clone().multiplyScalar(1).add(velocityOnPlane.clone().multiplyScalar(2))
        // lastVelocity: velocityOnPlane
    })

    return state
}

let _getOutNormalOffset = (normal) => {
    return normal.clone().multiplyScalar(0.2)
}

let _outAlongNormalALittle = (vec: Vector3, normal: Vector3) => {
    return vec.add(_getOutNormalOffset(normal))
}

let _getVelocityOnPlaneForOutsideAngle = (state, forwardVelocity, box, newCollisionNormal, translateFactorInTurn) => {
    let currentClimbedOBB = NullableUtils.getExn(getClimbState(state).currentClimbedOBB)
    return _project(
        currentClimbedOBB.center.clone().sub(_getRayStartPoint(box).add(forwardVelocity)).normalize().multiplyScalar(translateFactorInTurn),
        newCollisionNormal
    )
}

let _handleClimbHorrizonOutsideAngle = (state, forwardVelocity, box, forward, side): Promise<[state, Vector3]> => {
    let newCollisionNormal = _getCollisionNormalForOutsideAngle(state, forwardVelocity, box)

    if (_getClimbPlane(newCollisionNormal) == climbPlane.Horrizon) {
        return _handleClimbVerticalOutsideAngle(state, forwardVelocity, box, forward, side)
    }

    if (!_isCanClimb(newCollisionNormal)) {
        return Promise.resolve(_handleCanNotClimb(state, box))
    }


    // let d = _translateOnNormalPlane(state, beforeVelocity, _computeTranslateInHorrizon(state, delta, side).multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection.Horrizon)
    // state = d[0]
    // resultVelocity = d[1]

    // let velocityOnPlane = _getProjectOnPlane(state, _computeTranslateInHorrizon(state, delta, side).multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection.Horrizon)
    let velocityOnPlane = _getVelocityOnPlaneForOutsideAngle(state, forwardVelocity, box, newCollisionNormal, 1)


    // let velocityOnPlane = _getProjectOnPlane(state, horrizonVelocity, newCollisionNormal, climbDirection.Horrizon)


    // state = _handleOutisideAngle(state, _outAlongNormalALittle(velocityOnPlane.clone(), newCollisionNormal), newCollisionNormal)
    state = _handleOutisideAngle(state, velocityOnPlane, newCollisionNormal)

    state = _rotate(state, newCollisionNormal)


    // state = _updateLookat(state, newCollisionNormal)

    return Promise.resolve([state, velocityOnPlane])

}

let _updateCameraControl = (state: state, currentCollisionNormal, newCollisionNormal, box) => {
    state = useNoCameraControl(state)
    state = show(state)
    Camera.getCurrentCamera(getAbstractState(state)).position.copy(
        box.getCenter(_v1)
            .add(newCollisionNormal.clone().multiplyScalar(
                box.getSize(_v2).y * 1
            ))
            .add(currentCollisionNormal.clone().multiplyScalar(
                box.getSize(_v2).y * 1
            ))
    )
    Camera.getCurrentCamera(getAbstractState(state)).lookAt(box.getCenter(_v1))

    return state
}

let _handleClimbOnToHorrizonPlane = (state: state, currentCollisionNormal, newCollisionNormal, box,
    translationOnPlane: Vector3
) => {
    state = translate(state, newCollisionNormal.clone().multiplyScalar(
        box.getSize(_v2).y / 2
    ))

    // state = translate(state, newCollisionNormal.clone().multiplyScalar(
    //     -box.getSize(_v2).y
    // ))
    state = setBonePositionYOffset(state, getLittleMan(state),
        getBonePositionYOffset(getLittleMan(state))
        // - box.getSize(_v2).y * 3 / 2 * 0.55 *
        - 3.5 * 3 / 2 * 0.55 *
        getBonePositionYOffset(getLittleMan(state))
        // * (getCurrentModelData(state).scalar / 0.02)

    )


    state = _updateCameraControl(state, currentCollisionNormal, newCollisionNormal, box)

    state = setClimbState(state, {
        ...getClimbState(state),
        translation: NullableUtils.return_(translationOnPlane),
        isPlayingAnimation: true
    })

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getClimbToTopSoundResourceId(), getIsDebug(state), getLittleManVolume(state, getPosition(state)))))

    return triggerAction(state, actionName.ClimbToTop)
}

let _handleClimbDownToVerticalPlane = (state: state, currentCollisionNormal, newCollisionNormal, box) => {
    state = setBonePositionYOffset(state, getLittleMan(state),
        getBonePositionYOffset(getLittleMan(state))
        // - box.getSize(_v2).y * 0.5 *
        - 3.5 * 0.5 *
        getBonePositionYOffset(getLittleMan(state))
    )


    if (NullableUtils.isNullable(getClimbState(state).beforeCameraType)) {
        state = setClimbState(state, {
            ...getClimbState(state),
            beforeCameraType: NullableUtils.return_(getCameraType(state))
        })
    }


    state = _updateCameraControl(state, currentCollisionNormal, newCollisionNormal, box)

    state = setClimbState(state, {
        ...getClimbState(state),
        isPlayingAnimation: true
    })

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getClimbToDownSoundResourceId(), getIsDebug(state), getLittleManVolume(state, getPosition(state)))))

    return triggerAction(state, actionName.ClimbToDown)
}


let _handleClimbVerticalOutsideAngle = (state, forwardVelocity, box: Box3, forward, side): Promise<[state, Vector3]> => {
    let newCollisionNormal = _getCollisionNormalForOutsideAngle(state, forwardVelocity, box)

    // if (!_isCanClimb(state, newCollisionNormal, lastClimbDirection_)) {
    if (!_isCanClimb(newCollisionNormal)) {
        return Promise.resolve(_handleCanNotClimb(state, box))
    }

    // state = setClimbState(state, {
    //     ...getClimbState(state),
    //     climbPlane: climbPlane.Horrizon
    // })
    let climbPlane = _getClimbPlane(newCollisionNormal)
    state = _updateClimbPlane(state, climbPlane)


    // let velocityOnPlane = _getProjectOnPlane(state, velocity.multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection.None)

    // let velocityOnPlane = _getProjectOnPlane(state, velocity, newCollisionNormal, climbDirection.None)
    let currentClimbDirection_ = _computeClimbDirection(state, forward, side, climbPlane)


    // let newForwardVelocity = _computeForwardVelocity(state, delta, forward, side, climbDirection_, velocity)

    // let velocityOnPlane = _getProjectOnPlane(state, forwardVelocity, newCollisionNormal, climbDirection_)
    // let velocityOnPlane = _getProjectOnPlane(state, newForwardVelocity.multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection_)
    // let velocityOnPlane = _getProjectOnPlane(state, forwardVelocity.clone().multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection_)


    // let currentClimbedOBB = NullableUtils.getExn(getClimbState(state).currentClimbedOBB)
    // let velocityOnPlane = _project(
    //     currentClimbedOBB.center.clone().sub(_getRayStartPoint(box).add(forwardVelocity)).normalize().multiplyScalar(_getTranslateFactorInTurn()),
    //     newCollisionNormal
    // )

    let velocityOnPlane = _getVelocityOnPlaneForOutsideAngle(state, forwardVelocity, box, newCollisionNormal, 1)

    if (currentClimbDirection_ == climbDirection.None) {
        let currentCollisionNormal = getClimbState(state).currentCollisionNormal

        state = _handleOutisideAngle(state, velocityOnPlane, newCollisionNormal)

        return _handleClimbOnToHorrizonPlane(state, currentCollisionNormal, newCollisionNormal, box,
            _getVelocityOnPlaneForOutsideAngle(state, forwardVelocity, box, newCollisionNormal, 4)
        ).then(state => [state, velocityOnPlane])
    }

    // state = _handleOutisideAngle(state, _outAlongNormalALittle(velocityOnPlane.clone(), newCollisionNormal), newCollisionNormal)
    // return _handleOutisideAngle(state, velocityOnPlane, newCollisionNormal).then(state => [state, velocityOnPlane])
    state = _handleOutisideAngle(state, velocityOnPlane, newCollisionNormal)

    return Promise.resolve([state, velocityOnPlane])

}

let _handleNoneClimbDownToHorrizonPlane = (state: state, forwardVelocity, box): [state, boolean] => {
    /*! move alone forwardVelocity a little
    * 
    */
    let nextPoint = _getBoxBottomPoint(box).clone().add(forwardVelocity.clone().normalize())


    let downRay = _buildDownRay(state, nextPoint, getClimbState(state).currentCollisionNormal)

    let downRayDetectDistance = box.getSize(_v1).y / 2

    let collisionData = getAllCollisionShapeOBBs(state).reduce<nullable<[Vector3, Vector3]>>((collisionData, obb) => {
        if (!NullableUtils.isNullable(collisionData)) {
            return collisionData
        }

        let d = intersect(obb, downRay)

        if (!NullableUtils.isNullable(d)) {
            let [collisionPosition, _] = NullableUtils.getExn(d)

            if (collisionPosition.distanceTo(nextPoint) <= downRayDetectDistance) {
                return d
            }
        }

        return collisionData
    }, NullableUtils.getEmpty())

    if (!NullableUtils.isNullable(collisionData)) {
        let [collisionPosition, collisionNormal] = NullableUtils.getExn(collisionData)


        state = _updateClimbPlane(state, _getClimbPlane(collisionNormal))

        if (getClimbState(state).climbPlane != climbPlane.Horrizon) {
            throw new Error("err")
        }

        state = _moveToCollisionPosition(state, box, collisionPosition)

        state = translate(state, getClimbState(state).currentCollisionNormal.clone().multiplyScalar(
            box.getSize(_v2).y / 2
        ))


        state = setClimbState(state, {
            ...getClimbState(state),
            currentCollisionNormal: collisionNormal,
        })

        return [state, true]
    }

    return [state, false]
}

let _handleNoneClimbDownOutsideAngle = (state, climbDirection_, forwardVelocity, box): Promise<[state, Vector3]> => {
    requireCheck(() => {
        test("climbDirection should be climbDirection.None", () => {
            return climbDirection_ == climbDirection.None
        })
    }, getIsDebug(state))

    let d = _handleNoneClimbDownToHorrizonPlane(state, forwardVelocity, box)
    state = d[0]
    let isToHorrizonPlane = d[1]

    if (isToHorrizonPlane) {
        return Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    // if (climbDirection_ == climbDirection.None) {
    // state = translate(state, _v1.set(0, -box.getSize(_v2).y / 2, 0))
    state = translate(state, getClimbState(state).currentCollisionNormal.clone().multiplyScalar(
        -box.getSize(_v2).y / 2
    ))
    // }


    let newCollisionNormal = _getCollisionNormalForOutsideAngle(state, forwardVelocity, box)

    // state = setClimbState(state, {
    //     ...getClimbState(state),
    //     climbPlane: climbPlane.Verticle
    // })
    state = _updateClimbPlane(state, _getClimbPlane(newCollisionNormal))


    // let velocityOnPlane = _getProjectOnPlane(state, forwardVelocity.clone().multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection.Verticle)

    // let verticalVelocity = _v1.set(0, -forwardVelocity.length(), 0)
    // let velocityOnPlane = _getProjectOnPlane(state, verticalVelocity.multiplyScalar(_getTranslateFactorInTurn()), newCollisionNormal, climbDirection.Verticle)
    let velocityOnPlane = _getVelocityOnPlaneForOutsideAngle(state, forwardVelocity, box, newCollisionNormal, 1)

    let currentCollisionNormal = getClimbState(state).currentCollisionNormal

    // state = _handleOutisideAngle(state, _outAlongNormalALittle(velocityOnPlane.clone(), newCollisionNormal), newCollisionNormal)
    state = _handleOutisideAngle(state, velocityOnPlane, newCollisionNormal)


    state = _rotate(state, newCollisionNormal)


    return _handleClimbDownToVerticalPlane(state, currentCollisionNormal, newCollisionNormal, box).then(state => {
        return [state, velocityOnPlane]
    })
}

let _restoreCamera = (state: state) => {
    // if (NullableUtils.isNullable(
    //     getClimbState(state).beforeCameraType
    // )) {
    //     return state
    // }

    let beforeCameraType = NullableUtils.getExn(getClimbState(state).beforeCameraType)

    state = setClimbState(state, {
        ...getClimbState(state),
        beforeCameraType: NullableUtils.getEmpty()
    })

    // state = restoreFirstPersonControlsTarget(state)


    // if (getCameraType(state) == beforeCameraType) {
    //     return state
    // }

    state = useCamera(state, beforeCameraType)

    return state
}

let _updateLookat = (state: state, collisionNormal: Vector3) => {
    return lookat(state, collisionNormal.clone().negate())
}

let _switchToFirstPersonControls = (state: state, collisionNormal: Vector3) => {
    requireCheck(() => {
        test("climbPlane should be Verticle", () => {
            return getClimbState(state).climbPlane == climbPlane.Verticle
        })
    }, getIsDebug(state))

    // console.log("switch first: ", NullableUtils.isNullable(getClimbState(state).beforeCameraType),)

    if (NullableUtils.isNullable(getClimbState(state).beforeCameraType)) {
        state = setClimbState(state, {
            ...getClimbState(state),
            beforeCameraType: NullableUtils.return_(getCameraType(state))
        })
    }

    state = useCamera(state, cameraType.FirstPerson)

    return _updateLookat(state, collisionNormal)
}

let _getGroundNormal = () => new Vector3(0, 1, 0)

let _handleNotClimb = (state, velocity): Promise<[state, Vector3]> => {
    let d = directMove(state, velocity, false)
    state = d[0]
    velocity = d[1]

    state = setClimbState(state, {
        ...getClimbState(state),
        climbPlane: climbPlane.None,
        currentCollisionNormal: _getGroundNormal(),
        // lastVelocity: velocity,
        currentClimbedOBB: NullableUtils.getEmpty(),
        // rayStartPointOffsetForComputeNextCollisionNormal: new Vector3(0, 0, 0)
    })


    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createInitialState(), NullableUtils.getEmpty()).then(state => {
        return [state, velocity]
    })
}

let _isBeginClimbVertical = (state, nextClimbPlane, nextCollisionNormal) => {
    // let currentClimbPlane = getClimbState(state).climbPlane

    // // return currentClimbPlane == climbPlane.None || climbDirection_ == climbDirection.None
    // return currentClimbPlane == climbPlane.None

    return nextClimbPlane == climbPlane.Verticle && !getClimbState(state).currentCollisionNormal.equals(nextCollisionNormal)
}

let _moveToCollisionPosition = (state: state, box, collisionPosition) => {
    return translate(state,
        collisionPosition.clone().sub(
            box.getCenter(_v1)
        )
    )
}

let _handleBeginClimbVertical = (state: state, box, [nextCollisionPosition, nextCollisionNormal]) => {
    return _moveToCollisionPosition(state, box, nextCollisionPosition)
}


let _expandBox = (box: Box3) => {
    let scalar
    if (Device.isMobile()) {
        scalar = 3
    }
    else {
        scalar = 2
    }

    let size = box.getSize(_v1)
    let vec = _v2.set(
        size.x > scalar ? 0 : scalar - size.x,
        size.y > scalar ? 0 : scalar - size.y,
        size.z > scalar ? 0 : scalar - size.z,
    )

    box.expandByVector(vec)

    return box
}

// let _getBox = (state: state) => {
//     return _expandBox(getBox(state).clone())
// }


let _isBeginClimb = (state) => {
    return getClimbState(state).climbPlane == climbPlane.None
}

let _handleBeginClimb = (state: state) => {
    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createClimbState(), NullableUtils.getEmpty())
}

let _isRestoreCamera = (state: state) => {
    return !NullableUtils.isNullable(getClimbState(state).beforeCameraType)
        &&
        (
            getClimbState(state).climbPlane == climbPlane.Horrizon
            ||
            getClimbState(state).climbPlane == climbPlane.None
        )
}

let _switchCameraControls = (state: state) => {
    if (_isRestoreCamera(state)) {
        state = _restoreCamera(state)
    }
    if (NullableUtils.isNullable(getClimbState(state).beforeCameraType) && getClimbState(state).climbPlane == climbPlane.Verticle) {
        state = _switchToFirstPersonControls(state, getClimbState(state).currentCollisionNormal)
    }

    return state
}

let _isClimbToGround = (box) => {
    return box.getCenter(_v1).y - box.getSize(_v2).y / 2 < - box.getSize(_v2).y * 0.1
}

let _handleExitClimb = (state: state, box: Box3, velocity) => {
    requireCheck(() => {
        test("box should under ground", () => {
            return box.getSize(_v2).y / 2 > box.getCenter(_v1).y
        })
    }, getIsDebug(state))

    state = _restoreCamera(state)

    /*! make box on the ground
    * 
    */
    state = translate(
        state,
        _v1.set(0,
            box.getSize(_v2).y / 2 - box.getCenter(_v1).y,
            0)
    )
    /*! move out a little to avoid climb again when move in next loop
    * 
    */
    state = translate(
        state,
        _project(
            getClimbState(state).currentCollisionNormal,
            _getGroundNormal()
        ).normalize()
    )

    return _handleNotClimb(state, velocity)
}

let _handleClimbOnCurrentOBB = (state, climbDirection_, forwardVelocity, box, forward, side) => {
    requireCheck(() => {
        test("currentClimbedOBB should exist", () => {
            return !NullableUtils.isNullable(getClimbState(state).currentClimbedOBB)
        })
    }, getIsDebug(state))

    switch (climbDirection_) {
        case climbDirection.Horrizon:
            return _handleClimbHorrizonOutsideAngle(state, forwardVelocity, box, forward, side)
        case climbDirection.Verticle:
            return _handleClimbVerticalOutsideAngle(state, forwardVelocity, box, forward, side)
        case climbDirection.None:
            return _handleNoneClimbDownOutsideAngle(state, climbDirection_, forwardVelocity, box)
    }
}

// let _handleClimbOnNewOBB = (state, climbDirection_, currentClimbedOBB, intersectedOBB, box, delta, beforeVelocity, velocity, [nextCollisionPosition, nextCollisionNormal], forward, side) => {
//     switch (climbDirection_) {
//         case climbDirection.Horrizon:
//             return _handleClimbHorrizonOutsideAngle(state, forwardVelocity, box, forward, side)
//         case climbDirection.Verticle:
//             return _handleClimbVerticalOutsideAngle(state, forwardVelocity, box, forward, side)
//         case climbDirection.None:
//             return _handleNoneClimbDownOutsideAngle(state, climbDirection_, forwardVelocity, box)
//     }
// }

export let move = (state: state): Promise<[state, Vector3]> => {
    if (getClimbState(state).isPlayingAnimation) {
        return Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    let delta = Device.getDelta(getAbstractState(state))



    // state = _switchCameraControls(state)



    let [controlRotationAngle, forward, side] = computeTransformForCamera(state, road.LittleMan)

    if (forward == 0 && side == 0) {
        return Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    let [velocity, climbDirection_, forwardVelocity] = _computeCurrentDataBasedOnLastStatusAndCurrentInput(state, delta, forward, side, controlRotationAngle)



    // let box = _getBox(state)
    let box = getBox(state)


    if (_isClimbToGround(box)) {
        return _handleExitClimb(state, box, velocity)
    }


    let [nextCollisionData, intersectedOBB, intersectedCollisionPart_] = _computeNextCollisionData(state, box, forwardVelocity)

    // console.log(
    //     "move: ",
    //     nextCollisionNormal,
    //     velocity, beforeVelocity, climbDirection_, forwardVelocity
    // )

    // state = setClimbState(state, {
    //     ...getClimbState(state),
    //     rayStartPointOffsetForComputeNextCollisionNormal: new Vector3(0, 0, 0)
    // })


    if (NullableUtils.isNullable(nextCollisionData)) {
        if (NullableUtils.isNullable(getClimbState(state).currentClimbedOBB)) {
            return _handleNotClimb(state, velocity)
        }

        return _handleClimbOnCurrentOBB(state, climbDirection_, forwardVelocity, box, forward, side)
    }

    intersectedOBB = NullableUtils.getExn(intersectedOBB)

    // let currentClimbedOBB = getClimbState(state).currentClimbedOBB


    if (getClimbState(state).notClimbCollisionParts.includes(NullableUtils.getExn(intersectedCollisionPart_))) {
        return Promise.resolve(_handleCanNotClimb(state, box))
    }


    let [nextCollisionPosition, nextCollisionNormal, isFromForwardRay] = NullableUtils.getExn(nextCollisionData)



    // if (!_isCanClimb(state, nextCollisionNormal, climbDirection_)) {
    if (!_isCanClimb(nextCollisionNormal)) {
        return Promise.resolve(_handleCanNotClimb(state, box))
    }


    state = setClimbState(state, {
        ...getClimbState(state),
        currentClimbedOBB: intersectedOBB
    })


    let promise
    if (_isBeginClimb(state)) {
        promise = _handleBeginClimb(state)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => {
        // if (!currentClimbedOBB.equals(intersectedOBB)) {
        //     return _handleClimbOnNewOBB(state, climbDirection_, currentClimbedOBB, intersectedOBB, box, delta, beforeVelocity, velocity, [nextCollisionPosition, nextCollisionNormal], forward, side)
        // }


        return _handleClimbOnPlane(state, box, delta, velocity, [nextCollisionPosition, nextCollisionNormal, isFromForwardRay], forward, side)
    })
}

export let createState = (): climb => {
    return {
        climbPlane: climbPlane.None,
        currentCollisionNormal: _getGroundNormal(),
        // lastVelocity: new Vector3(0, 0, 0),
        currentClimbedOBB: NullableUtils.getEmpty(),
        // rayStartPointOffsetForComputeNextCollisionNormal: new Vector3(0, 0, 0),

        beforeCameraType: NullableUtils.getEmpty(),

        translation: NullableUtils.getEmpty(),

        isPlayingAnimation: false,

        notClimbCollisionParts: ArrayUtils.create(),
        notOnCollisionParts: ArrayUtils.create(),
    }
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManAnimationChangeEventName(), _animationChangeHandle))

    return setClimbState(state, createState())
}

let _animationChangeHandle = (state: state, { userData }) => {
    let { currentAnimationName, nextAnimationName } = NullableUtils.getExn(userData)

    if (currentAnimationName == animationName.ClimbToTop && nextAnimationName == animationName.Idle) {
        state = translate(state, getClimbState(state).translation)

        state = setClimbState(state, {
            ...getClimbState(state),
            translation: NullableUtils.getEmpty(),
            isPlayingAnimation: false
        })


        // state = translate(state, getClimbState(state).currentCollisionNormal.clone().multiplyScalar(
        //     getBox(state).getSize(_v2).y * 3 / 2
        // ))
        // state = setBonePositionYOffset(state, getLittleMan(state), 0)
        state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

        state = _restoreCamera(state)
    }
    else if (currentAnimationName == animationName.ClimbToDown && nextAnimationName == animationName.Idle) {
        state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

        state = _switchToFirstPersonControls(state, getClimbState(state).currentCollisionNormal)

        state = setClimbState(state, {
            ...getClimbState(state),
            isPlayingAnimation: false
        })
    }


    return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManAnimationChangeEventName(), _animationChangeHandle))

    return Promise.resolve(state)
}

export let isCanAction = (state: state) => {
    return !getClimbState(state).isPlayingAnimation && getClimbState(state).climbPlane == climbPlane.Horrizon
}

export let computeVelocityForBlink = (state, delta, forward, side, controlRotationAngle) => {
    requireCheck(() => {
        test("climbPlane is Horrizon", () => {
            return getClimbState(state).climbPlane == climbPlane.Horrizon
        })
    }, getIsDebug(state))


    let [velocity, climbDirection_, forwardVelocity] = _computeCurrentDataBasedOnLastStatusAndCurrentInput(state, delta, forward, side, controlRotationAngle)



    let box = getBox(state)


    let [nextCollisionData, intersectedOBB, intersectedCollisionPart_] = _computeNextCollisionData(state, box, forwardVelocity)

    if (NullableUtils.isNullable(nextCollisionData)
        ||
        (
            getClimbState(state).notClimbCollisionParts.includes(NullableUtils.getExn(intersectedCollisionPart_))
            || !NullableUtils.getExn(intersectedOBB).isEqual(NullableUtils.getExn(getClimbState(state).currentClimbedOBB))
        )

    ) {
        return new Vector3(0, 0, 0)
    }

    let [nextCollisionPosition, nextCollisionNormal, isFromForwardRay] = NullableUtils.getExn(nextCollisionData)

    return _getProjectOnPlane(state, forwardVelocity, nextCollisionNormal, climbDirection_, getClimbState(state).climbPlane)
}

export let isClimbing = (state: state) => {
    return getClimbState(state).climbPlane != climbPlane.None
}

export let setNotClimbCollisionParts = (state, notClimbCollisionParts) => {
    return setClimbState(state, {
        ...getClimbState(state),
        notClimbCollisionParts
    })
}

export let setNotOnCollisionParts = (state, notOnCollisionParts) => {
    return setClimbState(state, {
        ...getClimbState(state),
        notOnCollisionParts
    })
}

export let canOnCollisionPart = (state, collisionPart) => {
    return !getClimbState(state).notOnCollisionParts.includes(collisionPart)
}

export let getPositionY = (state: state, canOnCollisionPartFunc, girlOBBData: Array<[collisionPart, OBB]>, x, z) => {
    let startPoint = _v1.set(x, 1000, z)
    let downRay = new Ray(startPoint, _v2.set(0, -1, 0))

    return girlOBBData.reduce<Vector3>((nearestCollisionPosition, [collisionPart_, obb]) => {
        if (
            !canOnCollisionPartFunc(state, collisionPart_)
        ) {
            return nearestCollisionPosition
        }

        let d = intersect(obb, downRay)

        if (!NullableUtils.isNullable(d)
            && NullableUtils.getExn(d)[0].distanceTo(startPoint) < nearestCollisionPosition.distanceTo(startPoint)
        ) {
            return NullableUtils.getExn(d)[0]
        }

        return nearestCollisionPosition
    }, new Vector3(x, 0, z)).y
}

export let correctBoxCenterForBlink = (state: state) => {
    let box = getBox(state)
    let boxBottomPoint = _getBoxBottomPoint(box)

    let girlOBBData = getAllCollisionShapeOBBData(state).filter(([_, obb]) => {
        return obb.intersectsBox3(box)
    })

    if (girlOBBData.length == 0) {
        return state
    }


    let y = getPositionY(state,
        // (state, collisionPart_) => true,
        canOnCollisionPart,
        girlOBBData,
        boxBottomPoint.x, boxBottomPoint.z)

    return translate(state,
        _v2.set(
            0,
            y - boxBottomPoint.y,
            0
        )
    )
}
