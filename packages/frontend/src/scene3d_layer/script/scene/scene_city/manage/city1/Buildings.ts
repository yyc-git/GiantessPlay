import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getState, setState, getScene, getBuildingBreakSoundResourceId, getBuildingRuinDiffuseResourceId, getBuildingRuinRoughnessResourceId, getBuildingRuinNormalResourceId, getBuildingBrickRoughnessResourceId } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, DoubleSide, Euler, Float32BufferAttribute, Group, Material, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Quaternion, RepeatWrapping, Texture, TextureLoader, Vector3 } from "three"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { building, camp, objectStateName } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { LeafGeometry } from "meta3d-jiehuo-abstract"
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
import { buildDestroyedEventData, buildDestroyintEventData, getDestroyedEventName, getDestroyingEventName } from "../../utils/EventUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { addBuilding, addDestroyedBuilding } from "../mission/Mission"
import { Collision } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../utils/AviailableLODQueueUtils"
import { buildQueue as buildReallocateQueue, getOrAddData, reallocate } from "../../utils/ReallocateLODQueueUtils"
import { buildRandomDirectionInXZ, computeDirectionAxis } from "../../../../../utils/DirectionUtils"
import { CSG } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { createDecalMaterial } from "meta3d-jiehuo-abstract/src/decal/Decal"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../data/DataUtils"
import { articluatedAnimationName, defenseFactor, excitement, hp } from "../../data/DataType"
import { getTransformData, updatePositionTween, updateRotateTween } from "../../data/InstancedLOD2Utils"
import { objectValue } from "../../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { fsm_state, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { buildStatus } from "../../utils/LODContainerUtils"
import { Flow } from "meta3d-jiehuo-abstract"

import { LOD } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../utils/SoundUtils"
import { setCamp } from "./Army"
import { generateReward } from "../../reward/RewardGenerator"
import { parseNamePrefix } from "../../utils/ArmyUtils"
import { AmbientLight } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { disposeAllData, getNoneArmorData } from "../../utils/OctreeObjectUtils"
import { setDefenseFactor } from "../../StaticDynamicUnit"
import { getRenderSetting } from "../../../../../mod/SettingMod"
import { physicsLevel } from "setting-default/src/Type"
import { getFarDistance } from "./WholeScene"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { getIsShowBuildingSmoke } from "../../UI"
import { getBoxVolumn } from "../../utils/Box3Utils"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).building)
}

let _setState = (state: state, treeState: building) => {
	return setState(state, {
		...getState(state),
		building: NullableUtils.return_(treeState)
	})
}

export let getBigBuildingName = () => "BigBuilding"

export let getMiddleBuildingName = () => "MiddleBuilding"

export let getSmallBuildingName = () => "SmallBuilding"

export let getNamePrefix = () => "Building"
// export let getNamePrefix = () => getLanguageTextData(readState(), languageKey.Building)

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

		// fragmentCubeOriginBox: NullableUtils.getEmpty(),
		fragmentCubeQueue: NullableUtils.getEmpty(),
		// aviailablefragmentCubeNames: [],
		reallocateFragmentCubeQueueIndex: [],
		fragmentCubeQueueMaxCount: _buildDefaultFragmentCubeMaxCount(),


		crackDecalLODQueueMap: Map(),
		isAddCrackDecalMap: Map(),

		stateMachineMap: Map(),
		// defenseFactorMap: Map(),
		hpMap: Map(),

		ruinOriginBox: NullableUtils.getEmpty(),
		ruinQueue: NullableUtils.getEmpty(),
		aviailableRuinNames: [],

		stressingTweens: [],
	}
}

let _buildRuinName = (index) => {
	return `ruin_${index}`
}

let _getRuinHeight = () => 1

let _buildRuinQueue = (state: state) => {
	const count = 500

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


	let data = buildQueue(state, _buildRuinName, count, getFarDistance, scene, ruin)
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

let _buildDefaultFragmentCubeMaxCount = () => 2000

let _isReachFragmentCubeMaxCount = (state) => {
	return MutableMapUtils.getCount(_getState(state).fragmentCubeQueue.names) >= _getState(state).fragmentCubeQueueMaxCount
}

let _intervalCheckAndIncreaseFragmentCubeMaxCount = (state: state) => {
	return setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, (state) => {
		if (_isReachFragmentCubeMaxCount(state)) {
			state = _setState(state, {
				..._getState(state),
				fragmentCubeQueueMaxCount: _getState(state).fragmentCubeQueueMaxCount + _buildDefaultFragmentCubeMaxCount()
			})
		}

		return Promise.resolve(state)
	}], 3, "_intervalCheckAndIncreaseFragmentCubeMaxCount"))
}

let _buildFragmentCubeQueue = (state: state) => {
	let texture = Loader.getResource<Texture>(getAbstractState(state), getBuildingBrickRoughnessResourceId())

	let mesh: Mesh = NewThreeInstance.createMesh(
		NewThreeInstance.createBoxGeometry(1, 1, 1, 1, 1, 1),
		NewThreeInstance.createMeshPhongMaterial({
			map: texture,
		})
	)


	let data = buildReallocateQueue(state, material => material, getFarDistance, mesh, {
		castShadow: false,
		receiveShadow: false
	})
	state = data[0]
	let queue = data[1]

	state = _setState(state, {
		..._getState(state),
		fragmentCubeQueue: NullableUtils.return_(queue),
	})

	state = _intervalCheckAndIncreaseFragmentCubeMaxCount(state)

	return state
}

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	// let octrees = getAllOctrees(state)

	// abstractState = Collision.setPlayerMoveCollisionableContainers(abstractState, Collision.getPlayerMoveCollisionableContainers(abstractState).concat(octrees))
	// abstractState = Collision.setCameraCollisionableOctrees(abstractState, Collision.getCameraCollisionableOctrees(abstractState).concat(octrees))

	state = setAbstractState(state, abstractState)

	state = _buildRuinQueue(state)
	state = _buildFragmentCubeQueue(state)

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

let _getCrackDecalLODQueueNullable = (state, name) => {
	return _getState(state).crackDecalLODQueueMap.get(name)
}

let _getCrackDecalLODQueue = (state, name) => {
	return NullableUtils.getExn(_getCrackDecalLODQueueNullable(state, name))
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

// let _getDefenseFactor = (state, name) => {
// 	return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
// }

let _getFullHp = (state, name) => {
	return getValue(state, name).hp
}

let _getHp = (state, name) => {
	// return NullableUtils.getExn(_getState(state).hpMap.get(name))
	return NullableUtils.getWithDefault(_getState(state).hpMap.get(name), 0)
}

let _getHpWithDefault = (state, name) => {
	return NullableUtils.getWithDefault(_getState(state).hpMap.get(name), 0)
}


// export let hasHp = (state, name) => {
// 	return _getState(state).hpMap.has(name)
// }

export let getHpRatio = (state, name) => {
	return _getHpWithDefault(state, name) / _getFullHp(state, name)
}

let _updateHp = (state, name, hp) => {
	return _setState(state, {
		..._getState(state),
		hpMap: _getState(state).hpMap.set(name, hp)
	})
}

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

		getStateMachine,
		_setStateMachine,
		createStressingState,
		createDestroyingState,
	], forceData, weaponValue_, fromName, damagePosition,
		getNoneArmorData(),
		transforms, boxes, names,
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


			// LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, true))
			// LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, true))
			_getCrackDecalLODQueue(state, name).setStatusByName(name, buildStatus(false, false, true))

			state = _setIsAddCrackDecal(state, name, true)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
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


export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, [
			_,
			[matrix, box, name, damage, damageType_], direction
		]: any) => {
			let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Stressing_Rotate1)

			let [position, quat, scale] = getTransformData(matrix)

			let axis = computeDirectionAxis(buildRandomDirectionInXZ(), getIsDebug(state))


			let allTweens = playArticluatedAnimation(state,
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
								getStateMachine,
								_setStateMachine,
								createInitialState
							],

							allTweens, articluatedAnimationData.repeatCount, name)
					},
					NullableUtils.getEmpty()
				],
				articluatedAnimationData
			)

			state = _addTweens(state, allTweens)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _removeCrackDecal = (state, name) => {
	// if (!_hasCrackDecalLODQueue(state, name)) {
	// 	return state
	// }

	// state = setAbstractState(state, LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, false)))

	// return _setIsAddCrackDecal(state, name, false)
	return NullableUtils.getWithDefault(
		NullableUtils.map(queue => {
			queue.setStatusByName(name, buildStatus(false, false, false))

			return _setIsAddCrackDecal(state, name, false)
		}, _getCrackDecalLODQueueNullable(state, name)),
		state
	)
}

let _disposeData = (state: state, name) => {
	state = _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.remove(name),
		hpMap: _getState(state).hpMap.remove(name),
		crackDecalLODQueueMap: _getState(state).crackDecalLODQueueMap.remove(name),
		isAddCrackDecalMap: _getState(state).isAddCrackDecalMap.remove(name),
	})

	return state
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

			// LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, false))

			// state = _removeCrackDecal(state, name)

			state = _addRuin(state, position, size)

			if (getIsShowBuildingSmoke(state)) {
				state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
					speed: 5,
					// range: 1,
					// life: 100 * size.length(),
					life: NumberUtils.lessThan(100 * size.length(), 5000),
					size: size.length(),
					// life: 5000,
					// size: 50,
					position: position.toArray()
				}))
			}


			state = addDestroyedBuilding(state)


			// state = generateReward(state, fromName, parseNamePrefix(state, name), name, position, position, 2)


			return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
				return disposeAllData(state, _disposeData, name)
			})
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

let _getName = (index: lodQueueIndex) => {
	return `buildingFragment_${index}`
}

let _reduceFragmentData = (fragmentData, func) => {
	return fragmentData.reduce((heightOffset, heightData, heightIndex) => {
		return ArrayUtils.push(heightOffset, heightData.reduce((widthOffset, widthData, widthIndex) => {
			return ArrayUtils.push(widthOffset, widthData.reduce((depthOffset, _, depthIndex) => {
				return ArrayUtils.push(depthOffset, func())
			}, []))
		}, []))
	}, [])

}

let _forEachFragmentData = (fragmentData, func) => {
	fragmentData.forEach((heightData, heightIndex) => {
		heightData.forEach((widthData, widthIndex) => {
			widthData.forEach((data, depthIndex) => {
				func(data, heightIndex, widthIndex, depthIndex)
			})
		})
	})
}

let _getCubePositionValue = (positionValue: number, cubeDimensionSize: number, index, count) => {
	return positionValue + cubeDimensionSize * (index - (count - 1) / 2)
}

let _changeToDestroyedState = (state: state, fromName, buildingBox: Box3, buildingName) => {
	return StateMachine.changeAndExecuteState(state, _setStateMachine, getStateMachine(state, buildingName), createDestroyedState(), buildingName, [
		fromName,
		buildingBox.getCenter(new Vector3()).setY(0), buildingBox.getSize(new Vector3()), buildingName])
}

let _playFragmentsAnimation = (state: state, fromName, buildingBox: Box3, buildingName) => {
	if (_isReachFragmentCubeMaxCount(state)) {
		return _changeToDestroyedState(state, fromName, buildingBox, buildingName)
	}


	let minCount, maxCount
	switch (getRenderSetting(state).physics) {
		case physicsLevel.VeryLow:
			minCount = 2
			maxCount = 3
			break
		case physicsLevel.Low:
			minCount = 2
			maxCount = 4
			break
		case physicsLevel.Middle:
			minCount = 3
			maxCount = 4
			break
		case physicsLevel.High:
			minCount = 4
			maxCount = 7
			break
		case physicsLevel.VeryHigh:
			minCount = 5
			maxCount = 8
			break
	}
	const widthCount = NumberUtils.getRandomInteger(minCount, maxCount)
	const depthCount = NumberUtils.getRandomInteger(minCount, maxCount)
	const heightCount = NumberUtils.getRandomInteger(minCount, maxCount)


	let fragmentData = ArrayUtils.range(0, heightCount - 1).reduce((heightData, i) => {
		return ArrayUtils.push(heightData, ArrayUtils.range(0, widthCount - 1).reduce((widthData, i) => {
			return ArrayUtils.push(widthData, ArrayUtils.range(0, depthCount - 1).reduce((depthData, i) => {
				return ArrayUtils.push(depthData, getOrAddData(state, _getName, _getState(state).reallocateFragmentCubeQueueIndex, _getState(state).fragmentCubeQueue))
			}, []))
		}, []))
	}, [])

	let fragmentOffset = _reduceFragmentData(fragmentData, () => new Vector3(0, 0, 0))
	let fragmentOffsetXZDirection = _reduceFragmentData(fragmentData, () => [
		NumberUtils.randomSelect(
			[-1, 1]
		),
		NumberUtils.randomSelect(
			[-1, 1]
		)
	])

	// let size = buildingBox.getSize(_v1)
	// let center = buildingBox.getCenter(_v2)
	let size = buildingBox.getSize(new Vector3())
	let center = buildingBox.getCenter(new Vector3())

	let cubeHeightSize = size.y / heightCount
	let cubeWidthSize = size.x / widthCount
	let cubeDepthSize = size.z / depthCount

	const offsetXSpeed = NumberUtils.getRandomFloat(0.007, 0.012)
	const offsetZSpeed = NumberUtils.getRandomFloat(0.007, 0.012)
	const offsetYSpeed = NumberUtils.getRandomFloat(0.007, 0.012)


	let object = { x: center.x, y: center.y, z: center.z }

	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to({
			x: center.x, y: 0, z: center.z
		}, 2000 + Math.random() * 1000)
		.onUpdate(() => {
			_forEachFragmentData(fragmentOffset, (offset, heightIndex, widthIndex, depthIndex) => {
				let ySpeedFactor = 1 + heightIndex * 0.5
				let [xDirection, zDirection] = fragmentOffsetXZDirection[heightIndex][widthIndex][depthIndex]

				offset.add(
					_v1.set(
						offsetXSpeed * cubeWidthSize * xDirection,

						-offsetYSpeed * ySpeedFactor * cubeHeightSize,

						offsetZSpeed * cubeDepthSize * zDirection,
					)
				)
			})


			let position = _v1.set(object.x, object.y, object.z)

			_forEachFragmentData(fragmentData, ([index, transform, box], heightIndex, widthIndex, depthIndex) => {
				let s = _v2.set(cubeWidthSize, cubeHeightSize, cubeDepthSize)
				let pos = _v3.set(
					_getCubePositionValue(position.x, cubeWidthSize, widthIndex, widthCount),
					_getCubePositionValue(position.y, cubeHeightSize, heightIndex, heightCount),
					_getCubePositionValue(position.z, cubeDepthSize, depthIndex, depthCount),
				).add(
					fragmentOffset[heightIndex][widthIndex][depthIndex]
				)

				transform.compose(
					pos,
					_q.set(0, 0, 0, 1),
					s
				)
				box.setFromCenterAndSize(
					pos,
					s
				)
			})

		})
		.onComplete(() => {
			let state = readState()

			ArticluatedAnimation.removeTween(getAbstractState(state), tween)

			let queue = _getState(state).fragmentCubeQueue

			_forEachFragmentData(fragmentData, ([index, transform, box], heightIndex, widthIndex, depthIndex) => {
				state = reallocate(state, queue, _getState(state).reallocateFragmentCubeQueueIndex, index)
			})

			return _changeToDestroyedState(state, fromName, buildingBox, buildingName).then(writeState)
		})

	tween.start()

	ArticluatedAnimation.addTween(getAbstractState(state), tween)

	return Promise.resolve(state)
}

let _isMiddleBuilding = (boxVolumn) => {
	return boxVolumn > 5000
}

let _isBigBuilding = (boxVolumn) => {
	return boxVolumn > 25000
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
				// LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, true))
				LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, false))

				// let [position, quat, scale] = getTransformData(matrix)
				let position = TransformUtils.getPositionFromMatrix4(matrix)


				state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
					SoundManager.buildNeedToPlaySoundData(getBuildingBreakSoundResourceId(), getIsDebug(state),
						getVolume(
							state, 1, position, 0
						)
					)
				))

				// let crackDecalMatrix = NullableUtils.getEmpty<Matrix4>()
				// // let crackDecalPosition = NullableUtils.getEmpty<Vector3>()
				// // let crackDecalQuat = NullableUtils.getEmpty<Quaternion>()
				// // let crackDecalScale = NullableUtils.getEmpty<Vector3>()
				// if (_getIsAddCrackDecal(state, name)) {
				// 	let crackDecalLODQueue = _getCrackDecalLODQueue(state, name)

				// 	// crackDecalMatrix = NullableUtils.getExn(crackDecalLODQueue.findTransformByName(name))
				// 	crackDecalMatrix = NullableUtils.getExn(crackDecalLODQueue.find<nullable<Matrix4>>((_, index) => {
				// 		if (crackDecalLODQueue.getName(index) == name) {
				// 			return NullableUtils.return_(crackDecalLODQueue.getTransform(index))
				// 		}

				// 		return NullableUtils.getEmpty()
				// 	}))

				// 	// crackDecalPosition = new Vector3()
				// 	// crackDecalQuat = new Quaternion()
				// 	// crackDecalScale = new Vector3()
				// 	// crackDecalMatrix.decompose(crackDecalPosition, crackDecalQuat, crackDecalScale)


				// 	// let crackDecalPosition = TransformUtils.getPositionFromMatrix4(crackDecalMatrix)

				// 	// if (!crackDecalPosition.equals(position)) {
				// 	// 	throw new Error("err")
				// 	// }
				// }




				state = _removeAndClearTweens(state)


				// let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Destroyed_Move1)

				// playArticluatedAnimation(state,
				// 	[
				// 		object => {
				// 			updatePositionTween(matrix, object)

				// 			if (!NullableUtils.isNullable(crackDecalMatrix)) {
				// 				updatePositionTween(
				// 					NullableUtils.getExn(crackDecalMatrix),
				// 					object,
				// 					// NullableUtils.getExn(crackDecalQuat),
				// 					// NullableUtils.getExn(crackDecalScale),
				// 				)
				// 			}

				// 		},
				// 		state => {
				// 			return position
				// 		},
				// 		state => {
				// 			let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(state, name))
				// 			let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)


				// 			let height = box.getSize(_v1).y

				// 			let endY = position.y - height

				// 			return [position, endY, timeScalar]
				// 		},
				// 		(allTweens) => {
				// 			allTweens[allTweens.length - 1].onComplete(() => {
				// 				let state = readState()

				// 				ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

				// 				return StateMachine.changeAndExecuteState(state, _setStateMachine, getStateMachine(state, name), createDestroyedState(), name, [
				// 					fromName,
				// 					box.getCenter(new Vector3()).setY(0), box.getSize(new Vector3()), name]).then(writeState)
				// 			})

				// 		}
				// 	],
				// 	articluatedAnimationData
				// )


				// state = generateReward(state, fromName, parseNamePrefix(state, name), name, position, position, 2)
				let volumn = getBoxVolumn(box)
				state = generateReward(state, fromName,
					_isBigBuilding(volumn) ? getBigBuildingName() : (
						_isMiddleBuilding(volumn) ? getMiddleBuildingName() : getSmallBuildingName()
					), name, position, position, 2)

				state = _removeCrackDecal(state, name)

				return _playFragmentsAnimation(state, fromName, box, name)
			})
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}


export let getStateMachine = (state: state, name: string) => {
	return NullableUtils.getExn(_getState(state).stateMachineMap.get(name))
}

let _setStateMachine = (state: state, name: string, stateMachine) => {
	return _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.set(name, stateMachine)
	})
}

export let initialAttributes = (state, name) => {
	state = setCamp(state, name, camp.None)

	state = addBuilding(state)

	state = setDefenseFactor(state, name, getValue(state, name).defenseFactor)

	return _setState(state, {
		..._getState(state),
		stateMachineMap: _getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
		// defenseFactorMap: _getState(state).defenseFactorMap.set(name, getValue(state, name).defenseFactor),
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

export let getSnapshot = () => `./resource/ui/in_game/snapshot/building.png`