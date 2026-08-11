import { List, Map } from "immutable"
import { needToPlayData, sound, state } from "../type/StateType"
import { getIsDebug, getSoundState, setSoundState } from "../state/State"
import { isNullable } from "../utils/NullableUtils"
import { getResource } from "../Loader"
import { requireCheck, test } from "../utils/Contract"
import { between } from "../utils/NumberUtils"
import { removeDuplicateItemsWithBuildKeyFunc } from "../utils/ArrayUtils"
import { NullableUtils, NumberUtils } from "../Main"
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

export let buildNeedToPlaySoundData = (resourceId, isDebug, volume, isLoop = false) => {
	requireCheck(() => {
		test("volume should in [0,1]", () => {
			return between(volume, 0, 1)
		})
	}, isDebug)

	return {
		resourceId,
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
		}, lastPlayTimeMap.get(value.resourceId)),
		true
	)
}

export let addNeedToPlaySound = (state: state, data: needToPlayData) => {
	let { needToPlayList, lastPlayTimeMap } = getSoundState(state)

	if (!_isCanPlay(data, lastPlayTimeMap)) {
		return state
	}

	if (isNullable(needToPlayList.find((value) => {
		return value.resourceId == data.resourceId
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
	let [sound, id] = getResource<[Howl, number]>(state, data.resourceId)

	sound.volume(NumberUtils.clamp(data.volume, 0, 1))

	// if (data.isLoop && sound.playing() || data.volume < 0.01) {
	if (data.isLoop && sound.playing()) {
		return state
	}

	// Console.warn(data.resourceId, data.volume);

	// sound.volume(data.volume)
	// sound.volume(data.volume, id)

	// Howler.volume(data.volume)

	sound.play()

	if (data.isLoop) {
		sound.loop(true)
	}

	if (getSoundState(state).lastPlayTimeMap.size >= 30) {
		state = setSoundState(state, {
			...getSoundState(state),
			lastPlayTimeMap: Map()
		})
	}
	else {
		state = setSoundState(state, {
			...getSoundState(state),
			lastPlayTimeMap: getSoundState(state).lastPlayTimeMap.set(data.resourceId, performance.now())
		})
	}

	return state
}


export let update = (state: state) => {
	let { needToPlayList } = getSoundState(state)

	// isPlayingList = needToPlayList.reduce((isPlayingList, data) => {
	// 	if (isPlayingList.includes(data.resourceId)) {
	// 		return isPlayingList
	// 	}


	// 	let [sound, id] = Loader.getResource<[Howl, number]>(abstractState, data.resourceId)
	// 	sound.play()
	// 	sound.volume(data.volume)

	// 	sound.on("stop", id => {

	// 	})

	// 	return isPlayingList.push(data.resourceId)
	// }, isPlayingList)


	// Console.warn(
	// 	removeDuplicateItemsWithBuildKeyFunc(needToPlayList.toArray(), data => {
	// 		return data.resourceId
	// 	}).length
	// );


	state = removeDuplicateItemsWithBuildKeyFunc(needToPlayList.toArray(), data => {
		return data.resourceId
	}).sort((a, b) => {
		return b.volume - a.volume
	}).slice(0, isMobile() ? 3 : 5).reduce((state, data) => {
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
	// 	return stop(state, data.resourceId)
	// }, state)

	return setSoundState(state, createState())
}
