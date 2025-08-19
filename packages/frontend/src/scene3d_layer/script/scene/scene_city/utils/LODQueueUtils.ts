import { Camera } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { AmbientLight } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, Matrix4, Vector3 } from "three"
import { LODQueue as LODQueueType } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { getScene } from "../CityScene"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract"
import { buildStatus } from "./LODContainerUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { addBox3Helper } from "./ConfigUtils"

export let buildQueue = (state: state, buildNameFunc, count, distance, scene, mesh): [state, Box3, LODQueueType, Array<string>] => {
	let camera = Camera.getCurrentCamera(getAbstractState(state))


	// let scene = getScene(state)

	// //let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))



	let group_ = NewThreeInstance.createGroup()


	// let ruin = NewThreeInstance.createMesh(
	// 	// NewThreeInstance.createPlaneGeometry(1, 1, 1, 1),
	// 	NewThreeInstance.createBoxGeometry(1, _getHeight(), 1, 1, 1),
	// 	NewThreeInstance.createMeshPhongMaterial({
	// 		map: Loader.getResource<Texture>(getAbstractState(state), getBuildingResourceId()),
	// 		transparent: false,
	// 	})
	// )

	// let mesh = ruin
	mesh = Object3DUtils.changeTransformToDefault(mesh)
	mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material)


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

	queue.name = "lodQueue"

	queue.details = details

	let box = queue.computeBox()

	let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

	instancedlod.setContainer(queue);
	instancedlod.setLevels(details, getIsDebug(state));
	instancedlod.setPopulation();


	let data = ArrayUtils.range(1, count).reduce(([state, result], i) => {
		let newTransform = new Matrix4()
		let newName = buildNameFunc(i)
		let newBox = box.clone().applyMatrix4(newTransform)

		queue.insert(newTransform, newBox, newName)

		state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), newName, buildStatus(false, false, false)))

		return [state, ArrayUtils.push(result, newName)]
	}, [state, []])
	state = data[0]
	let names = data[1]


	state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))


	// state = _setState(state, {
	// 	..._getState(state),
	// 	ruinOriginBox: NullableUtils.return_(box),
	// 	ruinQueue: NullableUtils.return_(queue),
	// 	aviailableNames: names
	// })

	return [state, box, queue, names]
}

let _reallocate = (state: state, [distances, names]: [Array<number>, Array<string>], position, distance, maxCount) => {
	let result = distances.reduce((result, distanceInQueue, index) => {
		let name = names[index]

		if (distanceInQueue > distance) {
			return ArrayUtils.push(result, name)
		}

		return result
	}, []).slice(0, maxCount)

	if (result.length < maxCount) {
		let newDistance = NumberUtils.clamp(distance * (result.length / maxCount), distance / 2, distance / 10)

		return _reallocate(state, [distances, names], position, newDistance, maxCount)
	}

	result.forEach(name => {
		LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, false))
	})

	return result
}

let _reallocateNearestAviailableNames = (state: state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], position, distance, maxCount) => {
	let queue: LODQueueType = getQueueFunc(state)

	let distances = queue.reduce([], (distances, transform, index) => {
		return ArrayUtils.push(
			distances,
			TransformUtils.getPositionFromMatrix4(transform).distanceTo(position)
		)
	})

	let result = _reallocate(state, [distances, queue.names], position, distance, maxCount)

	return setAviailableNamesFunc(state, getAviailableNamesFunc(state).concat(result)
	)
}

let _useAviailableName = (state: state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], position, distance, maxCount): [state, string] => {
	let aviailableNames = getAviailableNamesFunc(state)

	if (aviailableNames.length == 0) {
		state = _reallocateNearestAviailableNames(state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], position, distance, maxCount)

		aviailableNames = getAviailableNamesFunc(state)
	}

	return [setAviailableNamesFunc(state, aviailableNames.slice(1, aviailableNames.length)), aviailableNames[0]]
}

export let add = (state: state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], maxCount, originBox, scale, quat, position) => {
	// let data = _useAviailableName(state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], position, 500, maxCount)
	let data = _useAviailableName(state, [getQueueFunc, getAviailableNamesFunc, setAviailableNamesFunc], position, 300, maxCount)
	state = data[0]
	let name = data[1]


	let queue: LODQueueType = getQueueFunc(state)

	// let scale = new Vector3(size.x, 1, size.z)



	// let quat = TransformUtils.rotateOnLocalAxis(new Quaternion(), -Math.PI / 2, new Vector3(1, 0, 0))
	// let quat = new Quaternion()
	// let position = point.clone().setY(point.y + _getHeight() / 2)

	// let originBox = NullableUtils.getExn(_getState(state).ruinOriginBox)

	queue.forEach((transform, i) => {
		if (queue.names[i] == name) {
			let box = queue.boxes[i]

			transform.compose(position, quat, scale)
			box.copy(originBox.clone().applyMatrix4(transform))

			// Console.log(
			// 	data.box
			// )



			if (getIsDebug(state)) {
				addBox3Helper(getAbstractState(state), getScene(state), box, 0x1fff00)
			}
		}
	})
	state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, true)))

	return state
}

// export let remove = (state: state, getQueueFunc, index) => {
// 	let queue: LODQueueType = getQueueFunc(state)

// 	return setAbstractState(state, queue.remove(getAbstractState(state), index))
// }