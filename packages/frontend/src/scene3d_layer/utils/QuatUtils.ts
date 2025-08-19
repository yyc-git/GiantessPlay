import { Quaternion } from "three"

let _round = (value) => {
	return Math.round(value * 1000) / 1000
}

export let round = (quat: Quaternion) => {
	return quat.set(
		_round(quat.x),
		_round(quat.y),
		_round(quat.z),
		_round(quat.w),
	)
}

export let toRadians = (angle) => {
	return angle * 2 * Math.PI / 360
}