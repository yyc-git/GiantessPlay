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
	// PickdownArmy2_1 = "PickdownArmy2_1",
	// PickdownArmy2_2 = "PickdownArmy2_2",
	// PickdownArmy3 = "PickdownArmy3",
	// StompLittleMan = "StompLittleMan",
}

export let getData = (): data<eventName> => {
	return [
		{
			eventName: eventName.Begin,
			scenarioName: scenarioName.Begin,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.PickdownArmy1,
			scenarioName: scenarioName.PickdownArmy1,
			getCommandFunc:getCommand,
		},
		// {
		// 	eventName: eventName.PickdownArmy2_1,
		// 	scenarioName: scenarioName.PickdownArmy2_1,
		// 	getCommandFunc:getCommand,
		// },
		// // {
		// // 	eventName: eventName.PickdownArmy2_2,
		// // 	scenarioName: scenarioName.PickdownArmy2_2,
		// // 	getCommandFunc:getCommand,
		// // },
		// {
		// 	eventName: eventName.PickdownArmy3,
		// 	scenarioName: scenarioName.PickdownArmy3,
		// 	getCommandFunc:getCommand,
		// },
		// {
		// 	eventName: eventName.StompLittleMan,
		// 	scenarioName: scenarioName.StompLittleMan,
		// 	getCommandFunc:getCommand,
		// },
	]
}