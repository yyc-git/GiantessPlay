import { Camera } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { useThirdPersonControls, getShowDialogueSoundResourceId, setCameraType, useCurrentCameraWhenEnterScene, useCamera, useNoCameraControl } from "../CityScene"
import { Euler, Quaternion, Vector3 } from "three"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getCurrentCamera, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { command, objectStateName } from "../type/StateType"
import { markEnter } from "./ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { buildShowDialogueEventData, getExitScenarioEventName, getMarkFinishEventName, getShowDialogueEventName } from "../../../../utils/EventUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getSingleClickForTempEventName } from "meta3d-jiehuo-abstract/src/Event"
import { Device } from "meta3d-jiehuo-abstract"
import { showGirl as showGirl_, disablePhysics, enablePhysics, getGirl, getGirlState, setGirlState, getInitialEulerForTweenToFaceNegativeX, hideGirl, restorePhysics } from "../girl/Girl"
import { setPivotWorldPositionAndUpdateBox, setGirlRotation } from "../girl/Utils"
// import { objectStateName } from "../data/DataType"
import { playAnimationLoop, playAnimationOnlyOnce, restore } from "../girl/Animation"
import { MMD } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { animationName } from "../data/DataType"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { buildMultipleTweens, computeEuler } from "../utils/MoveUtils"
import { hideCanvas, showCanvas } from "../../../../../ui_layer/utils/CanvasUtils"
import { getDefaultCameraType } from "../Camera"
import { command as commandData } from "../data/ScenarioData"
import { Console } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getCustomData, setCustomData } from "../game_event/GameEvent"
import { getScenarioVolume } from "../utils/SoundUtils"
import { isEnablePhysics } from "../utils/MMDUtils"
import * as CommandUtils from "../utils/CommandUtils"

const _q1 = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

// type position = [number, number, number]

// type target = [number, number, number]

// type cameraMoveData<Point> = Array<{
// 	time: number,
// 	// points: Array<Point>
// 	point: Point
// }>

// type cameraMoveData = {
// 	positionData: cameraMoveData<[number, number, number]>,
// 	targetData: cameraMoveData<[number, number, number]>,
// }
type cameraMoveData = Array<{
	time: number,
	position: [number, number, number],
	target: [number, number, number],
}>

type sayData = {
	name: string,
	contents: Array<{
		content: string,
		soundId?: string
	}>,
	time: number,
	isInMiddle?: boolean,
}

type walkData = Array<{
	time: number,
	position: [number, number],
	// quaternion: [number, number, number, number],
	// euler: [number, number, number],
}>

type animationData = {
	name: animationName,
	isLoop?: boolean,
	noBlend?: boolean,
}


// export let useNoCameraControl: command<null> = (state: state, data) => {
// 	let abstractState = Camera.removeCurrentControls(getAbstractState(state))

// 	state = setAbstractState(state, abstractState)

// 	state = setCameraType(state, cameraType.No)

// 	return Promise.resolve(state)
// }


export let getCommand = (command_: commandData) => {
	switch (command_) {
		case commandData.enterScenario:
			return enterScenario
		case commandData.moveCamera:
			return moveCamera
		case commandData.walkToPosition:
			return walkToPosition
		case commandData.stop:
			return stop
		case commandData.playGirlAnimation:
			return playGirlAnimation
		// case commandData.showGirl:
		// 	return showGirl
		case commandData.initGirl:
			return initGirl
		case commandData.say:
			return say
		case commandData.exitScenario:
			return exitScenario
		// case commandData.blackScreen:
		// 	return blackScreen
		default:
			throw new Error("unknown commandData")
	}
}



// let _useNoCameraControl = (state: state) => {
// 	let abstractState = Camera.removeCurrentControls(getAbstractState(state))

// 	state = setAbstractState(state, abstractState)

// 	state = setCameraType(state, cameraType.No)

// 	// return Promise.resolve(state)
// 	return state
// }

export let enterScenario: command<null> = (state: state, _, data) => {
	state = enablePhysics(state)

	if (Camera.isCanLock(getAbstractState(state))) {
		// getOrbitControls(getAbstractState(state)).unlock()
		state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
	}

	getOrbitControls(getAbstractState(state)).enabled = false

	return markEnter(state, true).then(state => {
		state = useNoCameraControl(state)

		if (Device.isMobile()) {
			CameraControls.hideZoneDom()
		}

		return state
	})
}

export let exitScenario: command<null> = CommandUtils.exitScenario(animationName.Idle)

// export let blackScreen: command<number> = (state: state, _, data) => {
// 	hideCanvas()

// 	return Event.trigger(state, getAbstractState, getBlackScreenStartEventName(), null).then(state => {
// 		Console.log(data)
// 		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 			Console.log("show")
// 			showCanvas()

// 			return Event.trigger(state, getAbstractState, getBlackScreenStopEventName(), null)
// 			// }, Flow.convertTimeToLoopCount(getAbstractState(state), data)))
// 		}, data))

// 		// setTimeout(() => {
// 		// Console.log("show")
// 		// 	showCanvas()

// 		// 	return Event.trigger(readState(), getAbstractState, getBlackScreenStopEventName(), null).then(writeState)
// 		// }, data)

// 		// return state
// 	})
// }

export let useCameraControl: command<null> = (state: state, _, data) => {
	return Promise.resolve(useCamera(state, getDefaultCameraType()))
}

let _handleTweenComplete = (state: state, onCompleteFunc, tween: tween, allTweens: Array<tween>) => {
	if (NullableUtils.isNullable(onCompleteFunc)) {
		return
	}

	tween.onComplete(() => {
		ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

		return NullableUtils.getExn(onCompleteFunc)(readState()).then(writeState)
	})
}

let _updateCamera = (state: state, position, target) => {
	let camera = getCurrentCamera(getAbstractState(state))

	let [x1, y1, z1] = position

	camera.position.set(x1, y1, z1)

	let [x2, y2, z2] = target

	camera.lookAt(x2, y2, z2)

	return state
}

// export let moveCamera: command<cameraMoveData> = (state: state, onCompleteFunc, cameraMoveData: cameraMoveData) => {
export let moveCamera: command<cameraMoveData> = (state: state, onCompleteFunc, cameraMoveData) => {
	requireCheck(() => {
		test("length should >= 1", () => {
			// return positionData.length == targetData.length
			return cameraMoveData.length >= 1
		})
	}, getIsDebug(state))

	let d = buildMultipleTweens(state, [(state, object, currentData) => {
		return _updateCamera(state, object.position, object.target)
	}, data => {
		return {
			position: data.position,
			target: data.target
		}
	}, (state, _p, _n) => {
		return state
	}, (_, currentData) => {
		return currentData.time
	}], cameraMoveData)
	state = d[0]
	let lastTween = d[1]
	let allTweens = d[2]

	return NullableUtils.getWithDefault(
		NullableUtils.map(lastTween => {
			_handleTweenComplete(state, onCompleteFunc, lastTween, allTweens)

			return Promise.resolve(state)
		}, lastTween),
		Promise.resolve(state)
	)
}

export let say: command<sayData> = (state: state, onCompleteFunc, data) => {
	requireCheck(() => {
		test("too long", () => {
			return data.contents.reduce((result, content) => {
				if (!result) {
					return false
				}

				return Device.isMobile() ? content.content.length < 60 : content.content.length < 100
			}, true)
		})
	}, getIsDebug(state))

	let isInMiddle = NullableUtils.getWithDefault(
		data.isInMiddle,
		false
	)

	let c = NumberUtils.randomSelect(data.contents)
	let content = c.content

	state = NullableUtils.getWithDefault(
		NullableUtils.map(soundId => {
			return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), getScenarioVolume(state))
			))
		}, c.soundId),
		state
	)

	let object = {
		playedLength: 0
	}
	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to({
			playedLength: content.length
		}, data.time)
		.onUpdate(() => {
			if (object.playedLength < 1) {
				return Promise.resolve()
			}

			let state = readState()

			return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData(data.name, content.slice(0, Math.floor(object.playedLength)), isInMiddle)).then(writeState)
		})
		.onComplete(() => {
			let state = readState()

			return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData(data.name, `${content}...点击继续`, isInMiddle)).then(state => {
				let abstractState = Event.on(getAbstractState(state), getSingleClickForTempEventName(),
					(state: state, { userData }) => {
						state = setAbstractState(state, Event.offAll(getAbstractState(state), getSingleClickForTempEventName())
						)

						return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData("", "", isInMiddle)).then(state => {
							// resolve(state)
							return onCompleteFunc(state)

							// return state
						})
					}
				)

				writeState(setAbstractState(state, abstractState))

				return
			})
		})

	ArticluatedAnimation.addTween(getAbstractState(state), tween)

	tween.start()


	// writeState(state)
	return Promise.resolve(state)
}

export let realtimeSay: command<sayData> = (state: state, onCompleteFunc, data) => {
	requireCheck(() => {
		test("too long", () => {
			return data.contents.reduce((result, content) => {
				if (!result) {
					return false
				}

				return Device.isMobile() ? content.content.length < 60 : content.content.length < 100
			}, true)
		})
	}, getIsDebug(state))

	let isInMiddle = NullableUtils.getWithDefault(
		data.isInMiddle,
		false
	)

	let c = NumberUtils.randomSelect(data.contents)
	let content = c.content

	state = NullableUtils.getWithDefault(
		NullableUtils.map(soundId => {
			return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), getScenarioVolume(state))
			))
		}, c.soundId),
		state
	)


	let object = {
		playedLength: 0
	}
	let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to({
			playedLength: content.length
		}, data.time)
		.onUpdate(() => {
			if (object.playedLength < 1) {
				return Promise.resolve()
			}

			let state = readState()

			return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData(data.name, content.slice(0, Math.floor(object.playedLength)), isInMiddle)).then(writeState)
		})
		.onComplete(() => {
			let state = readState()

			let abstractState = Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
				return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData("", "", isInMiddle))
			}, data.time / 1000)

			writeState(setAbstractState(state, abstractState))
		})

	ArticluatedAnimation.addTween(getAbstractState(state), tween)

	tween.start()


	// writeState(state)
	return Promise.resolve(state)
}


// export let showGirl: command<number> = (state: state, onCompleteFunc, data) => {
// 	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		Console.log("next")
// 		return showGirl_(state).then(onCompleteFunc)
// 		// return onCompleteFunc(state)
// 	}, data))

// 		Console.log("show girl")
// 	return Promise.resolve(state)
// 	// return showGirl_(state)
// }


export let initGirl: command<number> = (state: state, onCompleteFunc, data) => {
	state = hideGirl(state)

	state = _updateWalk(state, data)

	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		return showGirl_(state).then(onCompleteFunc)
	}, 20))

	return Promise.resolve(state)
}


// export let wait: command<number> = (state: state, onCompleteFunc, data) => {
// 	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		return onCompleteFunc(state)
// 	}, data))

// 	return Promise.resolve(state)
// }

let _updateWalk = (state: state, position) => {
	let [x1, z1] = position

	state = setPivotWorldPositionAndUpdateBox(state, _v1.set(x1, 0, z1))

	// return NullableUtils.getWithDefault(NullableUtils.map(euler => {
	// 	let [x2, y2, z2] = euler
	// 	return setGirlRotation(state, _q1.setFromEuler(new Euler(x2, y2, z2)))
	// }, euler), state)

	return state
}

// let _playGirlAnimation = (state: state, objectStateName) => {
// 	return setGirlState(state, {
// 		...getGirlState(state),
// 		currentAnimationName: objectStateName
// 	})
// }

let _handleTweenComplete2 = (state: state, onCompleteFunc, onBeforeCompleteFunc, tween: tween, allTweens: Array<tween>) => {
	tween.onComplete(() => {
		ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

		return onBeforeCompleteFunc(readState()).then(state => {
			if (!NullableUtils.isNullable(onCompleteFunc)) {
				return NullableUtils.getExn(onCompleteFunc)(state).then(writeState)
			}

			writeState(state)
		})
	})
}

export let walkToPosition: command<walkData> = (state: state, onCompleteFunc, data) => {
	requireCheck(() => {
		test("length should >= 1", () => {
			return data.length >= 1
		})
	}, getIsDebug(state))

	let initialEulerForTween = getInitialEulerForTweenToFaceNegativeX()

	let d = buildMultipleTweens(state, [(state, object, currentData) => {
		return _updateWalk(state, object.position)
	}, data => {
		return {
			position: data.position
		}
	}, (state, previousData, nextData) => {
		return NullableUtils.getWithDefault(NullableUtils.map(euler => {
			return setGirlRotation(state, _q1.setFromEuler(euler))
		}, computeEuler(previousData.position, nextData.position, initialEulerForTween)), state)
	}, (_, currentData) => {
		return currentData.time
	}], data)
	state = d[0]
	let lastTween = d[1]
	let allTweens = d[2]

	return NullableUtils.getWithDefault(
		NullableUtils.map(lastTween => {
			state = playAnimationLoop(state, animationName.Walk, false)


			_handleTweenComplete2(state, onCompleteFunc, state => {
				return Promise.resolve(playAnimationLoop(state, animationName.Idle, false))
			}, lastTween, allTweens)

			return Promise.resolve(state)
		}, lastTween),
		Promise.resolve(state)
	)
}

export let stop: command<null> = (state: state, onCompleteFunc, data) => {
	// requireCheck(() => {
	// 	test("length should >= 1", () => {
	// 		return data.length >= 1
	// 	})
	// }, getIsDebug(state))

	state = playAnimationLoop(state, animationName.Idle, false)

	return Promise.resolve(state)
}

export let playGirlAnimation: command<animationData> = (state: state, onCompleteFunc, data) => {
	let isLoop = NullableUtils.getWithDefault(data.isLoop, false)
	let noBlend = NullableUtils.getWithDefault(data.noBlend, false)

	if (isLoop) {
		state = playAnimationLoop(state, data.name, noBlend)
	}
	else {
		state = playAnimationOnlyOnce(state, data.name, noBlend)
	}

	return Promise.resolve(state)
}

let _getFinishKey = () => "finish"

export let isFinish = (state: state) => {
	return NullableUtils.getWithDefault(
		getCustomData<boolean>(state, _getFinishKey()),
		true
	)
}

export let setIsFinish = (state: state, value) => {
	return setCustomData(state, _getFinishKey(), value)
}

export let markBegin: command<null> = (state: state, onCompleteFunc, data) => {
	state = setIsFinish(state, false)

	return Promise.resolve(state)
}

export let markFinish: command<nullable<string>> = (state: state, onCompleteFunc, data) => {
	state = setIsFinish(state, true)

	return Event.trigger(state, getAbstractState, getMarkFinishEventName(), data)
}