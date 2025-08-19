// import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Object3D, Quaternion, Vector2, Vector3 } from "three"
// import { getRootMotionData } from "../data/RootMotionData"
// import { isCompletelyPlayingAnimation } from "./Animation"
// import { SkinAnimation } from "meta3d-jiehuo-abstract"
// import { getAnimationFrameCount } from "../data/Const"
// import { NumberUtils } from "meta3d-jiehuo-abstract"
// import { computeGirlBox, getBoxSizeForCompute, getGirlBox, getGirlBoxCenter, getGirlPosition, getScale, setGirlPosition, translate } from "./Utils"
// import { Collision } from "meta3d-jiehuo-abstract"
// import { collisionPart, pose } from "../type/StateType"
// import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getBox, getBoxSizeForCompute, getMovableRanges, getLittleManState, getName, getValue } from "./LittleMan"
import { actionName } from "../little_man_data/DataType"
import { Collision } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getPosition, getWorldPosition, setRotation, translate as translateTransform } from "./Transform"
import { isTriggerAction } from "./Action"
import { road } from "meta3d-jiehuo-abstract/src/type/StateType"
import { isLittleRoad } from "../CityScene"
import { speed } from "../data/DataType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { computeTransformForCamera } from "../Camera"
import { isMapWall } from "../manage/city1/MapWall"
import { boxCollisionResult } from "meta3d-jiehuo-abstract/src/utils/CollisionUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { wait } from "../manage/biwu/level1/scenario/Command"
import { xzRange } from "../type/StateType"
import { isInXZRange } from "../manage/city1/soldier/utils/CommanderUtils"
import { isNotInMovableRanges } from "./Utils"
import { getCollisionPartOBB, queryAllOBBShapesCollisionWithBox } from "../girl/Collision"
import { getName as getGirlName } from "../girl/Girl"
// import { getCurrentPose } from "./Pose"
// import { getPickObjectName, hasPickData } from "./PickPose"

const _q1 = new Quaternion();
const _e1 = new Euler();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let computeSpeed = (state, delta) => {
    let speed_ = delta * Device.getDeltaFactor()

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

let _isPassThroughBox = (newPosition, box: Box3) => {
    return !box.containsPoint(newPosition)
}

let _isEnterBox = (box: Box3, oldPosition, newPosition) => {
    // TODO fix: should judge by the distance of point to box plane
    return box.getCenter(_v1).sub(oldPosition).length() > box.getCenter(_v2).sub(newPosition).length()
}

let _getMaxHeightCanMove = (state: state) => {
    let scalar
    // switch (getCurrentPose(state)) {
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

export let updateMoveCollision = (velocity: Vector3, state: state, isJudgeGirl: boolean): Vector3 => {
    let littleManBox = getBox(state).clone()

    let oldLittleManBox = littleManBox.clone()

    let oldCenter = littleManBox.getCenter(new Vector3())

    littleManBox.translate(velocity)

    let newCenter = littleManBox.getCenter(new Vector3())

    let newLittleManBox = littleManBox.clone()


    if (isNotInMovableRanges(newCenter, getMovableRanges(state))) {
        return new Vector3(0, 0, 0)
    }

    // let data = Collision.queryBoxCollision(getAbstractState(state), _buildBoxForCollision(state, littleManBox))
    let queryBox = _buildBoxForCollision(state, newLittleManBox.union(oldLittleManBox))
    let data = Collision.queryBoxCollision(getAbstractState(state), queryBox)

    let collisionBox, collisionName
    // if (NullableUtils.isNullable(data)) {
    //     if (isCollisionWithGirl(littleManBox, state)) {
    //         collisionBox = getGirlBox(state)
    //     }
    //     else {
    //         return velocity
    //     }
    // }
    // else {
    //     let [_, box, _name] = NullableUtils.getExn(data)

    //     collisionBox = box
    // }

    if (NullableUtils.isNullable(data)) {
        if (isJudgeGirl) {
            let data2 = queryAllOBBShapesCollisionWithBox(state, queryBox, newCenter)
            if (!NullableUtils.isNullable(data2)) {
                collisionBox = getCollisionPartOBB(state, data2).toBox3()
                collisionName = getGirlName()
            }
            else {
                return velocity
            }
        }
        else {
            return velocity
        }
    }
    else {
        let [_, box, name] = NullableUtils.getExn(data)

        collisionBox = box
        collisionName = name
    }



    //     TODO update collision corresponding:
    //     refer to:
    // http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
    // https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

    if (
        isMapWall(collisionName)
        // ||
        // !isJudgeCollisionBox
        ||
        _isPassThroughBox(newCenter, collisionBox)
        || _isEnterBox(collisionBox, oldCenter, newCenter)

    ) {
        return new Vector3(0, 0, 0)
    }

    return velocity
}

// export let updateMoveCollisionForBlink = (velocity: Vector3, state: state): Vector3 => {
//     let littleManBox = getBox(state).clone()

//     let oldLittleManBox = littleManBox.clone()

//     let oldCenter = littleManBox.getCenter(new Vector3())

//     littleManBox.translate(velocity)

//     let newCenter = littleManBox.getCenter(new Vector3())

//     let newLittleManBox = littleManBox.clone()


//     if (isNotInMovableRanges(newCenter, getMovableRanges(state))) {
//         return new Vector3(0, 0, 0)
//     }

//     // let data = Collision.queryBoxCollision(getAbstractState(state), _buildBoxForCollision(state, littleManBox))
//     let queryBox = _buildBoxForCollision(state, newLittleManBox.union(oldLittleManBox))
//     let data = Collision.queryBoxCollision(getAbstractState(state), queryBox)

//     let collisionBox, collisionName
//     // if (NullableUtils.isNullable(data)) {
//     //     if (isCollisionWithGirl(littleManBox, state)) {
//     //         collisionBox = getGirlBox(state)
//     //     }
//     //     else {
//     //         return velocity
//     //     }
//     // }
//     // else {
//     //     let [_, box, _name] = NullableUtils.getExn(data)

//     //     collisionBox = box
//     // }

//     if (NullableUtils.isNullable(data)) {
//         // let data2 = queryAllOBBShapesCollisionWithBox(state, queryBox, newCenter)
//         // if (!NullableUtils.isNullable(data2)) {
//         //     collisionBox = getCollisionPartOBB(state, data2).toBox3()
//         //     collisionName = getGirlName()
//         // }
//         // else {
//         return velocity
//         // }
//     }
//     else {
//         let [_, box, name] = NullableUtils.getExn(data)

//         collisionBox = box
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
//         _isPassThroughBox(newCenter, collisionBox)
//         || _isEnterBox(collisionBox, oldCenter, newCenter)

//     ) {
//         return new Vector3(0, 0, 0)
//     }

//     return velocity
// }

export let translate = (state: state, translation: Vector3) => {
    if (state.config.isFastMove && isLittleRoad(state)) {
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
    if (!isTriggerAction(state, actionName.Shoot)) {
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
        velocity = updateMoveCollision(velocity, state, isJudgeGirl)
    }


    velocity.setY(0)

    state = translate(state, velocity)

    state = rotate(state, beforeVelocity)

    return [state, velocity]
}

export let move = (state: state): Promise<[state, Vector3]> => {
    let delta = Device.getDelta(getAbstractState(state))

    let [controlRotationAngle, forward, side] = computeTransformForCamera(state, road.LittleMan)

    if (forward == 0 && side == 0) {
        return Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    let velocity = computeTranslate(state, delta, forward, side, controlRotationAngle)

    return Promise.resolve(directMove(state, velocity, false))
}