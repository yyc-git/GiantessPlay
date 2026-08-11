import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { add, buildQueue } from "./AviailableLODQueueUtils"
import { getIsDebug } from "../../Scene"
import { Loader } from "meta3d-jiehuo-abstract"
import { Matrix4, Quaternion, Texture, Vector2, Vector3 } from "three"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { getCharacterBloodResourceId, getKillSoldierSoundResourceId, getMeleeKillSoundResourceId, getRemoteKillSoundResourceId, getScene } from "../CityScene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { fsm_state, lodQueueIndex, name, stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { bloodData, damageType, objectStateName, usedGirl } from "../type/StateType"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"

import { Event } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, buildDestroyintEventData, getDestroyedEventName, getDestroyingEventName } from "./EventUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildStatus } from "./LODContainerUtils"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { PathFind } from "meta3d-jiehuo-abstract"
import { findValidPosition, getGrid } from "../manage/city1/PathFind"
import { isControlledStateExceptStressing, isDestoryRelatedStates, isFallState, isPickedControlledState, isRepelState, isStandupState } from "./FSMStateUtils"
import { handleDestroy } from "../StaticDynamic"
import { disposeAllData } from "./ArmyUtils"
import { addDeathUI } from "../Status"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { emitterVolume, weaponValue } from "../data/ValueType"
import { getOriginSystemVolume, getSystemVolume, getVolume } from "./SoundUtils"
import { isGirlWeapon } from "../girl/Utils"
import { isMeleeWeapon } from "./WeaponUtils"
import { buildDownDirection } from "../../../../utils/DirectionUtils"
import { getRenderSetting } from "../../../../mod/SettingMod"
import { nullable } from "block/src/Type"
import { Flow } from "meta3d-jiehuo-abstract"
import { isPicked } from "../girl/PickPoseUtils"
import { getFarDistance } from "../manage/city1/WholeScene"
import { isPlayer } from "./PlayerUtils"
import { isEliteGiantess } from "../../../../mod/EliteGiantessMod"
import { isSoldier } from "../manage/city1/soldier/utils/SoldierUtils"
import { getBoxBottomPoint, getBoxMaxSize, getBoxTopPoint } from "./Box3Utils"
import { getIsEliteGiantePlayDeathAnimation } from "../UI"
import { api } from "type-api/src/Type"
import { isDirectDestoryed } from "./DamageUtils"
import { NumberUtils } from "meta3d-jiehuo-abstract"

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

// 	abstractState = Collision.setPlayerMoveCollisionableContainers(abstractState, Collision.getPlayerMoveCollisionableContainers(abstractState).concat(getAllModelQueuesFunc(state)).concat(_getAllShadowQueues(state)))


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
	let data = buildQueue(state, _buildBloodDecalName, count, getFarDistance, scene, decal)
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

export let checkCurrentState = (state: state, getStateMachineFunc, name, objectStateName_: objectStateName) => {
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
			[matrix, box, name, damage, damageType_], direction
		]: any) => {
			let clipIndex = getClipIndexFunc(name, damageType_)

			state = setAbstractState(state, GPUSkin.playOnce(
				getAbstractState(state),
				(state) => {
					// checkCurrentState(state, getStateMachineFunc, name, objectStateName.Stressing)

					let stateMachine: stateMachine<any> = getStateMachineFunc(state, name)

					// return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), nextState, name, name)


					if (isDestoryRelatedStates(stateMachine)) {
						return Promise.resolve(state)
					}

					if (isFallState(stateMachine) || isRepelState(stateMachine)) {
						return Promise.resolve(state)
					}

					// if (isDestoryRelatedStates(stateMachine.previousState)) {
					let nextState
					if (StateMachine.isPreviousState(stateMachine, objectStateName.Move)) {
						nextState = createInitialStateFunc()
					}
					else {
						// if (stateMachine.previousState.name == objectStateName.Destroying
						// 	|| stateMachine.previousState.name == objectStateName.Destroyed
						// ) {
						// 	debugger
						// 	return Promise.resolve(state)
						// }
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
export let addBlood = (state: state, [getStateFunc, setStateFunc], point, box) => {
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
		_setBloodDecalScale(getStateFunc(state).bloodData.bloodDecalScale,
			NumberUtils.clamp(Math.pow(getBoxMaxSize(box), 0.75) / 2, 1, 50)
		),
		getStateFunc(state).bloodData.bloodDecalQuaternion,

		// point.clone().set(point.x, point.y + 0.01, point.z - 1 * scale / 3)

		_v1.set(point.x, point.y + 0.01, point.z)
	)
}

export let removeBlood = (state: state, name) => {
	// return remove(state, state => {
	// 	return NullableUtils.getExn(getStateFunc(state).bloodData.bloodDecalQueue)
	// }, index)

	LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, false))

	return state
}

let _setBloodDecalScale = (bloodDecalScale, scale) => {
	return bloodDecalScale.clone().multiply(_v1.set(scale, scale, 1))
}

export let createBloodData = (): bloodData => {
	const scale = 5

	return {
		bloodDecalOriginBox: null,
		bloodDecalQueue: null,
		aviailableBloodDecalNames: [],
		bloodDecalScale: _setBloodDecalScale(new Vector3(1, 1, 1), scale),
		bloodDecalQuaternion: TransformUtils.rotateOnLocalAxis(new Quaternion(), -Math.PI / 2, new Vector3(1, 0, 0)),
	}
}

export let createDestroyedState = ([disposeArmyStateDataFunc, getStateFunc, setStateFunc], stateMachine): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state,
			[
				fromName,
				position,
				name,
				lodQueueIndex
			]: any
		) => {
			return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
				LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, false))

				if (isSoldier(name)) {
					state = removeShadow(state, name)
				}

				return NullableUtils.getWithDefault(
					NullableUtils.map(lodQueueIndex => {
						// state = deferToBatchDisposeAllData(state, disposeArmyStateDataFunc, name, lodQueueIndex)
						return disposeAllData(state, disposeArmyStateDataFunc, name, lodQueueIndex)
					}, lodQueueIndex),
					Promise.resolve(state)
				)
			})
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let removeShadow = (state: state, name) => {
	state = setAbstractState(state, LOD.setStatusForLODQueueByName(getAbstractState(state), buildNameInShadowQueue(name), buildStatus(false, false, false)))

	return state
}

export let updateShadow = (shadowQueue, shadowLODQueueIndex, position) => {
	shadowQueue.updatePosition(shadowLODQueueIndex,
		position,
		true
	)
}

export let restoreShadow = (state: state, name, shadowQueue: LODQueue, shadowLODQueueIndex, position) => {
	// state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), buildNameInShadowQueue(name), buildStatus(false, false, true)))
	shadowQueue.setStatusByName(buildNameInShadowQueue(name), buildStatus(false, false, true))

	updateShadow(shadowQueue, shadowLODQueueIndex, position)

	return state
}

export let createDestroyingState = ([getClipIndexFunc, getStateFunc, setStateFunc, getStateMachineFunc, setStateMachineFunc,
	getModelQueueIndexFunc,
	disposeArmyStateDataFunc,
	handleDestroyingFunc,
	handleDestroyedFunc],
	weaponValue_: weaponValue,
	// damageType_: damageType
	// , positionYOffset
): fsm_state<state> => {
	return {
		name: objectStateName.Destroying,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			fromName,
			[matrix, box, name, damage, damageType_], forceDirection,
		]: any) => {
			return Event.trigger<state>(state, getAbstractState, getDestroyingEventName(), buildDestroyintEventData(fromName, name)).then(state => {
				state = handleDestroy(state, fromName, name)

				LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, true))

				state = handleDestroyingFunc(state,
					[
						fromName,
						TransformUtils.getPositionFromMatrix4(matrix),
						name
					]
				)

				// let position = TransformUtils.getPositionFromMatrix4(matrix)
				// let position = box.getCenter(new Vector3())
				let position = getBoxBottomPoint(box, 0, new Vector3())

				let stateMachine = getStateMachineFunc(state, name)
				let func = (state) => {
					checkCurrentState(state, getStateMachineFunc, name, objectStateName.Destroying)

					return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createDestroyedState([disposeArmyStateDataFunc, getStateFunc, setStateFunc], stateMachine), name, [
						fromName,
						// box.getCenter(_v1),
						position,
						name,
						getModelQueueIndexFunc(state, name)
					])
				}


				state = handleDestroyedFunc(state, name, position)

				// if (!StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)) {
				// if (!isPicked(state, name)) {
				if (!isDirectDestoryed(state, name, damage)) {
					if (getRenderSetting(state).isShowBlood) {
						state = addBlood(state, [getStateFunc, setStateFunc], position, box)
					}


					state = addDeathUI(state, box, damageType_)

					if (isPlayer(state, fromName)) {
						if (isMeleeWeapon(weaponValue_.meleeRange)) {
							if (isGirlWeapon(weaponValue_)) {
								state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getKillSoldierSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume.VeryBig, position, 0))))
							}
							else {
								state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getMeleeKillSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume.VeryBig, position, 0))))
							}
						}
						else {
							state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getRemoteKillSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume.VeryBig, position, 0))))
						}

					}


					if (!getIsEliteGiantePlayDeathAnimation(state) && isEliteGiantess(state, name)) {
						return func(state)
					}
					else {
						state = setAbstractState(state, GPUSkin.playOnce(
							getAbstractState(state),
							state => {
								state = setAbstractState(state, GPUSkin.playLastFrame(getAbstractState(state), name,
									getClipIndexFunc(name, damageType_, stateMachine)))

								// state = handleDestroyedFunc(state, name, position)

								if (isEliteGiantess(state, name)) {
									return func(state)
								}

								state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
									return func(state)
									// }, 5))
								}, 2))
								return Promise.resolve(state)
							},
							name, getClipIndexFunc(name, damageType_, stateMachine)
						))
					}


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
			})

		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _restoreBox = (queue, index, transform) => {
	let box = queue.originBox.clone().setFromCenterAndSize(
		queue.originBox2.getCenter(_v1),
		queue.originBox.getSize(_v2)
	)
	queue.getBox(index).copy(
		box.applyMatrix4(
			transform
		)
	)

	return queue
}

export let handleExitControlled = (state,
	name: name, index: lodQueueIndex, currentPosition, queue: LODQueue,
	shadowQueue: nullable<LODQueue>,
	originTransform
) => {
	let newOriginTransform = TransformUtils.setPositionToMatrix4(
		originTransform.clone(),
		currentPosition
	)

	queue.updateTransform(
		(transform) => {
			transform.copy(
				newOriginTransform
			)
		}, index, false
	)
	queue = _restoreBox(queue, index, newOriginTransform)


	state = NullableUtils.getWithDefault(
		NullableUtils.map(shadowQueue => {
			return restoreShadow(state, name,
				shadowQueue,
				index, currentPosition
			)
		}, shadowQueue),
		state
	)

	return state
}

export let handlePickdown = (state: state,
	changeAndExecuteStateFunc,

	name: name, index: lodQueueIndex, targetPoint, queue: LODQueue,
	shadowQueue: nullable<LODQueue>,
	originTransform: Matrix4): Promise<[state, boolean]> => {
	// let validTargetPoint = PathFind.findValidPosition(
	// 	new Vector2(targetPoint.x, targetPoint.z),
	// 	getGrid(state),
	// 	getIsDebug(state)
	// )
	let validTargetPoint = findValidPosition(state, targetPoint)

	if (NullableUtils.isNullable(validTargetPoint) || !queue.isAlive(index)) {
		return Promise.resolve([state, false])
	}

	validTargetPoint = NullableUtils.getExn(validTargetPoint)

	// let newOriginTransform = TransformUtils.setPositionToMatrix4(
	// 	originTransform.clone(),
	// 	validTargetPoint
	// )

	// queue.updateTransform(
	// 	(transform) => {
	// 		transform.copy(
	// 			newOriginTransform
	// 		)
	// 	}, index, false
	// )
	// queue = _restoreBox(queue, index, newOriginTransform)





	// state = NullableUtils.getWithDefault(
	// 	NullableUtils.map(shadowQueue => {
	// 		return restoreShadow(state, name,
	// 			shadowQueue,
	// 			index, validTargetPoint
	// 		)
	// 	}, shadowQueue),
	// 	state
	// )
	state = handleExitControlled(state,
		name, index, validTargetPoint, queue,
		shadowQueue,
		originTransform
	)

	return changeAndExecuteStateFunc(state, name).then(state => [state, true])
}

export let isChangeToLieState = (state, stateMachine: stateMachine<state>, damageType_, direction) => {
	// return !isPickedControlledState(stateMachine) && (damageType_ == damageType.Direct || damageType_ == damageType.Range)
	return (isStandupState(stateMachine) ? true : !isControlledStateExceptStressing(state, stateMachine))
		&& (damageType_ == damageType.Direct || damageType_ == damageType.Range)
		&& direction.equals(buildDownDirection())
}



export let updateCharacterPosition = (api: api, state, queue, shadowQueue, index, object) => {
	// if (queue.isAlive(index)) {
	let pos = api.vector3.create(
		object.x,
		object.y,
		object.z,
	)
	queue.updatePosition(
		index, pos,
		true
	)

	api.NullableUtils.forEach(shadowQueue => {
		updateShadow(shadowQueue, index, pos)
	}, shadowQueue)
	// }

	return Promise.resolve(state)

}