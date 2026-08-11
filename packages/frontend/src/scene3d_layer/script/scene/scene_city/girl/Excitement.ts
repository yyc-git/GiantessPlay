import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { getValue, setUsedGirlData, getUsedGirlData, getValueByUsedGirl, isUseGirl, setNeedUpdateStatusDamagePart, isPlayerGirl } from "./Girl"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { getScale } from "./Utils"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { getGiantessStatusUpdateEventName } from "../../../../utils/EventUtils"
import { excitement, skillExcitement } from "../data/DataType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getBody } from "../data/mmd/MMDData"
import { getNow } from "../Time"
import { computeEnhenceValueByCarryLevel, getEnhenceByCarryLevel } from "../build/Career"
import { isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl } from "../CityScene"

let _getExcitement = (state: state, usedGirl) => {
	let value = getUsedGirlData(state, usedGirl).excitement

	return ensureCheck(
		value,
		(value) => {
			test("should >= 0 && <= 100", () => {
				return NumberUtils.between(value, 0, getValueByUsedGirl(state, usedGirl).maxExcitement)
			})
		}, getIsDebug(state))
}

export let setExcitementByUsedGirl = (state: state, value, usedGirl) => {
	// let isStatusChange = _getExcitement(state, usedGirl) != value

	state = setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		excitement: value,
		// needUpdateStatus: isStatusChange ? NullableUtils.return_({
		// 	damagePart: getBody()
		// }) : getUsedGirlData(state, usedGirl).needUpdateStatus
	})

	// if (isStatusChange) {
	// 	state = setNeedUpdateStatusDamagePart(state, getBody())
	// }

	return state
}

export let setExcitement = (state: state, usedGirl, value) => {
	return setExcitementByUsedGirl(state, value, usedGirl)
}

let _getLastAddExcitementTime = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).lastAddExcitementTime
}

let _setLastAddExcitementTime = (state: state, usedGirl, value) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		lastAddExcitementTime: NullableUtils.return_(value)
	})
}

export let addExcitementDirectly = (state: state, usedGirl, value: excitement | skillExcitement) => {
	let excitement = _getExcitement(state, usedGirl)

	let { maxExcitement } = getValue(state, usedGirl)

	if (value > 0) {
		state = setExcitement(state, usedGirl, Math.min(excitement + value, maxExcitement))
		state = _setLastAddExcitementTime(state, usedGirl, getNow(state) / 1000)
	}

	return state
}

export let addExcitement = (state: state, usedGirl, value: excitement | skillExcitement) => {
	let excitement = _getExcitement(state, usedGirl)

	let { excitementIncreaseFactor } = getValue(state, usedGirl)

	if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
		excitementIncreaseFactor *= 1 + computeEnhenceValueByCarryLevel(state, usedGirl, 5, 2)
	}

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

	return addExcitementDirectly(state, usedGirl, addedValue)
}


export let isExcitementEnough = (state: state, usedGirl, value: excitement | skillExcitement) => {
	return _getExcitement(state, usedGirl) >= value
}

export let isZeroExcitement = (state: state, usedGirl) => {
	return _getExcitement(state, usedGirl) <= 0
}

export let subExcitement = (state: state, usedGirl, value: excitement | skillExcitement) => {
	if (getIsDebug(state)) {
		return state
	}

	let excitement = _getExcitement(state, usedGirl)

	return setExcitement(state, usedGirl, NumberUtils.greaterThan(excitement - value, 0))
}

// export let updateByExcitement = (state: state) => {
// 	let excitement = _getExcitement(state, usedGirl)
// 	let { lastUpdatedExcitement } = getUsedGirlData(state, usedGirl)

// 	if (excitement != lastUpdatedExcitement) {
// 		state = setGirlScale(state, NumberUtils.clamp(getScale(state, usedGirl) + (excitement - lastUpdatedExcitement) * getValue(state).scaleFactorWithExcitement, getValue(state).scaleIncrease, getMaxScale(state, getValue(state))
// 		))

// 		state = setUsedGirlData(state, usedGirl,{
// 			...getUsedGirlData(state, usedGirl),
// 			lastUpdatedExcitement: excitement
// 		})
// 	}

// 	return state
// }

export let update = (state: state, usedGirl) => {
	let now = getNow(state) / 1000
	if (
		isUseGirl(state, usedGirl)
		&&
		now - NullableUtils.getWithDefault(
			_getLastAddExcitementTime(state, usedGirl),
			0
		) >= 20) {
		state = _setLastAddExcitementTime(state, usedGirl, now)
		state = subExcitement(state, usedGirl, excitement.High)

		return state
	}

	return state
}