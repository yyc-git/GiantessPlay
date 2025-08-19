// const _v1 = new Vector3();
// const _v2 = new Vector3();

import { getLittleManShootEmitEventName, getLittleManShootStartEventName, getLittleManStandupEndEventName, getLittleManStatusUpdateEventName, getLittleManSwipingEmitEventName, getLittleManSwipingStartEventName } from "../../../../utils/EventUtils"
import { getIsDebug } from "../../Scene"
import { animationBlendData } from "../data/DataType"
import { littleManActionState, objectStateName } from "../type/StateType"
import { getFirstFrameIndex, getLastFrameIndex } from "../utils/DataUtils"
import { getAnimationFrameCount } from "./Const"
import { actionName, animationName, animationCollisionData, track } from "./DataType"

let _getAllAnimationNamesExceptDeathAnimations = () => {
	return [
		animationName.Idle,
		animationName.Controlled,
		animationName.Run,
		animationName.Shake,
		animationName.Shoot,
		animationName.Swiping,
		animationName.Standup,
		animationName.Lie,
		animationName.ClimbToTop,
		animationName.ClimbToDown,
		// animationName.Death,
	]
}

export let getAnimationBlendData = (
	[{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, isEndFunc, isPreviousStateFunc]
): animationBlendData<animationName> => {
	return [
		{
			condition: state => {
				// return isEndFunc(state, animationName.Idle, getIsDebug(state))
				return isMoveFunc(state)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Run,
			weight: 0.1,
		},

		{
			condition: state => {
				return !isMoveFunc(state)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Idle,
			weight: 0.1,
		},


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Shoot)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Shoot,
			// weight: 0.5,
			weight: 0.1,
			// noBlend: true,
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Shoot)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Shoot,
			weight: 0.5,
			// noBlend: true,
		},
		{
			condition: state => {
				// return isEndFunc(state, animationName.Shoot, getIsDebug(state)) && isActionStateFunc(state, littleManActionState.Initial)
				return isActionStateFunc(state, littleManActionState.Initial)
			},
			currentAnimationNames: [animationName.Shoot],
			nextAnimationName: animationName.Idle,
			weight: 0.5,
			// noBlend: true
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Swiping)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Swiping,
			// weight: 0.5,
			weight: 0.1,
			// noBlend: true,
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Swiping)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Swiping,
			weight: 0.5,
			// noBlend: true,
		},
		{
			condition: state => {
				// return isEndFunc(state, animationName.Swiping, getIsDebug(state)) && isActionStateFunc(state, littleManActionState.Initial)
				return isActionStateFunc(state, littleManActionState.Initial)
			},
			currentAnimationNames: [animationName.Swiping],
			nextAnimationName: animationName.Idle,
			weight: 0.5,
			// noBlend: true
		},




		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Controlled)
			},
			// currentAnimationNames: [animationName.Idle],
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			nextAnimationName: animationName.Controlled,
			noBlend: true
		},
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Controlled)
		// 	},
		// 	currentAnimationNames: [animationName.Run],
		// 	nextAnimationName: animationName.Controlled,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Controlled)
		// 	},
		// 	currentAnimationNames: [animationName.Shoot],
		// 	nextAnimationName: animationName.Controlled,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Controlled)
		// 	},
		// 	currentAnimationNames: [animationName.Swiping],
		// 	nextAnimationName: animationName.Controlled,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Controlled)
		// 	},
		// 	currentAnimationNames: [animationName.Standup],
		// 	nextAnimationName: animationName.Controlled,
		// 	noBlend: true
		// },


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Lie)
			},
			// currentAnimationNames: [animationName.Idle],
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			nextAnimationName: animationName.Lie,
			noBlend: true,
			weight: 0.0,
		},
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Lie)
		// 	},
		// 	currentAnimationNames: [animationName.Run],
		// 	nextAnimationName: animationName.Lie,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Lie)
		// 	},
		// 	currentAnimationNames: [animationName.Shoot],
		// 	nextAnimationName: animationName.Lie,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Lie)
		// 	},
		// 	currentAnimationNames: [animationName.Swiping],
		// 	nextAnimationName: animationName.Lie,
		// 	noBlend: true
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Lie)
		// 	},
		// 	currentAnimationNames: [animationName.Standup],
		// 	nextAnimationName: animationName.Lie,
		// 	noBlend: true
		// },


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.ClimbToTop)
			},
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			nextAnimationName: animationName.ClimbToTop,
			noBlend: true,
			weight: 0.0,
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.ClimbToDown)
			},
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			nextAnimationName: animationName.ClimbToDown,
			noBlend: true,
			weight: 0.0,
		},


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Shake)
			},
			// currentAnimationNames: [animationName.Idle],
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			weight: 0.0,
			nextAnimationName: animationName.Shake
		},
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Run],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Shoot],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Swiping],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Standup],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Controlled],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Shake)
		// 	},
		// 	currentAnimationNames: [animationName.Lie],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.Shake
		// },

		{
			condition: state => {
				return isEndFunc(state, animationName.Shake, getIsDebug(state))
					&& !isPreviousStateFunc(state, objectStateName.Controlled)
					&& !isPreviousStateFunc(state, objectStateName.MeleeAttack)
					&& !isPreviousStateFunc(state, objectStateName.RemoteAttack)
			},
			currentAnimationNames: [animationName.Shake],
			nextAnimationName: animationName.Idle,
			// noBlend: true
			weight: 0.0,
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Shake, getIsDebug(state)) && isPreviousStateFunc(state, objectStateName.Controlled)
			},
			currentAnimationNames: [animationName.Shake],
			nextAnimationName: animationName.Controlled,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Shake, getIsDebug(state)) && isPreviousStateFunc(state, objectStateName.MeleeAttack)
			},
			currentAnimationNames: [animationName.Shake],
			nextAnimationName: animationName.Swiping,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Shake, getIsDebug(state)) && isPreviousStateFunc(state, objectStateName.RemoteAttack)
			},
			currentAnimationNames: [animationName.Shake],
			nextAnimationName: animationName.Shoot,
			noBlend: true
		},





		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Idle)
			},
			currentAnimationNames: [animationName.Controlled],
			// weight: 0.0,
			nextAnimationName: animationName.Idle
		},


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Standup)
			},
			currentAnimationNames: [animationName.Lie],
			// weight: 0.0,
			noBlend: true,
			nextAnimationName: animationName.Standup
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.Standup, getIsDebug(state))
				//  && isPreviousStateFunc(state, objectStateName.Controlled)
			},
			currentAnimationNames: [animationName.Standup],
			noBlend: true,
			nextAnimationName: animationName.Idle
		},


		{
			condition: state => {
				return isEndFunc(state, animationName.ClimbToTop, getIsDebug(state))
			},
			currentAnimationNames: [animationName.ClimbToTop],
			noBlend: true,
			nextAnimationName: animationName.Idle
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.ClimbToDown, getIsDebug(state))
			},
			currentAnimationNames: [animationName.ClimbToDown],
			noBlend: true,
			nextAnimationName: animationName.Idle
		},



		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Death)
			},
			currentAnimationNames: _getAllAnimationNamesExceptDeathAnimations(),
			weight: 0.0,
			noBlend: true,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Death)
		// 	},
		// 	currentAnimationNames: [animationName.Controlled],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.Death
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Death)
		// 	},
		// 	currentAnimationNames: [animationName.Run],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.Death
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Death)
		// 	},
		// 	currentAnimationNames: [animationName.Shoot],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.Death
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Death)
		// 	},
		// 	currentAnimationNames: [animationName.Swiping],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.Death
		// },
		// {
		// 	condition: state => {
		// 		return isTriggerActionFunc(state, actionName.Death)
		// 	},
		// 	currentAnimationNames: [animationName.Lie],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.Death
		// },


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Reborn)
			},
			currentAnimationNames: [animationName.Death],
			nextAnimationName: animationName.Idle,
			noBlend: true,
		},
	]
}

export let getAnimationBlendDuration = (
	currentAnimationName, nextBlendingAnimationName
) => {
	if (
		currentAnimationName == animationName.Idle && nextBlendingAnimationName == animationName.Run
	) {
		return 0.1
	}

	return 0.5
}



export let getAnimationCollisionData = (): Array<animationCollisionData> => {
	return [
		{
			name: animationName.Shoot,

			timeline: [
				{
					// frameIndex: getLastFrameIndex(getAnimationFrameCount(state, animationName.Shoot)),
					frameIndex: getFirstFrameIndex(),
					// frameRange: [getFirstFrameIndex(), getFirstFrameIndex() + 5],
					// frameRange: 10,
					frameRange: 15,

					track: track.Event,
					value: (state, {
					}): any => {
						return {
							eventName: getLittleManShootStartEventName(),
							eventData: {}
						}
					}

				},
				{
					frameIndex: 18,
					// frameRange: [18, 18 + 5],
					frameRange: 15,
					// frameRange: 10,


					track: track.Event,
					value: (state, {
					}): any => {
						return {
							eventName: getLittleManShootEmitEventName(),
							eventData: {}
						}
					}

				},
				// {
				// 	frameIndex: 35,

				// 	track: track.Audio,
				// 	value: (state, _) => {
				// 		return getLaughSoundResourceId()
				// 	}

				// },
			]
		},
		{
			name: animationName.Swiping,

			timeline: [
				{
					frameIndex: getFirstFrameIndex(),
					frameRange: 20,

					track: track.Event,
					value: (state, {
					}): any => {
						return {
							eventName: getLittleManSwipingStartEventName(),
							eventData: {}
						}
					}

				},
				{
					frameIndex: 39,
					frameRange: 20,


					track: track.Event,
					value: (state, {
					}): any => {
						return {
							eventName: getLittleManSwipingEmitEventName(),
							eventData: {}
						}
					}

				},
				// {
				// 	frameIndex: 35,

				// 	track: track.Audio,
				// 	value: (state, _) => {
				// 		return getLaughSoundResourceId()
				// 	}

				// },
			]
		},


		// {
		// 	name: animationName.ClimbToTop,

		// 	timeline: [
		// 		{
		// 			// frameIndex: getLastFrameIndex(getAnimationFrameCount(animationName.ClimbToTop)),
		// 			frameIndex: getAnimationFrameCount(animationName.ClimbToTop) - 1,

		// 			track: track.Event,
		// 			value: (state, {
		// 			}): any => {
		// 				return {
		// 					eventName: getLittleManClimbToTopEventName(),
		// 					eventData: {}
		// 				}
		// 			}

		// 		},
		// 		{
		// 			frameIndex: 39,
		// 			frameRange: 20,


		// 			track: track.Event,
		// 			value: (state, {
		// 			}): any => {
		// 				return {
		// 					eventName: getLittleManSwipingEmitEventName(),
		// 					eventData: {}
		// 				}
		// 			}

		// 		},
		// 		// {
		// 		// 	frameIndex: 35,

		// 		// 	track: track.Audio,
		// 		// 	value: (state, _) => {
		// 		// 		return getLaughSoundResourceId()
		// 		// 	}

		// 		// },
		// 	]
		// },


		// {
		// 	name: animationName.Death,

		// 	timeline: [
		// 		{
		// 			frameIndex: 14,
		// 			// frameRange: 2,

		// 			track: track.Event,
		// 			value: (state, {
		// 			}): any => {
		// 				return {
		// 					eventName: getLittleManDeathNeedFixPositionYOffsetEventName(),
		// 					eventData: {}
		// 				}
		// 			}

		// 		},
		// 		// {
		// 		// 	frameIndex: 18,
		// 		// 	// frameRange: [18, 18 + 5],
		// 		// 	frameRange: 15,
		// 		// 	// frameRange: 10,


		// 		// 	track: track.Event,
		// 		// 	value: (state, {
		// 		// 	}): any => {
		// 		// 		return {
		// 		// 			eventName: getLittleManShootEmitEventName(),
		// 		// 			eventData: {}
		// 		// 		}
		// 		// 	}

		// 		// },
		// 	]
		// },


		{
			name: animationName.Standup,

			timeline: [
				{
					frameIndex: getLastFrameIndex(getAnimationFrameCount(animationName.Standup)),

					track: track.Event,
					value: (state, {
					}): any => {
						return {
							eventName: getLittleManStandupEndEventName(),
							eventData: {}
						}
					}

				},
			]
		},
	]
}