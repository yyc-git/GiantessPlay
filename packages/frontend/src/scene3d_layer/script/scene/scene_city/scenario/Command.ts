import { Camera } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { useThirdPersonControls, getShowDialogueSoundResourceId, setCameraType, useCamera, useNoCameraControl, setBehaviourTreeData, getGirlScale, isGiantessCharacterType } from "../CityScene"
import { Euler, Quaternion, Vector3 } from "three"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { characterType, tween, usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getCurrentCamera, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { actionNodeFunc, autoDifficulty, behaviourTreeNodeExecuteResult, camp, command, objectStateName } from "../type/StateType"
import { markEnter } from "./ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { buildShowDialogueEventData, getExitScenarioEventName, getMarkFinishEventName, getShowDialogueEventName } from "../../../../utils/EventUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getSingleClickForTempEventName } from "meta3d-jiehuo-abstract/src/Event"
import { Device } from "meta3d-jiehuo-abstract"
import { showGirlAndActiveAllActions as showGirl_, disablePhysics, enablePhysics, getGirl, getInitialEulerForTweenToFaceNegativeX, hideGirl, restorePhysics, setNeedUpdateStatusName, getCurrentMMDCharacterName, getBiggerCount, isUseGirl, getCurrentUsedGirls, getSpecificUsedGirl } from "../girl/Girl"
import { setPivotWorldPositionAndUpdateBox, setGirlRotation, computeHeight, isMiddleGiantess, isBigGiantess } from "../girl/Utils"
// import { objectStateName } from "../data/DataType"
import { isChangeScaling, playAnimationLoop, playAnimationOnlyOnce, restore } from "../girl/Animation"
import { MMD } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { animationName, attackFactor, critRatioFactor } from "../data/DataType"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { buildMultipleTweens, computeEuler } from "../utils/MoveUtils"
import { hideCanvas, showCanvas } from "../../../../../ui_layer/utils/CanvasUtils"
import { getDefaultCameraType } from "../Camera"
import { command as commandData } from "../data/ScenarioData"
import { Console } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getCustomData, setCustomData } from "../game_event/GameEvent"
import { getGiantessVolume, getScenarioVolume } from "../utils/SoundUtils"
import { isEnablePhysics } from "../utils/MMDUtils"
import * as CommandUtils from "../utils/CommandUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getStateMachine } from "../girl/FSMState"
import * as BehaviourTreeManager from "../behaviour_tree/BehaviourTreeManager"
import { hasPickData } from "../girl/PickPoseUtils"
import { isPose } from "../girl/Pose"
import { getCrowdData, setCamp } from "../manage/city1/Army"
import { addWildGiantess } from "../girl/wild/Girl"
import { getPlayerPosition } from "../utils/PlayerUtils"
import { findValidPoints } from "../utils/GeneratorUtils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { addEnemyGiantess } from "../girl/enemy/Girl"
import { generate } from "../director/ArmyDirector"
import { getAutoDifficulty } from "../difficulty/Difficulty"
import { generateArmyInSpecificPosition } from "../manage/city1/generator/utils/ArmyGeneratorUtils"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { emitterLife, emitterSize, emitterSpeed } from "../data/ValueType"
import { buildRandomDirectionInXZ } from "../../../../utils/DirectionUtils"
import { getAllFlattenAliveArmyData } from "../utils/ArmyUtils"
import { computePositionByOffset, getParticleNeedCollisionCheckLoopCount } from "../utils/ArmyUtils2"
import { getNamePrefixShellTurret } from "../manage/city1/milltary_building/MilltaryBuildingUtils"
import { setAttackFactor, setCritRatioFactor } from "../StaticDynamicUnit"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { buffName } from "../data/buff/BuffData"
import { addBuff } from "../buff/Buff"
import { getLevelByCharacter } from "../build/Upgrade"
import { getLanguageTextData, languageKey } from "../../../../internation/Data"
import { buildFuncData } from "../data/FuncData"
import { handleGetCommand } from "../../../../mod/EventGameMod"
import { buildActionNodeForBalance, getBalanceBlockService } from "../../../../mod/BehaviourMod"
import { getModAPI } from "../Mod"
import { api } from "type-api/src/Type"
import { selectLittleMan, selectRandomNearBuilding } from "../behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { getMMDName } from "../../../../mod/MMDMod"
// import { getNearestUsedGirl } from "../utils/CollisionUtils"
// import { getNow } from "../Time"
// import { getHardBlockService } from "../../../../mod/BuffMod"
// import { selectTarget } from "../behaviour_tree/action_node/utils/GiantessSelectTargetUtils"

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

type enterScenarioData = {
	usedGirlIndex?: number,
}

export type exitScenarioData = enterScenarioData

type stopData = enterScenarioData

type sayData = {
	name: string,
	contents: Array<{
		content: string,
		soundId?: string
	}>,
	time: number,
	isInMiddle?: boolean,

	usedGirlIndex?: number,
}

type walkData = Array<{
	time: number,
	position: [number, number],
	// quaternion: [number, number, number, number],
	// euler: [number, number, number],
	usedGirlIndex?: number,
}>

type animationData = {
	name: animationName,
	isLoop?: boolean,
	noBlend?: boolean,
	usedGirlIndex?: number,
}


// export let useNoCameraControl: command<null> = (state: state, data) => {
// 	let abstractState = Camera.removeCurrentControls(getAbstractState(state))

// 	state = setAbstractState(state, abstractState)

// 	state = setCameraType(state, cameraType.No)

// 	return Promise.resolve(state)
// }


export let getCommand = (state: state, command_: commandData) => {
	switch (command_) {
		case commandData.enterScenario:
			return enterScenario

		case commandData.markBegin:
			return markBegin
		case commandData.markFinish:
			return markFinish

		// case commandData.moveCamera:
		// 	return moveCamera
		// case commandData.walkToPosition:
		// 	return walkToPosition
		// case commandData.stop:
		// 	return stop
		// case commandData.playGirlAnimation:
		// 	return playGirlAnimation
		// // case commandData.showGirlAndActiveAllActions:
		// // 	return showGirlAndActiveAllActions
		// case commandData.initGirl:
		// 	return initGirl
		// case commandData.say:
		// 	return say


		case commandData.appearWildGiantess:
			return appearWildGiantess
		case commandData.appeareEnemyGiantess:
			return appeareEnemyGiantess
		// case commandData.appearPlayerGoddess:
		// 	return appearPlayerGoddess
		case commandData.enemyReinforceReach:
			return enemyReinforceReach
		case commandData.enemyFireSupport:
			return enemyFireSupport

		// case commandData.hard:
		// 	return hard

		// case commandData.enemyAddRandomBuff:
		// 	return enemyAddRandomBuff

		case commandData.realtimeSay:
			return realtimeSay

		case commandData.exitScenario:
			return exitScenario
		// case commandData.blackScreen:
		// 	return blackScreen
		default:
			return handleGetCommand(state, command_)
	}
}



// let _useNoCameraControl = (state: state) => {
// 	let abstractState = Camera.removeCurrentControls(getAbstractState(state))

// 	state = setAbstractState(state, abstractState)

// 	state = setCameraType(state, cameraType.No)

// 	// return Promise.resolve(state)
// 	return state
// }

export let getUsedGirlIndexFromData = (state: state, data) => {
	let index
	if (NullableUtils.isNullable(data)) {
		index = 0
	}
	else {
		index = NullableUtils.getWithDefault(data.usedGirlIndex, 0)
	}

	return getSpecificUsedGirl(state, index)
}

export let enterScenario: command<enterScenarioData> = (state: state, _, data) => {
	let usedGirl = getUsedGirlIndexFromData(state, data)
	state = enablePhysics(state, usedGirl)

	if (Camera.isCanLock(getAbstractState(state))) {
		// getOrbitControls(getAbstractState(state)).unlock()
		state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
	}

	getOrbitControls(getAbstractState(state)).enabled = false

	return markEnter(state, true).then(state => {
		state = useNoCameraControl(state)

		if (Device.isMobileByState(getAbstractState(state))) {
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

	return buildMultipleTweens(state, [(state, object, currentData) => {
		return Promise.resolve(_updateCamera(state, object.position, object.target))
	}, data => {
		return {
			position: data.position,
			target: data.target
		}
	}, (state, _p, _n) => {
		return state
	}, (_, currentData) => {
		return currentData.time
	}], cameraMoveData).then(d => {
		state = d[0]
		let lastTween = d[1]
		let allTweens = d[2]

		return NullableUtils.getWithDefault(
			NullableUtils.map(lastTween => {
				_handleTweenComplete(state, onCompleteFunc, lastTween, allTweens)

				// return Promise.resolve(state)
				return state
			}, lastTween),
			// Promise.resolve(state)
			state
		)
	})
}

export let say: command<sayData> = (state: state, onCompleteFunc, data) => {
	requireCheck(() => {
		test("too long", () => {
			return data.contents.reduce((result, content) => {
				if (!result) {
					return false
				}

				return Device.isMobileByState(getAbstractState(state)) ? content.content.length < 60 : content.content.length < 100
			}, true)
		})
	}, getIsDebug(state))

	let isInMiddle = NullableUtils.getWithDefault(
		data.isInMiddle,
		false
	)

	let c = NumberUtils.randomSelect(data.contents)
	let content = c.content

	let usedGirl = getUsedGirlIndexFromData(state, data)

	state = NullableUtils.getWithDefault(
		NullableUtils.map(soundId => {
			return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state),
					getGiantessVolume(state, usedGirl, true, getScenarioVolume(state))
				)
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

			return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData(data.name, `${content}...${getLanguageTextData(state, languageKey.ClickToContinue)}`, isInMiddle)).then(state => {
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

				return Device.isMobileByState(getAbstractState(state)) ? content.content.length < 60 : content.content.length < 100
			}, true)
		})
	}, getIsDebug(state))

	let isInMiddle = NullableUtils.getWithDefault(
		data.isInMiddle,
		false
	)

	let c = NumberUtils.randomSelect(data.contents)
	let content = c.content

	let usedGirl = getUsedGirlIndexFromData(state, data)

	state = NullableUtils.getWithDefault(
		NullableUtils.map(soundId => {
			return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
				SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state),
					getGiantessVolume(state, usedGirl, true, getScenarioVolume(state))
				)
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


// export let showGirlAndActiveAllActions: command<number> = (state: state, onCompleteFunc, data) => {
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
	let usedGirl = usedGirlEnum.PlayerGirl
	state = hideGirl(state, usedGirl)

	state = _updateWalk(state, usedGirl, data)

	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		// return showGirl_(state).then(onCompleteFunc)
		state = showGirl_(state, usedGirl)

		return StateMachine.execute(state, getStateMachine(state, usedGirl), null).then(onCompleteFunc)
	}, 20))

	return Promise.resolve(state)
}


// export let wait: command<number> = (state: state, onCompleteFunc, data) => {
// 	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		return onCompleteFunc(state)
// 	}, data))

// 	return Promise.resolve(state)
// }

let _updateWalk = (state: state, usedGirl, position) => {
	let [x1, z1] = position

	state = setPivotWorldPositionAndUpdateBox(state, usedGirl, _v1.set(x1, 0, z1))

	// return NullableUtils.getWithDefault(NullableUtils.map(euler => {
	// 	let [x2, y2, z2] = euler
	// 	return setGirlRotation(state, _q1.setFromEuler(new Euler(x2, y2, z2)))
	// }, euler), state)

	return state
}

// let _playGirlAnimation = (state: state, objectStateName) => {
// 	return setUsedGirlData(state, usedGirl,{
// 		...getUsedGirlData(state, usedGirl),
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

	// let usedGirl = getNearestUsedGirl(state, getPlayerPosition(state))
	let usedGirl = getUsedGirlIndexFromData(state, data)

	return buildMultipleTweens(state, [(state, object, currentData) => {
		return Promise.resolve(_updateWalk(state, usedGirl, object.position))
	}, data => {
		return {
			position: data.position
		}
	}, (state, previousData, nextData) => {
		return NullableUtils.getWithDefault(NullableUtils.map(euler => {
			return setGirlRotation(state, usedGirl, _q1.setFromEuler(euler))
		}, computeEuler(previousData.position, nextData.position, initialEulerForTween)), state)
	}, (_, currentData) => {
		return currentData.time
	}], data).then(d => {
		state = d[0]
		let lastTween = d[1]
		let allTweens = d[2]

		return NullableUtils.getWithDefault(
			NullableUtils.map(lastTween => {
				state = playAnimationLoop(state, usedGirl, animationName.Walk, false)


				_handleTweenComplete2(state, onCompleteFunc, state => {
					return Promise.resolve(playAnimationLoop(state, usedGirl, animationName.Idle, false))
				}, lastTween, allTweens)

				return state
			}, lastTween),
			state
		)
	})
}

export let stop: command<stopData> = (state: state, onCompleteFunc, data) => {
	// requireCheck(() => {
	// 	test("length should >= 1", () => {
	// 		return data.length >= 1
	// 	})
	// }, getIsDebug(state))
	// let usedGirl = getNearestUsedGirl(state, getPlayerPosition(state))
	let usedGirl = getUsedGirlIndexFromData(state, data)

	state = playAnimationLoop(state, usedGirl, animationName.Idle, false)

	return Promise.resolve(state)
}

export let playGirlAnimation: command<animationData> = (state: state, onCompleteFunc, data) => {
	let usedGirl = getUsedGirlIndexFromData(state, data)

	let isLoop = NullableUtils.getWithDefault(data.isLoop, false)
	let noBlend = NullableUtils.getWithDefault(data.noBlend, false)

	if (isLoop) {
		state = playAnimationLoop(state, usedGirl, data.name, noBlend)
	}
	else {
		state = playAnimationOnlyOnce(state, usedGirl, data.name, noBlend)
	}

	return Promise.resolve(state)
}

let _getFinishKey = (usedGirl) => `${usedGirl}_finish`

export let isFinish = (state: state, usedGirl) => {
	return NullableUtils.getWithDefault(
		getCustomData<boolean>(state, _getFinishKey(usedGirl)),
		true
	)
}

export let isAllFinish = (state) => {
	return ArrayUtils.reduce(getCurrentUsedGirls(state), (result, usedGirl) => {
		if (!result) {
			return false
		}

		return isFinish(state, usedGirl)
	}, true)
}

export let setIsFinish = (state: state, usedGirl, value) => {
	return setCustomData(state, _getFinishKey(usedGirl), value)
}

export let markBegin: command<null> = (state: state, onCompleteFunc, data) => {
	let usedGirl = usedGirlEnum.PlayerGirl
	state = setIsFinish(state, usedGirl, false)

	return Promise.resolve(state)
}

export let markFinish: command<nullable<string>> = (state: state, onCompleteFunc, data) => {
	let usedGirl = usedGirlEnum.PlayerGirl
	state = setIsFinish(state, usedGirl, true)

	return Event.trigger(state, getAbstractState, getMarkFinishEventName(), data)
}

export let selectValidGTSPoint = (state: state, min = 50, max = Infinity) => {
	return NullableUtils.getWithDefault(
		ArrayUtils.get(findValidPoints(getCrowdData(state), getPlayerPosition(state), min, max, true), 0),
		getPlayerPosition(state)).clone().setY(0)
}

let _selectWildGiantessTarget = (api: api): actionNodeFunc => (state, usedGirl, id) => {
	return api.selectTargetByDefault(state, usedGirl).then(([state, result]) => {
		if (result == behaviourTreeNodeExecuteResult.Success) {
			return [state, result]
		}

		return api.selectTargetBySelectTargetPrior(state, usedGirl)
	}).then(([state, result]) => {
		if (result == behaviourTreeNodeExecuteResult.Success) {
			return [state, result]
		}

		return api.selectTarget(state, usedGirl, true, true)
	})
}

export let appearWildGiantess: command<null> = (state: state, onCompleteFunc, data) => {
	let pos = selectValidGTSPoint(state)
	let usedGirl = usedGirlEnum.WildGiantess

	return addWildGiantess(state,
		// _v1.set(-317, 0, -62),
		pos,
		// _q1.set(0, 0.707, 0, 0.707)
		getLookatQuaternion(pos, getPlayerPosition(state)),

		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialPosition),
		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion),
	).then(state => {
		state = setNeedUpdateStatusName(state, usedGirl, `${getLanguageTextData(state, languageKey.AppearWildGiantessName)} ${getMMDName(state, usedGirl)}`)

		// state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), WildGiantessBehaviourTreeData.getData([
		// 	BehaviourTreeManager.getSettingFactorAffectBiggerRate,
		// 	NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
		// 	state => {
		// 		// return getGirlScale(state, usedGirl) < getValue(state).minScaleAsMiddleGiantess
		// 		return getBiggerCount(state, usedGirl) == 0
		// 	},
		// 	
		// 	getValue,
		// 	isChangeScaling,
		// 	isPose,
		// 	BehaviourTreeManager.getVeryNearestTargetCount
		// ]))
		// state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeManager.getKey(), WildGiantessBehaviourTreeManager.buildActionNode)

		let api = getModAPI(state)

		getBalanceBlockService(state)
		state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), getBalanceBlockService(state).getData(api))
		state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeManager.getKey(), buildActionNodeForBalance(api, _selectWildGiantessTarget(api)))



		return state
	})
}

let _selectEnemyGiantessTarget = (api: api): actionNodeFunc => (state, usedGirl, id) => {
	// let promise
	// if (NumberUtils.isRandomRate(3 / 4)) {
	// 	promise = selectLittleMan(state, true)
	// }
	// else {
	// 	promise = Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
	// }

	// return promise.then(([state, result]) => {
	// 	if (result == behaviourTreeNodeExecuteResult.Success) {
	// 		return [state, result]
	// 	}

	// 	return selectRandomNearBuilding(state)
	// })
	return selectLittleMan(state, usedGirl, false)
}

export let appeareEnemyGiantess: command<null> = (state: state, onCompleteFunc, data) => {
	let pos = selectValidGTSPoint(state)

	let usedGirl = usedGirlEnum.EnemyGiantess
	return addEnemyGiantess(state,
		// _v1.set(-317, 0, -62),
		pos,
		// _q1.set(0, 0.707, 0, 0.707)
		getLookatQuaternion(pos, getPlayerPosition(state)),

		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialPosition),
		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion),
	).then(state => {
		state = setNeedUpdateStatusName(state, usedGirl, `${getLanguageTextData(state, languageKey.AppearEnemyGiantessName)} ${getMMDName(state, usedGirl)}`)

		let api = getModAPI(state)

		// state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), EnemyGiantessBehaviourTreeData.getData([
		// 	BehaviourTreeManager.getSettingFactorAffectBiggerRate,
		// 	NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
		// 	state => {
		// 		// return getGirlScale(state, usedGirl) < getValue(state).minScaleAsMiddleGiantess
		// 		return getBiggerCount(state, usedGirl) == 0
		// 	},
		// 	
		// 	getValue,
		// 	isChangeScaling,
		// 	isPose,
		// 	BehaviourTreeManager.getVeryNearestTargetCount
		// ]))
		// state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeManager.getKey(), EnemyGiantessBehaviourTreeManager.buildActionNode)
		getBalanceBlockService(state)
		state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), getBalanceBlockService(state).getData(api))
		state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeManager.getKey(), buildActionNodeForBalance(api, _selectEnemyGiantessTarget(api)))

		return state
	})
}

// export let appearPlayerGoddess: command<null> = (state: state, onCompleteFunc, data) => {
// 	let pos = selectValidGTSPoint(state, 10, 30)

// 	return addPlayerGoddess(state,
// 		// _v1.set(-317, 0, -62),
// 		pos,
// 		// _q1.set(0, 0.707, 0, 0.707)
// 		getLookatQuaternion(pos, getPlayerPosition(state)),

// 		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialPosition),
// 		// NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion),
// 	).then(state => {
// 		state = setNeedUpdateStatusName(state, usedGirl, `${getLanguageTextData(state, languageKey.AppearPlayerGoddessName)}${getCurrentMMDCharacterName(state, usedGirl)}`)


// 		state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), PlayerGoddessBehaviourTreeData.getData([
// 			BehaviourTreeManager.getSettingFactorAffectBiggerRate,
// 			NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
// 			state => {
// 				// return getGirlScale(state, usedGirl) < getValue(state).minScaleAsMiddleGiantess
// 				return getBiggerCount(state, usedGirl) == 0
// 			},
// 			
// 			getValue,
// 			isChangeScaling,
// 			isPose,
// 			BehaviourTreeManager.getVeryNearestTargetCount
// 		]))
// 		state = BehaviourTreeManager.buildTree(state, usedGirl, BehaviourTreeManager.getKey(), PlayerGoddessBehaviourTreeManager.buildActionNode)

// 		return state
// 	}).then(state => {
// 		state = increaseGirlAttribute(state, getLevelByCharacter(state, characterType.Giantess) - 1)

// 		state = setHp(state, buildFuncData(state), (state, hp) => hp, true, usedGirlEnum.PlayerGoddess)

// 		return state
// 	})
// }

let _selectValidArmyPoint = selectValidGTSPoint

export let enemyReinforceReach: command<null> = (state: state, onCompleteFunc, data) => {
	let level, countFactor
	switch (getAutoDifficulty(state)) {
		case autoDifficulty.VeryEasy:
			level = 2
			countFactor = 1
			break
		case autoDifficulty.Easy:
			// level = 3
			// countFactor = 1
			level = 2
			countFactor = 2
			break
		case autoDifficulty.Middle:
			// level = 4
			level = 3
			// countFactor = 2
			// countFactor = 1.5
			countFactor = 1
			break
		case autoDifficulty.Hard:
			level = 4
			countFactor = 1
			break
		case autoDifficulty.VeryHard:
			level = 4
			countFactor = 1.5
			break
		case autoDifficulty.VeryHard1:
			level = 5
			countFactor = 1
			break
		case autoDifficulty.VeryHard2:
			level = 5
			countFactor = 1.5
			break
		case autoDifficulty.VeryHard3:
		case autoDifficulty.VeryHard4:
		case autoDifficulty.VeryHard5:
			level = 5
			// countFactor = 3
			countFactor = 2
			break
	}

	return generateArmyInSpecificPosition(state, generate(
		state,
		oneLevelData => {
			return NumberUtils.randomSelectCount(oneLevelData, 3)
		},
		level,
		countFactor
	), _selectValidArmyPoint(state))
}

let _generateEnemyFireSupportStartPosition = (state, playerPosition: Vector3) => {
	// const height = 200 * NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.2, 1, 10)
	// const height = isGiantessCharacterType(state) ? NumberUtils.clamp(computeHeight(state, usedGirl), 200, 2000) : 200
	const height = isGiantessCharacterType(state) ? NumberUtils.clamp(computeHeight(state, usedGirlEnum.PlayerGirl), 200, 2000) : 100
	// const distance = NumberUtils.getRandomFloat(150, 400)
	const distance = NumberUtils.getRandomFloat(height / 2, height * 2)

	return playerPosition.clone().add(buildRandomDirectionInXZ().multiplyScalar(distance)).setY(height)
}

export let enemyFireSupport: command<null> = (state: state, onCompleteFunc, data) => {
	let emitFunc, count, attackFactor_
	switch (getAutoDifficulty(state)) {
		case autoDifficulty.VeryEasy:
		case autoDifficulty.Easy:
			emitFunc = ParticleManager.emitShell
			// count = 10
			count = 5
			break
		case autoDifficulty.Middle:
			emitFunc = ParticleManager.emitShell
			// count = 20
			count = 10
			break
		case autoDifficulty.Hard:
			emitFunc = ParticleManager.emitShell
			// count = 30
			count = 20
			break
		case autoDifficulty.VeryHard:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			// count = 15
			// count = 10
			count = 8
			break
		// case autoDifficulty.VeryHard:
		case autoDifficulty.VeryHard1:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			// count = 30
			// count = 20
			count = 13
			break
		case autoDifficulty.VeryHard2:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			count = 20
			break
		case autoDifficulty.VeryHard3:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			// count = 50
			// count = 35
			count = 30
			break
		case autoDifficulty.VeryHard4:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			count = 50
			break
		case autoDifficulty.VeryHard5:
			emitFunc = ParticleManager.emitMissileVehicleMissile
			// count = 80
			count = 70
			break
	}

	if (getAutoDifficulty(state) <= autoDifficulty.Easy) {
		attackFactor_ = attackFactor.VeryLow3
	}
	else if (getAutoDifficulty(state) <= autoDifficulty.VeryHard) {
		attackFactor_ = attackFactor.VeryLow2
	}
	// else if (getAutoDifficulty(state) <= autoDifficulty.VeryHard3) {
	// 	attackFactor_ = attackFactor.VeryLow
	// }
	else {
		// attackFactor_ = attackFactor.Middle
		attackFactor_ = attackFactor.VeryLow
	}

	let fromName = "enemyFireSupport"
	state = setAttackFactor(state, fromName, attackFactor_)
	state = setCritRatioFactor(state, fromName, critRatioFactor.Zero)

	let position = getPlayerPosition(state)
	const offset = 50

	let startPosition = _generateEnemyFireSupportStartPosition(state, position.clone())

	state = ArrayUtils.range(0, count - 1).reduce((state, i) => {
		let targetPosition = computePositionByOffset(position.clone(), offset)
		let direction = targetPosition.sub(startPosition).normalize()

		return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
			let speed = isGiantessCharacterType(state) && isBigGiantess(state, usedGirlEnum.PlayerGirl) ? emitterSpeed.MostFast1 : emitterSpeed.Fast

			return Promise.resolve(setAbstractState(state, emitFunc(getAbstractState(state), {
				fromName,
				camp: camp.Enemy,
				// speed: emitterSpeed.Fast,
				speed,
				// life: emitterLife.VeryLong2,
				// life: emitterLife.MaxLong,
				life: NumberUtils.lessThan(emitterLife.VeryLong2 * startPosition.length() * 0.003, emitterLife.VeryLong2 * 10),
				size: emitterSize.Big,
				position: startPosition.toArray(),
				direction: direction.toArray(),
			},
				getParticleNeedCollisionCheckLoopCount(state, speed)
			)))
		}, NumberUtils.getRandomFloat(0.2, 0.7) * i))
	}, state)

	return Promise.resolve(state)
}

// export let getHardKey = () => "hard"

// export let hard: command<null> = (state: state, onCompleteFunc, data) => {
// 	// state = BehaviourTreeManager.setLastHardTime(state, getNow(state))
// 	state = setCustomData(state, getHardKey(), getNow(state))

// 	let service = getHardBlockService(state)

// 	return service.addBuff(getModAPI(state), state)
// }

// export let enemyAddRandomBuff: command<null> = (state: state, onCompleteFunc, data) => {
// 	let allData = [
// 		{
// 			buffName: buffName.IncreaseDefenseFactor,
// 			time: 30,
// 			count: NumberUtils.getRandomInteger(1, 2),
// 		},
// 		{
// 			buffName: buffName.IncreaseMoveSpeed,
// 			time: 30,
// 			count: NumberUtils.getRandomInteger(1, 2),
// 		},
// 	]

// 	return ArrayUtils.reducePromise(
// 		NumberUtils.randomSelectCount(allData, 1), (state, { buffName, time, count }) => {
// 			return ArrayUtils.reducePromise(
// 				getAllFlattenAliveArmyData(state),
// 				((state, { name }) => {
// 					return addBuff(state, buffName, name, NullableUtils.getEmpty(), time, count, characterType.None)
// 				}),
// 				state
// 			)
// 		}, state
// 	)
// }