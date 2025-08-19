import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../../type/StateType"
import { collisionPart, objectStateName } from "../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { getCurrentAnimationName } from "../../../girl/Animation"
import { backToHang, getLeftFootIKBone, getRightFootIKBone, isLeftFootIKBone, isRightFootIKBone, handleChangeToStressing } from "../../../data/biwu/level2/behaviour_tree_data/action_node/LightStomp"
import { triggerAction } from "../Girl"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getGirlVolume } from "../../../utils/SoundUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { addExcitement } from "../../../girl/Excitement"
import { excitement } from "../../../data/DataType"
import { getIdExn, markFinish, markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import { triggerMainEvent } from "../../../game_event/GameEvent"
// import { markIsRunning } from "../../../utils/BehaviourManagerUtils"
import * as GameEventData from "../../../data/biwu/level2/GameEventData"
import { Flow } from "meta3d-jiehuo-abstract"
import { getHeavyStressingSoundResourceId } from "./ManageScene"

let _playSoundAndTriggerGameEvent = (state: state) => {
	const volumnFactor = 1

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
		SoundManager.buildNeedToPlaySoundData(getHeavyStressingSoundResourceId(), getIsDebug(state), NumberUtils.clamp(getGirlVolume(state) * volumnFactor, 0, 1))
	))

	state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
		return triggerMainEvent(state, GameEventData.eventName.Stressing)
	}, 1))

	return state
}

let _handleLightStomp = (state: state, [
	getBoneFunc, isFootIKBoneFunc,
],
	action
) => {
	const time = 100

	state = handleChangeToStressing(state)

	state = backToHang(state,
		[getBoneFunc, isFootIKBoneFunc, state => {
			return triggerAction(state, action).then(([state, _]) => {
				state = _playSoundAndTriggerGameEvent(state)

				return addExcitement(state, excitement.High)
			})
		}],
		time
	)

	return Promise.resolve(state)
}

export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, _) => {
			// state = markIsRunning(state, false)

			switch (getCurrentAnimationName(state)) {
				case animationName.KeepRightLightStomp:
					return _handleLightStomp(state, [
						getRightFootIKBone, isRightFootIKBone
					],
						actionName.HeavyStressingRightLightStomp
					)
				case animationName.KeepLeftLightStomp:
					return _handleLightStomp(state, [
						getLeftFootIKBone, isLeftFootIKBone
					],
						actionName.HeavyStressingLeftLightStomp
					)
				default:
					return triggerAction(state, actionName.HeavyStressing).then(([state, _]) => {
						state = _playSoundAndTriggerGameEvent(state)

						return addExcitement(state, excitement.Middle)
					})
			}

		},
		exitFunc: (state: state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

// export let isChangePoseState = (state: state) => {
// 	switch (getCurrentAnimationName(state)) {
// 		case animationName.HangRightLightStomp:
// 		case animationName.HangLeftLightStomp:
// 			return true
// 		default:
// 			return false
// 	}
// }