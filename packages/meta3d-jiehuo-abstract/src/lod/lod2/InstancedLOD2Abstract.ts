import * as THREE from "three";
import { state } from "../../type/StateType";
import { requireCheck, test } from "../../utils/Contract";
import { LODContainer } from "./LODContainer";
import { getEmpty } from "../../utils/NullableUtils";
import { nullable } from "../../utils/nullable";
import { markNotNeedsUpdate } from "../../utils/Object3DUtils";
// import { toSeePoint } from "../utilities";

export type data = {
	meshes: Array<THREE.Mesh>,
	count: number,
	matrix4s: Array<THREE.Matrix4>,
	names: Array<string>
	castShadow: boolean,
	receiveShadow: boolean,
}

let count = 0
export abstract class InstancedLOD2Abstract {
	public name = ""

	// public treeSpecies
	public numOfLevel
	public scene
	public camera
	public levels
	public instancedMeshOfAllLevel: Array<data>
	public groupOfInstances


	public container: LODContainer

	public frustum
	public worldProjectionMatrix
	public obj_position
	// public cur_dist
	// public cur_level

	constructor(scene, camera) {
		// this.treeSpecies = treeSpecies;
		this.numOfLevel = 0;
		this.scene = scene;
		this.camera = camera;
		this.levels;
		this.instancedMeshOfAllLevel;
		this.groupOfInstances;

		this.frustum = new THREE.Frustum();
		this.worldProjectionMatrix = new THREE.Matrix4();
		this.obj_position = new THREE.Vector3();
		// this.cur_dist = 0;
		// this.cur_level = 0;
	}

	protected abstract createInstancedMesh(oldInstancedMesh: nullable<THREE.InstancedMesh>, mesh: THREE.Mesh, geometry, material, count)

	// protected resetInstancedMesh(instancedMesh: THREE.InstancedMesh) {
	// }
	protected addData(instancedMesh: THREE.InstancedMesh, data: data) {
	}
	protected updateData(instancedMesh: THREE.InstancedMesh, data: data) {
	}


	setContainer(container) {
		this.container = container;
	}

	extractMeshes(group) {
		// return group.children[0].isMesh
		// 	? group.children
		// 	: group.children[0].children;

		return group.children
	}

	setLevels(array, isDebug) {
		requireCheck(() => {
			let group = array[0].group

			test("meshs should be first level children", () => {
				return group.children.reduce((result, child: THREE.Mesh) => {
					if (!result) {
						return result
					}

					return child.isMesh && child.children.length == 0
				}, true)
			})
			test("transform should be default", () => {
				return group.children.reduce((result, child: THREE.Mesh) => {
					if (!result) {
						return result
					}

					return child.position.equals(new THREE.Vector3(0, 0, 0)) && child.rotation.equals(new THREE.Euler(0, 0, 0)) && child.scale.equals(new THREE.Vector3(1, 1, 1))
				}, true)
			})
		}, isDebug)

		this.numOfLevel = array.length;
		this.levels = new Array(this.numOfLevel);
		this.instancedMeshOfAllLevel = new Array(this.numOfLevel); // array of { mesh:[], count, matrix4s:[] }
		this.groupOfInstances = new Array(this.numOfLevel); // array of THREE.Group(), each Group -> treeAndProp meshes in each level
		for (let i = 0; i < this.numOfLevel; i++) {
			this.levels[i] = array[i].distance;
			let group = array[i].group
			this.instancedMeshOfAllLevel[i] = {
				meshes: this.extractMeshes(group),
				count: 0,
				matrix4s: [],
				names: [],
				castShadow: group.castShadow,
				receiveShadow: group.receiveShadow,
			};
		}
	}



	_initInstancedMesh(instancedMesh) {
		instancedMesh.frustumCulled = false
		markNotNeedsUpdate(instancedMesh)
	}

	_initGroup(group) {
		markNotNeedsUpdate(group)
	}

	setPopulation() {
		for (let i = 0; i < this.numOfLevel; i++) {
			const group = new THREE.Group();

			let { meshes, castShadow, receiveShadow } = this.instancedMeshOfAllLevel[i]

			meshes.forEach((m) => {
				// const instancedMesh = new THREE.InstancedMesh(
				// 	m.geometry,
				// 	m.material,
				// 	// 15000
				// 	0
				// );
				const instancedMesh = this.createInstancedMesh(getEmpty(), m, m.geometry, m.material, 0)

				instancedMesh.castShadow = castShadow;
				instancedMesh.receiveShadow = receiveShadow;

				this._initInstancedMesh(instancedMesh)

				// instancedMesh.instanceMatrix.needsUpdate = true;
				group.add(instancedMesh);

				this._initGroup(group)
			});
			this.groupOfInstances[i] = group;
			this.scene.add(group);
		}
	}

	getDistanceLevel(dist) {
		const { levels } = this;
		const length = levels.length;
		for (let i = 0; i < length; i++) {
			if (dist <= levels[i]) {
				return i;
			}
		}
		// return length - 1;
		return -1
	}

	getLastLevel() {
		return this.levels.length - 1;
	}

	// getSpecies() {
	// 	return this.treeSpecies;
	// }

	expandFrustum(frustum, offset) {
		frustum.planes.forEach((plane) => {
			plane.constant += offset;
		});
	}

	getAllLevelInstancedMeshes() {
		let {
			numOfLevel,
			groupOfInstances,
		} = this;

		let result = []

		for (let i = 0; i < numOfLevel; i++) {
			for (let j = 0; j < groupOfInstances[i].children.length; j++) {
				let instancedMesh = groupOfInstances[i].children[j];

				result.push(instancedMesh)
			}
		}

		return result
	}

	/* update函数每帧都要进行,内存交换越少越好,计算时间越短越好 */
	// render() {
	update(state: state) {
		count++
		let {
			instancedMeshOfAllLevel,
			groupOfInstances,
			numOfLevel,
			camera,
			frustum,
			container,
			worldProjectionMatrix,
			obj_position,
			// cur_dist,
			// cur_level,
		} = this;
		// clear
		for (let i = 0; i < numOfLevel; i++) {
			instancedMeshOfAllLevel[i].count = 0;
			instancedMeshOfAllLevel[i].matrix4s = [];
			instancedMeshOfAllLevel[i].names = [];
		}
		// update camera frustum
		worldProjectionMatrix.identity(); // reset as identity matrix
		frustum.setFromProjectionMatrix(
			worldProjectionMatrix.multiplyMatrices(
				camera.projectionMatrix,
				camera.matrixWorldInverse
			)
		);

		// this.expandFrustum(frustum, 25);

		// let found = container.queryByFrustum(frustum);
		// let [transformFound, _boxFound, nameFound] = container.queryByFrustum(frustum);
		let [foundCount, transformFound, nameFound] = container.queryByFrustum(state, frustum);
		// let transformFound = container.queryByFrustum(state, frustum);

		for (let i = 0; i < foundCount; i++) {
			let matrix = transformFound[i]
			let name = nameFound[i]

			obj_position.setFromMatrixPosition(matrix);
			let cur_dist = obj_position.distanceTo(camera.position);
			let cur_level = this.getDistanceLevel(cur_dist);
			if (cur_level != -1) {
				instancedMeshOfAllLevel[cur_level].count++;
				instancedMeshOfAllLevel[cur_level].matrix4s.push(matrix); // column-major list of a matrix
				instancedMeshOfAllLevel[cur_level].names.push(name);
			}
		}

		// Console.log("instancedMeshOfAllLevel:", instancedMeshOfAllLevel);

		for (let i = 0; i < numOfLevel; i++) {
			// Console.log(count)
			const obj = instancedMeshOfAllLevel[i]; // obj: { meshes:[], count, matrix4s:[] }
			for (let j = 0; j < groupOfInstances[i].children.length; j++) {
				// let new_instancedMesh = new THREE.InstancedMesh(
				//   obj.meshes[j].geometry,
				//   obj.meshes[j].material,
				//   obj.count
				// );
				// for (let k = 0; k < obj.count; k++) {
				//   new_instancedMesh.setMatrixAt(k, obj.matrix4s[k]);
				// }
				// new_instancedMesh.castShadow = true;
				// new_instancedMesh.receiveShadow = true;
				// groupOfInstances[i].children[j] = new_instancedMesh;

				let instancedMesh = groupOfInstances[i].children[j];


				if (instancedMesh.count >= obj.count) {
					instancedMesh.count = obj.count;
					// this.resetInstancedMesh(instancedMesh)
					for (let k = 0; k < obj.count; k++) {
						instancedMesh.instanceMatrix.needsUpdate = true;
						instancedMesh.setMatrixAt(k, obj.matrix4s[k]);
					}
					this.updateData(instancedMesh, obj)
				} else {
					// let new_instancedMesh = new THREE.InstancedMesh(
					// 	obj.meshes[j].geometry,
					// 	obj.meshes[j].material,
					// 	obj.count
					// );
					let new_instancedMesh = this.createInstancedMesh(
						instancedMesh,
						obj.meshes[j],
						obj.meshes[j].geometry,
						obj.meshes[j].material,
						obj.count
					)

					for (let k = 0; k < obj.count; k++) {
						new_instancedMesh.setMatrixAt(k, obj.matrix4s[k]);
					}
					this.addData(new_instancedMesh, obj)

					new_instancedMesh.castShadow = obj.castShadow;
					new_instancedMesh.receiveShadow = obj.receiveShadow;


					this._initInstancedMesh(new_instancedMesh)

					groupOfInstances[i].children[j] = new_instancedMesh;

				}
			}
		}
		// Console.log("groupOfInstances:", groupOfInstances);
	}
}