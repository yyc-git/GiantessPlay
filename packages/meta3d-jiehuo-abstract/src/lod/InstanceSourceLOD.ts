/*! edit by meta3d 

changed from Lod.js
*/

import { Box3, Euler, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { assertFalse, ensureCheck, requireCheck, test } from "../utils/Contract";
import { pushArrs } from "../utils/ArrayUtils";
import { getExn, return_ } from "../utils/NullableUtils";
import { getIsDebug } from "../state/State";
import { nullable } from "../utils/nullable";
import { findObjects } from "../scene/Scene";

export type level = {
	/** The Object3D to display at this level. */
	object: Object3D;
	// object: Mesh;
	/** The distance at which to display this level of detail. Expects a `Float`. */
	distance: number;
	/** Threshold used to avoid flickering at LOD boundaries, as a fraction of distance. Expects a `Float`. */
	hysteresis: number;
}

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();

export class InstanceSourceLOD extends Object3D {
	// private _currentLevel: number

	// public worldBoundingBox: Box3 = null

	declare public type: string
	public levels: Array<level>

	public isCollisionable: boolean

	private _boundingBox: nullable<Box3> = null

	constructor() {

		super();

		this.isCollisionable = true

		// this._currentLevel = 0;

		this.type = 'InstanceSourceLOD';

		Object.defineProperties(this, {
			levels: {
				enumerable: true,
				value: []
			},
			isLOD: {
				value: true,
			}
		});

		// this.autoUpdate = true;


	}

	copy(source) {

		// super.copy(source, false);
		super.copy(source, true);

		const levels = source.levels;

		for (let i = 0, l = levels.length; i < l; i++) {

			const level = levels[i];

			this.addLevel(level.object.clone(), level.distance, level.hysteresis, false);

		}

		// this.autoUpdate = source.autoUpdate;

		this._boundingBox = source.getBoundingBox()

		return this;

	}

	addLevel(object: Object3D, distance = 0, hysteresis = 0, isDebug) {
		requireCheck(() => {
			test("meshs should be first level children", () => {
				return object.children.reduce((result, child: Mesh) => {
					if (!result) {
						return result
					}

					return child.isMesh && child.children.length == 0
				}, true)
			})
			// test("transform should be default", () => {
			// 	return object.children.reduce((result, child: Mesh) => {
			// 		if (!result) {
			// 			return result
			// 		}

			// 		return child.position.equals(new Vector3(0, 0, 0)) && child.rotation.equals(new Euler(0, 0, 0)) && child.scale.equals(new Vector3(1, 1, 1))
			// 	}, true)
			// })
			// test("shouldn't auto update matrix", () => {
			// 	return assertFalse(object.matrixAutoUpdate)
			// })
		}, isDebug)



		distance = Math.abs(distance);

		const levels = this.levels;

		let l;

		for (l = 0; l < levels.length; l++) {

			if (distance < levels[l].distance) {

				break;

			}

		}

		levels.splice(l, 0, { distance: distance, hysteresis: hysteresis, object: object });

		// this.add( object );

		// if (levels.length == 1) {
		// 	this._boundingBox = return_(new Box3().setFromObject(object))
		// }


		return this;

	}

	// getCurrentLevel() {

	// 	return this._currentLevel;

	// }

	// traverse(func) {
	// 	super.traverse(func)

	// 	this.levels.forEach(level => {
	// 		level.object.traverse(func)
	// 	})
	// }



	getObjectForDistance(distance) {

		const levels = this.levels;

		if (levels.length > 0) {

			let i, l;

			for (i = 1, l = levels.length; i < l; i++) {

				let levelDistance = levels[i].distance;

				if (levels[i].object.visible) {

					levelDistance -= levelDistance * levels[i].hysteresis;

				}

				if (distance < levelDistance) {

					break;

				}

			}

			return levels[i - 1].object;

		}

		return null;

	}

	private _replaceLevelObjectToLODObject(intersects) {
		// let levelObjectIds = this.levels.map((level => {
		// 	return level.object.id
		// }))

		let self = this

		intersects.forEach(intersect => {
			// if (levelObjectIds.includes(intersect.object.id)) {
			intersect.object = self
			// }
		})
	}

	raycast(raycaster, intersects) {

		const levels = this.levels;

		if (levels.length > 0) {

			_v1.setFromMatrixPosition(this.matrixWorld);

			const distance = raycaster.ray.origin.distanceTo(_v1);

			let intersects_ = []

			/*!edit by meta3d */
			// this.getObjectForDistance(distance).raycast(raycaster, intersects_);
			this.getObjectForDistance(distance).children.forEach(child => {
				child.raycast(raycaster, intersects_);
			})

			this._replaceLevelObjectToLODObject(intersects_)


			pushArrs(intersects, intersects_)
		}

	}

	// private _addLevelObjects() {
	// 	let self = this

	// 	this.levels.forEach(level => {
	// 		self.add(level.object)
	// 	})
	// }

	// private _removeLevelObjects() {
	// 	let self = this

	// 	this.levels.forEach(level => {
	// 		self.remove(level.object)
	// 	})
	// }

	updateMatrixWorld(force) {
		// this._addLevelObjects()

		// super.updateMatrixWorld(force)

		// this._removeLevelObjects()
	}

	updateWorldMatrix(updateParents, updateChildren) {
		// this._addLevelObjects()

		// this.matrixAutoUpdate = true

		// super.updateWorldMatrix(updateParents, updateChildren)

		// this.matrixAutoUpdate = false

		// this._removeLevelObjects()
	}

	// TODO perf: only update current level
	_fastUpdateWorldMatrix(updateChildren, isDebug) {
		requireCheck(() => {
			test("parent should not transform", () => {
				return this.parent.matrixWorld.equals(new Matrix4())
			})
		}, isDebug)


		this.updateMatrix();
		this.matrixWorld.copy(this.matrix);

		let parentMatrixWorld = this.matrixWorld

		if (!updateChildren) {
			return
		}

		getAllLevelMeshes(this, isDebug).forEach(levelMeshes => {
			levelMeshes.forEach(mesh => {
				// if (mesh.matrixWorldAutoUpdate === true) {
				// if (mesh.matrixWorldNeedsUpdate === true) {
				mesh.updateMatrix();

				mesh.matrixWorld.multiplyMatrices(parentMatrixWorld, mesh.matrix);
				// }
			})
		})

	}

	updateWorldMatrix2(updateParents, updateChildren, isDebug) {
		// this._addLevelObjects()

		// this.matrixAutoUpdate = true

		// super.updateWorldMatrix(updateParents, updateChildren)

		// this.matrixAutoUpdate = false

		// this._removeLevelObjects()

		this._fastUpdateWorldMatrix(updateChildren, isDebug)
	}

	// private _getDefaultMesh(isDebug) {
	// 	requireCheck(() => {
	// 		test("last level should only has one mesh", () => {
	// 			return this.levels[this.levels.length - 1].object.children.length == 1
	// 			// let count = this.levels[this.levels.length - 1].object.children.length

	// 			// return count == 1 || count == 0
	// 		})
	// 		test("last level's distance should be +InFinity", () => {
	// 			return this.levels[this.levels.length - 1].distance == +Infinity
	// 		})
	// 	}, isDebug)

	// 	return this.levels[this.levels.length - 1].object.children[0] as Mesh

	// 	// let object = this.levels[this.levels.length - 1].object

	// 	// if (object.children.length == 0) {
	// 	// 	return object as Mesh
	// 	// }

	// 	// return object.children[0] as Mesh
	// }

	computeBoundingBox(object) {
		this._boundingBox = return_(new Box3().setFromObject(object))
	}

	getBoundingBox() {
		// let geometry = this._getDefaultMesh(getIsDebug(state)).geometry

		// if (geometry.boundingBox == null) {
		// 	geometry.computeBoundingBox()
		// }

		// return getExn(geometry.boundingBox)


		return getExn(this._boundingBox)
	}

	// updateBoundingBox(state) {
	// 	this.worldBoundingBox = this.getBoundingBox(state).clone().applyMatrix4(this.matrixWorld)
	// }

	// update( camera ) {

	// 	const levels = this.levels;

	// 	if ( levels.length > 1 ) {

	// 		_v1.setFromMatrixPosition( camera.matrixWorld );
	// 		_v2.setFromMatrixPosition( this.matrixWorld );

	// 		const distance = _v1.distanceTo( _v2 ) / camera.zoom;

	// 		levels[ 0 ].object.visible = true;

	// 		let i, l;

	// 		for ( i = 1, l = levels.length; i < l; i ++ ) {

	// 			let levelDistance = levels[ i ].distance;

	// 			if ( levels[ i ].object.visible ) {

	// 				levelDistance -= levelDistance * levels[ i ].hysteresis;

	// 			}

	// 			if ( distance >= levelDistance ) {

	// 				levels[ i - 1 ].object.visible = false;
	// 				levels[ i ].object.visible = true;

	// 			} else {

	// 				break;

	// 			}

	// 		}

	// 		this._currentLevel = i - 1;

	// 		for ( ; i < l; i ++ ) {

	// 			levels[ i ].object.visible = false;

	// 		}

	// 	}

	// }

	// toJSON( meta ) {

	// 	const data = super.toJSON( meta );

	// 	if ( this.autoUpdate === false ) data.object.autoUpdate = false;

	// 	data.object.levels = [];

	// 	const levels = this.levels;

	// 	for ( let i = 0, l = levels.length; i < l; i ++ ) {

	// 		const level = levels[ i ];

	// 		data.object.levels.push( {
	// 			object: level.object.uuid,
	// 			distance: level.distance,
	// 			hysteresis: level.hysteresis
	// 		} );

	// 	}

	// 	return data;

	// }


	getLevelChild(levelIndex, childIndex) {
		return this.levels[levelIndex].object.children[childIndex]
	}
}

export let getLevelMeshes = (level: level) => {
	return level.object.children as Array<Mesh>
}


export let getAllLevelMeshes = (obj: InstanceSourceLOD, isDebug) => {
	let value = obj.levels.map(level => {
		return getLevelMeshes(level)
	})

	return ensureCheck(value, (value) => {
		test("all level's children's count should equal", () => {
			let count = value[0].length

			return count > 0 && value.reduce((result, children) => {
				if (!result) {
					return result
				}

				return children.length == count
			}, true)
		})
	}, isDebug)
}

// export let getCurrentLevelMeshes = (obj: InstanceSourceLOD, isDebug) => {
// let value = getLevelMeshes(obj.getCurrentLevel())


// 	return ensureCheck(value, (value) => {
// 		test("all level's children's count should equal", () => {
// 			let count = value[0].length

// 			return count > 0 && value.reduce((result, children) => {
// 				if (!result) {
// 					return result
// 				}

// 				return children.length == count
// 			}, true)
// 		})
// 	}, isDebug)
// }

export let getUniqueId = (sourceLOD, isDebug) => {
	return getAllLevelMeshes(sourceLOD, isDebug)[0][0].geometry.id
}


export let findAllSourceLODs = (scene) => {
	return findObjects(scene, (obj) => obj.type == "InstanceSourceLOD")
}