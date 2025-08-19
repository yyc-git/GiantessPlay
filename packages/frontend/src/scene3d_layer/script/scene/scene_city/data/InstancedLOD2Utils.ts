import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../utils/QuatUtils"
import { Matrix4, Quaternion, Vector3 } from "three"

const _v1 = new Vector3();

export let getTransformData = (matrix: Matrix4): [Vector3, Quaternion, Vector3] => {
	let position = new Vector3()
	let scale = new Vector3()
	let quat = new Quaternion()
	matrix.decompose(position, quat, scale)

	return [position, quat, scale]
}

export let updateRotateTween = (matrix, object, position, quat, scale, axis) => {
	quat = TransformUtils.rotateOnWorldAxis(quat, toRadians(object.euler), axis)

	matrix.compose(position, quat, scale)
}


// export let updatePositionTween = (matrix, object, quat, scale) => {
// 	matrix.compose(_v1.set(object.x, object.y, object.z), quat, scale)
// }


export let updatePositionTween = (matrix: Matrix4, object) => {
	matrix.setPosition(object.x, object.y, object.z)
}
