import * as THREE from "three";
import { state } from "../../type/StateType";
import { requireCheck, test } from "../../utils/Contract";
import { LODContainer } from "./LODContainer";
import { getEmpty } from "../../utils/NullableUtils";
import { nullable } from "../../utils/nullable";
import { markNotNeedsUpdate } from "../../utils/Object3DUtils";
// import { getIsRenderAccuracyIncrease } from "../../setting/RenderSetting";
import { NullableUtils } from "../../Main";
import { deepDispose } from "../../scene/utils/DisposeUtils";
// import { toSeePoint } from "../utilities";

export type data = {
	meshes: Array<THREE.Mesh>,
	count: number,
	matrix4s: Array<THREE.Matrix4>,
	names: Array<string>
	colors: Array<THREE.Color>,
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
	// public groupOfInstances: Array<THREE.Group>
	public groupOfInstances: Array<any>


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

	protected abstract createInstancedMesh(state: state, oldInstancedMesh: nullable<THREE.InstancedMesh>, mesh: THREE.Mesh, geometry, material, count): [state, THREE.InstancedMesh]

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
			// this.levels[i] = array[i].distance;
			this.levels[i] = array[i].getDistanceFunc;
			let group = array[i].group
			this.instancedMeshOfAllLevel[i] = {
				meshes: this.extractMeshes(group),
				count: 0,
				matrix4s: [],
				names: [],
				colors: [],
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

	setPopulation(state: state) {
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

				let d = this.createInstancedMesh(state, getEmpty(), m, m.geometry, m.material, 0)
				state = d[0]
				let instancedMesh = d[1]

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

		return state
	}

	getDistanceLevel(specificState, dist) {
		const { levels } = this;
		const length = levels.length;
		for (let i = 0; i < length; i++) {
			if (dist <= levels[i](specificState)) {
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

	// _isDefaultColor(color) {
	// 	// return color.r == 1 && color.g == 1 && color.b == 1
	// 	let { r, g, b } = color
	// 	return r > 0.99 && r < 1.01
	// 		&& g > 0.99 && g < 1.01
	// 		&& b > 0.99 && b < 1.01
	// }


	// 新增辅助方法
	private _updateInstancedMesh(
		mesh: THREE.InstancedMesh,
		sourceData: any,
		hasColors: boolean,
		isRenderAccuracyHigh: boolean
	) {
		// 设置矩阵
		for (let k = 0; k < sourceData.count; k++) {
			mesh.setMatrixAt(k, sourceData.matrix4s[k]);
			mesh.instanceMatrix.needsUpdate = true;

			// 设置颜色
			if (hasColors) {
				mesh.setColorAt(k, sourceData.colors[k]);
				mesh.instanceColor.needsUpdate = true;
			}
		}

		// 更新阴影设置
		if (isRenderAccuracyHigh) {
			mesh.castShadow = false
			mesh.receiveShadow = false
		}

		// 更新自定义数据
		this.updateData(mesh, sourceData);
	}

	private _addInstancedMesh(
		mesh: THREE.InstancedMesh,
		sourceData: any,
		hasColors: boolean,
		isRenderAccuracyHigh: boolean
	) {
		// 设置矩阵
		for (let k = 0; k < sourceData.count; k++) {
			mesh.setMatrixAt(k, sourceData.matrix4s[k]);
			// mesh.instanceMatrix.needsUpdate = true;

			// 设置颜色
			if (hasColors) {
				mesh.setColorAt(k, sourceData.colors[k]);
				// mesh.instanceColor.needsUpdate = true;
			}
		}

		// 更新阴影设置
		mesh.castShadow = isRenderAccuracyHigh ? false : sourceData.castShadow;
		mesh.receiveShadow = isRenderAccuracyHigh ? false : sourceData.receiveShadow;

		// 更新自定义数据
		// this.updateData(mesh, sourceData);
		this.addData(mesh, sourceData);

		this._initInstancedMesh(mesh)
	}

	/* update函数每帧都要进行,内存交换越少越好,计算时间越短越好 */
	// render() {
	update(state: state, specificState) {
		// this.count++;
		count++;

		// 解构常用引用
		const {
			instancedMeshOfAllLevel,
			groupOfInstances,
			numOfLevel,
			camera,
			frustum,
			container,
			worldProjectionMatrix,
			obj_position
		} = this;

		// 1. 批量重置代替循环重置
		for (let i = 0; i < numOfLevel; i++) {
			const mesh = instancedMeshOfAllLevel[i];
			mesh.count = 0;
			mesh.matrix4s.length = 0;
			mesh.names.length = 0;
			mesh.colors.length = 0;
		}

		// 2. 优化矩阵计算
		worldProjectionMatrix
			.copy(camera.projectionMatrix)
			.multiply(camera.matrixWorldInverse);
		frustum.setFromProjectionMatrix(worldProjectionMatrix);

		// 3. 查询结果处理
		const [foundCount, transformFound, nameFound, colorFound] =
			container.queryByFrustum(state, frustum);

		const hasColors = colorFound.length > 0;
		const colorCache = hasColors ? colorFound : null;

		// 4. 优化实例收集
		for (let i = 0; i < foundCount; i++) {
			const matrix = transformFound[i];
			obj_position.setFromMatrixPosition(matrix);

			const cur_dist = obj_position.distanceTo(camera.position);
			const cur_level = this.getDistanceLevel(specificState, cur_dist);

			if (cur_level === -1) continue;

			const targetMesh = instancedMeshOfAllLevel[cur_level];
			targetMesh.count++;
			targetMesh.matrix4s.push(matrix);
			targetMesh.names.push(nameFound[i]);

			if (hasColors) {
				targetMesh.colors.push(colorCache[i]);
			}
		}

		// // 5. 优化实例更新
		// for (let level = 0; level < numOfLevel; level++) {
		// 	const sourceData = instancedMeshOfAllLevel[level];
		// 	const instanceGroup = groupOfInstances[level];

		// 	for (let j = 0; j < instanceGroup.children.length; j++) {
		// 		const currentMesh = instanceGroup.children[j];
		// 		const isRenderAccuracyHigh = getIsRenderAccuracyIncrease(state);

		// 		if (currentMesh.count >= sourceData.count) {
		// 			// 复用现有实例
		// 			this._updateInstancedMesh(
		// 				currentMesh,
		// 				sourceData,
		// 				hasColors,
		// 				isRenderAccuracyHigh
		// 			);
		// 		} else {
		// 			// 创建新实例
		// 			const newMesh = this.createInstancedMesh(
		// 				currentMesh,
		// 				sourceData.meshes[j],
		// 				sourceData.meshes[j].geometry,
		// 				sourceData.meshes[j].material,
		// 				sourceData.count
		// 			);

		// 			this._addInstancedMesh(
		// 				newMesh,
		// 				sourceData,
		// 				hasColors,
		// 				isRenderAccuracyHigh
		// 			);

		// 			instanceGroup.children[j] = newMesh;
		// 		}
		// 	}
		// }
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
				let resultInstancedMesh


				if (instancedMesh.count >= obj.count) {
					instancedMesh.count = obj.count;
					// this.resetInstancedMesh(instancedMesh)
					for (let k = 0; k < obj.count; k++) {
						instancedMesh.instanceMatrix.needsUpdate = true;
						instancedMesh.setMatrixAt(k, obj.matrix4s[k]);
						if (hasColors) {
							// NullableUtils.forEach(
							// 	color => {
							// 		instancedMesh.setColorAt(k, color)
							// 		instancedMesh.instanceColor.needsUpdate = true;
							// 	}, obj.colors[k]
							// )
							instancedMesh.setColorAt(k, obj.colors[k])
							instancedMesh.instanceColor.needsUpdate = true;
						}
					}
					this.updateData(instancedMesh, obj)

					resultInstancedMesh = instancedMesh
				} else {
					// let new_instancedMesh = new THREE.InstancedMesh(
					// 	obj.meshes[j].geometry,
					// 	obj.meshes[j].material,
					// 	obj.count
					// );
					let d = this.createInstancedMesh(
						state,
						instancedMesh,
						obj.meshes[j],
						obj.meshes[j].geometry,
						obj.meshes[j].material,
						obj.count
					)
					state = d[0]
					let new_instancedMesh = d[1]

					for (let k = 0; k < obj.count; k++) {
						new_instancedMesh.setMatrixAt(k, obj.matrix4s[k]);
						// new_instancedMesh.setColorAt(k, new THREE.Color("blue"));
						// new_instancedMesh.setColorAt(k, new THREE.Color(2, 1, 1));
						let color = obj.colors[k]
						// if (!isEmptyColor && !this._isDefaultColor(color)) {
						if (hasColors) {
							// NullableUtils.forEach(
							// 	color => {
							// 		new_instancedMesh.setColorAt(k, color)
							// 	}, obj.colors[k]
							// )
							new_instancedMesh.setColorAt(k, color)
						}
					}
					this.addData(new_instancedMesh, obj)

					new_instancedMesh.castShadow = obj.castShadow;
					new_instancedMesh.receiveShadow = obj.receiveShadow;


					this._initInstancedMesh(new_instancedMesh)

					groupOfInstances[i].children[j] = new_instancedMesh;

					resultInstancedMesh = new_instancedMesh
				}

				// if (getIsRenderAccuracyIncrease(state)) {
				// 	resultInstancedMesh.castShadow = false
				// 	resultInstancedMesh.receiveShadow = false
				// }
			}
		}

		return state
	}

	dispose() {
		this.getAllLevelInstancedMeshes().forEach(instancedMesh => {
			deepDispose(instancedMesh)
		})

		this.container.dispose()

		this.instancedMeshOfAllLevel.forEach(data => {
			data.meshes.forEach(mesh => {
				deepDispose(mesh as any)
			})
		})
	}
}