import { Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { getGirlScale, isGiantessRoad, isLittleRoad } from "../CityScene"
import { getGirlHeadPosition, getGirlPosition, getPivotWorldPosition } from "../girl/Utils"
import { clamp } from "meta3d-jiehuo-abstract/src/utils/NumberUtils"
import { getName, getValue } from "../girl/Girl"
import { getCameraPosition } from "../Camera"
import { getPosition } from "../little_man/Transform"
import { getIsDebug } from "../../Scene"

export let getVolume = (state: state, volume: number, objectPosition: Vector3, min) => {
	// return clamp(volume / getGirlHeadPosition(state).distanceTo(objectPosition), min, 1)
	// return clamp(volume / getCameraPosition(state).distanceTo(objectPosition), min, 1)

	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}


	let pos
	if (isGiantessRoad(state)) {
		pos = getPivotWorldPosition(state)
	}
	else {
		/*! fix for eat volumn
		* 
		// pos = getPosition(state)
		*/
		pos = getCameraPosition(state)
	}


	return clamp(volume / (Math.max(pos.distanceTo(objectPosition) * 0.05, 1)), min, 1)
}

// export let getVolumeByScale = (state: state, volume: number, min = 0.1) => {
// 	// return clamp(volume / (Math.sqrt(getGirlScale(state) * 2)), 0, 1)
// 	return clamp(volume / (getGirlScale(state) / 2), min, 1)
// }

let _getVolumeForGiantess = (state: state) => {
	return clamp(getValue(state).volumeFactorForGiantess * getGirlScale(state), 0.07, 0.3)
}

let _getVolumeForNotGiantess = (state: state) => {
	return clamp(getValue(state).volumeFactorForNotGiantess * getGirlScale(state), 0.03, 0.1)
}

export let getGirlVolume = (state: state, pos = getPivotWorldPosition(state)) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	let volume
	if (getGirlScale(state) >= getValue(state).minScaleAsSmallGiantess) {
		volume = _getVolumeForGiantess(state)
	}
	else {
		volume = _getVolumeForNotGiantess(state)
	}

	if (isLittleRoad(state)) {
		return getVolume(state, volume, pos, 0.01)
	}

	return volume
}

export let getLittleManVolume = (state: state, position: Vector3) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return getVolume(state, 0.2, position, 0.01)
}

export let getSystemVolume = (state: state) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return getVolume(state, 0.2, getCameraPosition(state), 0.1)
}

export let getScenarioVolume = (state: state) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return 1
}
