import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getState, setState, getScene, getBuildingBreakSoundResourceId, getBuildingRuinDiffuseResourceId, getBuildingRuinRoughnessResourceId, getBuildingRuinNormalResourceId } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, DoubleSide, Euler, Float32BufferAttribute, Group, Material, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, Quaternion, RepeatWrapping, Texture, TextureLoader, Vector3 } from "three"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { building, objectStateName } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { Terrain } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
import { Loader } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { assertTrue, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { ConvexObjectBreaker } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../../utils/DamageUtils"
import { toRadians } from "../../../../../utils/QuatUtils"
import { Map } from "immutable"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, getDestroyedEventName } from "../../utils/EventUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { addBuilding, addDestroyedBuilding } from "./Mission"
import { Collision } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../utils/LODQueueUtils"
import { buildRandomDirectionInXZ, computeDirectionAxis } from "../../../../../utils/DirectionUtils"
import { CSG } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { createDecalMaterial } from "meta3d-jiehuo-abstract/src/decal/Decal"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../data/DataUtils"
import { articluatedAnimationName, defenseFactor, excitement, hp } from "../../data/DataType"
import { getTransformData, updatePositionTween, updateRotateTween } from "../../data/InstancedLOD2Utils"
import { objectValue } from "../../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { fsm_state, name, shadowLevel, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { buildStatus } from "../../utils/LODContainerUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../utils/SoundUtils"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).building)
}

let _setState = (state: state, treeState: building) => {
	return setState(state, {
		...getState(state),
		building: NullableUtils.return_(treeState)
	})
}

export let getNamePrefix = () => "Building"

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

// export let buildBuildingName = (categoryName, index) => `${categoryName}_${index}`

// export let buildCrackDecalCategoryName = (index) => `building_crackDecal_${index}`

export let isBuildings = (name: string) => {
	return name.includes(getNamePrefix())
}

export let getValue = (state: state, name: string): objectValue => {
	return {
		excitement: excitement.VeryHigh,
		defenseFactor: defenseFactor.Middle,
		// hp: name.includes("big") ? hp.VeryHigh : hp.High
		hp: name.includes("big") ? hp.VeryHigh : hp.High
	}
}


// let _buildDestroyingFragments = (state: state, mesh: Mesh,
// 	fragmentMaterial,
// 	// meshPosition,
// 	{
// 		pointOfImpact,
// 		normal,
// 		maxRadialIterations,
// 		maxRandomIterations,
// 	}) => {
// 	requireCheck(() => {
// 		test("mesh shouldn't move", () => {
// 			return mesh.position.equals(new Vector3(0, 0, 0))
// 		})
// 	}, getIsDebug(state))


// 	let convexBreaker = new ConvexObjectBreaker.ConvexObjectBreaker();

// 	let fragments = convexBreaker.subdivideByImpact(mesh.clone(), pointOfImpact, normal,
// 		maxRadialIterations,
// 		maxRandomIterations,
// 	) as Array<Mesh>

// 	return fragments.map(fragment => {
// 		_boxUVUnwrap(fragment);

// 		fragment.material = fragmentMaterial

// 		// fragment.position.add(meshPosition)

// 		return fragment
// 	})
// }

// let _buildFragments = (octree, state: state) => {
// 	// let buildings = getState(state).building.buildings


// 	// let brickMap = Loader.getResource<Texture>(getAbstractState(state), getBrickResourceId())
// 	// brickMap.wrapS = RepeatWrapping;
// 	// brickMap.wrapT = RepeatWrapping;
// 	// brickMap.repeat.set(4, 4);

// 	// let mesh = _getMesh(octree)

// 	// // let [transforms, boxes, names] = octree.queryRangeByBox(boxRange)

// 	// let material = (mesh.material as MeshBasicMaterial).clone()
// 	// material.map = brickMap;
// 	// material.needsUpdate = true;


// 	// let position = new Vector3()
// 	// transform.decompose(position, new Quaternion(), new Vector3())


// 	// let scale = 5

// 	// let pointOfImpact = new Vector3(Math.random() * scale - scale / 2, Math.random() * scale - scale / 2, Math.random() * scale - scale / 2)

// 	// let normal = new Vector3(Math.random() * scale - scale / 2, Math.random() * scale - scale / 2, Math.random() * scale - scale / 2)

// 	// return _buildDestroyingFragments(state, mesh,
// 	// 	material,
// 	// 	// position,
// 	// 	{
// 	// 		pointOfImpact,
// 	// 		normal,
// 	// 		maxRadialIterations: 1,
// 	// 		maxRandomIterations: 2
// 	// 	})



// 	let mesh = _getMesh(octree)

// 	requireCheck(() => {
// 		test("mesh shouldn't move", () => {
// 			return mesh.position.equals(new Vector3(0, 0, 0))
// 		})
// 	}, getIsDebug(state))

// 	let box = octree.computeBox()
// 	let halfCubeMesh = NewThreeInstance.createMesh(
// 		NewThreeInstance.createBoxGeometry(1, 1, 1, 1, 1),
// 		NewThreeInstance.createMeshBasicMaterial({
// 		})
// 	)
// 	halfCubeMesh.scale.copy(box.getSize(new Vector3()))
// 	halfCubeMesh.position.copy(box.getCenter(new Vector3()))
// 	halfCubeMesh.position.setX(halfCubeMesh.position.x + box.getSize(new Vector3()).x / 2)

// 	let fragment1 = CSG.subtracts(
// 		mesh, [
// 		halfCubeMesh
// 	]
// 	)


// 	halfCubeMesh.position.setX(halfCubeMesh.position.x - box.getSize(new Vector3()).x)

// 	let fragment2 = CSG.subtracts(
// 		mesh, [
// 		halfCubeMesh
// 	]
// 	)



// 	return [fragment1, fragment2]
// }

export let addStaticLODContainerData = (state: state,
	staticLODContainer,
	details,
) => {
	return _setState(state, {
		..._getState(state),
		// buildings: push(_getState(state).buildings, [[
		// 	octree,
		// 	details,
		// 	octree.name
		// ], _buildFragments(octree, state)])
		buildings: push(_getState(state).buildings, [
			staticLODContainer,
			details,
			staticLODContainer.name
		])
	})
}

export let createState = (): building => {
	return {
		buildings: [],

		crackDecalLODQueueMap: Map(),
		isAddCrackDecalMap: Map(),

		stateMachineMap: Map(),
		defenseFactorMap: Map(),
		hpMap: Map(),

		ruinOriginBox: null,
		ruinQueue: null,
		aviailableRuinNames: [],
	}
}

let _buildRuinName = (index) => {
	return `ruin_${index}`
}

let _getRuinHeight = () => 1

let _buildRuinQueue = (state: state) => {
	const count = 500
	const distance = 1000

	let ruin = NewThreeInstance.createMesh(
		NewThreeInstance.createBoxGeometry(1, _getRuinHeight(), 1, 1, 1),
		NewThreeInstance.createMeshPhongMaterial({
			map: Loader.getResource<Texture>(getAbstractState(state), getBuildingRuinDiffuseResourceId()),
			transparent: false,
		})
		// NewThreeInstance.createMeshPhysicalMaterial({
		// 	map: Loader.getResource<Texture>(getAbstractState(state), getBuildingRuinDiffuseResourceId()),
		// 	roughnessMap: Loader.getResource<Texture>(getAbstractState(state), getBuildingRuinRoughnessResourceId()),
		// 	normalMap: Loader.getResource<Texture>(getAbstractState(state), getBuildingRuinNormalResourceId()),
		// 	transparent: false,
		// })
	)

	let scene = getScene(state)

	//let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	let data = buildQueue(state, _buildRuinName, count, distance, scene, ruin)
	state = data[0]
	let box = data[1]
	let queue = data[2]
	let names = data[3]


	state = _setState(state, {
		..._getState(state),
		ruinOriginBox: NullableUtils.return_(box),
		ruinQueue: NullableUtils.return_(queue),
		aviailableRuinNames: names
	})

	return state
}

// let _getAllStaticLODContainers = (state: state) => {
// 	return _getState(state).buildings.map(data => data[0])
// }

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	// let octrees = getAllOctrees(state)

	// abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(octrees))
	// abstractState = Collision.setCameraCollisionableOctrees(abstractState, Collision.getCameraCollisionableOctrees(abstractState).concat(octrees))

	state = setAbstractState(state, abstractState)

	state = _buildRuinQueue(state)

	return Promise.resolve(state)
}

// let _boxUVUnwrap = (mesh, sourceMesh = mesh) => {
// 	//Box UV unwrap by thrax... takes optional sourceMesh to use as unwrap reference bounds
// 	let pa = mesh.geometry.attributes.position.array;
// 	let na = mesh.geometry.attributes.normal.array;
// 	let ta = new Float32Array(pa.length * 2 / 3);
// 	let n = new Vector3()
// 	let p = new Vector3()
// 	let sz = new Vector3()
// 	if (!sourceMesh.geometry.boundingBox)
// 		sourceMesh.geometry.computeBoundingBox()
// 	sourceMesh.geometry.boundingBox.getSize(sz)
// 	for (let i = 0, ui = 0; i < pa.length; i += 3, ui += 2) {
// 		p.set(pa[i], pa[i + 1], pa[i + 2]);
// 		if (sourceMesh !== mesh)
// 			sourceMesh.worldToLocal(mesh.localToWorld(p))

// 		p.sub(sourceMesh.geometry.boundingBox.min);
// 		p.divide(sz)
// 		n.set(Math.abs(na[i]), Math.abs(na[i + 1]), Math.abs(na[i + 2]));
// 		if (n.x >= n.y) {
// 			if (n.x > n.z) {//YZ
// 				ta[ui] = p.y;
// 				ta[ui + 1] = p.z
// 			} else {//XY
// 				ta[ui] = p.y
// 				ta[ui + 1] = p.x
// 			}
// 		} else {
// 			if (n.y > n.z) {//XZ
// 				ta[ui] = p.x
// 				ta[ui + 1] = p.z
// 			} else {//XY
// 				ta[ui] = p.x
// 				ta[ui + 1] = p.y
// 			}
// 		}
// 	}
// 	mesh.geometry.setAttribute('uv', new Float32BufferAttribute(ta, 2))
// }

let _addRuin = (state: state, point, size) => {
	// point.setY(0)

	return add(state, [
		state => {
			return NullableUtils.getExn(_getState(state).ruinQueue)
		},
		state => {
			return _getState(state).aviailableRuinNames
		},
		(state, aviailableRuinNames) => {
			return _setState(state, {
				..._getState(state),
				aviailableRuinNames
			})
		}
	], 50, NullableUtils.getExn(_getState(state).ruinOriginBox),
		// point,
		_v1.set(size.x, 1, size.z),
		_q.set(0, 0, 0, 1),
		point.clone().setY(point.y + _getRuinHeight() / 2)
	)
}


let _hasCrackDecalLODQueue = (state, name) => {
	return _getState(state).crackDecalLODQueueMap.has(name)
}

let _getCrackDecalLODQueue = (state, name) => {
	return NullableUtils.getExn(_getState(state).crackDecalLODQueueMap.get(name))
}

export let setCrackDecalLODQueue = (state, name, lodQueue) => {
	return _setState(state, {
		..._getState(state),
		crackDecalLODQueueMap: _getState(state).crackDecalLODQueueMap.set(name, lodQueue),
	})
}

let _getIsAddCrackDecal = (state, name) => {
	return NullableUtils.getWithDefault(_getState(state).isAddCrackDecalMap.get(name), false)
}

let _setIsAddCrackDecal = (state, name, isAddCrackDecal) => {
	return _setState(state, {
		..._getState(state),
		isAddCrackDecalMap: _getState(state).isAddCrackDecalMap.set(name, isAddCrackDecal),
	})
}


// let _getMesh = (octree) => {
// 	return octree.getGroup(0).children[0]
// }

// export let destroyInZone = (state: state, boxRange: Box3) => {
// 	// TODO remove
// 	state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
// 		speed: 10,
// 		range: 1,
// 		life: 5000,
// 		size: 50,
// 		position: [0, 0, 0]
// 	}))





// 	let buildings = getState(state).building.buildings

// 	let allFragments = buildings.reduce((result, [[octree, details, name], fragments]) => {
// 		let [transforms, boxes, names] = octree.queryRangeByBox(boxRange)

// 		return transforms.reduce((result, transform, i) => {
// 			// TODO perf: batch set
// 			let name = names[i]
// 			octree.setStatus(name, buildStatus(false, false, false))



// 			let position = new Vector3()
// 			transform.decompose(position, new Quaternion(), new Vector3())

// 			return result.concat(
// 				fragments.map(fragment => {
// 					return fragment.clone()
// 				}).map(fragment => {
// 					fragment.position.add(position)

// 					return fragment
// 				})
// 			)
// 		}, result)
// 	}, [])

// 	if (allFragments.length == 0) {
// 		return state
// 	}

// 	let scene = getScene(state)

// 	let data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene,
// 		allFragments
// 	)
// 	state = setAbstractState(state, data[0])
// 	let instancedMeshes = data[1]
// 	scene = data[2]


// 	return playDestroyingArticluatedAnimation(
// 		state,
// 		instancedMeshes,
// 		allFragments,
// 		scene,
// 	)
// }

let _getDefenseFactor = (state, name) => {
	return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
}

let _getFullHp = (state, name) => {
	return getValue(state, name).hp
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

export let damage = (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
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

export let createInitialState = (): fsm_state<state> => {
	return {
		name: objectStateName.Initial,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, name) => {
			if (
				!_hasCrackDecalLODQueue(state, name)
				|| _getIsAddCrackDecal(state, name)
				|| _getHp(state, name) >= (_getFullHp(state, name) * 3 / 4)
			) {
				return Promise.resolve(state)
			}

			LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, true))

			state = _setIsAddCrackDecal(state, name, true)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			_,
			[matrix, box, name, damage], direction
		]: any) => {
			let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Stressing_Rotate1)

			let [position, quat, scale] = getTransformData(matrix)

			let axis = computeDirectionAxis(buildRandomDirectionInXZ(), getIsDebug(state))


			playArticluatedAnimation(state,
				[
					object => {
						updateRotateTween(matrix, object, position, quat.clone(), scale, axis)
					},
					state => {
					},
					state => {
						let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(state, name))
						let amplitude = DamageUtils.clamp(6 * damageRadio, 4)
						let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)

						return [amplitude, timeScalar]
					},
					(allTweens) => {
						DamageUtils.handleTweenRepeatComplete(
							[
								_getStateMachine,
								_setStateMachine,
								createInitialState
							],

							allTweens, articluatedAnimationData.repeatCount, name)
					}
				],
				articluatedAnimationData
			)
			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _removeCrackDecal = (state, name) => {
	if (!_hasCrackDecalLODQueue(state, name)) {
		return state
	}

	state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, false)))

	return _setIsAddCrackDecal(state, name, false)

}

export let createDestroyedState = (): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			fromName,
			position, size, name
		]: any) => {
			requireCheck(() => {
				test("position.y should be 0", () => {
					return position.y == 0
				})
			}, getIsDebug(state))

			// octree.setStatus(name, buildStatus(false, false, false))
			LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, false))

			state = _removeCrackDecal(state, name)

			state = _addRuin(state, position, size)

			state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
				speed: 5,
				// range: 1,
				life: 100 * size.length(),
				size: size.length(),
				// life: 5000,
				// size: 50,
				position: position.toArray()
			}))


			state = addDestroyedBuilding(state)

			return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name))
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
			LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, true))

			// let [position, quat, scale] = getTransformData(matrix)
			let position = TransformUtils.getPositionFromMatrix4(matrix)


			state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(getBuildingBreakSoundResourceId(), getIsDebug(state),
					getVolume(
						state, 1, position, 0
					)
				)
			))

			let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Destroyed_Move1)


			let crackDecalMatrix = NullableUtils.getEmpty<Matrix4>()
			// let crackDecalPosition = NullableUtils.getEmpty<Vector3>()
			// let crackDecalQuat = NullableUtils.getEmpty<Quaternion>()
			// let crackDecalScale = NullableUtils.getEmpty<Vector3>()
			if (_getIsAddCrackDecal(state, name)) {
				let crackDecalLODQueue = _getCrackDecalLODQueue(state, name)

				// crackDecalMatrix = NullableUtils.getExn(crackDecalLODQueue.findTransformByName(name))
				crackDecalMatrix = NullableUtils.getExn(crackDecalLODQueue.find<nullable<Matrix4>>((_, index) => {
					if (crackDecalLODQueue.names[index] == name) {
						return NullableUtils.return_(crackDecalLODQueue.transforms[index])
					}

					return NullableUtils.getEmpty()
				}))

				// crackDecalPosition = new Vector3()
				// crackDecalQuat = new Quaternion()
				// crackDecalScale = new Vector3()
				// crackDecalMatrix.decompose(crackDecalPosition, crackDecalQuat, crackDecalScale)


				// let crackDecalPosition = TransformUtils.getPositionFromMatrix4(crackDecalMatrix)

				// if (!crackDecalPosition.equals(position)) {
				// 	throw new Error("err")
				// }
			}


			playArticluatedAnimation(state,
				[
					object => {
						updatePositionTween(matrix, object)

						if (!NullableUtils.isNullable(crackDecalMatrix)) {
							updatePositionTween(
								NullableUtils.getExn(crackDecalMatrix),
								object,
								// NullableUtils.getExn(crackDecalQuat),
								// NullableUtils.getExn(crackDecalScale),
							)
						}

					},
					state => {
						return position
					},
					state => {
						let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(state, name))
						let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)


						let height = box.getSize(_v1).y

						let endY = position.y - height

						return [position, endY, timeScalar]
					},
					(allTweens) => {
						allTweens[allTweens.length - 1].onComplete(() => {
							let state = readState()

							ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

							return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createDestroyedState(), name, [
								fromName,
								box.getCenter(new Vector3()).setY(0), box.getSize(new Vector3()), name]).then(writeState)
						})

					}
				],
				articluatedAnimationData
			)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
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

export let initialAttributes = (state, name) => {
	state = addBuilding(state)

	return _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
		defenseFactorMap: _getState(state).defenseFactorMap.set(name, getValue(state, name).defenseFactor),
		hpMap: _getState(state).hpMap.set(name, _getFullHp(state, name)),
	})
}

export let dispose = (state: state) => {
	_getState(state).buildings.forEach(([staticLODContainer,
		details,
		name
	]) => {
		staticLODContainer.dispose()
	})

	state = _setState(state, createState())

	return Promise.resolve(state)
}

// export let getAllDetails = (state: state) => {
// 	return _getState(state).buildings.map(data => data[1])
// }