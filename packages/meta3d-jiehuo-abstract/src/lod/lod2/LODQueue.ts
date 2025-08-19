import { LODContainer } from "./LODContainer"
import { status } from "./LODContainerType";
import { nullable } from "../../utils/nullable";
import { getEmpty, getExn, isNullable, return_ } from "../../utils/NullableUtils";
import { Box3, Frustum, Matrix4, Vector3, } from "three";
import { push, reducePromise, remove, set } from "../../utils/ArrayUtils";
import { Capsule } from "../../three/Capsule";
import { buildBoxCollisionResult } from "../../utils/CollisionUtils";
import { Map } from "immutable";
import { state } from "../../type/StateType";
import { getStatusForLODQueue, removeLODQueue, removeStatusForLODQueue } from "../LOD";
import { NullableUtils, TransformUtils } from "../../Main";

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
const _v3 = /*@__PURE__*/ new Vector3();
const _v4 = /*@__PURE__*/ new Vector3();


type name = string

// type data = {
// 	transform: Matrix4,
// 	box: Box3,
// 	name: name,
// 	status: status
// }
type index = number

export class LODQueue extends LODContainer {
	public isLODQueue = true

	public transforms: Array<Matrix4> = []
	public boxes: Array<Box3> = []
	public names: Array<string> = []
	// public statuses: Array<status> = []

	private _userDataMap: Map<name, any> = Map()

	private _transformsQueryByFrustum = []
	private _namesQueryByFrustum = []
	// private _countQueryByFrustum = 0

	getUserData(name) {
		return getExn(this._userDataMap.get(name))
	}

	setUserData(name, userData) {
		this._userDataMap = this._userDataMap.set(name, userData)
	}

	getLastIndex() {
		return this.transforms.length - 1
	}

	getAliveNames(state: state) {
		return this.names.filter(name => {
			// return getStatusForLODQueue(state, name).isVisible
			return getStatusForLODQueue(state, name).isCollisionable
		})
	}

	getValidData(state: state): Array<[Matrix4, Box3, name]> {
		// return this.names.reduce(([transforms, boxes, names], name, i) => {
		// 	if (!getStatusForLODQueue(state, name).isVisible) {
		// 		return [transforms, boxes, names]
		// 	}

		// 	return [
		// 		push(
		// 			transforms,
		// 			this.transforms[i]
		// 		),
		// 		push(
		// 			boxes,
		// 			this.boxes[i]
		// 		),
		// 		push(
		// 			names,
		// 			this.names[i]
		// 		),
		// 	]
		// }, [[], [], []])

		return this.names.reduce((result, name, i) => {
			if (!getStatusForLODQueue(state, name).isVisible) {
				return result
			}

			return push(result, [
				this.transforms[i],
				this.boxes[i],
				this.names[i]
			])
		}, [])
	}


	// getValidIndices(state: state): Array<index> {
	// 	return this.names.reduce((result, name, i) => {
	// 		if (!getStatusForLODQueue(state, name).isVisible) {
	// 			return result
	// 		}

	// 		return push(result, i)
	// 	}, [])
	// }

	// remove(state: state, index: number) {
	// 	let name = this.names[index]

	// 	this.transforms = remove(this.transforms, index)
	// 	this.names = remove(this.names, index)
	// 	this.boxes = remove(this.boxes, index)

	// 	this._userDataMap = this._userDataMap.remove(name)

	// 	state = removeStatusForLODQueue(state, name)
	// 	state = removeLODQueue(state, name)

	// 	return state
	// }

	updateTransform(func: (transform: Matrix4) => void, index: number, isUpdateBox) {
		let originBox = getExn(this.originBox)

		// this.forEach((data) => {
		// 	if (data.name == name) {
		// 		func(data.transform)

		// 		data.box.copy(
		// 			originBox.clone().applyMatrix4(data.transform)
		// 		)
		// 	}
		// })

		let transform = this.transforms[index]

		func(transform)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	this.boxes[index].copy(
			// 		originBox.clone().applyMatrix4(transform)
			// 	)
			// }
			// else {
			// 	this.boxes[index] = originBox.clone().applyMatrix4(transform)
			// }

			this.boxes[index].copy(
				originBox.clone().applyMatrix4(transform)
			)
		}
	}

	_updateBox(index, position: Vector3) {
		let size = this.boxes[index].getSize(_v3)

		this.boxes[index].setFromCenterAndSize(
			_v4.set(position.x, position.y + size.y / 2, position.z),
			size
		)
	}

	updatePosition(index: number, position: Vector3, isUpdateBox) {
		// let originBox = getExn(this.originBox)

		let transform = this.transforms[index]

		transform.setPosition(position)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	// this.boxes[index].copy(
			// 	// 	originBox.clone().translate(position)
			// 	// )
			// 	TODO box3 set position

			// 	this.boxes[index].tran(
			// 		originBox.clone().translate(position)
			// 	)
			// }
			// else {
			// 	this.boxes[index] = originBox.clone().translate(position)
			// }

			this._updateBox(index, position)
		}
	}

	updatePosition2(index: number, [x, z], isUpdateBox: boolean, isDebug: boolean) {
		// let originBox = getExn(this.originBox)

		let transform = this.transforms[index]

		let y = TransformUtils.getPositionYFromMatrix4(transform)
		let position = _v1.set(x, y, z)

		transform.setPosition(position)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	this.boxes[index].copy(
			// 		originBox.clone().translate(position)
			// 	)
			// }
			// else {
			// 	this.boxes[index] = originBox.clone().translate(position)
			// }

			this._updateBox(index, position)
		}
	}

	insert(transform, box, name) {
		let { transforms, boxes, names } = this;

		transforms.push(transform);
		boxes.push(box);
		names.push(name);
		// statuses.push({
		// 	isCollisionable: true,
		// 	isPickable: true,
		// 	isVisible: true,
		// });
	}

	forEach(func: (transform: Matrix4, i: number) => void) {
		// let self = this

		this.transforms.forEach((transform, i) => {
			// func({ transform: transform, box: self.boxes[i], name: self.names[i], status: self.statuses[i] })
			func(transform, i)
		})
	}

	// setStatus(_, name_, status_: status) {
	// 	// this.forEach(({ name, status }) => {
	// 	// 	if (name == name_) {
	// 	// 		status.isCollisionable = status_.isCollisionable
	// 	// 		status.isPickable = status_.isPickable
	// 	// 		status.isVisible = status_.isVisible
	// 	// 	}
	// 	// })
	// 	this.forEach((_, index) => {
	// 		let name = this.names[index]
	// 		let status = this.statuses[index]

	// 		if (name == name_) {
	// 			status.isCollisionable = status_.isCollisionable
	// 			status.isPickable = status_.isPickable
	// 			status.isVisible = status_.isVisible
	// 		}
	// 	})

	// 	return this
	// }

	// traverse<T>(func: (data: data) => Array<T>) {
	// 	let self = this

	// 	return this.transforms.reduce((result, transform, i) => {
	// 		return result.concat(func({ transform: transform, box: self.boxes[i], name: self.names[i], status: self.statuses[i] }))
	// 	}, [])
	// }

	getAllBoxes(_): Box3[] {
		return this.boxes.reduce((result, box, i) => {
			result.push(box)

			return result
		}, [])
	}

	reduce<T>(result: T, func: (result: T, transform, index) => T) {
		// let self = this

		return this.transforms.reduce((result, transform, i) => {
			return func(result, transform, i)
		}, result)
	}

	reducePromise<T>(result: T, func: (result: T, transform, index) => Promise<T>) {
		let self = this

		return reducePromise(this.transforms, (result, transform, i) => {
			return func(result, transform, i)
		}, result)
	}

	find<T>(func: (transform, index) => nullable<T>) {
		let self = this

		return this.transforms.reduce((result, transform, i) => {
			if (!isNullable(result)) {
				return result
			}

			return func(transform, i)
		}, getEmpty<T>())
	}

	// findBoxByName(name) {
	// 	return this.find<nullable<Box3>>((_, index) => {
	// 		if (this.names[index] == name) {
	// 			return return_(this.boxes[index])
	// 		}

	// 		return getEmpty()
	// 	})
	// }

	// queryByFrustum(frustum: Frustum) {
	// 	return this.reduce<[Array<Matrix4>, Array<Box3>, Array<string>]>([[], [], []], (result, data) => {
	// 		if (
	// 			frustum.intersectsBox(
	// 				data.box
	// 			) && data.status.isVisible
	// 		) {
	// 			let [transforms, boxes, names] = result

	// 			return [push(transforms, data.transform), push(boxes, data.box), push(names, data.name)]
	// 		}

	// 		return result
	// 	})
	// }
	queryByFrustum(state: state, frustum: Frustum): [number, Array<THREE.Matrix4>, Array<string>] {
		let [count, transforms, names] = this.reduce<[number, Array<Matrix4>, Array<string>]>([0, this._transformsQueryByFrustum, this._namesQueryByFrustum], (result, transform, index) => {
			let name = this.names[index]

			if (
				// this.statuses[index].isVisible
				getStatusForLODQueue(state, name).isVisible
				&& frustum.intersectsBox(
					this.boxes[index]
				)
			) {
				let [i, transforms, names] = result

				// return [push(transforms, transform), push(names, this.names[index])]
				return [i + 1, set(transforms, i, transform), set(names, i, name)]
			}

			return result
		})

		// this._countQueryByFrustum = count

		return [count, transforms, names]

		// return this.reduce<Array<Matrix4>>([], (result, transform, index) => {
		// 	if (
		// 		this.statuses[index].isVisible
		// 		&& frustum.intersectsBox(
		// 			this.boxes[index]
		// 		)
		// 	) {
		// 		let transforms = result

		// 		return push(transforms, transform)
		// 	}

		// 	return result
		// })
	}

	// queryByCapsule(state: state, capsule: Capsule, capsuleBox: THREE.Box3, result = null, transform = null, box = null, name = null) {
	// 	// return queryByCapsule(capsule, capsuleBox, [this.transforms, this.boxes, this.names], this.statuses, result, transform, box, name)

	// 	return this.boxes.reduce(([result, transform, box, name], box_, i) => {
	// 		if (result !== null) {
	// 			return [result, transform, box, name]
	// 		}

	// 		let name_ = this.names[i]
	// 		if (

	// 			getStatusForLODQueue(state, name_).isCollisionable
	// 			&& capsuleBox.intersectsBox(box_)
	// 			&& capsule.intersectsBox(box_)
	// 		) {
	// 			return [
	// 				buildCapsuleCollisionResult(capsule, box_), this.transforms[i], this.boxes[i], name_]
	// 		}

	// 		return [result, transform, box, name]
	// 	}, [result, transform, box, name])
	// }

	// queryByBox(state: state, queryBox: THREE.Box3, result = null, transform = null, box = null, name = null) {
	// 	// return queryByCapsule(capsule, capsuleBox, [this.transforms, this.boxes, this.names], this.statuses, result, transform, box, name)

	// 	return this.boxes.reduce(([result, transform, box, name], box_, i) => {
	// 		if (result !== null) {
	// 			return [result, transform, box, name]
	// 		}

	// 		let name_ = this.names[i]
	// 		if (

	// 			getStatusForLODQueue(state, name_).isCollisionable
	// 			&& queryBox.intersectsBox(box_)
	// 		) {
	// 			return [
	// 				buildBoxCollisionResult(queryBox, box_), this.transforms[i], this.boxes[i], name_]
	// 		}

	// 		return [result, transform, box, name]
	// 	}, [result, transform, box, name])
	// }
	queryByBox(state: state, queryBox: THREE.Box3, transform = null, box = null, name = null) {
		return this.boxes.reduce(([transform, box, name], box_, i) => {
			if (transform !== null) {
				return [transform, box, name]
			}

			let name_ = this.names[i]
			if (

				getStatusForLODQueue(state, name_).isCollisionable
				&& queryBox.intersectsBox(box_)
			) {
				return [
					this.transforms[i], this.boxes[i], name_]
			}

			return [transform, box, name]
		}, [transform, box, name])
	}

	queryByBoxAndCamp(state: state, getCampFunc, specificState, queryBox: THREE.Box3, camp, transform = null, box = null, name = null) {
		return this.boxes.reduce(([transform, box, name], box_, i) => {
			if (!NullableUtils.isNullable(transform)) {
				return [transform, box, name]
			}

			let name_ = this.names[i]

			if (
				getCampFunc(specificState, name_) != camp
				&& getStatusForLODQueue(state, name_).isCollisionable
				&& queryBox.intersectsBox(box_)
			) {
				return [
					this.transforms[i], this.boxes[i], name_]
			}

			return [transform, box, name]
		}, [transform, box, name])
	}

	queryRangeByBoxAndCamp(state: state, getCampFunc, specificState, queryBox: THREE.Box3, camp, transforms = [], boxes = [], names = []) {
		return this.boxes.reduce<[Array<Matrix4>, Array<Box3>, Array<name>]>(([transforms, boxes, names], box_, i) => {
			let name_ = this.names[i]

			if (
				getCampFunc(specificState, name_) != camp
				&& getStatusForLODQueue(state, name_).isCollisionable
				&& queryBox.intersectsBox(box_)
			) {
				return [push(transforms, this.transforms[i]), push(boxes, this.boxes[i]), push(names, name_)]
			}

			return [transforms, boxes, names]
		}, [transforms, boxes, names])
	}

	queryRangeByBox(state: state, boxRange: THREE.Box3, transforms = [], boxes = [], names = []) {
		return this.boxes.reduce(([transforms, boxes, names], box_, i) => {
			let name = this.names[i]
			if (
				getStatusForLODQueue(state, name).isCollisionable
				&& boxRange.intersectsBox(box_)) {
				return [push(transforms, this.transforms[i]), push(boxes, this.boxes[i]), push(names, name)]
			}

			return [transforms, boxes, names]
		}, [transforms, boxes, names])
	}
}