import * as SoundManager from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { state } from "../scene3d_layer/type/StateType";
import { getAbstractState, setAbstractState } from "./State";
import { getIndexSoundResourceId } from "./Loader";

export let addNeedToPlaySound = (state: state, data) => {
	return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), data))
}

export let stopIndexSounds = (state: state) => {
	return setAbstractState(state, SoundManager.stop(getAbstractState(state), getIndexSoundResourceId()))
}

export let play = (state: state, data) => {
	SoundManager.play(getAbstractState(state), data)
}