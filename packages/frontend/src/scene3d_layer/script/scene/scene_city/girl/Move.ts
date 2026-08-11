import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getGirl, getGirlMesh, getMovableRanges, getUsedGirlData, setUsedGirlData } from "./Girl"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Euler, Object3D, Quaternion, Vector3 } from "three"
import { getRootMotionData } from "../data/RootMotionData"
import { computeDuration, getCurrentAnimationName, getDurationFactor, getNextAnimationName, getPreviousAnimationName, isCompletelyPlayingAnimation, isPlayingAnimation } from "./Animation"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { computeGirlBoxAndSetToState, getBoxSizeForCompute, getFactorByScale, getGirlBox, getGirlBoxCenter, getGirlPosition, getPivotWorldPosition, getScale, isGirlRotationLock, isSuperBigGiantess, setGirlPosition, setGirlRotation, translate } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { getBone } from "../utils/MMDUtils"
import { collisionPart, pose, usedGirlEnum } from "../type/StateType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getCurrentPose } from "./Pose"
import { getPickObjectNames, hasPickData } from "./PickPoseUtils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl } from "../CityScene"
// import * as GiantessMove from "./giantess/Move"
// import * as LittleManMove from "./little_man/Move"
import { computeTransformForCamera, getCameraType, isFirstPersonCamera } from "../Camera"
import { animationName } from "../data/DataType"
import { getNow } from "../Time"
import { isNotInMovableRanges } from "../little_man/Utils"
import { computeMoveCollisionVelocity, queryBoxCollision } from "../utils/MoveUtils"
import { getBoxBottomPoint } from "../utils/Box3Utils"
import { TupleUtils } from "meta3d-jiehuo-abstract"

const _q1 = new Quaternion();
const _e1 = new Euler();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _computeScaleFactor = (state: state, usedGirl) => {
	// let scale = getScale(state, usedGirl)
	// let factor = 0
	let factor = getFactorByScale(state, usedGirl, [
		{
			scale: 5,
			factor: 60
		},
		{
			scale: 15,
			factor: 55
		},
		{
			scale: 40,
			factor: 52
		},
		{
			scale: 60,
			factor: 47
		},
		{
			scale: 80,
			factor: 44
		},
		{
			scale: 100,
			factor: 43
		},
		{
			scale: 130,
			factor: 41
		},
		{
			scale: 160,
			factor: 40
		},
		{
			scale: 200,
			factor: 38
		},
		{
			scale: 300,
			factor: 35
		},
		{
			scale: 500,
			factor: 33
		},
		{
			scale: 1000,
			factor: 28
		},
		{
			scale: 1500,
			factor: 24
		},
		{
			scale: 2000,
			factor: 20
		},
		{
			scale: 5000,
			factor: 11
		},
		{
			// factor: 33
			factor: 8
		},
	])
	// if (scale <= 5) {
	// 	factor = 60
	// }
	// else if (scale <= 15) {
	// 	factor = 55
	// }
	// // else if (scale <= 20) {
	// //     factor = 52
	// // }
	// // else if (scale <= 25) {
	// //     factor = 50
	// // }
	// else if (scale <= 40) {
	// 	factor = 52
	// }
	// else if (scale <= 60) {
	// 	factor = 47
	// }
	// else if (scale <= 80) {
	// 	factor = 44
	// }
	// else if (scale <= 100) {
	// 	factor = 43
	// }
	// else if (scale <= 130) {
	// 	factor = 41
	// }
	// else if (scale <= 160) {
	// 	factor = 40
	// }
	// else if (scale <= 200) {
	// 	factor = 38
	// }
	// else if (scale <= 300) {
	// 	factor = 35
	// }
	// else {
	// 	factor = 33
	// }

	return Math.sqrt(getScale(state, usedGirl)) / factor
}

let _computeTranslate = (state: state, usedGirl, delta, forward, side, controlRotationAngle) => {
	let velocity = new Vector3(0, 0, 0)
	// let speed = delta * 4 + 1
	let speed = delta * Device.getDeltaFactor()

	speed *= _computeScaleFactor(state, usedGirl)

	// speed /= getDurationFactor(state, usedGirl)


	// let duration = computeDuration(state, getCurrentAnimationName(state, usedGirl))
	// let actualDurationFactor = computeActualDuration(state, getCurrentAnimationName(state, usedGirl), duration) / duration
	// speed /= actualDurationFactor
	speed /= TupleUtils.getTuple3Second(computeDuration(state, usedGirl, getCurrentAnimationName(state, usedGirl)))



	let girlMesh = getGirlMesh(state, usedGirl)


	let speedFactor
	/*! fix blend to Walk */
	if (getPreviousAnimationName(state, usedGirl) == animationName.Idle && getCurrentAnimationName(state, usedGirl) == animationName.Walk && !isCompletelyPlayingAnimation(state, usedGirl, animationName.Walk)) {
		speedFactor = 7
	}
	else {
		speedFactor = getRootMotionData().reduce((speedFactor, data) => {
			// if (!isCompletelyPlayingAnimation(state, data.name)) {
			if (!isPlayingAnimation(state, usedGirl, data.name)) {
				return speedFactor
			}

			let frameIndex = SkinAnimation.getFrameIndex(
				MMD.findAnimationAction(getAbstractState(state), usedGirl, girlMesh, data.name),
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

	// if (!Device.isMobileByState(getAbstractState(state)) && forward !== 0 && side !== 0) {
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

// let _isEnterBox = (box, oldPosition, newPosition) => {
// 	return box.getCenter(_v1).sub(oldPosition).length() > box.getCenter(_v2).sub(newPosition).length()
// }

// let _getMaxHeightCanMove = (capsule) => {
// 	return getCapsuleRadiusForCompute(capsule) * 1.2
// }

// let _buildCapsuleForCollision = (capsule) => {
// 	return capsule.clone().translate(_v1.set(0, _getMaxHeightCanMove(capsule), 0))
// }

let _getMaxHeightCanMove = (state: state, usedGirl) => {
	let scalar
	switch (getCurrentPose(state, usedGirl)) {
		case pose.Stand:
		case pose.Pick:
			// scalar = 1
			scalar = 1.3
			break
		case pose.Crawl:
			// scalar = 1.3
			scalar = 1.5
			break
	}

	return getBoxSizeForCompute(state, usedGirl) * scalar
}

let _buildBoxForCollision = (state, usedGirl, box) => {
	return box.clone().translate(_v1.set(0, _getMaxHeightCanMove(state, usedGirl), 0))
}

let _updateMoveCollision = (velocity: Vector3, state: state, usedGirl): [state, Vector3] => {
	// let capsule = getUsedGirlData(state, usedGirl).capsule.clone()
	// let oldPoint = capsule.getCenter(new Vector3())
	// capsule.translate(velocity)
	// let newPoint = capsule.getCenter(new Vector3())


	let girlBox = getGirlBox(state, usedGirl).clone()

	let oldGirlBox = girlBox.clone()



	let oldPoint = getBoxBottomPoint(_buildBoxForCollision(state, usedGirl, oldGirlBox), 0, new Vector3())

	let newGirlBox = girlBox.translate(velocity)

	let newPoint = getBoxBottomPoint(_buildBoxForCollision(state, usedGirl, newGirlBox), 0, new Vector3())


	if (getCurrentPose(state, usedGirl) != pose.Crawl && !isSuperBigGiantess(state, usedGirl) && isNotInMovableRanges(newPoint, getMovableRanges(state, usedGirl))) {
		return [state, new Vector3(0, 0, 0)]
	}


	let data
	if (hasPickData(state, usedGirl)) {
		data = Collision.queryCollisionByBoxAndSkip(getAbstractState(state),
			Collision.getPlayerMoveCollisionableContainers(getAbstractState(state)),
			_buildBoxForCollision(state, usedGirl, newGirlBox.union(oldGirlBox)), getPickObjectNames(state, usedGirl))
	}
	else {
		data = queryBoxCollision(getAbstractState(state), state,
			_buildBoxForCollision(state, usedGirl, girlBox),
			false,
			false
		)
	}

	// if (NullableUtils.isNullable(data)) {
	// 	return [state, velocity]
	// }

	// let [_, box, _name] = NullableUtils.getExn(data)

	//     TODO update collision corresponding:
	//     refer to:
	// http://www.cad.zju.edu.cn/home/jin/3danimationcourse/collision.pdf
	// https://www.gamedev.net/forums/topic/599303-capsule-box-collision-detection/

	// let [newVelocity, isCollision] = computeMoveCollisionVelocity(velocity, oldPoint, box, false)
	let [newVelocity, isCollision] = computeMoveCollisionVelocity(velocity, oldPoint, [data, []])

	if (isCollision) {
		state = setUsedGirlData(state, usedGirl, {
			...getUsedGirlData(state, usedGirl),
			isMoveCollisioned: true,
			lastMoveCollisionedTime: getNow(state),
		})

		// return [state, new Vector3(0, 0, 0)]
	}

	return [state, newVelocity]
}

let _translate = (state: state, usedGirl, translation: Vector3) => {
	if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
		if (state.config.isFastMove) {
			translation.multiplyScalar(10)
		}

		// return GiantessMove.translate(state, translation)
		return translate(state, usedGirl, translation)
	}
	else {
		// 	return LittleManMove.translate(state, translation)
		return translate(state, usedGirl, translation)
	}
}


// let _rotate = (state: state, localRotationY: number) => {
// 	if (isGiantessCharacterType(state)) {
// 		return GiantessMove.rotate(state, localRotationY)
// 	}
// 	else {
// 		return LittleManMove.rotate(state, localRotationY)
// 	}
// }

export let move = (state: state, usedGirl): [state, Vector3] => {
	let delta = Device.getDelta(getAbstractState(state))

	// let [localRotationY, controlRotationAngle, forward, side] = ThirdPersonControls.computeTransformForCamera(getAbstractState(state), getUsedGirlData(state, usedGirl).rotationYForThirdPersonControl, Camera.getOrbitControls(getAbstractState(state)), characterType.Giantess)
	let [controlRotationAngle, forward, side] = computeTransformForCamera(state, usedGirl, characterType.Giantess, getCameraType(state))

	// if (isGiantessCharacterType(state)) {
	// state = _rotate(state, localRotationY)



	// }


	if (forward == 0 && side == 0) {
		return [state, new Vector3(0, 0, 0)]
	}


	let velocity = _computeTranslate(state, usedGirl, delta, forward, side, controlRotationAngle)

	velocity.setY(0)

	let beforeVelocity = velocity.clone()

	if (!state.config.isNotMoveCollision || !getUsedGirlData(state, usedGirl).isAllowMoveCollision) {
		let data = _updateMoveCollision(velocity, state, usedGirl)
		state = data[0]
		velocity = data[1]
	}


	velocity.setY(0)


	state = _translate(state, usedGirl, velocity)

	if (!isFirstPersonCamera(state)) {
		state = setGirlRotation(state, usedGirl, TransformUtils.getLookatQuaternion(
			_v1.set(0, 0, 0),
			beforeVelocity
		))
	}



	return [state, velocity]
}

export let isMoveCollisioned = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).isMoveCollisioned
}

export let isAllowMoveCollision = (state, usedGirl, value) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		isAllowMoveCollision: value,
	})
}