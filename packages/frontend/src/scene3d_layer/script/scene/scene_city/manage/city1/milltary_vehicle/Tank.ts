import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getDynamicGroup, getShellGunBarretEmitSoundResourceId, getScene, getShellGunBarretHitSoundResourceId, getState, setState } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { milltaryVehicle, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart, attackTarget } from "../../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Group, Matrix4, Mesh, Object3D, Quaternion, Ray, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../../../utils/DamageUtils"
import { toRadians } from "../../../../../../utils/QuatUtils"
import { buildDestroyedEventData, getDestroyedEventName } from "../../../utils/EventUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { buildDownDirection, buildRandomDirectionInXZ } from "../../../../../../utils/DirectionUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { InstanceSourceLOD as InstanceSourceLODType } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { fontType, fsm_state, labelAnimation, lodQueueIndex, name, shellParticle, staticLODContainerIndex, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { armyValue, emitPrecision, emitSpeed, emitVolume, emitterLife, emitterSize, emitterSpeed, objectValue, milltaryValue, explodeSize } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/LODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getRandomCollisionPart, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { getGrid } from "../PathFind"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { parseArmyVehicleQueues, parseCharacter } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { getActualHeight, getGirlPositionParrelToObj, getPositionParrelToObj, getScale, getSmallGirlBox } from "../../../girl/Utils"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import * as Buildings from "../Buildings"
import { getCollisionPartCenter, queryAllOBBShapesCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedLOD2"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../../data/DataUtils"
import * as HierachyLODQueueUtils from "../../../utils/HierachyLODQueueUtils"
import { articluatedAnimationName, defenseFactor, excitement, forceSize, hp, speed } from "../../../data/DataType"
import { LOD } from "meta3d-jiehuo-abstract"
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, emitShellEmitOrExplode, buildGunBarrelTween, deferFire, getTargetBox, getLittleManPositionParrelToArmy, getTargetPositionParrelToArmy } from "../../../utils/ArmyUtils"
import * as Girl from "../../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import { clearTween } from "../../../utils/TweenUtils"

import { getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as ShellGunBarrel from "../../../weapon/ShellGunBarrel"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { getTankResourceId, getModelData, modelName } from "../../../army_data/MilltaryVehicleData"
import * as MilltaryVehicle from "./MilltaryVehicle"
import { Console } from "meta3d-jiehuo-abstract"
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { getAttackTarget } from "../Army"
import * as LittleManTransform from "../../../little_man/Transform"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

export let getNamePrefix = () => `${MilltaryVehicle.getNamePrefix()}_tank`

export let buildTankCategoryName = getNamePrefix

export let buildTankNamePrefix = (queueName) => {
	return `${queueName}_${getNamePrefix()}`
}

// export let buildWholeLODQueueName = (categoryName) => `${categoryName}_whole`

let _getBodyPostfix = () => "body"

let _getTurretPostfix = () => "turret"

let _getGunBarrelPostfix = () => "gunBarrel"

export let buildBodyLODQueueName = (categoryName) => `*${categoryName}_${_getBodyPostfix()}*`

export let buildTurretLODQueueName = (categoryName) => `*${categoryName}_${_getTurretPostfix()}*`

export let buildGunBarrelLODQueueName = (categoryName) => `*${categoryName}_${_getGunBarrelPostfix()}*`

// let _getTurretNameByBodyName = (bodyName) => {
//     return bodyName.replace(_getBodyPostfix(), _getTurretPostfix())
// }

// let _getGunBarrelNameByBodyName = (bodyName) => {
//     return bodyName.replace(_getBodyPostfix(), _getGunBarrelPostfix())
// }

// let _getQueueNameFromName = (name) => {
//     return name.match(/^.*(\*.+\*)/)[1]
// }

export let setHierachy = (state: state) => {
	let bodyQueue = getTankBodyQueue(state)
	let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildTurretLODQueueName(buildTankCategoryName()))
	let gunBarrelQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildGunBarrelLODQueueName(buildTankCategoryName()))

	bodyQueue.addChild(turretQueue)
	turretQueue.addChild(gunBarrelQueue)

	return state
}

// export let setData = (state: state, categoryName, queue: HierachyLODQueue) => {
//     return _setState(state, {
//         ..._getState(state),
//         // milltaryVehicleMap: _getState(state).milltaryVehicleMap.set(categoryName, NullableUtils.getWithDefault(
//         // 	NullableUtils.map(data => {
//         // 		return ArrayUtils.push(data, {
//         // 			queue, lod
//         // 		})
//         // 	}, _getState(state).milltaryVehicleMap.get(categoryName)),
//         // 	[{
//         // 		queue, lod
//         // 	}]
//         // )),

//         milltaryVehicleMap: _getState(state).milltaryVehicleMap.set(categoryName, NullableUtils.getWithDefault(
//             _getState(state).milltaryVehicleMap.get(categoryName),
//             Map()
//         ).set(queue.name, queue)
//         ),
//     })
// }

export let getAllMeshData = (group: Group) => {
	let obj = group.children[0]
	return [
		[obj.children[0], buildBodyLODQueueName],
		[
			[obj.children[0].children[0], buildTurretLODQueueName],
			[obj.children[0].children[0].children[0], buildGunBarrelLODQueueName],
		]
	]
}

export let isTank = (name: string) => {
	return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue & milltaryValue => {
	return {
		excitement: excitement.High,
		defenseFactor: defenseFactor.High,
		hp: hp.Middle,
		// hp: 15000,

		moveSpeed: speed.Low,

		rotateSpeed: speed.Middle,
		// speed: 3,


		// TODO update
		// emitSpeed: emitSpeed.Middle,
		emitSpeed: emitSpeed.Slow,
		emitVolume: emitVolume.Middle,
		emitPrecision: emitPrecision.High,


		emitterVolume: emitVolume.Big,
	}
}

export let getTankBodyQueue = (state: state): HierachyLODQueue => {
	return MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildBodyLODQueueName(buildTankCategoryName()))
}

export let getAllModelQueues = (state: state): Array<LODQueue> => {
	return [getTankBodyQueue(state)]
}

export let getModelAllQueues = (state: state): [HierachyLODQueue, HierachyLODQueue, HierachyLODQueue] => {
	// return ArrayUtils.flatten(_getState(state).milltaryVehicleMap.valueSeq().toArray().map(data => {
	// 	return data.valueSeq().toArray().map(({ queue }) => queue)
	// }))


	let bodyQueue = getTankBodyQueue(state)
	let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildTurretLODQueueName(buildTankCategoryName()))
	let gunBarrelQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildGunBarrelLODQueueName(buildTankCategoryName()))

	return [bodyQueue, turretQueue, gunBarrelQueue]
}

// let _getAllModelAllQueues = (state: state): Array<[HierachyLODQueue, HierachyLODQueue, HierachyLODQueue]> => {
//     return [getModelAllQueues(state)]
// }

// let _getModelQueueByName = (state: state, name: string) => {
//     // let categoryName
//     // if (name.includes(getTankNamePrefix())) {
//     // 	categoryName = buildTankCategoryName()
//     // }
//     // else {
//     // 	throw new Error("err")
//     // }

//     // return MilltaryVehicle.getModelQueueByQueueName(state, categoryName, _getQueueNameFromName(name))
//     return LOD.getLODQueue(getAbstractState(state), name)
// }

// let _getModelLOD = (state: state, name: string) => {
// 	let categoryName
// 	if (name.includes(getTankNamePrefix())) {
// 		categoryName = buildTankCategoryName()
// 	}
// 	// else if (name.includes(getn2NamePrefix())) {
// 	// 	categoryName = buildn2CategoryName()
// 	// }
// 	else {
// 		throw new Error("err")
// 	}

// 	return NullableUtils.getExn(_getState(state).milltaryVehicleMap.get(categoryName)).lod
// }

// let _getAllLODs = (state: state) => {
// 	return [NullableUtils.getExn(_getState(state).cityzeTankLod), NullableUtils.getExn(_getState(state).cityzen2Lod)]
// }

// let _getAllLevelInstancedMeshes = (state: state) => {
// 	return _getAllLODs(state).reduce((result, lod) => {
// 		return result.concat(lod.getAllLevelInstancedMeshes())
// 	}, [])
// }


let _getAllBodyNames = (state): Array<string> => {
	return MilltaryVehicle.getModelQueueByQueueName(state,
		buildTankCategoryName(),
		buildBodyLODQueueName(buildTankCategoryName())).names
}

export let initWhenImportScene = (state: state) => {
	return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getTankResourceId()), Render.getRenderer(getAbstractState(state))).then(tank => {
		let { quaternion, boxFactor } = getModelData(state, modelName.Tank)

		state = MilltaryVehicle.setState(state, {
			...MilltaryVehicle.getState(state),
			initialQuaternionMap: MilltaryVehicle.getState(state).initialQuaternionMap.set(modelName.Tank,
				quaternion
			),
		})


		let data = parseArmyVehicleQueues(state,
			[
				buildTankCategoryName,
				getAllMeshData,
				MilltaryVehicle.setData,
				setHierachy,
			],
			tank.scene,
			boxFactor,
			500,
			true,
			getScene(state)
		)
		state = data[0]
		let localMatrices = data[1] as [Matrix4, Matrix4, Matrix4]
		let allQueues = data[2]

		return MilltaryVehicle.setAllQueueLocalMatrices(state, buildTankCategoryName(), localMatrices)
	})
		.then(state => {
			let abstractState = getAbstractState(state)

			abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildBodyLODQueueName(buildTankCategoryName()))]))


			state = setAbstractState(state, abstractState)

			return ArrayUtils.reducePromise(_getAllBodyNames(state), (state, name) => {
				state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
					return StateMachine.changeAndExecuteState(state, MilltaryVehicle.setStateMachine, MilltaryVehicle.getStateMachine(state, name), createFireState(), name, NullableUtils.return_(name))
				}, 1))

				return StateMachine.execute(state, MilltaryVehicle.getStateMachine(state, name), name)
			}, state)
		})
}

let _getFullHp = (state) => {
	return getValue(state).hp
}


let _getShellInitialStartLocalPosition = (tankScale) => {
	// return new Vector3(-400, 0, 0).multiply(tankScale)
	return new Vector3(-400, 0, 30).multiply(tankScale)
}

let _getShellStartLocalPosition = (bodyQueue, gunBarrelQueue, lODQueueIndex) => {
	return _getShellInitialStartLocalPosition(TransformUtils.getScaleFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex)))
		.applyMatrix4(
			gunBarrelQueue.getWorldMatrix(lODQueueIndex)
		)
}


let _buildRoughFireRay = ([bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex) => {
	let shellStartLocalPositionPosition = _getShellStartLocalPosition(bodyQueue, gunBarrelQueue, lODQueueIndex)

	let turretPosition = MilltaryVehicle.getTurretPosition(turretQueue, lODQueueIndex)

	return new Ray(
		turretPosition,
		shellStartLocalPositionPosition.clone().sub(turretPosition).normalize()
	)
}

let _getLookatEuler = (
	turretPosition,
	targetPosition,
	isDebug
) => {
	let value = TransformUtils.getLookatEuler(
		turretPosition,
		targetPosition
	)

	value.y += Math.PI / 2


	if (value.x == - Math.PI && value.z == - Math.PI) {
		value.x = 0
		value.z = 0
		value.y = -value.y
	}

	// if (value.x % Math.PI * 2 == 0) {
	// 	value.x = 0
	// }
	// if (value.z % Math.PI * 2 == 0) {
	// 	value.z = 0
	// }

	return ensureCheck(value, () => {
		test("euler.x,euler.z should be 0", () => {
			return value.x == 0 && value.z == 0
		})
	}, isDebug)
}

let _fixGimbalLock = (turretLookatEuler, turretEuler) => {
	if (turretLookatEuler.y < 0 && turretEuler.z > 0) {
		let y = (Math.PI + turretLookatEuler.y) + Math.PI

		if (y < Math.PI * 1.5) {
			turretLookatEuler.y = y
		}
	}
	else if (turretLookatEuler.y > 0 && turretEuler.z < 0) {
		let y = - Math.PI - (Math.PI - turretLookatEuler.y)

		if (y > -Math.PI * 1.5) {
			turretLookatEuler.y = y
		}
	}

	return turretLookatEuler
}

let _buildTurretTween = (state, [bodyQueue, turretQueue], name, allModelQueues, lODQueueIndex, targetPart) => {
	let turretPosition = MilltaryVehicle.getTurretPosition(turretQueue, lODQueueIndex)

	let targetPosition = getTargetPositionParrelToArmy(state, name, turretPosition.y, targetPart)

	let { emitPrecision, rotateSpeed } = getArmyValueForAttack(state, getValue(state), turretPosition) as any

	let turretLookatEuler = _getLookatEuler(
		turretPosition,
		(targetPosition.clone().add(_v1.set(
			emitPrecision * NumberUtils.getRandomValue1(),
			0,
			emitPrecision * NumberUtils.getRandomValue1(),
		))),
		getIsDebug(state)
	)

	let turretTransform = turretQueue.transforms[lODQueueIndex].clone()


	let turretEuler = TransformUtils.getRotationEulerFromMatrix4(turretTransform)
	if (turretEuler.x !== 0 || turretEuler.y !== 0) {
		throw new Error("err")
	}


	// Console.log(
	// 	"data:",
	// 	turretLookatEuler.y,
	// 	turretEuler.z,
	// 	lODQueueIndex,
	// 	turretPosition,
	// )


	let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()
	let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform)

	turretLookatEuler.set(turretLookatEuler.x, turretLookatEuler.y - bodyEuler.z, turretLookatEuler.z)



	turretLookatEuler = _fixGimbalLock(turretLookatEuler, turretEuler)




	let object = {
		// x: 0,
		y: turretEuler.z,
		// z: 0,
	}
	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to({
			y: turretLookatEuler.y,
		}, Math.abs(turretLookatEuler.y - turretEuler.z) * 1000 * rotateSpeed)
		.onUpdate(() => {
			let state = readState()

			// let box = makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3())


			if (MilltaryVehicle.isRoughTowardsTarget(state,
				_buildRoughFireRay,
				allModelQueues, lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
				return tween.end()
			}


			turretQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
				turretTransform,
				_q.setFromEuler(_e.set(
					0,
					0,
					object.y,
				))
			)

			state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

			writeState(state)

			return Promise.resolve()
		})
		.onComplete(() => {
			let state = readState()

			ArticluatedAnimation.removeTween(getAbstractState(state), tween)

			return Promise.resolve()
		})

	return tween
}

let _rotateTowardsTarget = (state, [onCompleteFunc, onFailFunc], name, allModelQueues, lODQueueIndex, targetPart) => {
	let [bodyQueue, turretQueue, gunBarrelQueue] = allModelQueues
	let tween1 = _buildTurretTween(state, [bodyQueue, turretQueue], name, allModelQueues, lODQueueIndex, targetPart)
	let tween2 = buildGunBarrelTween(state, [onCompleteFunc, onFailFunc,
		(angle) => angle,
		(gunBarrelEuler) => gunBarrelEuler.y,
		(object) => {
			return _e.set(
				0,
				object.angle,
				0,
			)
		},
		MilltaryVehicle.isRoughTowardsTarget,
		_buildRoughFireRay,
	],
		name,
		bodyQueue.name,
		gunBarrelQueue, allModelQueues,
		TransformUtils.getPositionFromMatrix4(gunBarrelQueue.getWorldMatrix(lODQueueIndex)),

		getValue(state).rotateSpeed,
		lODQueueIndex, targetPart)




	state = MilltaryVehicle.addFireTween(state, name, tween1)
	state = MilltaryVehicle.addFireTween(state, name, tween2)

	tween1.chain(tween2)

	tween1.start()

	ArticluatedAnimation.addTween(getAbstractState(state), tween1)
	ArticluatedAnimation.addTween(getAbstractState(state), tween2)

	return state
}

let _playFireAnimation = (
	onCompleteFunc, state: state, [bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex,
	name
) => {
	let gunBarrelTransform = gunBarrelQueue.transforms[lODQueueIndex]
	let gunBarrelLocalPosition = TransformUtils.getPositionFromMatrix4(gunBarrelTransform)
	let gunBarrelBox = gunBarrelQueue.boxes[lODQueueIndex]

	let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Tank_Fire)
	let fireAnimationTweens = playArticluatedAnimation(state,
		[
			object => {
				gunBarrelTransform.setPosition(object.x, gunBarrelLocalPosition.y, gunBarrelLocalPosition.z)

				let state = readState()

				state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

				writeState(state)

			},
			state => {
				return gunBarrelLocalPosition.x
			},
			state => {
				// let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc())


				let width = gunBarrelBox.getSize(_v1).x

				let amplitude = DamageUtils.clamp(width / 8, width / 10)

				// let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)
				// let timeScalar = 0.3 * getValue(state).moveSpeed
				let timeScalar = 0.3 * getValue(state).rotateSpeed


				return [gunBarrelLocalPosition.x, amplitude, timeScalar]
			},
			(allTweens) => {
				DamageUtils.handleTweenRepeatComplete2(onCompleteFunc, allTweens, articluatedAnimationData.repeatCount)
			}
		],
		articluatedAnimationData
	)

	state = MilltaryVehicle.addFireTweens(state, name, fireAnimationTweens)

	return state
}



let _fireShell = (state: state, name, [bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex, targetPart) => {
	let tankPosition = TransformUtils.getPositionFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex))

	let {
		emitSpeed,
		emitVolume,
		emitPrecision
	} = getArmyValueForAttack(state, getValue(state), tankPosition)
	let {
		emitterSpeed,
		emitterLife,
		emitterSize,
	} = ShellGunBarrel.getValue(state)

	// let fireRay = _buildRoughFireRay([bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex)
	let targetPosition = getTargetBox(state, name, targetPart).getCenter(new Vector3())

	return deferFire(state, (state) => {
		state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
			SoundManager.buildNeedToPlaySoundData(getShellGunBarretEmitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, tankPosition, 0.0))
		))



		let emitPosition = _getShellStartLocalPosition(bodyQueue, gunBarrelQueue, lODQueueIndex).toArray()


		state = setAbstractState(state, ParticleManager.emitShell(getAbstractState(state), {
			fromName: name,
			speed: emitterSpeed,
			life: emitterLife,
			size: emitterSize,
			// position: fireRay.origin.toArray(),
			position: emitPosition,
			// direction: getShootDirection(fireRay.direction, emitPrecision).toArray()
			direction: getShootDirection(
				targetPosition.clone().sub(_v1.fromArray(emitPosition)).normalize(),
				emitPrecision).toArray()
		},
			getParticleNeedCollisionCheckLoopCount(state)
		))

		state = emitShellEmitOrExplode(state, emitPosition, explodeSize.Middle)


		state = _playFireAnimation(state => {
			return Promise.resolve(MilltaryVehicle.fire(state,
				[
					_buildRoughFireRay,
					_rotateTowardsTarget,
					_fireShell,
					getTankBodyQueue,
					ShellGunBarrel.getValue
				],
				name, [bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex, targetPart))
		}, state, [bodyQueue, turretQueue, gunBarrelQueue], lODQueueIndex, name)

		return Promise.resolve(state)
	}, name, emitSpeed)
}


export let createFireState = MilltaryVehicle.createFireState(
	[
		getModelAllQueues,
		_buildRoughFireRay,
		_rotateTowardsTarget,
		_fireShell,
		getTankBodyQueue,
		ShellGunBarrel.getValue
	]
)


let _getInitialEulerForTweenToFaceNegativeX = () => {
	// return new Euler(-Math.PI / 2, 0, 0)
	return new Euler(0, 0, 0)
}

export let createMoveState = (state) => {
	return MilltaryVehicle.createMoveState(
		[
			getTankBodyQueue,
			_getInitialEulerForTweenToFaceNegativeX
		],
		getValue(state),
		modelName.Tank
	)
}

// export let createStressingState = () => {
// 	return MilltaryVehicle.createStressingState(
// 		[
// 			getTankBodyQueue,
// 			_getFullHp,

// 			getModelAllQueues,
// 			_buildRoughFireRay,
// 			_rotateTowardsTarget,
// 			_fireShell
// 		],
// 	)
// }


let _setStatus = (state: state, status, index) => {
	let bodyQueue = getTankBodyQueue(state)
	let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildTurretLODQueueName(buildTankCategoryName()))
	let gunBarrelQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildTankCategoryName(), buildGunBarrelLODQueueName(buildTankCategoryName()))

	LOD.setStatusForLODQueue(getAbstractState(state), bodyQueue.names[index], status)
	LOD.setStatusForLODQueue(getAbstractState(state), turretQueue.names[index], status)
	LOD.setStatusForLODQueue(getAbstractState(state), gunBarrelQueue.names[index], status)

	return state
}


// export let createDestroyedState = () => {
//     return MilltaryVehicle.createDestroyedState(_setState)
// }

// export let createDestroyedState = () => {
//     return MilltaryVehicle.createDestroyedState(_setState)
// }


export let updateQueue = (state: state) => {
	let bodyQueue = getTankBodyQueue(state)

	HierachyLODQueueUtils.update(state, bodyQueue)
}

export let initialAttributes = (state, name, index) => {
	return MilltaryVehicle.initialAttributes(state, [getValue, _getFullHp], name, index)
}

export let damage = (damageFunc) => {
	return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
		return damageFunc(state,
			[
				getTankBodyQueue,
				_getFullHp,
				_setStatus,
				MilltaryVehicle.emitBodyExplode,

				getModelAllQueues,
				_buildRoughFireRay,
				_rotateTowardsTarget,
				_fireShell,
				ShellGunBarrel.getValue
			],
			getShellGunBarretHitSoundResourceId(),
			getValue(state),

			forceData, fromName, damagePosition, transforms, boxes, names
		)
	}
}

export let update = (state: state) => {
	updateQueue(state)

	return MilltaryVehicle.updateAI(state, [
		createFireState,
		createMoveState(state)
	],
		getTankBodyQueue(state),
		ShellGunBarrel.getValue(state)
	)
}


export let getPickedTransform = MilltaryVehicle.getPickedTransform(modelName.Tank)


export let handlePickup = MilltaryVehicle.handlePickup

export let updateTransform = MilltaryVehicle.updateTransform

export let handlePickdown = MilltaryVehicle.handlePickdown(getTankBodyQueue)

export let getLocalTransform = MilltaryVehicle.getLocalTransform

export let getBoxForPick = MilltaryVehicle.getBoxForPick



export let getModelQueueIndex = MilltaryVehicle.getModelQueueIndex

export let getHp = MilltaryVehicle.getHp