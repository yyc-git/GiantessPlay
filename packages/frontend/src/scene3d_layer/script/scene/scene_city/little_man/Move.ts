// import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Object3D, Quaternion, Ray, Vector2, Vector3 } from "three"
// import { getRootMotionData } from "../data/RootMotionData"
// import { isCompletelyPlayingAnimation } from "./Animation"
// import { SkinAnimation } from "meta3d-jiehuo-abstract"
// import { getAnimationFrameCount } from "../data/Const"
// import { NumberUtils } from "meta3d-jiehuo-abstract"
// import { computeGirlBoxAndSetToState, getBoxSizeForCompute, getGirlBox, getGirlBoxCenter, getGirlPosition, getScale, setGirlPosition, translate } from "./Utils"
// import { Collision } from "meta3d-jiehuo-abstract"
// import { collisionPart, pose } from "../type/StateType"
// import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getBox, getBoxSizeForCompute, getMovableRanges, getLittleManState, getName, getValue, getLastPosition, setLastPosition, getActuallyMoveSpeedRecordInTwoSeconds, setActuallyMoveSpeedRecordInTwoSeconds } from "./LittleMan"
import { actionName } from "../little_man_data/DataType"
import { Collision } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getPosition, getWorldPosition, setRotation, translate as translateTransform } from "./Transform"
import { isTriggerAction } from "./Action"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getScene, isLittleCharacterType } from "../CityScene"
import { speed } from "../data/DataType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { computeTransformForCamera } from "../Camera"
import { isMapWall } from "../manage/city1/MapWall"
import { boxCollisionResult } from "meta3d-jiehuo-abstract/src/utils/CollisionUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { wait } from "../manage/biwu/level1/scenario/Command"
import { millisecondUnit, usedGirlEnum, xzRange } from "../type/StateType"
import { isInXZRange } from "../manage/city1/soldier/utils/CommanderUtils"
import { isNotInMovableRanges } from "./Utils"
import { getCollisionPartOBB, queryAllOBBShapesCollisionWithBox, queryOBBShapeCollisionWithBox } from "../girl/Collision"
import { getCurrentUsedGirls, isPlayerGiantess } from "../girl/Girl"
import { getCameraType, isShootCamera } from "../LittleManCamera"
import { computeMoveCollisionVelocity, queryBoxCollision } from "../utils/MoveUtils"
import { isPlayingAnimation } from "./Animation"
import { getFastRunBlockService, getSwipBlockService } from "../../../../mod/SkillLittleManMod"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getNow } from "../Time"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { addBox3Helper } from "../utils/ConfigUtils"
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB"
import { getBoxTopPoint } from "../utils/Box3Utils"
// import { getCurrentPose } from "./Pose"
// import { getPickObjectName, hasPickData } from "./PickPoseUtils"

const _q1 = new Quaternion();
const _e1 = new Euler();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let computeSpeed = (state, delta) => {
    let speed_ = delta * Device.getDeltaFactor()

    let factor
    if (isPlayingAnimation(state, getFastRunBlockService(state).getAnimationName())) {
        factor = 3
    }
    else {
        factor = 1
    }
    speed_ *= factor

    return speed_ * 0.1 * (getValue(state).moveSpeed / speed.Middle)
}

export let computeTranslate = (state: state, delta, forward, side, controlRotationAngle) => {
    let velocity = new Vector3(0, 0, 0)
    let speed_ = computeSpeed(state, delta)

    if (forward !== 0) {
        velocity.z -= speed_ * forward
    }

    if (side !== 0) {
        velocity.x += speed_ * side
    }

    // 旋转位移向量
    velocity.applyAxisAngle(Object3D.DEFAULT_UP, controlRotationAngle)

    return velocity
}

// let _isPassThroughBox = (newPosition, box: Box3) => {
//     return !box.containsPoint(newPosition)
// }

// let _isEnterBox = (box: Box3, oldPosition, newPosition) => {
//     // TODO fix: should judge by the distance of point to box plane
//     return box.getCenter(_v1).sub(oldPosition).length() > box.getCenter(_v2).sub(newPosition).length()
// }

let _getMaxHeightCanMove = (state: state) => {
    let scalar
    // switch (getCurrentPose(state, usedGirl)) {
    //     case pose.Stand:
    //     case pose.Pick:
    //         scalar = 1
    //         break
    //     case pose.Crawl:
    //         scalar = 1.3
    //         break
    // }
    scalar = 1

    return getBoxSizeForCompute(state) * scalar
}

let _buildBoxForCollision = (state, box) => {
    return box.clone().translate(_v1.set(0, _getMaxHeightCanMove(state), 0))
}

let _findAllCollisionBoundings = (state: state, newLittleManBox, oldLittleManBox, newPoint, isOnlyCollisionWithStatic, isJudgeGirl): [Array<Box3>, Array<OBB>] => {
    let queryBox = _buildBoxForCollision(state, newLittleManBox.union(oldLittleManBox))

    let collisionBoxes = queryBoxCollision(getAbstractState(state), state, queryBox, isOnlyCollisionWithStatic, true)

    // let collisionOBBs
    // if (isJudgeGirl && !isPlayerGiantess(state, usedGirl)) {
    //     collisionOBBs = queryAllOBBShapesCollisionWithBox(state, usedGirl, queryBox, newPoint).map(collisionPart_ => getCollisionPartOBB(state, usedGirl, collisionPart_))
    // }
    // else {
    //     collisionOBBs = []
    // }
    let collisionOBBs = ArrayUtils.reduce(getCurrentUsedGirls(state), (result, usedGirl) => {
        if (isJudgeGirl && !isPlayerGiantess(state, usedGirl)) {
            return ArrayUtils.pushArrs(result, queryAllOBBShapesCollisionWithBox(state, usedGirl, queryBox, newPoint).map(collisionPart_ => getCollisionPartOBB(state, usedGirl, collisionPart_)))
        }

        return result
    }, [])

    return [collisionBoxes, collisionOBBs]
}

export let updateMoveCollision = (velocity: Vector3, state: state, isJudgeGirl: boolean, isOnlyCollisionWithStatic: boolean, _?): Vector3 => {
    let littleManBox = getBox(state).clone()

    let oldLittleManBox = littleManBox.clone()

    let oldPoint1 = littleManBox.getCenter(new Vector3())
    let oldPoint2 = getBoxTopPoint(littleManBox, 0, new Vector3())


    // // 创建调整后的速度向量
    // let adjustedVelocity = velocity.clone()


    littleManBox.translate(velocity)

    let newPoint1 = littleManBox.getCenter(new Vector3())
    let newPoint2 = getBoxTopPoint(littleManBox, 0, new Vector3())

    let newLittleManBox = littleManBox.clone()


    if (isNotInMovableRanges(newPoint1, getMovableRanges(state))) {
        return new Vector3(0, 0, 0)
    }


    velocity = TupleUtils.getTuple2First(computeMoveCollisionVelocity(velocity, oldPoint1, _findAllCollisionBoundings(state, newLittleManBox, oldLittleManBox, newPoint1, isOnlyCollisionWithStatic, isJudgeGirl)))
    velocity = TupleUtils.getTuple2First(computeMoveCollisionVelocity(velocity, oldPoint2, _findAllCollisionBoundings(state, newLittleManBox, oldLittleManBox, newPoint2, isOnlyCollisionWithStatic, isJudgeGirl)))

    return velocity
}

// export let updateMoveCollisionForBlink = (velocity: Vector3, state: state): Vector3 => {
//     let littleManBox = getBox(state).clone()

//     let oldLittleManBox = littleManBox.clone()

//     let oldPoint = littleManBox.getCenter(new Vector3())

//     littleManBox.translate(velocity)

//     let newPoint = littleManBox.getCenter(new Vector3())

//     let newLittleManBox = littleManBox.clone()


//     if (isNotInMovableRanges(newPoint, getMovableRanges(state))) {
//         return new Vector3(0, 0, 0)
//     }

//     // let data = Collision.queryBoxCollision(getAbstractState(state), _buildBoxForCollision(state, littleManBox))
//     let queryBox = _buildBoxForCollision(state, newLittleManBox.union(oldLittleManBox))
//     let data = Collision.queryBoxCollision(getAbstractState(state), queryBox)

//     let collisionBounding, collisionName
//     // if (NullableUtils.isNullable(data)) {
//     //     if (isCollisionWithGirl(littleManBox, state)) {
//     //         collisionBounding = getGirlBox(state, usedGirl)
//     //     }
//     //     else {
//     //         return velocity
//     //     }
//     // }
//     // else {
//     //     let [_, box, _name] = NullableUtils.getExn(data)

//     //     collisionBounding = box
//     // }

//     if (NullableUtils.isNullable(data)) {
//         // let data2 = queryOBBShapeCollisionWithBox(state, queryBox, newPoint)
//         // if (!NullableUtils.isNullable(data2)) {
//         //     collisionBounding = getCollisionPartOBB(state, usedGirl,  data2).toBox3()
//         //     collisionName = getGirlName()
//         // }
//         // else {
//         return velocity
//         // }
//     }
//     else {
//         let [_, box, name] = NullableUtils.getExn(data)

//         collisionBounding = box
//         collisionName = name
//     }



//     //     TODO update collision corresponding:
//     //     refer to:
//     // http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
//     // https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

//     if (
//         isMapWall(collisionName)
//         // ||
//         // !isJudgeCollisionBox
//         ||
//         _isPassThroughBox(newPoint, collisionBounding)
//         || _isEnterBox(collisionBounding, oldPoint, newPoint)

//     ) {
//         return new Vector3(0, 0, 0)
//     }

//     return velocity
// }

export let translate = (state: state, translation: Vector3) => {
    if (state.config.isFastMove && isLittleCharacterType(state)) {
        translation.multiplyScalar(30)
    }


    getBox(state).translate(translation)


    return translateTransform(state, translation)
}

// export let setPosition = (state: state, position: Vector3) => {
//     let translation = position.clone().sub(getWorldPosition(state))

//     getBox(state).translate(translation)

//     return translateTransform(state, translation)
// }

// let _rotate = (state: state, localRotationY: number) => {
//     if (localRotationY != 0) {
//         state = setRotation(state, _q1.setFromEuler(_e1.set(0, localRotationY, 0)))
//     }

//     return state
// }

export let rotate = (state: state, targetPosition: Vector3) => {
    // if (!isTriggerAction(state, actionName.Shoot)) {
    if (!isShootCamera(state)
        && !isPlayingAnimation(state, getSwipBlockService(state).getAnimationName())
    ) {
        state = setRotation(state, TransformUtils.getLookatQuaternion(
            _v1.set(0, 0, 0),
            targetPosition
        ))
    }

    return state
}


export let directMove = (state: state, velocity: Vector3, isJudgeGirl): [state, Vector3] => {
    velocity.setY(0)

    let beforeVelocity = velocity.clone()

    if (!state.config.isNotMoveCollision) {
        velocity = updateMoveCollision(velocity, state, isJudgeGirl, false)
    }


    velocity.setY(0)

    state = translate(state, velocity)

    // if (!isShootCamera(state)) {
    state = rotate(state, beforeVelocity)
    // }

    return [state, velocity]
}

let _updateActuallMoveSpeedRecord = (state: state, delta: millisecondUnit) => {
    if (NullableUtils.isNullable(getLastPosition(state))) {
        return setLastPosition(state, getPosition(state))
    }

    let now = getNow(state)

    state = setActuallyMoveSpeedRecordInTwoSeconds(state,
        ArrayUtils.filter(
            ArrayUtils.push(
                getActuallyMoveSpeedRecordInTwoSeconds(state),
                {
                    speed: getPosition(state).distanceTo(
                        NullableUtils.getExn(getLastPosition(state))
                    ) / delta,
                    time: now
                }
            ),
            (({ time }) => {
                return now - time <= 2000
            })
        )
    )

    state = setLastPosition(state, getPosition(state).clone())

    return state
}

export let move = (state: state): Promise<[state, Vector3]> => {
    let delta = Device.getDelta(getAbstractState(state))

    state = _updateActuallMoveSpeedRecord(state, delta)

    let [controlRotationAngle, forward, side] = computeTransformForCamera(state, usedGirlEnum.None, characterType.LittleMan, getCameraType(state))

    if (forward == 0 && side == 0) {
        return Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    let velocity = computeTranslate(state, delta, forward, side, controlRotationAngle)

    // return Promise.resolve(directMove(state, velocity, false))
    return Promise.resolve(directMove(state, velocity, true))
}