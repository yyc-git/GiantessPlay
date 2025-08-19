import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { StaticLODContainer } from "meta3d-jiehuo-abstract"
import { getScene, getBuildingDamage1ResourceId, getCharacterShadowResourceId } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { AdditiveBlending, Box3, Box3Helper, ClampToEdgeWrapping, DoubleSide, Euler, Float32BufferAttribute, Group, LineSegments, LinearMipMapLinearFilter, Material, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MultiplyBlending, NearestFilter, NoBlending, NormalBlending, Object3D, OneFactor, OneMinusSrcAlphaFactor, Path, Quaternion, RepeatWrapping, SkinnedMesh, SrcAlphaFactor, SubtractEquation, SubtractiveBlending, Texture, TextureLoader, Vector3 } from "three"
import { getIsDebug, getIsProduction } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
// import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import * as Buildings from "./Buildings"
import * as Tiles from "./Tiles"
import * as Mountains from "./Mountains"
import * as Terrain from "./Terrain"
import * as TreesAndProps from "./TreesAndProps"
import * as Cars from "./Cars"
import * as MapWall from "./MapWall"
// import * as WindMills from "./WindMills"
import * as DynamicCars from "./DynamicCars"
import * as Citiyzen from "./Citiyzen"
import * as Soldier from "./soldier/Soldier"
import * as MilltaryVehicle from "./milltary_vehicle/MilltaryVehicle"
import * as MilltaryBuilding from "./milltary_building/MilltaryBuilding"
import * as Girl from "../../girl/Girl"
import * as LittleMan from "../../little_man/LittleMan"
import { AmbientLight } from "meta3d-jiehuo-abstract"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import { Shadow } from "meta3d-jiehuo-abstract"
import { Decal } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { changeToPhongMaterial, fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { crowdSize, lodQueueIndex, name, renderAccuracyLevel, shadowLevel } from "meta3d-jiehuo-abstract/src/type/StateType"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { buildStatus } from "../../utils/LODContainerUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { fontType, labelAnimation, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { PathFind } from "meta3d-jiehuo-abstract"
import { range } from "meta3d-jiehuo-abstract/src/ai/PathFind"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildNameInShadowQueue } from "../../utils/CharacterUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { LODQueue as LODQueueType } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { HierachyLODQueue as HierachyLODQueueType } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { addBox3Helper } from "../../utils/ConfigUtils"
import { buildShellTurretCategoryName } from "./milltary_building/ShellTurret"
import { buildMissileTurretCategoryName } from "./milltary_building/MissileTurret"
// import { getPositionY } from "./Army"


const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

type crowd = { name: string, position: Vector3, userData: any }

// let _getState = (state: state) => {
// 	return NullableUtils.getExn(getState(state).scene)
// }

// let _setState = (state: state, treeState: scene) => {
// 	return setState(state, {
// 		...getState(state),
// 		scene: NullableUtils.return_(treeState)
// 	})
// }

// let _getNamePrefix = () => "scene"

// export let buildCategoryName = (index) => `${_getNamePrefix()}_${index}`

// export let buildSceneName = (categoryName, index) => `${categoryName}_${index}`

// export let isScenes = (categoryName: string) => {
// 	return categoryName.includes(_getNamePrefix())
// }

// export let parseAndAddResources = (state: state) => {
// 	return Promise.resolve(state)
// }

// export let createState = (): scene => {
// 	return {
// 		cars: [],
// 		damageAnimationStatusMap: Map(),
// 		defenseFactorMap: Map(),
// 		hpMap: Map(),
// 	}
// }

let _group = (group) => {
	return Object3DUtils.group(group, (obj) => {
		return obj.name.match(/^(.+\d+)_+/)[1]
	})
}

let _buildNameForOctreeForStaticLODContainer = (getNamePrefixFunc, object: Mesh) => {
	return `${getNamePrefixFunc()}_${object.name}`
}

let _parseStaticGroup = (state, group, [getNamePrefixFunc, buildCategoryNameFunc, initialAttributesFunc, addStaticLODContainerDataFunc, handleDetailsFunc = (details, mesh, box) => details], {
	castShadow = true,
	receiveShadow = false,
	distance = 1000,
}) => {
	if (!state.config.isStaticCastShadow) {
		castShadow = false
	}

	let camera = Camera.getCurrentCamera(getAbstractState(state))


	let scene = getScene(state)

	// let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	let octreeForStaticLODContainer = LOD.getOctreeForStaticLODContainer(getAbstractState(state))


	let index = 0
	for (let mainName in group) {
		if (group.hasOwnProperty(mainName)) {
			let group_ = NewThreeInstance.createGroup()
			let mesh = group[mainName][0].clone()


			mesh = Object3DUtils.changeTransformToDefault(mesh)
			// mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material)
			mesh = changeToPhongMaterial(mesh)


			group_.add(mesh)


			group_.matrixAutoUpdate = false


			group_.castShadow = castShadow
			group_.receiveShadow = receiveShadow

			let details = [
				{
					group: group_,
					level: "l0",
					distance,
				},
			]


			let container = new StaticLODContainer.StaticLODContainer()

			container.name = buildCategoryNameFunc(index)
			// container.setName(mainName, buildCategoryNameFunc(index))

			container.details = details
			let box: Box3 = container.computeBox()

			details = handleDetailsFunc(details, mesh, box)

			container.details = details


			// let instancedlod = new InstancedLOD2.InstancedLOD2(lodContainerGroup, camera)
			let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

			instancedlod.setContainer(container);
			instancedlod.setLevels(details, getIsDebug(state));
			instancedlod.setPopulation();



			let indices = []

			state = group[mainName].reduce((state, object: Mesh) => {
				let newTransform = new Matrix4().compose(object.position, object.quaternion, object.scale)
				let newName = _buildNameForOctreeForStaticLODContainer(getNamePrefixFunc, object)
				// let newName = `${buildCategoryNameFunc(index)}_${object.name}`
				let newBox = box.clone().applyMatrix4(newTransform)



				// container.insert(newTransform, newBox, newName)
				// octreeForStaticLODContainer.insert(newTransform, newBox, newName)
				let abstactState = getAbstractState(state)

				let newIndex = LOD.getNewIndex(abstactState)
				octreeForStaticLODContainer.insert(newIndex, newBox)
				abstactState = LOD.addIndex(abstactState)

				indices.push(newIndex)

				// container.containIndex(newIndex)

				abstactState = LOD.setName(abstactState, newIndex, newName)
				abstactState = LOD.setStatus(abstactState, newIndex, buildStatus(true, true, true))
				abstactState = LOD.setTransform(abstactState, newIndex, newTransform)
				abstactState = LOD.setBox(abstactState, newIndex, newBox)

				state = setAbstractState(state, abstactState)





				state = initialAttributesFunc(state, newName)

				if (getIsDebug(state)) {
					addBox3Helper(getAbstractState(state), getScene(state), newBox, 0x1fff00)
				}

				return state
			}, state)

			container.minIndex = indices[0]
			container.maxIndex = indices[indices.length - 1]



			state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))



			state = addStaticLODContainerDataFunc(state, container, details)



			index += 1
		}
	}

	return state
}

// let _parseDynamicGroup = (state, [initialAttributesFunc, addLevelFunc, buildNameFunc], group, { castShadow, distance }) => {
// 	let scene = getScene(state)

// 	let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

// 	let index = 0
// 	for (let mainName in group) {
// 		if (group.hasOwnProperty(mainName)) {
// 			let instanceSourceLOD = new InstanceSourceLOD.InstanceSourceLOD()

// 			let obj = group[mainName][0].clone()
// 			obj.traverse(child => {
// 				if ((child as Mesh).isMesh) {
// 					// child.material = AmbientLight.makeMaterialToAceeptAmbientLight(child.material)
// 					child = changeToPhongMaterial(child)
// 				}
// 			})

// 			// let group_ = NewThreeInstance.createGroup()

// 			// instanceSourceLOD.matrixAutoUpdate = false

// 			// obj.matrixAutoUpdate = false
// 			// middle.matrixAutoUpdate = false
// 			// high.matrixAutoUpdate = false


// 			obj = Shadow.setShadow(obj, castShadow, true)


// 			obj = Object3DUtils.changeTransformToDefault(obj)
// 			instanceSourceLOD.computeBoundingBox(obj)



// 			// group_.add(obj)

// 			instanceSourceLOD.addLevel(obj, distance, 0, getIsDebug(state))
// 			// tree1.addLevel(middle, 250, 0, getIsDebug(state))
// 			// tree1.addLevel(low, +Infinity, 0, getIsDebug(state))

// 			instanceSourceLOD = addLevelFunc(instanceSourceLOD, obj)





// 			state = group[mainName].reduce((state, object: Mesh, i) => {
// 				let clonedOne = instanceSourceLOD.clone(true)
// 				let name = buildNameFunc(
// 					index,
// 					i
// 				)
// 				clonedOne.name = name

// 				clonedOne.position.copy(object.position)
// 				clonedOne.quaternion.copy(object.quaternion)
// 				clonedOne.scale.copy(object.scale)

// 				clonedOne.userData = object.userData

// 				dynamicGroup.add(clonedOne)

// 				state = initialAttributesFunc(state, name)

// 				return state
// 			}, state)


// 			index += 1
// 		}
// 	}


// 	return state
// }
let _parseDynamicGroup = (state, group, [
	buildLODQueueNameFunc,
	buildCategoryNameFunc,
	buildNamePrefixFunc,

	initialAttributesFunc, setDataFunc, handleDetailsFunc = (details, mesh, box) => details], {
		castShadow = true,
		distance = 1000,
	}) => {
	let camera = Camera.getCurrentCamera(getAbstractState(state))

	let scene = getScene(state)

	// let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	for (let mainName in group) {
		if (group.hasOwnProperty(mainName)) {
			// let group_ = NewThreeInstance.createGroup()
			// let mesh = group[mainName][0].clone()


			// mesh = Object3DUtils.changeTransformToDefault(mesh)
			// mesh = changeToPhongMaterial(mesh)


			// group_.add(mesh)


			// group_.matrixAutoUpdate = false


			// group_.castShadow = castShadow
			// group_.receiveShadow = true

			// let details = [
			// 	{
			// 		group: group_,
			// 		level: "l0",
			// 		distance,
			// 	},
			// ]


			// let queue = new LODQueue.LODQueue()

			// queue.name = buildCategoryNameFunc(index)

			// queue.details = details
			// let box: Box3 = queue.computeBox()

			// details = handleDetailsFunc(details, mesh, box)

			// queue.details = details


			// let instancedlod = new InstancedLOD2.InstancedLOD2(lodContainerGroup, camera)

			// instancedlod.setContainer(queue);
			// instancedlod.setLevels(details, getIsDebug(state));
			// instancedlod.setPopulation();



			// state = group[mainName].reduce((state, object: Mesh) => {
			// 	let newTransform = new Matrix4().compose(object.position, object.quaternion, object.scale)
			// 	// let newName = object.name
			// 	let newName = `${buildCategoryNameFunc(index)}_${object.name}`
			// 	let newBox = box.clone().applyMatrix4(newTransform)



			// 	// container.insert(newTransform, newBox, newName)
			// 	// octreeForStaticLODContainer.insert(newTransform, newBox, newName)
			// 	let abstactState = getAbstractState(state)

			// 	queue.insert(newTransform, newBox, newName)


			// 	abstactState = LOD.setStatusForLODQueue(abstactState, newName, buildStatus(true, true, true))

			// 	state = setAbstractState(state, abstactState)





			// 	state = initialAttributesFunc(state, newName)


			// 	return state
			// }, state)



			// state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))



			// state = setDataFunc(state, buildCategoryNameFunc(), queue)


			// index += 1


			// let initialTransform = new Matrix4()


			let data1 = _parsePartMeshQueue(state, [
				() => {
					return new LODQueue.LODQueue()
				},
				buildLODQueueNameFunc,
				buildCategoryNameFunc,
				// buildNamePrefixFunc,
				// initialAttributesFunc,
				setDataFunc,
				(queue) => {
					let box = queue.computeBox()

					// queue.originBox = box.applyMatrix4(initialTransform)
					queue.originBox = box
				},
				// (queue, lastIndex, meshMatrix, crowdPosition) => {
				// 	return queue.originBox.clone().applyMatrix4(meshMatrix.clone().setPosition(crowdPosition))
				// },
				// (state, box) => {
				// 	if (getIsDebug(state)) {
				// 		getScene(state).add(new Box3Helper(box, 0x1fff00))
				// 	}
				// },
				// (position, matrix) => {
				// 	// return transform.multiply(matrix)
				// 	return matrix.clone().setPosition(position)
				// }
			],
				scene,
				// lodContainerGroup,
				camera,
				// group[mainName],
				group[mainName][0].children[0].clone(),
				castShadow, distance,
				// 100
			)
			state = data1[0]
			let bodyMeshLocalMatrix = data1[1]
			let bodyQueue = data1[2]




			// let topParentQueueFuncs = [
			// 	buildNamePrefixFunc,
			// 	initialAttributesFunc,
			// 	(queue, lastIndex, meshMatrix, crowdPosition) => {
			// 		return queue.originBox.clone().applyMatrix4(meshMatrix.clone().setPosition(crowdPosition))
			// 	},
			// 	(state, box) => {
			// 		if (getIsDebug(state)) {
			// 			getScene(state).add(new Box3Helper(box, 0x1fff00))
			// 		}
			// 	},
			// 	(position, matrix) => {
			// 		return matrix.clone().setPosition(position)
			// 	}
			// ]
			// let allQueueCrowdData = [
			// 	[
			// 		bodyQueue,
			// 		bodyMeshLocalMatrix,
			// 		topParentQueueFuncs
			// 	],
			// ]

			let initialTransform = new Matrix4()

			state = TupleUtils.getTuple3First(generateVehicleCrowd(
				state,
				// allQueueCrowdData,
				[
					buildNamePrefixFunc,
					initialAttributesFunc,
				],
				[bodyQueue],
				[bodyMeshLocalMatrix],
				initialTransform,
				group[mainName],
				10
			))
		}
	}

	return state
}

let _computeSkinMeshBox = (getSkinMeshFunc, root) => {
	root.updateWorldMatrix(true, true)

	let m = getSkinMeshFunc(root) as SkinnedMesh
	m.computeBoundingBox()
	return m.boundingBox.clone()
}

let _createShadowQueueAndLOD = (buildCategoryNameFunc, state, scene, camera, distance) => {
	// let scale = 2
	let scale = 4

	let texture = Loader.getResource<Texture>(getAbstractState(state), getCharacterShadowResourceId())
	texture.offset.y = -0.08

	let mesh = NewThreeInstance.createMesh(
		NewThreeInstance.createBoxGeometry(1 * scale, 0.1, 1 * scale, 1, 1),
		solveBlackBoardProblem(fixZFighting(NewThreeInstance.createMeshBasicMaterial({
			// map: Loader.getResource<Texture>(getAbstractState(state), getCharacterShadowResourceId()),
			map: texture,
			transparent: true,
			// depthTest: false
			// blending: NoBlending,
			// blendSrc: SrcAlphaFactor,
			// blendSrc: OneFactor,
			// blendDst: OneMinusSrcAlphaFactor
		})), 0.6)
	)

	let group_ = NewThreeInstance.createGroup()


	mesh = Object3DUtils.changeTransformToDefault(mesh)
	// mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material as any as MeshStandardMaterial)
	// mesh = changeToBasicMaterial(mesh)


	group_.add(mesh)


	group_.matrixAutoUpdate = false


	group_.castShadow = false
	group_.receiveShadow = false

	let details = [
		{
			group: group_,
			level: "l0",
			distance,
		},
	]


	let queue = new LODQueue.LODQueue()

	queue.name = `${buildCategoryNameFunc()}_shadow`

	queue.details = details

	let box = queue.computeBox()
	queue.originBox = box

	let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

	instancedlod.setContainer(queue);
	instancedlod.setLevels(details, getIsDebug(state));
	instancedlod.setPopulation();


	return [queue, instancedlod]
}

let _generateCrowdData = (buildNamePrefixFunc, state: state, crowd: crowd, count: number, lastIndex): Array<[Vector3, string, any]> => {
	// const factor = 1
	// if (getIsDebug(state)) {
	// 	count = 50
	// }
	// count = 1

	// let size = box.getSize(_v1).length()

	let userData = crowd.userData
	let crowdName = crowd.name

	return ArrayUtils.range(0, count - 1).reduce((result, index) => {
		let name = `${buildNamePrefixFunc()}_${crowdName}_${index + lastIndex + 1}`

		// let scale = crowd.scale
		// let quaternion = crowd.quaternion
		let position = crowd.position

		// position.set(position.x + factor * size * (Math.random() * 2 - 1),
		// 	position.y,
		// 	position.z + factor * size * (Math.random() * 2 - 1)
		// )

		return ArrayUtils.push(result, [
			// new Matrix4().compose(position, quaternion, scale),
			// new Matrix4().compose(position, new Quaternion(), new Vector3(1, 1, 1)),
			position,
			name,
			userData
		])
	}, [])
}

let _parsePartMeshQueue = (state, [
	createQueueFunc,
	buildLODQueueNameFunc, buildCategoryNameFunc,
	// buildNamePrefixFunc,
	// initialAttributesFunc,
	setDataFunc,
	buildQueueOriginBoxFunc,
	// getInsertedBoxFunc,
	// addBox3HelperFunc,
	// buildLocalMatrixFunc
],
	scene,
	camera,
	// crowds: Array<crowd>,
	mesh, castShadow, distance,
	// crowdCount
): [state, Matrix4, HierachyLODQueueType] => {
	mesh = mesh.clone()

	mesh.updateMatrix()
	let matrix = mesh.matrix


	let group_ = NewThreeInstance.createGroup()



	// mesh.children = []
	mesh = Object3DUtils.changeTransformToDefault(mesh)

	mesh = changeToPhongMaterial(mesh)


	group_.add(mesh)


	group_.matrixAutoUpdate = false


	group_.castShadow = castShadow
	group_.receiveShadow = Shadow.decideReceiveShadow(getAbstractState(state))

	let details = [
		{
			group: group_,
			level: "l0",
			distance,
		},
	]


	// let queue = new HierachyLODQueue.HierachyLODQueue()
	let queue = createQueueFunc()

	queue.name = buildLODQueueNameFunc(buildCategoryNameFunc())

	queue.details = details


	buildQueueOriginBoxFunc(queue)



	let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

	// instancedlod.name = buildSkinLODNameFunc()

	instancedlod.setContainer(queue);
	// instancedlod.setLevels(details, getIsDebug(state));
	instancedlod.setLevels(details, false);
	instancedlod.setPopulation();


	// state = crowds.reduce((state, crowd, index) => {
	// 	return _generateCrowdData(() => {
	// 		return buildNamePrefixFunc(queue.name)
	// 	}, state, crowd, crowdCount, 0, false).reduce((state, [position, name, userData]) => {
	// 		let localMatrix = buildLocalMatrixFunc(position, matrix)

	// 		// let box = getInsertedBoxFunc(queue, queue.getLastIndex(), localMatrix)
	// 		let box = getInsertedBoxFunc(queue, queue.getLastIndex(), matrix, position)

	// 		queue.insert(localMatrix, box, name)

	// 		queue.setUserData(name, userData)

	// 		state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), queue.getLastIndex(), true))



	// 		state = initialAttributesFunc(state, name)

	// 		addBox3HelperFunc(state, box)

	// 		// queue.setStatus(getAbstractState(state), name, buildStatus(true, true, true))
	// 		state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(true, true, true)))

	// 		state = setAbstractState(state, LOD.setLODQueue(getAbstractState(state), name, queue))

	// 		return state
	// 	}, state)
	// }, state)


	state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))

	// state = setDataFunc(state, buildCategoryNameFunc(), [queue, instancedlod])
	state = setDataFunc(state, buildCategoryNameFunc(), queue)

	// return setAbstractState(state, abstactState)
	return [state, matrix, queue]
}

export let generateVehicleCrowd = (
	state: state,
	// allQueueCrowdData,
	[
		buildNamePrefixFunc,
		initialAttributesFunc,
	],
	allQueues,
	localMatrices,
	initialTransform,
	crowds: Array<crowd>,
	crowdCount
): [state, Array<lodQueueIndex>, Array<name>] => {
	requireCheck(() => {
		test("initialTransform's position should be zero", () => {
			return TransformUtils.getPositionFromMatrix4(initialTransform).equals(new Vector3(0, 0, 0))
		})
	}, getIsDebug(state))

	let topParentQueueFuncs = [
		buildNamePrefixFunc,
		initialAttributesFunc,
		(queue, _, meshMatrix, crowdPosition) => {
			return queue.originBox.clone().applyMatrix4(meshMatrix.clone().setPosition(crowdPosition))
		},
		(state, box) => {
			if (getIsDebug(state)) {
				addBox3Helper(getAbstractState(state), getScene(state), box, 0x1fff00)
			}
		},
		(position, matrix) => {
			return initialTransform.clone().multiply(matrix).setPosition(position)
		}

	]

	let bodyQueue = allQueues[0]
	let bodyQueueBoxes = bodyQueue.boxes

	let childrenQueueFuncs = [
		buildNamePrefixFunc,
		initialAttributesFunc,
		(_queue, queueLastIndex, _meshMatrix, _crowdPosition) => {
			return bodyQueueBoxes[queueLastIndex + 1]
		},
		(state, box) => {
		},
		(position, matrix) => {
			return matrix
		}
	]

	let bodyMeshLocalMatrix = localMatrices[0]

	let childrenQueues = allQueues.slice(1)
	let childrenLocalMatrices = localMatrices.slice(1)

	let allQueueCrowdData = [
		[
			bodyQueue,
			bodyMeshLocalMatrix,
			topParentQueueFuncs
		],
	].concat(
		childrenQueues.map((queue, i) => {
			return [
				queue,
				childrenLocalMatrices[i],
				childrenQueueFuncs
			]
		})
	)





	return crowds.reduce<[state, Array<lodQueueIndex>, Array<name>]>((result, crowd, index) => {
		return allQueueCrowdData.reduce<[state, Array<lodQueueIndex>, Array<name>]>((result, [
			queue,
			matrix,
			funcs
		], queueIndex) => {
			let [
				buildNamePrefixFunc,
				initialAttributesFunc,
				getInsertedBoxFunc,
				addBox3HelperFunc,
				buildLocalMatrixFunc
			] = funcs

			state = result[0]

			return _generateCrowdData(() => {
				return buildNamePrefixFunc(queue.name)
			}, state, crowd, crowdCount, queue.getLastIndex()).reduce((result, [position, name, userData]) => {
				state = result[0]

				// position = _v1.copy(position).setY(getPositionY(state, name, position.x, position.z))

				let localMatrix = buildLocalMatrixFunc(position, matrix)

				let box = getInsertedBoxFunc(queue, queue.getLastIndex(), matrix, position)

				queue.insert(localMatrix, box, name)

				queue.setUserData(name, userData)

				state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state),
					bodyQueue.name,
					queue.getLastIndex(), true))


				let index = queue.getLastIndex()

				state = initialAttributesFunc(state, name, index)

				addBox3HelperFunc(state, box)

				state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(true, true, true)))

				state = setAbstractState(state, LOD.setLODQueue(getAbstractState(state), name, queue))

				if (queueIndex == 0) {
					return [state, ArrayUtils.push(result[1], index), ArrayUtils.push(result[2], name)]
				}

				return [state, result[1], result[2]]
			}, result)
		}, result)
	}, [state, [], []])
}

export let parseArmyVehicleQueues = (state: state,
	[
		buildCategoryNameFunc,
		// buildNamePrefixFunc,
		// initialAttributesFunc,
		getAllMeshDataFunc,
		setDataFunc,
		setHierachyFunc,
		// updateQueueFunc,
	],
	object: Object3D,
	boxFactor,
	distance,
	castShadow,
	// initialTransform,
	// group,
	// crowdCount,
	scene
): [state, Array<Matrix4>, Array<HierachyLODQueueType>] => {

	let camera = Camera.getCurrentCamera(getAbstractState(state))

	let [bodyMeshData, otherMeshData] = getAllMeshDataFunc(object)

	// let allQueues = []

	let data1 = _parsePartMeshQueue(state, [
		() => {
			return new HierachyLODQueue.HierachyLODQueue()
		},
		bodyMeshData[1],
		buildCategoryNameFunc,
		//  buildNamePrefixFunc,
		// initialAttributesFunc,
		setDataFunc,
		(queue) => {
			let box = queue.computeBox()

			NullableUtils.forEach(([xFactor, zFactor]) => {
				let center = box.getCenter(_v1)
				let size = box.getSize(_v2)

				box.setFromCenterAndSize(center.sub(_v3.set(-size.x / (xFactor * 2), 0, size.z / (zFactor * 2))), size.sub(_v4.set(size.x / xFactor, 0, size.z / zFactor)))
			}, boxFactor)

			queue.originBox = box
			// queue.originBox = box.applyMatrix4(initialTransform)
		},
	],
		scene,
		camera,
		// group,
		bodyMeshData[0],
		castShadow,
		distance,
		// crowdCount
	)
	state = data1[0]
	let bodyMeshLocalMatrix = data1[1]
	let bodyQueue = data1[2]



	let data2 = otherMeshData.reduce(([state, localMatrices, allQueues], [mesh, buildLODQueueNameFunc]) => {
		let d = _parsePartMeshQueue(state, [
			() => {
				return new HierachyLODQueue.HierachyLODQueue()
			},
			buildLODQueueNameFunc, buildCategoryNameFunc,
			setDataFunc,
			(queue) => {
				queue.originBox = NullableUtils.getEmpty()
			},
		],
			scene,
			camera,
			mesh,
			castShadow, distance,
		)

		return [
			d[0],
			ArrayUtils.push(
				localMatrices, d[1]
			),
			ArrayUtils.push(
				allQueues, d[2]
			),
		]
	}, [state, [], []])
	state = data2[0]
	let localMatrices = data2[1]
	let allQueues = data2[2]

	localMatrices = [bodyMeshLocalMatrix].concat(localMatrices)
	allQueues = [bodyQueue].concat(allQueues)


	state = setHierachyFunc(state)

	// updateQueueFunc(state)

	return [state, localMatrices, allQueues]
}

// export let parseArmyVehicle = (state: state,
// 	[
// 		buildCategoryNameFunc,
// 		buildNamePrefixFunc,
// 		initialAttributesFunc,
// 		getAllMeshDataFunc,
// 		setDataFunc,
// 		setHierachyFunc,
// 		updateQueueFunc,
// 	],
// 	object: Object3D,
// 	distance,
// 	castShadow,
// 	initialTransform,
// 	group,
// 	crowdCount,
// 	scene
// ) => {
// 	let data = parseArmyVehicleQueues(state,
// 		[
// 			buildCategoryNameFunc,
// 			getAllMeshDataFunc,
// 			setDataFunc,
// 			setHierachyFunc,
// 		],
// 		object,
// 		distance,
// 		castShadow,
// 		// initialTransform,
// 		scene
// 	)
// 	state = data[0]
// 	let localMatrices = data[1]
// 	let allQueues = data[2]

// 	state = TupleUtils.getTuple3First(generateVehicleCrowd(
// 		state,
// 		[
// 			buildNamePrefixFunc,
// 			initialAttributesFunc,
// 		],
// 		allQueues,
// 		localMatrices,
// 		initialTransform,
// 		group,
// 		crowdCount
// 	))

// 	return state
// }

export let generateCharacterCrowd = (state: state,
	[
		buildCategoryNameFunc,
		initialAttributesFunc,
	],
	initialTransform: Matrix4,
	crowds: Array<crowd>,
	crowdCount,
	modelQueue: LODQueueType,
	shadowQueue: LODQueueType,
	[
		allClipDurations, allClipSteps
	],
	// isReadRenderSetting
): [state, Array<lodQueueIndex>, Array<name>] => {
	requireCheck(() => {
		test("initialTransform's position should be zero", () => {
			return TransformUtils.getPositionFromMatrix4(initialTransform).equals(new Vector3(0, 0, 0))
		})
	}, getIsDebug(state))

	let box = modelQueue.originBox
	let shadowQueueBox = shadowQueue.computeBox()

	return crowds.reduce((result, crowd, index) => {
		state = result[0]

		return _generateCrowdData(buildCategoryNameFunc, state, crowd, crowdCount, modelQueue.getLastIndex()).reduce((result, [position, name, userData]) => {
			state = result[0]

			// position = _v1.copy(position).setY(getPositionY(state, name, position.x, position.z))

			let localMatrix = initialTransform.clone().setPosition(position)

			let box_ = box.clone().applyMatrix4(localMatrix)

			modelQueue.insert(localMatrix, box_, name)

			modelQueue.setUserData(name, userData)


			let shadowTransform = new Matrix4().setPosition(
				TransformUtils.getPositionFromMatrix4(localMatrix)
			)
			let shadowBox = shadowQueueBox.clone().applyMatrix4(shadowTransform)

			shadowQueue.insert(shadowTransform, shadowBox, buildNameInShadowQueue(name))



			let index = modelQueue.getLastIndex()

			state = initialAttributesFunc(state, name, index)

			if (getIsDebug(state)) {
				addBox3Helper(getAbstractState(state), getScene(state), box_, 0x1fff00)
			}


			state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(true, true, true)))
			state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), buildNameInShadowQueue(name), buildStatus(false, false, true)))

			state = setAbstractState(state, LOD.setLODQueue(getAbstractState(state), name, modelQueue))


			state = setAbstractState(state, GPUSkin.initAnimationData(getAbstractState(state), name, allClipDurations, allClipSteps))

			return [state, ArrayUtils.push(result[1], index), ArrayUtils.push(result[2], name)]
		}, result)
	}, [state, [], []])
}


export let parseCharacterQueue = (state: state,
	[
		buildCategoryNameFunc,
		getSkinMeshFunc,
		setDataFunc,
		buildSkinLODNameFunc,
		getFPSFunc,
	],
	object: Object3D,
	animations,
	distance,
	scene
): any => {
	const fps = getFPSFunc()
	const maxDuration = GPUSkin.getMaxDuration()

	let mesh = getSkinMeshFunc(object)
	mesh = mesh.clone()

	// mesh.updateMatrix()
	// let matrix = mesh.matrix



	let camera = Camera.getCurrentCamera(getAbstractState(state))

	let group_ = NewThreeInstance.createGroup()

	mesh = Object3DUtils.changeTransformToDefault(mesh)
	// mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material)
	mesh = changeToPhongMaterial(mesh)


	group_.add(mesh)


	group_.matrixAutoUpdate = false


	// group_.castShadow = castShadow
	group_.castShadow = false
	group_.receiveShadow = Shadow.decideReceiveShadow(getAbstractState(state))

	let details = [
		{
			group: group_,
			level: "l0",
			distance,
		},
	]


	let queue = new LODQueue.LODQueue()

	queue.name = buildCategoryNameFunc()

	queue.details = details


	// let box = _computeSkinMeshBox(getSkinMeshFunc, object).applyMatrix4(initialTransform)
	let box = _computeSkinMeshBox(getSkinMeshFunc, object)

	queue.originBox = box




	let instancedlod = new InstancedSkinLOD2.InstancedSkinLOD2(scene, camera)

	instancedlod.name = buildSkinLODNameFunc()

	instancedlod.fps = fps

	instancedlod.setContainer(queue);
	instancedlod.setLevels(details, getIsDebug(state));
	instancedlod.setPopulation();




	let [shadowQueue, shadowInstancedLOD]: any = _createShadowQueueAndLOD(buildCategoryNameFunc, state, scene, camera, distance)


	// TODO why can't remove "Armature|mixamo.com|Layer0" animation in blender?
	// refer to https://blog.csdn.net/qq_30100043/article/details/117600744
	// let animations = gltf.animations.slice(1)

	/*!blender->export gltf->Animation->Animation mode: should select NLA Tracks*/
	// let animations = gltf.animations

	let d = GPUSkin.registerAnimation(getAbstractState(state), mesh.material, mesh.skeleton, object, animations, [maxDuration, fps])
	state = setAbstractState(state, d[0])
	let allClipDurations = d[1]
	let allClipSteps = d[2]


	state = setAbstractState(state, InstancedSkinLOD2.add(getAbstractState(state), instancedlod))
	state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), shadowInstancedLOD))


	state = setDataFunc(state, buildCategoryNameFunc(), queue, shadowQueue)

	// return setAbstractState(state, abstactState)
	return [state, allClipDurations, allClipSteps, [queue, shadowQueue]]
}

export let parseCharacter = (state: state,
	[
		buildCategoryNameFunc,
		initialAttributesFunc,
		getSkinMeshFunc,
		setDataFunc,
		buildSkinLODNameFunc,
		getFPSFunc,
	],
	object: Object3D,
	animations,
	distance,
	initialTransform: Matrix4,
	crowds: Array<crowd>,
	crowdCount,
	scene
) => {
	let data = parseCharacterQueue(state,
		[
			buildCategoryNameFunc,
			getSkinMeshFunc,
			setDataFunc,
			buildSkinLODNameFunc,
			getFPSFunc,
		],
		object,
		animations,
		distance,
		scene
	)
	state = data[0]
	let allClipDurations = data[1]
	let allClipSteps = data[2]
	let [queue, shadowQueue] = data[3]


	if (getIsProduction(state)) {
		switch (RenderSetting.getRenderSetting(getAbstractState(state)).crowdSize) {
			case crowdSize.Small:
				break
			case crowdSize.Middle:
				crowdCount *= 2
				break
			case crowdSize.Big:
				crowdCount *= 6
				break
			case crowdSize.VeryBig:
				crowdCount *= 10
				break
		}
	}

	return TupleUtils.getTuple3First(generateCharacterCrowd(state,
		[
			buildCategoryNameFunc,
			initialAttributesFunc,
		],
		initialTransform,
		crowds,
		crowdCount,
		queue,
		shadowQueue,
		[
			allClipDurations, allClipSteps
		],
	))
}

let _parseCharacterGroup = (state, funcs, group, initialTransform, { distance }) => {
	requireCheck(() => {
		test("initialTransform's position should be zero", () => {
			return TransformUtils.getPositionFromMatrix4(initialTransform).equals(new Vector3(0, 0, 0))
		})
	}, getIsDebug(state))

	let scene = getScene(state)

	// let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

	let arr: Array<Array<Object3D>> = []
	for (let mainName in group) {
		if (group.hasOwnProperty(mainName)) {
			arr.push(group[mainName])
		}
	}

	return ArrayUtils.reducePromise(arr, (state, group) => {
		let resourceId = group[0].name.match(/^Character_(.+?)_/)[1]

		let abstractState = getAbstractState(state)

		return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, resourceId), Render.getRenderer(abstractState)).then((gltf) => {
			return parseCharacter(state,
				funcs,
				gltf.scene,
				gltf.animations,
				distance,
				initialTransform,
				group.map((obj) => {
					return {
						name: obj.name,
						position: obj.position,
						userData: obj.userData
					}
				}),
				50,
				// 0,
				// 500,
				// 10,
				// 2,
				// 2,
				scene
			)
		})
	}, state)
}

let _parseObjects = (state: state, [dynamicFunc, [getNamePrefix, buildCategoryNameFunc, initialAttributesFunc_, addStaticLODContainerDataFunc, handleDetailsFunc = (details, mesh, box) => details],
	characterGroupFuncs



], [namePrefixs, nameExcludePrefixs]: [Array<string>, Array<string>], model: Group, {
	castShadow = false,
	receiveShadow = false,
	distance = 1000,
}) => {
	if (RenderSetting.getRenderSetting(getAbstractState(state)).shadow == shadowLevel.Low) {
		castShadow = false
	}

	let [lodContainerGroup, dynamicGroup, characterGroup] = Scene.findObjects(model, obj => {
		if (nameExcludePrefixs.reduce((result, namePrefix) => {
			if (result) {
				return result
			}

			return obj.name.includes(namePrefix)
		}, false)) {
			return false
		}

		return namePrefixs.reduce((result, namePrefix) => {
			if (result) {
				return result
			}

			return obj.name.includes(namePrefix)
		}, false)
	}).reduce(([lodContainerGroup, dynamicGroup, characterGroup], obj) => {
		if (obj.name.includes("Dynamic_")) {
			return [
				lodContainerGroup,
				ArrayUtils.push(dynamicGroup, obj),
				characterGroup
			]
		}
		else if (obj.name.includes("Character_")) {
			return [
				lodContainerGroup,
				dynamicGroup,
				ArrayUtils.push(characterGroup, obj)
			]
		}

		return [
			ArrayUtils.push(lodContainerGroup, obj),
			dynamicGroup,
			characterGroup
		]
	}, [[], [], []])

	lodContainerGroup = _group(lodContainerGroup)
	dynamicGroup = _group(dynamicGroup)
	characterGroup = _group(characterGroup)


	state = _parseStaticGroup(state, lodContainerGroup, [getNamePrefix, buildCategoryNameFunc, initialAttributesFunc_, addStaticLODContainerDataFunc, handleDetailsFunc], {
		castShadow,
		receiveShadow,
		distance
	})
	state = _parseDynamicGroup(state,
		dynamicGroup,
		dynamicFunc,
		{ castShadow, distance })

	return _parseCharacterGroup(state, characterGroupFuncs, characterGroup, new Matrix4(), { distance })
}

let _groupByQuaternionAndScale = (group) => {
	return Object3DUtils.group(group, (obj) => {
		return JSON.stringify(obj.quaternion.toArray().concat(obj.scale.toArray()))
	})
}

let _getMoveToCenterPosition = (box, originPosition) => {
	let height = box.getSize(_v1).y

	return box.getCenter(_v2).sub(originPosition).setY(
		height
	)
}

let _addAllBuildingCrackDecals = (state: state, getNamePrefixFunc, model: Group, distance) => {
	let buildings = Scene.findObjects(model, obj => {
		return obj.name.includes("Building")
	})

	let group = _group(buildings)


	let decalMaterial = Decal.createDecalMaterial({ map: Loader.getResource<Texture>(getAbstractState(state), getBuildingDamage1ResourceId()) })
	let orientation = Decal.getHorizontalOrientation()


	let camera = Camera.getCurrentCamera(getAbstractState(state))


	let scene = getScene(state)

	// let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	let index = 0
	for (let mainName in group) {
		if (group.hasOwnProperty(mainName)) {
			let subGroup = _groupByQuaternionAndScale(group[mainName])

			for (let mainName2 in subGroup) {
				if (subGroup.hasOwnProperty(mainName2)) {
					let group_ = NewThreeInstance.createGroup()
					// let mesh = subGroup[mainName2][0].clone()
					let buildingMesh = subGroup[mainName2][0]

					let buildingBox = new Box3().setFromObject(buildingMesh)
					// let height = buildingBox.getSize(new Vector3()).y


					// if (height <= 10) {
					// 	continue
					// }

					let buildingQuat = buildingMesh.quaternion
					let buildingScale = buildingMesh.scale



					let scale = Decal.buildScale(buildingBox)


					// decalMaterial.color.setHex(Math.random() * 0xffffff);

					let mesh = Decal.createDecalMesh([
						buildingQuat, buildingScale, buildingMesh.geometry
					], [

						// new Vector3(0, height, 0),

						_getMoveToCenterPosition(buildingBox, buildingMesh.position),

						orientation, scale], decalMaterial,
						getIsDebug(state)
					)



					// mesh = Object3DUtils.changeTransformToDefault(mesh)
					// mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material)


					group_.add(mesh)


					group_.matrixAutoUpdate = false


					group_.castShadow = false
					group_.receiveShadow = false

					let details = [
						{
							group: group_,
							level: "l0",
							distance
						},
					]


					// let container = new StaticLODContainer.StaticLODContainer(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 2, 0)
					let queue = new LODQueue.LODQueue()

					queue.details = details
					let box: Box3 = queue.computeBox()

					// details = handleDetailsFunc(details, mesh, box)

					queue.details = details


					// let instancedlod = new InstancedLOD2.InstancedLOD2(lodContainerGroup, camera)
					let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

					instancedlod.setContainer(queue);
					instancedlod.setLevels(details, getIsDebug(state));
					instancedlod.setPopulation();



					state = subGroup[mainName2].reduce((state, object: Mesh) => {
						// let newTransform = new Matrix4().compose(object.position, object.quaternion, object.scale)
						// let newTransform = _m.compose(object.position, _q.set(0, 0, 0, 1), _v1.set(1, 1, 1))
						let newTransform = new Matrix4().compose(object.position, _q.set(0, 0, 0, 1), _v1.set(1, 1, 1))
						// let newName = object.name
						let newName = _buildNameForOctreeForStaticLODContainer(getNamePrefixFunc, object)
						let newBox = box.clone().applyMatrix4(newTransform)




						queue.insert(newTransform, newBox, newName)

						// queue.setStatus(getAbstractState(state), newName, buildStatus(false, false, false))
						state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), newName, buildStatus(false, false, false)))

						// state = initialAttributesFunc(state, newName)
						state = Buildings.setCrackDecalLODQueue(state, newName, queue)


						return state
					}, state)



					state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))



					// state = addStaticLODContainerDataFunc(state, container, details)



					index += 1

				}
			}





		}
	}

	return Promise.resolve(state)
}

let _handleDetails = (details, mesh, distance) => {
	let l1Mesh = mesh.clone()
	l1Mesh.material = l1Mesh.material.clone()

	let group = NewThreeInstance.createGroup()

	group.add(l1Mesh)

	group.matrixAutoUpdate = false

	group.castShadow = false
	group.receiveShadow = false


	return ArrayUtils.push(details, {
		group: group,
		level: "l1",
		distance
	})

}

// let _addLevel = (instanceSourceLOD, obj: Object3D, distance, isDebug) => {
// 	let l1Obj = obj.clone()
// 	l1Obj.traverse((child: Mesh) => {
// 		if ((child as Mesh).isMesh) {
// 			child.material = (child.material as Material).clone()
// 		}
// 	})

// 	l1Obj = Shadow.setShadow(l1Obj, false, false)

// 	return instanceSourceLOD.addLevel(l1Obj, distance, 0, isDebug)
// }

// let _addInstances = (state: state, scene) => {
// 	let dynamicGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getDynamicGroupName()))

// 	let data = Instance.convertLODToInstanceMeshLOD(getAbstractState(state), scene, InstanceSourceLOD.findAllSourceLODs(dynamicGroup))
// 	state = setAbstractState(state, data[0])
// 	scene = data[1]

// 	//     data = Instance.convertNotLODToInstanceMesh(getAbstractState(state), scene, Animated.findAllAnimateds(dynamicGroup))
// 	//     state = setAbstractState(state, data[0])
// 	//     scene = data[1]

// 	// return [state, scene]
// 	return state
// }

let _parseGirl = (state: state, model: Group) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(girlModel => {
			return Girl.setInitialTransform(state, girlModel.position, girlModel.quaternion)
		}, Scene.findObjectByName(model, Girl.getName())),
		state
	)
}

let _parseLittleMan = (state: state, model: Group) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(littleManModel => {
			return LittleMan.setInitialTransform(state, littleManModel.position, littleManModel.quaternion)
		}, Scene.findObjectByName(model, LittleMan.getName())),
		state
	)
}

let _parseArmy = (state: state, model: Group) => {
	let soldierCrowdPositions = NullableUtils.getExn(Scene.findObjects(model, obj => {
		// return obj.name.includes(Soldier.getSoldier1NamePrefix())
		return obj.name.includes("soldier")
	})).map(obj => {
		return obj.position
	})
	let tankCrowdPositions = NullableUtils.getExn(Scene.findObjects(model, obj => {
		// return obj.name.includes(Tank.getTankNamePrefix())
		return obj.name.includes("tank")
	})).map(obj => {
		return obj.position
	})

	state = Soldier.setCrowdData(state, soldierCrowdPositions)
	state = MilltaryVehicle.setCrowdData(state, tankCrowdPositions)

	return state
}

let _parseTurret = (state: state, model: Group) => {
	let shellTurretPositions = NullableUtils.getExn(Scene.findObjects(model, obj => {
		return obj.name.includes("ShellTurret_")
	})).map(obj => {
		return obj.position
	})
	let missileTurretPositions = NullableUtils.getExn(Scene.findObjects(model, obj => {
		return obj.name.includes("MissileTurret_")
	})).map(obj => {
		return obj.position
	})

	state = MilltaryBuilding.setTurretPosition(state, buildShellTurretCategoryName(), shellTurretPositions)
	state = MilltaryBuilding.setTurretPosition(state, buildMissileTurretCategoryName(), missileTurretPositions)

	return state
}

export let initWhenImportScene = (state: state,
	sceneResourceId
) => {
	let abstractState = getAbstractState(state)

	let farDistance,
		middleDistance,
		nearDistance
	switch (RenderSetting.getRenderSetting(abstractState).renderAccuracy) {
		case renderAccuracyLevel.VeryHigh:
		case renderAccuracyLevel.High:
			farDistance = 4000
			middleDistance = 2000
			nearDistance = 1000
			break
		case renderAccuracyLevel.Middle:
			farDistance = 2000
			middleDistance = 1000
			nearDistance = 500
			break
		case renderAccuracyLevel.Low:
			farDistance = 1000
			middleDistance = 500
			nearDistance = 250
			break
	}

	return ModelLoader.parseGlb(abstractState, Loader.getResource(abstractState, sceneResourceId), Render.getRenderer(abstractState)).then((gltf: GLTF) => {
		let model = gltf.scene

		state = _parseGirl(state, model)
		state = _parseLittleMan(state, model)
		state = _parseArmy(state, model)
		state = _parseTurret(state, model)

		return _parseObjects(state, [[] as any, [
			Buildings.getNamePrefix,
			Buildings.buildCategoryName,
			Buildings.initialAttributes, Buildings.addStaticLODContainerData, (details, mesh, box) => {
				if (box.getSize(_v1).y > 6) {
					return _handleDetails(details, mesh, farDistance)
				}

			}
		] as any, [] as any], [[Buildings.getNamePrefix()], []], model, {
			castShadow: true,
			distance: nearDistance
		})
			// .then(state => {
			// 	return _parseObjects(state, [[
			// 		WindMills.initialAttributes,
			// 		(instanceSourceLOD, obj) => {
			// 			return _addLevel(instanceSourceLOD, obj, farDistance, getIsDebug(state))
			// 		},
			// 		WindMills.buildWindMillName
			// 	], [] as any, [] as any], [[WindMills.getNamePrefix()], []], model, {
			// 		castShadow: true,
			// 		distance: nearDistance
			// 	})
			// })
			// .then(state => {
			// 	return _parseObjects(state, [[] as any, [
			// 		WindMills.buildCategoryName,
			// 		WindMills.initialAttributes, WindMills.addStaticLODContainerData, (details, mesh, box) => {
			// 			return _handleDetails(details, mesh, farDistance)
			// 		}
			// 	] as any, [] as any], [[WindMills.getNamePrefix()], []], model, {
			// 		castShadow: true,
			// 		distance: nearDistance
			// 	})
			// })
			// .then(state => {
			// 	return _parseObjects(state, [[
			// 		DynamicCars.initialAttributes,
			// 		(instanceSourceLOD, obj) => {
			// 			return _addLevel(instanceSourceLOD, obj, middleDistance, getIsDebug(state))
			// 		},
			// 		DynamicCars.buildDynamicCarName
			// 	], [] as any, [] as any], [[DynamicCars.getNamePrefix()], []], model, {
			// 		castShadow: true,
			// 		distance: nearDistance
			// 	})
			// })
			.then(state => {
				return _parseObjects(state, [[
					name => name,
					DynamicCars.buildCategoryName,
					DynamicCars.buildNamePrefix,
					DynamicCars.initialAttributes, DynamicCars.setData
				] as any, [] as any, [] as any], [["Dynamic_Vehicle"], []], model, {
					castShadow: true,
					distance: nearDistance
				})
			})
			.then(state => {
				return _parseObjects(state, [[] as any, [
					Tiles.getNamePrefix,
					Tiles.buildCategoryName, Tiles.initialAttributes, Tiles.addStaticLODContainerData], [] as any], [["Tile", "Grass_Bar", "Road"], []], model, {
					// return _parseObjects(state, [[] as any, [Tiles.buildCategoryName, Tiles.initialAttributes, Tiles.addStaticLODContainerData], [] as any], [[Tiles.getNamePrefix()], []], model, {
					castShadow: false,
					receiveShadow: true,
					distance: farDistance
				})
			}).then(state => {
				return _parseObjects(state, [[] as any, [
					Mountains.getNamePrefix,
					Mountains.buildCategoryName, Mountains.initialAttributes, Mountains.addStaticLODContainerData, (details, mesh, box) => {
						return _handleDetails(details, mesh, farDistance)
					}], [] as any], [[Mountains.getNamePrefix()], []], model, {
					castShadow: true,
					distance: middleDistance
				})
			}).then(state => {
				return _parseObjects(state, [[] as any, [
					TreesAndProps.getNamePrefix,
					TreesAndProps.buildCategoryName, TreesAndProps.initialAttributes, TreesAndProps.addStaticLODContainerData, (details, mesh, box) => {
						return _handleDetails(details, mesh, farDistance)
					}], [] as any], [["Tree", "Props"], ["Dynamic"]], model, {
					// }], [] as any], [[TreesAndProps.getNamePrefix()], ["Dynamic"]], model, {
					castShadow: true,
					distance: nearDistance,
				})
			})
			.then(state => {
				return _parseObjects(state, [[] as any, [
					Cars.getNamePrefix,
					Cars.buildCategoryName, Cars.initialAttributes, Cars.addStaticLODContainerData, (details, mesh, box) => {
						return _handleDetails(details, mesh, middleDistance)
					}], [] as any], [["Vehicle"], ["Dynamic"]], model, {
					castShadow: true,
					distance: nearDistance,
				})
			})
			.then(state => {
				return _parseObjects(state, [[] as any, [
					MapWall.getNamePrefix,
					MapWall.buildCategoryName, MapWall.initialAttributes, MapWall.addStaticLODContainerData], [] as any], [[MapWall.getNamePrefix()], []], model, {
					castShadow: false,
					distance: +Infinity
				})
			}).then(state => {
				return _parseObjects(state, [[] as any, [] as any,
				[
					Citiyzen.buildCityzen1CategoryName,
					Citiyzen.initialAttributes,
					Citiyzen.getCityzen1SkinMesh,
					Citiyzen.setData,
					Citiyzen.buildCityzen1SkinLODName,
					Citiyzen.getFPS,
				]
				], [[Citiyzen.getCityzen1NamePrefix()], []], model, {
					// castShadow: true,
					distance: nearDistance
				}).then(state => {
					return _parseObjects(state, [[] as any, [] as any,
					[
						Citiyzen.buildCityzen2CategoryName,
						Citiyzen.initialAttributes,
						Citiyzen.getCityzen2SkinMesh,
						Citiyzen.setData,
						Citiyzen.buildCityzen2SkinLODName,
						Citiyzen.getFPS,
					]
					], [[Citiyzen.getCityzen2NamePrefix()], []], model, {
						// castShadow: true,
						distance: nearDistance
					})
				})
			}).then(state => {
				return _addAllBuildingCrackDecals(state, Buildings.getNamePrefix, model, nearDistance)
			})


		// state = Girl.setInitialTransform(state, new Vector3(0, 0, 0), new Quaternion())

	})
	// .then(state => {
	// 	return _addInstances(state, getScene(state))
	// })
}

export let dispose = (state: state) => {
	return Promise.resolve(state)
}