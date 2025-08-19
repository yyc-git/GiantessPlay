import * as THREE from "three";
import { forEach, getEmpty, getExn, isNullable, isStrictNullable, return_ } from "../../utils/NullableUtils";
import { Capsule } from "../../three/Capsule";
import { nullable } from "../../utils/nullable";
import { push } from "../../utils/ArrayUtils";
import { buildBoxCollisionResult } from "../../utils/CollisionUtils";
import { state } from "../../type/StateType";
import { getStatus, isAlive } from "../LOD";
import { addIndexToBox, getIndexFromBox } from "./OctreeUtils";
import { MutableMapUtils, MutableNumberMapUtils } from "../../Main";

const _v1 = new THREE.Vector3();

class Octree {
	public box: THREE.Box3
	public actualBox: THREE.Box3

	public capacity
	public divided

	// public transforms: Array<THREE.Matrix4>
	public boxes: Array<THREE.Box3> = []
	// public names: Array<string>
	// public statuses: Array<status>

	public children: Array<Octree>
	public depth

	// public details: details = null

	// public name: string

	public isOctree = true

	constructor(box3, n, depth) {
		// super()

		this.box = box3;
		this.actualBox = box3.clone();


		this.capacity = n;
		this.divided = false;

		this.children = [];
		this.depth = depth;
	}

	subdivide() {
		const { box, capacity, depth } = this;
		let size = new THREE.Vector3().subVectors(box.max, box.min).divideScalar(2);
		let arr = [
			[0, 0, 0],
			[size.x, 0, 0],
			[0, 0, size.z],
			[size.x, 0, size.z],
			[0, size.y, 0],
			[size.x, size.y, 0],
			[0, size.y, size.z],
			[size.x, size.y, size.z],
		];
		for (let i = 0; i < 8; i++) {
			let min = new THREE.Vector3(
				box.min.x + arr[i][0],
				box.min.y + arr[i][1],
				box.min.z + arr[i][2]
			);
			let max = new THREE.Vector3().addVectors(min, size);
			let newbox = new THREE.Box3(min, max);
			this.children.push(new Octree(newbox, capacity, depth + 1));
		}
		this.divided = true;
	}

	// insert(transform, box_, name) {
	// 	const { box, transforms, boxes, names, statuses, capacity, divided, children } = this;
	// 	if (
	// 		// !box.containsPoint(new THREE.Vector3().setFromMatrixPosition(transform))
	// 		!box.intersectsBox(box_)
	// 		// !box.containsBox(box_)
	// 	) {
	// 		return false;
	// 	}

	// 	this.actualBox = this.actualBox.union(box_)

	// 	if (transforms.length < capacity) {
	// 		transforms.push(transform);
	// 		boxes.push(box_);
	// 		names.push(name);
	// 		statuses.push({
	// 			isCollisionable: true,
	// 			isPickable: true,
	// 			isVisible: true,
	// 		});

	// 		return true;
	// 	} else {
	// 		if (!divided) this.subdivide();
	// 		for (let i = 0; i < children.length; i++) {
	// 			if (children[i].insert(transform, box_, name)) return true;
	// 		}
	// 	}
	// }

	insert(newIndex, box_) {
		const { box, boxes, capacity, divided, children } = this;
		if (
			// !box.containsPoint(new THREE.Vector3().setFromMatrixPosition(transform))
			!box.intersectsBox(box_)
			// !box.containsBox(box_)
		) {
			return false;
		}

		this.actualBox = this.actualBox.union(box_)

		if (boxes.length < capacity) {
			box_ = addIndexToBox(newIndex, box_)

			boxes.push(box_)

			return true;
		} else {
			if (!divided) this.subdivide();
			for (let i = 0; i < children.length; i++) {
				if (children[i].insert(newIndex, box_)) return true;
			}
		}
	}

	queryRangeByBox(state: state, boxRange: THREE.Box3, indices = []) {
		if (!boxRange.intersectsBox(this.actualBox)) {
			return indices
		} else {
			let data = this.boxes.reduce((indices, box_, i) => {
				let index = getIndexFromBox(box_)

				if (
					// getStatus(state, index).isCollisionable
					isAlive(state, index)
					&& boxRange.intersectsBox(box_)) {
					return push(indices, index)
				}

				return indices
			}, indices)

			if (this.divided) {
				return this.children.reduce((data, child) => {
					return child.queryRangeByBox(state, boxRange, data)
				}, data);
			}

			return data
		}
	}

	queryByPoint(state: state, point: THREE.Vector3, index = null) {
		if (!this.actualBox.containsPoint(point)) {
			return index
		} else {
			let data = this.boxes.reduce<number>((index, box_, i) => {
				if (index !== null) {
					return index
				}

				let index_ = getIndexFromBox(box_)

				if (
					// getStatus(state, index_).isCollisionable
					isAlive(state, index_)
					&& box_.containsPoint(point)) {
					return index_
				}

				return index
			}, index)

			if (data === null && this.divided) {
				return this.children.reduce<number>((data, child) => {
					if (data !== null) {
						return data
					}

					return child.queryByPoint(state, point, data)
				}, data);
			}

			return data
		}
	}

	// queryByFrustum(state: state, frustum: THREE.Frustum, indices = []) {
	queryByFrustum(state: state, frustum: THREE.Frustum, indices = MutableNumberMapUtils.create()) {
		if (!frustum.intersectsBox(this.actualBox)) {
			// return [transforms, names]
			return indices
		} else {
			// let self = this

			let data = this.boxes.reduce((indices, box_) => {
				let index = getIndexFromBox(box_)

				if (
					// self.statuses[i].isVisible
					getStatus(state, index).isVisible
					&& frustum.intersectsBox(
						box_
					)
				) {
					// return [push(transforms, self.transforms[i]), push(names, self.names[i])]

					// return push(indices, index)

					return MutableNumberMapUtils.set(indices, index, true)
				}

				return indices
			}, indices)

			if (this.divided) {
				return this.children.reduce((data, child) => {
					return child.queryByFrustum(state, frustum, data)
				}, data);
			}

			return data
		}
	}

	queryByRay(state: state, ray: THREE.Ray, distance = Infinity, index = null) {
		if (!ray.intersectsBox(this.actualBox)) {
			return [distance, index]
		} else {
			let self = this

			let data = this.boxes.reduce(([distance, index], box_, i) => {
				let index_ = getIndexFromBox(box_)

				let result = ray.intersectBox(box_, _v1)

				if (!isStrictNullable(result) &&
					getStatus(state, index_).isPickable
				) {

					let newDistance = getExn(result).sub(ray.origin).length()

					if (distance > newDistance) {
						return [newDistance, index_]
					}
				}

				return [distance, index]
			}, [distance, index])

			if (this.divided) {
				return this.children.reduce((data, child) => {
					return child.queryByRay(state, ray, data[0], data[1])
				}, data);
			}

			return data
		}
	}

	// queryByCapsule(state: state, capsule: Capsule, capsuleBox: THREE.Box3, result = null, index = null) {
	// 	// if (!capsule.intersectsBox(this.box)) {
	// 	if (!capsuleBox.intersectsBox(this.actualBox)) {
	// 		return [result, index]
	// 	} else {
	// 		let data = this.boxes.reduce(([result, index], box_, i) => {
	// 			if (result !== null) {
	// 				return [result, index]
	// 			}

	// 			let index_ = getIndexFromBox(box_)

	// 			if (
	// 				getStatus(state, index_).isCollisionable
	// 				&& capsuleBox.intersectsBox(box_)
	// 				&& capsule.intersectsBox(box_)
	// 			) {
	// 				return [
	// 					buildCapsuleCollisionResult(capsule, box_), index_]
	// 			}

	// 			return [result, index]
	// 		}, [result, index])

	// 		// if (result === null && this.divided) {
	// 		if (data[0] === null && this.divided) {
	// 			return this.children.reduce((data, child) => {
	// 				if (data[0] !== null) {
	// 					return data
	// 				}

	// 				return child.queryByCapsule(state, capsule, capsuleBox, data[0], data[1])
	// 			}, data);
	// 		}

	// 		return data
	// 	}
	// }

	queryByBoxForCollision(state: state, queryBox: THREE.Box3, result = null, index = null) {
		// if (!capsule.intersectsBox(this.box)) {
		if (!queryBox.intersectsBox(this.actualBox)) {
			return [result, index]
		} else {
			let data = this.boxes.reduce(([result, index], box_, i) => {
				if (result !== null) {
					return [result, index]
				}

				let index_ = getIndexFromBox(box_)

				if (
					// getStatus(state, index_).isCollisionable
					isAlive(state, index_)
					&& queryBox.intersectsBox(box_)
				) {
					return [
						buildBoxCollisionResult(queryBox, box_), index_]
				}

				return [result, index]
			}, [result, index])

			// if (result === null && this.divided) {
			if (data[0] === null && this.divided) {
				return this.children.reduce((data, child) => {
					if (data[0] !== null) {
						return data
					}

					return child.queryByBoxForCollision(state, queryBox, data[0], data[1])
				}, data);
			}

			return data
		}
	}

	queryByBoxForParticle(state: state, queryBox: THREE.Box3, index = null) {
		if (!queryBox.intersectsBox(this.actualBox)) {
			return index
		} else {
			let data = this.boxes.reduce((index, box_, i) => {
				if (index !== null) {
					return index
				}

				let index_ = getIndexFromBox(box_)

				if (
					// getStatus(state, index_).isCollisionable
					isAlive(state, index_)
					&& queryBox.intersectsBox(box_)
				) {
					return index_
				}

				return index
			}, index)

			if (data === null && this.divided) {
				return this.children.reduce((data, child) => {
					if (data !== null) {
						return data
					}

					return child.queryByBoxForParticle(state, queryBox, data)
				}, data);
			}

			return data
		}
	}

	// display(scene) {
	// 	// 叶子结点
	// 	if (!this.divided && this.transforms.length > 0) {
	// 		scene.add(new THREE.Box3Helper(this.box, 0x00ff00));
	// 		return;
	// 	}
	// 	this.children.forEach((child) => {
	// 		child.display(scene);
	// 	});
	// }

	// getTransforms(totalFound) {
	// 	totalFound.reduce((result, [childIndex, levelFound]) => {

	// 	}, [])

	// 	// return this.transforms[index]
	// }

	// getBox(index) {
	// 	return this.boxes[index]
	// }

	// getName(index) {
	// 	return this.names[index]
	// }

	// computeBox() {
	// 	return new THREE.Box3().setFromObject(this.details[0].group)
	// }

	// _findStatusByName(name) {
	// 	// let _find = (result, node) => {
	// 	// 	let names = node.names
	// 	// 	let statuses = node.statuses

	// 	// 	result = names.reduce((result, name_, i) => {
	// 	// 		if (!isNullable(result)) {
	// 	// 			return result
	// 	// 		}

	// 	// 		if (name_ == name) {
	// 	// 			return statuses[i]
	// 	// 		}

	// 	// 		return result
	// 	// 	}, result)

	// 	// 	if (!isNullable(result)) {
	// 	// 		return result
	// 	// 	}

	// 	// 	return node.children.reduce((result, child) => {
	// 	// 		if (!isNullable(result)) {
	// 	// 			return result
	// 	// 		}

	// 	// 		return _find(result, child)
	// 	// 	}, result)
	// 	// }

	// 	// return _find(getEmpty(), this)

	// 	return this._find((obj) => {
	// 		let index = obj.names.indexOf(name)
	// 		if (index != -1) {
	// 			return return_(obj.statuses[index])
	// 		}

	// 		return getEmpty()
	// 	}, this)
	// }

	// buildStatus(
	// 	isCollisionable = true,
	// 	isPickable = true,
	// 	isVisible = true
	// ) {
	// 	return {
	// 		isCollisionable,
	// 		isPickable,
	// 		isVisible
	// 	}
	// }

	// setStatus(name, status: status) {
	// 	forEach<status>(status_ => {
	// 		status_.isCollisionable = status.isCollisionable
	// 		status_.isPickable = status.isPickable
	// 		status_.isVisible = status.isVisible
	// 	}, this._findStatusByName(name)
	// 	)

	// 	return this
	// }

	// // TODO perf: use batch search
	// batchSetStatus(names, status: status) {
	// 	names.forEach(name => this.setStatus(name, status))

	// 	return this
	// }

	// _traverse<T>(result: Array<T>, func: (o: Octree) => Array<T>, octree: Octree) {
	// 	let self = this

	// 	return octree.children.reduce((result, child) => {
	// 		return self._traverse(result.concat(func(child)), func, child)
	// 	}, result)
	// }

	// traverse<T>(func: (obj: Octree) => Array<T>) {
	// 	return this._traverse<T>(func(this), func, this)
	// }

	// getAllBoxes(): THREE.Box3[] {
	// 	return this.traverse(o => o.boxes)
	// }


	// _forEach(func, octree: Octree) {
	// 	let self = this

	// 	func(octree)

	// 	octree.children.forEach(child => {
	// 		self._forEach(func, child)
	// 	})
	// }

	// forEach<T>(func: (obj: Octree) => void) {
	// 	this._forEach(func, this)
	// }


	// _find<T>(func: (o: Octree) => nullable<T>, octree: Octree) {
	// 	let self = this

	// 	let result = func(octree)

	// 	if (!isNullable(result)) {
	// 		return result
	// 	}

	// 	return octree.children.reduce((result, child) => {
	// 		if (!isNullable(result)) {
	// 			return result
	// 		}

	// 		return self._find(func, child)
	// 	}, result)
	// }

	// findTransformByName(name): nullable<THREE.Matrix4> {
	// 	return this._find((obj) => {
	// 		let index = obj.names.indexOf(name)
	// 		if (index != -1) {
	// 			return return_(obj.transforms[index])
	// 		}

	// 		return getEmpty()
	// 	}, this)
	// }

	// findTransformAndBoxByName(name) {
	// 	return this._find((obj) => {
	// 		let index = obj.names.indexOf(name)
	// 		if (index != -1) {
	// 			return return_([obj.transforms[index], obj.boxes[index]])
	// 		}

	// 		return getEmpty()
	// 	}, this)
	// }


	// findBoxByName(name) {
	// 	return this._find((obj) => {
	// 		let index = obj.names.indexOf(name)
	// 		if (index != -1) {
	// 			return return_(obj.boxes[index])
	// 		}

	// 		return getEmpty()
	// 	}, this)
	// }

	// // disableShadow() {
	// // 	this.details.forEach(data => {
	// // 		data.group.castShadow = false
	// // 	})
	// // }

	dispose() {
		this.boxes = []
		this.children.forEach(c => c.dispose())

		return this
	}
}

export { Octree };
