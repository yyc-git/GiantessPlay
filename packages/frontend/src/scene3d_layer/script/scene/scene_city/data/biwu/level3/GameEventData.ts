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
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.GoToTrigone)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.ReachTrigone,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.ReachTrigone)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.OnlyAddArmy,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.OnlyAddArmy)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.RightHandAddArmy,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.RightHandAddArmy)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.RightHandOnePointAttack,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.RightHandOnePointAttack)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.RightHandBeatAttack,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.RightHandBeatAttack)

				return Promise.resolve(state)
			},
		},
		// {
		// 	eventName: eventName.LeftHandRightHand,
		// 	func: (state: state) => {
		// 		state = execute(state, getCommand, scenarioName.LeftHandRightHand)

		// 		return Promise.resolve(state)
		// 	},
		// },
		{
			eventName: eventName.TwoHandsOneFingerAttack,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.TwoHandsOneFingerAttack)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.TwoHandsBeatAttack,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.TwoHandsBeatAttack)

				return Promise.resolve(state)
			},
		},


		{
			eventName: eventName.HitRightNipple,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.HitRightNipple, false)

				return Promise.resolve(state)
			},
		},
		{
			eventName: eventName.HitLeftNipple,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.HitLeftNipple, false)

				return Promise.resolve(state)
			},
		},

		{
			eventName: eventName.Stressing,
			func: (state: state) => {
				state = execute(state, getCommand, scenarioName.Stressing, false)

				return Promise.resolve(state)
			},
		},
	]
}