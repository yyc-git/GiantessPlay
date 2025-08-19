import { Box3, Vector3 } from "three"
import { data } from "../../GameEventData";
import { state } from "../../../../../../type/StateType";
import { execute } from "../../../scenario/ScenarioManager";
import { scenarioName } from "./ScenarioData";
import { getCommand } from "../../../manage/biwu/level2/scenario/Command";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
	Begin = "Begin",
	Stressing = "Stressing",
	Hard = "Hard",
	PickdownArmy_Normal = "PickdownArmy_Normal",
	PickdownArmy_Hard = "PickdownArmy_Hard",
}

export let getData = (): data<eventName> => {
	return [
		{
			eventName: eventName.Begin,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.Begin)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.Stressing,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.Stressing)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.PickdownArmy_Normal,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy_Normal)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.PickdownArmy_Hard,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy_Hard)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.Hard,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.Hard)

				return Promise.resolve(state)
			},
		},
	]
}