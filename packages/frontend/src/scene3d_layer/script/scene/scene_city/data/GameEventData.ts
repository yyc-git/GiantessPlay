import { Box3, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { scenarioName } from "./ScenarioData"
import { execute } from "../scenario/ScenarioManager"
import { getCommand } from "../scenario/Command";
import { getAllGameEventData } from "../../../../mod/EventGameMod";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
	// EnterCity = "EnterCity",
	WildGiantessAppear = "WildGiantessAppear",
	EnemyGiantessAppear = "EnemyGiantessAppear",
	// CallGiantess = "CallGiantess",
	// CallGoddess = "CallGoddess",

	EnemyReinforceReach = "EnemyReinforceReach",
	EnemyFireSupport = "EnemyFireSupport",

	// Hard = "Hard",

	// EnemyAddRandomBuff = "EnemyAddRandomBuff",
}

// type func<Data> = (state: state, data: Data) => Promise<state>

// // export type data<Data> = Record<event, func<Data>>
// export type data<Data> = Array<{
// 	event: event,
// 	condition: (state: state) => boolean,
// 	func: func<Data>,
// 	repeatCount?: number,
// }>

// type func = (state: state) => Promise<state>

export type eventName_ = eventName | string

export type singleData<eventName> = {
	eventName: eventName,
	scenarioName: any,

	getCommandFunc: any,
	// condition: (state: state) => boolean,
	// func: func,
}

// export type data<Data> = Record<event, func<Data>>
export type data<eventName> = Array<singleData<eventName>>

// export let getData = ([isEnterSceneFunc, isGirlNearBoxFunc]): data => {
export let getData = (state: state): data<eventName_> => {
	return [
		{
			eventName: eventName.WildGiantessAppear,
			scenarioName: scenarioName.WildGiantessAppear,
			getCommandFunc: getCommand,
			// func: (state: state) => {
			// 	state = execute(state, getCommand, scenarioName.WildGiantessAppear)

			// 	return Promise.resolve(state)
			// },
		},
		{
			eventName: eventName.EnemyGiantessAppear,
			scenarioName: scenarioName.EnemyGiantessAppear,
			getCommandFunc: getCommand,
			// func: (state: state) => {
			// 	state = execute(state, getCommand, scenarioName.EnemyGiantessAppear)

			// 	return Promise.resolve(state)
			// },
		},
		// {
		// 	eventName: eventName.CallGiantess,
		// 	scenarioName: scenarioName.CallGiantess,
		// 	getCommandFunc: getCommand,
		// },
		// {
		// 	eventName: eventName.CallGoddess,
		// 	scenarioName: scenarioName.CallGoddess,
		// 	getCommandFunc: getCommand,
		// },
		{
			eventName: eventName.EnemyReinforceReach,
			scenarioName: scenarioName.EnemyReinforceReach,
			getCommandFunc: getCommand,
		},
		{
			eventName: eventName.EnemyFireSupport,
			scenarioName: scenarioName.EnemyFireSupport,
			getCommandFunc: getCommand,
		},
		// {
		// 	eventName: eventName.Hard,
		// 	scenarioName: scenarioName.Hard,
		// 	getCommandFunc: getCommand,
		// 	// func: (state: state) => {
		// 	// 	state = execute(state, getCommand, scenarioName.WildGiantessAppear)

		// 	// 	return Promise.resolve(state)
		// 	// },
		// },
		// {
		// 	eventName: eventName.EnemyAddRandomBuff,
		// 	scenarioName: scenarioName.EnemyAddRandomBuff,
		// 	getCommandFunc: getCommand,
		// },
		// {
		// 	eventName: eventName.EnterCity,
		// 	// condition: (state, usedGirl) => {
		// 	// 	return isEnterSceneFunc(state)
		// 	// },
		// 	func: (state: state) => {
		// 		state = execute(state, getCommand, scenarioName.EnterCity)

		// 		return Promise.resolve(state)
		// 	},
		// 	// repeatCount: 1,
		// },
		// {
		// 	event: event.FindNewCityzen,
		// 	condition: (state, usedGirl) => {
		// 		const distance = 100

		// 		// return isGirlNearBoxFunc(state, [460, 0, 60], distance)
		// 		// 	|| isGirlNearBoxFunc(state, [460, 0, 420], distance)
		// 		// 	|| isGirlNearBoxFunc(state, [460, 0, -170], distance)
		// 		// return isGirlNearBoxFunc(state, new Box3(_v1.set(400,0,490), _v2.set(472, 1, -205)))
		// 		return isGirlNearBoxFunc(state, new Box3().setFromCenterAndSize(
		// 			_v1.set(460, 0, 105),
		// 			_v2.set(20, 1, 600,)
		// 		), distance)
		// 	},
		// 	func: (state: state) => {
		// 		state = execute(state, scenarioName.FindNewCityzen)

		// 		return Promise.resolve(state)
		// 	},
		// 	// repeatCount: 1,
		// },
	]
		.concat(
			getAllGameEventData(state)
		)
	// {
	// 	[event.EnterCity]: (state: state, data) => {
	// 		state = execute(state, scenarioName.EnterCity)

	// 		return Promise.resolve(state)
	// 	},
	// 	[event.FindNewCityzen]: (state: state, data) => {
	// 		state = execute(state, scenarioName.FindNewCityzen)

	// 		return Promise.resolve(state)
	// 	}
	// }
}