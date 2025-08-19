import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"
import { getGirlState, getHp, getName, setGirlState, triggerAction } from "./Girl"
import { actionName, animationName, excitement } from "../data/DataType"
import { collisionPart, objectStateName, pose } from "../type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, getDestroyedEventName, getGirlDestroyingEventName } from "../utils/EventUtils"
import { getMissionCompleteEventName, getMissionFailEventName } from "../../../../utils/EventUtils"
import { isNotDamageState } from "../utils/FSMStateUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getCelebrateSoundResourceId, getDeathSoundResourceId, getFailSoundResourceId, getHeavyStressingBreastSoundResourceId, getHeavyStressingTrigoneAndButtSoundResourceId, getHeightMapResourceId, isGiantessRoad } from "../CityScene"
import { getIsDebug } from "../../Scene"
import { getGirlVolume } from "../utils/SoundUtils"
import { addExcitement } from "./Excitement"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { changePose, getCurrentPose } from "./Pose"
import { computeGirlBox } from "./Utils"
import * as GiantessFSMState from "./giantess/FSMState"
import * as LittleManFSMState from "./little_man/FSMState"
import { getBody } from "../data/mmd/MMDData"
import { getCurrentAnimationName } from "./Animation"
import { getHeavyStressingSoundResourceId } from "../manage/city1/ManageScene"
import { markWhetherNotExecuteGiantessAI } from "../behaviour_tree/BehaviourTreeManager"
// import { markIsRunning } from "../utils/BehaviourManagerUtils"

export let getStateMachine = (state: state) => {
	return getGirlState(state).stateMachine
}

export let setStateMachine = (state: state, stateMachine) => {
	return setGirlState(state, {
		...getGirlState(state),
		stateMachine: stateMachine
	})
}

export let createScenarioState = (animationName): fsm_state<state> => {
	return {
		name: objectStateName.Scenario,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			state = setGirlState(state, {
				...getGirlState(state),
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
			// state = setGirlState(state, {
			// 	...getGirlState(state),
			// 	currentAnimationName: animationName.Idle,
			// })

			// state = changePose(state, pose.Stand)

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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
// 				currentAnimationName: animationName.CrawlToStand,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

export let createKeepCrawlState = (): fsm_state<state> => {
	return {
		name: objectStateName.KeepCrawl,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			// state = setGirlState(state, {
			// 	...getGirlState(state),
			// 	currentAnimationName: animationName.KeepCrawl,
			// })

			state = changePose(state, pose.Crawl)

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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
// 				currentAnimationName: animationName.Pickup,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

export let createKeepPickState = (): fsm_state<state> => {
	return {
		name: objectStateName.KeepPick,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			// state = setGirlState(state, {
			// 	...getGirlState(state),
			// 	currentAnimationName: animationName.KeepPick,
			// })

			state = changePose(state, pose.Pick)

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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
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
// 			state = setGirlState(state, {
// 				...getGirlState(state),
// 				currentAnimationName: animationName.Eat,
// 			})

// 			return Promise.resolve(state)
// 		},
// 		exitFunc: (state: state) => Promise.resolve(state),
// 	}
// }

export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, collisionPart_: collisionPart) => {
			// state = markIsRunning(state, false)

			let action, soundId, volumnFactor, excitement_
			switch (collisionPart_) {
				case collisionPart.LeftBreast:
				case collisionPart.RightBreast:
					switch (getCurrentPose(state)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressingBreast
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressingBreast
							break
					}

					soundId = getHeavyStressingBreastSoundResourceId()

					excitement_ = excitement.High

					volumnFactor = 2

					break
				case collisionPart.TrigoneAndButt:
					switch (getCurrentPose(state)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressingTrigoneAndButt
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressingTrigoneAndButt
							break
					}

					soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

					excitement_ = excitement.VeryHigh

					volumnFactor = 2
					break
				default:
					switch (getCurrentPose(state)) {
						case pose.Stand:
						case pose.Pick:
							action = actionName.HeavyStressing
							break
						case pose.Crawl:
							action = actionName.CrawlHeavyStressing
							break
					}

					soundId = getHeavyStressingSoundResourceId()

					excitement_ = excitement.Low

					volumnFactor = 1
					break
			}

			return triggerAction(state, action).then(([state, _]) => {
				state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
					SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), NumberUtils.clamp(getGirlVolume(state) * volumnFactor, 0, 1))
				))

				return addExcitement(state, excitement_)
			})
		},
		exitFunc: (state: state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

export let createDestroyedState = (): fsm_state<state> => {
	return {
		name: objectStateName.Destroyed,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, _) => {
			if (isGiantessRoad(state)) {
				return GiantessFSMState.destroyedStateExecute(state)
			}
			else {
				return LittleManFSMState.destroyedStateExecute(state)
			}
		},
		exitFunc: (state: state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

export let executeDestroying = (state: state) => {
	let promise
	switch (getCurrentPose(state)) {
		case pose.Stand:
		case pose.Pick:
			promise = triggerAction(state, actionName.Death)
			break
		case pose.Crawl:
			promise = triggerAction(state, actionName.CrawlDeath)
			break
		default:
			promise = Promise.resolve(state)
			break
	}

	return promise.then(([state, _]) => {
		state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
			SoundManager.buildNeedToPlaySoundData(getDeathSoundResourceId(), getIsDebug(state), getGirlVolume(state))
		))

		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
			return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createDestroyedState(), null)
		}, 100))
	})
}

export let createDestroyingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Destroying,
		enterFunc: (state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, true))
		},
		executeFunc: (state, _) => {
			return Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null)
		},
		exitFunc: (state: state) => {
			return Promise.resolve(markWhetherNotExecuteGiantessAI(state, false))
		}
	}
}

// export let isSkillState = (stateMachine) => {
export let isSkillState = (state: state) => {
	// return StateMachine.isState(stateMachine, objectStateName.Stomp)
	// 	// || StateMachine.isState(stateMachine, objectStateName.CrawlMove)
	// 	// || StateMachine.isState(stateMachine, objectStateName.KeepCrawl)
	// 	|| StateMachine.isState(stateMachine, objectStateName.BreastPress)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Pinch)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Eat)

	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickup)
	// 	|| StateMachine.isState(stateMachine, objectStateName.Pickdown)

	switch (getCurrentAnimationName(state)) {
		case animationName.Stomp:
		case animationName.BreastPress:
		case animationName.Pinch:
		case animationName.Eat:
		case animationName.Pickup:
		case animationName.Pickdown:
			return true
		default:
			return false
	}
}

export let isChangeCrawlPoseState = (state: state) => {
	// return StateMachine.isState(stateMachine, objectStateName.StandToCrawl)
	// 	|| StateMachine.isState(stateMachine, objectStateName.CrawlToStand)
	// // || StateMachine.isState(stateMachine, objectStateName.Pickup)
	// // || StateMachine.isState(stateMachine, objectStateName.Pickdown)

	switch (getCurrentAnimationName(state)) {
		case animationName.StandToCrawl:
		case animationName.CrawlToStand:
			return true
		default:
			return false
	}
}

export let update = (state: state) => {
	let stateMachine = getStateMachine(state)

	if (isChangeCrawlPoseState(state)) {
		state = computeGirlBox(state)
	}

	if (getHp(state, getBody()) <= 0
		&& isNotDamageState(stateMachine)
		&& !isSkillState(state)
	) {
		return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
			return setStateMachine(state, stateMachine)
		}, stateMachine, createDestroyingState(), getName(), null)
	}

	return Promise.resolve(state)
}