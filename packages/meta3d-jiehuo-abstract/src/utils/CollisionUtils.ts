import { Vector3, Box3Helper } from "three";
import { Capsule } from "../three/Capsule";
import { getIsNotTestPerf } from "../state/State";
import { state } from "../type/StateType";

export type boxCollisionResult = {
	normal: Vector3,
	depth: number
}

const _v1 = new Vector3();
const _v2 = new Vector3();


// export let buildCapsuleCollisionResult = (capsule, box): boxCollisionResult => {
// 	// TODO compute normal vector to box3's plane?
// 	let collisionVector = capsule.getCenter(_v1).sub(box.getCenter(_v2))

// 	let depth = collisionVector.length()

// 	return { normal: collisionVector.normalize(), depth: depth }
// }


export let buildBoxCollisionResult = (sourceBox, targetBox): boxCollisionResult => {
	// TODO compute normal vector to box3's plane?
	let collisionVector = sourceBox.getCenter(_v1).sub(targetBox.getCenter(_v2))

	let depth = collisionVector.length()

	return { normal: collisionVector.normalize(), depth: depth }
}


// export let queryByCapsule = (capsule: Capsule,capsuleBox, [transforms, boxes, names], statuses, result = null, transform = null, box = null, name = null) => {
// 	return boxes.reduce(([result, transform, box, name], box_, i) => {
// 		if (result !== null) {
// 			return [result, transform, box, name]
// 		}

// 		if (statuses[i].isCollisionable && capsuleBox.intersectsBox(box_)
// 			&& capsule.intersectsBox(box_)
// 		) {
// 			return [
// 				buildCapsuleCollisionResult(capsule, box_), transforms[i], boxes[i], names[i]]
// 		}

// 		return [result, transform, box, name]
// 	}, [result, transform, box, name])
// }

export let addBox3Helper = (state: state, scene, box, colorString) => {
	if (!getIsNotTestPerf(state)) {
		return
	}

	let helper = new Box3Helper(box, colorString)

	// helper.visible = state.config.isShowBox && getIsNotTestPerf(state)
	// helper.visible = state.config.isShowBox
	helper.visible = false

	scene.add(helper)

	// return helper
}