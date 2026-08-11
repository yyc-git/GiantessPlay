import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../../type/StateType"
import { collisionPart, objectStateName } from "../../../type/StateType"
import { getIdExn, markFinish, markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import * as GirlFSMState from "../../../girl/FSMState"
import { generateReward } from "../../../reward/RewardGenerator"
import { buildStressingName } from "../../../data/biwu/level1/reward/RewardData"
import { getRewardPropPosition } from "../Reward"
import { getRewardPropOffset } from "./Reward"
import { buildNameByUsedGirl } from "../../../girl/Girl"

export let createStressingState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, true))
		},
		// executeFunc: GirlFSMState.executeStressing,
		executeFunc: (state, [collisionPart_, fromName, damagePosition]) => {
			return GirlFSMState.executeStressing(state, usedGirl, collisionPart_, fromName).then(state => {
				return generateReward(state, fromName, buildStressingName(), buildNameByUsedGirl(usedGirl), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))
			})
		},
		exitFunc: (state: state) => {
			state = GirlFSMState.handleStressingStateExit(state, usedGirl)

			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, false))
		}
	}
}