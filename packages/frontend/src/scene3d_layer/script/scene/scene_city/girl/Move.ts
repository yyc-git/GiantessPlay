import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getGirl, getGirlMesh, getGirlState, setGirlState } from "./Girl"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Euler, Object3D, Quaternion, Vector3 } from "three"
import { getRootMotionData } from "../data/RootMotionData"
import { getCurrentAnimationName, getNextAnimationName, getPreviousAnimationName, isCompletelyPlayingAnimation, isPlayingAnimation } from "./Animation"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { computeGirlBox, getBoxSizeForCompute, getGirlBox, getGirlBoxCenter, getGirlPosition, getPivotWorldPosition, getScale, isGirlRotationLock, setGirlPosition, setGirlRotation, translate } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { getBone } from "../utils/MMDUtils"
import { collisionPart, pose } from "../type/StateType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getCurrentPose } from "./Pose"
import { getPickObjectName, hasPickData } from "./PickPose"
import { road } from "meta3d-jiehuo-abstract/src/type/StateType"
import { isGiantessRoad } from "../CityScene"
// import * as GiantessMove from "./giantess/Move"
// import * as LittleManMove from "./little_man/Move"
import { computeTransformForCamera } from "../Camera"
import { animationName } from "../data/DataType"
import { Console } from "meta3d-jiehuo-abstract"

const _q1 = new Quaternion();
const _e1 = new Euler();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let computeScaleFactor = (state: state) => {
	let scale = getScale(state)
	let factor = 0
	if (scale <= 5) {
		factor = 60
	}
	else if (scale <= 15) {
		factor = 55
	}
	// else if (scale <= 20) {
	//     factor = 52
	// }
	// else if (scale <= 25) {
	//     factor = 50
	// }
	else if (scale <= 40) {
		factor = 52
	}
	else if (scale <= 60) {
		factor = 47
	}
	else if (scale <= 80) {
		factor = 44
	}
	else if (scale <= 100) {
		factor = 43
	}
	else if (scale <= 130) {
		factor = 41
	}
	else if (scale <= 160) {
		factor = 40
	}
	else if (scale <= 200) {
		factor = 38
	}
	else if (scale <= 300) {
		factor = 35
	}
	else {
		factor = 33
	}

	return Math.sqrt(getScale(state)) / factor
}

let _computeTranslate = (state: state, delta, forward, side, controlRotationAngle) => {
	let velocity = new Vector3(0, 0, 0)
	// let speed = delta * 4 + 1
	let speed = delta * Device.getDeltaFactor()

	speed *= computeScaleFactor(state)

	let girlMesh = getGirlMesh(state)


	let speedFactor
	/*! fix blend to Walk */
	if (getPreviousAnimationName(state) == animationName.Idle && getCurrentAnimationName(state) == animationName.Walk && !isCompletelyPlayingAnimation(state, animationName.Walk)) {
		speedFactor = 7
	}
	else {
		speedFactor = getRootMotionData().reduce((speedFactor, data) => {
			// if (!isCompletelyPlayingAnimation(state, data.name)) {
			if (!isPlayingAnimation(state, data.name)) {
				return speedFactor
			}

			let frameIndex = SkinAnimation.getFrameIndex(
				MMD.findAnimationAction(getAbstractState(state), girlMesh, data.name),
				getAnimationFrameCount(state, data.name)
			)

			return data.value.reduce((speedFactor, v) => {
				if (NumberUtils.between(frameIndex, v.frameIndexRange[0], v.frameIndexRange[1])) {
					return v.speedFactor
				}

				return speedFactor
			}, speedFactor)
		}, 0)
	}

	// Console.log(speedFactor)

	if (speedFactor == 0) {
		return velocity
	}

	speed *= speedFactor

	// if (!Device.isMobile() && forward !== 0 && side !== 0) {
	// 	speed /= Math.sqrt(2)
	// }

	if (forward !== 0) {
		velocity.z -= speed * forward
	}

	if (side !== 0) {
		velocity.x += speed * side
	}

	// 旋转位移向量
	velocity.applyAxisAngle(Object3D.DEFAULT_UP, controlRotationAngle)

	return velocity
}

let _isEnterBox = (box, oldPosition, newPosition) => {
	return box.getCenter(_v1).sub(oldPosition).length() > box.getCenter(_v2).sub(newPosition).length()
}

// let _getMaxHeightCanMove = (capsule) => {
// 	return getCapsuleRadiusForCompute(capsule) * 1.2
// }

// let _buildCapsuleForCollision = (capsule) => {
// 	return capsule.clone().translate(_v1.set(0, _getMaxHeightCanMove(capsule), 0))
// }

let _getMaxHeightCanMove = (state: state) => {
	let scalar
	switch (getCurrentPose(state)) {
		case pose.Stand:
		case pose.Pick:
			scalar = 1
			break
		case pose.Crawl:
			scalar = 1.3
			break
	}

	return getBoxSizeForCompute(state) * scalar
}

let _buildBoxForCollision = (state, box) => {
	return box.clone().translate(_v1.set(0, _getMaxHeightCanMove(state), 0))
}

let _updateMoveCollision = (velocity: Vector3, state: state): [state, Vector3] => {
	// let capsule = getGirlState(state).capsule.clone()
	// let oldCenter = capsule.getCenter(new Vector3())
	// capsule.translate(velocity)
	// let newCenter = capsule.getCenter(new Vector3())


	let girlBox = getGirlBox(state).clone()

	let oldGirlBox = girlBox.clone()

	let oldCenter = girlBox.getCenter(new Vector3())
	girlBox.translate(velocity)
	let newCenter = girlBox.getCenter(new Vector3())

	let newGirlBox = girlBox

	let data
	if (hasPickData(state)) {
		data = Collision.queryCollisionByBoxAndSkip(getAbstractState(state), _buildBoxForCollision(state, newGirlBox.union(oldGirlBox)), getPickObjectName(state))
	}
	else {
		data = Collision.queryBoxCollision(getAbstractState(state), _buildBoxForCollision(state, girlBox))
	}

	if (NullableUtils.isNullable(data)) {
		return [state, velocity]
	}

	let [_, box, _name] = NullableUtils.getExn(data)

	//     TODO update collision corresponding:
	//     refer to:
	// http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
	// https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

	if (_isEnterBox(box, oldCenter, newCenter)) {
		state = setGirlState(state, {
			...getGirlState(state),
			isMoveCollisioned: true,
			lastMoveCollisionedTime: performance.now(),
		})

		return [state, new Vector3(0, 0, 0)]
	}

	return [state, velocity]
}

let _translate = (state: state, translation: Vector3) => {
	if (isGiantessRoad(state)) {
		if (state.config.isFastMove) {
			translation.multiplyScalar(10)
		}

		// return GiantessMove.translate(state, translation)
		return translate(state, translation)
	}
	else {
		// 	return LittleManMove.translate(state, translation)
		return translate(state, translation)
	}
}


// let _rotate = (state: state, localRotationY: number) => {
// 	if (isGiantessRoad(state)) {
// 		return GiantessMove.rotate(state, localRotationY)
// 	}
// 	else {
// 		return LittleManMove.rotate(state, localRotationY)
// 	}
// }

export let move = (state: state): [state, Vector3] => {
	let delta = Device.getDelta(getAbstractState(state))

	// let [localRotationY, controlRotationAngle, forward, side] = ThirdPersonControls.computeTransformForCamera(getAbstractState(state), getGirlState(state).rotationYForThirdPersonControl, Camera.getOrbitControls(getAbstractState(state)), road.Giantess)
	let [controlRotationAngle, forward, side] = computeTransformForCamera(state, road.Giantess)

	// if (isGiantessRoad(state)) {
	// state = _rotate(state, localRotationY)



	// }


	if (forward == 0 && side == 0) {
		return [state, new Vector3(0, 0, 0)]
	}


	let velocity = _computeTranslate(state, delta, forward, side, controlRotationAngle)

	velocity.setY(0)

	let beforeVelocity = velocity.clone()

	if (!state.config.isNotMoveCollision || !getGirlState(state).isAllowMoveCollision) {
		let data = _updateMoveCollision(velocity, state)
		state = data[0]
		velocity = data[1]
	}


	velocity.setY(0)


	state = _translate(state, velocity)

	state = setGirlRotation(state, TransformUtils.getLookatQuaternion(
		_v1.set(0, 0, 0),
		beforeVelocity
	))




	return [state, velocity]
}

export let isMoveCollisioned = (state: state) => {
	return getGirlState(state).isMoveCollisioned
}

export let isAllowMoveCollision = (state, value) => {
	return setGirlState(state, {
		...getGirlState(state),
		isAllowMoveCollision: value,
	})
}