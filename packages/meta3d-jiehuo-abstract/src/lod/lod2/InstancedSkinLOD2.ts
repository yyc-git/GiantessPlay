import * as THREE from "three";
import { state } from "../../type/StateType";
import { InstancedLOD2Abstract, data } from "./InstancedLOD2Abstract";
import { InstancedSkinnedMesh } from "../../gpu_skin/InstancedSkinnedMesh";
import { forEach, getExn, getWithDefault, map } from "../../utils/NullableUtils";
import { requireCheck, test } from "../../utils/Contract";
// import { getClipData } from "../../gpu_skin/GPUSkin";
import { changeToHash, push, reducePromise } from "../../utils/ArrayUtils";

export class InstancedSkinLOD2 extends InstancedLOD2Abstract {
	public fps: number

	// constructor(scene, camera) {
	// 	super(scene, camera)
	// }

	protected createInstancedMesh(oldInstancedMesh, mesh: THREE.SkinnedMesh, geometry: any, material: any, count: any) {
		let instancedSkinnedMesh = new InstancedSkinnedMesh(geometry, material, count)
		instancedSkinnedMesh.bind(mesh.skeleton, mesh.bindMatrix)

		// forEach(oldInstancedMesh => {
		// 	instancedSkinnedMesh.copyFromOldOne(oldInstancedMesh)
		// }, oldInstancedMesh)

		return instancedSkinnedMesh
	}

	protected addData(instancedMesh: InstancedSkinnedMesh, data: data) {
		requireCheck(() => {
			test("allNames should be empty", () => {
				return instancedMesh.allNames.length == 0
			})
		}, true)

		// for (let k = 0; k < data.count; k++) {
		// 	instancedMesh.addName(data.names[k])
		// }


		instancedMesh.allNames = data.names
	}

	protected updateData(instancedMesh: InstancedSkinnedMesh, data: data) {
		// let newAllNames = []
		// for (let k = 0; k < data.count; k++) {
		// 	let name = data.names[k]

		// 	// newAllNames.push(getExn(
		// 	// 	instancedMesh.instancedSkeletonAnimationData.find(singleInstancedSkeletonData => {
		// 	// 		return singleInstancedSkeletonData.name == name
		// 	// 	})
		// 	// ))
		// 	newAllNames.push(
		// 		getWithDefault(
		// 			// map(
		// 			// 	singleInstancedSkeletonData => {
		// 			// 		singleInstancedSkeletonData.index = k

		// 			// 		return singleInstancedSkeletonData
		// 			// 	},
		// 			// 	instancedMesh.instancedSkeletonAnimationData.find(singleInstancedSkeletonData => {
		// 			// 		return singleInstancedSkeletonData.name == name
		// 			// 	})
		// 			// ),

		// 			instancedMesh.allNames.find(singleInstancedSkeletonData => {
		// 				return singleInstancedSkeletonData.name == name
		// 			}),
		// 			instancedMesh.createInstancedSkeletonAnimationData(data.names[k])
		// 		))
		// }

		// let namesHash = changeToHash(data.names)

		// let newAllNames = instancedMesh.allNames.reduce((newAllNames, d) => {
		// 	let name = d.name

		// 	let value
		// 	// if (data.names.includes(name)) {
		// 	if (namesHash[name]) {
		// 		value = d
		// 	}
		// 	else {
		// 		value = instancedMesh.createInstancedSkeletonAnimationData(name)
		// 	}

		// 	return push(newAllNames, value)
		// }, [])




		// let allNames = instancedMesh.allNames

		// // let indexHash = changeToHash(allNames.map(d => {
		// // 	return d.name
		// // }))
		// let indexHash = changeToHash(allNames)

		// let newAllNames = data.names.reduce((newAllNames, name) => {
		// 	let index = indexHash[name]

		// 	let value
		// 	if (index !== undefined) {
		// 		value = allNames[index]
		// 	}
		// 	else {
		// 		// value = instancedMesh.createInstancedSkeletonAnimationData(name)
		// 		value = name
		// 	}

		// 	return push(newAllNames, value)
		// }, [])

		// instancedMesh.allNames = newAllNames


		instancedMesh.allNames = data.names
	}

	// protected resetInstancedMesh(instancedMesh: InstancedSkinnedMesh) {
	// 	instancedMesh.instancedSkeletonAnimationData = []
	// }
	// public update(){
	// 	super.update()


	// }
}

export let add = (state: state, skinLOD2: InstancedSkinLOD2) => {
	return {
		...state,
		lod: {
			...state.lod,
			skinLOD2s: state.lod.skinLOD2s.push(skinLOD2)
		}
	}
}

export let update = <specificState>(specificState: specificState, getAbstractStateFunc) => {
	let state = getAbstractStateFunc(specificState)

	return reducePromise<specificState, InstancedSkinLOD2>(state.lod.skinLOD2s.toArray(), (specificState, skinLOD2) => {
		skinLOD2.update(state)

		return reducePromise(skinLOD2.getAllLevelInstancedMeshes(), (specificState, instancedSkinnedMesh) => {
			return instancedSkinnedMesh.update(
				specificState,
				getAbstractStateFunc,
				skinLOD2.fps,
				// getClipData(state, skinLOD2.name)
			)
		}, specificState)
	}, specificState)
}