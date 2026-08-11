import { Box3, Color, Euler, Matrix4, Object3D, Quaternion, Ray, SkinnedMesh, Vector2, Vector3 } from "three";
import { emitPrecision, emitterVolume, explodeSize, meleeRange, milltaryValue, weaponType, weaponValue } from "../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract";
import { attackTarget, camp, collisionPart, damageType, objectStateName, particleNeedCollisionCheckLoopFrames, usedGirl, usedGirlEnum } from "../type/StateType";
import { state } from "../../../../type/StateType";
import { PathFind } from "meta3d-jiehuo-abstract";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getGrid, getRefindPathTime, isNearAttackTarget, isVeryNearAttackTarget } from "../manage/city1/PathFind";
import { getIsDebug, getIsNotTestPerf } from "../../Scene";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State";
import { bulletParticle, fsm_state, gemParticle, lodQueueIndex, missileVehicleMissileParticle, name, shellParticle, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType";
import { buildMultipleTweens, computeEuler, computeQuaternion } from "./MoveUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { LOD } from "meta3d-jiehuo-abstract";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { clearTween } from "./TweenUtils";
import { getCenter, getCenterInFloor, damage, isUseGirl, isCollisionWithGirl, isWildGiantess, isPlayerGirl, isPlayerGoddess, getIsLightStressing as getIsLightStressingGirl, setGirlState, isLevelGiantessExceptPlayer, isBossGiantess, isGirl, buildNameByUsedGirl, getUsedGirlByName, getCurrentUsedGirls, hasLevelGiantessExceptPlayer, hasCurrentUsedGirl } from "../girl/Girl";
import { getCollisionPartCenter, getCollisionPartOBB, isCollisionWithGirlBox, queryAllOBBShapesCollisionWithRay, queryOBBShapeCollisionWithBox } from "../girl/Collision";
import { getTuple2Last } from "meta3d-jiehuo-abstract/src/utils/TupleUtils";
import { isControlledState, isDestoryRelatedStates, isGiantessControlledState, isMoveState, isNotDamageState } from "./FSMStateUtils";
import { checkCollisionWithStatic, checkRangeCollisionWithStatic, getAllLowestCollisionParts, getNearestCollisionPart, getRandomCollisionPartCanAttack as getRandomCollisionPartCanAttackUtils, getRandomCollisionPartForMelee, handleCollisionWithEmitterCollisionableContainers, isNearGirl } from "./CollisionUtils";
import { isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType } from "../CityScene";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { expandBox, getBoxEdgePoint, getBoxMaxXZSize, getBoxMinXZSize, getRandomBoxEdgePoint } from "./Box3Utils";
import { Device } from "meta3d-jiehuo-abstract";
import { buildStatus } from "./LODContainerUtils";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getVolume } from "./SoundUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { buildDestroyedEventData, buildDestroyintEventData, getDestroyedEventName, getDestroyingEventName } from "./EventUtils";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getFlowState } from "meta3d-jiehuo-abstract/src/state/State";
import { isFlameVehicle } from "../manage/city1/milltary_vehicle/FlameVehicle";
import { Scene } from "meta3d-jiehuo-abstract";
// import { checkCollisionWithArmy, handleCollisionWithArmy, handleCollisionWithLittleMan, isCollisionWithLittleMan } from "../manage/city1/ArmyManager";
import * as LittleManTransform from "../little_man/Transform"
import * as LittleMan from "../little_man/LittleMan"
import { addToDeferDisposeDataNames, clearDeferDisposeDataNames, disposeData, getAttackTarget, getAttackTargetExn, getAttackTargetObjectData, getAttackTargetObjectDataExn, getCampWithDefault, getCampExn, getDeferDisposeDataNames, getGetPositionYFuncDefaultKey, getIsEliteGiantessAttacking, getIsLightStressing, getLastJudgeRayCastResult, getLastJudgeRayCastResultExn, getLastJudgeRayCastTime, getPositionY, hasAttackTargetByName, setAttackTarget, setLastJudgeRayCastResult, setLastJudgeRayCastTime, getLastAttackFrame, setLastAttackFrame, getUpdateLittleManWeaponFunc, getAllArmyContainers as getAllArmyContainersArmy, setAllArmyContainers, getIsNeedRefindPath, setIsNeedRefindPath, clearAttackTargetObjectOrBuilding, clearAttackTargetData, getCamp, getAttackTargetUsedGirl } from "../manage/city1/Army";
import { getPositionParrelToObj } from "../girl/Utils";
import * as DamageUtils from "./DamageUtils";
// import * as Soldier from "../manage/city1/soldier/Soldier"
import * as Tank from "../manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../manage/city1/milltary_vehicle/MissileVehicle"
// import * as FlameVehicle from "../manage/city1/milltary_vehicle/FlameVehicle"
import { buildFlameVehicleCategoryName, buildBodyLODQueueName as buildBodyLODQueueNameFlameVehicle } from "../manage/city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "../manage/city1/milltary_building/MilltaryBuilding"
import * as MissileTurret from "../manage/city1/milltary_building/MissileTurret"
import * as ShellTurret from "../manage/city1/milltary_building/ShellTurret"
import * as MilltaryVehicle from "../manage/city1/milltary_vehicle/MilltaryVehicle"
import { TupleUtils } from "meta3d-jiehuo-abstract";
// import { getPlayerCamp } from "./PlayerUtils";
// import { isInfantry, getNamePrefix as getNamePrefixInfantry } from "../manage/city1/soldier/Infantry"
// import { getNamePrefix as getNamePrefixMelee, isMelee } from "../manage/city1/soldier/Melee"
// import { getNamePrefix as getNamePrefixRocketeer, isRocketeer } from "../manage/city1/soldier/Infantry"
// import { getNamePrefix as getNamePrefixLaserer, isLaserer } from "../manage/city1/soldier/Laserer"
// import { getNamePrefix as getNamePrefixCommander, isCommander } from "../manage/city1/soldier/Commander"
import { generateReward } from "../reward/RewardGenerator";
import { getAllModelQueues, getNamePrefixCommander, getNamePrefixInfantry, getNamePrefixLaserer, getNamePrefixMelee, getNamePrefixRocketeer, isCommanderUtils, isInfantryUtils, isLasererUtils, isMeleeUtils, isRocketeerUtils, isSoldier, getStateMachine, setStateMachine } from "../manage/city1/soldier/utils/SoldierUtils";
import { getNamePrefixFlameVehicle, getNamePrefixMissileVehicle, getNamePrefixTank, isFlameVehicleUtils, isMilltaryVehicle, isMissileVehicleUtils, isTankUtils } from "../manage/city1/milltary_vehicle/MilltaryVehicleUtils";
import { getNamePrefixMissileTurret, getNamePrefixShellTurret, isMilltaryBuilding, isMissileTurretUtils, isShellTurretUtils } from "../manage/city1/milltary_building/MilltaryBuildingUtils";
import { isBuildings, getNamePrefix as getNamePrefixBuilding } from "../manage/city1/Buildings";
import { isCars, getNamePrefix as getNamePrefixCar } from "../manage/city1/Cars";
import { getOctreeForStaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/LOD";
import { forceSize, speed } from "../data/DataType";
import { getNow } from "../Time";
import { handleDestroy } from "../StaticDynamic";
import { computeRemoteDistance, isRemoteWeapon } from "./WeaponUtils";
import { getPlayerCamp } from "./PlayerUtils";
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue";
import { LabelManager } from "meta3d-jiehuo-abstract";
import { GPUSkin } from "meta3d-jiehuo-abstract";
import { buildNameInShadowQueue } from "./CharacterUtils";
import { addDeathUI, disposeData as disposeDataStatus, getStatusKeyByName } from "../Status";
;
import { findRandomNearData, getAllAliveEliteGiantessData, getAllAliveMilltaryBuildingData, getAllAliveMilltaryVehicleData, getAllAliveSoldierData, visibleData } from "../behaviour_tree/action_node/utils/GiantessSelectTargetUtils";
import { disposeEnemyData as disposeBuffData } from "../buff/Buff";
import { updateAttackTarget } from "./AttackTargetUtils";
import { getParticleNeedCollisionCheckLoopCount, isZeroForce } from "./ArmyUtils2";
import { parseNamePrefix as parseNamePrefixEliteGiantess, isEliteGiantess, stopAndRemoveMoveDataAndTween as stopAndRemoveMoveDataAndTweenEliteGiantess, getAllModelQueues as getAllModelQueuesEliteGiantess, setStateMachine as setStateMachineEliteGiantess, getStateMachine as getStateMachineEliteGiantess, getInitialQuaternion as getInitialQuaternionEliteGiantess } from "../../../../mod/EliteGiantessMod";
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB";
import { getMoveAmplitude } from "./LightStressingGiantessUtils";
import { getEmitSpeedFactor } from "../StaticDynamicUnit";
import { computeColor } from "./ColorUtils";
import { getInitialQuaternion as getInitialQuaternionSoldier, stopAndRemoveMoveDataAndTweenSoldier } from "../manage/city1/soldier/Soldier";
import { createInitialState, getModelName } from "./LODQueueObjectUtils";
import { modelName } from "../army_data/SoldierData";
import { getFaceDirection } from "meta3d-jiehuo-abstract/src/utils/TransformUtils";
import { getIsShowExplosionSmoke } from "../UI";
import { buildCollisionBox, isUnderGround } from "../manage/city1/Terrain";
import { getPositionByName as getPositionByNameModUtils } from "../../../../mod/ModUtils";
import { getBulletStartLocalPosition } from "../little_man/Gun";
import { getIsControlledUnitCanAttack } from "../build/Career";
import { getIsControlledData } from "../girl/PickPoseUtils";

const _b = new Box3()
const _q = new Quaternion();
const _q2 = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();
const _r = new Ray();


export let getShootDirection = (direction, emitPrecision: emitPrecision) => {
	return direction.clone().add(_v1.set(
		emitPrecision * NumberUtils.getRandomValue1(),
		emitPrecision * Math.random(),
		emitPrecision * NumberUtils.getRandomValue1(),
	)).normalize()
}

// export let getGirlPositionParrelToArmy = (state: state, armyPositionY: number) => {
// 	let girlBoxCenter = getGirlBoxCenter(state)

// 	return girlBoxCenter.setY(armyPositionY)
// }

let _getPositionParrelTo = (sourcePosition, targetPositionY) => {
	return sourcePosition.setY(targetPositionY)
}

export let getGirlPositionParrelToArmy = (state: state, usedGirl, armyPositionY: number, collisionPart_: collisionPart) => {
	return _getPositionParrelTo(getCollisionPartCenter(state, usedGirl, collisionPart_).clone(), armyPositionY)
}

let _getGirlPositionParrelToArmyData = (state: state, usedGirl, armyPositionY: number, collisionPart_: collisionPart): [Vector3, Vector3, number] => {
	let obb = getCollisionPartOBB(state, usedGirl, collisionPart_)

	let halfSize = obb.halfSize

	return [obb.center,
	_getPositionParrelTo(obb.center.clone(), armyPositionY),
	Math.min(halfSize.x, halfSize.y, halfSize.z)]
}

let _getGirlPositionParrelToArmyData2 = (state: state, usedGirl, armyPositionY: number, collisionPart_: collisionPart): [Vector3, number] => {
	let [_, d1, d2] = _getGirlPositionParrelToArmyData(state, usedGirl, armyPositionY, collisionPart_)

	return [d1, d2]
}


export let getLittleManPositionParrelToArmy = (state: state, armyPositionY: number, littleManPosition: Vector3) => {
	return _getPositionParrelTo(littleManPosition.clone(), armyPositionY)
}


// export let getForceDirection = () => {
// 	return new Vector3(1, 1, 1)
// }


// export let buildDamageFromName = () => "Army"

// let _getMeleeRangeSize = (meleeRange) => {
// 	return meleeRange / 2
// }

let _getBuildingBoxPoint = (state, name, result = new Vector3()) => {
	let box = getAttackTargetObjectDataExn(state, name).getBoxFunc(state)

	// if (getBoxMinXZSize(box) <= 15) {
	// 	return box.getCenter(result)
	// }

	return getBoxEdgePoint(box, result)
}

let _isCanAttackForMelee = (state: state, name, transform: Matrix4, meleeRange_) => {
	let position = TransformUtils.getPositionFromMatrix4(transform)

	// meleeRange_ = NullableUtils.getExn(getMeleeRange(meleeRange_, box, isEliteGiantess(state, name)))
	meleeRange_ = NullableUtils.getExn(meleeRange_)

	let targetData
	switch (getAttackTargetExn(state, name)) {
		case attackTarget.Giantess:
			let usedGirl = getAttackTargetUsedGirl(state, name)
			// targetPosition = getGirlPositionParrelToArmy(state, position.y, getNearestCollisionPart(state, position))
			let collisionPart_ = getNearestCollisionPart(state, usedGirl, position)


			targetData = _getGirlPositionParrelToArmyData2(state, usedGirl, position.y, collisionPart_)

			let [_, minSize] = targetData

			if (getIsLightStressingGirl(state, usedGirl, collisionPart_)) {
				// meleeRange_ *= 2
				meleeRange_ += NumberUtils.greaterThan(getMoveAmplitude(state, usedGirl) * minSize, meleeRange_)
			}

			break
		case attackTarget.LittleMan:
			targetData = [getLittleManPositionParrelToArmy(state, position.y, LittleManTransform.getWorldPosition(state)), 0]
			break
		case attackTarget.Object:
			targetData = [_getPositionParrelTo(getAttackTargetObjectDataExn(state, name).getPositionFunc(state), position.y), 0]
			break
		case attackTarget.Building:
			targetData = [_getPositionParrelTo(_getBuildingBoxPoint(state, name, _v1), position.y), 0]
			break
		case attackTarget.None:
			throw new Error("err")
	}
	let [targetPosition, minSize] = targetData

	let distance = position.distanceTo(targetPosition) - minSize


	// if (meleeRange_ <= meleeRange.Middle) {
	// 	meleeRange_ *= 1.5
	// }

	// return distance < _getMeleeRangeSize(NullableUtils.getExn(meleeRange))
	return distance < meleeRange_
	// || distance < 1.414 * PathFind.getStep(getAbstractState(state))
}

let _isCanAttackForRemote = (state, name, position, distance, targetPosition, minTargetDistance, targetDistance): [state, boolean] => {
	if (distance < minTargetDistance) {
		return [state, true]
	}


	if (distance < targetDistance) {
		if (getNow(state) - getLastJudgeRayCastTime(state, name) < 2000) {
			return [state, NullableUtils.getWithDefault(getLastJudgeRayCastResult(state, name), true)]
		}

		state = setLastJudgeRayCastTime(state, name, getNow(state))

		if (
			!getOctreeForStaticLODContainer(getAbstractState(state)).isIntersectByRay(getAbstractState(state),
				_r.set(
					position,
					_v2.copy(targetPosition).sub(position).normalize()
				),
				distance
			)
		) {
			state = setLastJudgeRayCastResult(state, name, true)

			return [state, true]
		}

		state = setLastJudgeRayCastResult(state, name, false)

		return [state, false]
	}

	return [state, false]
}

let _getRemoteAttackDistanceFactorForLittleMan = (name) => {
	if (isSoldier(name)) {
		return 0.5
	}

	return 0.9
}

let _isCanAttackForRemoteJudge = (state, name, targetPosition_, position,
	minTargetDistance, targetDistance
) => {
	let targetPositionParrel_ = _getPositionParrelTo(targetPosition_, position.y)

	let distance_ = position.distanceTo(targetPositionParrel_)

	return _isCanAttackForRemote(state, name, position, distance_,
		targetPosition_,
		minTargetDistance, targetDistance)
}

export let isCanAttackForRemote = (state: state, name, transform: Matrix4, box: Box3, emitterLife, emitterSpeed): [state, boolean] => {
	// let position = TransformUtils.getPositionFromMatrix4(transform)
	let position = box.getCenter(_v1)

	let [targetDistance, minTargetDistance] = computeRemoteDistance(emitterLife, emitterSpeed)

	switch (getAttackTargetExn(state, name)) {
		case attackTarget.Giantess:
			let usedGirl = getAttackTargetUsedGirl(state, name)
			return getAllLowestCollisionParts(state, usedGirl).reduce((result, collisionPart_) => {
				if (result[1]) {
					return result
				}

				state = result[0]

				let usedGirl = getAttackTargetUsedGirl(state, name)

				let [targetPosition, targetPositionParrel, minSize] = _getGirlPositionParrelToArmyData(state, usedGirl, position.y, collisionPart_)

				let distance = position.distanceTo(targetPositionParrel) - minSize

				return _isCanAttackForRemote(state, name, position,
					distance,
					targetPosition,
					minTargetDistance, targetDistance)
			}, [state, false])
		case attackTarget.LittleMan:
			let targetPosition = LittleManTransform.getPosition(state)
			let targetPositionParrel = getLittleManPositionParrelToArmy(state, position.y, targetPosition)

			const factor = _getRemoteAttackDistanceFactorForLittleMan(name)

			let distance = position.distanceTo(targetPositionParrel)

			return _isCanAttackForRemote(state, name, position, distance,
				targetPosition,
				minTargetDistance * factor, targetDistance * factor)
		case attackTarget.Object:
			return _isCanAttackForRemoteJudge(state, name, getAttackTargetObjectDataExn(state, name).getPositionFunc(state), position,
				minTargetDistance, targetDistance
			)
		case attackTarget.Building:
			return _isCanAttackForRemoteJudge(state, name, _getBuildingBoxPoint(state, name, _v1), position,
				minTargetDistance, targetDistance
			)
		case attackTarget.None:
			throw new Error("err")
	}
}

let _isCanAttackByWeapon = (state: state, name, transform: Matrix4, box, emitterLife, emitterSpeed, meleeRange): [state, boolean] => {
	// if (getAttackTargetExn(state, name) == attackTarget.None) {
	// 	return false
	// }

	// if (StateMachine.isState(stateMachine, objectStateName.Attack)) {
	// 	return [state, true]
	// }

	// if (frameIndex - getLastAttackFrame(state, name) < computeAttackFrames(state, name, emitSpeed)) {
	// 	return [state, false]
	// }


	if (isRemoteWeapon(meleeRange)) {
		return isCanAttackForRemote(state, name, transform, box, emitterLife, emitterSpeed)
	}

	return [state, _isCanAttackForMelee(state, name, transform, NullableUtils.getExn(meleeRange))]
}

// let _isEliteGiantessCanAttack = (state: state, name, transform: Matrix4, box, frameIndex, emitSpeed, emitterLife, emitterSpeed, meleeRange): [state, boolean] => {
// 	// if (getAttackTargetExn(state, name) == attackTarget.None) {
// 	// 	return false
// 	// }

// 	// if (StateMachine.isState(stateMachine, objectStateName.Attack)) {
// 	// 	return [state, true]
// 	// }

// 	if (frameIndex - getLastAttackFrame(state, name) < computeAttackFrames(state, name, emitSpeed)) {
// 		return [state, false]
// 	}

// 	if (getIsEliteGiantessAttacking(state, name)) {
// 		return [state, true]
// 	}

// 	if (isRemoteWeapon(meleeRange)) {
// 		return isCanAttackForRemote(state, name, transform, box, emitterLife, emitterSpeed)
// 	}

// 	return [state, _isCanAttackForMelee(state, name, transform, box, NullableUtils.getExn(meleeRange))]
// }

let _findMoveTarget = (state: state, name, armyPosition, meleeRange) => {
	switch (getAttackTargetExn(state, name)) {
		case attackTarget.Giantess:
			let usedGirl = getAttackTargetUsedGirl(state, name)

			// if (isMeleeOrFlameVehicle(name)) {
			if (isRemoteWeapon(meleeRange)) {
				return getCenterInFloor(state, usedGirl)
			}

			// return getGirlPositionParrelToArmy(state, armyPosition.y, getRandomCollisionPartForMelee(state))
			return getGirlPositionParrelToArmy(state, usedGirl, armyPosition.y, getNearestCollisionPart(state, usedGirl, armyPosition))
		case attackTarget.LittleMan:
			return getLittleManPositionParrelToArmy(state, armyPosition.y, LittleManTransform.getWorldPosition(state))
		case attackTarget.Object:
			return _getPositionParrelTo(getAttackTargetObjectDataExn(state, name).getPositionFunc(state), armyPosition.y)
		case attackTarget.Building:
			return _getPositionParrelTo(_getBuildingBoxPoint(state, name, _v1), armyPosition.y)
		case attackTarget.None:
			throw new Error("err")
	}
}

let _isChangeToInitialState = (state: state, name) => {
	switch (getAttackTargetExn(state, name)) {
		case attackTarget.Giantess:
			let usedGirl = getAttackTargetUsedGirl(state, name)
			return !isUseGirl(state, usedGirl)
		case attackTarget.LittleMan:
			return !isLittleCharacterType(state)
		case attackTarget.Object:
		case attackTarget.Building:
			return false
		case attackTarget.None:
			return true
	}
}

export let getUpdateAIFrameCount = (state) => {
	return Device.isMobileByState(getAbstractState(state)) ? 5 : 10
}

let _isNeedUpdateAI = (state: state) => {
	return Flow.getFrameIndex(getAbstractState(state)) % getUpdateAIFrameCount(state) == 0
	// return true
}

let _updateValidDataAndHandleNoAttackTarget = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createInitialStateFunc,
	],
	validData,
) => {
	validData = ArrayUtils.filter(validData, ([transform, box, name]) => {
		let stateMachine = getStateMachineFunc(state, name)

		if (!isNotDamageState(stateMachine)
			|| getIsLightStressing(state, name)
		) {
			return false
		}

		if (isControlledState(state, stateMachine)) {
			if (
				getIsControlledUnitCanAttack(state) && isGiantessControlledState(stateMachine)
				&& isGiantessCharacterTypeByUsedGirl(state, TupleUtils.getTuple2Last(getIsControlledData(state, name)))
			) {
				return true
			}

			return false
		}

		return true
	})

	// return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
	// 	if (!hasAttackTargetByName(state, name)) {
	// 		let stateMachine = getStateMachineFunc(state, name)

	// 		return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
	// 	}

	// 	return Promise.resolve(state)
	// }, state).then(state => [state, validData])
	return Promise.resolve([state, validData])
}

export let updateAI = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createAttackStateFunc,
		createInitialStateFunc,
		createMoveStateFunc,
		hasMoveDataFunc,
		setMoveDataFunc
	],
	validData,
	emitSpeed,
	emitterLife,
	emitterSpeed,
	meleeRange,
) => {
	if (!_isNeedUpdateAI(state)) {
		return Promise.resolve(state)
	}

	const minInterval = NullableUtils.return_(500)

	let finder = PathFind.createAStarFinder()
	// let frameIndex = Flow.getFrameIndex(getAbstractState(state))

	return _updateValidDataAndHandleNoAttackTarget(state,
		[getStateMachineFunc, setStateMachineFunc,
			createInitialStateFunc,
		],
		validData,
	).then(([state, validData]) => {
		return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
			let stateMachine = getStateMachineFunc(state, name)

			// if (!isNotDamageState(stateMachine)
			// 	|| isControlledState(state, stateMachine)
			// 	|| getIsLightStressing(state, name)
			// ) {
			// 	return Promise.resolve(state)
			// }

			// console.log("updateAI->updateAttackTarget: name", name)
			state = updateAttackTarget(state, name, TransformUtils.getPositionFromMatrix4(transform), box, meleeRange, stateMachine)


			if (_isChangeToInitialState(state, name)) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
			}

			// console.log("updateAI->_isCanAttackByWeapon: name", name)

			let result = _isCanAttackByWeapon(state, name, transform, box, emitterLife, emitterSpeed, meleeRange)
			state = result[0]
			let isCanAttack = result[1]
			if (isCanAttack) {
				// if (!StateMachine.isState(stateMachine, objectStateName.Attack)) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createAttackStateFunc(), name, name)
				// }

				// return Promise.resolve(state)
			}

			// console.log("updateAI->_handleMove: name", name)
			return _handleMove(state,
				[getStateMachineFunc, setStateMachineFunc,
					createInitialStateFunc,
					createMoveStateFunc,
					hasMoveDataFunc,
					setMoveDataFunc,
				],
				transform, name,
				stateMachine,
				finder,
				minInterval,
				meleeRange
			)
		}, state)
	})
}

let _handleMoveData = (state: state,
	[setStateMachineFunc,
		createInitialStateFunc,
		setMoveDataFunc,
	],
	transform, name,
	stateMachine,
	finder,
	minInterval,
	meleeRange
): [boolean, Promise<state>] => {
	// console.log("updateAI->_handleMoveData: name", name)
	let p1 = TransformUtils.getPositionFromMatrix4(transform)
	let p2 = _findMoveTarget(state, name, p1, meleeRange)

	let attackTarget = getAttackTargetExn(state, name)
	let usedGirl = getAttackTargetUsedGirl(state, name)

	let data = PathFind.findPath(getAbstractState(state), finder,
		_v1_1.set(p1.x, p1.z),
		_v1_2.set(p2.x, p2.z),
		isVeryNearAttackTarget(state, attackTarget, p1, p2),
		getGrid(state, usedGirl, attackTarget, p1, p2),
		name,
		getIsDebug(state),
		NullableUtils.return_(minInterval),
		NullableUtils.getEmpty()
	)
	state = setAbstractState(state, data[0])
	let path = data[1]

	if (path.length > 0) {
		if (getIsDebug(state) && getIsNotTestPerf(state)) {
			PathFind.showFindedPath(getAbstractState(state), path, 0xffff00)
		}

		state = setMoveDataFunc(state, name, path)
		// state = setMoveDataFunc(state, name, [getRefindPathTime(state, getAttackTargetExn(state, name), p1), path])

		return [false, Promise.resolve(state)]
	}

	state = clearAttackTargetData(state, name)

	return [true, StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)]
}

let _handleMove = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createInitialStateFunc,
		createMoveStateFunc,
		hasMoveDataFunc,
		setMoveDataFunc,
	],
	transform, name,
	stateMachine,
	finder,
	minInterval,
	meleeRange
) => {
	let promise = Promise.resolve(state)
	// console.log(
	// 	"in _handleMove: ",
	// 	name,
	// 	!hasMoveDataFunc(state, name),
	// 	!hasAttackTargetByName(state, name)
	// )
	if (!hasMoveDataFunc(state, name)) {
		if (!hasAttackTargetByName(state, name)) {
			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
		}

		let data = _handleMoveData(state,
			[setStateMachineFunc,
				createInitialStateFunc,
				setMoveDataFunc,
			],
			transform, name,
			stateMachine,
			finder,
			minInterval,
			meleeRange
		)
		let isChangeFsmState = data[0]
		promise = data[1]
		if (isChangeFsmState) {
			return promise
		}
	}

	return promise.then(state => {
		if (!StateMachine.isState(getStateMachineFunc(state, name), objectStateName.Move)) {
			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createMoveStateFunc(state), name, name)
		}

		return state
	})
}

// TODO duplicate
export let updateEliteGiantessAI = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createAttackStateFunc,
		createInitialStateFunc,
		createMoveStateFunc,
		hasMoveDataFunc,
		setMoveDataFunc,
		getWeaponValueFunc
	],
	validData,
	emitSpeed
	// emitterLife,
	// emitterSpeed,
	// meleeRange,
) => {
	if (!_isNeedUpdateAI(state)) {
		return Promise.resolve(state)
	}

	const minInterval = 500


	let finder = PathFind.createAStarFinder()
	// let frameIndex = Flow.getFrameIndex(getAbstractState(state))

	return _updateValidDataAndHandleNoAttackTarget(state,
		[getStateMachineFunc, setStateMachineFunc,
			createInitialStateFunc,
		],
		validData,
	).then(([state, validData]) => {
		return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
			let stateMachine = getStateMachineFunc(state, name)

			// if (!isNotDamageState(stateMachine)
			// 	|| isControlledState(state, stateMachine)
			// 	|| getIsLightStressing(state, name)
			// ) {
			// 	return Promise.resolve(state)
			// }


			/*! get current attackTarget's weapon's meleeRange
			* 
			*/
			state = updateAttackTarget(state, name, TransformUtils.getPositionFromMatrix4(transform), box,
				NullableUtils.map(
					value => value.meleeRange,
					getWeaponValueFunc(state, name, box)
				),
				stateMachine
			)

			if (_isChangeToInitialState(state, name)) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
			}



			/*! get new attackTarget's weapon value
			* 
			*/
			let {
				emitterSpeed,
				emitterLife,
				meleeRange,
			} = NullableUtils.getExn(getWeaponValueFunc(state, name, box))


			let result = _isCanAttackByWeapon(state, name, transform, box, emitterLife, emitterSpeed, meleeRange)
			state = result[0]
			let isCanAttack = result[1]
			if (isCanAttack || getIsEliteGiantessAttacking(state, name)) {
				// if (!StateMachine.isState(stateMachine, objectStateName.Attack)) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createAttackStateFunc(), name, name)
				// }

				// return Promise.resolve(state)
			}

			return _handleMove(state,
				[getStateMachineFunc, setStateMachineFunc,
					createInitialStateFunc,
					createMoveStateFunc,
					hasMoveDataFunc,
					setMoveDataFunc,
				],
				transform, name,
				stateMachine,
				finder,
				minInterval,
				meleeRange
			)
		}, state)
	})
}

export let updateTurretAI = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createAttackStateFunc,
		createInitialStateFunc,
	],
	validData,
	emitSpeed,
	emitterLife,
	emitterSpeed,
) => {
	if (!_isNeedUpdateAI(state)) {
		return Promise.resolve(state)
	}

	// const minInterval = 500

	// let finder = PathFind.createAStarFinder()
	// let frameIndex = Flow.getFrameIndex(getAbstractState(state))

	return _updateValidDataAndHandleNoAttackTarget(state,
		[getStateMachineFunc, setStateMachineFunc,
			createInitialStateFunc,
		],
		validData,
	).then(([state, validData]) => {
		return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
			let stateMachine = getStateMachineFunc(state, name)

			// if (!isNotDamageState(stateMachine)
			// 	|| isControlledState(state, stateMachine)
			// ) {
			// 	return Promise.resolve(state)
			// }

			state = updateAttackTarget(state, name, TransformUtils.getPositionFromMatrix4(transform), box, NullableUtils.getEmpty(), stateMachine)

			if (_isChangeToInitialState(state, name)) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
			}

			let result = _isCanAttackByWeapon(state, name, transform, box, emitterLife, emitterSpeed, NullableUtils.getEmpty())
			state = result[0]
			let isCanAttack = result[1]
			if (isCanAttack) {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createAttackStateFunc(), name, name)
			}

			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
		}, state)
	})
}

let _computeMoveTime = (previousPosition, nextPosition, factor) => {
	let dx = previousPosition[0] - nextPosition[0], dz = previousPosition[1] - nextPosition[1]

	let distance = Math.sqrt(dx * dx + dz * dz)

	return distance * (factor / 2 + factor / 2 * Math.random())
}

let _handleMoveComplete = (state: state,
	[stopAndRemoveMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
	name
) => {
	state = stopAndRemoveMoveDataAndTweenFunc(state, name)

	return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createInitialStateFunc(), name, name)
}

let _executeMove = (
	state: state,
	[getLODQueueIndexFunc,
		getModelQueueFunc,
		playAnimationFunc,
		handleAfterUpdatePositionFunc,
		addMoveTweensFunc,
		getInitialEulerForTweenToFaceNegativeXFunc,
		getMoveDataFunc,
		setMoveDataFunc,
		getStateMachineFunc,
		setStateMachineFunc,
		createInitialStateFunc,
		hasMoveTweenFunc,
		getMoveTweenFunc,
		stopAndRemoveMoveDataAndTweenFunc,
		getMoveSpeedFunc,
		// handleEnterFunc = (state, _) => state,
		// handleExitFunc = (state, _) => state,
	],
	name,
	// moveSpeed: number,
	initialQuaternion: Quaternion,
	isPlayAnimation,

) => {
	// requireCheck(() => {
	// 	test("moveSpeed should > 0", () => {
	// 		return getMoveSpeedFunc(state, name) > 0
	// 	})
	// }, getIsDebug(state))


	// return Promise.resolve(state)
	let lodQueueIndex = getLODQueueIndexFunc(state, name)
	let lodQueue: LODQueue = getModelQueueFunc(state, name)

	if (isPlayAnimation) {
		state = playAnimationFunc(state, name)
	}

	let startTime = getNow(state)

	let box = lodQueue.getBox(lodQueueIndex)
	let moveSpeed = getMoveSpeedFunc(state, name, box)

	// let [refindPathTime, path] = getMoveDataFunc(state, name)

	// console.log("executeMove: ",
	// 	name,
	// 	getMoveDataFunc(state, name).map(value => value.toArray())
	// )

	return buildMultipleTweens(state, [(state, object, currentData) => {
		let position = _v1.set(object.x, getPositionY(state, getGetPositionYFuncDefaultKey(), object.x, object.z), object.z)

		if (
			!hasAttackTargetByName(state, name)
		) {
			return _handleMoveComplete(state,
				[stopAndRemoveMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
				name
			)
		}

		let isNeedRefindPath = getIsNeedRefindPath(state, name)
		if (
			// !hasAttackTargetByName(state, name)
			// ||
			// getNow(state) - startTime > getRefindPathTime(state, getAttackTargetExn(state, name), position)
			isNeedRefindPath
			||
			getNow(state) - startTime > getRefindPathTime()
			* NumberUtils.clamp(speed.Middle * 1 / moveSpeed, 0.2, 3)
			||
			!lodQueue.isAlive(lodQueueIndex)
			// || getIsLightStressing(state, name)

		) {
			// return _handleMoveComplete(state,
			// 	[stopAndRemoveMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
			// 	name
			// )
			return _resetMove(
				state,
				[getLODQueueIndexFunc,
					getModelQueueFunc,
					playAnimationFunc,
					handleAfterUpdatePositionFunc,
					addMoveTweensFunc,
					getInitialEulerForTweenToFaceNegativeXFunc,
					getMoveDataFunc,
					setMoveDataFunc,
					getStateMachineFunc,
					setStateMachineFunc,
					createInitialStateFunc,
					hasMoveTweenFunc,
					getMoveTweenFunc,
					stopAndRemoveMoveDataAndTweenFunc,
					getMoveSpeedFunc,
				],
				name,
				lodQueue,
				lodQueueIndex,
				initialQuaternion,
				isNeedRefindPath
			)
		}

		// let position = _v1.set(object.x, 0, object.z)

		lodQueue.updatePosition(lodQueueIndex, position, true)

		state = handleAfterUpdatePositionFunc(state, lodQueue, lodQueueIndex, name, position)

		return Promise.resolve(state)
	}, data => {
		return {
			x: data[0],
			z: data[1],
		}
	}, (state, previousData, nextData) => {
		NullableUtils.forEach((quaternion) => {
			if (lodQueue.isAlive(lodQueueIndex)) {
				lodQueue.updateTransform(transform => {
					TransformUtils.setQuaternionToMatrix4(
						transform,
						initialQuaternion.clone().premultiply(
							quaternion
						)
					)
				}, lodQueueIndex,
					true,
				)
			}
		},
			computeQuaternion(previousData, nextData, getInitialEulerForTweenToFaceNegativeXFunc())
		)

		return state
	}, (previousData, nextData) => {
		return _computeMoveTime(previousData, nextData, 1000 * 1 / moveSpeed)
	}], getMoveDataFunc(state, name).map(value => value.toArray())).then(d => {
		state = d[0]
		let lastTween = d[1]
		let allTweens = d[2]


		// console.log(allTweens.length,
		// 	getMoveDataFunc(state, name)
		// )

		state = addMoveTweensFunc(state, name, allTweens)

		if (NullableUtils.isNullable(lastTween)) {
			return _handleMoveComplete(state,
				[stopAndRemoveMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
				name
			)
		}

		NullableUtils.getExn(lastTween).onComplete(() => {
			let state = readState()

			return _handleMoveComplete(state,
				[stopAndRemoveMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
				name
			).then(writeState)
		})

		return Promise.resolve(state)
	})
}


let _resetMove = (
	state,
	[getLODQueueIndexFunc,
		getModelQueueFunc,
		playAnimationFunc,
		handleAfterUpdatePositionFunc,
		addMoveTweensFunc,
		getInitialEulerForTweenToFaceNegativeXFunc,
		getMoveDataFunc,
		setMoveDataFunc,
		getStateMachineFunc,
		setStateMachineFunc,
		createInitialStateFunc,
		hasMoveTweenFunc,
		getMoveTweenFunc,
		stopAndRemoveMoveDataAndTweenFunc,
		getMoveSpeedFunc,
	],
	name,
	lodQueue,
	lodQueueIndex,
	initialQuaternion: Quaternion,
	isNeedRefindPath,
) => {

	// console.log("reset move: ", name, getAttackTarget(state, name))

	state = stopAndRemoveMoveDataAndTweenFunc(state, name)

	if (isNeedRefindPath) {
		state = setIsNeedRefindPath(state, name, false)
	}

	// state = clearTween(state,
	// 	[
	// 		hasMoveTweenFunc, getMoveTweenFunc, stopAndRemoveMoveDataAndTweenFunc
	// 	], name
	// )

	// if (!hasAttackTargetByName(state, name)) {
	// 	return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
	// }

	let transform = lodQueue.getTransform(lodQueueIndex)

	let finder = PathFind.createAStarFinder()

	let minInterval
	if (isNeedRefindPath) {
		minInterval = NullableUtils.getEmpty()
	}
	else {
		minInterval = NullableUtils.return_(500)
	}

	let stateMachine = getStateMachineFunc(state, name)

	let data = _handleMoveData(state,
		[setStateMachineFunc,
			createInitialStateFunc,
			setMoveDataFunc,
		],
		transform, name,
		stateMachine,
		finder,
		minInterval,
		meleeRange
	)
	let isChangeFsmState = data[0]
	let promise = data[1]
	if (isChangeFsmState) {
		return promise
	}

	return promise.then(state => {
		return _executeMove(
			state,
			[getLODQueueIndexFunc,
				getModelQueueFunc,
				playAnimationFunc,
				handleAfterUpdatePositionFunc,
				addMoveTweensFunc,
				getInitialEulerForTweenToFaceNegativeXFunc,
				getMoveDataFunc,
				setMoveDataFunc,
				getStateMachineFunc,
				setStateMachineFunc,
				createInitialStateFunc,
				hasMoveTweenFunc,
				getMoveTweenFunc,
				stopAndRemoveMoveDataAndTweenFunc,
				getMoveSpeedFunc,
			],
			name,
			initialQuaternion,
			false
		)
	})
}


export let createMoveState = (
	[getLODQueueIndexFunc,
		getModelQueueFunc,
		playAnimationFunc,
		handleAfterUpdatePositionFunc,
		addMoveTweensFunc,
		getInitialEulerForTweenToFaceNegativeXFunc,
		getMoveDataFunc,
		setMoveDataFunc,
		getStateMachineFunc,
		setStateMachineFunc,
		createInitialStateFunc,
		hasMoveTweenFunc,
		getMoveTweenFunc,
		stopAndRemoveMoveDataAndTweenFunc,
		getMoveSpeedFunc,
		handleEnterFunc = (state, _) => state,
		handleExitFunc = (state, _) => state,
	],
	// moveSpeed: number,
	initialQuaternion: Quaternion
): fsm_state<state> => {
	return {
		name: objectStateName.Move,
		enterFunc: (state, stateMachine, _) => {
			state = handleEnterFunc(state, stateMachine.name)

			return Promise.resolve(state)
		},
		executeFunc: (state, name) => {
			return _executeMove(
				state,
				[getLODQueueIndexFunc,
					getModelQueueFunc,
					playAnimationFunc,
					handleAfterUpdatePositionFunc,
					addMoveTweensFunc,
					getInitialEulerForTweenToFaceNegativeXFunc,
					getMoveDataFunc,
					setMoveDataFunc,
					getStateMachineFunc,
					setStateMachineFunc,
					createInitialStateFunc,
					hasMoveTweenFunc,
					getMoveTweenFunc,
					stopAndRemoveMoveDataAndTweenFunc,
					getMoveSpeedFunc,
					// handleEnterFunc = (state, _) => state,
					// handleExitFunc = (state, _) => state,
				],
				name,
				initialQuaternion,
				true
			)
		},
		exitFunc: (state: state, stateMachine, _) => {
			let name = stateMachine.name

			// if (!hasMoveTweenFunc(state, name)) {
			// 	return Promise.resolve(state)
			// }

			// getMoveTweenFunc(state, name).stop()

			// state = stopAndRemoveMoveDataAndTweenFunc(state, name)
			state = clearTween(state,
				[
					hasMoveTweenFunc, getMoveTweenFunc, stopAndRemoveMoveDataAndTweenFunc
				], name
			)

			state = handleExitFunc(state, name)

			return Promise.resolve(state)
		},
	}
}

// export let getParticleNeedCollisionCheckLoopCount = (state: state) => {
// 	switch (getRenderSetting(state).physics) {
// 		case physicsLevel.VeryLow:
// 			// return particleNeedCollisionCheckLoopFrames.Four
// 			return particleNeedCollisionCheckLoopFrames.Three
// 		case physicsLevel.Low:
// 			// return particleNeedCollisionCheckLoopFrames.Three
// 			return particleNeedCollisionCheckLoopFrames.Two
// 		case physicsLevel.Middle:
// 		// return particleNeedCollisionCheckLoopFrames.Two
// 		case physicsLevel.High:
// 		case physicsLevel.VeryHigh:
// 			return particleNeedCollisionCheckLoopFrames.One
// 	}
// }

// export let setParticleNeedCollisionCheckLoopCount = (state: state, particle: shellParticle | bulletParticle | rocketParticle | missileVehicleMissileParticle) => {
// 	return setAbstractState(state, ParticleManager.setNeedCollisionCheckLoopCount(getAbstractState(state), particle.id, getParticleNeedCollisionCheckLoopCount(state, emitterSpeed)))
// }

export let checkParticleCollisionWithStatic = (state: state, box: Box3) => {
	// switch (getRenderSetting(state).physics) {
	// 	case physicsLevel.VeryLow:
	// 		return NullableUtils.getEmpty<number>()
	// }

	return checkCollisionWithStatic(state, box)
}

export let checkParticleRangeCollisionWithStatic = (state: state, box: Box3) => {
	// switch (getRenderSetting(state).physics) {
	// 	case physicsLevel.VeryLow:
	// 		// return NullableUtils.getEmpty<number>()
	// 		return []
	// }

	return checkRangeCollisionWithStatic(state, box)
}

export let emitShellEmitOrExplode = (state: state, position: [number, number, number], size) => {
	if (getIsShowExplosionSmoke(state)) {
		state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
			// speed: 5,
			speed: 0.1,
			life: 2000,
			size,
			// position: [position[0], position[1] * 0.2, position[2]]
			position: [position[0], position[1] - 1.5, position[2]]
		}))
	}
	state = setAbstractState(state, ParticleManager.emitShellEmitOrExplode(getAbstractState(state), {
		speed: 1,
		// life: 2000,
		life: 1000,
		// life: 20000,
		// size: 100,
		size,
		position: position
	}))

	return state
}

// export let handleMeleeCollision = (state: state,
// 	[
// 		handleHitStaticFunc,
// 		handleHitGirlFunc
// 	],
// 	name,
// 	xzSizeFactor,
// 	targetPosition,
// 	targetPart: collisionPart,
// 	sourcePosition, box, weaponValue) => {
// 	let direction = targetPosition.clone().sub(sourcePosition).normalize()

// 	// let box = lodQueue.boxes[lODQueueAndShadowLODQueueIndex]

// 	let meleeRange = NullableUtils.getExn(
// 		weaponValue.meleeRange
// 	)


// 	let size = meleeRange / 2
// 	// let center = box.getCenter(_v1).add(direction.multiplyScalar(size))
// 	let center = box.getCenter(_v1).add(direction.multiplyScalar(size))

// 	let attackRangeBox = _b.setFromCenterAndSize(center, _v2.set(size * xzSizeFactor, size, size * xzSizeFactor))
// 	// let attackRangeBox = _b.setFromCenterAndSize(center, _v2.setScalar(size))

// 	if (getIsDebug(state)) {
// 		addBox3Helper(getAbstractState(state), getScene(state), attackRangeBox, 0x811100)
// 	}

// 	return _handleCollision(
// 		state,
// 		[
// 			handleHitStaticFunc,
// 			handleHitGirlFunc
// 		],
// 		false,
// 		NullableUtils.return_(targetPart),
// 		attackRangeBox, center,
// 		name,
// 		direction,
// 		weaponValue,
// 	)
// }

export let deferFire = (state: state, func, name, emitSpeed) => {
	// requireCheck(() => {
	// 	test(`name:${name} shouldn't exist`, () => {
	// 		return NullableUtils.isNullable(getFlowState(getAbstractState(state)).deferExecFuncs.find(d => {
	// 			return d.name == name
	// 		}))
	// 	})
	// }, getIsDebug(state))

	// state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), name))

	state = setLastAttackFrame(state, name, Flow.getFrameIndex(getAbstractState(state)))

	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		return func(state)
	}, emitSpeed, name))

	return state
}

export let buildGunBarrelTween = (state, [onCompleteFunc, onFailFunc,
	handleGunBarrelLookatEulerAngleFunc,
	getObjectEulerAngleFunc,
	buildUpdateEulerFunc,
	isRoughTowardsTargetFunc,
	buildRoughFireRayFunc,
],
	name,
	bodyQueueName,
	gunBarrelQueue, allModelQueues,
	gunBarrelPosition,
	rotateSpeed,
	lodQueueIndex, targetPart) => {
	// let gunBarrelWorldMatrix = gunBarrelQueue.getWorldMatrix(lodQueueIndex)
	// let gunBarrelPosition = TransformUtils.getPositionFromMatrix4(gunBarrelWorldMatrix)
	let gunBarrelPositionY = gunBarrelPosition.y

	let collisionPartCenter = NullableUtils.getExn(getTargetBox(state, name, targetPart)).getCenter(new Vector3())
	// switch (getAttackTargetExn(state, name)) {
	// 	case attackTarget.Giantess:
	// 		collisionPartCenter = getCollisionPartCenter(state,usedGirl,  targetPart)
	// 		break
	// 	case attackTarget.LittleMan:
	// 		collisionPartCenter = LittleMan.getBoxCenter(state)
	// 		break
	// 	default:
	// 		throw new Error("err")
	// }

	let targetY = collisionPartCenter.y

	let fireRay = new Ray(
		gunBarrelPosition,
		collisionPartCenter.clone().sub(gunBarrelPosition).normalize()
	)

	// let gunBarrelLookatEulerAngle = handleGunBarrelLookatEulerAngleFunc(NumberUtils.clamp(Math.atan(
	// 	// Math.max(targetY - gunBarrelPositionY, 0.1) / (gunBarrelPosition.setY(0).distanceTo(collisionPartCenter.setY(0)))
	// 	(targetY - gunBarrelPositionY) / (gunBarrelPosition.setY(0).distanceTo(collisionPartCenter.setY(0)))
	// ), 0, Math.PI / 2))
	let gunBarrelLookatEulerAngle = handleGunBarrelLookatEulerAngleFunc(NumberUtils.clamp(Math.atan(
		(targetY - gunBarrelPositionY) / (gunBarrelPosition.clone().setY(0).distanceTo(collisionPartCenter.clone().setY(0)))
	), -Math.PI / 2, Math.PI / 2))

	let gunBarrelTransform = gunBarrelQueue.getTransform(lodQueueIndex).clone()


	let gunBarrelEuler = TransformUtils.getRotationEulerFromMatrix4(gunBarrelTransform)
	// if (gunBarrelEuler.z !== 0 || gunBarrelEuler.x !== 0) {
	// 	throw new Error("err")
	// }

	let object = {
		angle: getObjectEulerAngleFunc(gunBarrelEuler)
	}
	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to({
			angle: gunBarrelLookatEulerAngle
		}, Math.abs(gunBarrelLookatEulerAngle - object.angle) * 1000 * rotateSpeed)
		.onUpdate(() => {
			gunBarrelQueue.setTransform(lodQueueIndex, TransformUtils.setQuaternionToMatrix4(
				gunBarrelTransform,
				_q.setFromEuler(
					buildUpdateEulerFunc(object)
				)
			))


			let state = readState()

			state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueueName, lodQueueIndex, true))

			writeState(state)

			return Promise.resolve()
		})
		.onComplete(() => {
			let state = readState()

			ArticluatedAnimation.removeTween(getAbstractState(state), tween)


			let targetBox = getTargetBox(state, name, targetPart)
			if (NullableUtils.isNullable(targetBox)) {
				return onFailFunc(state).then(writeState)
			}
			targetBox = NullableUtils.getExn(targetBox)

			// if (!isRoughTowardsTargetFunc(state, buildRoughFireRayFunc, allModelQueues, lodQueueIndex, expandBox(getCollisionPartOBB(state, usedGirl,  targetPart).toBox3(), 1.1))) {
			if (!fireRay.intersectsBox(
				expandBox(targetBox, 1.1)
			)) {
				return onFailFunc(state).then(writeState)
			}

			return onCompleteFunc(state, targetPart).then(writeState)
		})

	return tween
}

export let buildArmyRewardKey = (state, name) => {
	return parseNamePrefix(state, name)
}

export let createDestroyingState = ([setStatusFunc,
	emitBodyExplodeFunc,
	getModelQueueIndexFunc,
	disposeArmyStateDataFunc,
	getStateMachineFunc,
	setStateMachineFunc,
], soundResourceId, weaponValue: weaponValue, damageType_) => {
	return (): fsm_state<state> => {
		return {
			name: objectStateName.Destroying,
			enterFunc: (state) => Promise.resolve(state),
			executeFunc: (state, [
				fromName,
				[matrix, box, name, damage, damageType_], forceDirection
			]: any) => {
				return Event.trigger<state>(state, getAbstractState, getDestroyingEventName(), buildDestroyintEventData(fromName, name)).then(state => {
					state = handleDestroy(state, fromName, name)


					state = NullableUtils.getWithDefault(
						NullableUtils.map(lodQueueIndex => {
							return setStatusFunc(state, buildStatus(false, false, true), lodQueueIndex)
						}, getModelQueueIndexFunc(state, name)),
						state
					)




					// let stateMachine = getStateMachineFunc(state, name)

					// let worldMatrix
					// if (StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)) {
					// let d = getParentTransform(state)
					// state = d[0]
					// let parentTransform = d[1]

					// worldMatrix = _m.multiplyMatrices(
					//     parentTransform, matrix
					// )
					// }
					// else {
					// worldMatrix = matrix
					// }

					// let point = TransformUtils.getPositionFromMatrix4(worldMatrix)
					let point = box.getCenter(new Vector3())


					state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
						// SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, weaponValue.emitterVolume,
						// SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, 1,
						SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, emitterVolume.VeryBig,
							point, 0
						))
					))


					state = emitBodyExplodeFunc(state, point.toArray(), box)

					state = generateReward(state, fromName, buildArmyRewardKey(state, name), name, point, _v1.set(point.x, getPositionY(state, getGetPositionYFuncDefaultKey(), point.x, point.z), point.z), 2)

					state = addDeathUI(state, box, damageType_)


					return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createDestroyedState(setStatusFunc, getModelQueueIndexFunc,
						disposeArmyStateDataFunc
					)(), name, [
						fromName,
						name,
					])
				})
			},
			exitFunc: (state: state) => Promise.resolve(state),
		}
	}
}

let _disposeLODQueueData = (state: state, allQueues, lodQueueIndex: lodQueueIndex) => {
	let abstractState = getAbstractState(state)

	// let queue = LOD.getLODQueue(abstractState, name)

	// let allQueues
	// if ((queue as HierachyLODQueue).isHierachyLODQueue) {
	// 	allQueues = ArrayUtils.pushArrs([queue], (queue as HierachyLODQueue).getAllChildren())
	// }
	// else {
	// 	allQueues = [queue]
	// }

	abstractState = allQueues.reduce((abstractState, queue) => {
		return queue.remove(abstractState, lodQueueIndex)
	}, abstractState)

	return setAbstractState(state, abstractState)
}

export let disposeAllData = (state: state, disposeArmyStateDataFunc, name: name, lodQueueIndex: lodQueueIndex) => {
	let abstractState = getAbstractState(state)

	let queue = LOD.getLODQueue(abstractState, name)

	let allQueues = queue.getAllQueues()
	// if ((queue as HierachyLODQueue).isHierachyLODQueue) {
	// 	allQueues = ArrayUtils.pushArrs([queue], (queue as HierachyLODQueue).getAllChildren())
	// }
	// else {
	// 	allQueues = [queue]
	// }

	return ArrayUtils.reducePromise<state, LODQueue>(allQueues, (state, queue) => {
		let name = queue.getName(lodQueueIndex)

		return disposeBuffData(state, name, NullableUtils.getEmpty()).then(state => {
			state = disposeArmyStateDataFunc(state, name)
			state = disposeData(state, name)

			state = disposeDataStatus(state, getStatusKeyByName(name))

			let abstractState = getAbstractState(state)

			// abstractState = LabelManager.disposeData(abstractState, name)
			abstractState = PathFind.disposeData(abstractState, name)
			abstractState = GPUSkin.disposeData(abstractState, name)



			state = setAbstractState(state, abstractState)

			return state
		})
	}, state).then(state => {
		state = _disposeLODQueueData(state, allQueues, lodQueueIndex)


		if (isSoldier(name)) {
			// state = disposeAllData(state, disposeArmyStateDataFunc, buildNameInShadowQueue(name), lodQueueIndex)

			let shadowName = buildNameInShadowQueue(name)

			let abstractState = getAbstractState(state)

			// let queue = LOD.getLODQueue(abstractState, shadowName)
			// // let name = queue.names[lodQueueIndex]
			// state = _disposeLODQueueData(state, [queue], lodQueueIndex)
			// abstractState = LOD.removeStatusForLODQueue(abstractState, shadowName)


			let shadowQueue = LOD.getLODQueue(abstractState, shadowName)
			// let name = queue.names[lodQueueIndex]
			state = _disposeLODQueueData(state, [shadowQueue], lodQueueIndex)


			state = setAbstractState(state, abstractState)
		}



		return state
	})
}

// export let deferToBatchDisposeAllData = (state: state, disposeArmyStateDataFunc, name, lodQueueIndex) => {
// 	state = addToDeferDisposeDataNames(state, name, lodQueueIndex)

// 	let deferDisposeDataNames = getDeferDisposeDataNames(state)

// 	if (deferDisposeDataNames.length >= 10) {
// 		state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
// 			state = deferDisposeDataNames.reduce((state, [name, lodQueueIndex]) => {
// 				return disposeAllData(state, disposeArmyStateDataFunc, name, lodQueueIndex)
// 			}, state)

// 			return Promise.resolve(state)
// 		}, 5))

// 		state = clearDeferDisposeDataNames(state)
// 	}

// 	return state
// }

export let createDestroyedState = (setStatusFunc, getModelQueueIndexFunc, disposeArmyStateDataFunc) => {
	return (): fsm_state<state> => {
		return {
			name: objectStateName.Destroyed,
			enterFunc: (state) => Promise.resolve(state),
			executeFunc: (state,
				[
					fromName,
					name,
				]
			) => {
				return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
					return NullableUtils.getWithDefault(
						NullableUtils.map(lodQueueIndex => {
							state = setStatusFunc(state, buildStatus(false, false, false), lodQueueIndex)

							// state = deferToBatchDisposeAllData(state, disposeArmyStateDataFunc, name, lodQueueIndex)
							return disposeAllData(state, disposeArmyStateDataFunc, name, lodQueueIndex)
						}, getModelQueueIndexFunc(state, name)),
						Promise.resolve(state)
					)
				})
			},
			exitFunc: (state: state) => Promise.resolve(state),
		}
	}
}

export let getRandomCollisionPartCanAttack = (state, usedGirl, name, weaponValue: weaponValue, bodyQueue, lodQueueIndex) => {
	let { emitterLife, emitterSpeed } = weaponValue

	return getRandomCollisionPartCanAttackUtils(state, usedGirl, name,
		bodyQueue.getWorldMatrix(lodQueueIndex),
		bodyQueue.getBox(lodQueueIndex),
		emitterLife, emitterSpeed)
}


export let emitMissiles = (state: state, getMissilesStartWorldPositionFunc, i: number,
	missileQueue, lodQueueIndex,
	targetPosition,
	name,
	[
		emitPrecision,
		emitterSpeed,
		emitterLife,
		emitterSize,
	]
) => {
	let [positionStart, positionEnd] = getMissilesStartWorldPositionFunc(missileQueue, lodQueueIndex, i)

	state = emitShellEmitOrExplode(state, positionStart.toArray(), explodeSize.Middle)

	return setAbstractState(state, ParticleManager.emitMissileVehicleMissile(getAbstractState(state), {
		fromName: name,
		camp: getCampExn(state, name),
		speed: emitterSpeed,
		life: emitterLife,
		size: emitterSize,
		position: positionEnd.toArray(),
		direction: getShootDirection(
			targetPosition.clone().sub(positionEnd).normalize(),
			emitPrecision
		).toArray(),
	}, getParticleNeedCollisionCheckLoopCount(state, emitterSpeed)))
}

export let getTargetBox = (state: state, name, targetPart: nullable<collisionPart>): nullable<Box3> => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(attackTarget_ => {
			switch (attackTarget_) {
				case attackTarget.Giantess:
					let usedGirl = getAttackTargetUsedGirl(state, name)

					if (!isUseGirl(state, usedGirl)
						|| NullableUtils.isNullable(targetPart)
					) {
						return NullableUtils.getEmpty()
					}

					return NullableUtils.return_(getCollisionPartOBB(state, usedGirl, NullableUtils.getExn(targetPart)).toBox3())
				case attackTarget.LittleMan:
					if (!isLittleCharacterType(state)) {
						return NullableUtils.getEmpty()
					}

					return NullableUtils.return_(LittleMan.getBox(state).clone())
				case attackTarget.Object:
				case attackTarget.Building:
					return NullableUtils.return_(getAttackTargetObjectDataExn(state, name).getBoxFunc(state).clone())
				case attackTarget.None:
					return NullableUtils.getEmpty()
			}

		}, getAttackTarget(state, name)),
		NullableUtils.getEmpty()
	)
}

export let getTargetPart = (state: state,
	getBodyQueueFunc,
	getWeaponValueFunc,
	name, lodQueueIndex) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(attackTarget_ => {
			switch (attackTarget_) {
				case attackTarget.Giantess:
					let usedGirl = getAttackTargetUsedGirl(state, name)

					if (!isUseGirl(state, usedGirl)) {
						return NullableUtils.getEmpty()
					}

					return NullableUtils.return_(getRandomCollisionPartCanAttack(state, usedGirl,
						name,
						getWeaponValueFunc(state), getBodyQueueFunc(state),
						lodQueueIndex))
				case attackTarget.LittleMan:
				case attackTarget.Object:
				case attackTarget.Building:
				case attackTarget.None:
					return NullableUtils.getEmpty()
				default:
					throw new Error("err")
			}

		}, getAttackTarget(state, name)),
		NullableUtils.getEmpty()
	)
}

export let getTargetDataForSoldier = (state, name, soldierPosition) => {
	return NullableUtils.getWithDefaultFunc(
		NullableUtils.map(attackTarget_ => {
			let targetPosition, targetPart

			switch (attackTarget_) {
				case attackTarget.Giantess:
					let usedGirl = getAttackTargetUsedGirl(state, name)

					if (!isUseGirl(state, usedGirl)) {
						targetPart = NullableUtils.getEmpty()
						targetPosition = NullableUtils.getEmpty()
					}
					else {
						targetPart = NullableUtils.return_(getNearestCollisionPart(state, usedGirl, soldierPosition))
						targetPosition = NullableUtils.return_(getGirlPositionParrelToArmy(state, usedGirl, soldierPosition.y, targetPart))
					}
					break
				case attackTarget.LittleMan:
					targetPart = NullableUtils.getEmpty()

					if (!isLittleCharacterType(state)) {
						targetPosition = NullableUtils.getEmpty()
					}
					else {
						targetPosition = NullableUtils.return_(getLittleManPositionParrelToArmy(state, soldierPosition.y, LittleManTransform.getWorldPosition(state)))
					}
					break
				case attackTarget.Object:
				case attackTarget.Building:
					targetPart = NullableUtils.getEmpty()

					targetPosition = NullableUtils.return_(_getPositionParrelTo(getAttackTargetObjectDataExn(state, name).getPositionFunc(state), soldierPosition.y))
					break
				default:
					throw new Error("err")
			}

			return [targetPosition, targetPart]
		}, getAttackTarget(state, name)),
		() => [NullableUtils.getEmpty(), NullableUtils.getEmpty()]
	)
}

export let getTargetPositionParrelToArmy = (state: state, name, armyPositionY, targetPart) => {
	let targetPosition
	switch (getAttackTargetExn(state, name)) {
		case attackTarget.Giantess:
			let usedGirl = getAttackTargetUsedGirl(state, name)

			targetPosition = getPositionParrelToObj(getCollisionPartCenter(state, usedGirl, targetPart), armyPositionY)
			break
		case attackTarget.LittleMan:
			targetPosition = getLittleManPositionParrelToArmy(state, armyPositionY, LittleManTransform.getWorldPosition(state))
			break
		case attackTarget.Object:
		case attackTarget.Building:
			targetPosition = _getPositionParrelTo(getAttackTargetObjectDataExn(state, name).getPositionFunc(state), armyPositionY)
			break
		default:
			throw new Error("err")
	}

	return targetPosition
}

let _handleSameCampForce = (
	state, fromName, camp_, force
) => {
	if (camp_ == getCampExn(state, fromName)) {
		return 0
	}

	return force
}

export let handleCollisionWithLittleMan = (state,
	removeParticleFunc,
	particle,
	forceDirection: Vector3,
	// pointPosition,
	damagePosition,
	name,
	fromName,
	[
		force, damageType, weaponType
	],
	weaponValue_,) => {
	state = removeParticleFunc(state, particle)

	if (isZeroForce(force)) {
		return Promise.resolve([state, []])
	}

	return DamageUtils.damageWithSingleData(state, [[force, forceDirection], [damageType, weaponType]],
		weaponValue_,
		fromName,
		// NullableUtils.return_(pointPosition),
		damagePosition,
		[
			NullableUtils.getEmpty(),
			NullableUtils.getEmpty(),
			name
			// ]).then(TupleUtils.getTuple2First)
		])
}



export let addLabel = (
	state, damageHp, box, damageType_, damagePosition, fromName, targetName,
) => {
	return DamageUtils.addLabel(state, damageHp, box,
		// DamageUtils.computeFontType(state, fromName, targetName, camp.Enemy, camp.Enemy, damageType_),
		DamageUtils.computeFontType(state, fromName, targetName, damageType_),
		damagePosition, targetName,
		2500,
		NullableUtils.return_(1.5),
	)
}

export let getAllArmyContainers = (state: state) => {
	return getAllModelQueues(state)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, Tank.buildTankCategoryName(), Tank.buildBodyLODQueueName(Tank.buildTankCategoryName()))]
		)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, MissileVehicle.buildMissileVehicleCategoryName(), MissileVehicle.buildBodyLODQueueName(MissileVehicle.buildMissileVehicleCategoryName()))]
		)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, buildFlameVehicleCategoryName(), buildBodyLODQueueNameFlameVehicle(buildFlameVehicleCategoryName()))]
		)
		.concat(
			[MilltaryBuilding.getModelQueueByQueueName(state, MissileTurret.buildMissileTurretCategoryName(), MissileTurret.buildBodyLODQueueName(MissileTurret.buildMissileTurretCategoryName()))]
		)
		.concat(
			[MilltaryBuilding.getModelQueueByQueueName(state, ShellTurret.buildShellTurretCategoryName(), ShellTurret.buildBodyLODQueueName(ShellTurret.buildShellTurretCategoryName()))]
		)

		.concat(
			getAllModelQueuesEliteGiantess(state)
		)
}


export let initWhenImportScene = (state: state) => {
	return setAllArmyContainers(state, getAllArmyContainers(state))
}

// export let checkCollisionWithArmy = (state: state, box: Box3, camp: camp): nullable<[Matrix4, Box3, name]> => {
// 	let allContainers = getAllArmyContainersArmy(state)
// 	let abstractState = getAbstractState(state)

// 	let data = [null, null, null]
// 	for (let container of allContainers) {
// 		if (!NullableUtils.isNullable(data[0])) {
// 			// return data
// 			break
// 		}

// 		data = container.queryByBoxAndCamp(abstractState, getCampExn, state, box, camp)
// 	}
// 	// let data = allContainers.reduce((data, container) => {
// 	// 	if (!NullableUtils.isNullable(data[0])) {
// 	// 		return data
// 	// 	}

// 	// 	return container.queryByBoxAndCamp(abstractState, getCampExn, state, box, camp)
// 	// }, [null, null, null])

// 	if (NullableUtils.isNullable(data[0])) {
// 		return NullableUtils.getEmpty()
// 	}

// 	return NullableUtils.return_([
// 		NullableUtils.getExn(data[0]),
// 		NullableUtils.getExn(data[1]),
// 		NullableUtils.getExn(data[2])
// 	])
// }
export const checkCollisionWithArmy = (
	state: state,
	box: THREE.Box3,
	camp: camp
): nullable<[THREE.Matrix4, THREE.Box3, name]> => {
	const allContainers = getAllArmyContainersArmy(state)
	const abstractState = getAbstractState(state);

	for (const container of allContainers) {
		const result = container.queryByBoxAndCamp(
			abstractState,
			getCampExn,
			state,
			box,
			camp
		);

		// 找到有效结果立即返回
		if (!NullableUtils.isNullable(result[0])) {
			return [
				result[0] as THREE.Matrix4,
				result[1] as THREE.Box3,
				result[2] as name
			];
		}
	}

	return NullableUtils.getEmpty(); // 未找到碰撞
};

export let checkRangeBoxCollisionWithArmy = (state: state, box: Box3, camp: camp): Array<[Matrix4, Box3, name]> => {
	const allContainers = getAllArmyContainersArmy(state)
	let abstractState = getAbstractState(state)

	return ArrayUtils.zip(...allContainers.reduce<any>(([transforms, boxes, names], container) => {
		return container.queryRangeByBoxAndCamp(abstractState, getCampExn, state, box, camp, transforms, boxes, names)
	}, [[], [], []]))
}

export let checkRangeRayCollisionWithArmy = (state: state, ray: Ray, camp: camp): Array<[Vector3, Matrix4, Box3, name]> => {
	let allContainers = getAllArmyContainersArmy(state)
	let abstractState = getAbstractState(state)

	return ArrayUtils.zip(...allContainers.reduce<any>(([hitPoints, transforms, boxes, names], container) => {
		return container.queryRangeByRayAndCamp(abstractState, getCampExn, state, ray, camp, hitPoints, transforms, boxes, names)
	}, [[], [], [], []]))
}

export let isCollisionWithLittleMan = (state: state, box: Box3) => {
	return LittleMan.getBox(state).intersectsBox(box)
}

let _getParticleDirection = (particle: any) => {
	return NullableUtils.getWithDefault(
		particle.direction,
		[1, 0, 0]
	)
}


export let handleCollision = (state: state,
	[
		handleHitStaticFunc,
		handleHitGirlFunc,
		handleHitArmyFunc,
		handleHitLittleManFunc,
	],
	targetPart: nullable<collisionPart>,
	box: Box3, position: Vector3,
	fromName,
	camp_,
	forceDirection: Vector3,
	isComputeAllCollision,
	weaponValue_: weaponValue,
	weaponName,
	damageType_: nullable<damageType> = NullableUtils.getEmpty()
) => {
	// let camp_ = getCampExn(state, fromName)

	// weaponValue_ = _updateWeaponValue(
	// 	state,
	// 	fromName,
	// 	weaponValue_,
	// 	weaponName,
	// )

	let { type } = weaponValue_
	// let [_damageType_, force] = computeForce(weaponValue_)
	let force = weaponValue_.force
	let _damageType_ = damageType.Normal

	damageType_ = NullableUtils.getWithDefault(
		damageType_,
		_damageType_
	)

	let damagePosition
	// if (isComputeAllCollision) {
	// 	damagePosition = NullableUtils.getEmpty()
	// }
	// else {
	damagePosition = NullableUtils.return_(position)
	// }

	// switch (camp_) {
	// 	case camp.LittleMan:
	// 		let data2 = NullableUtils.getEmpty<collisionPart>()
	// 		if (!NullableUtils.isNullable(targetPart) && getCollisionPartOBB(state, usedGirl,  NullableUtils.getExn(targetPart)).intersectsBox3(box)) {
	// 			data2 = targetPart
	// 		}

	// 		if (NullableUtils.isNullable(data2)) {
	// 			data2 = queryOBBShapeCollisionWithBox(state, box, position)
	// 		}

	// 		if (!NullableUtils.isNullable(data2)) {
	// 			return handleHitGirlFunc(
	// 				state, (state) => {
	// 					return DamageUtils.damageGiantess(state, [force, damageType_, type], NullableUtils.getExn(data2), NullableUtils.return_(position))
	// 				}, position.toArray()
	// 			)
	// 		}
	// 		break
	// 	case camp.Enemy:
	// 		if (isCollisionWithLittleMan(state, box)) {
	// 			return handleHitLittleManFunc(
	// 				state, (state) => {
	// 					return handleCollisionWithLittleMan(state,
	// 						(state, _) => state,
	// 						NullableUtils.getEmpty(),
	// 						forceDirection,
	// 						position,
	// 						[LittleMan.getName()],
	// 						fromName,
	// 						[force, damageType_, type])
	// 				}, position.toArray(),
	// 				box,
	// 				forceDirection
	// 			)
	// 		}
	// 		break
	// }

	let promise = Promise.resolve(state)


	if (!NullableUtils.isNullable(handleHitStaticFunc)) {
		let data1
		if (isComputeAllCollision) {
			data1 = checkParticleRangeCollisionWithStatic(state, box)
		}
		else {
			data1 = NullableUtils.getWithDefault(
				NullableUtils.map(
					d => [d],
					checkParticleCollisionWithStatic(state, box)
				),
				[]
			)
		}

		if (data1.length > 0) {
			promise = promise.then(
				state => {
					return NullableUtils.getExn(handleHitStaticFunc)(
						state, (state) => {
							return _handleCollisionWithStatic(state,
								forceDirection,
								damagePosition,
								data1,
								fromName,
								[force, damageType_, type], weaponValue_,
							)
						}, position.toArray(),
						box,
						forceDirection.toArray(),
						weaponValue_
					)
				}
			)

			if (!isComputeAllCollision) {
				return promise
			}
		}
	}


	if (isLittleCharacterType(state) && camp_ !== getCampExn(state, LittleMan.getName())
		&& !NullableUtils.isNullable(handleHitLittleManFunc)
	) {
		if (isCollisionWithLittleMan(state, box)) {
			promise = promise.then(state => {
				return NullableUtils.getExn(handleHitLittleManFunc)(
					state, (state) => {
						return handleCollisionWithLittleMan(state,
							(state, _) => state,
							NullableUtils.getEmpty(),
							forceDirection,
							damagePosition,
							[LittleMan.getName()],
							fromName,
							[force, damageType_, type],
							weaponValue_,)
					}, position.toArray(),
					box,
					forceDirection,
					weaponValue_,
				)
			})

			if (!isComputeAllCollision) {
				return promise
			}
		}
	}


	// if (isUseGirl(state, usedGirl) && camp_ !== getCampExn(state, getName())) {
	// 	let data2 = NullableUtils.getEmpty<collisionPart>()
	// 	if (!NullableUtils.isNullable(targetPart) && getCollisionPartOBB(state, usedGirl, NullableUtils.getExn(targetPart)).intersectsBox3(box)) {
	// 		data2 = targetPart
	// 	}

	// 	if (NullableUtils.isNullable(data2)) {
	// 		if (isZeroForce(force)) {
	// 			data2 = isCollisionWithGirlBox(state, box)
	// 		}
	// 		else {
	// 			data2 = queryOBBShapeCollisionWithBox(state, box, position)
	// 		}
	// 	}

	// 	if (!NullableUtils.isNullable(data2)
	// 		&&
	// 		!NullableUtils.isNullable(handleHitGirlFunc)
	// 	) {

	// 		promise = promise.then(state => {
	// 			return NullableUtils.getExn(handleHitGirlFunc)(
	// 				state, (state) => {
	// 					if (isZeroForce(force)) {
	// 						return Promise.resolve([state, []])
	// 					}

	// 					return DamageUtils.damageGiantess(state, [force, damageType_, type],
	// 						fromName,
	// 						NullableUtils.getExn(data2),
	// 						damagePosition,
	// 						weaponValue_).then(state => [state, []])
	// 				}, position.toArray(),
	// 				box,
	// 				[1, 0, 0],
	// 				weaponValue_,
	// 			)
	// 		})

	// 		if (!isComputeAllCollision) {
	// 			return promise
	// 		}
	// 	}
	// }
	promise = promise.then(state => {
		return ArrayUtils.reducePromise(getCurrentUsedGirls(state), ([state, isCollisioned]: [state, boolean], usedGirl) => {
			let promise = Promise.resolve([state, isCollisioned])

			if (!isComputeAllCollision && isCollisioned) {
				return promise
			}

			if (isUseGirl(state, usedGirl) && camp_ !== getCampExn(state, buildNameByUsedGirl(usedGirl))) {
				let data2 = NullableUtils.getEmpty<collisionPart>()
				if (!NullableUtils.isNullable(targetPart) && getCollisionPartOBB(state, usedGirl, NullableUtils.getExn(targetPart)).intersectsBox3(box)) {
					data2 = targetPart
				}

				if (NullableUtils.isNullable(data2)) {
					if (isZeroForce(force)) {
						data2 = isCollisionWithGirlBox(state, usedGirl, box)
					}
					else {
						data2 = queryOBBShapeCollisionWithBox(state, usedGirl, box, position)
					}
				}

				if (!NullableUtils.isNullable(data2)
					&&
					!NullableUtils.isNullable(handleHitGirlFunc)
				) {
					promise = NullableUtils.getExn(handleHitGirlFunc)(
						state, (state) => {
							if (isZeroForce(force)) {
								return Promise.resolve([state, []])
							}

							return DamageUtils.damageGiantess(state, usedGirl, [force, damageType_, type],
								fromName,
								NullableUtils.getExn(data2),
								damagePosition,
								weaponValue_).then(state => [state, []])
						}, usedGirl, position.toArray(),
						box,
						[1, 0, 0],
						weaponValue_,
					)
						.then(state => [state, true])
				}
			}

			return promise
		}, [state, false]).then(([state, isCollisioned]: [state, boolean]) => {
			return state
		})
	})



	if (!NullableUtils.isNullable(handleHitArmyFunc)) {
		let data3
		if (isComputeAllCollision) {
			data3 = checkRangeBoxCollisionWithArmy(state, box, camp_)
		}
		else {
			data3 = NullableUtils.getWithDefault(
				NullableUtils.map(
					d => [d],
					checkCollisionWithArmy(state, box, camp_)
				),
				[]
			)
		}

		if (!NullableUtils.isNullable(data3)) {
			promise = promise.then(state => {
				return NullableUtils.getExn(handleHitArmyFunc)(
					state,
					(state, _) => state,
					data3,
					box, camp_,

					NullableUtils.getEmpty(),
					fromName,
					forceDirection.toArray(),

					position.toArray(),
					damagePosition,
					[force, damageType_, type],
					weaponValue_,
				)
			})

			if (!isComputeAllCollision) {
				return promise
			}
		}
	}

	return promise
}

let _handleCollisionWithStatic = (state,
	direction,
	damagePosition,
	staticLODContainerIndices: Array<staticLODContainerIndex>,
	fromName,
	forceData, weaponValue_,
) => {
	if (isZeroForce(forceData[0])) {
		return Promise.resolve([state, []])
	}

	return ArrayUtils.reducePromise(staticLODContainerIndices, ([state, damageNames], staticLODContainerIndex) => {
		return handleCollisionWithEmitterCollisionableContainers(
			state, direction, damagePosition, staticLODContainerIndex,
			fromName,
			forceData,
			weaponValue_,
		).then((result) => {
			return [result[0],
			ArrayUtils.pushArrs(damageNames, result[1])
			]
		})
	}, [state, []])
}

let _handleCollisionWithEmitterCollisionableContainers = (state,
	removeParticleFunc,
	particle, pointPosition,
	// staticLODContainerIndex: staticLODContainerIndex,
	staticLODContainerIndices: Array<staticLODContainerIndex>,

	fromName,
	forceData, weaponValue_,
	// critRatioFactor, attackFactor,
) => {
	// ParticleManager.markParticleRemove(particle)
	state = removeParticleFunc(state, particle)

	return _handleCollisionWithStatic(state,
		_v1.fromArray(_getParticleDirection(particle)),
		pointPosition,
		staticLODContainerIndices,
		fromName,
		forceData, weaponValue_,
	)
}

let _handleCollisionWithGirl = (state,
	removeParticleFunc, usedGirl: usedGirl,
	// emitFunc,
	particle, collisionPart,
	//  pointPositionVec,
	damagePosition,
	// [force, damageType, weaponType]
	forceData,
	fromName,
	weaponValue_
) => {
	// Console.log(collisionPart)

	// let { force, weaponType } = getValue(state)

	// ParticleManager.markParticleRemove(particle)
	state = removeParticleFunc(state, particle)

	// state = emitFunc(state, pointPosition)

	if (isZeroForce(forceData[0])) {
		return Promise.resolve(state)
	}


	return DamageUtils.damageGiantess(state, usedGirl, forceData, fromName, collisionPart, damagePosition, weaponValue_)
	// return DamageUtils.damageWithMultipleData(state, [[force, _v1.fromArray(particle.direction)], [damageType, weaponType]],
	// 	particle.fromName,
	// 	NullableUtils.return_(pointPositionVec),
	// 	[
	// 		[],
	// 		[],
	// 		[]
	// 	]).then(TupleUtils.getTuple2First)
}

let _isHitTileOrGround = (collisionPointBox) => {
	return isUnderGround(collisionPointBox.getCenter(_v1))
}

// let _computeRayHitPoint = (ray: Ray, distance: number) => {
// 	return ray.at(distance, new Vector3())
// }

let _getRayAllCollisionData = (state: state,
	[
		handleHitStaticFunc,
		handleHitGirlFunc,
		handleHitArmyFunc,
		handleHitLittleManFunc,
	],
	// ray: Ray, particle): Array<[number, Vector3, nullable<staticLODContainerIndex>, nullable<lodQueueIndex>, boolean, nullable<collisionPart>]> => {
	ray: Ray, particle): Array<[number, Vector3, nullable<staticLODContainerIndex>, nullable<[Matrix4, Box3, name]>, boolean, nullable<[collisionPart, usedGirl]>]> => {
	let result = []

	if (!NullableUtils.isNullable(handleHitStaticFunc)) {
		// let [distance, index] = LOD.getOctreeForStaticLODContainer(getAbstractState(state)).queryByRay(getAbstractState(state), ray)

		// result = ArrayUtils.push(result, [distance, _computeRayHitPoint(ray, distance), index, NullableUtils.getEmpty(), false, NullableUtils.getEmpty()])

		// let [hitPoints, indices] = LOD.getOctreeForStaticLODContainer(getAbstractState(state)).queryRangeByRay(getAbstractState(state), ray)

		result = ArrayUtils.pushArrs(
			result,
			ArrayUtils.zip(
				...LOD.getOctreeForStaticLODContainer(getAbstractState(state)).queryRangeByRay(getAbstractState(state), ray)
			).map(([hitPoint, index]) => {
				return [hitPoint.distanceTo(ray.origin), hitPoint, NullableUtils.return_(index), , NullableUtils.getEmpty(), false, NullableUtils.getEmpty()]
			})
		)
	}

	let camp_ = particle.camp
	if (isLittleCharacterType(state)
		&& camp_ != getCampExn(state, LittleMan.getName())
		&& !NullableUtils.isNullable(handleHitLittleManFunc)
	) {
		NullableUtils.forEach((hitPoint) => {
			result = ArrayUtils.push(result, [hitPoint.distanceTo(ray.origin), hitPoint, NullableUtils.getEmpty(), NullableUtils.getEmpty(), true, NullableUtils.getEmpty()])
		}, ray.intersectBox(LittleMan.getBox(state), new Vector3()))
	}



	result = ArrayUtils.reduce(getCurrentUsedGirls(state), (result, usedGirl) => {
		if (isUseGirl(state, usedGirl)
			&& camp_ != getCampExn(state, buildNameByUsedGirl(usedGirl))
			&& !NullableUtils.isNullable(handleHitGirlFunc)) {
			result = ArrayUtils.pushArrs(result,
				queryAllOBBShapesCollisionWithRay(state, usedGirl, ray, true).map(([hitPoint, collisionPart]) => {
					return [hitPoint.distanceTo(ray.origin), hitPoint, NullableUtils.getEmpty(), NullableUtils.getEmpty(), false, NullableUtils.return_([collisionPart, usedGirl])]
				})
			)
		}

		return result
	}, result)





	if (!NullableUtils.isNullable(handleHitArmyFunc)) {
		result = ArrayUtils.pushArrs(result,
			checkRangeRayCollisionWithArmy(state, ray, camp_).map(([hitPoint, transform, box, name]) => {
				return [hitPoint.distanceTo(ray.origin), hitPoint, NullableUtils.getEmpty(), NullableUtils.return_([transform, box, name]), false, NullableUtils.getEmpty()]
			})
		)
	}

	return result
}


// let _getBulletStartPositionByName = (state: state, name: name) => {
// 	if (LittleMan.isLittleMan(name)) {
// 		return getBulletStartLocalPosition(state, LittleManTransform.getPosition(state))
// 	}

// 	if (isGirl(name)) {
// 		throw new Error("error")
// 	}

// 	return _getArmyBulletStartPositionByName(state, name)
// }

export let handleBulletCollision = (
	state: state, [
		handleHitStaticFunc,
		handleHitGirlFunc,
		handleHitArmyFunc,
		handleHitLittleManFunc,

		removeParticleFunc,
	],
	force,
	weaponType_: weaponType,
	damageType_: damageType,
	weaponValue_,

	bulletPositionVec,
	lastBulletPosition,

	particle,
): Promise<state> => {
	let isHitTileOrGround

	if (isUnderGround(bulletPositionVec)) {
		state = removeParticleFunc(state, particle)
		isHitTileOrGround = true
	}
	else {
		isHitTileOrGround = false
	}


	// if (NullableUtils.isNullable(lastBulletPosition)) {
	// 	return Promise.resolve(state)
	// }
	lastBulletPosition = NullableUtils.getWithDefault(
		lastBulletPosition,
		// _getBulletStartPositionByName(state, particle.fromName).toArray()
		particle.fromPosition,
	)

	// lastBulletPosition = NullableUtils.getExn(lastBulletPosition)
	let lastBulletPositionVec = new Vector3().fromArray(lastBulletPosition)

	if (lastBulletPositionVec.equals(bulletPositionVec)) {
		return Promise.resolve(state)
	}

	let ray = new Ray(lastBulletPositionVec, bulletPositionVec.clone().sub(lastBulletPositionVec).normalize())

	let rayDistance = bulletPositionVec.distanceTo(lastBulletPositionVec)

	let camp_ = particle.camp

	return NullableUtils.getWithDefaultFunc(
		NullableUtils.map(([distance, hitPoint, staticLODContainerIndex, lodQueueData, isHitLittleMan, girlData]) => {
			if (distance > rayDistance) {
				return Promise.resolve(state)
			}

			if (!NullableUtils.isNullable(staticLODContainerIndex)) {
				return NullableUtils.getExn(handleHitStaticFunc)(
					state, (state) => {
						return _handleCollisionWithEmitterCollisionableContainers(state,
							removeParticleFunc,
							particle,
							hitPoint,

							[NullableUtils.getExn(staticLODContainerIndex)],

							particle.fromName,
							[force, damageType_, weaponType_],
							weaponValue_,
						)
					},
					// hitPoint,
					hitPoint.toArray(),
					NullableUtils.getEmpty(),
					_getParticleDirection(particle),
					weaponValue_
				)
			}

			if (!NullableUtils.isNullable(lodQueueData)) {
				return NullableUtils.getExn(handleHitArmyFunc)(
					state,
					removeParticleFunc,
					[NullableUtils.getExn(lodQueueData)],
					// originPointBox, 
					NullableUtils.getEmpty(),
					camp_,

					NullableUtils.return_(particle),
					particle.fromName,
					_getParticleDirection(particle),

					// _v1.fromArray(particle.direction),
					// pointPosition,
					// damagePosition,
					// hitPoint,
					hitPoint.toArray(),
					hitPoint,
					// particle.fromName,
					[force, damageType_, weaponType_],
					weaponValue_,
				)
			}

			if (isHitLittleMan) {
				if (particle.fromName == LittleMan.getName()) {
					return Promise.resolve(state)
				}

				return handleHitLittleManFunc(
					state, (state) => {
						return handleCollisionWithLittleMan(state,
							removeParticleFunc,
							particle,
							_v1.fromArray(_getParticleDirection(particle)),
							hitPoint,
							[LittleMan.getName()],
							particle.fromName,
							[force, damageType_, weaponType_],
							weaponValue_,)
					},
					// hitPoint,
					hitPoint.toArray(),
					NullableUtils.getEmpty(),
					_getParticleDirection(particle)
				)
			}

			// return ArrayUtils.reducePromise(getCurrentUsedGirls(state), (state, usedGirl) => {
			// 	let newForce = _handleSameCampForce(state, buildNameByUsedGirl(usedGirl), camp_, force)

			// 	return handleHitGirlFunc(
			// 		state, (state) => {
			// 			return _handleCollisionWithGirl(state,
			// 				removeParticleFunc, usedGirl,
			// 				particle,
			// 				NullableUtils.getExn(collisionPart_),

			// 				hitPoint,
			// 				[newForce, damageType_, weaponType_],
			// 				particle.fromName,
			// 				weaponValue_
			// 			).then(state => [state, []])
			// 		},
			// 		usedGirl,
			// 		// hitPoint,
			// 		hitPoint.toArray(),
			// 		NullableUtils.getEmpty(),
			// 		_getParticleDirection(particle),
			// 		weaponValue_
			// 	)
			// }, state)
			if (NullableUtils.isNullable(girlData)) {
				return Promise.resolve(state)
			}

			let [collisionPart_, usedGirl] = NullableUtils.getExn(girlData)

			let newForce = _handleSameCampForce(state, buildNameByUsedGirl(usedGirl), camp_, force)

			return handleHitGirlFunc(
				state, (state) => {
					return _handleCollisionWithGirl(state,
						removeParticleFunc, usedGirl,
						particle,
						NullableUtils.getExn(collisionPart_),

						hitPoint,
						[newForce, damageType_, weaponType_],
						particle.fromName,
						weaponValue_
					).then(state => [state, []])
				},
				usedGirl,
				// hitPoint,
				hitPoint.toArray(),
				NullableUtils.getEmpty(),
				_getParticleDirection(particle),
				weaponValue_
			)

		}, ArrayUtils.get(
			_getRayAllCollisionData(state,
				[
					handleHitStaticFunc,
					handleHitGirlFunc,
					handleHitArmyFunc,
					handleHitLittleManFunc,
				],
				ray, particle).sort((a, b) => {
					return a[0] - b[0]
				}),
			0
		)),
		() => {
			if (isHitTileOrGround) {
				return NullableUtils.getWithDefault(
					NullableUtils.bind(hitPoint => {
						return NullableUtils.map(handleHitStaticFunc => {
							return handleHitStaticFunc(
								state, (state) => {
									return Promise.resolve([state, []])
								},
								hitPoint.toArray(),
								NullableUtils.getEmpty(),
								_getParticleDirection(particle),
								weaponValue_
							)
						}, handleHitStaticFunc)
					}, ray.intersectBox(
						buildCollisionBox(),
						new Vector3()
					)),
					Promise.resolve(state)
				)
			}

			return Promise.resolve(state)
		}
	)
}

export let handleAllCollisions = (
	state: state, [

		// emitFunc,

		handleHitStaticFunc,
		handleHitGirlFunc,
		handleHitArmyFunc,
		handleHitLittleManFunc,

		// getAllParticlesForCollisionCheckFunc,

		// getPointBoxFunc,
		removeParticleFunc,
	],
	force,
	weaponType_: weaponType,
	damageType_: damageType,
	weaponValue_,
	weaponName,
	collisionPointBox,
	originPointBox,
	pointPosition,
	pointPositionVec,
	particle,
	isComputeAllCollision: boolean,
	isHandleCollision: boolean,
): Promise<[state, boolean]> => {
	let promise = Promise.resolve(state)
	let isCollisioned = false


	// weaponValue_ = _updateWeaponValue(
	// 	state,
	// 	particle.fromName,
	// 	weaponValue_,
	// 	weaponName,
	// )

	let damagePosition
	// if (isComputeAllCollision) {
	// 	damagePosition = NullableUtils.getEmpty()
	// }
	// else {
	damagePosition = NullableUtils.return_(pointPositionVec)
	// }

	if (!isComputeAllCollision && _isHitTileOrGround(collisionPointBox)) {
		state = removeParticleFunc(state, particle)

		return NullableUtils.getWithDefault(
			NullableUtils.map(handleHitStaticFunc => {
				return handleHitStaticFunc(
					state, (state) => {
						// return Promise.resolve([state, true])
						return Promise.resolve([state, []])
					}, pointPosition,
					originPointBox,
					_getParticleDirection(particle),
					weaponValue_
				).then(state => [state, true])
			}, handleHitStaticFunc),
			Promise.resolve([state, true])
		)
	}

	if (!NullableUtils.isNullable(handleHitStaticFunc)) {
		let data1
		if (isComputeAllCollision) {
			data1 = checkParticleRangeCollisionWithStatic(state, collisionPointBox)
		}
		else {
			data1 = NullableUtils.getWithDefault(
				NullableUtils.map(
					d => [d],
					checkParticleCollisionWithStatic(state, collisionPointBox)
				),
				[]
			)
		}

		if (data1.length > 0) {
			isCollisioned = true
			if (isHandleCollision) {
				promise = promise.then(
					state => {
						return NullableUtils.getExn(handleHitStaticFunc)(
							state, (state) => {
								return _handleCollisionWithEmitterCollisionableContainers(state,
									removeParticleFunc,
									// emitFunc,
									particle,
									//  pointPositionVec,
									damagePosition,

									// NullableUtils.getExn(data1),
									data1,


									particle.fromName,
									[force, damageType_, weaponType_],
									weaponValue_,
									// critRatioFactor,
									// attackFactor,
								)
							}, pointPosition,
							originPointBox,
							_getParticleDirection(particle),
							weaponValue_
						)
					}
				)
			}
			if (!isComputeAllCollision) {
				return promise.then(state => [state, isCollisioned])
			}
		}
	}

	let data2
	let camp_ = particle.camp
	if (isLittleCharacterType(state)
		// && isCollisionWithLittleMan(state, collisionPointBox)
		&& camp_ != getCampExn(state, LittleMan.getName())
		&& !NullableUtils.isNullable(handleHitLittleManFunc)
	) {
		if (isComputeAllCollision) {
			isCollisioned = isCollisionWithLittleMan(state, collisionPointBox)
		}
		else {
			isCollisioned = isCollisionWithLittleMan(state, originPointBox)
		}

		if (isCollisioned) {
			// let newForce = _handleSameCampForce(state, LittleMan.getName(), camp_, force)

			// isCollisioned = true
			if (isHandleCollision && particle.fromName != LittleMan.getName()) {
				promise = promise.then(state => {
					return handleHitLittleManFunc(
						state, (state) => {
							return handleCollisionWithLittleMan(state,
								removeParticleFunc,
								particle,
								_v1.fromArray(_getParticleDirection(particle)),
								// pointPositionVec,
								damagePosition,
								[LittleMan.getName()],
								particle.fromName,
								[force, damageType_, weaponType_],
								weaponValue_,)
						}, pointPosition,
						originPointBox,
						_getParticleDirection(particle),
						weaponValue_,
					)
				})
			}
			if (!isComputeAllCollision) {
				// return promise
				return promise.then(state => [state, isCollisioned])
			}
		}
	}



	promise = promise.then(state => {
		return ArrayUtils.reducePromise(getCurrentUsedGirls(state), ([state, isCollisionedGirl]: [state, boolean], usedGirl) => {
			let promise = Promise.resolve([state, isCollisionedGirl])

			if (!isComputeAllCollision && isCollisionedGirl) {
				return promise
			}

			if (isUseGirl(state, usedGirl)) {
				if (force == forceSize.RewardForce) {
					if (!isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
						// return promise.then(state => [state, isCollisioned])
						return promise
					}

					data2 = isCollisionWithGirlBox(state, usedGirl, originPointBox)
				}
				else {
					if (isZeroForce(force)) {
						data2 = isCollisionWithGirlBox(state, usedGirl, originPointBox)
					}
					else {
						if (isComputeAllCollision) {
							data2 = queryOBBShapeCollisionWithBox(state, usedGirl, collisionPointBox, pointPositionVec)
						}
						else {
							data2 = queryOBBShapeCollisionWithBox(state, usedGirl, originPointBox, pointPositionVec)
						}
					}
				}

				let newForce = _handleSameCampForce(state, buildNameByUsedGirl(usedGirl), camp_, force)

				if (!NullableUtils.isNullable(data2)) {
					isCollisioned = true
					if (isHandleCollision) {
						promise = handleHitGirlFunc(
							state, (state) => {
								return _handleCollisionWithGirl(state,
									removeParticleFunc, usedGirl,
									particle, NullableUtils.getExn(data2),

									// pointPositionVec,
									damagePosition,
									[newForce, damageType_, weaponType_],
									particle.fromName,
									weaponValue_
								).then(state => [state, []])
							}, usedGirl, pointPosition,
							originPointBox,
							_getParticleDirection(particle),
							weaponValue_,
						)
							.then(state => [state, true])
					}
					// if (!isComputeAllCollision) {
					// 	// return promise
					// 	return promise.then(state => [state, isCollisioned])
					// }
				}
			}

			return promise
		}, [state, false]).then(([state, isCollisioned]: [state, boolean]) => {
			return state
		})
	})



	// switch (camp_) {
	// 	case camp.LittleMan:
	// 		// data2 = queryOBBShapeCollisionWithBox(state, collisionPointBox, pointPositionVec)
	// 		data2 = queryOBBShapeCollisionWithBox(state, originPointBox, pointPositionVec)

	// 		if (!NullableUtils.isNullable(data2)) {
	// 			isCollisioned = true
	// 			if (isHandleCollision) {
	// 				promise = promise.then(state => {
	// 					return handleHitGirlFunc(
	// 						state, (state) => {
	// 							return _handleCollisionWithGirl(state,
	// 								removeParticleFunc,
	// 								particle, NullableUtils.getExn(data2), pointPositionVec, [force, damageType_, weaponType_])
	// 						}, pointPosition,
	// 						originPointBox,
	// 						particle.direction
	// 					)
	// 				})
	// 			}
	// 			if (!isComputeAllCollision) {
	// 				// return promise
	// 				return promise.then(state => [state, isCollisioned])
	// 			}
	// 		}
	// 		break
	// 	case camp.Enemy:
	// 		// data2 = queryOBBShapeCollisionWithBox(state, collisionPointBox, pointPositionVec)
	// 		data2 = queryOBBShapeCollisionWithBox(state, originPointBox, pointPositionVec)

	// 		if (!NullableUtils.isNullable(data2)) {
	// 			isCollisioned = true
	// 			if (isHandleCollision) {
	// 				promise = promise.then(state => {
	// 					return handleHitGirlFunc(
	// 						state, (state) => {
	// 							return _handleCollisionWithGirl(state,
	// 								removeParticleFunc,
	// 								// particle, NullableUtils.getExn(data2), pointPositionVec, [0, damageType_, weaponType_])
	// 								particle, NullableUtils.getExn(data2), pointPositionVec, [force, damageType_, weaponType_])
	// 						}, pointPosition,
	// 						originPointBox,
	// 						particle.direction
	// 					)
	// 				})
	// 			}
	// 			if (!isComputeAllCollision) {
	// 				// return promise
	// 				return promise.then(state => [state, isCollisioned])
	// 			}
	// 		}

	// 		if (isCollisionWithLittleMan(state, collisionPointBox)) {
	// 			isCollisioned = true
	// 			if (isHandleCollision) {
	// 				promise = promise.then(state => {
	// 					return handleHitLittleManFunc(
	// 						state, (state) => {
	// 							return handleCollisionWithLittleMan(state,
	// 								removeParticleFunc,
	// 								particle,
	// 								_v1.fromArray(particle.direction),
	// 								pointPositionVec,
	// 								[LittleMan.getName()],
	// 								particle.fromName,
	// 								[force, damageType_, weaponType_])
	// 						}, pointPosition,
	// 						originPointBox,
	// 						particle.direction
	// 					)
	// 				})
	// 			}
	// 			if (!isComputeAllCollision) {
	// 				// return promise
	// 				return promise.then(state => [state, isCollisioned])
	// 			}
	// 		}
	// 		break
	// }

	// if (!NullableUtils.isNullable(handleHitArmyFunc)) {
	// 	let data3 = checkCollisionWithArmy(state, pointBox, camp_)

	// 	if (!NullableUtils.isNullable(data3)) {
	// 		return NullableUtils.getExn(handleHitArmyFunc)(
	// 			state, (state) => {
	// 				return handleCollisionWithArmy(state,
	// 					removeParticleFunc,
	// 					particle,
	// 					_v1.fromArray(particle.direction),
	// 					pointPosition,
	// 					NullableUtils.getExn(data3),
	// 					particle.fromName,
	// 					[force, damageType.Normal, weaponType_])
	// 			}, pointPosition,
	// 			pointBox,
	// 			particle.direction
	// 		)
	// 	}
	// }
	if (!NullableUtils.isNullable(handleHitArmyFunc)) {
		let data3
		if (isComputeAllCollision) {
			data3 = checkRangeBoxCollisionWithArmy(state, collisionPointBox, camp_)
		}
		else {
			data3 = NullableUtils.getWithDefault(
				NullableUtils.map(
					d => [d],
					checkCollisionWithArmy(state, collisionPointBox, camp_)
				),
				[]
			)
		}

		if (data3.length > 0) {
			isCollisioned = true
			if (isHandleCollision) {
				promise = promise.then(state => {
					return NullableUtils.getExn(handleHitArmyFunc)(
						state,
						removeParticleFunc,
						data3,
						originPointBox, camp_,

						NullableUtils.return_(particle),
						particle.fromName,
						_getParticleDirection(particle),

						// _v1.fromArray(particle.direction),
						pointPosition,
						damagePosition,
						// particle.fromName,
						[force, damageType_, weaponType_],
						weaponValue_,
					)
				})
			}
		}


		if (!isComputeAllCollision) {
			// return promise
			return promise.then(state => [state, isCollisioned])
		}
	}

	return promise.then(state => [state, isCollisioned])
}

export let getCrowdDataUtils = (state: state, crowdPositions): Array<Vector3> => {
	if (crowdPositions.length == 0) {
		return [
			LittleManTransform.getWorldPosition(state)
		]
	}

	return crowdPositions
}

export let buildFakeBulletParticle = (direction: [number, number, number], fromName: string, camp): bulletParticle => {
	return {
		fromName,
		direction,
		camp
	} as any
}

export let handleDestroying = (state, [fromName, position, name]) => {
	// return generateReward(state, fromName, name, position)

	return state
}

export let handleDestroyed = (state, handleDestroyedFunc, fromName, name, position) => {
	state = generateReward(state, fromName, buildArmyRewardKey(state, name), name, position, _v1.set(position.x, getPositionY(state, getGetPositionYFuncDefaultKey(), position.x, position.z), position.z), 2)

	return handleDestroyedFunc(state, name, position)
}

export let parseNamePrefix = (state: state, name: name) => {
	if (isInfantryUtils(name)) {
		return getNamePrefixInfantry()
	}
	if (isMeleeUtils(name)) {
		return getNamePrefixMelee()
	}
	if (isCommanderUtils(name)) {
		return getNamePrefixCommander()
	}
	if (isRocketeerUtils(name)) {
		return getNamePrefixRocketeer()
	}
	if (isLasererUtils(name)) {
		return getNamePrefixLaserer()
	}

	if (isTankUtils(name)) {
		return getNamePrefixTank()
	}
	if (isFlameVehicleUtils(name)) {
		return getNamePrefixFlameVehicle()
	}
	if (isMissileVehicleUtils(name)) {
		return getNamePrefixMissileVehicle()
	}

	if (isShellTurretUtils(name)) {
		return getNamePrefixShellTurret()
	}
	if (isMissileTurretUtils(name)) {
		return getNamePrefixMissileTurret()
	}

	// if (isMeleeGiantessUtils(name)) {
	// 	return getNamePrefixEliteGiantess()
	// }
	let result = parseNamePrefixEliteGiantess(state, name)
	if (result !== false) {
		return result
	}



	if (isBuildings(name)) {
		return getNamePrefixBuilding()
	}
	if (isCars(name)) {
		return getNamePrefixCar()
	}



	throw new Error("err")
}

export let isArmyExceptEliteGiantess = (name: name) => {
	return isSoldier(name) || isMilltaryVehicle(name) || isMilltaryBuilding(name)
}

export let isArmy = (state, name: name) => {
	return isArmyExceptEliteGiantess(name) || isEliteGiantess(state, name)
}

export let isCreature = (state, name: name) => {
	return isSoldier(name) || isEliteGiantess(state, name)
}


// export let handleHeadShot = (forceData, damagePosition, fromName, weaponValue_, box) => {
// 	if (!NullableUtils.isNullable(damagePosition) && LittleMan.isLittleMan(fromName) && isRemoteWeapon(weaponValue_.meleeRange)) {
// 		damagePosition = NullableUtils.getExn(damagePosition)

// 		// let box = boxes[0]
// 		let height = box.getSize(_v1).y

// 		if (damagePosition.y >= box.getCenter(_v1).y + height / 4) {
// 			let [[size, direction], [damageType_, weaponType_]] = forceData

// 			// let damageType_ = damageType.Weakness
// 			// let size *= 3

// 			forceData = [[size * 3, direction], [damageType.Weakness, weaponType_]]
// 		}
// 	}

// 	return forceData
// }

export let handleHeadShot = (state, [forceSize, damageType_], damagePosition, fromName, targetName, weaponValue_, box, stateMachine): [forceSize, damageType] => {
	if (
		damageType_ != damageType.Range
		&& !NullableUtils.isNullable(damagePosition)
		&& LittleMan.isLittleMan(fromName)
		&&
		(
			isSoldier(targetName)
			|| isEliteGiantess(state, targetName)
		)
		&& isRemoteWeapon(weaponValue_.meleeRange)
		&& !(
			StateMachine.isState(stateMachine, objectStateName.Lie)
			// || StateMachine.isState(stateMachine, objectStateName.Standup)
		)
	) {
		damagePosition = NullableUtils.getExn(damagePosition)

		// let box = boxes[0]
		let height = box.getSize(_v1).y

		if (damagePosition.y >= box.getCenter(_v1).y + height / 4) {
			// let [[size, direction], [damageType_, weaponType_]] = forceData

			damageType_ = damageType.Weakness
			forceSize *= 3

			// forceData = [[size * 3, direction], [damageType.Weakness, weaponType_]]
		}
	}

	return [forceSize, damageType_]
}

export let getAllAliveArmyData = (state: state, camp_ = camp.None): [any, any, any, any] => {
	let filterFunc
	if (camp_ == camp.None) {
		filterFunc = (_) => true
	}
	else {
		filterFunc = (data: visibleData) => getCampExn(state, data.name) == camp_
	}

	return [
		getAllAliveSoldierData(state).filter(filterFunc),
		getAllAliveMilltaryVehicleData(state).filter(filterFunc),
		getAllAliveMilltaryBuildingData(state).filter(filterFunc),
		getAllAliveEliteGiantessData(state).filter(filterFunc),
	]
}


export let getAllFlattenAliveArmyData = (state: state, camp_ = camp.None): Array<visibleData> => {
	return ArrayUtils.flatten(getAllAliveArmyData(state, camp_))
}

export let getAllAliveArmyCount = (state: state) => {
	return getAllFlattenAliveArmyData(state).length
}

export let getAllAliveArmyCountExceptCamp = (state: state, camp_) => {
	return getAllFlattenAliveArmyData(state).filter(data => {
		return getCampWithDefault(state, data.name, camp_) != camp_
	}).length
}


export let getAllAliveArmyExceptEliteGiantessCount = (state: state, camp_) => {
	return ArrayUtils.flatten([
		getAllAliveSoldierData(state),
		getAllAliveMilltaryVehicleData(state),
		getAllAliveMilltaryBuildingData(state),
	]).filter(data => {
		return getCampWithDefault(state, data.name, camp_) != camp_
	}).length
}

export let getAllAliveEliteGiantessCount = (state: state, camp_) => {
	return getAllAliveEliteGiantessData(state).filter(data => {
		return getCampWithDefault(state, data.name, camp_) != camp_
	}).length
}

export let emitAllMissiles = (state: state,
	[getMissilesStartWorldPositionFunc, onCompleteFunc],
	queue, lodQueueIndex,
	count, soundResourceId, volumn,
	name,
	targetPosition,
	[
		emitPrecision,
		emitterSpeed,
		emitterLife,
		emitterSize,
	]
) => {
	return ArrayUtils.range(0, count - 1).reduce((state, i) => {
		state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
			state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), volumn)
			))

			state = emitMissiles(state, getMissilesStartWorldPositionFunc, i,
				queue, lodQueueIndex,
				targetPosition,
				name,
				[
					emitPrecision,
					emitterSpeed,
					emitterLife,
					emitterSize,
				]
			)

			if (i == count - 1) {
				return onCompleteFunc(state)

				// state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
				// 	return onCompleteFunc(state)
				// 	// LOD.setStatusForLODQueue(getAbstractState(state), missileName, buildStatus(false, false, true))

				// 	// return MilltaryVehicle.fire(state,
				// 	// 	[
				// 	// 		_buildRoughFireRay,
				// 	// 		_rotateTowardsTarget,
				// 	// 		_fireMissiles,
				// 	// 		getMissileVehicleBodyQueue,
				// 	// 		MissileRack.getValue
				// 	// 	],
				// 	// 	name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)
				// }, 50, name))
			}

			return Promise.resolve(state)
		}, 0.5 * i, name))

		return state
	}, state)
}


export let computeAttackFrames = (state, name, emitSpeed) => {
	return Math.round(emitSpeed * getEmitSpeedFactor(state, name))
}

export let computeRemainAttackFrames = (state, name, emitSpeed) => {
	return computeAttackFrames(state, name, emitSpeed) - (Flow.getFrameIndex(getAbstractState(state)) - getLastAttackFrame(state, name))
}

export let isCanNotAttackByCD = (remainAttackFrames) => {
	// return Flow.getFrameIndex(getAbstractState(state)) - getLastAttackFrame(state, name) >= computeAttackFrames(state, name, emitSpeed)
	return remainAttackFrames > 0
}

export let handleCanNotAttackForMilltaryMachine = (state: state, [
	buildRoughFireRayFunc,
	rotateTowardsTargetFunc,
	fireShellFunc,
	getBodyQueueFunc,
	getWeaponValueFunc,
	fireFunc,
], name, allModelQueues, lODQueueIndex, isNotRotateTowardsTarget): [state, boolean] => {
	let { emitSpeed } = getWeaponValueFunc(state)
	let remainAttackFrames = computeRemainAttackFrames(state, name, emitSpeed)
	if (isCanNotAttackByCD(remainAttackFrames)) {
		return [setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
			return fireFunc(state,
				[
					buildRoughFireRayFunc,
					rotateTowardsTargetFunc,
					fireShellFunc,
					getBodyQueueFunc,
					getWeaponValueFunc
				],
				name, allModelQueues, lODQueueIndex,
				getTargetPart(state,
					getBodyQueueFunc,
					getWeaponValueFunc,
					name, lODQueueIndex),
				isNotRotateTowardsTarget
			)
		}, emitSpeed, name)), true]
	}

	return [state, false]
}

// export let setInstanceColor = (state: state, computeNewColorFunc, name: name) => {
// 	let queue = LOD.getLODQueue(getAbstractState(state), name)

// 	// let allQueues
// 	// if ((queue as HierachyLODQueue).isHierachyLODQueue) {
// 	// 	allQueues = ArrayUtils.pushArrs([queue], (queue as HierachyLODQueue).getAllChildren())
// 	// }
// 	// else {
// 	// 	allQueues = [queue]
// 	// }


// 	// let mainQueue = allQueues[0]
// 	let lodQueueIndex = queue.getIndex(name)
// 	// let newColor = computeNewColorFunc(mainQueue.colors[lodQueueIndex])

// 	// allQueues.forEach(queue => {
// 	// 	queue.colors[lodQueueIndex].fromArray(newColor)
// 	// })
// 	queue.setColor(queue, lodQueueIndex, computeNewColorFunc(queue.getColor(lodQueueIndex)))

// 	return state
// }

export let setInstanceColor = (state: state, name: name, newColorArr: [number, number, number], value: number) => {
	let queue = LOD.getLODQueue(getAbstractState(state), name)
	let lodQueueIndex = queue.getIndex(name)

	let { r, g, b } = queue.getColor(lodQueueIndex)

	let factor
	if (isEliteGiantess(state, name)) {
		factor = 1
	}
	else {
		factor = 15
	}
	newColorArr = computeColor(newColorArr, state, value, factor)

	queue.setColor(queue, lodQueueIndex, [r + newColorArr[0], g + newColorArr[1], b + newColorArr[2]])
	// // queue.setColor(queue, lodQueueIndex, [0,0,3])
	// // queue.setColor(queue, lodQueueIndex, [1,1,30])
	// queue.setColor(queue, lodQueueIndex, [1,1,20])

	return state
}

export let getFsmStateData = (state: state, name: name): nullable<any> => {
	let setStateMachineFunc, stateMachine
	if (isSoldier(name)) {
		setStateMachineFunc = setStateMachine
		stateMachine = getStateMachine(state, name)
	}
	else if (isMilltaryVehicle(name)) {
		setStateMachineFunc = MilltaryVehicle.setStateMachine
		stateMachine = MilltaryVehicle.getStateMachine(state, name)
	}
	else if (isMilltaryBuilding(name)) {
		setStateMachineFunc = MilltaryBuilding.setStateMachine
		stateMachine = MilltaryBuilding.getStateMachine(state, name)
	}
	else if (isEliteGiantess(state, name)) {
		setStateMachineFunc = setStateMachineEliteGiantess
		stateMachine = getStateMachineEliteGiantess(state, name)
	}
	else {
		// throw new Error("err")
		return NullableUtils.getEmpty()
	}

	return NullableUtils.return_([setStateMachineFunc, stateMachine])
}


export let changeFsmStateIfAlive = (state: state, filterFSMStateFunc, name: name, fsmState) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(([setStateMachineFunc, stateMachine]) => {
			if (isDestoryRelatedStates(stateMachine) || filterFSMStateFunc(stateMachine)) {
				return Promise.resolve(state)
			}

			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, fsmState, name, name)
		}, getFsmStateData(state, name)),
		Promise.resolve(state)
	)
}

// export let setPositionByTransform = (transform: Matrix4, position: Vector3) => {
// 	return TransformUtils.setPositionToMatrix4(transform, position)
// }

export let updatePosition = (lodQueue: LODQueue, lodQueueIndex: lodQueueIndex, position: Vector3) => {
	// return TransformUtils.setPositionToMatrix4(transform, position)
	lodQueue.updatePosition(lodQueueIndex, position, true)
}

let _updatePosition = (queue, name, targetPosition) => {
	NullableUtils.forEach(
		queue => {
			let index = NullableUtils.getExn(queue.getIndex(name))

			updatePosition(queue, index, targetPosition)
		},
		queue
	)
}

// export let stopAndRemoveMoveDataAndTween = (state: state, name: name): state => {
// 	if (isSoldier(name)) {
// 		return stopAndRemoveMoveDataAndTweenSoldier(state, name)
// 	}

// 	if (isMilltaryVehicle(name)) {
// 		return MilltaryVehicle.stopAndRemoveMoveDataAndTweenMilltaryVehicle(state, name)
// 	}

// 	if (isEliteGiantess(state, name)) {
// 		return stopAndRemoveMoveDataAndTweenEliteGiantess(state, name)
// 	}

// 	return state
// }

export let updatePositionByName = (state: state, name: name, targetPosition) => {
	_updatePosition(LOD.getLODQueueNullable(getAbstractState(state), name), name, targetPosition)

	if (isSoldier(name)) {
		let shadowName = buildNameInShadowQueue(name)

		_updatePosition(LOD.getLODQueueNullable(getAbstractState(state), shadowName), shadowName, targetPosition)
	}

	// state = stopAndRemoveMoveDataAndTween(state, name)

	return changeFsmStateIfAlive(state, stateMachine => !isMoveState(stateMachine), name, createInitialState(state, name))
}

export let getPositionByName = (state: state, name: name) => {
	let queue = LOD.getLODQueue(getAbstractState(state), name)

	let index = NullableUtils.getExn(queue.getIndex(name))

	return TransformUtils.getPositionFromMatrix4(queue.getTransform(index))
}

// let _getArmyBulletStartPositionByName = (state: state, name: name) => {
// 	let queue = LOD.getLODQueue(getAbstractState(state), name)

// 	let index = NullableUtils.getExn(queue.getIndex(name))

// 	return queue.getBox(index).getCenter(new Vector3())
// }

export let getInitialQuaternion = (state: state, name: name) => {
	let modelName = getModelName(state, name)

	if (isSoldier(name)) {
		return getInitialQuaternionSoldier(state, modelName)
	}

	if (isMilltaryVehicle(name)) {
		return MilltaryVehicle.getInitialQuaternion(state, modelName)
	}

	if (isMilltaryBuilding(name)) {
		return MilltaryBuilding.getInitialQuaternion(state, modelName)
	}

	if (isEliteGiantess(state, name)) {
		return getInitialQuaternionEliteGiantess(state, modelName)
	}

	throw new Error("err")
}

let _getFaceDirection = (state, transform: Matrix4, name, v = new Vector3()) => {
	return getFaceDirection(
		TransformUtils.getRotationQuaternionFromMatrix4(
			transform,
			_q
		).multiply(
			_q2.copy(getInitialQuaternion(state, name)).invert()
		),
		v
	)
}

export let isBack = (state: state, name: name, damagePosition) => {
	let queue = LOD.getLODQueue(getAbstractState(state), name)

	let index = NullableUtils.getExn(queue.getIndex(name))

	let transform = queue.getTransform(index)

	let faceDirection = _getFaceDirection(state, transform, name, _v1)

	return TransformUtils.isBack(
		faceDirection,
		damagePosition,
		TransformUtils.getPositionFromMatrix4(
			transform,
			_v2
		)
	)
}

export let hasNoEnemy = (state: state) => {
	return !hasLevelGiantessExceptPlayer(state) && !hasCurrentUsedGirl(state, usedGirlEnum.BossGiantess) && getAllAliveArmyCount(state) == 0
}