import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { Loader } from "meta3d-jiehuo-abstract"
import { getBaseMapResourceId, getColorMapResourceId, getHeightMapResourceId, getName, getScene, getState, setState } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, Color, DoubleSide, Material, Matrix4, Object3D, Quaternion, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, Vector3, VectorKeyframeTrack } from "three"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { terrain } from "../../type/StateType"
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
import { getHitTerrainEventName } from "../../../../../utils/EventUtils"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { add, buildQueue } from "../../utils/LODQueueUtils"

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

export let getFootDamage1ResourcePath = (name) => `${getFootDamage1ResourceId(name)}.png`

export let parseAndAddResources = (state: state) => {
	// let abstractState = getAbstractState(state)

	// let terrainMesh = Terrain.create({
	// 	heightMap: Loader.getResource(abstractState, getHeightMapResourceId()),
	// 	colorMap: Loader.getResource(abstractState, getColorMapResourceId()),
	// 	baseMap: Loader.getResource(abstractState, getBaseMapResourceId()),
	// })

	// terrainMesh = Shadow.setShadow(terrainMesh, false, true)


	let baseMap = Loader.getResource<Texture>(getAbstractState(state), getBaseMapResourceId())
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

	ground.position.set(0, -0.1, 0)

	ground.castShadow = false
	ground.receiveShadow = true

	// CSM.setupMaterial(getAbstractState(state), ground.material as Material);


	return Promise.resolve(_setState(state, {
		..._getState(state),
		terrainMesh: return_(ground)
	}))

}

export let createState = (): terrain => {
	return {
		// terrain: null,
		// terrainVertices: null,
		terrainMesh: null,

		footDamageDecalOriginBox: null,
		footDamageDecalQueue: null,
		aviailableFootDamageDecalNames: [],
	}
}

export let getBoundingBox = () => {
	// terrainMesh.geometry.computeBoundingBox();

	// return terrainMesh.geometry.boundingBox;

	return Terrain.buildBigBoundingBox()
}

let _buildFootDamageDecalName = (index) => {
	return `footDamageDecal_${index}`
}

let _buildFootDamageDecalQueue = (state: state) => {
	const count = 100
	const distance = 1000

	let texture = Loader.getResource<Texture>(getAbstractState(state), getFootDamage1ResourceId(getName()))
	texture.offset.x = -0.1

	let decal = NewThreeInstance.createMesh(
		NewThreeInstance.createPlaneGeometry(1, 1, 1, 1),
		fixZFighting(NewThreeInstance.createMeshPhongMaterial({
			map: texture,
			transparent: true,
		}))
	)

	let scene = getScene(state)

	//let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))


	let data = buildQueue(state, _buildFootDamageDecalName, count, distance, scene, decal)
	state = data[0]
	let box = data[1]
	let queue = data[2]
	let names = data[3]

	state = _setState(state, {
		..._getState(state),
		footDamageDecalOriginBox: NullableUtils.return_(box),
		footDamageDecalQueue: NullableUtils.return_(queue),
		aviailableFootDamageDecalNames: names
	})

	return state

}

let _hitTerrainHandler = (state: state, { userData }) => {
	let { point, force, box } = NullableUtils.getExn(userData)

	let [forceSize, forceDirection] = force

	if (forceSize < 500) {
		return Promise.resolve(state)
	}

	point.setY(0)

	state = add(state, [
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
	], 20, NullableUtils.getExn(_getState(state).footDamageDecalOriginBox),
		box.getSize(new Vector3()),
		TransformUtils.rotateOnLocalAxis(new Quaternion(), -Math.PI / 2, new Vector3(1, 0, 0)),
		// point.clone().setY(point.y + 0.1)
		point.clone().setY(point.y + 0.01)
	)

	return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	abstractState = Event.on(abstractState, getHitTerrainEventName(), _hitTerrainHandler)

	state = setAbstractState(state, abstractState)


	state = _buildFootDamageDecalQueue(state)

	return Promise.resolve(state)
}

export let dispose = (state: state) => {
	NullableUtils.forEach(
		terrainMesh => {
			getScene(state).remove(terrainMesh)
		},
		_getState(state).terrainMesh
	)

	state = setAbstractState(state, Event.off(getAbstractState(state), getHitTerrainEventName(), _hitTerrainHandler))

	return Promise.resolve(state)
}