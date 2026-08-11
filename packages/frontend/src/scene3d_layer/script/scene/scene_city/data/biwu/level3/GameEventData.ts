import { Box3, Vector3 } from "three"
import { data } from "../../GameEventData";
import { state } from "../../../../../../type/StateType";
import { execute } from "../../../scenario/ScenarioManager";
import { scenarioName } from "./ScenarioData";
import { getCommand } from "../../../manage/biwu/level3/scenario/Command";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
	GoToTrigone = "GoToTrigone",
	ReachTrigone = "ReachTrigone",

	OnlyAddArmy = "OnlyAddArmy",

	RightHandAddArmy = "RightHandAddArmy",
	RightHandOnePointAttack = "RightHandOnePointAttack",
	RightHandBeatAttack = "RightHandBeatAttack",

	// LeftHandRightHand = "LeftHandRightHand",

	TwoHandsOneFingerAttack = "TwoHandsOneFingerAttack",
	TwoHandsBeatAttack = "TwoHandsBeatAttack",



	HitLeftNipple = "HitLeftNipple",
	HitRightNipple = "HitRightNipple",

	Stressing = "Stressing",
}

export let getData = (): data<eventName> => {
	return [
		{
			eventName: eventName.GoToTrigone,
			scenarioName: scenarioName.GoToTrigone,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.ReachTrigone,
			scenarioName: scenarioName.ReachTrigone,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.OnlyAddArmy,
			scenarioName: scenarioName.OnlyAddArmy,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.RightHandAddArmy,
			scenarioName: scenarioName.RightHandAddArmy,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.RightHandOnePointAttack,
			scenarioName: scenarioName.RightHandOnePointAttack,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.RightHandBeatAttack,
			scenarioName: scenarioName.RightHandBeatAttack,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.TwoHandsOneFingerAttack,
			scenarioName: scenarioName.TwoHandsOneFingerAttack,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.TwoHandsBeatAttack,
			scenarioName: scenarioName.TwoHandsBeatAttack,
			getCommandFunc:getCommand,
		},


		{
			eventName: eventName.HitRightNipple,
			scenarioName: scenarioName.HitRightNipple,
			getCommandFunc:getCommand,
		},
		{
			eventName: eventName.HitLeftNipple,
			scenarioName: scenarioName.HitLeftNipple,
			getCommandFunc:getCommand,
		},

		{
			eventName: eventName.Stressing,
			scenarioName: scenarioName.Stressing,
			getCommandFunc:getCommand,
		},
	]
}