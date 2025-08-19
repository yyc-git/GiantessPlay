import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { mission } from "../../type/StateType"
import { getCelebrateSoundResourceId, getFailSoundResourceId, getState, isGiantessRoad, setState } from "../../CityScene"
import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { getLevelStatusUpdateEventName, getMissionCompleteEventName, getMissionFailEventName } from "../../../../../utils/EventUtils"
import moment from 'moment'
import { SoundManager } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
import * as GiantessMission from "./giantess/Mission"
import * as LittleManMission from "./little_man/Mission"
import { CameraControls } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).mission)
}

let _setState = (state: state, taskState: mission) => {
	return setState(state, {
		...getState(state),
		mission: NullableUtils.return_(taskState)
	})
}

export let createState = (): mission => {
	return {
		startGameTime: moment(),
		isMissionFinishByDestroyedRateReach: false,
		allBuildingCount: 0,
		destroyedBuildingCount: 0,

		lastDestroyedRate: 0,
	}
}

export let addBuilding = (state: state) => {
	return _setState(state, {
		..._getState(state),
		allBuildingCount: _getState(state).allBuildingCount + 1
	})
}

export let addDestroyedBuilding = (state: state) => {
	return _setState(state, {
		..._getState(state),
		destroyedBuildingCount: _getState(state).destroyedBuildingCount + 1
	})
}

export let getDestroyedRate = (state: state) => {
	let { allBuildingCount, destroyedBuildingCount } = _getState(state)

	let value = allBuildingCount == 0 ? 0 : destroyedBuildingCount / allBuildingCount

	value = Math.floor(NumberUtils.getDecimal(value, 2) * 100)

	return ensureCheck(value, value => {
		test("should between [0, 100]", () => {
			return NumberUtils.between(value, 0, 100)
		})
	}, getIsDebug(state))
}

export let initWhenImportScene = (state: state) => {
	state = _setState(state, {
		..._getState(state),
		startGameTime: moment()
	})

	return Promise.resolve(state)
}

export let getGameTime = (state): string => {
	let value = moment.duration(moment().diff(_getState(state).startGameTime))

	return `${value.hours()}小时${value.minutes()}分${value.seconds()}秒`
}

export let update = (state: state) => {
	// Console.log(getDestroyedRate(state))
	// if (getDestroyedRate(state) >= 0 && !_getState(state).isMissionFinishByDestroyedRateReach) {

	let promise
	if (getDestroyedRate(state) >= (isGiantessRoad(state) ? GiantessMission.getFinishDestroyedRate(state) : LittleManMission.getFinishDestroyedRate(state)) && !_getState(state).isMissionFinishByDestroyedRateReach) {
		// if (getDestroyedRate(state) >= 1 && !_getState(state).isMissionFinishByDestroyedRateReach) {
		state = _setState(state, {
			..._getState(state),
			isMissionFinishByDestroyedRateReach: true
		})

		if (isGiantessRoad(state)) {
			promise = GiantessMission.handleMissionComplete(state)
		}
		else {
			promise = LittleManMission.handleMissionFail(state)
		}
	}
	else {
		promise = Promise.resolve(state)
	}

	return promise.then(state => {
		let lastDestroyedRate = _getState(state).lastDestroyedRate

		state = _setState(state, {
			..._getState(state),
			lastDestroyedRate: getDestroyedRate(state)
		})

		if (lastDestroyedRate != getDestroyedRate(state)) {
			return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
		}

		return state
	})
}

export let dispose = (state: state) => {
	state = _setState(state, createState())

	return Promise.resolve(state)
}