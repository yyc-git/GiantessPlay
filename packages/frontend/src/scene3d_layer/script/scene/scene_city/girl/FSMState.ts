import { fsm_state, stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"
import { buildNameByUsedGirl, getHp, getUsedGirlData, hasUsedGirlData, setLastStressingTime, setUsedGirlData, triggerAction } from "./Girl"
import { actionName, animationName, excitement } from "../data/DataType"
import { collisionPart, objectStateName, pose, usedGirl } from "../type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, getDestroyedEventName, getGirlDestroyingEventName } from "../utils/EventUtils"
import { buildGiantessStubData, getGiantessStressingEventName, getMissionCompleteEventName, getMissionFailEventName } from "../../../../utils/EventUtils"
import { isControlledState, isNotDamageState } from "../utils/FSMStateUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getCelebrateSoundResourceId, getDeathSoundResourceId, getFailSoundResourceId, getHeavyStressingBreastSoundResourceId, getHeavyStressingSoundResourceId, getHeavyStressingTrigoneAndButtSoundResourceId, getHeightMapResourceId, isGiantessCharacterType } from "../CityScene"
import { getIsDebug } from "../../Scene"
import { getGirlVolume, playGiantessVoice } from "../utils/SoundUtils"
import { addExcitement } from "./Excitement"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { changePose, getCurrentPose } from "./Pose"
import { computeGirlBoxAndNotChangeCenterXY, computeGirlBoxAndSetToState, getGirlPosition, getPivotWorldPosition, makeBoxToCenterInXYPlane } from "./Utils"
import { getBody } from "../data/mmd/MMDData"
import { getCurrentAnimationName, getDeathAnimationNames } from "./Animation"
import { getHeavyStressingBlockService, getHeavyStressingBreastBlockService, getHeavyStressingTrigoneAndButtBlockService, getInsertBlockService, getKeepUBBlockService, getSitDeathBlockService, getThrustBlockService, getUBHeavyStressingBlockService, isSkillState as isSkillStateMod } from "../../../../mod/SkillGiantessMod"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "block/src/Type"

export let getStateMachine = (state: state, usedGirl): nullable<stateMachine<state>> => {
	if (!hasUsedGirlData(state, usedGirl)) {
		return NullableUtils.getEmpty()
	}

	return getUsedGirlData(state, usedGirl).stateMachine
}

export let setStateMachine = (usedGirl) => (state: state, stateMachine) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		stateMachine: stateMachine
	})
}

export let createScenarioState = (usedGirl, animationName): fsm_state<state> => {
	return {
		name: objectStateName.Scenario,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			state = setUsedGirlData(state, usedGirl, {
				...getUsedGirlData(state, usedGirl),
				currentAnimationName: animationName
			})

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createInitialState = (): fsm_state<state> => {
	return {
		name: objectStateName.Initial,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			// state = computeGirlBoxAndSetToState(state, usedGirl)

			// state = setUsedGirlData(state, usedGirl,{
			// 	...getUsedGirlData(state, usedGirl),
			// 	currentAnimationName: animationName.Idle,
			// })

			// state = changePose(state, usedGirl, pose.Stand)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

export let createIdleState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Idle,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			state = computeGirlBoxAndNotChangeCenterXY(state, usedGirl)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

// export let createWalkState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Walk,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Walk
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createRunState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Run,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Run
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createStompState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Stomp,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Stomp
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createStandToCrawl = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.StandToCrawl,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.StandToCrawl,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createCrawlToStandState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.CrawlToStand,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.CrawlToStand,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

export let createKeepCrawlState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.KeepCrawl,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			// state = setUsedGirlData(state, usedGirl,{
			// 	...getUsedGirlData(state, usedGirl),
			// 	currentAnimationName: animationName.KeepCrawl,
			// })

			state = changePose(state, usedGirl, pose.Crawl)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

// export let createBreastPressState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.BreastPress,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.BreastPress,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createCrawlMoveState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.CrawlMove,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.CrawlMove,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }


// export let createPickupState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Pickup,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Pickup,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

export let createKeepPickState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.KeepPick,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			// state = setUsedGirlData(state, usedGirl,{
			// 	...getUsedGirlData(state, usedGirl),
			// 	currentAnimationName: animationName.KeepPick,
			// })

			state = changePose(state, usedGirl, pose.Pick)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => Promise.resolve(state),
	}
}

// export let createPinchState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Pinch,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Pinch,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createPickdownState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Pickdown,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Pickdown,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createEatState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Eat,
// 		enterFunc: (state) => Promise.resolve(state),
// 		executeFunc: (state, _) => {
// 			state = setUsedGirlData(state, usedGirl,{
// 				...getUsedGirlData(state, usedGirl),
// 				currentAnimationName: animationName.Eat,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

// export let createStressingState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Stressing,
// 		enterFunc: (state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, true))
// 		},
// 		executeFunc: (state, collisionPart_: collisionPart) => {
// 			// state = markIsRunning(state, usedGirl,false)

// 			let action, soundId, volumnFactor, excitement_
// 			switch (collisionPart_) {
// 				case collisionPart.LeftBreast:
// 				case collisionPart.RightBreast:
// 					switch (getCurrentPose(state, usedGirl)) {
// 						case pose.Stand:
// 						case pose.Pick:
// 							action = actionName.HeavyStressingBreast
// 							break
// 						case pose.Crawl:
// 							action = actionName.CrawlHeavyStressingBreast
// 							break
// 					}

// 					soundId = getHeavyStressingBreastSoundResourceId()

// 					excitement_ = excitement.High

// 					volumnFactor = 2

// 					break
// 				case collisionPart.TrigoneAndButt:
// 					switch (getCurrentPose(state, usedGirl)) {
// 						case pose.Stand:
// 						case pose.Pick:
// 							action = actionName.HeavyStressingTrigoneAndButt
// 							break
// 						case pose.Crawl:
// 							action = actionName.CrawlHeavyStressingTrigoneAndButt
// 							break
// 					}

// 					soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

// 					excitement_ = excitement.VeryHigh

// 					volumnFactor = 2
// 					break
// 				default:
// 					switch (getCurrentPose(state, usedGirl)) {
// 						case pose.Stand:
// 						case pose.Pick:
// 							action = actionName.HeavyStressing
// 							break
// 						case pose.Crawl:
// 							action = actionName.CrawlHeavyStressing
// 							break
// 					}

// 					soundId = getHeavyStressingSoundResourceId()

// 					excitement_ = excitement.Low

// 					volumnFactor = 1
// 					break
// 			}

// 			return triggerAction(state, usedGirl, action).then(([state, _]) => {
// 				state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
// 					SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), NumberUtils.clamp(getGirlVolume(state, usedGirl) * volumnFactor, 0, 1))
// 				))

// 				return addExcitement(state, usedGirl, excitement_)
// 			})
// 		},
// 		exitFunc: (state: state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, false))
// 		}
// 	}
// }

// export let createDestroyedState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Destroyed,
// 		enterFunc: (state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, true))
// 		},
// 		executeFunc: (state, _) => {
// 			if (isGiantessCharacterType(state)) {
// 				return GiantessFSMState.destroyedStateExecute(state)
// 			}
// 			else {
// 				return LittleManFSMState.destroyedStateExecute(state)
// 			}
// 		},
// 		exitFunc: (state: state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, false))
// 		}
// 	}
// }

let _switchToDestroyedState = (state: state, createDestroyedStateFunc, usedGirl) => {
	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		// if (getDeathAnimationNames(state).includes(getCurrentAnimationName(state, usedGirl))) {
		// 	let promise
		// 	switch (getCurrentPose(state, usedGirl)) {
		// 		case pose.Stand:
		// 		case pose.Pick:
		// 			promise = triggerAction(state, usedGirl, actionName.Death)
		// 			break
		// 		case pose.Crawl:
		// 			promise = triggerAction(state, usedGirl, actionName.CrawlDeath)
		// 			break
		// 		case pose.Sit:
		// 			promise = triggerAction(state, usedGirl, getSitDeathBlockService(state).getActionName())
		// 			break
		// 		default:
		// 			promise = Promise.resolve(state)
		// 			break
		// 	}

		// 	return promise.then(state => {
		// 		return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createDestroyedStateFunc(), null)
		// 	})
		// }
		if (!isSkillState(state, usedGirl)) {
			let promise
			switch (getCurrentPose(state, usedGirl)) {
				case pose.Stand:
				case pose.Pick:
					promise = triggerAction(state, usedGirl, actionName.Death)
					break
				case pose.Crawl:
					promise = triggerAction(state, usedGirl, actionName.CrawlDeath)
					break
				case pose.Sit:
					promise = triggerAction(state, usedGirl, getSitDeathBlockService(state).getActionName())
					break
				default:
					promise = Promise.resolve(state)
					break
			}

			return promise.then(([state, _]) => {
				let stateMachine = getStateMachine(state, usedGirl)

				// return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
				return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
					return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine(usedGirl), stateMachine, createDestroyedStateFunc(usedGirl), NullableUtils.getEmpty())
					// }, 300))
				}, 5))
			})
		}

		return Promise.resolve(_switchToDestroyedState(state, createDestroyedStateFunc, usedGirl))
		// }, 300))
	}, 50))
}

export let executeDestroying = (state: state, createDestroyedStateFunc, usedGirl: usedGirl) => {
	state = playGiantessVoice(state, usedGirl, getDeathSoundResourceId())
	state = _switchToDestroyedState(state, createDestroyedStateFunc, usedGirl)

	return Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null)
}

export let executeStressing = (state, usedGirl, collisionPart_, fromName) => {
	let action, soundId, volumnFactor, excitement_
	switch (getCurrentAnimationName(state, usedGirl)) {
		case getKeepUBBlockService(state).getForceAnimationName():
		case getThrustBlockService(state).getForceAnimationName():
		case getInsertBlockService(state).getForceAnimationName():
			action = getUBHeavyStressingBlockService(state).getActionName()

			soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

			excitement_ = excitement.VeryHigh

			volumnFactor = 2

			break
		default:
			switch (collisionPart_) {
				case collisionPart.LeftBreast:
				case collisionPart.RightBreast:
					switch (getCurrentPose(state, usedGirl)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressingBreast
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressingBreast
							break
						case pose.Sit:
							action = getHeavyStressingBreastBlockService(state).getActionName()
							break
					}

					soundId = getHeavyStressingBreastSoundResourceId()

					excitement_ = excitement.High

					volumnFactor = 2

					break
				case collisionPart.TrigoneAndButt:
					switch (getCurrentPose(state, usedGirl)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressingTrigoneAndButt
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressingTrigoneAndButt
							break
						case pose.Sit:
							action = getHeavyStressingTrigoneAndButtBlockService(state).getActionName()
							break
					}

					soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

					excitement_ = excitement.VeryHigh

					volumnFactor = 2
					break
				default:
					switch (getCurrentPose(state, usedGirl)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressing
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressing
							break
						case pose.Sit:
							action = getHeavyStressingBlockService(state).getActionName()
							break
					}

					soundId = getHeavyStressingSoundResourceId()

					excitement_ = excitement.Low

					volumnFactor = 1
					break
			}
	}

	return triggerAction(state, usedGirl, action).then(([state, _]) => {
		state = playGiantessVoice(state, usedGirl, soundId, NumberUtils.clamp(getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)) * volumnFactor, 0, 1))

		return addExcitement(state, usedGirl, excitement_)
	}).then(state => {
		return Event.trigger(state, getAbstractState, getGiantessStressingEventName(), buildGiantessStubData(fromName))
	})
}

export let handleStressingStateExit = (state, usedGirl) => {
	return setLastStressingTime(state, usedGirl)
}

// export let createDestroyingState = (): fsm_state<state> => {
// 	return {
// 		name: objectStateName.Destroying,
// 		enterFunc: (state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, true))
// 		},
// 		executeFunc: (state, _) => {
// 			return Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null)
// 		},
// 		exitFunc: (state: state) => {
// 			if (isGiantessCharacterType(state)) {
// 				return Promise.resolve(state)
// 			}

// 			return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, false))
// 		}
// 	}
// }

// export let isSkillState = (stateMachine) => {
export let isSkillState = (state: state, usedGirl) => {
	// return StateMachine.isState(stateMachine, objectStateName.Stomp)
	// 	// || StateMachine.isState(stateMachine, objectStateName.CrawlMove)
	// 	// || StateMachine.isState(stateMachine, objectStateName.KeepCrawl)
	// 	|| StateMachine.isState(stateMachine, objectStateName.BreastPress)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Pinch)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Eat)

	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickup)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickdown)

	switch (getCurrentAnimationName(state, usedGirl)) {
		// case animationName.Stomp:
		// case animationName.BreastPress:
		case animationName.Pinch:
		case animationName.Eat:
		case animationName.Pickup:
		case animationName.Pickdown:

		case animationName.StandToCrawl:
		case animationName.CrawlToStand:
			return true
		default:
			return isSkillStateMod(state, usedGirl, getCurrentAnimationName(state, usedGirl))
	}
}

export let isChangeCrawlPoseState = (state: state, usedGirl) => {
	// return StateMachine.isState(stateMachine, objectStateName.StandToCrawl)
	// 	|| StateMachine.isState(stateMachine, objectStateName.CrawlToStand)
	// // || StateMachine.isState(stateMachine, objectStateName.Pickup)
	// // || StateMachine.isState(stateMachine, objectStateName.Pickdown)

	switch (getCurrentAnimationName(state, usedGirl)) {
		case animationName.StandToCrawl:
		case animationName.CrawlToStand:
			return true
		default:
			return false
	}
}

export let update = (state: state, createDestroyingStateFunc, usedGirl: usedGirl) => {
	let stateMachine = getStateMachine(state, usedGirl)

	if (isChangeCrawlPoseState(state, usedGirl)) {
		state = computeGirlBoxAndSetToState(state, usedGirl)
	}

	if (getHp(state, usedGirl, getBody()) <= 0
		&& isNotDamageState(stateMachine)
		&& !isControlledState(state, stateMachine)
		// && !isSkillState(state, usedGirl)
	) {
		return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
			return setStateMachine(usedGirl)(state, stateMachine)
		}, stateMachine, createDestroyingStateFunc(usedGirl), buildNameByUsedGirl(usedGirl), null)
	}

	return Promise.resolve(state)
}