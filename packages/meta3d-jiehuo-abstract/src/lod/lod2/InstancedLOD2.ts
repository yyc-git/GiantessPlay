import * as THREE from "three";
import { state } from "../../type/StateType";
import { InstancedLOD2Abstract, data } from "./InstancedLOD2Abstract";
import { nullable } from "../../utils/nullable";
import { NullableUtils } from "../../Main";

/*************************************************************************************
 * CLASS NAME:  InstancedLOD
 * DESCRIPTION: Combine instancedMesh with lod instead of using THREE.LOD
 * NOTE:        Each class of InstancedLOD represents one single kind of tree,
//  *              check 'treeSpecies' for detail
 *
 *************************************************************************************/
export class InstancedLOD2 extends InstancedLOD2Abstract {
	// constructor(scene, camera) {
	// 	super(scene, camera)
	// }

	private _disposeOldInstancedMesh(oldInstancedMesh: nullable<THREE.InstancedMesh>) {
		NullableUtils.forEach(oldInstancedMesh => {
			oldInstancedMesh.dispose()
			oldInstancedMesh.instanceMatrix = null
			oldInstancedMesh.instanceColor = null
		}, oldInstancedMesh)
	}

	protected createInstancedMesh(state, oldInstancedMesh, mesh: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>, geometry: any, material: any, count: any): [state, THREE.InstancedMesh] {
		this._disposeOldInstancedMesh(oldInstancedMesh)

		return [state, new THREE.InstancedMesh(geometry, material, count)]
	}
}

export let add = (state: state, lod2: InstancedLOD2) => {
	return {
		...state,
		lod: {
			...state.lod,
			lod2s: state.lod.lod2s.push(lod2)
		}
	}
}

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	let state = getAbstractStateFunc(specificState)

	state.lod.lod2s.forEach(lod2 => {
		state = lod2.update(state, specificState)
	})

	return Promise.resolve(setAbstractStateFunc(specificState, state))
}