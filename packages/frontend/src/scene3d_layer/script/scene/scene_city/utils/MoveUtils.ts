import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { convertPositionFromBlenderToThreejs, convertQuaternionFromBlenderToThreejs } from "./BlenderUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { Euler, Quaternion, Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, writeState } from "../../../../state/State"

const _q1 = new Quaternion();
const _q2 = new Quaternion();
const _e1 = new Euler();


// export type position = [number, number, number]
export type position = [number, number]

// export type singleMoveData = {
// 	// time: number,
// 	position: position,
// 	quaternion: [number, number, number, number]
// }
export type singleMoveData = position

// let _convertSingleMoveDataFromBlenderToThreejs = (data: singleMoveData) => {
// 	return {
// 		...data,
// 		position: convertPositionFromBlenderToThreejs(data.position),
// 		quaternion: convertQuaternionFromBlenderToThreejs(data.quaternion),
// 	}
// }

let _convertSingleMoveDataFromBlenderToThreejs = (data: singleMoveData) => {
	return convertPositionFromBlenderToThreejs(data)
}

export let getMoveData = (userData: any, state: state): Array<singleMoveData> => {
	let value = JSON.parse(MutableMapUtils.getExn(userData, "moveData")).map(_convertSingleMoveDataFromBlenderToThreejs)

	return ensureCheck(value, value => {
		test("length should >= 2", () => {
			return value.length >= 2
		})
	}, getIsDebug(state))
}

export let computeMoveTime = (previousPosition, nextPosition, factor) => {
	let dx = previousPosition[0] - nextPosition[0], dz = previousPosition[1] - nextPosition[1]

	let distance = Math.sqrt(dx * dx + dz * dz)

	if (distance < 20) {
		return 500 * factor
	}

	// return Math.min(100000, distance * (1000 + 1000 * Math.random()) / 20 * factor)
	return distance * (1000 + 1000 * Math.random()) / 20 * factor
}

export let computeEuler = (previousPosition: position, nextPosition: position, initialEulerToFaceNegativeX: Euler): nullable<Euler> => {
	// requireCheck(() => {
	// 	test("y should be equal", () => {
	// 		return previousPosition[1] == nextPosition[1]
	// 	})
	// }, true)

	/*!now only support 4 directions*/
	let eulerY
	if (nextPosition[0] > previousPosition[0]) {
		eulerY = Math.PI
	}
	else if (nextPosition[0] < previousPosition[0]) {
		eulerY = 0
	}
	else if (nextPosition[1] > previousPosition[1]) {
		eulerY = Math.PI / 2
	}
	else if (nextPosition[1] < previousPosition[1]) {
		eulerY = -Math.PI / 2
	}
	else {
		return NullableUtils.getEmpty()
	}

	// return NullableUtils.return_(initialEulerToFaceNegativeX.clone().set(
	// 	initialEulerToFaceNegativeX.x,
	// 	initialEulerToFaceNegativeX.y + eulerY,
	// 	initialEulerToFaceNegativeX.z,
	// ))
	return NullableUtils.return_(new Euler().setFromQuaternion(_q1.setFromEuler(initialEulerToFaceNegativeX).premultiply(
		_q2.setFromEuler(
			_e1.set(0, eulerY, 0)
		)
	)))
}

export let buildMultipleTweens = (state: state, [onUpdateFunc, createObjectFunc, onStartFunc, getTimeFunc], data): [state, nullable<tween>, Array<tween>] => {
	let object = createObjectFunc(data[0])

	let allTweens = []

	if (data.length == 1) {
		// state = updateForOneDataFunc(state, data)
		state = onUpdateFunc(state, object, data[0])

		return [state, NullableUtils.getEmpty(), allTweens]
	}

	let [_, [firstTween, lastTween]] = data.slice(1).reduce(([[previousTween, previousData], [firstTween, lastTween]]: any, currentData, i) => {
		let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
			.to(createObjectFunc(currentData), getTimeFunc(previousData, currentData))
			.onUpdate(() => {
				state = onUpdateFunc(readState(), object, currentData)

				writeState(state)

				return Promise.resolve()
			})
			.onStart(() => {
				writeState(onStartFunc(readState(), previousData, currentData))

				return Promise.resolve()
			})

		allTweens.push(tween)

		ArticluatedAnimation.addTween(getAbstractState(state), tween)

		if (NullableUtils.isNullable(previousTween)) {
			tween.start()
		}
		else {
			previousTween = NullableUtils.getExn(previousTween)

			previousTween.chain(tween)
		}

		if (i == 0) {
			firstTween = tween
		}
		if (i == data.length - 2) {
			lastTween = tween
		}

		return [[NullableUtils.return_(tween), currentData], [
			firstTween,
			lastTween
		]]
	}, [[NullableUtils.getEmpty(), data[0]], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])

	return [state, NullableUtils.return_(lastTween), allTweens]
}

export let buildMultipleTweensForCrowd = (state: state, [onUpdateFunc, createObjectFunc, onStartFunc], data: Array<singleMoveData>, factor = 1): [state, Array<tween>] => {
	let object = createObjectFunc(data[0])

	let allTweens = []

	if (data.length == 1) {
		state = onUpdateFunc(state, object, data[0])

		return [state, allTweens]
	}

	let [_, [firstTween, lastTween]] = data.slice(1).reduce(([[previousTween, previousData], [firstTween, lastTween]]: any, currentData, i) => {
		let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
			.to(createObjectFunc(currentData), computeMoveTime(previousData, currentData, factor))
			.onUpdate(() => {
				state = onUpdateFunc(readState(), object, currentData)

				writeState(state)

				return Promise.resolve()
			})
			.onStart(() => {
				writeState(onStartFunc(readState(), previousData, currentData))

				return Promise.resolve()
			})

		allTweens.push(tween)

		ArticluatedAnimation.addTween(getAbstractState(state), tween)

		if (NullableUtils.isNullable(previousTween)) {
			tween.start()
		}
		else {
			previousTween = NullableUtils.getExn(previousTween)

			previousTween.chain(tween)
		}

		if (i == 0) {
			firstTween = tween
		}
		if (i == data.length - 2) {
			lastTween = tween
		}

		return [[NullableUtils.return_(tween), currentData], [
			firstTween,
			lastTween
		]]
	}, [[NullableUtils.getEmpty(), data[0]], [NullableUtils.getEmpty<tween>(), NullableUtils.getEmpty<tween>()]])


	lastTween.onComplete(() => {
		firstTween.start()
	})

	return [state, allTweens]
}
