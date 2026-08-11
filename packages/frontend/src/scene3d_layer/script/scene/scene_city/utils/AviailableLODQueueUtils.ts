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
import * as LODQueueUtils from "./LODQueueUtils"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"

export let buildQueue = (state: state, buildNameFunc, count, getDistanceFunc: (state: state) => number, scene, mesh): [state, Box3, LODQueueType, Array<string>] => {
	let data1 = LODQueueUtils.buildQueue(state, material => material, getDistanceFunc, mesh, {
		castShadow: false,
		receiveShadow: false
	})
	state = data1[0]
	let queue = data1[1]

	let box = queue.originBox

	let data2 = ArrayUtils.range(1, count).reduce(([state, result], i) => {
		let newTransform = new Matrix4()
		let newName = buildNameFunc(i)
		let newBox = box.clone().applyMatrix4(newTransform)

		queue.insert(newTransform, newBox, newName, buildStatus(false, false, false))

		// state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), newName, buildStatus(false, false, false)))

		return [state, ArrayUtils.push(result, newName)]
	}, [state, []])
	state = data2[0]
	let names = data2[1]


	// state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))


	// state = _setState(state, {
	// 	..._getState(state),
	// 	ruinOriginBox: NullableUtils.return_(box),
	// 	ruinQueue: NullableUtils.return_(queue),
	// 	aviailableNames: names
	// })

	return [state, box, queue, names]
}

let _reallocate = (state: state, queue, [distances, names]: [Array<number>, Map<number, string>], position, distance, maxCount) => {
	let result = distances.reduce((result, distanceInQueue, index) => {
		// let name = names[index]
		let name = MutableMapUtils.getExn(names, index)

		if (distanceInQueue > distance) {
			return ArrayUtils.push(result, name)
		}

		return result
	}, []).slice(0, maxCount)

	if (result.length < maxCount && result.length > distances.length) {
		// let newDistance = NumberUtils.clamp(distance * (result.length / maxCount), distance / 2, distance / 10)
		// let newDistance = NumberUtils.clamp(distance * (result.length / maxCount), distance / 10, distance / 2)
		let newDistance = NumberUtils.clamp(distance * (result.length / maxCount), distance < 10 ? 0 : distance / 10, distance / 2)

		return _reallocate(state, queue, [distances, names], position, newDistance, maxCount)
	}

	result.forEach(name => {
		// LOD.setStatusForLODQueueByName(getAbstractState(state), name, buildStatus(false, false, false))
		queue.setStatusByName(name, buildStatus(false, false, false))
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

	let result = _reallocate(state, queue, [distances, queue.names], position, distance, maxCount)

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
		// if (queue.getName(i) == name) {
		if (queue.getName(i) == name) {
			let box = queue.getBox(i)

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
	// state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), name, buildStatus(false, false, true)))
	queue.setStatusByName(name, buildStatus(false, false, true))

	return state
}

// export let remove = (state: state, getQueueFunc, index) => {
// 	let queue: LODQueueType = getQueueFunc(state)

// 	return setAbstractState(state, queue.remove(getAbstractState(state), index))
// }