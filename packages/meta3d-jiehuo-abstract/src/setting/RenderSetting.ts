import { isMac, isMobile, isIOS } from "../Device"
import { getRenderSettingState, setRenderSettingState } from "../state/State"
import { crowdSize, hdLevel, physicsLevel, renderSetting, renderAccuracyLevel, shadowLevel, state } from "../type/StateType"

export let createState = (): renderSetting => {
	return {
		// hd: isMobile() ? hdLevel.Middle : hdLevel.High,
		hd: hdLevel.High,
		shadow: isMobile() ? shadowLevel.Middle : shadowLevel.High,
		// renderAccuracy: renderAccuracyLevel.Middle,
		renderAccuracy: isMobile() ? renderAccuracyLevel.Middle : renderAccuracyLevel.High,
		isShowBlood: false,
		// isShowBlood: true,
		// crowdSize: isMobile() ? (
		// 	isIOS() ? crowdSize.Middle : crowdSize.Small
		// ) : crowdSize.Big
		crowdSize: isMobile() ? crowdSize.Middle : crowdSize.Big,
		physics: isMobile() ? physicsLevel.Middle : physicsLevel.High,
	}
}

export let getRenderSetting = (state: state) => {
	return getRenderSettingState(state)
}

export let setHD = (state, value) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		hd: value
	})
}

export let setShadow = (state, value) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		shadow: value
	})
}

export let setRenderAccuracy = (state, renderAccuracy) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		renderAccuracy
	})
}

export let setIsShowBlood = (state, isShowBlood) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		isShowBlood
	})
}

export let setCrowdSize = (state, value) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		crowdSize: value
	})
}

export let setPhysics = (state, value) => {
	return setRenderSettingState(state, {
		...getRenderSettingState(state),
		physics: value
	})
}