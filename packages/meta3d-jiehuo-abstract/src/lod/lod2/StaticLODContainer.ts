import * as THREE from "three";
import { details, state, staticLODContainerIndex } from "../../type/StateType";
import { forEach, getEmpty, getExn, isNullable, isStrictNullable, return_ } from "../../utils/NullableUtils";
import { Capsule } from "../../three/Capsule";
import { nullable } from "../../utils/nullable";
import { push } from "../../utils/ArrayUtils";
// import { buildCapsuleCollisionResult, queryByCapsule } from "../../utils/CollisionUtils";
import { status } from "./LODContainerType";
import { LODContainer } from "./LODContainer";
import { getAllBoxes, getName, getOctreeForStaticLODContainer, getTransform, getVisibleIndicesAfterfrustumCull, setStatusByName } from "../LOD";
import { getIndexFromBox } from "../utils/OctreeUtils";
import { ArrayUtils, MutableMapUtils, MutableNumberMapUtils } from "../../Main";

const _v1 = new THREE.Vector3();


class StaticLODContainer extends LODContainer {
	// public box: THREE.Box3
	// public actualBox: THREE.Box3

	// public capacity
	// public divided

	// public transforms: Array<THREE.Matrix4>
	// public boxes: Array<THREE.Box3>
	// public names: Array<string>
	// public statuses: Array<status>

	// public children
	// public depth

	// public details: details = null

	// public name: string

	public isStaticLODContainer = true

	// private _containedIndices = []
	public minIndex = 0
	public maxIndex = +Infinity

	private _transformsQueryByFrustum = []
	private _namesQueryByFrustum = []
	// private _countQueryByFrustum = 0

	// constructor(box3, n, depth) {
	// 	super()

	// 	this.box = box3;
	// 	this.actualBox = box3.clone();


	// 	this.capacity = n;
	// 	this.divided = false;

	// 	// this.transforms = [];
	// 	// this.boxes = [];
	// 	// this.names = [];
	// 	// this.statuses = [];

	// 	this.children = [];
	// 	this.depth = depth;
	// }
	constructor() {
		super()
	}

	// setName(mainName, categoryName) {
	// 	this.name = `${mainName}_${categoryName}`
	// }

	// containIndex(index: staticLODContainerIndex) {
	// 	this._containedIndices[index] = true

	// 	// return setStaticLODContainer(state, index, this)
	// }

	isContainIndex(index: staticLODContainerIndex) {
		// return this._containedIndices[index] === true
		return this.minIndex <= index && index <= this.maxIndex
	}

	queryByFrustum(state: state, _): [number, Array<THREE.Matrix4>, Array<string>] {
		let [count, transforms, names] = MutableNumberMapUtils.reduce(getVisibleIndicesAfterfrustumCull(state), ([index, transforms, names], isVisible, visibleIndex) => {
			if (isVisible && this.isContainIndex(visibleIndex)) {
				return [
					// ArrayUtils.push(
					// 	transforms,
					// 	getTransform(state, visibleIndex)
					// ),
					// ArrayUtils.push(
					// 	names,
					// 	getName(state, visibleIndex)
					// )

					index + 1,
					ArrayUtils.set(transforms, index, getTransform(state, visibleIndex)),
					ArrayUtils.set(names, index, getName(state, visibleIndex)),
					transforms[index]
				]
			}

			return [index, transforms, names]
		}, [0, this._transformsQueryByFrustum, this._namesQueryByFrustum])

		// this._countQueryByFrustum = count

		return [count, transforms, names]
	}

	// queryByCapsule(capsule: Capsule, capsuleBox: THREE.Box3) {
	// 	// return getVisibleIndicesAfterfrustumCull(state).filter(index => {
	// 	// 	return this._containedIndices.includes(index)
	// 	// }).map(index => {
	// 	// 	return getTransform(state, index)
	// 	// })


	// }

	// _findStatusByName(name) {
	// 	return this._find((obj) => {
	// 		let index = obj.names.indexOf(name)
	// 		if (index != -1) {
	// 			return return_(obj.statuses[index])
	// 		}

	// 		return getEmpty()
	// 	}, this)
	// }

	setStatus(state, name, status: status) {
		setStatusByName(state, name, status)

		return this
	}

	// // TODO perf: use batch search
	// batchSetStatus(names, status: status) {
	// 	names.forEach(name => this.setStatus(name, status))

	// 	return this
	// }

	// _traverse<T>(result: Array<T>, func: (o: StaticLODContainer) => Array<T>, octree: StaticLODContainer) {
	// 	let self = this

	// 	return octree.children.reduce((result, child) => {
	// 		return self._traverse(result.concat(func(child)), func, child)
	// 	}, result)
	// }

	// traverse<T>(func: (obj: StaticLODContainer) => Array<T>) {
	// 	return this._traverse<T>(func(this), func, this)
	// }

	getAllBoxes(state): THREE.Box3[] {
		// let octree = getOctreeForStaticLODContainer(state)

		// return octree.boxes.filter(box => {
		return getAllBoxes(state).filter(box => {
			return this.isContainIndex(getIndexFromBox(box))
		})
	}



	// _forEach(func, octree: StaticLODContainer) {
	// 	let self = this

	// 	func(octree)

	// 	octree.children.forEach(child => {
	// 		self._forEach(func, child)
	// 	})
	// }

	// forEach<T>(func: (obj: StaticLODContainer) => void) {
	// 	this._forEach(func, this)
	// }


	// _find<T>(func: (o: StaticLODContainer) => nullable<T>, octree: StaticLODContainer) {
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

	// disableShadow() {
	// 	this.details.forEach(data => {
	// 		data.group.castShadow = false
	// 	})
	// }

	// dispose() {
	// 	this.transforms = []
	// 	this.boxes = []
	// 	this.names = []
	// 	this.statuses = []
	// 	this.children = []
	// 	this.divided = false;

	// 	return this
	// }
}

export { StaticLODContainer };
