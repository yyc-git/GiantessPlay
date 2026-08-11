import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { mission } from "../../type/StateType"
import { getCelebrateSoundResourceId, getDoorResourceId, getFailSoundResourceId, getLevelNumber, getScene, getSceneChapter, getShowDoorResourceId, getState, isGiantessCharacterType, setState } from "../../CityScene"
import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import moment from 'moment'
import { SoundManager } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
import { isGenerateComplete } from "./generator/ArmyGenerator"
import { isAllFinish, isFinish } from "../../scenario/Command"
import { getCurrentUsedGirls, hasLevelGiantessExceptPlayer, isLevelGiantess, isLevelGiantessExceptPlayer, isUsePlayerGoddess } from "../../girl/Girl"
import { usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Flow } from "meta3d-jiehuo-abstract"
import { List } from "immutable"
import { scene } from "../../../../../../ui_layer/global/store/GlobalStoreType"
import { getDoorImageExn, getGameTime, getGameTimeIncludeSpecialTime, getIsMissionFinish, getIsShowEnterDoorToast, getMissionState, handleMissionComplete, hasDoorImage, setDoorImage, setIsMissionFinish, setIsShowEnterDoorToast, setMissionState } from "../mission/Mission"
import { getAllAliveArmyCount } from "../../utils/ArmyUtils"
import { PathFind } from "meta3d-jiehuo-abstract"
import { Euler, Vector2, Vector3 } from "three"
import { getGrid } from "./PathFind"
import { getCrowdData } from "./Army"
import { findValidPoints } from "../../utils/GeneratorUtils"
import { getPlayerBox, getPlayerPosition, isNearObject } from "../../utils/PlayerUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { Billboard } from "meta3d-jiehuo-abstract"
import { getOriginSystemVolume } from "../../utils/SoundUtils"
import { getCameraPosition } from "../../Camera"
import { getHideEnterDoorToastEventName, getShowEnterDoorToastEventName } from "../../../../../utils/EventUtils"
import { getBoxMinXZSize } from "../../utils/Box3Utils"
import { computeDistanceByBox } from "../../utils/InteractionUtils"
import { getDuelistFactor } from "../../difficulty/Difficulty"

const _v1 = new Vector3()
const _v2 = new Vector3()
const _v1_1 = new Vector2()


let _isAllGameEventsFinish = (state: state) => {
	if (!isAllFinish(state)) {
		return false
	}

	// if (isUsePlayerGoddess(state)) {
	// 	return true
	// }

	return !hasLevelGiantessExceptPlayer(state)
}

// let _computePassLevelTime = (state: state) => {
// 	if (getDuelistFactor(state) > 0) {
// 		return 4
// 	}

// 	return 6
// }

let _isMissionComplete = (state: state) => {
	// return getDestroyedRate(state) >= (isGiantessCharacterType(state) ? GiantessMission.getFinishDestroyedRate(state) : LittleManMission.getFinishDestroyedRate(state))

	return _isAllGameEventsFinish(state)
		&&
		(
			// getGameTime(state).asMinutes() >= 15
			// getGameTime(state).asMinutes() >= 12

			// getGameTime(state).asMinutes() >= 8
			// getGameTime(state).asMinutes() >= _computePassLevelTime(state)
			getGameTimeIncludeSpecialTime(state).asMinutes() >= 6
			// getGameTime(state).asMinutes() >= 0.1
			|| (isGenerateComplete(state) && getAllAliveArmyCount(state) == 0)
		)

}

// export let handleMissionComplete = (state: state, deferTime) => {
// 	state = setMissionState(state, {
// 		...getMissionState(state),
// 		isMissionFinish: true,
// 		completeLevelData: getMissionState(state).completeLevelData.push(
// 			{
// 				sceneChapter: getSceneChapter(state),
// 				levelNumber: getLevelNumber(state)
// 			}
// 		)
// 	})

// 	// if (isGiantessCharacterType(state)) {

// 	return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
// 		return GiantessMission.handleMissionComplete(state)
// 	}, deferTime)))
// 	// }

// 	// return LittleManMission.handleMissionFail(state)
// }

// export let handleMissionFail = (state: state) => {
// 	state = setMissionState(state, {
// 		...getMissionState(state),
// 		isMissionFinish: true
// 	})

// 	return LittleManMission.handleMissionFail(state)
// }

// export let restoreToWait = (state: state) => {
// 	state = setMissionState(state, {
// 		...getMissionState(state),
// 		// isMissionFinish: false
// 		isMissionFinish: true
// 	})

// 	state = setAbstractState(state, Flow.startLoop(getAbstractState(state)))

// 	return state
// }

// export let handleMissionCompleteAfterWait = (state: state) => {
// 	return GiantessMission.handleMissionComplete(state)
// }

let _findValidPoint = (state: state) => {
	let position = getPlayerPosition(state)

	let result = findValidPoints(getCrowdData(state), position, 30, 100, true)


	return NullableUtils.getWithDefault(
		ArrayUtils.get(result, 0),
		position
	).clone().setY(0)
}

let _generateDoor = (state: state, point: Vector3) => {
	// let image = Billboard.createImage(getAbstractState(state),
	// 	getDoorResourceId(),
	// 	NullableUtils.return_(
	// 		// point.add(_v1.set(0, 30, 0))
	// 		point.add(_v1.set(0, 15, 0))
	// 	),
	// 	NullableUtils.getEmpty(),
	// 	// NullableUtils.return_([0, 0]),
	// 	{
	// 		isSizeAttenuation: true,
	// 		// isAlwaysShow: false,
	// 		isAlwaysShow: true,
	// 		// width: 20,
	// 		// height: 20,
	// 		width: 60,
	// 		height: 60,
	// 	}
	// )

	let image = Billboard.createPlaneImage(getAbstractState(state),
		getDoorResourceId(),
		NullableUtils.return_(
			point.clone().add(_v1.set(0, 15, 0))
		),
		{
			transparent: true,
			isAlwaysShow: false,
			width: 60,
			height: 60,
		}
	)


	getScene(state).add(image)

	state = setDoorImage(state, image)

	return state
}

export let showDoor = (state: state) => {
	// state = setIsMissionFinish(state, true)

	state = _generateDoor(state, _findValidPoint(state))

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
		SoundManager.buildNeedToPlaySoundData(getShowDoorResourceId(), getIsDebug(state), getOriginSystemVolume(state))
	))

	return state
}

// let _removeDoor = (state: state) => {
// 	getDoorImageExn(state).remove()

// 	return state
// }

let _updateDoorToLookatCamera = (state: state) => {
	let image = getDoorImageExn(state)

	image.lookAt(getCameraPosition(state).clone().setY(image.position.y))

	return state
}

export let isCanEnterDoor = (state: state) => {
	return hasDoorImage(state) && isNearObject(getDoorImageExn(state).position, getPlayerPosition(state), 20 + computeDistanceByBox(state))
}

export let handleDoor = (state: state) => {
	if (hasDoorImage(state)) {
		state = _updateDoorToLookatCamera(state)
	}

	// if (hasDoorImage(state) && isNearObject(getDoorImageExn(state).position, getPlayerPosition(state), 20)) {
	if (isCanEnterDoor(state)) {
		// if (!getIsShowEnterDoorToast(state)) {
		// state = setIsShowEnterDoorToast(state, true)

		// promise = handleMissionComplete(state, 0)
		return Event.trigger(state, getAbstractState, getShowEnterDoorToastEventName(), NullableUtils.getEmpty())
		// }

		// return state
	}

	state = setIsShowEnterDoorToast(state, false)

	return Event.trigger(state, getAbstractState, getHideEnterDoorToastEventName(), NullableUtils.getEmpty())
}

export let update = (state: state) => {
	// Console.log(getDestroyedRate(state))
	// if (getDestroyedRate(state) >= 0 && !getMissionState(state).isMissionFinish) {

	let promise
	if (
		!getIsDebug(state)
		&&
		_isMissionComplete(state) && !getIsMissionFinish(state)) {
		// promise = handleMissionComplete(state, 10)
		// promise = handleMissionComplete(state, 0)
		state = setIsMissionFinish(state, true)
		promise = Promise.resolve(showDoor(state))
	}
	else {
		promise = Promise.resolve(state)
	}

	return promise.then(handleDoor)
}

// export let dispose = (state: state) => {
// 	state = setMissionState(state, {
// 		...createState(),
// 		isEnteringNextLevel: getMissionState(state).isEnteringNextLevel,
// 		completeLevelData: getMissionState(state).completeLevelData,
// 	})

// 	return Promise.resolve(state)
// }

// export let markIsEnteringNextLevel = (state: state, value) => {
// 	return setMissionState(state, {
// 		...getMissionState(state),
// 		isEnteringNextLevel: value
// 	})
// }

// export let isEnteringNextLevel = (state: state) => {
// 	return getMissionState(state).isEnteringNextLevel
// }

// export let isCanEnterBossLevel = (state: state) => {
// 	return getSceneChapter(state) !== scene.Biwu && getMissionState(state).completeLevelData.filter(d => d.sceneChapter == scene.Play).count() >= 2
// 	// return getSceneChapter(state) !== scene.Biwu && getMissionState(state).completeLevelData.filter(d => d.sceneChapter == scene.Play).count() >= 1
// 	// && getMissionState(state).completeLevelData.last().sceneChapter !== scene.Biwu
// }