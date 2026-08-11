import * as SoundManager from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { state } from "../scene3d_layer/type/StateType";
import { getAbstractState, setAbstractState } from "./State";
import { Event } from "meta3d-jiehuo-abstract";
import { buildAPI } from "../scene3d_layer/mod/Mod";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getIsDebug } from "../scene3d_layer/script/scene/Scene";
import { getModAPI } from "../scene3d_layer/script/scene/scene_city/Mod";
// import { getIndexSoundResourceId } from "./Loader";

export let addNeedToPlaySound = (state: state, data) => {
	return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), data))
}

export let stopIndexSounds = (state: state) => {
	// return setAbstractState(state, SoundManager.stop(getAbstractState(state), getIndexSoundResourceId()))
	return Event.trigger(state, getAbstractState, getModAPI(state).event.getStopIndexSoundEventName(), NullableUtils.getEmpty())
}

export let play = (state: state, data) => {
	if (getIsDebug(state) && !state.config.isOpenSound) {
		return state
	}

	return setAbstractState(state, SoundManager.play(getAbstractState(state), data))
}