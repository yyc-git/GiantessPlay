import { Box3, Box3Helper, Matrix3, Matrix4, Quaternion, Scene, Sphere, SphereGeometry, Vector3 } from "three"
import { getCollisionState, getIsDebug, getIsNotTestPerf, setCollisionState } from "../state/State"
import { camp, collision, name, state } from "../type/StateType"
import { OBB } from "../three/OBB"
import { ArrayUtils, NullableUtils, OBBHelper, TransformUtils } from "../Main"
import { getEmpty, isNullable, return_ } from "../utils/NullableUtils"
import { push } from "../utils/ArrayUtils"
import { InstanceSourceLOD } from "../lod/InstanceSourceLOD"
import { nullable } from "../utils/nullable"
import { getBox, getName, getOctreeForStaticLODContainer, getTransform } from "../lod/LOD"
import { boxCollisionResult } from "../utils/CollisionUtils"
import { LODQueue } from "../lod/lod2/LODQueue"
import { LODContainer } from "../lod/lod2/LODContainer"

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

export let getPlayerMoveCollisionableContainers = (state: state) => {
	return getCollisionState(state).playerMoveCollisionContainers
}

export let setPlayerMoveCollisionableContainers = (state: state, collisionContainers) => {
	return setCollisionState(state, {
		...getCollisionState(state),
		playerMoveCollisionContainers: collisionContainers
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

export let queryRangeCollisionByBox = (state: state, getCampFunc, specificState,
	allArmyContainers,
	box: Box3, camp: nullable<camp>): Array<[Array<Matrix4>, Array<Box3>, Array<string>]> => {
	// box: Box3): Array<[Array<Matrix4>, Array<Box3>, Array<string>]> => {
	let data = allArmyContainers.reduce((result, container) => {
		// let [transforms, boxes, names] = container.queryRangeByBoxAndCamp(state, getCampFunc, specificState, box, camp, [], [], [])
		let [transforms, boxes, names] = NullableUtils.isNullable(camp) ? container.queryRangeByBox(state, box, [], [], []) : container.queryRangeByBoxAndCamp(state, getCampFunc, specificState, box, NullableUtils.getExn(camp), [], [], [])

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
// export let queryCollisionByBoxAndSkip = (state: state, allContainers: Array<LODQueue>, box: Box3, skippedNames: Array<string>): nullable<[Matrix4, Box3, name]> => {
// export let queryCollisionByBoxAndSkip = (state: state, allContainers: Array<LODQueue>, box: Box3, skippedNames: Array<string>): Array<[Matrix4, Box3, name]> => {
export let queryCollisionByBoxAndSkip = (state: state, allContainers: Array<LODQueue>, box: Box3, skippedNames: Array<string>): Array<Box3> => {
	let result = allContainers.reduce<Array<Box3>>((result, container) => {
		// if (!NullableUtils.isNullable(result)) {
		// 	return result
		// }

		let [transforms, boxes, names] = container.queryRangeByBox(state, box, [], [], [])

		if (transforms.length == 0) {
			return result
		}

		return names.reduce((result, name, i) => {
			// if (!NullableUtils.isNullable(result)) {
			// 	return result
			// }

			// if (name != skippedName) {
			if (!skippedNames.includes(name)) {
				// return NullableUtils.return_([transforms[i], boxes[i], name])
				// return ArrayUtils.push(result, [transforms[i], boxes[i], name])
				return ArrayUtils.push(result, boxes[i])
			}

			return result
		}, result)
	}, [])

	// if (!NullableUtils.isNullable(result)) {
	// 	return result
	// }

	let indices = getOctreeForStaticLODContainer(state).queryRangeByBox(state, box)

	if (indices.length > 0) {
		// data = push(data, [
		// 	indices.map(index => getTransform(state, index)),
		// 	indices.map(index => getBox(state, index)),
		// 	indices.map(index => getName(state, index)),
		// ]
		// )


		return indices.reduce((result, index) => {
			// if (!NullableUtils.isNullable(result)) {
			// 	return result
			// }

			let name = getName(state, index)

			if (!skippedNames.includes(name)) {
				// return NullableUtils.return_([getTransform(state, index), getBox(state, index), name])
				// return ArrayUtils.push(result, [getTransform(state, index), getBox(state, index), name])
				return ArrayUtils.push(result, getBox(state, index))
			}

			return result
		}, result)
	}

	return result
}

// export let queryCapsuleCollision = (state: state, capsule: Capsule) => {
// 	let capsuleBox = capsule.toBox()
// 	let data = getPlayerMoveCollisionableContainers(state).reduce((data, container) => {
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
// 	let data = getPlayerMoveCollisionableContainers(state).reduce((data, container) => {
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

// export let queryBoxCollision = (state: state, allContainers, box: Box3, isOnlyCollisionWithStatic: boolean): Array<[Matrix4, Box3, name]> => {
// 	let data = []
// 	if (!isOnlyCollisionWithStatic) {
// 		data = allContainers.reduce((data, container) => {
// 			return ArrayUtils.pushArrs(
// 				data,
// 				container.queryRangeByBox(state, box)
// 			)
// 		}, data)
// 	}

// 	return getOctreeForStaticLODContainer(state).queryRangeByBoxForParticle(state, box).reduce((data, index) => {
// 		return ArrayUtils.push(data, [
// 			getTransform(state, index),
// 			getBox(state, index),
// 			getName(state, index),
// 		])
// 	}, data)
// }
export let queryBoxCollision = (state: state, allContainers, box: Box3, isOnlyCollisionWithStatic: boolean): Array<Box3> => {
	let data = []
	if (!isOnlyCollisionWithStatic) {
		data = allContainers.reduce((data, container) => {
			let [_, boxes, _names] = container.queryRangeByBox(state, box)

			return ArrayUtils.pushArrs(
				data,
				boxes
			)
		}, data)
	}

	return getOctreeForStaticLODContainer(state).queryRangeByBoxForParticle(state, box).reduce((data, index) => {
		// return ArrayUtils.push(data, [
		// 	getTransform(state, index),
		// 	getBox(state, index),
		// 	getName(state, index),
		// ])
		return ArrayUtils.push(data, getBox(state, index))
	}, data)
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

	if (getIsDebug(state) && getIsNotTestPerf(state)) {
		let helper = new OBBHelper.OBBHelper(obb, debugColor)

		scene.add(helper)
	}

	return obb
}

export let createAABB = (scene, state: state, debugColor = 0xfff333) => {
	let box3 = new Box3()

	if (getIsDebug(state) && getIsNotTestPerf(state)) {
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
		playerMoveCollisionContainers: [],
		// cameraCollisionOctrees: [],
		// emitterCollisionContainers: [],
	}
}

export let dispose = (state: state) => {
	return setCollisionState(state, createState())
}