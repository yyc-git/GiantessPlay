import { Box3, Box3Helper, Matrix3, Matrix4, Quaternion, Scene, Sphere, SphereGeometry, Vector3 } from "three"
import { getCollisionState, getIsDebug, setCollisionState } from "../state/State"
import { collision, name, state } from "../type/StateType"
import { OBB } from "../three/OBB"
import { NullableUtils, OBBHelper, TransformUtils } from "../Main"
import { getEmpty, isNullable, return_ } from "../utils/NullableUtils"
import { push } from "../utils/ArrayUtils"
import { InstanceSourceLOD } from "../lod/InstanceSourceLOD"
import { nullable } from "../utils/nullable"
import { getBox, getName, getOctreeForStaticLODContainer, getTransform } from "../lod/LOD"
import { boxCollisionResult } from "../utils/CollisionUtils"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


// export let getEmitterCollisionableContainers = (state: state) => {
// 	return getCollisionState(state).emitterCollisionContainers
// }

// export let setEmitterCollisionableContainers = (state: state, collisionContainers) => {
// 	return setCollisionState(state, {
// 		...getCollisionState(state),
// 		emitterCollisionContainers: collisionContainers
// 	})
// }

export let getPlayerCollisionableContainers = (state: state) => {
	return getCollisionState(state).playerCollisionContainers
}

export let setPlayerCollisionableContainers = (state: state, collisionContainers) => {
	return setCollisionState(state, {
		...getCollisionState(state),
		playerCollisionContainers: collisionContainers
	})
}

// export let getCameraCollisionableOctrees = (state: state) => {
// 	return getCollisionState(state).cameraCollisionOctrees
// }

// export let setCameraCollisionableOctrees = (state: state, collisionOctrees) => {
// 	return setCollisionState(state, {
// 		...getCollisionState(state),
// 		cameraCollisionOctrees: collisionOctrees
// 	})
// }

export let queryRangeCollisionByBox = (state: state, box: Box3): Array<[Array<Matrix4>, Array<Box3>, Array<string>]> => {
	let data = getPlayerCollisionableContainers(state).reduce((result, container) => {
		let [transforms, boxes, names] = container.queryRangeByBox(state, box, [], [], [])

		if (transforms.length == 0) {
			return result
		}

		return push(result, [transforms, boxes, names])
	}, [])


	let indices = getOctreeForStaticLODContainer(state).queryRangeByBox(state, box)

	if (indices.length > 0) {
		data = push(data, [
			indices.map(index => getTransform(state, index)),
			indices.map(index => getBox(state, index)),
			indices.map(index => getName(state, index)),
		]
		)
	}

	return data
}


// export let queryCollisionByBoxAndSkip = (state: state, box: Box3, skippedName: string): [nullable<boxCollisionResult>, nullable<Matrix4>, nullable<Box3>, nullable<name>] => {
export let queryCollisionByBoxAndSkip = (state: state, box: Box3, skippedName: string): nullable<[Matrix4, Box3, name]> => {
	let result = getPlayerCollisionableContainers(state).reduce((result, container) => {
		if (!NullableUtils.isNullable(result)) {
			return result
		}

		let [transforms, boxes, names] = container.queryRangeByBox(state, box, [], [], [])

		if (transforms.length == 0) {
			return result
		}

		return names.reduce((result, name, i) => {
			if (!NullableUtils.isNullable(result)) {
				return result
			}

			if (name != skippedName) {
				return NullableUtils.return_([transforms[i], boxes[i], name])
			}

			return result
		}, result)
	}, NullableUtils.getEmpty())

	if (!NullableUtils.isNullable(result)) {
		return result
	}

	let indices = getOctreeForStaticLODContainer(state).queryRangeByBox(state, box)

	if (indices.length > 0) {
		// data = push(data, [
		// 	indices.map(index => getTransform(state, index)),
		// 	indices.map(index => getBox(state, index)),
		// 	indices.map(index => getName(state, index)),
		// ]
		// )


		return indices.reduce((result, index) => {
			if (!NullableUtils.isNullable(result)) {
				return result
			}

			let name = getName(state, index)

			if (name != skippedName) {
				return NullableUtils.return_([getTransform(state, index), getBox(state, index), name])
			}

			return result
		}, result)
	}

	return result
}

// export let queryCapsuleCollision = (state: state, capsule: Capsule) => {
// 	let capsuleBox = capsule.toBox()
// 	let data = getPlayerCollisionableContainers(state).reduce((data, container) => {
// 		if (data[0] !== null) {
// 			return data
// 		}

// 		return container.queryByCapsule(state, capsule, capsuleBox)
// 	}, [null, null, null, null])


// 	if (NullableUtils.isNullable(data[0])) {
// 		let d = getOctreeForStaticLODContainer(state).queryByCapsule(state, capsule, capsuleBox)
// 		if (!NullableUtils.isNullable(d[0])) {
// 			let result = NullableUtils.getExn(d[0])
// 			let index = NullableUtils.getExn(d[1])

// 			data = [
// 				result,
// 				getTransform(state, index),
// 				getBox(state, index),
// 				getName(state, index),
// 			]
// 		}
// 		// data = NullableUtils.map(
// 		// 	([result, index]) => {
// 		// 		return [
// 		// 			result,
// 		// 			getTransform(state, index),
// 		// 			getBox(state, index),
// 		// 			getName(state, index),
// 		// 		]
// 		// 	},
// 		// 	getOctreeForStaticLODContainer(state).queryByCapsule(state, capsule, capsuleBox)
// 		// )
// 	}

// 	return data
// }

// export let queryBoxCollision = (state: state, box: Box3): [nullable<boxCollisionResult>, nullable<Matrix4>, nullable<Box3>, nullable<name>] => {
// export let queryBoxCollision = (state: state, box: Box3): [nullable<Matrix4>, nullable<Box3>, nullable<name>] => {
// 	let data = getPlayerCollisionableContainers(state).reduce((data, container) => {
// 		if (data[0] !== null) {
// 			return data
// 		}

// 		return container.queryByBox(state, box)
// 	}, [null, null, null, null])


// 	if (NullableUtils.isNullable(data[0])) {
// 		let d = getOctreeForStaticLODContainer(state).queryByBox(state, box)
// 		if (!NullableUtils.isNullable(d[0])) {
// 			let result = NullableUtils.getExn(d[0])
// 			let index = NullableUtils.getExn(d[1])

// 			data = [
// 				result,
// 				getTransform(state, index),
// 				getBox(state, index),
// 				getName(state, index),
// 			]
// 		}
// 	}

// 	return data
// }
// export let queryBoxCollision = (state: state, box: Box3): [nullable<Matrix4>, nullable<Box3>, nullable<name>] => {
export let queryBoxCollision = (state: state, box: Box3): nullable<[Matrix4, Box3, name]> => {
	let data = getPlayerCollisionableContainers(state).reduce((data, container) => {
		if (!NullableUtils.isNullable(data[0])) {
			return data
		}

		return container.queryByBox(state, box)
	}, [null, null, null])


	if (NullableUtils.isNullable(data[0])) {
		// let d = getOctreeForStaticLODContainer(state).queryByBoxForCollision(state, box)
		let d = getOctreeForStaticLODContainer(state).queryByBoxForParticle(state, box)
		if (!NullableUtils.isNullable(d)) {
			let index = NullableUtils.getExn(d)

			data = [
				getTransform(state, index),
				getBox(state, index),
				getName(state, index),
			]
		}
	}

	if (NullableUtils.isNullable(data[0])) {
		return NullableUtils.getEmpty()
	}

	return [
		NullableUtils.getExn(data[0]),
		NullableUtils.getExn(data[1]),
		NullableUtils.getExn(data[2]),
	]
}

export let queryPointCollision = (collisionableContainers, point: Vector3) => {
	let data = collisionableContainers.reduce((data, container) => {
		if (data[0] !== null) {
			return data
		}

		return container.queryByPoint(point)
	}, [null, null, null])

	return data
}

export let createOBB = (scene, state: state, debugColor = 0xfff333) => {
	let obb = new OBB()

	if (getIsDebug(state)) {
		let helper = new OBBHelper.OBBHelper(obb, debugColor)

		scene.add(helper)
	}

	return obb
}

export let createAABB = (scene, state: state, debugColor = 0xfff333) => {
	let box3 = new Box3()

	if (getIsDebug(state)) {
		let helper = new Box3Helper(box3, debugColor)

		scene.add(helper)
	}

	return box3
}

// export let createSphere = (scene, state: state, debugColor = 0xfff333) => {
// 	let sphere = new Sphere()

// 	if (getIsDebug(state)) {
// 		let helper = new SphereGeometry()

// 		scene.add(helper)
// 	}

// 	return sphere
// }

export let updateOBB = (obb: OBB, center: Vector3, quat: Quaternion, halfSize: Vector3) => {
	return obb.set(center, halfSize,
		new Matrix3()
			.setFromMatrix4(
				// _m.makeRotationFromQuaternion(quat)
				// TransformUtils.setQuaternionToMatrix4(_m, quat)
				TransformUtils.setQuaternionToMatrix4(new Matrix4(), quat)
			)
	)
}

export let createState = (): collision => {
	return {
		playerCollisionContainers: [],
		// cameraCollisionOctrees: [],
		// emitterCollisionContainers: [],
	}
}

export let dispose = (state: state) => {
	return setCollisionState(state, createState())
}