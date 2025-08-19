import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { Vector3 } from "three"

const _v1 = new Vector3();
const _v2 = new Vector3();


export let buildDownDirection = () => {
	return new Vector3(0, -1, 0)
}

export let buildUpDirection = () => {
	return new Vector3(0, 1, 0)
}


export let buildRandomDirection = () => {
	return new Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
	).normalize()
}

export let buildRandomDirectionInXZ = () => {
	let value = new Vector3(
		Math.random() * 2 - 1,
		0,
		Math.random() * 2 - 1,
	).normalize()

	if (value.length() != 1) {
		return buildRandomDirectionInXZ()
	}

	return value
}

export let computeDirectionAxis = (direction, isDebug) => {
	requireCheck(() => {
		test("direction should be valid", () => {
			return NumberUtils.isNearlyEqual(direction.length(), 1, 2)
		})
	}, isDebug)

	let yAxis = _v1.set(0, 1, 0)

	if (direction.equals(yAxis)) {
		return buildRandomDirectionInXZ()
	}

	let value = yAxis.clone().cross(direction).normalize()

	return ensureCheck(value, value => {
		test("should be valid", () => {
			return NumberUtils.isNearlyEqual(value.length(), 1, 2)
		})
	}, isDebug)
}
