import { LODContainer } from "./LODContainer"
import { status } from "./LODContainerType";
import { nullable } from "../../utils/nullable";
import { getEmpty, getExn, isNullable, isStrictNullable, return_ } from "../../utils/NullableUtils";
import { Box3, Color, Frustum, Matrix4, Vector3, } from "three";
import { push, range, reducePromise, remove, set } from "../../utils/ArrayUtils";
import { Capsule } from "../../three/Capsule";
import { buildBoxCollisionResult } from "../../utils/CollisionUtils";
import { Map as ImmutableMap } from "immutable";
import { lodQueueIndex, state } from "../../type/StateType";
// import { getStatusForLODQueue, removeLODQueue, removeStatusForLODQueue } from "../LOD";
import { removeLODQueue } from "../LOD";
import { ArrayUtils, MutableMapUtils, NullableUtils, TransformUtils } from "../../Main";

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

	// public transforms: Array<Matrix4> = []
	// public boxes: Array<Box3> = []
	// public names: Array<string> = []
	// public colors: Array<Color> = []
	// // public statuses: Array<status> = []
	// public isCollisionables: Array<boolean> = []
	// public isVisibles: Array<boolean> = []
	public transforms: Map<index, Matrix4> = MutableMapUtils.create()
	public boxes: Map<index, Box3> = MutableMapUtils.create()
	public names: Map<index, string> = MutableMapUtils.create()
	public colors: Map<index, Color> = MutableMapUtils.create()
	public isCollisionables: Map<index, boolean> = MutableMapUtils.create()
	public isVisibles: Map<index, boolean> = MutableMapUtils.create()


	public originBox2: nullable<Box3> = null

	private _userDataMap: ImmutableMap<name, any> = ImmutableMap()

	private _transformsQueryByFrustum = []
	private _namesQueryByFrustum = []
	private _colorsQueryByFrustum = []
	// private _transformsQueryByFrustum = MutableMapUtils.create()
	// private _namesQueryByFrustum = MutableMapUtils.create()
	// private _colorsQueryByFrustum = MutableMapUtils.create()
	// private _countQueryByFrustum = 0

	private _lastIndex = 0

	getUserData(name) {
		return getExn(this._userDataMap.get(name))
	}

	setUserData(name, userData) {
		this._userDataMap = this._userDataMap.set(name, userData)
	}

	getLastIndex() {
		// return this.transforms.length - 1
		return this._lastIndex - 1
	}

	getAliveNames() {
		// return this.names.filter(name => {
		// 	// return this.getStatus(i).isVisible
		// 	return this.getStatus(i).isCollisionable
		// })
		// return MutableMapUtils.filter(this.names, name => {
		// 	return !this._isNotAliveName(name)

		// })
		return MutableMapUtils.values(this.names)
	}

	getAliveBoxes() {
		// return MutableMapUtils.filter(this.boxes, box => {
		// 	return !this._isNotAliveBox(box)
		// })
		return MutableMapUtils.values(this.boxes)
	}

	// getAliveTransforms() {
	// 	return this.transforms.filter(transform => {
	// 		return !NullableUtils.isNullable(transform)
	// 	})
	// }

	getValidData(state: state): Array<[Matrix4, Box3, name, Color]> {
		// return this.names.reduce(([transforms, boxes, names], name, i) => {
		// 	if (!this.getStatus(i).isVisible) {
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

		// return this.names.reduce((result, name, i) => {
		return MutableMapUtils.reduce(this.names, (result, name, i) => {
			if (
				// this._isNotAliveName(name)
				// ||
				// !this.getStatus(i).isVisible
				!this.getIsVisible(i)
			) {
				return result
			}

			return push(result, [
				MutableMapUtils.getExn(this.transforms, i),
				MutableMapUtils.getExn(this.boxes, i),
				MutableMapUtils.getExn(this.names, i),
				MutableMapUtils.getExn(this.colors, i),
			])
		}, [])
	}


	// getValidIndices(state: state): Array<index> {
	// 	return this.names.reduce((result, name, i) => {
	// 		if (!this.getStatus(i).isVisible) {
	// 			return result
	// 		}

	// 		return push(result, i)
	// 	}, [])
	// }

	// remove(state: state, index: number) {
	// 	let name = this.getName(index)

	// 	this.transforms = remove(this.transforms, index)
	// 	this.names = remove(this.names, index)
	// 	this.boxes = remove(this.boxes, index)

	// 	this._userDataMap = this._userDataMap.remove(name)

	// 	state = removeStatusForLODQueue(state, name)
	// 	state = removeLODQueue(state, name)

	// 	return state
	// }

	remove(state: state, index) {
		let name = MutableMapUtils.getExn(this.names, index)

		// this.transforms = ArrayUtils.set(this.transforms, index, null)
		// this.names = ArrayUtils.set(this.names, index, null)
		// this.boxes = ArrayUtils.set(this.boxes, index, null)
		// this.colors = ArrayUtils.set(this.colors, index, null)
		// // this.statuses = ArrayUtils.set(this.statuses, index, null)
		// this.isCollisionables = ArrayUtils.set(this.isCollisionables, index, null)
		// this.isVisibles = ArrayUtils.set(this.isVisibles, index, null)
		this.transforms = MutableMapUtils.remove(this.transforms, index)
		this.names = MutableMapUtils.remove(this.names, index)
		this.boxes = MutableMapUtils.remove(this.boxes, index)
		this.colors = MutableMapUtils.remove(this.colors, index)
		this.isCollisionables = MutableMapUtils.remove(this.isCollisionables, index)
		this.isVisibles = MutableMapUtils.remove(this.isVisibles, index)

		// this._transformsQueryByFrustum = ArrayUtils.remove(this._transformsQueryByFrustum, index)
		// this._namesQueryByFrustum = ArrayUtils.remove(this._namesQueryByFrustum, index)
		this._transformsQueryByFrustum = ArrayUtils.create()
		this._namesQueryByFrustum = ArrayUtils.create()
		this._colorsQueryByFrustum = ArrayUtils.create()
		// this._transformsQueryByFrustum = MutableMapUtils.create()
		// this._namesQueryByFrustum = MutableMapUtils.create()
		// this._colorsQueryByFrustum = MutableMapUtils.create()


		this._userDataMap = this._userDataMap.remove(name)

		// state = removeStatusForLODQueue(state, name)
		state = removeLODQueue(state, name)

		return state
	}

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

		let transform = MutableMapUtils.getExn(this.transforms, index)

		func(transform)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	this.getBox(index).copy(
			// 		originBox.clone().applyMatrix4(transform)
			// 	)
			// }
			// else {
			// 	this.getBox(index) = originBox.clone().applyMatrix4(transform)
			// }

			MutableMapUtils.getExn(this.boxes, index).copy(
				originBox.clone().applyMatrix4(transform)
			)
		}
	}

	updateTransform2(func: (transform: Matrix4) => void, index: number, isUpdateBox) {
		let originBox2 = getExn(this.originBox2)

		// this.forEach((data) => {
		// 	if (data.name == name) {
		// 		func(data.transform)

		// 		data.box.copy(
		// 			originBox.clone().applyMatrix4(data.transform)
		// 		)
		// 	}
		// })

		let transform = MutableMapUtils.getExn(this.transforms, index)

		func(transform)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	this.getBox(index).copy(
			// 		originBox.clone().applyMatrix4(transform)
			// 	)
			// }
			// else {
			// 	this.getBox(index) = originBox.clone().applyMatrix4(transform)
			// }

			MutableMapUtils.getExn(this.boxes, index).copy(
				originBox2.clone().applyMatrix4(transform)
			)
		}
	}

	_updateBox(index, position: Vector3) {
		let box = MutableMapUtils.getExn(this.boxes, index)
		let size = box.getSize(_v3)

		box.setFromCenterAndSize(
			_v4.set(position.x, position.y + size.y / 2, position.z),
			size
		)
	}

	updatePosition(index: number, position: Vector3, isUpdateBox) {
		// let originBox = getExn(this.originBox)

		let transform = MutableMapUtils.getExn(this.transforms, index)

		transform.setPosition(position)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	// this.getBox(index).copy(
			// 	// 	originBox.clone().translate(position)
			// 	// )
			// 	TODO box3 set position

			// 	this.getBox(index).tran(
			// 		originBox.clone().translate(position)
			// 	)
			// }
			// else {
			// 	this.getBox(index) = originBox.clone().translate(position)
			// }

			this._updateBox(index, position)
		}
	}

	updatePosition2(index: number, [x, z], isUpdateBox: boolean, isDebug: boolean) {
		// let originBox = getExn(this.originBox)

		let transform = MutableMapUtils.getExn(this.transforms, index)

		let y = TransformUtils.getPositionYFromMatrix4(transform)
		let position = _v1.set(x, y, z)

		transform.setPosition(position)

		if (isUpdateBox) {
			// if (isDebug) {
			// 	this.getBox(index).copy(
			// 		originBox.clone().translate(position)
			// 	)
			// }
			// else {
			// 	this.getBox(index) = originBox.clone().translate(position)
			// }

			this._updateBox(index, position)
		}
	}

	insert(transform, box, name, status, color = new Color(1, 1, 1)) {
		let { transforms, boxes, names, colors, isCollisionables, isVisibles } = this;

		// transforms.push(transform);
		// boxes.push(box);
		// names.push(name);
		// colors.push(color);
		// isCollisionables.push(status.isCollisionable);
		// isVisibles.push(status.isVisible);

		let index = this._lastIndex
		MutableMapUtils.set(transforms, index, transform)
		MutableMapUtils.set(boxes, index, box)
		MutableMapUtils.set(names, index, name)
		MutableMapUtils.set(colors, index, color)
		MutableMapUtils.set(isCollisionables, index, status.isCollisionable)
		MutableMapUtils.set(isVisibles, index, status.isVisible)

		this._lastIndex += 1
	}

	forEach(func: (transform: Matrix4, i: number) => void) {
		// let self = this

		MutableMapUtils.forEach(this.transforms, (transform, i) => {
			// if (this._isNotAliveTransform(transform)) {
			// 	return
			// }

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
	// 		let name = this.getName(index)
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
		// return this.getAliveBoxes().reduce((result, box, i) => {
		return MutableMapUtils.reduce(this.boxes, (result, box, i) => {
			result.push(box)

			return result
		}, [])
	}

	reduce<T>(result: T, func: (result: T, transform, index) => T) {
		// let self = this

		return MutableMapUtils.reduce(this.transforms, (result, transform, i) => {
			// if (this._isNotAliveTransform(transform)) {
			// 	return result
			// }

			return func(result, transform, i)
		}, result)
	}

	reducePromise<T>(result: T, func: (result: T, transform, index) => Promise<T>) {
		// let self = this

		return MutableMapUtils.reducePromise(this.transforms, (result, transform, i) => {
			// if (this._isNotAliveTransform(transform)) {
			// 	return Promise.resolve(result)
			// }

			return func(result, transform, i)
		}, result)
	}

	find<T>(func: (transform, index) => nullable<T>) {
		// let self = this

		return MutableMapUtils.reduce(this.transforms, (result, transform, i) => {
			if (
				// this._isNotAliveTransform(transform)
				// ||
				!isNullable(result)) {
				return result
			}

			return func(transform, i)
		}, getEmpty<T>())
	}

	// findBoxByName(name) {
	// 	return this.find<nullable<Box3>>((_, index) => {
	// 		if (this.getName(index) == name) {
	// 			return return_(this.getBox(index))
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
	// queryByFrustum(state: state, frustum: Frustum): [number, Array<THREE.Matrix4>, Array<string>, Array<Color>] {
	// 	let [count, transforms, names, colors] = this.reduce<[number, Array<Matrix4>, Array<string>, Array<Color>]>([0, this._transformsQueryByFrustum, this._namesQueryByFrustum, this._colorsQueryByFrustum], (result, transform, index) => {
	// 		let name = this.getName(index)
	// 		let color = this.colors[index]

	// 		if (
	// 			// this.statuses[index].isVisible
	// 			this.getStatus(i).isVisible
	// 			&& frustum.intersectsBox(
	// 				this.getBox(index)
	// 			)
	// 		) {
	// 			let [i, transforms, names, colors] = result

	// 			// return [push(transforms, transform), push(names, this.getName(index))]
	// 			return [i + 1, set(transforms, i, transform), set(names, i, name), set(colors, i, color)]
	// 		}

	// 		return result
	// 	})

	// 	// this._countQueryByFrustum = count

	// 	return [count, transforms, names, colors]

	// 	// return this.reduce<Array<Matrix4>>([], (result, transform, index) => {
	// 	// 	if (
	// 	// 		this.statuses[index].isVisible
	// 	// 		&& frustum.intersectsBox(
	// 	// 			this.getBox(index)
	// 	// 		)
	// 	// 	) {
	// 	// 		let transforms = result

	// 	// 		return push(transforms, transform)
	// 	// 	}

	// 	// 	return result
	// 	// })
	// }

	// getStatus(index) {
	// 	return this.statuses[index]
	// }

	// getStatusByName(name) {
	// 	return this.getStatus(this.getIndex(name))
	// }

	getIsCollisionable(index) {
		return MutableMapUtils.getExn(this.isCollisionables, index)
	}

	getIsCollisionableByName(name) {
		return this.getIsCollisionable(this.getIndex(name))
	}

	getIsVisible(index) {
		return MutableMapUtils.getExn(this.isVisibles, index)
	}

	getIsVisiblesByName(name) {
		return this.getIsVisible(this.getIndex(name))
	}

	setStatus(index, status) {
		// this.isCollisionables[index] = status.isCollisionable
		// this.isVisibles[index] = status.isVisible
		MutableMapUtils.set(this.isCollisionables, index, status.isCollisionable)
		MutableMapUtils.set(this.isVisibles, index, status.isVisible)
	}

	setStatusByName(name, status) {
		this.setStatus(this.getIndex(name), status)
	}


	protected queryByFrustumProtected(frustum: Frustum, forEachTransforms): [number, THREE.Matrix4[], string[], Color[]] {
		// 预分配结果数组（复用空间）
		const transforms = this._transformsQueryByFrustum;
		const names = this._namesQueryByFrustum;
		const colors = this._colorsQueryByFrustum;

		let count = 0;
		// const total =  this.transforms.length;

		// 使用for循环代替reduce（性能关键）
		// for (let index = 0; index < total; index++) {
		// 	let transform = this.getTransform(index)
		// 	let name = this.getName(index)

		// 	if (this._isNotAliveTransform(transform)) {
		// 		// break
		// 		continue
		// 	}

		// 	// 提前检查可见性
		// 	// if (!this.getStatus(i).isVisible) {
		// 	// if (!this.getStatus(index).isVisible) {
		// 	if (!this.getIsVisible(index)) {
		// 		continue;
		// 	}

		// 	// 视锥体碰撞检测
		// 	if (!frustum.intersectsBox(this.getBox(index))) {
		// 		continue;
		// 	}

		// 	// 直接写入预分配数组
		// 	transforms[count] = transform;
		// 	names[count] = name;
		// 	colors[count] = this.colors[index];
		// 	// set(transforms, count, transform)
		// 	// set(names, count, name)
		// 	// set(colors, count, this.colors[index])

		// 	count++;
		// }

		MutableMapUtils.forEach(forEachTransforms, (transform, index) => {
			// let transform = this.getTransform(index)
			let name = MutableMapUtils.getExn(this.names, index)

			// if (this._isNotAliveTransform(transform)) {
			// 	// break
			// 	continue
			// }

			// 提前检查可见性
			// if (!this.getStatus(i).isVisible) {
			// if (!this.getStatus(index).isVisible) {
			if (!this.getIsVisible(index)) {
				// continue;
				return
			}

			// 视锥体碰撞检测
			if (!frustum.intersectsBox(this.getBox(index))) {
				// continue;
				return
			}

			// 直接写入预分配数组
			transforms[count] = transform;
			names[count] = name;
			colors[count] = this.getColor(index)

			count++;
		})

		// 裁剪数组到实际大小
		transforms.length = count;
		names.length = count;
		colors.length = count;

		return [count, transforms, names, colors];
	}

	queryByFrustum(state: state, frustum: Frustum): [number, THREE.Matrix4[], string[], Color[]] {
		return this.queryByFrustumProtected(frustum, this.transforms)
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

	// queryByBox(state: state, queryBox: THREE.Box3, transform = null, box = null, name = null) {
	// 	return this.boxes.reduce(([transform, box, name], box_, i) => {
	// 		if (
	// 			this._isNotAliveBox(box_)
	// 			||
	// 			transform !== null) {
	// 			return [transform, box, name]
	// 		}

	// 		let name_ = this.names[i]
	// 		if (

	// 			// this.getStatus(i).isCollisionable
	// 			this.getIsCollisionable(i)
	// 			&& queryBox.intersectsBox(box_)
	// 		) {
	// 			return [
	// 				this.transforms[i], this.boxes[i], name_]
	// 		}

	// 		return [transform, box, name]
	// 	}, [transform, box, name])
	// }

	// queryByBoxAndCamp(state: state, getCampFunc, specificState, queryBox: THREE.Box3, camp, transform = null, box = null, name = null) {
	// 	return this.boxes.reduce(([transform, box, name], box_, i) => {
	// 		if (
	// 			this._isNotAliveBox(box_)
	// 			||
	// 			!NullableUtils.isNullable(transform)) {
	// 			return [transform, box, name]
	// 		}

	// 		let name_ = this.names[i]

	// 		if (
	// 			getCampFunc(specificState, name_) != camp
	// 			&& getStatusForLODQueue(state, name_).isCollisionable
	// 			&& queryBox.intersectsBox(box_)
	// 		) {
	// 			return [
	// 				this.transforms[i], this.boxes[i], name_]
	// 		}

	// 		return [transform, box, name]
	// 	}, [transform, box, name])
	// }
	queryByBoxAndCamp(
		state: state,
		getCampFunc: Function,
		specificState: any,
		queryBox: THREE.Box3,
		camp: any,
		transform: THREE.Matrix4 | null = null,
		box: THREE.Box3 | null = null,
		name: string | null = null
	): [THREE.Matrix4 | null, THREE.Box3 | null, string | null] {

		// // 如果已经找到匹配项，直接返回
		// if (transform !== null) {
		// 	return [transform, box, name];
		// }

		// for (let i = 0; i < this.boxes.length; i++) {
		// 	const currentBox = this.boxes[i];

		// 	// 跳过无效或已处理的包围盒
		// 	if (this._isNotAliveBox(currentBox)) {
		// 		continue;
		// 	}

		// 	const currentName = this.names[i];
		// 	// const currentStatus = this.getStatus(i);

		// 	// 检查是否满足所有条件
		// 	if (
		// 		getCampFunc(specificState, currentName) !== camp &&
		// 		this.getIsCollisionable(i) &&
		// 		queryBox.intersectsBox(currentBox)
		// 	) {
		// 		// 找到匹配项，立即返回
		// 		return [this.transforms[i], currentBox, currentName];
		// 	}
		// }
		MutableMapUtils.forEach(this.boxes, (currentBox, i) => {
			// 如果已经找到匹配项，直接返回
			if (transform !== null) {
				// return [transform, box, name];
				return
			}

			// const currentBox = this.boxes[i];

			// // 跳过无效或已处理的包围盒
			// if (this._isNotAliveBox(currentBox)) {
			// 	continue;
			// }

			const currentName = MutableMapUtils.getExn(this.names, i)
			// const currentStatus = this.getStatus(i);

			// 检查是否满足所有条件
			if (
				getCampFunc(specificState, currentName) !== camp &&
				this.getIsCollisionable(i) &&
				queryBox.intersectsBox(currentBox)
			) {
				// 找到匹配项，立即返回
				// return [this.transforms[i], currentBox, currentName];

				transform = MutableMapUtils.getExn(this.transforms, i)
				box = currentBox
				name = currentName
			}
		})

		// 未找到匹配项，返回原始值
		return [transform, box, name];
	}

	// queryRangeByBoxAndCamp(state: state, getCampFunc, specificState, queryBox: THREE.Box3, camp, transforms = [], boxes = [], names = []) {
	// 	return this.boxes.reduce<[Array<Matrix4>, Array<Box3>, Array<name>]>(([transforms, boxes, names], box_, i) => {
	// 		if (
	// 			this._isNotAliveBox(box_)
	// 		) {
	// 			return [transforms, boxes, names]
	// 		}

	// 		let name_ = this.names[i]

	// 		if (
	// 			getCampFunc(specificState, name_) != camp
	// 			&& getStatusForLODQueue(state, name_).isCollisionable
	// 			&& queryBox.intersectsBox(box_)
	// 		) {
	// 			return [push(transforms, this.transforms[i]), push(boxes, this.boxes[i]), push(names, name_)]
	// 		}

	// 		return [transforms, boxes, names]
	// 	}, [transforms, boxes, names])
	// }
	queryRangeByBoxAndCamp(
		state: state,
		getCampFunc: (specificState: any, name: string) => any,
		specificState: any,
		queryBox: THREE.Box3,
		camp: any,
		transforms: THREE.Matrix4[] = [],
		boxes: THREE.Box3[] = [],
		names: string[] = []
	): [THREE.Matrix4[], THREE.Box3[], string[]] {
		// for (let i = 0; i < this.boxes.length; i++) {
		// 	const box = this.boxes[i];

		// 	// 跳过无效的包围盒
		// 	if (this._isNotAliveBox(box)) continue;

		// 	const name = this.names[i];
		// 	// const status = this.getStatus(i);

		// 	// 检查是否满足所有条件
		// 	if (
		// 		getCampFunc(specificState, name) !== camp &&
		// 		this.getIsCollisionable(i) &&
		// 		queryBox.intersectsBox(box)
		// 	) { // 直接添加到结果数组
		// 		transforms.push(this.transforms[i]);
		// 		boxes.push(box);
		// 		names.push(name);
		// 	}
		// }
		MutableMapUtils.forEach(this.boxes, (box, i) => {
			// const box = this.boxes[i];

			// // 跳过无效的包围盒
			// if (this._isNotAliveBox(box)) continue;

			const name = MutableMapUtils.getExn(this.names, i)
			// const status = this.getStatus(i);

			// 检查是否满足所有条件
			if (
				getCampFunc(specificState, name) !== camp &&
				this.getIsCollisionable(i) &&
				queryBox.intersectsBox(box)
			) { // 直接添加到结果数组
				transforms.push(MutableMapUtils.getExn(this.transforms, i))
				boxes.push(box);
				names.push(name);
			}
		})

		return [transforms, boxes, names];
	}

	queryRangeByBox(state: state, boxRange: THREE.Box3, transforms = [], boxes = [], names = []) {
		return MutableMapUtils.reduce(this.boxes, ([transforms, boxes, names], box_, i) => {
			// if (
			// 	this._isNotAliveBox(box_)
			// ) {
			// 	return [transforms, boxes, names]
			// }

			let name = MutableMapUtils.getExn(this.names, i)
			if (
				// this.getStatus(i).isCollisionable
				this.getIsCollisionable(i)
				&& boxRange.intersectsBox(box_)) {
				return [push(transforms, MutableMapUtils.getExn(this.transforms, i)), push(boxes, box_), push(names, name)]
			}

			return [transforms, boxes, names]
		}, [transforms, boxes, names])
	}

	// queryByRayAndCamp(state: state, getCampFunc, specificState, ray: THREE.Ray, camp, distance = Infinity, transform = null, box = null, name = null) {
	queryByRayAndCamp(state: state, getCampFunc, specificState, ray: THREE.Ray, camp) {
		let result = MutableMapUtils.reduce(this.boxes, ([distance, transform, box, name, index], box_, i) => {
			// if (
			// 	this._isNotAliveBox(box_)
			// ) {
			// 	return [distance, transform, box, name, i]
			// }

			let name_ = MutableMapUtils.getExn(this.names, i)

			if (
				getCampFunc(specificState, name_) != camp
				&&
				// this.getStatus(i).isPickable
				// this.isAlive(i)
				this.getIsCollisionable(i)
			) {
				let result = ray.intersectBox(box_, _v1)

				if (!isStrictNullable(result)) {
					let newDistance = getExn(result).sub(ray.origin).length()

					if (distance > newDistance) {
						return [
							newDistance,
							MutableMapUtils.getExn(this.transforms, i),
							MutableMapUtils.getExn(this.boxes, i),
							name_, i]
					}
				}

				return [distance, transform, box, name, index]
			}

			return [distance, transform, box, name, index]
		}, [+Infinity, null, null, null, null])

		if (NullableUtils.isNullable(result[1])) {
			return NullableUtils.getEmpty()
		}

		return NullableUtils.return_(result)
	}


	queryByRay(state: state, ray: THREE.Ray) {
		let result = MutableMapUtils.reduce(this.boxes, ([distance, transform, box, name, index], box_, i) => {
			// if (
			// 	this._isNotAliveBox(box_)
			// ) {
			// 	return [distance, transform, box, name, i]
			// }

			let name_ = MutableMapUtils.getExn(this.names, i)

			if (
				// getCampFunc(specificState, name_) != camp
				// &&
				// this.getStatus(i).isPickable
				// this.isAlive(i)
				this.getIsCollisionable(i)
			) {
				let result = ray.intersectBox(box_, _v1)

				if (!isStrictNullable(result)) {
					let newDistance = getExn(result).sub(ray.origin).length()

					if (distance > newDistance) {
						return [
							newDistance,
							MutableMapUtils.getExn(this.transforms, i),
							MutableMapUtils.getExn(this.boxes, i),
							name_, i]
					}
				}

				return [distance, transform, box, name, index]
			}

			return [distance, transform, box, name, index]
		}, [+Infinity, null, null, null, null])

		if (NullableUtils.isNullable(result[1])) {
			return NullableUtils.getEmpty()
		}

		return NullableUtils.return_(result)
	}

	queryRangeByRayAndCamp(
		state: state,
		getCampFunc: (specificState: any, name: string) => any,
		specificState: any,
		ray: THREE.Ray,
		camp: any,
		hitPoints = [],
		// indices = []
		transforms = [], boxes = [], names = []
	) {
		// for (let i = 0; i < this.boxes.length; i++) {
		// 	const box = this.boxes[i]

		// 	// 跳过无效的包围盒
		// 	if (this._isNotAliveBox(box)) continue

		// 	const name = this.names[i]
		// 	// const status = this.getStatus(i)

		// 	// 检查是否满足所有条件
		// 	if (
		// 		getCampFunc(specificState, name) !== camp
		// 		// && this.isAlive(i)
		// 		&& this.getIsCollisionable(i)
		// 	) { // 直接添加到结果数组
		// 		NullableUtils.forEach(hitPoint => {
		// 			hitPoints.push(hitPoint.clone())
		// 			// indices.push(i)
		// 			push(transforms, this.transforms[i])
		// 			push(boxes, this.boxes[i])
		// 			push(names, name)
		// 		}, ray.intersectBox(box, _v1))
		// 	}
		// }
		MutableMapUtils.forEach(this.boxes, (box, i) => {
			const name = MutableMapUtils.getExn(this.names, i)
			// const status = this.getStatus(i)

			// 检查是否满足所有条件
			if (
				getCampFunc(specificState, name) !== camp
				// && this.isAlive(i)
				&& this.getIsCollisionable(i)
			) { // 直接添加到结果数组
				NullableUtils.forEach(hitPoint => {
					hitPoints.push(hitPoint.clone())
					// indices.push(i)
					push(transforms, MutableMapUtils.getExn(this.transforms, i))
					push(boxes, box)
					push(names, name)
				}, ray.intersectBox(box, _v1))
			}

		})

		return [hitPoints, transforms, boxes, names]
	}

	// _isNotAliveBox(box) {
	// 	return NullableUtils.isNullable(box)
	// }

	// _isNotAliveTransform(transform) {
	// 	return NullableUtils.isNullable(transform)
	// }

	// _isNotAliveName(name) {
	// 	return NullableUtils.isNullable(name)
	// }


	isAlive(index) {
		// return !NullableUtils.isNullable(this.getTransform(index))
		return MutableMapUtils.has(this.transforms, index)
		// return this.getIsCollisionable(index)
	}

	getAllAliveIndices() {
		// return range(0, this.getLastIndex()).filter(index => this.isAlive(index))
		return MutableMapUtils.keys(this.transforms)
	}

	// getIndex(name_) {
	// 	return this.names.reduce((index, name, i) => {
	// 		if (!NullableUtils.isNullable(index)) {
	// 			return index
	// 		}

	// 		if (name == name_) {
	// 			return NullableUtils.return_(i)
	// 		}

	// 		return index
	// 	}, NullableUtils.getEmpty<lodQueueIndex>())
	// }
	getIndex(name_) {
		// const names = this.names;
		// // const length = names.length;
		// const length = MutableMapUtils.getCount(names)

		// // 使用简单的 for 循环代替 reduce
		// for (let i = 0; i < length; i++) {
		// 	// if (names[i] === name_) {
		// 	if (MutableMapUtils.getExn(names, i) === name_) {
		// 		return NullableUtils.return_(i);
		// 	}
		// }

		// return NullableUtils.getEmpty<lodQueueIndex>();

		let result = NullableUtils.getEmpty<lodQueueIndex>()
		MutableMapUtils.forEach(this.names, (name, index) => {
			if (name === name_) {
				return result = index
			}
		});

		return result
	}

	getName(index) {
		return MutableMapUtils.get(this.names, index)
	}

	getBox(index) {
		return MutableMapUtils.get(this.boxes, index)
	}

	getTransform(index) {
		// return MutableMapUtils.getExn(this.transforms, index)
		return MutableMapUtils.get(this.transforms, index)
	}

	setTransform(index, value) {
		return MutableMapUtils.set(this.transforms, index, value)
	}


	getColor(index) {
		return MutableMapUtils.get(this.colors, index)
	}

	setColor(queue, index, newColor: [number, number, number]) {
		MutableMapUtils.getExn(queue.colors, index).fromArray(newColor)
	}

	getAllQueues() {
		return [this]
	}
}