import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Loader } from "meta3d-jiehuo-abstract"
import { getBaseMap1ResourceId, getBaseMap2ResourceId, getBaseMap3ResourceId, getBaseMap4ResourceId, getBaseMap5ResourceId, getBaseMap6ResourceId, getBaseMap7ResourceId, getBaseMap8ResourceId, getColorMapResourceId, getHeightMapResourceId, getName, getScene, getState, setState } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, Color, DoubleSide, Euler, Material, Matrix4, Object3D, Quaternion, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, Vector3, VectorKeyframeTrack } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { collisionPart, terrain } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { CSM } from "meta3d-jiehuo-abstract"
import { Shadow } from "meta3d-jiehuo-abstract"
import { return_ } from "meta3d-jiehuo-abstract/src/utils/NullableUtils"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { getMoveHitTerrainEventName, getStompHitTerrainEventName } from "../../../../../utils/EventUtils"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { add, buildQueue } from "../../utils/AviailableLODQueueUtils"
import { getCollisionPartOBB } from "../../girl/Collision"
import { isBigGiantess, isMiddleGiantess } from "../../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { shoeType } from "mmd-character-protocol/src/service/ServiceType"
import { getFarDistance } from "./WholeScene"
import { getQuaternion } from "../../utils/OBBUtils"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).terrain)
}

let _setState = (state: state, flowerState: terrain) => {
	return setState(state, {
		...getState(state),
		terrain: NullableUtils.return_(flowerState)
	})
}

// export let buildName = () => "terrain"

export let getFootDamage1ResourceId = (name) => `./resource/${name}/decal/foot_damage1`

// export let getFootPrintResourceId = (name) => `./resource/${name}/decal/footprint`

export let getLeftFootPrintResourceId = (name) => `./resource/${name}/decal/leftFootPrint`

export let getRightFootPrintResourceId = (name) => `./resource/${name}/decal/rightFootPrint`

export let getHeelShoePrintResourceId = (name) => `./resource/${name}/decal/heelShoePrint`

// export let getCommonShoePrintResourceId = (name) => `./resource/${name}/decal/commonShoePrint`

export let getLeftCommonShoePrintResourceId = (name) => `./resource/${name}/decal/leftCommonShoePrint`

export let getRightCommonShoePrintResourceId = (name) => `./resource/${name}/decal/rightCommonShoePrint`

export let getFootDamage1ResourcePath = (name) => `${getFootDamage1ResourceId(name)}.png`

// export let getFootPrintResourcePath = (name) => `${getFootPrintResourceId(name)}.png`

export let getLeftFootPrintResourcePath = (name) => `${getLeftFootPrintResourceId(name)}.png`

export let getRightFootPrintResourcePath = (name) => `${getRightFootPrintResourceId(name)}.png`

export let getHeelShoePrintResourcePath = (name) => `${getHeelShoePrintResourceId(name)}.png`

// export let getCommonShoePrintResourcePath = (name) => `${getCommonShoePrintResourceId(name)}.png`

export let getLeftCommonShoePrintResourcePath = (name) => `${getLeftCommonShoePrintResourceId(name)}.png`

export let getRightCommonShoePrintResourcePath = (name) => `${getRightCommonShoePrintResourceId(name)}.png`

let _getAllBaseMapResourceIds = () => {
	return [
		getBaseMap1ResourceId(),
		getBaseMap2ResourceId(),
		getBaseMap3ResourceId(),
		getBaseMap4ResourceId(),
		getBaseMap5ResourceId(),
		getBaseMap6ResourceId(),
		getBaseMap7ResourceId(),
		getBaseMap8ResourceId(),
	]
}

export let parseAndAddResources = (state: state) => {
	// let abstractState = getAbstractState(state)

	// let terrainMesh = Terrain.create({
	// 	heightMap: Loader.getResource(abstractState, getHeightMapResourceId()),
	// 	colorMap: Loader.getResource(abstractState, getColorMapResourceId()),
	// 	baseMap: Loader.getResource(abstractState, getBaseMapResourceId()),
	// })

	// terrainMesh = Shadow.setShadow(terrainMesh, false, true)


	// let baseMap = Loader.getResource<Texture>(getAbstractState(state), getBaseMapResourceId())

	/*! some maybe miss
	* 
	*/
	let getLoadedAllBaseMapResourceIds =
		_getAllBaseMapResourceIds().filter(id => {
			return Loader.isResourceLoaded(getAbstractState(state), id)
		})
	if (getLoadedAllBaseMapResourceIds.length == 0) {
		throw new Error(getLanguageTextData(state, languageKey.ResourceLoadFail))
	}
	let baseMap = Loader.getResource<Texture>(getAbstractState(state),
		NumberUtils.randomSelect(getLoadedAllBaseMapResourceIds)
	)




	baseMap.colorSpace = SRGBColorSpace;
	baseMap.wrapS = RepeatWrapping;
	baseMap.wrapT = RepeatWrapping;
	let repeatsInwidth = 40,
		repeatsInlength = 40;
	baseMap.repeat.set(repeatsInlength, repeatsInwidth);

	let ground = NewThreeInstance.createMesh(
		NewThreeInstance.createPlaneGeometry(8000, 8000, 1, 1),
		NewThreeInstance.createMeshPhongMaterial({
			color: new Color(0xffffff),
			map: baseMap
		})
	)

	ground.rotateX(-Math.PI / 2)

	// ground.position.set(0, -0.1, 0)
	ground.position.set(2000, -0.3, 2000)

	ground.castShadow = false
	ground.receiveShadow = true

	// CSM.setupMaterial(getAbstractState(state), ground.material as Material);


	return _setState(state, {
		..._getState(state),
		terrainMesh: return_(ground)
	})

}

export let createState = (): terrain => {
	return {
		// terrain: NullableUtils.getEmpty(),
		// terrainVertices: NullableUtils.getEmpty(),
		terrainMesh: NullableUtils.getEmpty(),

		footDamageDecalOriginBox: NullableUtils.getEmpty(),
		footDamageDecalQueue: NullableUtils.getEmpty(),
		aviailableFootDamageDecalNames: [],

		rightFootPrintDecalOriginBox: NullableUtils.getEmpty(),
		rightFootPrintDecalQueue: NullableUtils.getEmpty(),
		aviailableRightFootPrintDecalNames: [],

		leftFootPrintDecalOriginBox: NullableUtils.getEmpty(),
		leftFootPrintDecalQueue: NullableUtils.getEmpty(),
		aviailableLeftFootPrintDecalNames: [],

		leftCommonShoePrintDecalOriginBox: NullableUtils.getEmpty(),
		leftCommonShoePrintDecalQueue: NullableUtils.getEmpty(),
		aviailableLeftCommonShoePrintDecalNames: [],

		rightCommonShoePrintDecalOriginBox: NullableUtils.getEmpty(),
		rightCommonShoePrintDecalQueue: NullableUtils.getEmpty(),
		aviailableRightCommonShoePrintDecalNames: [],

		heelShoePrintDecalOriginBox: NullableUtils.getEmpty(),
		heelShoePrintDecalQueue: NullableUtils.getEmpty(),
		aviailableHeelShoePrintDecalNames: [],
	}
}

export let getBoundingBox = () => {
	// terrainMesh.geometry.computeBoundingBox();

	// return terrainMesh.geometry.boundingBox;

	return Terrain.buildBigBoundingBox()
}

let _getGroundHeight = () => 0.5

export let isUnderGround = (positionVec) => {
	// return positionVec.y <= 0
	// return positionVec.y <= 0.1
	return positionVec.y <= _getGroundHeight()
}

export let buildCollisionBox = () => {
	let size = 100000

	// return new Box3().setFromCenterAndSize(_v1.set(0, 0.1, 0), _v2.set(size, 0.01, size))
	return new Box3().setFromCenterAndSize(_v1.set(0, _getGroundHeight(), 0), _v2.set(size, 0.01, size))
}

// let _buildDamageDecalName = (resourceId) => {
// 	return (index) => {
// 		return `${resourceId}_${index}`
// 	}
// }

let _buildDecalQueue = (state: state, [handleTextureFunc, buildDamageDecalNameFunc, setDataFunc], resourceId,
	{
		alphaTest,
		count,
		opacity
	} = {
			alphaTest: 0,
			count: 1000,
			opacity: 1,
		}
) => {
	// const count = 100
	// const count = 1000
	// let distance = getFarDistance(state)

	let texture = Loader.getResource<Texture>(getAbstractState(state), resourceId)
	texture = handleTextureFunc(texture)
	// texture.offset.x = -0.1

	let decal = NewThreeInstance.createMesh(
		NewThreeInstance.createPlaneGeometry(1, 1, 1, 1),
		fixZFighting(NewThreeInstance.createMeshPhongMaterial({
			map: texture,
			transparent: true,
			alphaTest: alphaTest,
			opacity: opacity,
		}))
	)

	let scene = getScene(state)

	//let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	let data = buildQueue(state, buildDamageDecalNameFunc, count, getFarDistance, scene, decal)
	state = data[0]
	let box = data[1]
	let queue = data[2]
	let names = data[3]

	// state = _setState(state, {
	// 	..._getState(state),
	// 	footDamageDecalOriginBox: NullableUtils.return_(box),
	// 	footDamageDecalQueue: NullableUtils.return_(queue),
	// 	aviailableFootDamageDecalNames: names
	// })
	state = setDataFunc(state, box, queue, names)

	return state

}

let _buildFootDamageDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => {
			texture.offset.x = -0.1

			return texture
		},
		index => `_buildFootDamageDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				footDamageDecalOriginBox: NullableUtils.return_(box),
				footDamageDecalQueue: NullableUtils.return_(queue),
				aviailableFootDamageDecalNames: names
			})
		}
	], getFootDamage1ResourceId(getName()),
		{
			alphaTest: 0,
			count: 1000,
			opacity: 1,
		}
	)
}

let _buildPrintConfig = () => {
	return {
		alphaTest: 0,
		count: 50,
		opacity: 0.7,
	}
}

let _buildRightFootPrintDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => {
			// let t = texture.clone()

			// t.offset.x = 0.5

			// return t
			return texture
		},
		index => `_buildRightFootPrintDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				rightFootPrintDecalOriginBox: NullableUtils.return_(box),
				rightFootPrintDecalQueue: NullableUtils.return_(queue),
				aviailableRightFootPrintDecalNames: names
			})
		}
		// ], getFootPrintResourceId(getName()), 0.95)
	], getRightFootPrintResourceId(getName()),
		_buildPrintConfig()
	)
}

let _buildLeftFootPrintDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => {
			// let t = texture.clone()

			// t.offset.x = 0.0
			// t.repeat.x = 0.5

			// return t
			return texture
		},
		index => `_buildLeftFootPrintDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				leftFootPrintDecalOriginBox: NullableUtils.return_(box),
				leftFootPrintDecalQueue: NullableUtils.return_(queue),
				aviailableLeftFootPrintDecalNames: names
			})
		}
		// ], getFootPrintResourceId(getName()), 0.95)
	], getLeftFootPrintResourceId(getName()),
		_buildPrintConfig()
	)
}

let _buildRightCommonShoePrintDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => {
			// let t = texture.clone()

			// t.offset.x = 0.5

			// return t
			return texture
		},
		index => `_buildRightCommonShoePrintDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				rightCommonShoePrintDecalOriginBox: NullableUtils.return_(box),
				rightCommonShoePrintDecalQueue: NullableUtils.return_(queue),
				aviailableRightCommonShoePrintDecalNames: names
			})
		}
		// ], getCommonShoePrintResourceId(getName()))
	], getRightCommonShoePrintResourceId(getName()),
		_buildPrintConfig()
	)
}

let _buildLeftCommonShoePrintDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => {
			// let t = texture.clone()

			// t.offset.x = 0.0
			// t.repeat.x = 0.5

			// return t

			return texture
		},
		index => `_buildLeftCommonShoePrintDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				leftCommonShoePrintDecalOriginBox: NullableUtils.return_(box),
				leftCommonShoePrintDecalQueue: NullableUtils.return_(queue),
				aviailableLeftCommonShoePrintDecalNames: names
			})
		}
		// ], getCommonShoePrintResourceId(getName()))
	], getLeftCommonShoePrintResourceId(getName()),
		_buildPrintConfig()
	)
}

let _buildHeelShoePrintDecalQueue = (state: state) => {
	return _buildDecalQueue(state, [
		texture => texture,
		index => `_buildHeelShoePrintDecalQueue_${index}`,
		(state, box, queue, names) => {
			return _setState(state, {
				..._getState(state),
				heelShoePrintDecalOriginBox: NullableUtils.return_(box),
				heelShoePrintDecalQueue: NullableUtils.return_(queue),
				aviailableHeelShoePrintDecalNames: names
			})
		}
	], getHeelShoePrintResourceId(getName()),
		_buildPrintConfig()
	)
}

// let _addRightPrint = (state: state, shoeType_: shoeType, size: Vector3, quaternion, position) => {
let _addRightPrint = (state: state, shoeType_: shoeType, sizeX: number, sizeZ: number, quaternion, position) => {
	let size = _v1.set(sizeX, sizeZ, 1)
	switch (shoeType_) {
		case shoeType.None:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).rightFootPrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableRightFootPrintDecalNames
				},
				(state, aviailableRightFootPrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableRightFootPrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).rightFootPrintDecalOriginBox),
				size, quaternion, position
			)
		case shoeType.Heel:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).heelShoePrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableHeelShoePrintDecalNames
				},
				(state, aviailableHeelShoePrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableHeelShoePrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).heelShoePrintDecalOriginBox),
				size, quaternion, position
			)
		case shoeType.RearHeel:
		case shoeType.Common:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).rightCommonShoePrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableRightCommonShoePrintDecalNames
				},
				(state, aviailableRightCommonShoePrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableRightCommonShoePrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).rightCommonShoePrintDecalOriginBox),
				size, quaternion, position
			)
	}
}

let _addLeftPrint = (state: state, shoeType_: shoeType, sizeX: number, sizeZ: number, quaternion, position) => {
	let size = _v1.set(sizeX, sizeZ, 1)
	switch (shoeType_) {
		case shoeType.None:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).leftFootPrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableLeftFootPrintDecalNames
				},
				(state, aviailableLeftFootPrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableLeftFootPrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).leftFootPrintDecalOriginBox),
				size, quaternion, position
			)
		case shoeType.Heel:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).heelShoePrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableHeelShoePrintDecalNames
				},
				(state, aviailableHeelShoePrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableHeelShoePrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).heelShoePrintDecalOriginBox),
				size, quaternion, position
			)
		case shoeType.RearHeel:
		case shoeType.Common:
			return add(state, [
				state => {
					return NullableUtils.getExn(_getState(state).leftCommonShoePrintDecalQueue)
				},
				state => {
					return _getState(state).aviailableLeftCommonShoePrintDecalNames
				},
				(state, aviailableLeftCommonShoePrintDecalNames) => {
					return _setState(state, {
						..._getState(state),
						aviailableLeftCommonShoePrintDecalNames
					})
				}
			], 20, NullableUtils.getExn(_getState(state).leftCommonShoePrintDecalOriginBox),
				size, quaternion, position
			)
	}
}

let _isCanAddDecal = (state, usedGirl, forceSize) => {
	// return true
	// return forceSize >= 500 || isBigGiantess(state, usedGirl)
	return forceSize >= 500 || (isMiddleGiantess(state, usedGirl) || isBigGiantess(state, usedGirl))
}

let _addPrint = (state: state, usedGirl, collisionPart_, shoeType, footBox, point) => {
	point.setY(0)

	let q = getQuaternion(getCollisionPartOBB(state, usedGirl, collisionPart_))
	q = TransformUtils.rotateOnLocalAxis(q, -Math.PI / 2, new Vector3(1, 0, 0))
	q = TransformUtils.rotateOnWorldAxis(q, Math.PI, new Vector3(0, 1, 0))

	let size = footBox.getSize(new Vector3())

	switch (collisionPart_) {
		case collisionPart.RightFoot:
			state = _addRightPrint(state, shoeType, size.x, size.z, q,
				point.clone().setY(point.y + 0.02)
			)
			break
		case collisionPart.LeftFoot:
			state = _addLeftPrint(state, shoeType, size.x, size.z, q,
				point.clone().setY(point.y + 0.02)
			)
			break
		default:
			throw new Error("err")
	}

	return state
}

// export let addFootDamageDecal = (state: state, scale, position) => {
// export let addFootDamageDecal = (state: state, size: number, position) => {
export let addFootDamageDecal = (state: state, sizeX: number, sizeZ: number, position) => {
	return add(state, [
		state => {
			return NullableUtils.getExn(_getState(state).footDamageDecalQueue)
		},
		state => {
			return _getState(state).aviailableFootDamageDecalNames
		},
		(state, aviailableFootDamageDecalNames) => {
			return _setState(state, {
				..._getState(state),
				aviailableFootDamageDecalNames
			})
		}
	], 100, NullableUtils.getExn(_getState(state).footDamageDecalOriginBox),
		// scale,
		_v1.set(sizeX, sizeZ, 1),
		TransformUtils.rotateOnLocalAxis(new Quaternion(), -Math.PI / 2, new Vector3(1, 0, 0)),
		position.clone().setY(position.y + 0.1)
	)
}

let _stompHitTerrainHandler = (state: state, { userData }) => {
	let {
		point,
		force,
		stompRangeBox,
		// rightFootBox,
		collisionPart_,
		shoeType,
		usedGirl
	} = NullableUtils.getExn(userData)

	let [forceSize, forceDirection] = force

	if (!_isCanAddDecal(state, usedGirl, forceSize)) {
		return Promise.resolve(state)
	}

	point.setY(0)

	let size = stompRangeBox.getSize(_v1)
	// state = addFootDamageDecal(state, stompRangeBox.getSize(new Vector3()), point)
	// state = addFootDamageDecal(state, stompRangeBox.getSize(_v1).x, point)
	state = addFootDamageDecal(state, size.x, size.z, point)

	state = _addPrint(state, usedGirl, collisionPart_, shoeType, getCollisionPartOBB(state, usedGirl, collisionPart_), point)

	return Promise.resolve(state)
}

let _moveHitTerrainHandler = (state: state, { userData }) => {
	let {
		point,
		force,
		footBox,
		collisionPart_,
		shoeType, usedGirl
	} = NullableUtils.getExn(userData)

	let [forceSize, forceDirection] = force

	if (!_isCanAddDecal(state, usedGirl, forceSize)) {
		return Promise.resolve(state)
	}

	state = _addPrint(state, usedGirl, collisionPart_, shoeType, footBox, point)

	return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	abstractState = Event.on(abstractState, getStompHitTerrainEventName(), _stompHitTerrainHandler)
	abstractState = Event.on(abstractState, getMoveHitTerrainEventName(), _moveHitTerrainHandler)

	state = setAbstractState(state, abstractState)


	state = _buildFootDamageDecalQueue(state)
	state = _buildRightFootPrintDecalQueue(state)
	state = _buildLeftFootPrintDecalQueue(state)
	state = _buildRightCommonShoePrintDecalQueue(state)
	state = _buildLeftCommonShoePrintDecalQueue(state)
	state = _buildHeelShoePrintDecalQueue(state)

	return Promise.resolve(state)
}

export let dispose = (state: state) => {
	NullableUtils.forEach(
		terrainMesh => {
			getScene(state).remove(terrainMesh)
		},
		_getState(state).terrainMesh
	)


	// state = setAbstractState(state,
	// 	_getAllBaseMapResourceIds().reduce((abstractState, id) => {
	// 		return Loader.removeResource(abstractState,
	// 			id
	// 		)
	// 	}, getAbstractState(state))
	// )

	state = setAbstractState(state, Event.off(getAbstractState(state), getStompHitTerrainEventName(), _stompHitTerrainHandler))
	state = setAbstractState(state, Event.off(getAbstractState(state), getMoveHitTerrainEventName(), _moveHitTerrainHandler))

	let {
		footDamageDecalQueue,
		rightFootPrintDecalQueue,
		leftFootPrintDecalQueue,
		leftCommonShoePrintDecalQueue,
		rightCommonShoePrintDecalQueue,
		heelShoePrintDecalQueue,
	} = _getState(state)
	NullableUtils.getExn(footDamageDecalQueue).dispose()
	NullableUtils.getExn(rightFootPrintDecalQueue).dispose()
	NullableUtils.getExn(leftFootPrintDecalQueue).dispose()
	NullableUtils.getExn(leftCommonShoePrintDecalQueue).dispose()
	NullableUtils.getExn(rightCommonShoePrintDecalQueue).dispose()
	NullableUtils.getExn(heelShoePrintDecalQueue).dispose()
	// NullableUtils.forEach(footDamageDecalQueue => footDamageDecalQueue.dispose(), footDamageDecalQueue)
	// // NullableUtils.getExn(rightFootPrintDecalQueue).dispose()
	// NullableUtils.forEach(rightFootPrintDecalQueue => rightFootPrintDecalQueue.dispose(), rightFootPrintDecalQueue)
	// // NullableUtils.getExn(leftFootPrintDecalQueue).dispose()
	// NullableUtils.forEach(leftFootPrintDecalQueue => leftFootPrintDecalQueue.dispose(), leftFootPrintDecalQueue)
	// // NullableUtils.getExn(leftCommonShoePrintDecalQueue).dispose()
	// NullableUtils.forEach(leftCommonShoePrintDecalQueue => leftCommonShoePrintDecalQueue.dispose(), leftCommonShoePrintDecalQueue)
	// // NullableUtils.getExn(rightCommonShoePrintDecalQueue).dispose()
	// NullableUtils.forEach(rightCommonShoePrintDecalQueue => rightCommonShoePrintDecalQueue.dispose(), rightCommonShoePrintDecalQueue)
	// // NullableUtils.getExn(heelShoePrintDecalQueue).dispose()
	// NullableUtils.forEach(heelShoePrintDecalQueue => heelShoePrintDecalQueue.dispose(), heelShoePrintDecalQueue)


	state = _setState(state, createState())

	return Promise.resolve(state)
}

export let getGroundY = () => 0.1

export let getPositionParrelToGround = (position) => {
	return position.clone().setY(getGroundY())
}
