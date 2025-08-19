import { Box3, Euler, Matrix4, Object3D, Quaternion, Ray, SkinnedMesh, Vector2, Vector3 } from "three";
import { emitPrecision, explodeSize, meleeRange, milltaryValue, weaponType, weaponValue } from "../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract";
import { attackTarget, camp, collisionPart, damageType, objectStateName, particleNeedCollisionCheckLoopFrames } from "../type/StateType";
import { state } from "../../../../type/StateType";
import { PathFind } from "meta3d-jiehuo-abstract";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getGrid } from "../manage/city1/PathFind";
import { getIsDebug, getIsNotTestPerf } from "../../Scene";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State";
import { bulletParticle, fsm_state, missileVehicleMissileParticle, name, physicsLevel, rocketParticle, shellParticle, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType";
import { buildMultipleTweens, computeEuler } from "./MoveUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getRenderSetting } from "meta3d-jiehuo-abstract/src/setting/RenderSetting";
import { LOD } from "meta3d-jiehuo-abstract";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { clearTween } from "./TweenUtils";
import { getCenter, getCenterInFloor, getGirlState, damage } from "../girl/Girl";
import { getCollisionPartCenter, getCollisionPartOBB, queryAllOBBShapesCollisionWithBox } from "../girl/Collision";
import { getTuple2Last } from "meta3d-jiehuo-abstract/src/utils/TupleUtils";
import { isNotDamageState } from "./FSMStateUtils";
import { checkCollisionWithStatic, checkRangeCollisionWithStatic, getAllLowestCollisionParts, getNearestCollisionPart, getRandomCollisionPartCanAttack as getRandomCollisionPartCanAttackUtils, getRandomCollisionPartForMelee, handleCollisionWithEmitterCollisionableContainers } from "./CollisionUtils";
import { isMeleeOrFlameVehicle } from "../manage/city1/soldier/utils/MeleeUtils";
import { addBox3Helper } from "./ConfigUtils";
import { getScene } from "../CityScene";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { expandBox } from "./Box3Utils";
import { Device } from "meta3d-jiehuo-abstract";
import { buildStatus } from "./LODContainerUtils";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getVolume } from "./SoundUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { buildDestroyedEventData, getDestroyedEventName } from "./EventUtils";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getFlowState } from "meta3d-jiehuo-abstract/src/state/State";
import { isFlameVehicle } from "../manage/city1/milltary_vehicle/FlameVehicle";
import { Scene } from "meta3d-jiehuo-abstract";
// import { checkCollisionWithArmy, handleCollisionWithArmy, handleCollisionWithLittleMan, isCollisionWithLittleMan } from "../manage/city1/ArmyManager";
import * as LittleManTransform from "../little_man/Transform"
import * as LittleMan from "../little_man/LittleMan"
import { getAttackTarget, getCamp, getCampExn, getGetPositionYFuncDefaultKey, getPositionY } from "../manage/city1/Army";
import { getPositionParrelToObj } from "../girl/Utils";
import * as DamageUtils from "./DamageUtils";
import * as Soldier from "../manage/city1/soldier/Soldier"
import * as Tank from "../manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../manage/city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "../manage/city1/milltary_building/MilltaryBuilding"
import * as MissileTurret from "../manage/city1/milltary_building/MissileTurret"
import * as ShellTurret from "../manage/city1/milltary_building/ShellTurret"
import * as MilltaryVehicle from "../manage/city1/milltary_vehicle/MilltaryVehicle"
import { TupleUtils } from "meta3d-jiehuo-abstract";

const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


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

export let getGirlPositionParrelToArmy = (state: state, armyPositionY: number, collisionPart_: collisionPart) => {
	return getCollisionPartCenter(state, collisionPart_).clone().setY(armyPositionY)
}

export let getLittleManPositionParrelToArmy = (state: state, armyPositionY: number, littleManPosition: Vector3) => {
	return littleManPosition.clone().setY(armyPositionY)
}


// export let getForceDirection = () => {
// 	return new Vector3(1, 1, 1)
// }


// export let buildDamageFromName = () => "Army"

// let _getMeleeRangeSize = (meleeRange) => {
// 	return meleeRange / 2
// }

let _isCanAttackForMelee = (state: state, name, transform: Matrix4, meleeRange) => {
	let position = TransformUtils.getPositionFromMatrix4(transform)

	let targetPosition
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			targetPosition = getGirlPositionParrelToArmy(state, position.y, getNearestCollisionPart(state, position))
			break
		case attackTarget.LittleMan:
			targetPosition = getLittleManPositionParrelToArmy(state, position.y, LittleManTransform.getWorldPosition(state))
			break
	}

	let distance = position.distanceTo(targetPosition)

	// return distance < _getMeleeRangeSize(NullableUtils.getExn(meleeRange))
	return distance < NullableUtils.getExn(meleeRange) ||
		distance < 1.414 * PathFind.getStep(getAbstractState(state))

}

export let isCanAttackForRemote = (state: state, name, transform: Matrix4, emitterLife, emitterSpeed) => {
	let position = TransformUtils.getPositionFromMatrix4(transform)

	let targetDistance = (emitterLife * emitterSpeed / 20)
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			return getAllLowestCollisionParts().reduce((result, collisionPart_) => {
				if (result) {
					return result
				}

				return position.distanceTo(getGirlPositionParrelToArmy(state, position.y, collisionPart_)) < targetDistance
			}, false)
		case attackTarget.LittleMan:
			return position.distanceTo(getLittleManPositionParrelToArmy(state, position.y, LittleManTransform.getWorldPosition(state))) < targetDistance
	}
}

let _isCanAttack = (state: state, name, transform: Matrix4, emitterLife, emitterSpeed, meleeRange) => {
	if (getAttackTarget(state, name) == attackTarget.None) {
		return false
	}

	if (NullableUtils.isNullable(meleeRange)) {
		return isCanAttackForRemote(state, name, transform, emitterLife, emitterSpeed)
	}

	return _isCanAttackForMelee(state, name, transform, NullableUtils.getExn(meleeRange))
}

let _findMoveTarget = (state: state, name, armyPosition) => {
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			if (isMeleeOrFlameVehicle(name)) {
				return getGirlPositionParrelToArmy(state, armyPosition.y, getRandomCollisionPartForMelee(state))
			}

			return getCenterInFloor(state)
		case attackTarget.LittleMan:
			return getLittleManPositionParrelToArmy(state, armyPosition.y, LittleManTransform.getWorldPosition(state))
	}
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
	emitterLife,
	emitterSpeed,
	meleeRange,
) => {
	const minInterval = 500

	let finder = PathFind.createAStarFinder()

	return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
		let stateMachine = getStateMachineFunc(state, name)

		if (!isNotDamageState(stateMachine)
			|| StateMachine.isState(stateMachine, objectStateName.Controlled)
		) {
			return Promise.resolve(state)
		}

		if (_isCanAttack(state, name, transform, emitterLife, emitterSpeed, meleeRange)) {
			// if (!StateMachine.isState(stateMachine, objectStateName.Attack)) {
			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createAttackStateFunc(), name, name)
			// }

			// return Promise.resolve(state)
		}

		if (!hasMoveDataFunc(state, name)) {
			let p1 = TransformUtils.getPositionFromMatrix4(transform)
			let p2 = _findMoveTarget(state, name, p1)

			let data = PathFind.findPath(getAbstractState(state), finder,
				_v1_1.set(p1.x, p1.z),
				_v1_2.set(p2.x, p2.z),
				getGrid(state),
				name,
				getIsDebug(state),
				NullableUtils.return_(minInterval),
				// NullableUtils.getEmpty(),
				NullableUtils.getEmpty()
			)
			state = setAbstractState(state, data[0])
			let path = data[1]

			if (path.length > 0) {
				if (getIsDebug(state) && getIsNotTestPerf(state)) {
					PathFind.showFindedPath(getAbstractState(state), path, 0xffff00)
				}

				state = setMoveDataFunc(state, name, path)
			}
			else {
				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
			}
		}

		if (!StateMachine.isState(getStateMachineFunc(state, name), objectStateName.Move)) {
			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createMoveStateFunc(state), name, name)
		}

		return Promise.resolve(state)
	}, state)
}

export let updateTurretAI = (state: state,
	[getStateMachineFunc, setStateMachineFunc,
		createAttackStateFunc,
		createInitialStateFunc,
	],
	validData,
	emitterLife,
	emitterSpeed,
) => {
	// const minInterval = 500

	// let finder = PathFind.createAStarFinder()

	return ArrayUtils.reducePromise(validData, (state, [transform, box, name]) => {
		let stateMachine = getStateMachineFunc(state, name)

		if (!isNotDamageState(stateMachine)
			|| StateMachine.isState(stateMachine, objectStateName.Controlled)
		) {
			return Promise.resolve(state)
		}

		if (_isCanAttack(state, name, transform, emitterLife, emitterSpeed, NullableUtils.getEmpty())) {
			return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createAttackStateFunc(), name, name)
		}

		return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createInitialStateFunc(), name, name)
	}, state)
}

let _computeMoveTime = (previousPosition, nextPosition, factor) => {
	let dx = previousPosition[0] - nextPosition[0], dz = previousPosition[1] - nextPosition[1]

	let distance = Math.sqrt(dx * dx + dz * dz)

	return distance * (factor / 2 + factor / 2 * Math.random())
}

let _handleMoveComplete = (state: state,
	[removeMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
	name
) => {
	state = removeMoveDataAndTweenFunc(state, name)

	return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createInitialStateFunc(), name, name)
}

export let createMoveState = (
	[getLODQueueIndexFunc,
		getModelQueueFunc,
		playAnimationFunc,
		handleAfterUpdatePositionFunc,
		addMoveTweensFunc,
		getInitialEulerForTweenToFaceNegativeXFunc,
		getMoveDataFunc,
		getStateMachineFunc,
		setStateMachineFunc,
		createInitialStateFunc,
		hasMoveTweenFunc,
		getMoveTweenFunc,
		removeMoveDataAndTweenFunc,
	],
	moveSpeed: number,
	initialQuaternion: Quaternion
): fsm_state<state> => {
	return {
		name: objectStateName.Move,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, name) => {
			// return Promise.resolve(state)
			let lODQueueIndex = getLODQueueIndexFunc(state, name)
			let lodQueue: LODQueue = getModelQueueFunc(state, name)

			state = playAnimationFunc(state, name)

			let d = buildMultipleTweens(state, [(state, object, currentData) => {
				// let position = _v1.set(object.x, 0, object.z)
				let position = _v1.set(object.x, getPositionY(state, getGetPositionYFuncDefaultKey(), object.x, object.z), object.z)

				lodQueue.updatePosition(lODQueueIndex, position, true)

				state = handleAfterUpdatePositionFunc(state, lodQueue, lODQueueIndex, name, position)

				return state
			}, data => {
				return {
					x: data[0],
					z: data[1],
				}
			}, (state, previousData, nextData) => {
				NullableUtils.forEach((euler) => {
					lodQueue.updateTransform(transform => {
						TransformUtils.setQuaternionToMatrix4(
							transform,
							initialQuaternion.clone().premultiply(
								_q.setFromEuler(euler)
							)
						)
					}, lODQueueIndex,
						true,
						// getIsDebug(state)
					)
				}, computeEuler(previousData, nextData, getInitialEulerForTweenToFaceNegativeXFunc()))

				return state
			}, (previousData, nextData) => {
				return _computeMoveTime(previousData, nextData, 1000 * 1 / moveSpeed)
			}], getMoveDataFunc(state, name).map(value => value.toArray()))
			state = d[0]
			let lastTween = d[1]
			let allTweens = d[2]

			state = addMoveTweensFunc(state, name, allTweens)

			if (NullableUtils.isNullable(lastTween)) {
				return _handleMoveComplete(state,
					[removeMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
					name
				)
			}

			NullableUtils.getExn(lastTween).onComplete(() => {
				let state = readState()

				return _handleMoveComplete(state,
					[removeMoveDataAndTweenFunc, createInitialStateFunc, getStateMachineFunc, setStateMachineFunc],
					name
				).then(writeState)
			})

			return Promise.resolve(state)


			// return NullableUtils.getWithDefault(
			// 	NullableUtils.map(lastTween => {
			// 	}, lastTween),
			// 	Promise.resolve(state)
			// )
		},
		exitFunc: (state: state, stateMachine) => {
			let name = stateMachine.name

			// if (!hasMoveTweenFunc(state, name)) {
			// 	return Promise.resolve(state)
			// }

			// getMoveTweenFunc(state, name).stop()

			// state = removeMoveDataAndTweenFunc(state, name)
			state = clearTween(state,
				[
					hasMoveTweenFunc, getMoveTweenFunc, removeMoveDataAndTweenFunc
				], name
			)

			return Promise.resolve(state)
		},
	}
}

export let getParticleNeedCollisionCheckLoopCount = (state: state) => {
	switch (getRenderSetting(getAbstractState(state)).physics) {
		case physicsLevel.VeryLow:
			return particleNeedCollisionCheckLoopFrames.Four
		case physicsLevel.Low:
			return particleNeedCollisionCheckLoopFrames.Three
		case physicsLevel.Middle:
			return particleNeedCollisionCheckLoopFrames.Two
		case physicsLevel.High:
		case physicsLevel.VeryHigh:
			return particleNeedCollisionCheckLoopFrames.One
	}
}

export let setParticleNeedCollisionCheckLoopCount = (state: state, particle: shellParticle | bulletParticle | rocketParticle | missileVehicleMissileParticle) => {
	return setAbstractState(state, ParticleManager.setNeedCollisionCheckLoopCount(getAbstractState(state), particle.id, getParticleNeedCollisionCheckLoopCount(state)))
}

export let checkParticleCollisionWithStatic = (state: state, box: Box3) => {
	switch (getRenderSetting(getAbstractState(state)).physics) {
		case physicsLevel.VeryLow:
			return NullableUtils.getEmpty<number>()
	}

	return checkCollisionWithStatic(state, box)
}

export let checkParticleRangeCollisionWithStatic = (state: state, box: Box3) => {
	switch (getRenderSetting(getAbstractState(state)).physics) {
		case physicsLevel.VeryLow:
			return NullableUtils.getEmpty<number>()
	}

	return checkRangeCollisionWithStatic(state, box)
}

export let emitShellEmitOrExplode = (state: state, position: [number, number, number], size) => {
	state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
		// speed: 5,
		speed: 0.1,
		life: 2000,
		size,
		// position: [position[0], position[1] * 0.2, position[2]]
		position: [position[0], position[1] - 1.5, position[2]]
	}))
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
	lODQueueIndex, targetPart) => {
	// let gunBarrelWorldMatrix = gunBarrelQueue.getWorldMatrix(lODQueueIndex)
	// let gunBarrelPosition = TransformUtils.getPositionFromMatrix4(gunBarrelWorldMatrix)
	let gunBarrelPositionY = gunBarrelPosition.y


	let collisionPartCenter = getTargetBox(state, name, targetPart).getCenter(new Vector3())
	// switch (getAttackTarget(state, name)) {
	// 	case attackTarget.Giantess:
	// 		collisionPartCenter = getCollisionPartCenter(state, targetPart)
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

	let gunBarrelTransform = gunBarrelQueue.transforms[lODQueueIndex].clone()


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
			gunBarrelQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
				gunBarrelTransform,
				_q.setFromEuler(
					buildUpdateEulerFunc(object)
				)
			)


			let state = readState()

			state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueueName, lODQueueIndex, true))

			writeState(state)

			return Promise.resolve()
		})
		.onComplete(() => {
			let state = readState()

			ArticluatedAnimation.removeTween(getAbstractState(state), tween)

			// if (!isRoughTowardsTargetFunc(state, buildRoughFireRayFunc, allModelQueues, lODQueueIndex, expandBox(getCollisionPartOBB(state, targetPart).toBox3(), 1.1))) {
			if (!fireRay.intersectsBox(
				expandBox(getTargetBox(state, name, targetPart), 1.1)
			)) {
				return onFailFunc(state).then(writeState)
			}

			return onCompleteFunc(state, targetPart).then(writeState)
		})

	return tween
}



export let createDestroyingState = ([setStatusFunc,
	emitBodyExplodeFunc,
	getModelQueueIndexFunc,
	getStateMachineFunc,
	setStateMachineFunc,
], soundResourceId, value: milltaryValue) => {
	return (): fsm_state<state> => {
		return {
			name: objectStateName.Destroying,
			enterFunc: (state) => Promise.resolve(state),
			executeFunc: (state, [
				fromName,
				[matrix, box, name, damage], forceDirection
			]: any) => {
				let lODQueueIndex = getModelQueueIndexFunc(state, name)

				state = setStatusFunc(state, buildStatus(false, false, true), lODQueueIndex)



				// let stateMachine = getStateMachineFunc(state, name)

				let worldMatrix
				// if (StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)) {
				// let d = getParentTransform(state)
				// state = d[0]
				// let parentTransform = d[1]

				// worldMatrix = _m.multiplyMatrices(
				//     parentTransform, matrix
				// )
				// }
				// else {
				worldMatrix = matrix
				// }

				let point = TransformUtils.getPositionFromMatrix4(worldMatrix)


				state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
					SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, value.emitterVolume,
						point, 0
					))
				))


				state = emitBodyExplodeFunc(state, point.toArray())



				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createDestroyedState(setStatusFunc, getModelQueueIndexFunc)(), name, [
					fromName,
					name
				])
			},
			exitFunc: (state: state) => Promise.resolve(state),
		}
	}
}

export let createDestroyedState = (setStatusFunc, getModelQueueIndexFunc) => {
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
					let lODQueueIndex = getModelQueueIndexFunc(state, name)

					state = setStatusFunc(state, buildStatus(false, false, false), lODQueueIndex)

					return state
				})
			},
			exitFunc: (state: state) => Promise.resolve(state),
		}
	}
}

export let getRandomCollisionPartCanAttack = (state, name, weaponValue: weaponValue, bodyQueue, lODQueueIndex) => {
	let { emitterLife, emitterSpeed } = weaponValue

	return getRandomCollisionPartCanAttackUtils(state, name, bodyQueue.getWorldMatrix(lODQueueIndex), emitterLife, emitterSpeed)
}


export let emitMissiles = (state: state, getMissilesStartWorldPositionFunc, i: number,
	missileQueue, lODQueueIndex,
	targetPosition,
	name,
	[
		emitPrecision,
		emitterSpeed,
		emitterLife,
		emitterSize,
	]
) => {
	let [positionStart, positionEnd] = getMissilesStartWorldPositionFunc(missileQueue, lODQueueIndex, i)

	state = emitShellEmitOrExplode(state, positionStart.toArray(), explodeSize.Middle)

	return setAbstractState(state, ParticleManager.emitMissileVehicleMissile(getAbstractState(state), {
		fromName: name,
		speed: emitterSpeed,
		life: emitterLife,
		size: emitterSize,
		position: positionEnd.toArray(),
		direction: getShootDirection(
			targetPosition.clone().sub(positionEnd).normalize(),
			emitPrecision
		).toArray(),
	}, getParticleNeedCollisionCheckLoopCount(state)))
}

export let getTargetBox = (state: state, name, targetPart: nullable<collisionPart>) => {
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			return getCollisionPartOBB(state, NullableUtils.getExn(targetPart)).toBox3()
		case attackTarget.LittleMan:
			return LittleMan.getBox(state).clone()
		default:
			throw new Error("err")
	}
}

export let getTargetPart = (state: state,
	getBodyQueueFunc,
	getWeaponValueFunc,
	name, lODQueueIndex) => {
	let targetPart
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			targetPart = NullableUtils.return_(getRandomCollisionPartCanAttack(state,
				name,
				getWeaponValueFunc(state), getBodyQueueFunc(state),
				lODQueueIndex))
			break
		case attackTarget.LittleMan:
			targetPart = NullableUtils.getEmpty()
			break
		default:
			throw new Error("err")
	}

	return targetPart
}

export let getTargetPositionParrelToArmy = (state: state, name, armyPositionY, targetPart) => {
	let targetPosition
	switch (getAttackTarget(state, name)) {
		case attackTarget.Giantess:
			targetPosition = getPositionParrelToObj(getCollisionPartCenter(state, targetPart), armyPositionY)
			break
		case attackTarget.LittleMan:
			targetPosition = getLittleManPositionParrelToArmy(state, armyPositionY, LittleManTransform.getWorldPosition(state))
			break
		default:
			throw new Error("err")
	}

	return targetPosition
}

export let handleCollisionWithLittleMan = (state,
	removeParticleFunc,
	particle,
	forceDirection: Vector3,
	pointPosition,
	name,
	fromName,
	[
		force, damageType, weaponType
	]) => {
	state = removeParticleFunc(state, particle)

	return DamageUtils.damageWithData(state, [[force, forceDirection], [damageType, weaponType]],
		fromName,
		NullableUtils.return_(pointPosition),
		[
			[],
			[],
			[name]
		]).then(TupleUtils.getTuple2First)
}

export let handleCollisionWithArmy = (state,
	removeParticleFunc,
	particle,
	forceDirection: Vector3,
	pointPosition,
	[transform, box, name],
	fromName,
	[
		force, damageType, weaponType
	]) => {
	state = removeParticleFunc(state, particle)

	return DamageUtils.damageWithData(state, [[force, forceDirection], [damageType, weaponType]],
		fromName,
		NullableUtils.return_(pointPosition),
		[
			[transform],
			[box],
			[name]
		]).then(TupleUtils.getTuple2First)
}


export let handleHitArmy = (
	handleHitArmyFunc,
) => {
	return (
		state: state,
		removeParticleFunc,
		data: Array<[Matrix4, Box3, name]>,
		pointBox, camp_,
		particle,
		pointPosition,
		[force, weaponType_]
	) => {
		// requireCheck(() => {
		// 	test("data.length should == 1", () => {
		// 		return data.length == 1
		// 	})
		// }, getIsDebug(state))

		// let data3 = checkCollisionWithArmy(state, pointBox, camp_)

		// if (!NullableUtils.isNullable(data)) {
		if (data.length > 0) {
			return NullableUtils.getExn(handleHitArmyFunc)(
				state, (state) => {
					return ArrayUtils.reducePromise(data, (state, d) => {
						return handleCollisionWithArmy(state,
							removeParticleFunc,
							particle,
							_v1.fromArray(particle.direction),
							pointPosition,
							d,
							particle.fromName,
							[force, damageType.Normal, weaponType_])
					}, state)
				}, pointPosition,
				pointBox,
				particle.direction
			)
		}

		return Promise.resolve(state)
	}
}

export let addLabel = (
	state, damageHp, box, damageType_, weaponType_, damagePosition, targetName,
) => {
	return DamageUtils.addLabel(state, damageHp, box,
		DamageUtils.computeFontType(getCamp(state, targetName, camp.Giantess) == camp.Giantess, damageType_, weaponType_),
		damagePosition, targetName,
		2500,
		NullableUtils.return_(1.5),
	)
}

let _getAllContainers = (state: state) => {
	return Soldier.getAllModelQueues(state)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, Tank.buildTankCategoryName(), Tank.buildBodyLODQueueName(Tank.buildTankCategoryName()))]
		)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, MissileVehicle.buildMissileVehicleCategoryName(), MissileVehicle.buildBodyLODQueueName(MissileVehicle.buildMissileVehicleCategoryName()))]
		)
		.concat(
			[MilltaryVehicle.getModelQueueByQueueName(state, FlameVehicle.buildFlameVehicleCategoryName(), FlameVehicle.buildBodyLODQueueName(FlameVehicle.buildFlameVehicleCategoryName()))]
		)
		.concat(
			[MilltaryBuilding.getModelQueueByQueueName(state, MissileTurret.buildMissileTurretCategoryName(), MissileTurret.buildBodyLODQueueName(MissileTurret.buildMissileTurretCategoryName()))]
		)
		.concat(
			[MilltaryBuilding.getModelQueueByQueueName(state, ShellTurret.buildShellTurretCategoryName(), ShellTurret.buildBodyLODQueueName(ShellTurret.buildShellTurretCategoryName()))]
		)
}

export let checkCollisionWithArmy = (state: state, box: Box3, camp: camp): nullable<[Matrix4, Box3, name]> => {
	let allContainers = _getAllContainers(state)
	let abstactState = getAbstractState(state)

	let data = allContainers.reduce((data, container) => {
		if (!NullableUtils.isNullable(data[0])) {
			return data
		}

		return container.queryByBoxAndCamp(abstactState, getCampExn, state, box, camp)
	}, [null, null, null])

	if (NullableUtils.isNullable(data[0])) {
		return NullableUtils.getEmpty()
	}

	return NullableUtils.return_([
		NullableUtils.getExn(data[0]),
		NullableUtils.getExn(data[1]),
		NullableUtils.getExn(data[2])
	])
}

export let checkRangeCollisionWithArmy = (state: state, box: Box3, camp: camp): Array<[Matrix4, Box3, name]> => {
	let allContainers = _getAllContainers(state)
	let abstactState = getAbstractState(state)

	return ArrayUtils.zip(...allContainers.reduce<any>(([transforms, boxes, names], container) => {
		return container.queryRangeByBoxAndCamp(abstactState, getCampExn, state, box, camp, transforms, boxes, names)
	}, [[], [], []]))
}

export let isCollisionWithLittleMan = (state: state, box: Box3) => {
	return LittleMan.getBox(state).intersectsBox(box)
}

export let handleCollision = (state: state,
	[
		handleHitGirlFunc,
		handleHitArmyFunc,
		handleHitLittleManFunc,
	],
	targetPart: nullable<collisionPart>,
	box: Box3, position: Vector3,
	fromName,
	forceDirection: Vector3,
	{
		force, type,
	}: weaponValue,
	damageType_: damageType
) => {
	let camp_ = getCampExn(state, fromName)

	switch (camp_) {
		case camp.LittleMan:
			let data2 = NullableUtils.getEmpty<collisionPart>()
			if (!NullableUtils.isNullable(targetPart) && getCollisionPartOBB(state, NullableUtils.getExn(targetPart)).intersectsBox3(box)) {
				data2 = targetPart
			}

			if (NullableUtils.isNullable(data2)) {
				data2 = queryAllOBBShapesCollisionWithBox(state, box, position)
			}

			if (!NullableUtils.isNullable(data2)) {
				return handleHitGirlFunc(
					state, (state) => {
						return DamageUtils.damageGiantess(state, [force, damageType_, type], NullableUtils.getExn(data2), NullableUtils.return_(position))
					}, position.toArray()
				)
			}
			break
		case camp.Giantess:
			if (isCollisionWithLittleMan(state, box)) {
				return handleHitLittleManFunc(
					state, (state) => {
						return handleCollisionWithLittleMan(state,
							(state, _) => state,
							NullableUtils.getEmpty(),
							forceDirection,
							position,
							[LittleMan.getName()],
							fromName,
							[force, damageType_, type])
					}, position.toArray(),
					box,
					forceDirection
				)
			}
			break
	}

	if (!NullableUtils.isNullable(handleHitArmyFunc)) {
		let data3 = checkCollisionWithArmy(state, box, camp_)

		if (!NullableUtils.isNullable(data3)) {
			return NullableUtils.getExn(handleHitArmyFunc)(
				state, (state) => {
					return handleCollisionWithArmy(state,
						(state, _) => state,
						NullableUtils.getEmpty(),
						forceDirection,
						position,
						NullableUtils.getExn(data3),
						fromName,
						[force, damageType_, type])
				}, position.toArray(),
				box,
				forceDirection
			)
		}
	}

	return Promise.resolve(state)
}

let _handleCollisionWithEmitterCollisionableContainers = (state,
	removeParticleFunc,
	particle, pointPosition,
	// staticLODContainerIndex: staticLODContainerIndex,
	staticLODContainerIndices: Array<staticLODContainerIndex>,

	fromName,
	forceData) => {
	// ParticleManager.markParticleRemove(particle)
	state = removeParticleFunc(state, particle)

	return ArrayUtils.reducePromise(staticLODContainerIndices, (state, staticLODContainerIndex) => {
		return handleCollisionWithEmitterCollisionableContainers(
			state, _v1.fromArray(particle.direction), pointPosition, staticLODContainerIndex,
			fromName,
			forceData
		)
	}, state)
}

let _handleCollisionWithGirl = (state,
	removeParticleFunc,
	// emitFunc,
	particle, collisionPart, pointPositionVec,
	// [force, damageType, weaponType]
	forceData
) => {
	// Console.log(collisionPart)

	// let { force, weaponType } = getValue(state)

	// ParticleManager.markParticleRemove(particle)
	state = removeParticleFunc(state, particle)

	// state = emitFunc(state, pointPosition)

	return DamageUtils.damageGiantess(state, forceData, collisionPart, NullableUtils.return_(pointPositionVec))
	// return DamageUtils.damageWithData(state, [[force, _v1.fromArray(particle.direction)], [damageType, weaponType]],
	// 	particle.fromName,
	// 	NullableUtils.return_(pointPositionVec),
	// 	[
	// 		[],
	// 		[],
	// 		[]
	// 	]).then(TupleUtils.getTuple2First)
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
	force, weaponType_: weaponType,
	damageType_: damageType,
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

		// if (!NullableUtils.isNullable(data1)) {
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
									particle, pointPosition,

									// NullableUtils.getExn(data1),
									data1,


									particle.fromName,
									[force, damageType_, weaponType_]
								)
							}, pointPosition,
							originPointBox,
							particle.direction
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
	let camp_ = getCampExn(state, particle.fromName)
	switch (camp_) {
		case camp.LittleMan:
			// data2 = queryAllOBBShapesCollisionWithBox(state, collisionPointBox, pointPositionVec)
			data2 = queryAllOBBShapesCollisionWithBox(state, originPointBox, pointPositionVec)

			if (!NullableUtils.isNullable(data2)) {
				isCollisioned = true
				if (isHandleCollision) {
					promise = promise.then(state => {
						return handleHitGirlFunc(
							state, (state) => {
								return _handleCollisionWithGirl(state,
									removeParticleFunc,
									particle, NullableUtils.getExn(data2), pointPositionVec, [force, damageType_, weaponType_])
							}, pointPosition,
							originPointBox,
							particle.direction
						)
					})
				}
				if (!isComputeAllCollision) {
					// return promise
					return promise.then(state => [state, isCollisioned])
				}
			}
			break
		case camp.Giantess:
			// data2 = queryAllOBBShapesCollisionWithBox(state, collisionPointBox, pointPositionVec)
			data2 = queryAllOBBShapesCollisionWithBox(state, originPointBox, pointPositionVec)

			if (!NullableUtils.isNullable(data2)) {
				isCollisioned = true
				if (isHandleCollision) {
					promise = promise.then(state => {
						return handleHitGirlFunc(
							state, (state) => {
								return _handleCollisionWithGirl(state,
									removeParticleFunc,
									// particle, NullableUtils.getExn(data2), pointPositionVec, [force, damageType.Normal, weaponType_])
									particle, NullableUtils.getExn(data2), pointPositionVec, [0, damageType_, weaponType_])
							}, pointPosition,
							originPointBox,
							particle.direction
						)
					})
				}
				if (!isComputeAllCollision) {
					// return promise
					return promise.then(state => [state, isCollisioned])
				}
			}

			if (isCollisionWithLittleMan(state, collisionPointBox)) {
				isCollisioned = true
				if (isHandleCollision) {
					promise = promise.then(state => {
						return handleHitLittleManFunc(
							state, (state) => {
								return handleCollisionWithLittleMan(state,
									removeParticleFunc,
									particle,
									_v1.fromArray(particle.direction),
									pointPositionVec,
									[LittleMan.getName()],
									particle.fromName,
									[force, damageType_, weaponType_])
							}, pointPosition,
							originPointBox,
							particle.direction
						)
					})
				}
				if (!isComputeAllCollision) {
					// return promise
					return promise.then(state => [state, isCollisioned])
				}
			}
			break
	}

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
			data3 = checkRangeCollisionWithArmy(state, collisionPointBox, camp_)
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
						particle,
						// _v1.fromArray(particle.direction),
						pointPosition,
						// particle.fromName,
						[force, weaponType_]
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

export let buildFakeBulletParticle = (direction: [number, number, number], fromName: string): bulletParticle => {
	return {
		fromName,
		direction
	} as any
}