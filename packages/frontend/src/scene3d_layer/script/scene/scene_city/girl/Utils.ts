import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { getCenter, getCenterInFloor, getGirl, getGirlMesh, getGirlState, getHp, getName, getValue, isTriggerAction, setGirlState } from "./Girl"
import { Box3, Matrix4, Quaternion, Vec2, Vector2, Vector3 } from "three";
import { getBone, getCurrentMMDData } from "../utils/MMDUtils";
import { collisionPart, objectStateName, pose } from "../type/StateType";
import { getGirlScale } from "../CityScene";
import { getCollisionPartOBB, updateAllCollisionShapes } from "./Collision";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "./Pose";
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { actionName, forceSize } from "../data/DataType";
import { MMD } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../state/State";
import { getHpData, isCloth } from "./Cloth";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getStateMachine, isChangeCrawlPoseState, isSkillState } from "./FSMState";
import { off } from "meta3d-jiehuo-abstract/src/Event";
import { stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCurrentAnimationName } from "./Animation";
import { getSkillStressingFactor } from "../data/Data";
import { weaponType } from "../data/ValueType";
import { NumberUtils } from "meta3d-jiehuo-abstract";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _m1 = new Matrix4();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

// export let getCapsuleRadiusForCompute = (capsule) => {
// 	return capsule.radius * 2
// }


export let computeGirlBoxDefault = (state: state) => {
	let box

	let headBox = getCollisionPartOBB(state, collisionPart.Head).toBox3()
	if (headBox.getSize(_v1).length() == 0) {
		box = new Box3().setFromCenterAndSize(getGirlPosition(state).clone().setY(10), _v2.set(40, 40, 40))
	}
	else {
		box = getGirlState(state).box.makeEmpty().union(
			headBox
		).union(
			getCollisionPartOBB(state, collisionPart.LeftFoot).toBox3()
		).union(
			getCollisionPartOBB(state, collisionPart.RightFoot).toBox3()
		)
	}

	return setGirlState(state, {
		...getGirlState(state),
		box
	})
}


export let computeGirlBox = (state: state) => {
	return getGirlState(state).computeBoxFunc(state)
}

export let getGirlBox = (state: state) => {
	return getGirlState(state).box
}

export let getSmallGirlBox = (state: state) => {
	return getGirlState(state).box.clone().expandByVector(_v1.set(0.3, 1, 0.3))
}


export let getGirlBoxCenter = (state: state) => {
	return getGirlState(state).box.getCenter(new Vector3())
}

export let getBoxSizeForCompute = (state: state) => {
	// 	let value = getGirlState(state).collisionShapeMap.get(collisionPart.Head).halfSize.x * 2

	// 	if(value == 0){
	// getBone()
	// 	}





	// let girl = getGirl(state)

	// let data1 = getBone(state, girl, "左目")
	// state = data1[0]
	// let bone1 = data1[1]

	// let data2 = getBone(state, girl, "右目")
	// state = data2[0]
	// let bone2 = data2[1]


	// return bone1.getWorldPosition(_v1).distanceTo(bone2.getWorldPosition(_v2)) * 2


	return 0.2 * getGirlScale(state) * 2
}

export let getGirlPosition = (state: state) => {
	// let girl = getGirl(state)

	// return girl.position


	return getGirlMesh(state).getWorldPosition(new Vector3())
}

export let getPositionParrelToObj = (position, objPositionY) => {
	return position.clone().setY(objPositionY)
}

export let getGirlPositionParrelToObj = (state: state, objPositionY: number) => {
	// return getCenter(state).clone().setY(objPositionY)

	return getPositionParrelToObj(getGirlPosition(state).clone(), objPositionY)
}

export let getCenterParrelToObj = (state: state, objPositionY: number) => {
	// return getCenter(state).clone().setY(objPositionY)
	return getPositionParrelToObj(getCenter(state).clone(), objPositionY)
}

export let getGirlHeadPosition = (state: state) => {
	let girl = getGirl(state)

	let headBone = girl.getObjectByName("右目")

	return headBone.getWorldPosition(new Vector3())
}

export let setGirlPosition = (state: state, position) => {
	let girl = getGirl(state)

	girl.position.copy(position)

	return state
}

export let translate = (state: state, translation: Vector3) => {
	let girl = getGirl(state)

	getGirlBox(state).translate(translation)


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

// 	state = updateAllCollisionShapes(state, getGirl(state))

// 	state = computeGirlBox(state)

// 	return state
// }

// export let setCenter = (state: state, center: Vector3) => {
// 	let currentCenter = getCenter(state)

// 	return translate(state, _v1.copy(center).sub(currentCenter))
// }

export let setCenterExceptY = (state: state, center: Vector2) => {
	let currentCenter = getCenter(state)

	let d = _v1_1.copy(center).sub(_v1_2.set(currentCenter.x, currentCenter.z))

	return translate(state, _v1.set(
		d.x, 0, d.y
	))
}


export let getGirlRotation = (state: state) => {
	requireCheck(() => {
		test("girlMesh.queternion should be default", () => {
			return getGirlMesh(state).quaternion.equals(new Quaternion())
		})
	}, getIsDebug(state))

	let girl = getGirl(state)

	return girl.quaternion
	// return getGirlMesh(state).getWorldQuaternion(new Quaternion())
}

export let setGirlRotation = (state: state, quat: Quaternion) => {
	if (isGirlRotationLock(state)) {
		return state
	}

	let girl = getGirl(state)

	girl.quaternion.copy(quat)

	return state

}

export let setGirlRotationAndLock = (state: state, quat: Quaternion) => {
	let girl = getGirl(state)

	girl.quaternion.copy(quat)

	return setGirlState(state, {
		...getGirlState(state),
		isRotationLock: true
	})
}

// export let lockGirlRotation = (state: state) => {
// 	return setGirlState(state, {
// 		...getGirlState(state),
// 		isRotationLock: true
// 	})
// }

export let unlockGirlRotation = (state: state) => {
	return setGirlState(state, {
		...getGirlState(state),
		isRotationLock: false
	})
}

export let isGirlRotationLock = (state: state) => {
	return getGirlState(state).isRotationLock
}

let _getActualScale = (state: state) => {
	requireCheck(() => {
		test("girlGroup.scale should be default", () => {
			return getGirl(state).scale.equals(new Vector3(1, 1, 1))
		})
	}, getIsDebug(state))

	return getGirlMesh(state).scale
}

export let getScale = (state: state) => {
	return _getActualScale(state).x / getGirlState(state).originScale
}

export let getScaleIncreaseTimes = (state: state) => {
	return getScale(state) / getValue(state).minScale
}

let _getHeightFactor = () => 2

export let computeHeight = (state) => {
	return Math.floor(getScale(state) * _getHeightFactor() * getCurrentMMDData(state)[3].heightScale)
}

export let getCurrentHeight = (state) => {
	return getGirlState(state).currentHeight
}

export let getActualHeight = (state) => {
	return getGirlBox(state).getSize(_v1).y
}

export let setHeight = (state, height) => {
	return setGirlState(state, {
		...getGirlState(state),
		currentHeight: height
	})

}

export let getScaleByHeight = (height) => {
	return height / _getHeightFactor()
}

// export let getCapsuleBox = (state: state) => {
// 	return (getGirlState(state).capsule as any).toBox()
// }

// export let getDamageData = (state: state) => {
// 	return [
// 		[
// 			new Matrix4().compose(
// 				getGirlPosition(state),
// 				getGirlRotation(state),
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


export let markGirlVisible = (state: state) => {
	getGirl(state).visible = true

	return state
}

export let markGirlNotVisible = (state: state) => {
	getGirl(state).visible = false

	return state
}

export let changePivotByAdd = (state: state, girlMeshDiff: Vector3,
	girlGroupDiff: Vector3
) => {
	// let girlMesh = getGirlMesh(state)
	// girlMesh.position.add(diff.clone()
	// 	.applyQuaternion(NullableUtils.getExn(getGirlState(state).initialQuaternion))
	// )

	// let girl = getGirl(state)
	// girl.position.sub(diff)

	// Console.log("diff:", diff,

	// 	diff
	// 	.clone()
	// 	.multiplyScalar(4)

	// )

	let girlMesh = getGirlMesh(state)
	girlMesh.position.add(girlMeshDiff
	)

	let girl = getGirl(state)
	girl.position.sub(
		// diff
		// .clone()
		// .multiplyScalar(4)
		// .applyQuaternion(getGirlRotation(state))
		girlGroupDiff
	)



	// Object3DUtils.markNeedsUpdate(girlMesh)

	return state
}

// export let setGirlMeshPosition = (state: state, position: Vector3) => {
// 	let girlMesh = getGirlMesh(state)

// 	girlMesh.position.copy(position)

// 	return state
// }

export let setPivotToOrigin = (state: state, diff) => {
	let girlMesh = getGirlMesh(state)

	// let diff = girlMesh.position.clone()
	// let diff = new Vector3(0, 0, -20)

	girlMesh.position.set(0, 0, 0)


	let girl = getGirl(state)
	girl.position.add(

		// diff
		// .clone()
		// // .applyQuaternion(NullableUtils.getExn(getGirlState(state).initialQuaternion))
		// .applyQuaternion(getGirlRotation(state))

		// new Vector3(0,0,-85.24203239771552)
		diff
	)


	// Object3DUtils.markNeedsUpdate(girlMesh)

	return state
}

export let getPivotWorldPosition = (state: state) => {
	let value
	switch (getCurrentPose(state)) {
		case pose.Stand:
		case pose.Pick:
			value = getGirlPosition(state)
			break
		case pose.Crawl:
		default:
			// value = getCenterInFloor(state)
			value = getGirl(state).getWorldPosition(new Vector3())
			break
	}

	return ensureCheck(value, () => {
		test("pivotWorldPosition.y should == 0", () => {
			return value.y == 0
		})
	}, getIsDebug(state))
}

export let setPivotWorldPositionAndUpdateBox = (state: state, position: Vector3) => {
	requireCheck(() => {
		test("position.y should == 0", () => {
			return position.y == 0
		})
	}, getIsDebug(state))

	// switch (getCurrentPose(state)) {
	// 	case pose.Stand:
	// 	case pose.Pick:
	// 		// getGirl(state).position.copy(position)
	// 		state = setGirlPosition(state, position)

	// 		break
	// 	case pose.Crawl:
	// 		// state = setCenterExceptY(state, _v1_1.set(position.x, position.z))
	// 		state = setGirlPosition(state, position)

	// 		break
	// }
	state = setGirlPosition(state, position)

	state = updateAllCollisionShapes(state, getGirl(state))

	state = computeGirlBox(state)

	return state
}

export let updateMMDPhysicsConfigForScale = (state: state) => {
	// if (getScale(state) >= 40) {
	if (getScale(state) >= 35) {
		// return disablePhysics(state)
		MMD.getMMDAnimationHelper(getAbstractState(state)).isDisablePhysicsTranslation = true
	}
	else {
		// return enablePhysics(state)
		MMD.getMMDAnimationHelper(getAbstractState(state)).isDisablePhysicsTranslation = false
	}


	return state
}

export let getWeaponTypeFactor = (weaponType_) => {
	switch (weaponType_) {
		case weaponType.Light:
			return 0.5
		case weaponType.Middle:
			return 1
		case weaponType.Heavy:
			return 1.5
		case weaponType.VeryHeavy:
			return 2.5
		default:
			throw new Error("err")
	}
}

export let getCollisionPartFactor = (collisionPart_) => {
	let collisionPartFactor
	switch (collisionPart_) {
		case collisionPart.LeftBreast:
		case collisionPart.RightBreast:
			collisionPartFactor = 4
			break
		case collisionPart.TrigoneAndButt:
			collisionPartFactor = 4
			break
		case collisionPart.Head:
			collisionPartFactor = 3
			break
		default:
			collisionPartFactor = 1
			break
	}

	return collisionPartFactor
}

export let getScaleFactor = (state: state) => {
	return 1 / NumberUtils.clamp(getScaleIncreaseTimes(state), 1, 10)
}

export let getForceFactor = (damage) => {
	let forceFactor
	if (damage < forceSize.Low) {
		forceFactor = 1
	}
	else if (damage < forceSize.Middle) {
		forceFactor = 1.3
	}
	else if (damage < forceSize.High) {
		forceFactor = 1.6
	}
	else if (damage < forceSize.VeryHigh) {
		forceFactor = 2
	}
	else {
		forceFactor = 2.5
	}

	return forceFactor
}

export let getDamagePartFactor = (state, damagePart) => {
	if (isCloth(damagePart) && getHp(state, damagePart) <= 0) {
		return NullableUtils.getExn(NullableUtils.getExn(getHpData(state).find(d => d.damagePart == damagePart)).stressingFactorWhenDestroyed)
	}

	return 1
}

export let getSkillStateFactor = (state) => {
	if (isSkillState(state)) {
		return NullableUtils.getExn(getSkillStressingFactor().find(d => {
			return d.name == getCurrentAnimationName(state)
		})).value
	}

	return 1
}

export let isCanStressing = (state: state, stateMachine: stateMachine<any>) => {
	return (!StateMachine.isState(stateMachine, objectStateName.Stressing)
		// && !isSkillState(state)
		&& !isChangeCrawlPoseState(state)
	)
}

export let getGirlWeaponType = () => weaponType.Light