import { Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { getGirlScale, isGiantessCharacterType, isLittleCharacterType } from "../CityScene"
import { getGirlHeadPosition, getGirlPosition, getPivotWorldPosition, isBigGiantess, isMiddleGiantess, isMiddleGiantessOrBiggerByScale, isSmallGiantess } from "../girl/Utils"
import { clamp } from "meta3d-jiehuo-abstract/src/utils/NumberUtils"
import { getValue } from "../girl/Girl"
import { getCameraPosition } from "../Camera"
import { getPosition } from "../little_man/Transform"
import { getIsDebug } from "../../Scene"
import { getSoundSetting } from "../../../../mod/SettingMod"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../business_layer/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { usedGirlEnum } from "../type/StateType"

export let getVolume = (state: state, volume: number, objectPosition: Vector3, min, distanceFactor = 0.025, max = 1) => {
	// return clamp(volume / getGirlHeadPosition(state).distanceTo(objectPosition), min, 1)
	// return clamp(volume / getCameraPosition(state).distanceTo(objectPosition), min, 1)

	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}


	let pos
	if (isGiantessCharacterType(state)) {
		pos = getPivotWorldPosition(state, usedGirlEnum.PlayerGirl)
	}
	else {
		/*! fix for eat volumn
		* 
		// pos = getPosition(state)
		*/
		pos = getCameraPosition(state)
	}

	volume *= getSoundSetting(state).sceneSoundLevel

	// return clamp(volume / NumberUtils.greaterThan(pos.distanceTo(objectPosition) * distanceFactor, 1), min, 1)
	return clamp(volume / NumberUtils.greaterThan(pos.distanceTo(objectPosition) * distanceFactor, 1), min, max)
}

// export let getVolumeByScale = (state: state, volume: number, min = 0.1) => {
// 	// return clamp(volume / (Math.sqrt(getGirlScale(state, usedGirl) * 2)), 0, 1)
// 	return clamp(volume / (getGirlScale(state, usedGirl) / 2), min, 1)
// }

// let _getVolumeForMiddleAndBigGiantess = (state: state) => {
// 	return clamp(getValue(state).volumeFactorForMiddleOrBigGiantess * getGirlScale(state, usedGirl), 0.07, 0.3)
// }

// let _getVolumeForSmallGiantess = (state: state) => {
// 	return clamp(getValue(state).volumeFactorForSmallGiantess * getGirlScale(state, usedGirl), 0.03, 0.1)
// }

// export let getGirlVolume = (state: state, position, volume = 0.2) => {
export let getGirlVolume = (state: state, usedGirl, position, volume = 0.05) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	// let volume
	// // if (getGirlScale(state, usedGirl) >= getValue(state).minScaleAsSmallGiantess) {
	// // if (!isSmallGiantess(state)) {
	// if (isMiddleGiantess(state, usedGirl) || isBigGiantess(state, usedGirl)) {
	// 	volume = _getVolumeForMiddleAndBigGiantess(state)
	// }
	// else {
	// 	volume = _getVolumeForSmallGiantess(state)
	// }

	// // if (isLittleCharacterType(state)) {
	// // 	return getVolume(state, volume, pos, 0.01)
	// // }

	// return volume * getSoundSetting(state).sceneSoundLevel


	// return getVolume(state, volume * clamp(Math.sqrt(getGirlScale(state, usedGirl)) / 2, 0.8, 15), position, 0.01, 0.01, 1)
	return getVolume(state, volume * clamp(Math.sqrt(getGirlScale(state, usedGirl)) / 5, 0.8, 8), position, 0.01, 0.01, 0.4)
}


// export let getEliteGiantessVolume = (state: state, volume, pos: Vector3, scale: number, min) => {
// 	let factor
// 	// if (isMiddleGiantessOrBiggerByScale(scale)) {
// 	// 	factor = clamp(Math.sqrt(scale), 1, 5)
// 	// }
// 	// else {
// 	// 	factor = clamp(Math.sqrt(scale), 1, 3)
// 	// }
// 	factor = clamp(Math.sqrt(scale), 1, 5)
// 	volume *= factor

// 	return getVolume(state, volume, pos, min)
// }



export let getLittleManVolume = (state: state, position: Vector3) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return getVolume(state, 0.2, position, 0.01)
}

export let getSystemVolume = (state: state, volume = 0.2) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	// return getVolume(state, 0.2, getCameraPosition(state), 0.1)

	return volume * getSoundSetting(state).sceneSoundLevel
}

export let getOriginSystemVolume = (state: state) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return 1 * getSoundSetting(state).sceneSoundLevel
}


export let getScenarioVolume = (state: state) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return 0
	}

	return 1 * getSoundSetting(state).sceneSoundLevel
}


export let playGiantessVoice = (state: state, usedGirl, id, volume = getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl))) => {
	return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
		SoundManager.buildNeedToPlaySoundData(id, getIsDebug(state),
			getGiantessVolume(state, usedGirl, true, volume)
		)
	))
}

export let getGiantessVolume = (state: state, usedGirl, isVoice = true, volume = getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl))) => {
	if (isVoice) {
		return volume * getSoundSetting(state).giantessSaySoundLevel
	}

	return volume
}