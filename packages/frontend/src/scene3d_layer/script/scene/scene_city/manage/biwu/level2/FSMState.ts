import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../../type/StateType"
import { collisionPart, objectStateName, usedGirl } from "../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { getCurrentAnimationName } from "../../../girl/Animation"
import { backToHang, getLeftFootIKBone, getRightFootIKBone, isLeftFootIKBone, isRightFootIKBone, handleChangeToStressing } from "../../../data/biwu/level2/behaviour_tree_data/action_node/LightStomp"
import { triggerAction } from "../Girl"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getGirlVolume, playGiantessVoice } from "../../../utils/SoundUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { addExcitement } from "../../../girl/Excitement"
import { excitement } from "../../../data/DataType"
import { getIdExn, markFinish, markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import { triggerMainEvent } from "../../../game_event/GameEvent"
// import { markIsRunning } from "../../../utils/BehaviourManagerUtils"
import * as GameEventData from "../../../data/biwu/level2/GameEventData"
import { Flow } from "meta3d-jiehuo-abstract"
import { getHeavyStressingSoundResourceId } from "./ManageScene"
import { generateReward } from "../../../reward/RewardGenerator"
import { buildStressingName } from "../../../data/biwu/level2/reward/RewardData"
import { getRewardPropPosition } from "../Reward"
import { getRewardPropOffset } from "./Reward"
import { handleStressingStateExit } from "../../../girl/FSMState"
import { getPivotWorldPosition } from "../../../girl/Utils"
import { Event } from "meta3d-jiehuo-abstract"
import { buildGiantessStubData, getGiantessStressingEventName } from "../../../../../../utils/EventUtils"
import { buildNameByUsedGirl } from "../../../girl/Girl"

let _playSoundAndTriggerGameEvent = (state: state, usedGirl) => {
	const volumnFactor = 1

	// state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
	// 	SoundManager.buildNeedToPlaySoundData(getHeavyStressingSoundResourceId(), getIsDebug(state), NumberUtils.clamp(getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)) * volumnFactor, 0, 1))
	// ))
	state = playGiantessVoice(state, usedGirl, getHeavyStressingSoundResourceId(), NumberUtils.clamp(getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)) * volumnFactor, 0, 1))

	state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
		return triggerMainEvent(state, GameEventData.eventName.Stressing)
	}, 1))

	return state
}

let _handleLightStomp = (state: state, [
	getBoneFunc, isFootIKBoneFunc,
], usedGirl: usedGirl,
	action
) => {
	const time = 100

	state = handleChangeToStressing(state)

	state = backToHang(state,
		[getBoneFunc, isFootIKBoneFunc, state => {
			return triggerAction(state, usedGirl, action).then(([state, _]) => {
				state = _playSoundAndTriggerGameEvent(state, usedGirl)

				return addExcitement(state, usedGirl, excitement.High)
			})
		}], usedGirl,
		time
	)

	return Promise.resolve(state)
}

export let createStressingState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, true))
		},
		executeFunc: (state, [_, fromName, damagePosition]) => {
			// state = markIsRunning(state, usedGirl,false)
			return Event.trigger(state, getAbstractState, getGiantessStressingEventName(), buildGiantessStubData(fromName))
				.then(state => {
					state = generateReward(state, fromName, buildStressingName(), buildNameByUsedGirl(usedGirl), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))

					switch (getCurrentAnimationName(state, usedGirl)) {
						case animationName.KeepRightLightStomp:
							return _handleLightStomp(state, [
								getRightFootIKBone, isRightFootIKBone
							], usedGirl,
								actionName.HeavyStressingRightLightStomp
							)
						case animationName.KeepLeftLightStomp:
							return _handleLightStomp(state, [
								getLeftFootIKBone, isLeftFootIKBone
							], usedGirl,
								actionName.HeavyStressingLeftLightStomp
							)
						default:
							return triggerAction(state, usedGirl, actionName.HeavyStressing).then(([state, _]) => {
								state = _playSoundAndTriggerGameEvent(state, usedGirl)

								return addExcitement(state, usedGirl, excitement.Middle)
							})
					}

				})
		},
		exitFunc: (state: state) => {
			state = handleStressingStateExit(state, usedGirl)

			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, false))
		}
	}
}

// export let isChangePoseState = (state: state) => {
// 	switch (getCurrentAnimationName(state, usedGirl)) {
// 		case animationName.HangRightLightStomp:
// 		case animationName.HangLeftLightStomp:
// 			return true
// 		default:
// 			return false
// 	}
// }