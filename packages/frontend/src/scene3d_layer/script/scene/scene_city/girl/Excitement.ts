import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { getGirlState, getName, getValue, setGirlScale, setGirlState } from "./Girl"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { getScale } from "./Utils"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { getGiantessStatusUpdateEventName } from "../../../../utils/EventUtils"
import { excitement } from "../data/DataType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getBody } from "../data/mmd/MMDData"

let _getExcitement = (state: state) => {
	let value = getGirlState(state).excitement

	return ensureCheck(
		value,
		(value) => {
			test("should >= 0 && <= 100", () => {
				return NumberUtils.between(value, 0, getValue(state).maxExcitement)
			})
		}, getIsDebug(state))
}

export let setExcitement = (state: state, value) => {
	let isStatusChange = _getExcitement(state) != value

	return setGirlState(state, {
		...getGirlState(state),
		excitement: value,
		needUpdateStatus: isStatusChange ? NullableUtils.return_({
			damagePart: getBody()
		}) : getGirlState(state).needUpdateStatus
	})
}

export let addExcitement = (state: state, value: excitement) => {
	let excitement = _getExcitement(state)

	let { maxExcitement, excitementIncreaseFactor } = getValue(state)

	// let addedValue = 0
	// if (excitement <= 5) {
	// 	addedValue = value
	// }
	// // else if (excitement <= 30) {
	// else if (excitement <= 20) {
	// 	// addedValue = value / 1.5
	// 	// addedValue = value / 2
	// 	addedValue = value / 4
	// }
	// // else if (excitement <= 50) {
	// else if (excitement <= 40) {
	// 	// addedValue = value / 3
	// 	// addedValue = value / 4
	// 	addedValue = value / 6
	// }
	// else {
	// 	// addedValue = value / 6
	// 	addedValue = value / 10
	// }

	let addedValue = 0
	if (excitement <= 5) {
		addedValue = value
	}
	else if (excitement <= 20) {
		addedValue = value / 1.5
	}
	else if (excitement <= 40) {
		addedValue = value / 3
	}
	else {
		addedValue = value / 6
	}


	addedValue *= excitementIncreaseFactor

	if (addedValue > 0) {
		state = setExcitement(state, Math.min(excitement + addedValue, maxExcitement))
	}

	return state
}


export let isExcitementEnough = (state: state, value: excitement) => {
	return _getExcitement(state) >= value
}

export let isZeroExcitement = (state: state) => {
	return _getExcitement(state) <= 0
}

export let subExcitement = (state: state, value: excitement) => {
	let excitement = _getExcitement(state)

	return setExcitement(state, Math.max(excitement - value, 0))
}

// export let updateByExcitement = (state: state) => {
// 	let excitement = _getExcitement(state)
// 	let { lastUpdatedExcitement } = getGirlState(state)

// 	if (excitement != lastUpdatedExcitement) {
// 		state = setGirlScale(state, NumberUtils.clamp(getScale(state) + (excitement - lastUpdatedExcitement) * getValue(state).scaleFactorWithExcitement, getValue(state).minScale, getValue(state).maxScale
// 		))

// 		state = setGirlState(state, {
// 			...getGirlState(state),
// 			lastUpdatedExcitement: excitement
// 		})
// 	}

// 	return state
// }