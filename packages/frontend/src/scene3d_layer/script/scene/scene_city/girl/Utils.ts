import { NullableUtils } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { getCenter, getCenterInFloor, getGirl, getGirlMesh, getGirlMeshByUsedGirl, getHp, getValue, hasGirlMesh, isTriggerAction, isBossGiantess, isLevelGiantess, getLastStressingTime, setActionState, setLastScaleChangeTime, resetIsTriggerAction, setBiggerCount, getBiggerCount, getGirlState, getGiantessStressingRate, getNeedUpdateStatusName, isPlayerGirl, setAddScaleByBiggerCount, getAddScaleByBiggerCount, isUseGirl, getUsedGirlData, setUsedGirlData, buildNameByUsedGirl } from "./Girl"
import { Box3, Matrix4, Quaternion, Vec2, Vector2, Vector3 } from "three";
import { getBone, getCurrentMMDData } from "../utils/MMDUtils";
import { actionState, collisionPart, damageType, objectStateName, pose, usedGirlEnum } from "../type/StateType";
import { getGirlScale, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl } from "../CityScene";
import { getCollisionPartCenter, getCollisionPartOBB, hasCollisionPartOBB, updateAllCollisionShapes } from "./Collision";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "./Pose";
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { actionName, armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, forceSize, } from "../data/DataType";
import { MMD } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { getHpData, isCloth } from "./Cloth";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { createInitialState, getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine } from "./FSMState";
import { off } from "meta3d-jiehuo-abstract/src/Event";
import { stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCurrentAnimationName, playBiggerAnimation, playSmallerAnimation } from "./Animation";
import { getSkillStressingFactor } from "../data/Data";
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterCollisionSize, emitterCount, emitterLife, emitterSize, emitterSpeed, emitterVolume, explodeRange, girlValue, meleeRange, weaponType, weaponValue } from "../data/ValueType";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Event } from "meta3d-jiehuo-abstract";
import { getDestroyedEventName, getDestroyingEventName } from "../utils/EventUtils";
import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, buildPickdownEventData, getBossStatusUpdateEventName, buildBossStatusUpdateEventNameEventData, getInsertEventName, getPutToBreastEventName, getPutToShoeEventName, } from "../../../../utils/EventUtils"
import * as PickPose from "./PickPose"
import * as InitWhenImportScene from "./InitWhenImportScene"
import { crawlToStandHandler, standToCrawlHandler } from "./Crawl";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getNow } from "../Time";
import { expandBox, getBoxMaxSize, getBoxVolumn } from "../utils/Box3Utils";
// import { setNeedShowSkillBar } from "../UI";
import { isControlledState, isDestoryRelatedStates, isMoveState, isPickedControlledState } from "../utils/FSMStateUtils";
import { hasPickData } from "./PickPoseUtils";
import { computeForceByHeight, getHeight } from "../utils/DamageUtils";
import { isUseInfinityBig } from "../../../../mod/PropOtherMod";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getBody } from "../data/mmd/MMDData";
import { getCameraType, getOrbitControlsTarget, isCameraCollision, updateFirstPersonControls } from "../Camera";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { getCampExn } from "../manage/city1/Army";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _m1 = new Matrix4();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

// export let getCapsuleRadiusForCompute = (capsule) => {
// 	return capsule.radius * 2
// }


export let computeGirlBoxDefault = (state: state, usedGirl) => {
	let box

	let headBox = getCollisionPartOBB(state, usedGirl, collisionPart.Head).toBox3()
	if (headBox.getSize(_v1).length() == 0) {
		box = new Box3().setFromCenterAndSize(getGirlPosition(state, usedGirl).clone().setY(10), _v2.set(40, 40, 40))
	}
	else {
		switch (getCurrentPose(state, usedGirl)) {
			case pose.Sit:
				box = getUsedGirlData(state, usedGirl).box.makeEmpty().union(
					headBox
				).union(
					getCollisionPartOBB(state, usedGirl, collisionPart.TrigoneAndButt).toBox3()
				)
				break
			default:
				box = getUsedGirlData(state, usedGirl).box.makeEmpty().union(
					headBox
				).union(
					getCollisionPartOBB(state, usedGirl, collisionPart.LeftFoot).toBox3()
				).union(
					getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot).toBox3()
				)
				break
		}

		let negateSize = box.getSize(_v1).negate()
		box = box.expandByVector(
			_v2.set(
				negateSize.x * 0.2,
				0,
				negateSize.z * 0.2,
			)
		)
	}

	// return setUsedGirlData(state, usedGirl,{
	// 	...getUsedGirlData(state, usedGirl),
	// 	box
	// })
	return box
}

export let computeGirlBox = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).computeBoxFunc(state, usedGirl)
}

export let computeGirlBoxAndSetToState = (state: state, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		box: computeGirlBox(state, usedGirl)
	})
}

export let computeGirlBoxAndNotChangeCenterXY = (state, usedGirl) => {
	if (!isUseGirl(state, usedGirl) || !hasCollisionPartOBB(state, usedGirl)) {
		return state
	}

	state = computeGirlBoxAndSetToState(state, usedGirl)

	switch (getCurrentPose(state, usedGirl)) {
		case pose.Stand:
			let pos = getGirlPosition(state, usedGirl)
			state = makeBoxToCenterInXYPlane(state, usedGirl, pos.x, pos.z)
			break
	}

	return state
}

export let makeBoxToCenterInXYPlane = (state: state, usedGirl, centerX: number, centerZ: number) => {
	let box = getGirlBox(state, usedGirl)
	let oldCenter = box.getCenter(_v1)

	box.setFromCenterAndSize(
		oldCenter.set(centerX, oldCenter.y, centerZ),
		box.getSize(_v2)
	)

	return state
}

export let updateAllCollisionShapesAndGirlBox = (state: state, usedGirl) => {
	let girl = getGirl(state, usedGirl)

	state = updateAllCollisionShapes(state, usedGirl, girl)

	return computeGirlBoxAndSetToState(state, usedGirl)
}

export let getGirlBox = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).box
}

// export let getSmallGirlBox = (state: state) => {
// 	return getGirlBox(state, usedGirl).clone().expandByVector(_v1.set(0.3, 1, 0.3))
// }

export let getBigGirlBox = (state: state, usedGirl) => {
	// return getGirlBox(state, usedGirl).clone().expandByVector(_v1.set(1.5, 1, 1.5))
	// return getGirlBox(state, usedGirl).clone().expandByVector(_v1.set(2, 2, 2))
	// return getGirlBox(state, usedGirl).clone().expandByVector(getGirlBox(state, usedGirl).getSize(_v1))
	let box = getGirlBox(state, usedGirl)
	return box.clone().setFromCenterAndSize(
		box.getCenter(_v1),
		// box.getSize(_v2).multiplyScalar(2)
		box.getSize(_v2).multiplyScalar(6)
	)
	// return expandBox(getGirlBox(state, usedGirl).clone(), getGirlBox(state, usedGirl).getSize(_v1))
}


export let getGirlBoxCenter = (state: state, usedGirl) => {
	return getGirlBox(state, usedGirl).getCenter(new Vector3())
}

export let getBoxSizeForCompute = (state: state, usedGirl) => {
	// 	let value = getUsedGirlData(state, usedGirl).collisionShapeMap.get(collisionPart.Head).halfSize.x * 2

	// 	if(value == 0){
	// getBone()
	// 	}





	// let girl = getGirl(state, usedGirl)

	// let data1 = getBone(state,usedGirl, girl, "左目")
	// state = data1[0]
	// let bone1 = data1[1]

	// let data2 = getBone(state,usedGirl, girl, "右目")
	// state = data2[0]
	// let bone2 = data2[1]


	// return bone1.getWorldPosition(_v1).distanceTo(bone2.getWorldPosition(_v2)) * 2


	return 0.2 * getGirlScale(state, usedGirl) * 2
}

export let getGirlPosition = (state: state, usedGirl) => {
	// let girl = getGirl(state, usedGirl)

	// return girl.position


	return getGirlMesh(state, usedGirl).getWorldPosition(new Vector3())
}

export let getPositionParrelToObj = (position, objPositionY) => {
	return position.clone().setY(objPositionY)
}

export let getGirlPositionParrelToObj = (state: state, usedGirl, objPositionY: number) => {
	// return getCenter(state).clone().setY(objPositionY)

	return getPositionParrelToObj(getGirlPosition(state, usedGirl).clone(), objPositionY)
}

export let getCenterParrelToObj = (state: state, usedGirl, objPositionY: number) => {
	// return getCenter(state).clone().setY(objPositionY)
	return getPositionParrelToObj(getCenter(state, usedGirl).clone(), objPositionY)
}

export let getGirlHeadPosition = (state: state, usedGirl) => {
	let girl = getGirl(state, usedGirl)

	let headBone = girl.getObjectByName("右目")

	return headBone.getWorldPosition(new Vector3())
}

export let setGirlPosition = (state: state, usedGirl, position) => {
	let girl = getGirl(state, usedGirl)

	girl.position.copy(position)

	return state
}

export let translate = (state: state, usedGirl, translation: Vector3) => {
	let girl = getGirl(state, usedGirl)

	getGirlBox(state, usedGirl).translate(translation)


	// return setGirlPosition(
	// 	state,
	// 	girl.position.clone().add(
	// 		translation
	// 	)
	// )


	girl.position.add(
		translation
	)

	return state
}

// export let setPivotWorldPositionAndUpdateBox = (state: state, position: Vector3) => {
// 	state = setGirlPosition(state, position)

// 	state = updateAllCollisionShapes(state, getGirl(state, usedGirl))

// 	state = computeGirlBoxAndSetToState(state, usedGirl)

// 	return state
// }

// export let setCenter = (state: state, center: Vector3) => {
// 	let currentCenter = getCenter(state)

// 	return translate(state, _v1.copy(center).sub(currentCenter))
// }

export let setCenterExceptY = (state: state, usedGirl, center: Vector2) => {
	let currentCenter = getCenter(state, usedGirl)

	let d = _v1_1.copy(center).sub(_v1_2.set(currentCenter.x, currentCenter.z))

	return translate(state, usedGirl, _v1.set(
		d.x, 0, d.y
	))
}


export let getGirlRotation = (state: state, usedGirl) => {
	requireCheck(() => {
		test("girlMesh.queternion should be default", () => {
			return getGirlMesh(state, usedGirl).quaternion.equals(new Quaternion())
		})
	}, getIsDebug(state))

	let girl = getGirl(state, usedGirl)

	return girl.quaternion
	// return getGirlMesh(state, usedGirl).getWorldQuaternion(new Quaternion())
}

export let setGirlRotation = (state: state, usedGirl, quat: Quaternion) => {
	if (isGirlRotationLock(state, usedGirl)) {
		return state
	}

	let girl = getGirl(state, usedGirl)

	girl.quaternion.copy(quat)

	return state

}

export let setGirlRotationAndLock = (state: state, usedGirl, quat: Quaternion) => {
	let girl = getGirl(state, usedGirl)

	girl.quaternion.copy(quat)

	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		isRotationLock: true
	})
}

// export let lockGirlRotation = (state: state) => {
// 	return setUsedGirlData(state, usedGirl,{
// 		...getUsedGirlData(state, usedGirl),
// 		isRotationLock: true
// 	})
// }

export let unlockGirlRotation = (state: state, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		isRotationLock: false
	})
}

export let isGirlRotationLock = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).isRotationLock
}

let _getActualScale = (state: state, usedGirl) => {
	// requireCheck(() => {
	// 	test("girlGroup.scale should be default", () => {
	// 		return getGirl(state, usedGirl).scale.equals(new Vector3(1, 1, 1))
	// 	})
	// }, getIsDebug(state))

	if (!hasGirlMesh(state, usedGirl)) {
		return getGirlMeshByUsedGirl(state, usedGirlEnum.PlayerGirl).scale
		// return getGirlMeshByUsedGirl(state, usedGirl).scale
	}

	return getGirlMesh(state, usedGirl).scale
}

export let getScale = (state: state, usedGirl) => {
	return NumberUtils.fixFloatError(_getActualScale(state, usedGirl).x / getUsedGirlData(state, usedGirl).originScale)
}

export let getScaleIncreaseTimes = (state: state, usedGirl) => {
	return getScale(state, usedGirl) / getValue(state, usedGirl).scaleIncrease
}

let _getHeightFactor = () => 2

export let computeHeight = (state, usedGirl) => {
	return Math.floor(getScale(state, usedGirl) * _getHeightFactor() * getCurrentMMDData(state, usedGirl)[3].heightScale)
}

export let getCurrentHeight = (state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).currentHeight
}

export let getActualHeight = (state, usedGirl) => {
	// return getGirlBox(state, usedGirl).getSize(_v1).y
	return getBoxMaxSize(getGirlBox(state, usedGirl))
}

export let setHeight = (state, usedGirl, height) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		currentHeight: height
	})

}

export let getScaleByHeight = (height) => {
	return height / _getHeightFactor()
}

export let getHeightByScale = (scale) => {
	return scale * _getHeightFactor()
}


export let computeScaleByBox = (box: Box3) => {
	return getScaleByHeight(getHeight(box))
}

// export let getCapsuleBox = (state: state) => {
// 	return (getUsedGirlData(state, usedGirl).capsule as any).toBox()
// }

// export let getDamageData = (state: state) => {
// 	return [
// 		[
// 			new Matrix4().compose(
// 				getGirlPosition(state, usedGirl),
// 				getGirlRotation(state, usedGirl),
// 				_getActualScale(state)
// 			)
// 		],
// 		[
// 			getCapsuleBox(state)
// 		],
// 		[
// 			getName()
// 		]
// 	]
// }


export let markGirlGroupIsVisible = (girlMesh, value) => {
	girlMesh.visible = value
}


export let markGirlVisible = (state: state, usedGirl) => {
	markGirlGroupIsVisible(getGirl(state, usedGirl), true)

	return state
}

export let markGirlNotVisible = (state: state, usedGirl) => {
	markGirlGroupIsVisible(getGirl(state, usedGirl), false)

	return state
}

export let changePivotByAdd = (state: state, usedGirl, girlMeshDiff: Vector3,
	girlGroupDiff: Vector3
) => {
	// let girlMesh = getGirlMesh(state, usedGirl)
	// girlMesh.position.add(diff.clone()
	// 	.applyQuaternion(NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion))
	// )

	// let girl = getGirl(state, usedGirl)
	// girl.position.sub(diff)

	// Console.log("diff:", diff,

	// 	diff
	// 	.clone()
	// 	.multiplyScalar(4)

	// )

	let girlMesh = getGirlMesh(state, usedGirl)
	girlMesh.position.add(girlMeshDiff
	)

	let girl = getGirl(state, usedGirl)
	girl.position.sub(
		// diff
		// .clone()
		// .multiplyScalar(4)
		// .applyQuaternion(getGirlRotation(state, usedGirl))
		girlGroupDiff
	)

	girl.updateWorldMatrix(true, true)


	// Object3DUtils.markNeedsUpdate(girlMesh)

	return state
}

// export let setGirlMeshPosition = (state: state, position: Vector3) => {
// 	let girlMesh = getGirlMesh(state, usedGirl)

// 	girlMesh.position.copy(position)

// 	return state
// }

export let setPivotToOrigin = (state: state, usedGirl, diff) => {
	let girlMesh = getGirlMesh(state, usedGirl)

	// let diff = girlMesh.position.clone()
	// let diff = new Vector3(0, 0, -20)

	girlMesh.position.set(0, 0, 0)


	let girl = getGirl(state, usedGirl)
	girl.position.add(

		// diff
		// .clone()
		// // .applyQuaternion(NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion))
		// .applyQuaternion(getGirlRotation(state, usedGirl))

		// new Vector3(0,0,-85.24203239771552)
		diff
	)

	girl.updateWorldMatrix(true, true)


	// Object3DUtils.markNeedsUpdate(girlMesh)

	return state
}

export let getPivotWorldPosition = (state: state, usedGirl) => {
	let value
	switch (getCurrentPose(state, usedGirl)) {
		case pose.Stand:
		case pose.Pick:
		case pose.Sit:
			value = getGirlPosition(state, usedGirl)
			break
		case pose.Crawl:
		default:
			// value = getCenterInFloor(state)
			value = getGirl(state, usedGirl).getWorldPosition(new Vector3())
			break
	}

	return ensureCheck(value, () => {
		test("pivotWorldPosition.y should == 0", () => {
			return value.y == 0
		})
	}, getIsDebug(state))
}

export let setPivotWorldPositionAndUpdateBox = (state: state, usedGirl, position: Vector3) => {
	requireCheck(() => {
		test("position.y should == 0", () => {
			return position.y == 0
		})
	}, getIsDebug(state))

	// switch (getCurrentPose(state, usedGirl)) {
	// 	case pose.Stand:
	// 	case pose.Pick:
	// 		// getGirl(state, usedGirl).position.copy(position)
	// 		state = setGirlPosition(state, position)

	// 		break
	// 	case pose.Crawl:
	// 		// state = setCenterExceptY(state, _v1_1.set(position.x, position.z))
	// 		state = setGirlPosition(state, position)

	// 		break
	// }
	state = setGirlPosition(state, usedGirl, position)

	state = updateAllCollisionShapes(state, usedGirl, getGirl(state, usedGirl))

	state = computeGirlBoxAndSetToState(state, usedGirl)

	return state
}

export let updatePosition = (state, usedGirl, position) => {
	if (getCameraType(state) == cameraType.FirstPerson) {
		state = updateFirstPersonControls(state)
	}
	else {
		if (getCameraType(state) == cameraType.ThirdPerson) {
			let velocity = position.clone().sub(getGirlPosition(state, usedGirl))

			state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
				isCameraCollision(state)
			)
			)
		}
	}

	state = setPivotWorldPositionAndUpdateBox(state, usedGirl, position)

	if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
		return Promise.resolve(state)
	}

	if (isMoveState(getStateMachine(state, usedGirl))) {
		return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
			return setStateMachine(usedGirl)(state, stateMachine)
		}, getStateMachine(state, usedGirl), createInitialState(), buildNameByUsedGirl(usedGirl), NullableUtils.getEmpty())
	}

	return Promise.resolve(state)
}

export let updateMMDPhysicsConfigForScale = (state: state, usedGirl) => {
	// if (getScale(state, usedGirl) >= 40) {
	if (getScale(state, usedGirl) >= 35) {
		// return disablePhysics(state)
		MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).isDisablePhysicsTranslation = true
	}
	else {
		// return enablePhysics(state)
		MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).isDisablePhysicsTranslation = false
	}


	return state
}

// export let getWeaponTypeFactor = (weaponType_) => {
// 	switch (weaponType_) {
// 		case weaponType.Light:
// 			return 0.5
// 		case weaponType.Middle:
// 			return 1
// 		case weaponType.Heavy:
// 			return 1.5
// 		case weaponType.VeryHeavy:
// 			return 2.5
// 		default:
// 			throw new Error("err")
// 	}
// }

export let getBaseFactor = () => {
	return 0.2 * 0.3 * 0.7
}

export let getDamageTypeFactor = (damageType_: damageType) => {
	switch (damageType_) {
		case damageType.Normal:
			return 0.5
		case damageType.Range:
		case damageType.Global:
			return 0.7
		case damageType.Heavy:
			return 1.1
		case damageType.Direct:
		case damageType.Crit:
			return 1.8
		case damageType.Weakness:
			return 2.7
		default:
			throw new Error("err")
	}
}


export let getCollisionPartFactor = (collisionPart_) => {
	let collisionPartFactor
	switch (collisionPart_) {
		case collisionPart.LeftBreast:
		case collisionPart.RightBreast:
			collisionPartFactor = 6
			break
		case collisionPart.TrigoneAndButt:
			collisionPartFactor = 6
			break
		case collisionPart.Head:
			collisionPartFactor = 4
			break
		default:
			collisionPartFactor = 1
			break
	}

	return collisionPartFactor
}

export let getScaleFactor = (state: state, usedGirl) => {
	return 1 / NumberUtils.clamp(getScaleIncreaseTimes(state, usedGirl), 1, 20)
}

// export let getForceFactor = (hp: number, damage: number, factor = 1, maxValue = 4, minValue = 0.05) => {
export let getForceFactor = (hp: number, damage: number, factor = 1, maxValue = 4, minValue = 0.1) => {
	// let forceFactor
	// if (damage <= forceSize.None) {
	// 	forceFactor = 0.0
	// }
	// else if (damage <= forceSize.VeryLow4) {
	// 	forceFactor = 0.05
	// }
	// else if (damage <= forceSize.VeryLow3) {
	// 	forceFactor = 0.1
	// }
	// else if (damage <= forceSize.VeryLow2) {
	// 	forceFactor = 0.2
	// }
	// else if (damage < forceSize.VeryLow) {
	// 	forceFactor = 0.5
	// }
	// else if (damage < forceSize.Low) {
	// 	forceFactor = 1
	// }
	// else if (damage < forceSize.Middle) {
	// 	forceFactor = 1.3
	// }
	// else if (damage < forceSize.High) {
	// 	forceFactor = 1.8
	// }
	// else if (damage < forceSize.VeryHigh) {
	// 	forceFactor = 2.3
	// }
	// else if (damage < forceSize.VeryHigh2) {
	// 	forceFactor = 3
	// }
	// else {
	// 	forceFactor = 4
	// }

	// return forceFactor
	return NumberUtils.clamp(damage / (hp * factor), minValue, maxValue)

	// let hpFactor
	// if (hp < 500) {
	// 	hpFactor = 0.1
	// }
	// else if (hp < 2000) {
	// 	hpFactor = 0.05
	// }
	// else if (hp < 10000) {
	// 	hpFactor = 0.01
	// }
	// else if (hp < 50000) {
	// 	hpFactor = 0.005
	// }
	// else if (hp < 200000) {
	// 	hpFactor = 0.0025
	// }
	// else {
	// 	hpFactor = 0.001
	// }


	// return NumberUtils.clamp(damage / (hp * hpFactor) * factor, minValue, maxValue)
}

export let getDamagePartFactor = (state, usedGirl, damagePart) => {
	if (isCloth(damagePart) && getHp(state, usedGirl, damagePart) <= 0) {
		return NullableUtils.getExn(NullableUtils.getExn(getHpData(state, usedGirl).find(d => d.damagePart == damagePart)).stressingFactorWhenDestroyed)
	}

	return 1
}

export let getSkillStateFactor = (state, usedGirl) => {
	if (isSkillState(state, usedGirl)) {
		return NullableUtils.getWithDefault(
			NullableUtils.map(d => d.value,
				getSkillStressingFactor(state).find(d => {
					return d.name == getCurrentAnimationName(state, usedGirl)
				})
			),
			1
		)
	}

	return 1
}

export let getStressingFactorByJudgeLastStressingTime = (state, usedGirl) => {
	return NumberUtils.clamp((getNow(state) - getLastStressingTime(state, usedGirl)) / 1000, 1, 5) / 5
}

export let isCanStressing = (state: state, usedGirl, stateMachine: stateMachine<any>) => {
	// return (!StateMachine.isState(stateMachine, objectStateName.Stressing)
	return (!isControlledState(state, stateMachine)
		// && !isSkillState(state, usedGirl)
		&& !isChangeCrawlPoseState(state, usedGirl)
		&& NumberUtils.isRandomRate(getGiantessStressingRate(state, usedGirl))
	)
}

export let getGirlWeaponType = () => weaponType.Body


export let offAllEvents = (state: state): state => {
	let abstractState = getAbstractState(state)


	abstractState = Event.off(abstractState, getDestroyingEventName(), InitWhenImportScene.destroyingHandler)
	abstractState = Event.off(abstractState, getPickupEventName(), PickPose.pickupHandler)
	abstractState = Event.off(abstractState, getPinchJudageDamageEventName(), PickPose.pinchJudgeDamageHandler)
	abstractState = Event.off(abstractState, getEatEventName(), PickPose.eatHandler)
	abstractState = Event.off(abstractState, getPickdownEventName(), PickPose.pickdownHandler)
	abstractState = Event.off(abstractState, getStandToCrawlEventName(), standToCrawlHandler)
	abstractState = Event.off(abstractState, getCrawlToStandEventName(), crawlToStandHandler)
	abstractState = Event.off(abstractState, getInsertEventName(), PickPose.insertUBHandler)
	abstractState = Event.off(abstractState, getPutToBreastEventName(), PickPose.putToBreastHandler)
	abstractState = Event.off(abstractState, getPutToShoeEventName(), PickPose.putToShoeHandler)


	state = setAbstractState(state, abstractState)

	return state
}

export let isSmallGiantessByScale = (scale) => {
	return scale <= 20
}


export let isSmallGiantess = (state: state, usedGirl) => {
	return isSmallGiantessByScale(getGirlScale(state, usedGirl))
}

export let isSmallOrMiddleGiantessScale = (scale) => {
	return scale <= 40
}

export let isMiddleGiantessByScale = (scale) => {
	return !isSmallGiantessByScale(scale) && isSmallOrMiddleGiantessScale(scale)
}

export let isMiddleGiantess = (state: state, usedGirl) => {
	return isMiddleGiantessByScale(getGirlScale(state, usedGirl))
}

export let isBigGiantessByScale = (scale) => {
	return !isSmallGiantessByScale(scale) && !isMiddleGiantessByScale(scale)
}

export let isBigGiantess = (state: state, usedGirl) => {
	return isBigGiantessByScale(getGirlScale(state, usedGirl))
}

export let isMiddleGiantessOrBiggerByScale = (scale) => {
	return isMiddleGiantessByScale(scale) || isBigGiantessByScale(scale)
}

export let isSuperBigGiantess = (state: state, usedGirl) => {
	return getGirlScale(state, usedGirl) >= 400
}


export let isGiantessAlive = (state: state, usedGirl) => {
	return !isDestoryRelatedStates(getStateMachine(state, usedGirl))
}

export let getFactorByScale = <Factor>(state: state, usedGirl, data: Array<{ scale?: number, factor: Factor }>): Factor => {
	let scale = getGirlScale(state, usedGirl)

	return NullableUtils.getExn(data.reduce<nullable<Factor>>((result, d) => {
		if (!NullableUtils.isNullable(result)) {
			return result
		}

		if (NullableUtils.isNullable(d.scale)) {
			return d.factor
		}

		if (scale <= d.scale) {
			return NullableUtils.return_(d.factor)
		}

		return result
	}, NullableUtils.getEmpty()))
}

export let buildFakeGirlWeaponValue = (state: state, usedGirl, force: forceSize | number): weaponValue => {
	return {
		// force: forceSize.None,
		force: computeForceByHeight(force, getActualHeight(state, usedGirl)),
		// armorPiercingForceRatio: armorPiercingForceRatio.VeryHigh2,
		armorPiercingForceRatio: armorPiercingForceRatio.Low,
		type: getGirlWeaponType(),


		emitSpeed: emitSpeed.Fast,
		critRatio: critRatio.VeryLow,
		// explodeRange: explodeRange.Middle,
		explodeRange: explodeRange.Zero,


		emitterSpeed: emitterSpeed.Fast,
		emitterLife: emitterLife.Middle,
		emitterSize: emitterSize.Middle,
		emitterCollisionSize: emitterCollisionSize.Middle,
		emitterVolume: emitterVolume.Middle,
		emitterCount: emitterCount.Zero,

		meleeRange: NullableUtils.return_(meleeRange.VeryFar)
	}
}

export let isGirlWeapon = (weaponValue_: weaponValue) => {
	return weaponValue_.type == weaponType.Body
}

export let getLevelGirlDamageData = () => {
	return {
		// defenseFactor: defenseFactor.VeryLow,
		defenseFactor: defenseFactor.Middle,
		// attackFactor: attackFactor.Middle,
		attackFactor: attackFactor.VeryLow,
		critRatioFactor: critRatioFactor.VeryLow,
		//missRatio: missRatio.VeryLow,
	}
}

// export let getWildGirlDamageData = () => {
// 	return {
// 		defenseFactor: defenseFactor.Low,
// 		attackFactor: attackFactor.Low,
// 		critRatioFactor: critRatioFactor.VeryLow,
// 		//missRatio: missRatio.VeryLow,
// 	}
// }

export let getPlayerGirlDamageData = () => {
	return {
		defenseFactor: defenseFactor.VeryLow3,
		// armorRatio: armorRatio.Light,
		// armorStrength: armorStrength.VeryLow,
		// attackFactor: attackFactor.VeryLow2,
		// attackFactor: attackFactor.VeryLow2,
		attackFactor: attackFactor.VeryLow,
		critRatioFactor: critRatioFactor.VeryLow,
		//missRatio: missRatio.VeryLow,
	}
}

export let getBossGirlDamageData = () => {
	return {
		defenseFactor: defenseFactor.VeryLow,
		// armorRatio: armorRatio.Light,
		// armorStrength: armorStrength.VeryLow,
		attackFactor: attackFactor.VeryLow,
		critRatioFactor: critRatioFactor.VeryLow,
		//missRatio: missRatio.VeryLow,
	}
}


export let triggerScaleAction = (state, usedGirl, computeIncreaseScaleFunc, name) => {
	switch (name as any) {
		case actionName.Bigger:
			state = setActionState(state, usedGirl, actionState.Initial)

			let addScaleByBiggerCount = computeIncreaseScaleFunc(state, usedGirl)

			state = setBiggerCount(state, usedGirl, getBiggerCount(state, usedGirl) + 1)
			state = setAddScaleByBiggerCount(state, usedGirl, getBiggerCount(state, usedGirl), addScaleByBiggerCount)

			state = playBiggerAnimation(state, [(state) => {
				state = setLastScaleChangeTime(state, usedGirl)
				// state = setNeedShowSkillBar(state, usedGirl, true)
				state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)

				if (isTriggerAction(state, usedGirl, actionName.Bigger)) {
					// throw new Error("shouldn't is trigger Bigger")
					state = resetIsTriggerAction(state, usedGirl)
				}

				return Promise.resolve(state)
			},
			state => {
				return [
					getScale(state, usedGirl) + addScaleByBiggerCount,
					// NumberUtils.greaterThan(
					// 	getScale(state, usedGirl) + computeIncreaseScaleFunc(state),
					// 	getMaxScale(state, getValue(state))
					// ),

					// + getEnhanceIncreaseScale(state, getActiveBiggerIncreaseScale(state), getBiggerEnhanceLevel(state)),
					1
				]
			},
			], usedGirl)
			break
		case actionName.SmallerToLastBiggerCount:
			state = setActionState(state, usedGirl, actionState.Initial)


			let addScaleByBiggerCount_ = getAddScaleByBiggerCount(state, usedGirl, getBiggerCount(state, usedGirl))

			state = setBiggerCount(state, usedGirl, NumberUtils.greaterThan(getBiggerCount(state, usedGirl) - 1, 0))

			state = playSmallerAnimation(state, (state) => {
				state = setLastScaleChangeTime(state, usedGirl)

				if (InitWhenImportScene.isSmallestToZeroBiggerCount(state, usedGirl)) {
					// if (getBiggerCount(state, usedGirl) !== 0) {
					// 	throw new Error("bigger count should be 0")
					// }

					// state = setNeedShowSkillBar(state, usedGirl, false)
				}
				else {
					// state = setNeedShowSkillBar(state, usedGirl, true)
					state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)
				}
				// state = setNeedShowSkillBar(state, usedGirl, false)
				// state = setLastScaleChangeTime(state, scaleState.Normal)

				// if (isGiantessCharacterType(state)) {
				// state = setBiggerCount(state,usedGirl,  0)
				// }
				// else if (isWildGiantess(state, usedGirl)) {
				//     state = WildGiantess.setBiggerCount(state,usedGirl,  0)
				// }
				// else if (isEnemyGiantess(state, usedGirl)) {
				//     state = EnemyGiantess.setBiggerCount(state,usedGirl,  0)
				// }
				// else if (isPlayerGoddess(state, usedGirl)) {
				//     state = PlayerGoddess.setBiggerCount(state,usedGirl,  0)
				// }

				if (isTriggerAction(state, usedGirl, actionName.SmallerToLastBiggerCount)) {
					// state = resetIsTriggerAction(state, usedGirl)
					throw new Error("shouldn't is trigger SmallerToLastBiggerCount")
				}


				// return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
				return Promise.resolve(state)
			},
				usedGirl,
				// getValue(state).initialScale +
				// computeIncreaseScaleFunc(state) * getBiggerCount(state, usedGirl)
				// NumberUtils.greaterThan(getScale(state, usedGirl) - computeIncreaseScaleFunc(state), getValue(state).minScale)
				NumberUtils.greaterThan(getScale(state, usedGirl) - addScaleByBiggerCount_, getValue(state, usedGirl).minScale)


				// getEnhanceIncreaseScale(state, getActiveBiggerIncreaseScale(state) * getBiggerCount(state, usedGirl), getBiggerEnhanceLevel(state))
				,
			)
			break
		case actionName.Run:
			state = setActionState(state, usedGirl, actionState.Run)
			break
	}

	return state
}

export let handlePickDataWhenExecuteDestroyed = (state: state, usedGirl) => {
	let promise
	if (hasPickData(state, usedGirl)) {
		promise = Event.trigger(state, getAbstractState, getPickdownEventName(), buildPickdownEventData(
			getCollisionPartCenter(state, usedGirl, collisionPart.RightHand).clone().setY(0),
			usedGirl
		))
	}
	else {
		promise = Promise.resolve(state)
	}

	return promise.then(state => PickPose.handleUBFall(state, usedGirl)).then(state => PickPose.handleBreastFall(state, usedGirl)).then(state => PickPose.handleShoeFall(state, usedGirl))
}

export let getMaxScale = (state: state, girlValue: girlValue) => {
	if (isUseInfinityBig(state)) {
		return +Infinity
	}

	return girlValue.maxScale
}

// export let isFirstAdd = (state: state, usedGirl_) => {
// 	return MutableRecordUtils.getWithDefault(
// 		getGirlState(state).isFirstAdd,
// 		usedGirl_,
// 		true
// 	)
// }

// export let setIsFirstAdd = (state: state, usedGirl_, value) => {
// 	let _ = MutableRecordUtils.set(
// 		getGirlState(state).isFirstAdd,
// 		usedGirl_,
// 		value
// 	)

// 	return state
// }


export let handleWhenDestroying = (state: state) => {
	// return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), buildBossStatusUpdateEventNameEventData(
	// 	getBody(),
	// 	NullableUtils.getExn(getNeedUpdateStatusName(state))
	// ))
	return Promise.resolve(state)
}

export let getGiantessCamp = (state: state, usedGirl) => {
	return getCampExn(state, buildNameByUsedGirl(usedGirl))
}

// export let getBreastVolumnFactor = (state: state, min = 0, max = 3) => {
// 	// return NumberUtils.clamp(getBoxVolumn(getCollisionPartOBB(state, usedGirl,  collisionPart.RightBreast).toBox3()) * 1000 / Math.pow(getGirlScale(state, usedGirl), 3), min, max)
// 	return NumberUtils.clamp(
// 		Math.cbrt(
// 			getBoxVolumn(getCollisionPartOBB(state, usedGirl,  collisionPart.RightBreast).toBox3()) * 700 / Math.pow(getGirlScale(state, usedGirl), 3)
// 		), min, max)
// }

export let getBreastVolumnFactor = (state: state, usedGirl, min = 0, max = 3) => {
	// return NumberUtils.clamp(getBoxVolumn(getCollisionPartOBB(state, usedGirl,  collisionPart.RightBreast).toBox3()) * 1000 / Math.pow(getGirlScale(state, usedGirl), 3), min, max)
	return NumberUtils.clamp(
		Math.cbrt(
			getBoxVolumn(getCollisionPartOBB(state, usedGirl, collisionPart.RightBreast).toBox3()) * 700 / Math.pow(getGirlScale(state, usedGirl), 3)
		), min, max)
}