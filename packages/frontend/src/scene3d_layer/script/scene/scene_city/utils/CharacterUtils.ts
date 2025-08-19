import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { add, buildQueue } from "./LODQueueUtils"
import { getIsDebug } from "../../Scene"
import { Loader } from "meta3d-jiehuo-abstract"
import { Matrix4, Quaternion, Texture, Vector2, Vector3 } from "three"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { getCharacterBloodResourceId, getScene } from "../CityScene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { fsm_state, lodQueueIndex, name, stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { bloodData, objectStateName } from "../type/StateType"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, getDestroyedEventName } from "./EventUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildStatus } from "./LODContainerUtils"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGrid } from "../manage/city1/PathFind"
import { isDestoryRelatedStates } from "./FSMStateUtils"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let buildNameInShadowQueue = (nameInModelQueue: string) => {
	return `${nameInModelQueue}_shadow`
}

// export let initAllModelQueueIndices = (state: state, [getAllModelQueuesFunc, getStateFunc, setStateFunc]) => {
// 	requireCheck(() => {
// 		test("lodQueueIndexMap should be empty", () => {
// 			return getStateFunc(state).lodQueueIndexMap.count() == 0
// 		})
// 	}, getIsDebug(state))

// 	return setStateFunc(state, {
// 		...getStateFunc(state),
// 		lodQueueIndexMap: getAllModelQueuesFunc(state).reduce((lodQueueIndexMap, queue) => {
// 			return queue.names.reduce((lodQueueIndexMap, name, index) => {
// 				return lodQueueIndexMap.set(name, index)
// 			}, lodQueueIndexMap)
// 		}, getStateFunc(state).lodQueueIndexMap)
// 	})
// }


// export let initWhenImportScene = (state: state, [ getAllModelQueuesFunc, getStateFunc, setStateFunc ]) => {
// 	state = _initAllModelQueueIndices(state, [ getAllModelQueuesFunc, getStateFunc, setStateFunc ])

// 	let abstractState = getAbstractState(state)

// 	abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(getAllModelQueuesFunc(state)).concat(_getAllShadowQueues(state)))


// 	// abstractState = Collision.setEmitterCollisionableContainers(abstractState, Collision.getEmitterCollisionableContainers(abstractState).concat(
// 	// 	Buildings.getAllOctrees(state)
// 	// ))



// 	state = setAbstractState(state, abstractState)

// 	state = _buildBloodDecalQueue(state)

// }


let _buildBloodDecalName = (index) => {
	return `bloodDecal_${index}`
}

let _getBloodMaxCount = () => 400

export let buildBloodDecalQueue = (state: state, [getStateFunc, setStateFunc]) => {
	// const count = 100
	const count = _getBloodMaxCount()
	const distance = 1000

	let texture = Loader.getResource<Texture>(getAbstractState(state), getCharacterBloodResourceId())

	let decal = NewThreeInstance.createMesh(
		NewThreeInstance.createPlaneGeometry(1, 1, 1, 1),
		solveBlackBoardProblem(fixZFighting(NewThreeInstance.createMeshPhongMaterial({
			map: texture,
			transparent: true,
		})))
	)

	let scene = getScene(state)

	// //let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	// let data = buildQueue(state, _buildBloodDecalName, count, distance, scene, decal)
	let data = buildQueue(state, _buildBloodDecalName, count, distance, scene, decal)
	state = data[0]
	let box = data[1]
	let queue = data[2]
	let names = data[3]

	state = setStateFunc(state, {
		...getStateFunc(state),
		bloodData: {
			...getStateFunc(state).bloodData,
			bloodDecalOriginBox: NullableUtils.return_(box),
			bloodDecalQueue: NullableUtils.return_(queue),
			aviailableBloodDecalNames: names
		}
	})

	return state

}

let _checkCurrentState = (state: state, getStateMachineFunc, name, objectStateName_: objectStateName) => {
	requireCheck(() => {
		test(`currentState should be ${objectStateName_}`, () => {
			if (getStateMachineFunc(state, name).currentState.name != objectStateName_) {
				console.error(name, getStateMachineFunc(state, name))

				return false
			}

			return true
		})
	}, getIsDebug(state))
}

export let createStressingState = ([getClipIndexFunc, getStateMachineFunc, setStateMachineFunc, createInitialStateFunc]): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			_,
			[matrix, box, name, damage], direction
		]: any) => {
			let clipIndex = getClipIndexFunc(name)

			state = setAbstractState(state, GPUSkin.playOnce(
				getAbstractState(state),
				(state) => {
					_checkCurrentState(state, getStateMachineFunc, name, objectStateName.Stressing)

					let stateMachine: stateMachine<any> = getStateMachineFunc(state, name)

					// return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), nextState, name, name)


					if (isDestoryRelatedStates(stateMachine)) {
						return Promise.resolve(state)
					}

					let nextState
					if (StateMachine.isPreviousState(stateMachine, objectStateName.Move)) {
						nextState = createInitialStateFunc()
					}
					else {
						nextState = NullableUtils.getExn(stateMachine.previousState)
					}

					return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, nextState, name, name)
				},
				name, clipIndex
			))

			return Promise.resolve(state)

		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

// TODO add only when Direct Damage
export let addBlood = (state: state, [getStateFunc, setStateFunc], point) => {
	// point.setY(0)
	return add(state, [
		state => {
			return NullableUtils.getExn(getStateFunc(state).bloodData.bloodDecalQueue)
		},
		state => {
			return getStateFunc(state).bloodData.aviailableBloodDecalNames
		},
		(state, aviailableBloodDecalNames) => {
			return setStateFunc(state, {
				...getStateFunc(state),
				bloodData: {
					...getStateFunc(state).bloodData,
					aviailableBloodDecalNames
				}
			})
		}
	], _getBloodMaxCount(), NullableUtils.getExn(getStateFunc(state).bloodData.bloodDecalOriginBox),
		getStateFunc(state).bloodData.bloodDecalScale,
		getStateFunc(state).bloodData.bloodDecalQuaternion,

		// point.clone().set(point.x, point.y + 0.01, point.z - 1 * scale / 3)

		_v1.set(point.x, point.y + 0.01, point.z)
	)
}

export let removeBlood = (state: state, name) => {
	// return remove(state, state => {
	// 	return NullableUtils.getExn(getStateFunc(state).bloodData.bloodDecalQueue)
	// }, index)

	LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, false))

	return state
}

export let createBloodData = (): bloodData => {
	const scale = 5

	return {
		bloodDecalOriginBox: null,
		bloodDecalQueue: null,
		aviailableBloodDecalNames: [],
		bloodDecalScale: new Vector3(1 * scale, 1 * scale, 1),
		bloodDecalQuaternion: TransformUtils.rotateOnLocalAxis(new Quaternion(), -Math.PI / 2, new Vector3(1, 0, 0)),
	}
}

export let createDestroyedState = ([handleFunc, getStateFunc, setStateFunc], stateMachine): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state,
			[
				fromName,
				position,
				name
			]: any
		) => {
			if (
				!StateMachine.isPreviousState(stateMachine, objectStateName.Controlled) &&
				RenderSetting.getRenderSetting(getAbstractState(state)).isShowBlood) {
				state = addBlood(state, [getStateFunc, setStateFunc], position)
			}

			return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
				LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, false))
				state = handleFunc(state, name)

				return Promise.resolve(state)
			})
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}
export let removeShadow = (state: state, name) => {
	state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), buildNameInShadowQueue(name), buildStatus(false, false, false)))

	return state
}

export let updateShadow = (shadowQueue, shadowLODQueueIndex, position) => {
	shadowQueue.updatePosition(shadowLODQueueIndex,
		position,
		true
	)
}

export let restoreShadow = (state: state, name, shadowQueue, shadowLODQueueIndex, position) => {
	state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), buildNameInShadowQueue(name), buildStatus(false, false, true)))

	updateShadow(shadowQueue, shadowLODQueueIndex, position)

	return state
}

export let createDestroyingState = ([getClipIndexFunc, getStateFunc, setStateFunc, getStateMachineFunc, setStateMachineFunc, handleDestroyedFunc]
	// , positionYOffset
): fsm_state<state> => {
	return {
		name: objectStateName.Destroying,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			fromName,
			[matrix, box, name, damage], forceDirection
		]: any) => {
			LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, true))

			let stateMachine = getStateMachineFunc(state, name)
			let func = (state) => {
				_checkCurrentState(state, getStateMachineFunc, name, objectStateName.Destroying)

				return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createDestroyedState([handleDestroyedFunc, getStateFunc, setStateFunc], stateMachine), name, [
					fromName,
					// box.getCenter(_v1),
					TransformUtils.getPositionFromMatrix4(matrix),
					name
				])
			}

			if (!StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)) {
				state = removeShadow(state, name)

				state = setAbstractState(state, GPUSkin.playOnce(
					getAbstractState(state),
					func,
					name, getClipIndexFunc(name)
				))


				// TransformUtils.setPositionToMatrix4(
				// 	matrix,
				// 	TransformUtils.positionAddY(
				// 		TransformUtils.getPositionFromMatrix4(matrix),
				// 		positionYOffset
				// 	)
				// )



				return Promise.resolve(state)
			}

			return func(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let handlePickdown = (state: state,
	changeAndExecuteStateFunc,

	name: name, index: lodQueueIndex, targetPoint, queue: LODQueue,
	shadowQueue: LODQueue,
	originTransform: Matrix4): Promise<[state, boolean]> => {
	let validTargetPoint = PathFind.findValidPosition(
		new Vector2(targetPoint.x, targetPoint.z),
		getGrid(state),
		getIsDebug(state)
	)

	if (NullableUtils.isNullable(validTargetPoint)) {
		return Promise.resolve([state, false])
	}

	validTargetPoint = NullableUtils.getExn(validTargetPoint)

	queue.updateTransform(
		(transform) => {
			transform.copy(
				TransformUtils.setPositionToMatrix4(
					originTransform.clone(),
					validTargetPoint
				)
			)
		}, index, true
	)

	state = restoreShadow(state, name,
		shadowQueue,
		index, validTargetPoint
	)

	return changeAndExecuteStateFunc(state, name).then(state => [state, true])
}