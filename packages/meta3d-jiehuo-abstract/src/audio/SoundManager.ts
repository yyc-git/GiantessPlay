import { List, Map } from "immutable"
import { needToPlayData, sound, state } from "../type/StateType"
import { getSoundState, setSoundState } from "../state/State"
import { isNullable } from "../utils/NullableUtils"
import { getResource } from "../Loader"
import { requireCheck, test } from "../utils/Contract"
import { between } from "../utils/NumberUtils"
import { removeDuplicateItemsWithBuildKeyFunc } from "../utils/ArrayUtils"
import { NullableUtils } from "../Main"
import { isMobile } from "../Device"
// import { needToPlayData, sound } from "./type/StateType"
// import { getSoundState, setSoundState } from "./CityScene"
// import { state } from "../../../type/StateType"
// import {  from "meta3d-jiehuo-abstract"
// import { Loader } from "meta3d-jiehuo-abstract"
// import { getAbstractState } from "../../../state/State"

export let createState = (): sound => {
	return {
		needToPlayList: List(),
		lastPlayTimeMap: Map(),
		// isPlayingList: List()
	}
}

export let buildNeedToPlaySoundData = (resouceId, isDebug, volume, isLoop = false) => {
	requireCheck(() => {
		test("volume should in [0,1]", () => {
			return between(volume, 0, 1)
		})
	}, isDebug)

	return {
		resouceId,
		volume,
		isLoop
	}
}

let _getAllowPlayInterval = () => isMobile() ? 500 : 50

let _isCanPlay = (value: needToPlayData, lastPlayTimeMap) => {
	let now = performance.now()
	let allowPlayInterval = _getAllowPlayInterval()

	return NullableUtils.getWithDefault(
		NullableUtils.map(lastPlayTime => {
			return now - lastPlayTime > allowPlayInterval
		}, lastPlayTimeMap.get(value.resouceId)),
		true
	)
}

export let addNeedToPlaySound = (state: state, data: needToPlayData) => {
	let { needToPlayList, lastPlayTimeMap } = getSoundState(state)

	if (!_isCanPlay(data, lastPlayTimeMap)) {
		return state
	}

	if (isNullable(needToPlayList.find((value) => {
		return value.resouceId == data.resouceId
	}))) {
		needToPlayList = needToPlayList.push(data)
	}
	// needToPlayList = needToPlayList.push(data)

	return setSoundState(state, {
		...getSoundState(state),
		needToPlayList
	})
}

export let play = (state: state, data) => {

	let [sound, id] = getResource<[Howl, number]>(state, data.resouceId)

	if (data.isLoop && sound.playing() || data.volume < 0.01) {
		return state
	}

	// Console.warn(data.resouceId, data.volume);

	sound.volume(data.volume)
	// sound.volume(data.volume, id)

	// Howler.volume(data.volume)

	sound.play()

	if (data.isLoop) {
		sound.loop(true)
	}

	state = setSoundState(state, {
		...getSoundState(state),
		lastPlayTimeMap: getSoundState(state).lastPlayTimeMap.set(data.resouceId, performance.now())
	})

	return state
}


export let update = (state: state) => {
	let { needToPlayList } = getSoundState(state)

	// isPlayingList = needToPlayList.reduce((isPlayingList, data) => {
	// 	if (isPlayingList.includes(data.resouceId)) {
	// 		return isPlayingList
	// 	}


	// 	let [sound, id] = Loader.getResource<[Howl, number]>(abstractState, data.resouceId)
	// 	sound.play()
	// 	sound.volume(data.volume)

	// 	sound.on("stop", id => {

	// 	})

	// 	return isPlayingList.push(data.resouceId)
	// }, isPlayingList)


	// Console.warn(
	// 	removeDuplicateItemsWithBuildKeyFunc(needToPlayList.toArray(), data => {
	// 		return data.resouceId
	// 	}).length
	// );


	state = removeDuplicateItemsWithBuildKeyFunc(needToPlayList.toArray(), data => {
		return data.resouceId
	}).slice(0, 5).reduce((state, data) => {
		return play(state, data)
	}, state)


	return Promise.resolve(setSoundState(state, {
		...getSoundState(state),
		needToPlayList: List(),
		// isPlayingList
	}))
}

export let stop = (state, id) => {
	let [sound, _] = getResource<[Howl, number]>(state, id)

	sound.stop()

	state = setSoundState(state, {
		...getSoundState(state),
		lastPlayTimeMap: getSoundState(state).lastPlayTimeMap.remove(id)
	})

	return state
}

export let dispose = (state) => {
	// state = getSoundState(state).needToPlayList.reduce((state, data) => {
	// 	return stop(state, data.resouceId)
	// }, state)

	return setSoundState(state, createState())
}
