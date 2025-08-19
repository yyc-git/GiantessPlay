import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getDynamicGroup, getScene, getState, setState } from "../../CityScene"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { dynamicCar, objectStateName } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Euler, Matrix4, Mesh, Quaternion, Vector2, Vector3 } from "three"
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
import { fsm_state, lodQueueIndex, name, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getGirl, isCollisionWithGirl } from "../../girl/Girl"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { objectValue } from "../../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { isNearGirl } from "../../utils/CollisionUtils"
import { buildMultipleTweens, buildMultipleTweensForCrowd, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../utils/MoveUtils"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { getTransformData, updatePositionTween } from "../../data/InstancedLOD2Utils"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildStatus } from "../../utils/LODContainerUtils"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { isNotDamageState } from "../../utils/FSMStateUtils"
import { defenseFactor, excitement, hp } from "../../data/DataType"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).dynamicCar)
}

let _setState = (state: state, windMillState: dynamicCar) => {
	return setState(state, {
		...getState(state),
		dynamicCar: NullableUtils.return_(windMillState)
	})
}

export let getNamePrefix = () => "Dynamic_Car"

// export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`
export let buildCategoryName = getNamePrefix

// let _buildDynamicCarName = (categoryName, index) => `${categoryName}_${index}`

// export let buildDynamicCarName = (categoryIndex, index) => _buildDynamicCarName(
// 	buildCategoryName(categoryIndex),
// 	index
// )

export let buildNamePrefix = (queueName) => {
	return `${queueName}_${buildCategoryName()}`
}

// export let findAllDynamicCars = (scene) => {
// 	return Scene.findObjects(scene, ({ name }) => name.includes(getNamePrefix())).filter(obj => !obj.isInstancedMesh2LOD)
// }

export let isDynamicCar = (name: string) => {
	return name.includes(getNamePrefix())
}

export let getValue = (state:state): objectValue => {
	return {
		excitement: excitement.Middle,
		// defenseFactor: 30,
		defenseFactor: defenseFactor.Middle,
		hp: hp.Middle
	}
}

// export let addLODQueueData = (state: state,
// 	lodQueue,
// 	details,
// ) => {
// 	return _setState(state, {
// 		..._getState(state),
// 		cars: push(_getState(state).cars, [
// 			lodQueue,
// 			details,
// 			lodQueue.name
// 		])
// 	})
// }

export let setData = (state: state, categoryName, queue) => {
	return _setState(state, {
		..._getState(state),
		carMap: _getState(state).carMap.set(categoryName, queue),
	})
}

export let createState = (): dynamicCar => {
	return {
		carMap: Map(),
		lodQueueIndexMap: Map(),

		moveTweenMap: Map(),
		stateMachineMap: Map(),
		defenseFactorMap: Map(),
		hpMap: Map(),
	}
}

let _hasMoveTween = (state, name) => {
	return _getState(state).moveTweenMap.has(name)
}

let _getMoveTween = (state, name) => {
	return NullableUtils.getWithDefault(_getState(state).moveTweenMap.get(name), [])
}

let _addMoveTweens = (state, name, tweens) => {
	return _setState(state, {
		..._getState(state),
		moveTweenMap: _getState(state).moveTweenMap.set(name,
			ArrayUtils.pushArrs(
				_getMoveTween(state, name),
				tweens
			)
		)
	})
}

export let getAllModelQueues = (state: state) => {
	return _getState(state).carMap.valueSeq().toArray()
}

let _move = (state) => {
	return ArrayUtils.reducePromise(getAllModelQueues(state), (state, queue) => {
		return ArrayUtils.reducePromise(queue.names, (state, name) => {
			return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createMoveState(state), name, NullableUtils.return_(getMoveData(queue.getUserData(name), state)))
		}, state)
	}, state)
}

let _initAllModelQueueIndices = (state: state) => {
	requireCheck(() => {
		test("lodQueueIndexMap should be empty", () => {
			return _getState(state).lodQueueIndexMap.count() == 0
		})
	}, getIsDebug(state))

	return _setState(state, {
		..._getState(state),
		lodQueueIndexMap: getAllModelQueues(state).reduce((lodQueueIndexMap, queue) => {
			return queue.names.reduce((lodQueueIndexMap, name, index) => {
				return lodQueueIndexMap.set(name, index)
			}, lodQueueIndexMap)
		}, _getState(state).lodQueueIndexMap)
	})
}

export let initWhenImportScene = (state: state) => {
	// let abstractState = getAbstractState(state)

	// abstractState = Event.on(abstractState, Pick.getPickEventName(), _pickEventHandler)

	state = _initAllModelQueueIndices(state)

	let abstractState = getAbstractState(state)

	abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(getAllModelQueues(state)))

	state = setAbstractState(state, abstractState)


	return _move(state)

	// state = setAbstractState(state, abstractState)

	// return Promise.resolve(state)
}

let _getDefenseFactor = (state, name) => {
	return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
}

let _getFullHp = (state:state) => {
	return getValue(state).hp
}

let _getHp = (state, name) => {
	return NullableUtils.getExn(_getState(state).hpMap.get(name))
}

let _updateHp = (state, name, hp) => {
	return _setState(state, {
		..._getState(state),
		hpMap: _getState(state).hpMap.set(name, hp)
	})
}

// let _handleStressing = (state, sourceLOD, [matrixs, boxes, names, damages], direction) => {
// 	requireCheck(() => {
// 		test("names' length should <= 1", () => {
// 			return names.length <= 1
// 		})
// 	}, getIsDebug(state))

// 	names.forEach(name => {
// 		_getMoveTween(state, name).pause()
// 	})


// 	return playStressingAnimation(state, [_getFullHp, _updateDamageStatus, (obj, object, matrix, _) => {
// 		updatePositionTween(obj, object)
// 	}, (_, matrix,) => {
// 		return [getPosition(sourceLOD), null, null]
// 	}, (state, name) => {
// 		_getMoveTween(state, name).resume()

// 		return state
// 	}], sourceLOD, [matrixs, boxes, names, damages])
// }

// let _handleDestroyed = (state, sourceLOD, name) => {
// 	sourceLOD.isCollisionable = false

// 	return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData( name)).then(state => {
// 		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 			state = setAbstractState(state, Instance.removeInstanceSource(getAbstractState(state), sourceLOD, getDynamicGroup(state)))

// 			ArticluatedAnimation.removeTween(_getMoveTween(state, sourceLOD.name))

// 			return Promise.resolve(state)
// 		}, DamageUtils.getDisappearLoopCount()))
// 	})
// }

// let _playDestroyingAnimation = (state, sourceLOD, [matrixs, boxes, names, damages], forceDirection) => {
// 	requireCheck(() => {
// 		test("names' length should <= 1", () => {
// 			return names.length <= 1
// 		})
// 	}, getIsDebug(state))

// 	names.forEach(name => {
// 		_getMoveTween(state, name).stop()
// 	})

// 	return playDestroyingAnimation(state, [_getFullHp, _updateDamageStatus, _handleDestroyed, (obj, object, matrix, _) => {
// 		updatePositionTween(obj, object)
// 	}, (_, matrix,) => {
// 		return [getPosition(sourceLOD), null, null]
// 	}], sourceLOD, [matrixs, boxes, names, damages])
// }

// export let damage = (state: state, [size, direction]) => {
export let damage = (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
	// return DamageUtils.damage(
	// 	state, [
	// 	_getDefenseFactor, _getHp, _updateHp,

	// 	_getStateMachine,
	// 	_setStateMachine,
	// 	createStressingState,
	// 	createDestroyingState,
	// ],
	// 	[size, direction],
	// 	[
	// 		sourceLOD.matrixWorld
	// 	],
	// 	[
	// 		Instance.getWorldBoundingBox(getAbstractState(state), sourceLOD)
	// 	],
	// 	[
	// 		sourceLOD.name
	// 	]
	// )

	return DamageUtils.damage(
		state, [
		_getDefenseFactor, _getHp, _updateHp,

		_getStateMachine,
		_setStateMachine,
		createStressingState,
		createDestroyingState,
	], forceData, fromName, damagePosition, transforms, boxes, names,
	)
}

export let initialAttributes = (state, name) => {
	return _setState(state, {
		..._getState(state),
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

export let createInitialState = (): fsm_state<state> => {
	return {
		name: objectStateName.Initial,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => Promise.resolve(state),
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			// sourceLOD, [matrixs, boxes, names, damages], direction
			_,
			[matrix, box, name, damage], direction
		]: any) => {
			// requireCheck(() => {
			// 	test("names' length should <= 1", () => {
			// 		return names.length <= 1
			// 	})
			// }, getIsDebug(state))

			// names.forEach(name => {
			// 	_getMoveTween(state, name).pause()
			// })
			ArticluatedAnimation.pauseTweens(_getMoveTween(state, name))

			// return Promise.resolve(playStressingAnimation(state, [_getFullHp,
			// 	(obj, object, matrix) => {
			// 		updatePositionTween(obj, object)
			// 	}, (_, matrix,) => {
			// 		return [getPosition(sourceLOD), null, null]
			// 	},
			// 	// , (state, name) => {
			// 	// 	_getMoveTween(state, name).resume()

			// 	// 	return state
			// 	// }

			// 	_getStateMachine,
			// 	_setStateMachine,
			// 	createMoveState
			// ], sourceLOD, [matrix, box, name, damage]))

			// return Promise.resolve(state)

			return Promise.resolve(playStressingAnimation(state, [_getFullHp, (object, matrix) => {
				updatePositionTween(matrix, object)
			}, (_, matrix) => {
				return getTransformData(matrix)
			},
				_getStateMachine,
				_setStateMachine,
				createInitialState
			], [matrix, box, name, damage]))
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createDestroyedState = (): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state,
			[fromName, name]
		) => {
			return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
				return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
					LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, false))

					ArticluatedAnimation.removeTweens(getAbstractState(state), _getMoveTween(state, name))

					return Promise.resolve(state)
				}, DamageUtils.getDisappearLoopCount()))
			})

		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createDestroyingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Destroying,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			fromName,
			[matrix, box, name, damage], forceDirection
		]: any) => {
			// // requireCheck(() => {
			// // 	test("names' length should <= 1", () => {
			// // 		return names.length <= 1
			// // 	})
			// // }, getIsDebug(state))

			// // names.forEach(name => {
			// // 	_getMoveTween(state, name).stop()
			// // })
			// // _getMoveTween(state, name).stop()

			// sourceLOD.isCollisionable = false

			// return Promise.resolve(playDestroyingAnimation(state, [_getFullHp, ( object, matrix) => {
			// 	updatePositionTween(obj, object)
			// }, (_, matrix,) => {
			// 	return [getPosition(sourceLOD), null, null]
			// },
			// 	_getStateMachine,
			// 	_setStateMachine,
			// 	createDestroyedState
			// ], sourceLOD, [matrix, box, name, damage]))

			ArticluatedAnimation.stopTweens(_getMoveTween(state, name))

			LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, true))

			return Promise.resolve(playDestroyingAnimation(state, [_getFullHp, (object, matrix) => {
				updatePositionTween(matrix, object)
			}, (_, matrix) => {
				return getTransformData(matrix)
			},
				_getStateMachine,
				_setStateMachine,
				createDestroyedState
			], fromName, [matrix, box, name, damage]))


		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let getModelQueueIndex = (state: state, name) => {
	return NullableUtils.getExn(_getState(state).lodQueueIndexMap.get(name))
}

let _getModelQueue = (state: state, name: string): LODQueue => {
	return LOD.getLODQueue(getAbstractState(state), name)
}

let _buildRandomPosition = ([x, z], size, factor) => {
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
	}

}

let _getInitialEulerForTweenToFaceNegativeX = () => {
	// return new Euler(0, -Math.PI / 2, 0)
	// return new Euler(-Math.PI / 2, 0, 0)
	return new Euler(Math.PI / 2, 0, 0)
}

export let createMoveState = (state): fsm_state<state> => {
	return {
		name: objectStateName.Move,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, data: nullable<Array<singleMoveData>>, stateMachine) => {
			let name = stateMachine.name

			if (_hasMoveTween(state, name)) {
				ArticluatedAnimation.resumeTweens(_getMoveTween(state, name))

				return Promise.resolve(state)
			}

			const timeFactor = 1 / 2


			let lODQueueIndex = getModelQueueIndex(state, name)

			let lodQueue = _getModelQueue(state, name)

			// let moveData = NullableUtils.getExn(data)


			// let object = _buildRandomStartPosition(_buildRandomPosition(
			// 	moveData[0],
			// 	size,
			// 	factor
			// ), _buildRandomPosition(
			// 	moveData[1],
			// 	size,
			// 	factor
			// ))

			// let startObject = {
			// 	// position: object.position.slice()
			// 	...object
			// }

			// let moveDataExcludeFirst = moveData.slice(1)
			// let moveDataExcludeFirstLength = moveDataExcludeFirst.length

			// let [_, [firstTween, lastTween]] = moveDataExcludeFirst.reduce(([[previousTween, previousPosition], [firstTween, lastTween]]: [[nullable<tween>, position], [nullable<tween>, nullable<tween>]], currentMoveData, i) => {
			// 	let targetObject
			// 	if (i == moveDataExcludeFirstLength - 1) {
			// 		targetObject = startObject
			// 	}
			// 	else {
			// 		targetObject = _buildRandomPosition(
			// 			currentMoveData, size, factor)

			// 	}

			// 	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
			// 		.to(targetObject, computeMoveTime(previousPosition, currentMoveData, timeFactor))
			// 		.onUpdate(() => {
			// 			let position = _v1.set(object.x, 0, object.z)

			// 			lodQueue.updatePosition(lODQueueIndex, position, true)
			// 		})
			// 		.onStart(() => {
			// 			NullableUtils.forEach((euler) => {
			// 				lodQueue.updateTransform(transform => {
			// 					transform.makeRotationFromQuaternion(
			// 						_q.setFromEuler(euler)
			// 					)
			// 				}, lODQueueIndex,
			// 					true
			// 				)
			// 			}, computeEuler(previousPosition, currentMoveData, _getInitialEulerForTweenToFaceNegativeX()))




			// 			let state = readState()

			// 			state = _setMoveTween(state, name, tween)

			// 			writeState(state)

			// 		})

			// 	ArticluatedAnimation.addTween(getAbstractState(state), tween)

			// 	if (NullableUtils.isNullable(previousTween)) {
			// 		tween.start()
			// 		// tween.repeat(Infinity)
			// 	}
			// 	else {
			// 		previousTween = NullableUtils.getExn(previousTween)

			// 		previousTween.chain(tween)
			// 	}

			// 	if (i == 0) {
			// 		firstTween = tween
			// 	}
			// 	else if (i == moveData.length - 2) {
			// 		lastTween = tween
			// 	}

			// 	return [[NullableUtils.return_(tween), currentMoveData], [
			// 		firstTween,
			// 		lastTween
			// 	]]
			// }, [[NullableUtils.getEmpty(), moveData[0]], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])


			// lastTween.onComplete(() => {
			// 	firstTween.start()
			// })


			let d = buildMultipleTweensForCrowd(state, [(state, object, currentData) => {
				lodQueue.updatePosition2(lODQueueIndex, [object.x, object.z], true, getIsDebug(state))

				return state
			}, data => {
				return {
					x: data[0],
					z: data[1]
				}
			}, (state, previousData, nextData) => {
				NullableUtils.forEach((euler) => {
					lodQueue.updateTransform(transform => {
						// transform.makeRotationFromQuaternion(
						// 	_q.setFromEuler(euler)
						// )
						TransformUtils.setQuaternionToMatrix4(
							transform,
							_q.setFromEuler(euler)
						)
					}, lODQueueIndex,
						true,
						// getIsDebug(state)
					)
				},


					computeEuler(previousData, nextData, _getInitialEulerForTweenToFaceNegativeX())
					// _getInitialEulerForTweenToFaceNegativeX()

				)

				return state
			}], data, timeFactor)
			state = d[0]
			let allTweens = d[1]

			state = _addMoveTweens(state, name, allTweens)


			return Promise.resolve(state)

		},
		exitFunc: (state: state, stateMachine) => {
			ArticluatedAnimation.pauseTweens(_getMoveTween(state, stateMachine.name))
			// Console.log("exit", stateMachine.name)

			return Promise.resolve(state)
		},
	}
}

// export let createControlledState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Controlled,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _, stateMachine) => Promise.resolve(state),
// 		exitFunc: (state: state, stateMachine) => Promise.resolve(state),
// 	}
// }

export let update = (state: state) => {
	return ArrayUtils.reducePromise(getAllModelQueues(state), (state, queue) => {
		return ArrayUtils.reducePromise(queue.names, (state, name, i) => {
			let transform = queue.transforms[i]
			let box = queue.boxes[i]

			if (!isNearGirl(state, TransformUtils.getPositionFromMatrix4(transform))
				|| !(isNotDamageState(_getStateMachine(state, name)))
				|| StateMachine.isState(_getStateMachine(state, name), objectStateName.Controlled)
			) {
				return Promise.resolve(state)
			}

			if (_getHp(state, name) <= _getFullHp(state) / 2) {
				// _getMoveTween(state, obj.name).stop()
				// return

				return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createInitialState(), name, name)
			}

			// if (isCollisionWithGirl(Instance.getWorldBoundingBox(getAbstractState(state), obj), state)) {
			if (isCollisionWithGirl(box, state)) {
				return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createInitialState(), name, name)
			}
			else {
				return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createMoveState(state), name, NullableUtils.getEmpty())
			}

		}, state)
	}, state)
}

export let dispose = (state: state) => {
	// state = setAbstractState(state, Event.off(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))

	getAllModelQueues(state).forEach(queue => {
		queue.dispose()
	})


	state = _setState(state, createState())

	return Promise.resolve(state)
}

// export let getPickedTransform = getTransformFunc(
// 	new Vector3(-0.4, -0.7, 0.2),
// 	1.6, 0.7, -1.6
// )

// export let handlePickup = (state: state, name: name) => {
// 	return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createControlledState(), name, NullableUtils.getEmpty())
// }

// export let updateTransform = updateTransformUtils

// export let handlePickdown = (state: state,
// 	name: name, index: lodQueueIndex, targetPoint, queue: LODQueue,
// 	originTransform: Matrix4): Promise<[state, boolean]> => {
// 	let validTargetPoint = PathFind.findValidPosition(
// 		new Vector2(targetPoint.x, targetPoint.z),
// 		getGrid(state),
// 		getIsDebug(state)
// 	)

// 	if (NullableUtils.isNullable(validTargetPoint)) {
// 		return Promise.resolve([state, false])
// 	}

// 	validTargetPoint = NullableUtils.getExn(validTargetPoint)

// 	// TODO not set
// 	validTargetPoint.setY(0.87)

// 	queue.updateTransform(
// 		(transform) => {
// 			transform.copy(
// 				TransformUtils.setPositionToMatrix4(
// 					originTransform.clone(),
// 					validTargetPoint
// 				)
// 			)
// 		}, index, true
// 	)

// 	return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createControlledState(), name, NullableUtils.getEmpty()).then(state => [state, true])
// }