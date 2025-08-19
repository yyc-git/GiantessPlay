import { state } from "../../../../type/StateType"
import { addCommand, clearCommand, execute as executeCommand } from "./CommandManager"
import { scenario } from "../type/StateType"
import { List } from "immutable"
import * as CityScene from "../CityScene"
import { getAbstractState, writeState } from "../../../../state/State"
import { Event } from "meta3d-jiehuo-abstract"
import { getExitScenarioEventName, getIsEnterScenarioEventName } from "../../../../utils/EventUtils"
import { updateAnimationForScenario } from "../girl/Animation"
import { singleData } from "../data/ScenarioData"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getIsDebug, getIsProduction, getIsSkipGameEvent, getIsSkipScenario } from "../../Scene"
// import { exitScenario, isFinish } from "./Command"
import { MMD } from "meta3d-jiehuo-abstract"
import { isEnablePhysics } from "../utils/MMDUtils"

export let getState = (state: state): scenario => {
	return CityScene.getState(state).scenario
}

export let setState = (state: state, scenarioState: scenario) => {
	return CityScene.setState(state, {
		...CityScene.getState(state),
		scenario: scenarioState
	})
}

export let markEnter = (state: state, isEnterScenario) => {
	state = setState(state, {
		...getState(state),
		isEnterScenario
	})

	return Event.trigger(state, getAbstractState, getIsEnterScenarioEventName(), isEnterScenario)
}

export let isEnter = (state: state) => {
	return getState(state).isEnterScenario
}

export let createState = (): scenario => {
	return {
		isEnterScenario: false,
		allCommands: List(),

		currentScenarioName: NullableUtils.getEmpty(),
	}
}

// let _getGirlName = () => "巨大女孩"

let _parseData = (state: state, getCommandFunc, data_: Array<singleData<any>>) => {
	let _parse = (state: state, index: number) => {
		if (index >= data_.length) {
			return state
		}

		let { command, data, isWaitToComplete } = data_[index]

		isWaitToComplete = NullableUtils.getWithDefault(isWaitToComplete, false)

		if (!isWaitToComplete) {
			// return Promise.resolve(addCommand(state, [null, data, _getCommand(command)]))
			state = addCommand(state, [null, data, getCommandFunc(command)])

			return _parse(state, index + 1)
		}

		state = addCommand(state, [state => {
			state = _parse(state, index + 1)

			return Promise.resolve(state)
		}, data, getCommandFunc(command)])

		return state
	}

	return _parse(state, 0)
}

export let execute = <scenarioName>(state: state, getCommandFunc, scenarioName_: scenarioName, isSetToCurrent = true) => {
	let data
	// if (CityScene.isGiantessRoad(state)) {
	// 	data = getDataForGiantessRoad(getCurrentMMDCharacterName(state))
	// }
	// else {
	// 	return state
	// }
	data = CityScene.getConfigData(state).scenaryData

	if (isSetToCurrent) {
		state = setState(state, {
			...getState(state),
			currentScenarioName: NullableUtils.return_(scenarioName_)
		})
	}

	return _parseData(state, getCommandFunc, data[scenarioName_])
}

export let update = (state: state) => {
	// if (isEnter(state)) {
	// 	let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
	// 	helper.enabled.physics = true
	// }
	// else {
	// 	let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
	// 	helper.enabled.physics = isEnablePhysics(state)
	// }

	if (getIsSkipScenario(state)) {
		if (NullableUtils.isNullable(globalThis[getExitScenarioEventName()])) {
			globalThis[getExitScenarioEventName()] = true

			state = clearCommand(state)

			// return exitScenario(state, null, null)
			return Promise.resolve(state)
		}

		// if (isFinish(state)) {
		// 	return Promise.resolve(state)
		// }
	}

	if (getIsSkipGameEvent(state)) {
		return Promise.resolve(state)
	}

	return executeCommand(state).then(state => {
		if (!isEnter(state)) {
			return state
		}

		return updateAnimationForScenario(state)
	})
}

export let dispose = (state: state) => {
	delete globalThis[getExitScenarioEventName()]

	return setState(state, createState())
}

export let isCurrentScenarioName = (state: state, name) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(currentScenarioName => currentScenarioName == name,
			getState(state).currentScenarioName
		),
		false
	)
}