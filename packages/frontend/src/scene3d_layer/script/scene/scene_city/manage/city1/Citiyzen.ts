import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getDynamicGroup, getScene, getState, setState } from "../../CityScene"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { cityzen, objectStateName } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Matrix4, Mesh, Object3D, Quaternion, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../../utils/DamageUtils"
import { toRadians } from "../../../../../utils/QuatUtils"
import { buildDestroyedEventData, getDestroyedEventName } from "../../utils/EventUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { buildDownDirection, buildRandomDirectionInXZ } from "../../../../../utils/DirectionUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { InstanceSourceLOD as InstanceSourceLODType } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { fontType, fsm_state, labelAnimation, lodQueueIndex, name, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getGirl, isCollisionWithGirl } from "../../girl/Girl"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { objectValue } from "../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../utils/LODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../utils/LODContainerUtils"
import { isNearGirl } from "../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../utils/BlenderUtils"
import { getGrid } from "./PathFind"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildBloodDecalQueue, buildNameInShadowQueue, createBloodData, createDestroyingState, createStressingState, removeShadow, restoreShadow, updateShadow, handlePickdown as handlePickdownUtils, createDestroyedState } from "../../utils/CharacterUtils"
import { isNotDamageState } from "../../utils/FSMStateUtils"
import { defenseFactor, excitement, hp } from "../../data/DataType"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../utils/SkeletonUtils"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

// type position = [number, number, number]

// type singleMoveData = {
// 	time: number,
// 	position: position,
// 	quaternion: [number, number, number, number]
// }


// enum cityzen1AnimationClipIndex {
// 	// Death = 0,
// 	// Idle = 1,
// 	// Shake = 2,
// 	// Walk = 3,

// 	Idle = 0,
// 	Shake = 1,
// 	Death = 2,
// 	Walk = 3,
// }

enum cityzen1AnimationClipIndex {
	Idle = 0,
	Walk = 1,
	Death = 2,
	Shake = 3,
}

enum cityzen2AnimationClipIndex {
	Walk = 0,
	Shake = 1,
	Idle = 2,
	Death = 3,
}


let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).cityzen)
}

let _setState = (state: state, windMillState: cityzen) => {
	return setState(state, {
		...getState(state),
		cityzen: NullableUtils.return_(windMillState)
	})
}

let _getNamePrefix = () => "cityzen"

// let _buildCategoryName = (index) => `${_getNamePrefix()}_${index}`

// let _buildCityzenName = (categoryName, index) => `${categoryName}_${index}`

// export let getSkinObjectName = _getNamePrefix

export let getFPS = () => {
	return Device.isMobile() ? 30 : 60
}

export let getCityzen1NamePrefix = () => "cityzen1"

export let getCityzen2NamePrefix = () => "cityzen2"

export let buildCityzen1CategoryName = getCityzen1NamePrefix

export let buildCityzen2CategoryName = getCityzen2NamePrefix

export let getCityzen1SkinMesh = (group: Object3D) => {
	let meshes = []
	group.traverse(o => {
		if ((o as SkinnedMesh).isSkinnedMesh) {
			meshes.push(o)
		}
	})

	return meshes[0]
}

export let getCityzen2SkinMesh = (group: Object3D) => {
	let meshes = []
	group.traverse(o => {
		if ((o as SkinnedMesh).isSkinnedMesh) {
			meshes.push(o)
		}
	})

	return meshes[0]
}

export let setData = (state: state, categoryName, queue: LODQueue, shadowQueue: LODQueue) => {
	return _setState(state, {
		..._getState(state),
		// cityzens: ArrayUtils.push(_getState(state).cityzens, {
		// 	queue,
		// 	lod
		// })
		cityzenMap: _getState(state).cityzenMap.set(categoryName, queue),
		shadowQueueMap: _getState(state).shadowQueueMap.set(categoryName, shadowQueue)
	})
}

export let buildCityzen1SkinLODName = () => {
	return `${_getNamePrefix()}_cityzen1_lod`
}

export let buildCityzen2SkinLODName = () => {
	return `${_getNamePrefix()}_cityzen2_lod`
}

// export let buildCityzenName = (categoryIndex, index) => _buildCityzenName(
// 	_buildCategoryName(categoryIndex),
// 	index
// )

// export let findAllCityzens = (scene) => {
// 	return Scene.findObjects(scene, ({ name }) => name.includes(_getNamePrefix())).filter(obj => !obj.isInstancedMesh2LOD)
// }

export let isCityzen = (name: string) => {
	return name.includes(_getNamePrefix())
}

export let getValue = (state:state): objectValue => {
	return {
		excitement: excitement.VeryLow,
		defenseFactor: defenseFactor.VeryLow,
		hp: hp.Low
	}
}

export let getAllModelQueues = (state: state) => {
	return _getState(state).cityzenMap.valueSeq().toArray()
}

let _getModelQueue = (state: state, name: string): LODQueue => {
	// let categoryName
	// if (name.includes(getCityzen1NamePrefix())) {
	// 	categoryName = buildCityzen1CategoryName()
	// }
	// else if (name.includes(getCityzen2NamePrefix())) {
	// 	categoryName = buildCityzen2CategoryName()
	// }
	// else {
	// 	throw new Error("err")
	// }

	// return NullableUtils.getExn(_getState(state).cityzenMap.get(categoryName)).queue

	return LOD.getLODQueue(getAbstractState(state), name)
}

// let _getModelLOD = (state: state, name: string) => {
// 	let categoryName
// 	if (name.includes(getCityzen1NamePrefix())) {
// 		categoryName = buildCityzen1CategoryName()
// 	}
// 	else if (name.includes(getCityzen2NamePrefix())) {
// 		categoryName = buildCityzen2CategoryName()
// 	}
// 	else {
// 		throw new Error("err")
// 	}

// 	return NullableUtils.getExn(_getState(state).cityzenMap.get(categoryName)).lod
// }

// let _getAllLODs = (state: state) => {
// 	return [NullableUtils.getExn(_getState(state).cityzen1Lod), NullableUtils.getExn(_getState(state).cityzen2Lod)]
// }

// let _getAllLevelInstancedMeshes = (state: state) => {
// 	return _getAllLODs(state).reduce((result, lod) => {
// 		return result.concat(lod.getAllLevelInstancedMeshes())
// 	}, [])
// }


// export let getAllAliveModelQueueAndNames = (state): Array<string> => {
// 	return getAllModelQueues(state).reduce((result, queue) => {
// 		return result.concat(queue.getAliveNames(state))
// 	}, [])
// }

export let createState = (): cityzen => {
	return {
		cityzenMap: Map(),

		stateMachineMap: Map(),
		defenseFactorMap: Map(),
		hpMap: Map(),

		lodQueueIndexMap: Map(),

		moveTweenMap: Map(),

		shadowQueueMap: Map(),

		bloodData: createBloodData()
	}
}

export let getModelQueueIndex = (state: state, name) => {
	return NullableUtils.getExn(_getState(state).lodQueueIndexMap.get(name))
}

let _hasMoveTween = (state, name) => {
	return _getState(state).moveTweenMap.has(name)
}

let _getMoveTween = (state, name) => {
	return NullableUtils.getWithDefault(_getState(state).moveTweenMap.get(name), [])
}

let _addMoveTween = (state, name, tween) => {
	return _setState(state, {
		..._getState(state),
		moveTweenMap: _getState(state).moveTweenMap.set(name,
			ArrayUtils.push(
				_getMoveTween(state, name),
				tween
			)
		)
	})
}

let _move = (state) => {
	return ArrayUtils.reducePromise(getAllModelQueues(state), (state, queue) => {
		return queue.reducePromise(state, (state, _, index) => {
			let name = queue.names[index]
			let userData = queue.getUserData(name)

			return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createMoveState(state), name,
				NullableUtils.return_(getMoveData(
					userData, state
				))
			)
		})

	}, state)
}

// export let getLODDistance = () => {
// 	return 500
// }

// let _buildShadowName = (index) => {
// 	return `shadow_${index}`
// }

// let _getShadowHeight = () => 1

// let _buildShadowQueue = (state: state) => {
// 	const count = 500

// 	let scale = 10

// 	let shadow = NewThreeInstance.createMesh(
// 		NewThreeInstance.createBoxGeometry(1 * scale, _getShadowHeight(), 1 * scale, 1, 1),
// 		NewThreeInstance.createMeshPhongMaterial({
// 			map: Loader.getResource<Texture>(getAbstractState(state), getCharacterShadowResourceId()),
// 			transparent: true,
// 		})
// 	)

// 	let scene = getScene(state)

// 	//let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


// 	let data = buildQueue(state, _buildShadowName, count, getLODDistance(), scene, shadow)
// 	state = data[0]
// 	// let box = data[1]
// 	let queue = data[2]
// 	// let names = data[3]


// 	state = _setState(state, {
// 		..._getState(state),
// 		// shadowOriginBox: NullableUtils.return_(box),
// 		shadowQueue: NullableUtils.return_(queue),
// 		// aviailableShadowNames: names
// 	})

// 	return state
// }

export let initWhenImportScene = (state: state) => {
	// state = initAllModelQueueIndices(state, [getAllModelQueues, _getState, _setState])

	let abstractState = getAbstractState(state)

	// abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(getAllModelQueues(state)).concat(_getAllShadowQueues(state)))
	abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(getAllModelQueues(state)))

	state = setAbstractState(state, abstractState)

	state = buildBloodDecalQueue(state, [_getState, _setState])

	// return ArrayUtils.reducePromise(_getAllNames(state), (state, name) => {
	// 	return StateMachine.execute(state, _getStateMachine(state, name), name)
	// }, state)
	return _move(state)
}

let _getDefenseFactor = (state, name) => {
	return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
}

let _getFullHp = (state:state) => {
	return getValue(state).hp
}

export let getHp = (state, name) => {
	return NullableUtils.getExn(_getState(state).hpMap.get(name))
}

let _updateHp = (state, name, hp) => {
	return _setState(state, {
		..._getState(state),
		hpMap: _getState(state).hpMap.set(name, hp)
	})
}


export let damage = (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
	return DamageUtils.damage(
		state, [
		_getDefenseFactor, getHp, _updateHp,

		_getStateMachine,
		_setStateMachine,
		() => {
			// return createStressingState([_getShakeClipIndex, _getStateMachine, _setStateMachine], createMoveState(state))
			return createStressingState([_getShakeClipIndex, _getStateMachine, _setStateMachine, createInitialState])
		},
		() => {
			return createDestroyingState([
				_getDeathClipIndex, _getState, _setState, _getStateMachine, _setStateMachine, (state, name) => {
					ArticluatedAnimation.removeTweens(getAbstractState(state), _getMoveTween(state, name))

					return state
				}])
		}
	], forceData, fromName,
		damagePosition,
		transforms, boxes, names,
	)
}

let _getShadowQueue = (state: state, name: string) => {
	let categoryName
	if (name.includes(getCityzen1NamePrefix())) {
		categoryName = buildCityzen1CategoryName()
	}
	else if (name.includes(getCityzen2NamePrefix())) {
		categoryName = buildCityzen2CategoryName()
	}
	else {
		throw new Error("err")
	}

	return NullableUtils.getExn(_getState(state).shadowQueueMap.get(categoryName))
}

let _getAllShadowQueues = (state: state) => {
	return _getState(state).shadowQueueMap.valueSeq().toArray()
}

export let initialAttributes = (state, name, index) => {
	return _setState(state, {
		..._getState(state),
		lodQueueIndexMap: _getState(state).lodQueueIndexMap.set(name, index),
		stateMachineMap: _getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
		defenseFactorMap: _getState(state).defenseFactorMap.set(name, getValue(name).defenseFactor),
		hpMap: _getState(state).hpMap.set(name, _getFullHp(state)),
	})
}

let _getStateMachine = (state: state, name: string) => {
	return NullableUtils.getExn(_getState(state).stateMachineMap.get(name))
}

let _setStateMachine = (state: state, name: string, stateMachine) => {
	return _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.set(name, stateMachine)
	})
}

// let _getAllLevelInstancedSkinnedMeshes = (state, name): Array<InstancedSkinnedMesh> => {
// 	return _getModelLOD(state, name).getAllLevelInstancedMeshes()
// }

let _getIdleClipIndex = (name) => {
	if (name.includes(getCityzen1NamePrefix())) {
		return cityzen1AnimationClipIndex.Idle
	}

	return cityzen2AnimationClipIndex.Idle
}

let _getWalkClipIndex = (name) => {
	if (name.includes(getCityzen1NamePrefix())) {
		return cityzen1AnimationClipIndex.Walk
	}

	return cityzen2AnimationClipIndex.Walk
}

let _getControlledClipIndex = (name) => {
	if (name.includes(getCityzen1NamePrefix())) {
		// TODO update
		return cityzen1AnimationClipIndex.Idle
	}

	return cityzen2AnimationClipIndex.Idle
}

let _getShakeClipIndex = (name) => {
	if (name.includes(getCityzen1NamePrefix())) {
		return cityzen1AnimationClipIndex.Shake
	}

	return cityzen2AnimationClipIndex.Shake
}

let _getDeathClipIndex = (name) => {
	if (name.includes(getCityzen1NamePrefix())) {
		return cityzen1AnimationClipIndex.Death
	}

	return cityzen2AnimationClipIndex.Death
}

export let createInitialState = (): fsm_state<state> => {
	return {
		name: objectStateName.Initial,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, name) => {
			let clipIndex = _getIdleClipIndex(name)

			state = setAbstractState(state, GPUSkin.playLoop(
				getAbstractState(state),
				name, clipIndex
			))

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _buildRandomPosition = ([x, z], size, factor): { x: number, z: number } => {
	return {
		x: x + factor * size * (Math.random() * 2 - 1),
		z: z + factor * size * (Math.random() * 2 - 1)
	}

}

let _buildRandomStartPosition = (firstPoistion, secondPosition) => {
	let xRange = secondPosition.x - firstPoistion.x
	let zRange = secondPosition.z - firstPoistion.z

	return {
		x: firstPoistion.x + xRange * Math.random(),
		z: firstPoistion.z + zRange * Math.random(),
		// x: firstPoistion.x + Math.min(xRange * Math.random(), xRange * 0.5),
		// z: firstPoistion.z + Math.min(zRange * Math.random(), zRange * 0.5),
	}
}

let _getInitialEulerForTweenToFaceNegativeX = () => {
	return new Euler(0, -Math.PI / 2, 0)
}


let _computeEuler = (previousPosition: position, nextPosition: position, initialEulerToFaceNegativeX: Euler) => {
	/*!only consider z direction*/

	return computeEuler(
		[0, previousPosition[1]],
		[0, nextPosition[1]],
		initialEulerToFaceNegativeX
	)
}

export let createMoveState = (state): fsm_state<state> => {
	return {
		name: objectStateName.Move,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, data: nullable<Array<singleMoveData>>, stateMachine) => {
			let name = stateMachine.name

			let clipIndex = _getWalkClipIndex(name)

			state = setAbstractState(state, GPUSkin.playLoop(
				getAbstractState(state),
				name, clipIndex
			))


			if (_hasMoveTween(state, name)) {
				ArticluatedAnimation.resumeTweens(_getMoveTween(state, name))

				return Promise.resolve(state)
			}



			const size = 5
			const factor = 1
			const timeFactor = 10


			let lODQueueAndShadowLODQueueIndex = getModelQueueIndex(state, name)

			let lodQueue = _getModelQueue(state, name)
			let shadowQueue = _getShadowQueue(state, name)

			let moveData = NullableUtils.getExn(data)


			let object = _buildRandomStartPosition(_buildRandomPosition(
				moveData[0],
				size,
				factor
			), _buildRandomPosition(
				moveData[1],
				size,
				factor
			))

			let startObject = {
				// position: object.position.slice()
				...object
			}


			let newFirstMoveData: position = [startObject.x, startObject.z]

			moveData.push(newFirstMoveData)

			let moveDataExcludeFirst = moveData.slice(1)
			let moveDataExcludeFirstLength = moveDataExcludeFirst.length

			let [_, [firstTween, lastTween]] = moveDataExcludeFirst.reduce(([[previousTween, previousPosition], [firstTween, lastTween]]: [[nullable<tween>, position], [nullable<tween>, nullable<tween>]], currentMoveData, i) => {
				let targetObject
				if (i == moveDataExcludeFirstLength - 1) {
					targetObject = startObject
				}
				else {
					targetObject = _buildRandomPosition(
						currentMoveData, size, factor)

				}

				// Console.log(
				// 	object,
				// 	targetObject,
				// 	previousPosition, currentMoveData,
				// 	// computeMoveTime(previousPosition, currentMoveData, timeFactor)
				// 	computeMoveTime(previousPosition, targetObject, timeFactor)
				// )


				let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
					.to(targetObject, computeMoveTime(previousPosition, [targetObject.x, targetObject.z], timeFactor))
					.onUpdate(() => {
						let position = _v1.set(object.x, 0, object.z)

						lodQueue.updatePosition(lODQueueAndShadowLODQueueIndex, position, true)

						updateShadow(shadowQueue, lODQueueAndShadowLODQueueIndex, position)
					})
					.onStart(() => {
						let state = readState()

						// let previousPositionForComputeEuler = i == 0 ? moveData[0] : previousPosition

						NullableUtils.forEach((euler) => {
							lodQueue.updateTransform(transform => {
								// transform.makeRotationFromQuaternion(
								// 	_q.setFromEuler(euler)
								// )
								TransformUtils.setQuaternionToMatrix4(
									transform,
									_q.setFromEuler(euler)
								)
							}, lODQueueAndShadowLODQueueIndex,
								true,
								// getIsDebug(state)
							)
						}, _computeEuler(previousPosition, currentMoveData, _getInitialEulerForTweenToFaceNegativeX()))



						state = _addMoveTween(state, name, tween)

						writeState(state)

					})

				ArticluatedAnimation.addTween(getAbstractState(state), tween)

				if (NullableUtils.isNullable(previousTween)) {
					tween.start()
					// tween.repeat(Infinity)
				}
				else {
					previousTween = NullableUtils.getExn(previousTween)

					previousTween.chain(tween)
				}

				if (i == 0) {
					firstTween = tween
				}
				else if (i == moveData.length - 2) {
					lastTween = tween
				}

				return [[NullableUtils.return_(tween), currentMoveData], [
					firstTween,
					lastTween
				]]
			}, [[NullableUtils.getEmpty(), newFirstMoveData], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])


			lastTween.onComplete(() => {
				firstTween.start()
			})

			return Promise.resolve(state)
		},
		exitFunc: (state: state, stateMachine) => {
			ArticluatedAnimation.pauseTweens(_getMoveTween(state, stateMachine.name))

			return Promise.resolve(state)
		},
	}
}

export let createControlledState = (): fsm_state<state> => {
	return {
		name: objectStateName.Controlled,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _, stateMachine) => {
			let name = stateMachine.name


			let clipIndex = _getControlledClipIndex(name)

			state = setAbstractState(state, GPUSkin.playLoop(
				getAbstractState(state),
				name, clipIndex
			))

			return Promise.resolve(state)
		},
		exitFunc: (state: state, stateMachine) => Promise.resolve(state),
	}
}

let _getAllModelQueueDataForUpdate = (state): Array<[Box3, string]> => {
	return getAllModelQueues(state).reduce((result, queue) => {
		// return result.concat(queue.names.map((name, i) => {
		// 	return [queue.transforms[i], queue.boxes[i], name]
		// }))

		return queue.transforms.reduce((result, transform, i) => {
			if (!isNearGirl(state, TransformUtils.getPositionFromMatrix4(transform))) {
				return result
			}

			let name = queue.names[i]
			let stateMachine = _getStateMachine(state, name)

			if (!isNotDamageState(stateMachine)
				|| StateMachine.isState(stateMachine, objectStateName.Controlled)
			) {
				return result
			}

			result.push([queue.boxes[i], name])

			return result
		}, result)
	}, [])
}

export let update = (state: state) => {
	return ArrayUtils.reducePromise(_getAllModelQueueDataForUpdate(state), (state, [box, name]) => {
		if (isCollisionWithGirl(box, state)) {
			return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createInitialState(), name, name)
		}
		else {
			return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createMoveState(state), name, NullableUtils.getEmpty())
		}
	}, state)
}

export let dispose = (state: state) => {
	getAllModelQueues(state).forEach(queue => {
		queue.dispose()
	})

	state = _setState(state, createState())

	return Promise.resolve(state)
}

export let getPickedTransform = getGiantessTransformFunc(
	(state) => new Quaternion(),
	getPickTransformPrefix(),

	new Vector3(-0.3, -0.5, -0.2),
	Math.PI / 2,
	// new Vector3(1, 0, 0),
	Math.PI / 2,
	// new Vector3(0, 1, 0),
	0,
	// new Vector3(0, 0, 1),
)



export let handlePickup = (state: state, name: name) => {
	state = removeShadow(state, name)

	return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createControlledState(), name, NullableUtils.getEmpty())
}

export let updateTransform = updateTransformUtils

export let handlePickdown = (state: state, name: name, index: lodQueueIndex, targetPoint, queue: LODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
	return handlePickdownUtils(state,
		(state, name) => {
			return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createControlledState(), name, NullableUtils.getEmpty())
		},
		name, index, targetPoint, queue, _getShadowQueue(state, name), originTransform
	)
}

export let getLocalTransform = getLocalTransformUtils

export let getBoxForPick = getBoxForPickUtils