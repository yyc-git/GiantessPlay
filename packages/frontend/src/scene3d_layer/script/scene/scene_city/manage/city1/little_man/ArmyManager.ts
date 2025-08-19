import { state } from "../../../../../../type/StateType"
import { getIsNotTestPerf } from "../../../../Scene"
import { getLittleManSetting } from "../../../CityScene"
import { armyCount } from "../../../type/StateType"

export let getCrowdScalar = (state: state) => {
	if (!getIsNotTestPerf(state)) {
		return 5
	}

	switch (getLittleManSetting(state).armyCount) {
		case armyCount.None:
			return 0
		case armyCount.Low:
			return 1
		case armyCount.Middle:
			return 2
		case armyCount.High:
			return 5
		default:
			throw new Error("err")
	}
}

export let getMaxVisibleCount = (state: state) => {
	if (!getIsNotTestPerf(state)) {
		return 100
	}

	switch (getLittleManSetting(state).armyCount) {
		case armyCount.None:
			return 0
		case armyCount.Low:
			return 20
		case armyCount.Middle:
			return 40
		case armyCount.High:
			return 100
		default:
			throw new Error("err")
	}
}

export let getCrowdCount = (state: state) => {
	if (!getIsNotTestPerf(state)) {
		return 25
	}

	switch (getLittleManSetting(state).armyCount) {
		case armyCount.None:
			return 0
		case armyCount.Low:
			return 5
		case armyCount.Middle:
			return 10
		case armyCount.High:
			return 25
		default:
			throw new Error("err")
	}
}

export let getOffsetFactor = (state: state) => {
	if (!getIsNotTestPerf(state)) {
		return 10
	}

	switch (getLittleManSetting(state).armyCount) {
		case armyCount.None:
			return 0
		case armyCount.Low:
			return 2
		case armyCount.Middle:
			return 5
		case armyCount.High:
			return 10
		default:
			throw new Error("err")
	}
}

export let getMilltaryVehicleCrowdCountFactor = (state: state) => {
	if (!getIsNotTestPerf(state)) {
		return 5
	}

	switch (getLittleManSetting(state).armyCount) {
		case armyCount.None:
			return 0
		case armyCount.Low:
			return 1
		case armyCount.Middle:
			return 2
		case armyCount.High:
			return 5
		default:
			throw new Error("err")
	}
}