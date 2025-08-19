import { Box3, Vector3 } from "three"
import { data } from "../../GameEventData";
import { state } from "../../../../../../type/StateType";
import { execute } from "../../../scenario/ScenarioManager";
import { scenarioName } from "./ScenarioData";
import { getCommand } from "../../../manage/biwu/level1/scenario/Command";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
	Begin = "Begin",
	PickdownArmy1 = "PickdownArmy1",
	PickdownArmy2_1 = "PickdownArmy2_1",
	PickdownArmy2_2 = "PickdownArmy2_2",
	PickdownArmy3 = "PickdownArmy3",
	StompLittleMan = "StompLittleMan",
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
			eventName: eventName.PickdownArmy1,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy1)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.PickdownArmy2_1,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy2_1)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.PickdownArmy2_2,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy2_2)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.PickdownArmy3,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.PickdownArmy3)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.StompLittleMan,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.StompLittleMan)

				return Promise.resolve(state)
			},
		},
	]
}