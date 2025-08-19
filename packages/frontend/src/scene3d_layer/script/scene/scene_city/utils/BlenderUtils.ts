// export let convertPositionFromBlenderToThreejs = (position) => {
// 	return [position[0], position[2], -position[1]]
// }

// export let convertPositionFromThreejsToBlender = (position) => {
// 	return [position[0], -position[2], position[1]]
// }

export let convertPositionFromBlenderToThreejs = (position) => {
	return [position[0], -position[1]]
}

export let convertPositionFromThreejsToBlender = (position) => {
	return [position[0], - position[1]]
}

export let convertQuaternionFromBlenderToThreejs = (quaternion) => {
	return [quaternion[0], quaternion[2], quaternion[1], quaternion[3]]
}