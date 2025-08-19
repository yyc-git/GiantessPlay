import { Box3, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { scenarioName } from "./ScenarioData"
import { execute } from "../scenario/ScenarioManager"
import { getCommand } from "../scenario/Command";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
	EnterCity = "EnterCity",
}

// type func<Data> = (state: state, data: Data) => Promise<state>

// // export type data<Data> = Record<event, func<Data>>
// export type data<Data> = Array<{
// 	event: event,
// 	condition: (state: state) => boolean,
// 	func: func<Data>,
// 	repeatCount?: number,
// }>

type func = (state: state) => Promise<state>

// export type data<Data> = Record<event, func<Data>>
export type data<eventName> = Array<{
	eventName: eventName,
	// condition: (state: state) => boolean,
	func: func,
}>

// export let getData = ([isEnterSceneFunc, isGirlNearBoxFunc]): data => {
export let getData = (): data<eventName> => {
	return [
		{
			eventName: eventName.EnterCity,
			// condition: state => {
			// 	return isEnterSceneFunc(state)
			// },
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.EnterCity)

				return Promise.resolve(state)
			},
			// repeatCount: 1,
		},
		// {
		// 	event: event.FindNewCityzen,
		// 	condition: state => {
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