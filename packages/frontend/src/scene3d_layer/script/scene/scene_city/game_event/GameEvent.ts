import { reducePromise } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { state } from "../../../../type/StateType"
import { eventName } from "../data/GameEventData"
import { gameEvent } from "../type/StateType"
import { Map } from "immutable"
import * as CityScene from "../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Box3, Vector3 } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isFinish } from "../scenario/Command"

// const _q = new Quaternion();
// const _m = new Matrix4();
// const _v1 = new Vector3();
// const _v2 = new Vector3();


let _getState = (state: state): gameEvent => {
	return CityScene.getState(state).gameEvent
}

let _setState = (state: state, scenarioState: gameEvent) => {
	return CityScene.setState(state, {
		...CityScene.getState(state),
		gameEvent: scenarioState
	})
}

// export let trigger = <Data>(state: state, eventName: eventName, data: Data) => {
// 	return getData()[eventName](state, data)
// }


// let _isTriggerEvent = (state: state, eventName: eventName) => {
// 	return NullableUtils.getWithDefault(
// 		_getState(state).isTriggerEvent.get(eventName),
// 		false
// 	)
// }

let _triggerEvent = <eventName>(state: state, eventName: eventName) => {
	return NullableUtils.getExn(CityScene.getConfigData(state).gameEventData.find(d => {
		return d.eventName == eventName
	})).func(state)
}

export let triggerMainEvent = <eventName>(state: state, eventName: eventName) => {
	state = _setState(state, {
		..._getState(state),
		currentMainEventName: NullableUtils.return_(eventName)
	})

	return _triggerEvent(state, eventName)
}

export let triggerSubEvent = <eventName>(state: state, eventName: eventName) => {
	state = _setState(state, {
		..._getState(state),
		currentSubEventName: NullableUtils.return_(eventName)
	})

	return _triggerEvent(state, eventName)
}

export let triggerSubEventWhenNotTrigger = <eventName>(state: state, eventName: eventName) => {
	if (isSubEventNameTriggering(state, eventName)) {
		return Promise.resolve(state)
	}

	state = _setState(state, {
		..._getState(state),
		currentSubEventName: NullableUtils.return_(eventName)
	})

	return _triggerEvent(state, eventName)
}

// export let update = (state: state) => {
// 	return reducePromise(CityScene.getConfigData(state).gameEventData, (state, data) => {
// 		if (
// 			_isTriggerEvent(state, data.eventName)
// 			|| !data.condition(state)
// 		) {
// 			return Promise.resolve(state)
// 		}

// 		state = _setState(state, {
// 			..._getState(state),
// 			isTriggerEvent: _getState(state).isTriggerEvent.set(data.eventName, true)
// 		})

// 		return data.func(state)
// 	}, state)
// }

export let createState = (): gameEvent => {
	return {
		currentMainEventName: NullableUtils.getEmpty(),
		currentSubEventName: NullableUtils.getEmpty(),

		// isTriggerEvent: Map()
		customDataMap: Map(),
	}
}

export let dispose = (state: state) => {
	return _setState(state, createState())
}

export let getCustomData = <Data>(state: state, key): nullable<Data> => {
	return _getState(state).customDataMap.get(key)
}

export let getCustomDataExn = <Data>(state: state, key): Data => {
	return NullableUtils.getExn(getCustomData(state, key))
}

export let setCustomData = (state: state, key, value) => {
	return _setState(state, {
		..._getState(state),
		customDataMap: _getState(state).customDataMap.set(key, value)
	})
}

export let removeCustomData = (state: state, key) => {
	return _setState(state, {
		..._getState(state),
		customDataMap: _getState(state).customDataMap.remove(key)
	})
}

export let isCurrentMainEventName = (state: state, eventName) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(currentMainEventName => currentMainEventName == eventName,
			_getState(state).currentMainEventName
		),
		false
	)
}

export let isCurrentSubEventName = (state: state, eventName) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(currentSubEventName => currentSubEventName == eventName,
			_getState(state).currentSubEventName
		),
		false
	)
}

export let isSubEventNameTriggering = (state: state, eventName) => {
	return isCurrentSubEventName(state, eventName) && !isFinish(state)
}