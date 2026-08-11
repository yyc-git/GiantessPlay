import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../type/StateType"
import { buildNameByUsedGirl, setNeedUpdateStatusDamagePart } from ".././Girl"
import { actionName, animationName, excitement } from "../../data/DataType"
import { collisionPart, objectStateName, pose, usedGirlEnum } from "../../type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { buildGiantessStatusUpdateEventNameEventData, getGiantessStatusUpdateEventName, getMissionCompleteEventName, getMissionFailEventName } from "../../../../../utils/EventUtils"
import { isNotDamageState } from "../../utils/FSMStateUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getCelebrateSoundResourceId, getDeathSoundResourceId, getFailSoundResourceId, getHeavyStressingBreastSoundResourceId, getHeavyStressingTrigoneAndButtSoundResourceId, getHeightMapResourceId, isGiantessCharacterType, restoreCameraFromSavedData } from "../../CityScene"
import { getIsDebug } from "../../../Scene"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
// import { markIsRunning } from "../../utils/BehaviourManagerUtils"
import * as GirlFSMState from "../FSMState"
import { buildDestroyedEventData, getDestroyedEventName, getGirlDestroyingEventName } from "../../utils/EventUtils"
import { handleLifeCount, isLifeCountWork, selectRandomNearArmyCrowdPoisition } from "../../StaticDynamic"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getPlayerPosition } from "../../utils/PlayerUtils"
import { computeGirlBoxAndSetToState, handlePickDataWhenExecuteDestroyed, setGirlPosition } from "../Utils"
import { getCurrentAnimationName, updateAnimation } from "../Animation"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { useThirdPersonControls } from "../../Camera"
import { MMD } from "meta3d-jiehuo-abstract"
import { disposePlayerData as disposeBuffData } from "../../buff/Buff"
import { triggerAction } from "./Girl"
import { resetPose } from "../Pose"
import { isCanActiveSmaller } from "../InitWhenImportScene"
import { getBody } from "../../data/mmd/MMDData"
import { swallowError } from "../../../../../../ui_layer/utils/ErrorUtils"
import { updateCharacterBackend, updateCharacterWhenNotAlive } from "../../character/Character"
import { playGiantessVoice } from "../../utils/SoundUtils"
import { restorePartialScale } from "../../utils/PartialScaleGiantessUtils"

export let createStressingState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			// if (isPlayerGirl(state, usedGirl)) {
			return Promise.resolve(state)
			// }

			// return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, [collisionPart_, _fromName, _]) => GirlFSMState.executeStressing(state, usedGirl, collisionPart_, _fromName),
		exitFunc: (state: state) => {
			state = GirlFSMState.handleStressingStateExit(state, usedGirl)


			// if (isPlayerGirl(state, usedGirl)) {
			return Promise.resolve(state)
			// }

			// return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

export let createDestroyedState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => {
			return Promise.resolve(state)
		},
		executeFunc: (state, _) => {
			return handlePickDataWhenExecuteDestroyed(state, usedGirl)
				.then(state => {
					state = resetPose(state, usedGirl)

					if (isLifeCountWork(state, buildNameByUsedGirl(usedGirl))) {
						state = handleLifeCount(state, buildNameByUsedGirl(usedGirl))

						return StateMachine.changeAndExecuteStateWithoutName(state, GirlFSMState.setStateMachine(usedGirl), GirlFSMState.getStateMachine(state, usedGirl), createRebornState(usedGirl), NullableUtils.return_(
							selectRandomNearArmyCrowdPoisition(state, getPlayerPosition(state))
						))
					}

					return disposeBuffData(state, buildNameByUsedGirl(usedGirl), NullableUtils.return_(usedGirlEnum.PlayerGirl))
						.then(state => {
							if (Camera.isCanLock(getAbstractState(state))) {
								state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
							}
							state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getFailSoundResourceId(), getIsDebug(state), 1, false)))

							// return Event.trigger<state>(state, getAbstractState, getMissionFailEventName(), null)
							return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(
								"unknown",
								buildNameByUsedGirl(usedGirl)))
						})
				})
		},
		exitFunc: (state: state) => {
			return Promise.resolve(state)
		}
	}
}

// export let executeDestroying = (state: state) => {
// 	let promise
// 	switch (getCurrentPose(state, usedGirl)) {
// 		case pose.Stand:
// 		case pose.Pick:
// 			promise = triggerAction(state, usedGirl, actionName.Death)
// 			break
// 		case pose.Crawl:
// 			promise = triggerAction(state, usedGirl, actionName.CrawlDeath)
// 			break
// 		default:
// 			promise = Promise.resolve(state)
// 			break
// 	}

// 	return promise.then(([state, _]) => {
// 		state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
// 			SoundManager.buildNeedToPlaySoundData(getDeathSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl))
// 		))

// 		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 			return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createDestroyedState(), null)
// 		}, 100))
// 	})
// }

export let createRebornState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Reborn,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, position) => {
			MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).resume()

			// state = resetPose(state)
			/*! update box when stand
			* 
			*/
			// state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
			// 	state = computeGirlBoxAndSetToState(state, usedGirl)

			// 	return Promise.resolve(state)
			// }, 1))

			state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
				state = setNeedUpdateStatusDamagePart(state, usedGirl, getBody())
				state = computeGirlBoxAndSetToState(state, usedGirl)

				state = restoreCameraFromSavedData(state)


				return Promise.resolve(state)
			}, 1))

			state = setGirlPosition(state, usedGirl, position)

			state = restorePartialScale(state, usedGirl)

			let promise
			// if (isScaleState(state, scaleState.Big)) {
			if (isCanActiveSmaller(state, usedGirl)) {
				promise = triggerAction(state, usedGirl, actionName.SmallerToLastBiggerCount).then(([state, _]) => state)
			}
			else {
				promise = Promise.resolve(state)
			}

			return promise.then(state => {
				return triggerAction(state, usedGirl, actionName.Reborn)
			})
				/*! make sure that change to Initial state
				* 
				*/
				.then(([state, _]) => updateAnimation(state, usedGirl))
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createDestroyingState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Destroying,
		enterFunc: (state) => {
			// if (isPlayerGirl(state, usedGirl)) {
			return Promise.resolve(state)
			// }

			// return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, _) => {
			// return Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null)
			// return GirlFSMState.executeDestroying(state, createDestroyedState)
			// .then(state => {
			// 	if (!isLifeCountWork(state, getName())) {
			// 		// return swallowError(updateCharacterAndBackendWhenNotAlive(state))
			// 		// return updateCharacterAndBackendWhenNotAlive(state)
			// 		return updateCharacterWhenNotAlive(state)
			// 	}

			// 	return state
			// })

			let promise
			// if (!isLifeCountWork(state, getName())) {
			// state = playGiantessVoice(state, usedGirl, getDeathSoundResourceId())

			// promise = Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null).then(state => {
			// 	return StateMachine.changeAndExecuteStateWithoutName(state, GirlFSMState.setStateMachine, GirlFSMState.getStateMachine(state, usedGirl), createDestroyedState(), null)
			// })
			// }
			// else {
			promise = GirlFSMState.executeDestroying(state, createDestroyedState, usedGirl)
			// }

			return promise.then(state => {
				/*! fix 死的时候依旧显示有一些血
				* 
				*/
				return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
					NullableUtils.getExn(getBody()),
					usedGirl
				))
			})
				.then(state => {
					if (!isLifeCountWork(state, buildNameByUsedGirl(usedGirl))) {
						state = updateCharacterWhenNotAlive(state)

						return swallowError(updateCharacterBackend(state))
					}

					return state
				})
		},
		exitFunc: (state: state) => {
			// if (isPlayerGirl(state, usedGirl)) {
			return Promise.resolve(state)
			// }

			// return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

// // export let isSkillState = (stateMachine) => {
// export let isSkillState = (state: state) => {
// 	// return StateMachine.isState(stateMachine, objectStateName.Stomp)
// 	// 	// || StateMachine.isState(stateMachine, objectStateName.CrawlMove)
// 	// 	// || StateMachine.isState(stateMachine, objectStateName.KeepCrawl)
// 	// 	|| StateMachine.isState(stateMachine, objectStateName.BreastPress)
// 	// 	|| StateMachine.isState(stateMachine, objectStateName.Pinch)
// 	// 	|| StateMachine.isState(stateMachine, objectStateName.Eat)

// 	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickup)
// 	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickdown)

// 	switch (getCurrentAnimationName(state, usedGirl)) {
// 		case animationName.Stomp:
// 		case animationName.BreastPress:
// 		case animationName.Pinch:
// 		case animationName.Eat:
// 		case animationName.Pickup:
// 		case animationName.Pickdown:
// 			return true
// 		default:
// 			return false
// 	}
// }

// export let isChangeCrawlPoseState = (state: state) => {
// 	// return StateMachine.isState(stateMachine, objectStateName.StandToCrawl)
// 	// 	|| StateMachine.isState(stateMachine, objectStateName.CrawlToStand)
// 	// // || StateMachine.isState(stateMachine, objectStateName.Pickup)
// 	// // || StateMachine.isState(stateMachine, objectStateName.Pickdown)

// 	switch (getCurrentAnimationName(state, usedGirl)) {
// 		case animationName.StandToCrawl:
// 		case animationName.CrawlToStand:
// 			return true
// 		default:
// 			return false
// 	}
// }

export let update = (state: state, usedGirl) => {
	return GirlFSMState.update(state, createDestroyingState, usedGirl)
}