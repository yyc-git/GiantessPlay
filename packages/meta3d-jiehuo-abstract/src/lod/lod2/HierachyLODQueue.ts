import { status } from "./LODContainerType";
import { nullable } from "../../utils/nullable";
import { getEmpty, getExn, getWithDefault, isNullable, map, return_ } from "../../utils/NullableUtils";
import { Box3, Color, Frustum, Matrix4, Vector3, } from "three";
import { push, pushArrs, range, reducePromise } from "../../utils/ArrayUtils";
import { LODQueue } from "./LODQueue";
import { ArrayUtils, MutableMapUtils, NullableUtils } from "../../Main";
import { state } from "../../type/StateType";
import { create, get, set } from "../../utils/MutableRecordUtils";

// const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


// type name = string

type queueName = string

// type data = {
// 	transform: Matrix4,
// 	box: Box3,
// 	name: name,
// 	status: status
// }

type index = number

export class HierachyLODQueue extends LODQueue {
	public isHierachyLODQueue = true

	// private _parentMap: Map<name, name> = Map()

	// getParent(name) {
	// 	return this._parentMap.get(name)
	// }

	// setParnet(name, parentName) {
	// 	this._parentMap = this._parentMap.set(name, parentName)
	// }

	// private _worldTransforms: Array<Matrix4> = []
	private _worldTransforms: Map<index, Matrix4> = MutableMapUtils.create()

	// private _parentMap: Record<queueName, HierachyLODQueue> = create()
	// private _childrenMap: Record<queueName, Array<HierachyLODQueue>> = create()
	private _children: Array<HierachyLODQueue> = []

	// private _transformsQueryByFrustum2 = []
	// private _namesQueryByFrustum2 = []
	// private _colorsQueryByFrustum2 = []
	// private _countQueryByFrustum2 = 0


	// getParent(queueName) {
	// 	return this._parentMap.get(queueName)
	// }

	// setParnet(queueName, parentQueue) {
	// 	this._parentMap = this._parentMap.set(queueName, parentQueue)

	// 	return this
	// }

	getChildren() {
		return this._children
	}

	_getAllChildren(result, children) {
		if (children.length == 0) {
			return result
		}

		return children.reduce((result, child) => {
			return this._getAllChildren(
				// ArrayUtils.pushArrs(result, child.getChildren()),
				result,
				child.getChildren()
			)
		}, ArrayUtils.pushArrs(result, children))
	}

	getAllChildren() {
		return this._getAllChildren(ArrayUtils.create(), this.getChildren())
	}


	addChild(childQueue) {
		this._children.push(childQueue)

		return this
	}

	getAllQueues() {
		return [this].concat(this.getAllChildren())
	}


	// _computeWorldMatrix(index): Matrix4 {
	// 	let transforms = this.transforms

	// 	// let _func = (matrix, queue) => {
	// 	// 	return getWithDefault(
	// 	// 		map(parentQueue => {
	// 	// 			let parentMatrix = parentQueue.getTransform(index)

	// 	// 			return _func(
	// 	// 				_m.multiplyMatrices(
	// 	// 					parentMatrix, matrix
	// 	// 				),
	// 	// 				parentQueue,
	// 	// 			)
	// 	// 		}, this.getParent(queue.name)),
	// 	// 		matrix
	// 	// 	)
	// 	// }

	// 	// return _func(transforms[index], this).clone()


	// 	let _func = (matrix, queue) => {
	// 		this.getChildren(queue.name)


	// 		return getWithDefault(
	// 			map(parentQueue => {
	// 				let parentMatrix = parentQueue.getTransform(index)

	// 				return _func(
	// 					_m.multiplyMatrices(
	// 						parentMatrix, matrix
	// 					),
	// 					parentQueue,
	// 				)
	// 			}, this.getChildren(queue.name)),
	// 			matrix
	// 		)
	// 	}

	// 	return _func(transforms[index], this).clone()
	// }

	getWorldMatrix(index) {
		return MutableMapUtils.getExn(this._worldTransforms, index)
	}

	// update(state: state, parentWorldMatrix: nullable<Matrix4>) {
	// 	// let originBox = this.originBox

	// 	// let isNeedUpdateBox = !NullableUtils.isNullable(originBox)

	// 	// if (isNeedUpdateBox) {
	// 	// 	originBox = NullableUtils.getExn(originBox)
	// 	// }

	// 	// let worldTransforms = this.reduce<Array<Matrix4>>([], (worldTransforms, _, i) => {
	// 	// 	if (!this._isNeedsUpdate(state, i)) {
	// 	// 		return push(worldTransforms, this._worldTransforms[i])
	// 	// 	}

	// 	// 	this.markNeedsUpdate(state, i, false)

	// 	// 	let worldMatrix = this._computeWorldMatrix(i)

	// 	// 	if (isNeedUpdateBox) {
	// 	// 		this.boxes[i].copy(originBox.clone().applyMatrix4(worldMatrix)
	// 	// 		)
	// 	// 	}

	// 	// 	return push(worldTransforms, worldMatrix)
	// 	// })

	// 	// this._worldTransforms = worldTransforms


	// 	let originBox = this.originBox

	// 	let isNeedUpdateBox = !NullableUtils.isNullable(originBox)

	// 	if (isNeedUpdateBox) {
	// 		originBox = NullableUtils.getExn(originBox)
	// 	}

	// 	this.forEach((transform, i) => {
	// 		if (!isNeedsUpdate(state, i)) {
	// 			return
	// 		}

	// 		let worldTransform = this._worldTransforms[i]

	// 		if (isNullable(parentWorldMatrix)) {
	// 			worldTransform.copy(transform)
	// 		}
	// 		else {
	// 			worldTransform.multiplyMatrices(getExn(parentWorldMatrix), transform)
	// 		}

	// 		markNeedsUpdate(state, i, false)


	// 		if (isNeedUpdateBox) {
	// 			this.boxes[i].copy(originBox.clone().applyMatrix4(worldTransform)
	// 			)
	// 		}


	// 		this._children.forEach(childQueue => {
	// 			childQueue.update(state, return_(worldTransform))
	// 		})
	// 	})
	// }

	// update(state: state, parentWorldMatrix: nullable<Matrix4>, allNeedUpdateIndices: Array<number>) {
	// 	let originBox = this.originBox

	// 	let isNeedUpdateBox = !NullableUtils.isNullable(originBox)

	// 	if (isNeedUpdateBox) {
	// 		originBox = NullableUtils.getExn(originBox)
	// 	}

	// 	allNeedUpdateIndices.forEach(i => {
	// 		let worldTransform = this._worldTransforms[i]
	// 		let transform = this.transforms[i]

	// 		if (isNullable(parentWorldMatrix)) {
	// 			worldTransform.copy(transform)
	// 		}
	// 		else {
	// 			worldTransform.multiplyMatrices(getExn(parentWorldMatrix), transform)
	// 		}

	// 		// markNeedsUpdate(state, i, false)


	// 		if (isNeedUpdateBox) {
	// 			this.boxes[i].copy(originBox.clone().applyMatrix4(worldTransform)
	// 			)
	// 		}

	// 		this._children.forEach(childQueue => {
	// 			// childQueue.update(state, return_(worldTransform), allNeedUpdateIndices)
	// 			childQueue.update(state, return_(worldTransform), [i])
	// 		})
	// 	})

	// }
	update(state: state, parentWorldMatrix: nullable<Matrix4>, i: number) {
		let originBox = this.originBox

		let worldTransform = MutableMapUtils.getExn(this._worldTransforms, i)
		let transform = MutableMapUtils.getExn(this.transforms, i)

		if (isNullable(parentWorldMatrix)) {
			worldTransform.copy(transform)
		}
		else {
			worldTransform.multiplyMatrices(getExn(parentWorldMatrix), transform)
		}

		if (!NullableUtils.isNullable(originBox)) {
			// this.boxes[i].copy(NullableUtils.getExn(originBox).clone().applyMatrix4(worldTransform)
			MutableMapUtils.getExn(this.boxes, i).copy(NullableUtils.getExn(originBox)).applyMatrix4(worldTransform)
		}

		this._children.forEach(childQueue => {
			childQueue.update(state, return_(worldTransform), i)
		})
	}

	// getAllIndices() {
	// 	return range(0, this.getLastIndex())
	// }


	// updateTransform(func, index: number) {
	// 	let transform = this.getTransform(index)

	// 	func(transform)
	// }

	// updatePosition(index: number, position: Vector3, isUpdateBox) {
	// 	let originBox = getExn(this.originBox)

	// 	let transform = this.getTransform(index)

	// 	transform.setPosition(position)

	// 	if (isUpdateBox) {
	// 		// this.getBox(index).copy(
	// 		// 	originBox.clone().translate(position)
	// 		// )
	// 		this.getBox(index) = originBox.clone().translate(position)
	// 	}
	// }

	insert(transform, box, name, color = new Color(1, 1, 1)) {
		MutableMapUtils.set(this._worldTransforms, this.getLastIndex() + 1, new Matrix4())

		super.insert(transform, box, name, color)
	}

	// forEach(func: (data: data) => void) {
	// 	let self = this

	// 	this.transforms.forEach((transform, i) => {
	// 		func({ transform: transform, box: self.boxes[i], name: self.names[i], status: self.statuses[i] })
	// 	})
	// }

	// setStatus(name_, status_: status) {
	// 	this.forEach(({ name, status }) => {
	// 		if (name == name_) {
	// 			status.isCollisionable = status_.isCollisionable
	// 			status.isPickable = status_.isPickable
	// 			status.isVisible = status_.isVisible
	// 		}
	// 	})

	// 	return this
	// }

	// getAllBoxes(): Box3[] {
	// 	return this.boxes.reduce((result, box, i) => {
	// 		result.push(box)

	// 		return result
	// 	}, [])
	// }

	// reduce<T>(result: T, func: (result: T, transform: Matrix4, index: index) => T) {
	// 	// let self = this

	// 	return this.transforms.reduce((result, transform, i) => {
	// 		return func(result, transform, i)
	// 	}, result)
	// }

	// reducePromise<T>(result: T, func: (result: T, data: data) => Promise<T>) {
	// 	let self = this




	// 	return reducePromise(this.transforms, (result, transform, i) => {
	// 		return func(result, { transform: transform, box: self.boxes[i], name: self.names[i], status: self.statuses[i] })
	// 	}, result)
	// }

	// find<T>(func: (data: data) => nullable<T>) {
	// 	let self = this

	// 	return this.transforms.reduce((result, transform, i) => {
	// 		if (!isNullable(result)) {
	// 			return result
	// 		}

	// 		return func({ transform: transform, box: self.boxes[i], name: self.names[i], status: self.statuses[i] })
	// 	}, getEmpty<T>())
	// }

	// findBoxByName(name) {
	// 	return this.find<nullable<Box3>>((data) => {
	// 		if (data.name == name) {
	// 			return return_(data.box)
	// 		}

	// 		return getEmpty()
	// 	})
	// }

	queryByFrustum(state: state, frustum: Frustum): [number, Array<THREE.Matrix4>, Array<string>, Array<Color>] {
		// let [count, transforms, names, colors] = this.reduce<[number, Array<Matrix4>, Array<string>, Array<Color>]>([0, this._transformsQueryByFrustum2, this._namesQueryByFrustum2, this._colorsQueryByFrustum2], (result, _, index) => {
		// 	let name = MutableMapUtils.getExn(this.names, index)
		// 	let color = MutableMapUtils.getExn(this.colors, index)
		// 	if (
		// 		// this.getStatus(index).isVisible
		// 		this.getIsVisible(index)
		// 		&& frustum.intersectsBox(
		// 			MutableMapUtils.getExn(this.boxes, index)
		// 		)
		// 	) {
		// 		// let [transforms, names] = result

		// 		// return [push(transforms, this.getWorldMatrix(index)), push(names, name)]
		// 		let [i, transforms, names, colors] = result

		// 		return [i + 1, set(transforms, i, this.getWorldMatrix(index)), set(names, i, name), set(colors, i, color)]
		// 	}

		// 	return result
		// })

		// // this._countQueryByFrustum2 = count

		// return [count, transforms, names, colors]

		return this.queryByFrustumProtected(frustum, this._worldTransforms)
	}

	// TODO finish
	// queryByCapsule(capsule: Capsule, capsuleBox: THREE.Box3, result = null, transform = null, box = null, name = null) {
	// 	return queryByCapsule(capsule, capsuleBox, [this.transforms, this.boxes, this.names], this.statuses, result, transform, box, name)
	// }

	// queryRangeByBox(boxRange: THREE.Box3, transforms = [], boxes = [], names = []) {
	// 	let self = this

	// 	return this.boxes.reduce(([transforms, boxes, names], box_, i) => {
	// 		if (self.statuses[i].isCollisionable
	// 			&& boxRange.intersectsBox(box_)) {
	// 			return [push(transforms, self.transforms[i]), push(boxes, self.boxes[i]), push(names, self.names[i])]
	// 		}

	// 		return [transforms, boxes, names]
	// 	}, [transforms, boxes, names])
	// }

	remove(state: state, index) {
		state = super.remove(state, index)

		// this._worldTransforms = ArrayUtils.set(this._worldTransforms, index, null)
		this._worldTransforms = MutableMapUtils.remove(this._worldTransforms, index)
		// this._children = ArrayUtils.set(this._children, index, null)

		// this._transformsQueryByFrustum2 = ArrayUtils.set(this._transformsQueryByFrustum2, index, null)
		// this._namesQueryByFrustum2 = ArrayUtils.set(this._namesQueryByFrustum2, index, null)
		// this._transformsQueryByFrustum2 = ArrayUtils.remove(this._transformsQueryByFrustum2, index)
		// this._namesQueryByFrustum2 = ArrayUtils.remove(this._namesQueryByFrustum2, index)
		// this._transformsQueryByFrustum2 = ArrayUtils.create()
		// this._namesQueryByFrustum2 = ArrayUtils.create()
		// this._colorsQueryByFrustum2 = ArrayUtils.create()

		// state = markNeedsUpdate(state, this.name, index, false)


		return state
	}

	setColor(queue, index, newColor) {
		queue.getAllQueues().forEach(queue => {
			super.setColor(queue, index, newColor)
		})
	}
}