import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { StaticLODContainer } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DoubleSide, Float32BufferAttribute, Group, Material, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, Quaternion, RepeatWrapping, Texture, TextureLoader, Vector3 } from "three"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { camp, car, objectStateName } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { LeafGeometry } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { Terrain } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
// import { getPlayerMoveCollisionableContainers, setPlayerMoveCollisionableContainers } from "meta3d-jiehuo-abstract/src/collision/Collision"
import { Loader } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import * as DamageUtils from "../../utils/DamageUtils"
import { buildDestroyedEventData, buildDestroyintEventData, getDestroyedEventName, getDestroyingEventName } from "../../utils/EventUtils"
import { Collision } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../utils/CarUtils"
import { getTransformData, updatePositionTween } from "../../data/InstancedLOD2Utils"
import { objectValue } from "../../data/ValueType"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { buildStatus } from "../../utils/LODContainerUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { defenseFactor, excitement, hp } from "../../data/DataType"
import { setCamp } from "./Army"
import { generateReward } from "../../reward/RewardGenerator"
import { parseNamePrefix } from "../../utils/ArmyUtils"
import { disposeAllData, getNoneArmorData } from "../../utils/OctreeObjectUtils"
import { setDefenseFactor } from "../../StaticDynamicUnit"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).car)
}

let _setState = (state: state, treeState: car) => {
	return setState(state, {
		...getState(state),
		car: NullableUtils.return_(treeState)
	})
}

export let getNamePrefix = () => "Static_Car"
// export let getNamePrefix = () => getLanguageTextData(readState(), languageKey.Car)

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

// export let buildCarName = (categoryName, index) => `${categoryName}_${index}`

export let isCars = (name: string) => {
	return name.includes(getNamePrefix())
}

export let getValue = (state: state): objectValue => {
	return {
		excitement: excitement.Middle,
		// defenseFactor: 30,
		defenseFactor: defenseFactor.Middle,
		hp: hp.Middle
		// hp: 20000
	}
}

export let addStaticLODContainerData = (state: state,
	staticLODContainer,
	details,
) => {
	return _setState(state, {
		..._getState(state),
		cars: push(_getState(state).cars, [
			staticLODContainer,
			details,
			staticLODContainer.name
		])
	})
}

export let createState = (): car => {
	return {
		cars: [],
		stateMachineMap: Map(),
		// defenseFactorMap: Map(),
		hpMap: Map(),
		stressingTweens: [],
	}
}

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	// abstractState = Event.on(abstractState, Pick.getPickEventName(), _pickEventHandler)

	// abstractState = Scene.setPickableOctrees(abstractState,
	// 	Scene.getPickableOctrees(abstractState).concat(_getState(state).cars.map(data => data[0]))
	// )

	// abstractState = Collision.setPlayerMoveCollisionableContainers(abstractState, Collision.getPlayerMoveCollisionableContainers(abstractState).concat(_getState(state).cars.map(data => data[0])))

	state = setAbstractState(state, abstractState)

	return Promise.resolve(state)
}


// let _updateDamageStatus = (state, name, status) => {
// 	return _setState(state, {
// 		..._getState(state),
// 		damageAnimationStatusMap: _getState(state).damageAnimationStatusMap.set(name, status)
// 	})
// }

// let _getDamageStatus = (state, name) => {
// 	return NullableUtils.getExn(_getState(state).damageAnimationStatusMap.get(name))
// }

// let _getDefenseFactor = (state, name) => {
// 	return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
// }

let _getFullHp = (state: state, name) => {
	return getValue(state).hp
}

let _getHp = (state, name) => {
	// return NullableUtils.getExn(_getState(state).hpMap.get(name))
	return NullableUtils.getWithDefault(_getState(state).hpMap.get(name), 0)
}


let _getHpWithDefault = (state, name) => {
	return NullableUtils.getWithDefault(_getState(state).hpMap.get(name), 0)
}


export let getHpRatio = (state, name) => {
	return _getHpWithDefault(state, name) / _getFullHp(state, name)
}

let _updateHp = (state, name, hp) => {
	return _setState(state, {
		..._getState(state),
		hpMap: _getState(state).hpMap.set(name, hp)
	})
}

let _removeAndClearTweens = (state) => {
	ArticluatedAnimation.removeTweens(getAbstractState(state), _getState(state).stressingTweens)

	return _clearTweens(state)
}

let _addTweens = (state, stressingTweens) => {
	return _setState(state, {
		..._getState(state),
		stressingTweens: _getState(state).stressingTweens.concat(stressingTweens)
	})
}

let _clearTweens = (state) => {
	return _setState(state, {
		..._getState(state),
		stressingTweens: []
	})
}


// let _handleStressing = (state, _, [matrixs, boxes, names, damages], direction) => {
// 	return playStressingAnimation(state, [_getFullHp, _updateDamageStatus, (obj, object, matrix, [position, quat, scale]) => {
// 		updatePositionTween(matrix, object, quat, scale)
// 	}, (_, matrix) => {
// 		return getTransformData(matrix)
// 	}, (state, _) => {
// 		return state
// 	}], null, [matrixs, boxes, names, damages])
// }

// let _handleDestroyed = (state, octree, name) => {
// 	return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(octree, name)).then(state => {
// 		octree.setStatus(name, buildStatus(false, false, true))

// 		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 			octree.setStatus(name, buildStatus(false, false, false))

// 			return Promise.resolve(state)
// 		}, DamageUtils.getDisappearLoopCount()))
// 	})
// }

// let _playDestroyingAnimation = (state, octree, [matrixs, boxes, names, damages], forceDirection) => {
// 	return playDestroyingAnimation(state, [_getFullHp, _updateDamageStatus, _handleDestroyed, (obj, object, matrix, [position, quat, scale]) => {
// 		updatePositionTween(matrix, object, quat, scale)
// 	}, (_, matrix) => {
// 		return getTransformData(matrix)
// 	}], octree, [matrixs, boxes, names, damages])
// }

export let damage = (state: state, forceData, weaponValue_, fromName, damagePosition,
	// critRatioFactor,
	// attackFactor,
	transforms, boxes, names) => {
	return DamageUtils.damage(
		state, [
		// _getDefenseFactor,
		// // getZeroFactor,
		// // getZeroFactor,
		// getZeroFactor,
		_getHp, _updateHp,

		_getStateMachine,
		_setStateMachine,
		createStressingState,
		createDestroyingState,
	],
		forceData, weaponValue_, fromName,
		damagePosition,
		getNoneArmorData(),
		transforms, boxes, names
	)
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
			_,
			[matrix, box, name, damage, damageType_], direction
		]: any) => {
			return Promise.resolve(playStressingAnimation(state, [
				_addTweens,
				_getFullHp, (object, matrix) => {
					updatePositionTween(matrix, object)
				}, (_, matrix) => {
					return getTransformData(matrix)
				},
				_getStateMachine,
				_setStateMachine,
				createInitialState
			], [matrix, box, name, damage, damageType_]))

		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _disposeData = (state: state, name) => {
	state = _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.remove(name),
		hpMap: _getState(state).hpMap.remove(name),
	})

	return state
}

export let createDestroyedState = (): fsm_state<state> => {
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
				return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
					LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, false))

					state = disposeAllData(state, _disposeData, name)

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
			[matrix, box, name, damage, damageType_], forceDirection
		]: any) => {
			return Event.trigger<state>(state, getAbstractState, getDestroyingEventName(), buildDestroyintEventData(fromName, name)).then(state => {
				LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, true))

				return Promise.resolve(playDestroyingAnimation(state, [
					_removeAndClearTweens,
					_getFullHp, (object, matrix) => {
						updatePositionTween(matrix, object)
					}, (_, matrix) => {
						return getTransformData(matrix)
					},
					_getStateMachine,
					_setStateMachine,
					(state) => {
						let position = TransformUtils.getPositionFromMatrix4(matrix)

						state = generateReward(state, fromName, parseNamePrefix(state, name), name, position, position, 2)

						return [state, createDestroyedState()]
					}

				], fromName, [matrix, box, name, damage, damageType_]))
			})
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let initialAttributes = (state, name) => {
	state = setCamp(state, name, camp.None)

	state = setDefenseFactor(state, name, getValue(state).defenseFactor)

	return _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
		// defenseFactorMap: _getState(state).defenseFactorMap.set(name, getValue(name).defenseFactor),
		hpMap: _getState(state).hpMap.set(name, _getFullHp(state, name)),
	})
}

export let dispose = (state: state) => {
	_getState(state).cars.forEach(([staticLODContainer,
		details,
		name
	]) => {
		staticLODContainer.dispose()
	})


	state = _setState(state, createState())

	return Promise.resolve(state)
}

export let getSnapshot = () => `./resource/ui/in_game/snapshot/car.png`