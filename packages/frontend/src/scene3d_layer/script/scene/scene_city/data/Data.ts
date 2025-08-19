import { actionState, breastPressPhase, collisionPart, crawlMovePhase, crawlToStandPhase, eatPhase, pinchPhase, pose, runPhase, standToCrawlPhase, stompPhase, walkPhase } from "../type/StateType"
import { actionData, actionName, animationBlendData, animationCollisionData, animationName, articluatedAnimationData, articluatedAnimationName, effect, particle, phaseData, skillStressingFactor, track } from "./DataType"
import { getWalkLeftSoundResourceId, getWalkRightSoundResourceId, getStompSoundResourceId, getWalkVehicle1SoundResourceId, getWalkVehicle2SoundResourceId, getLaughSoundResourceId, getWalkCharacterSoundResourceId, getStandToCrawlHandSoundResourceId, getStandToCrawlShankSoundResourceId, getBreastPressLaughSoundResourceId, getPinchMilltarySoundResourceId, getPinchCharacterSoundResourceId, getEatSoundResourceId } from "../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Vector3 } from "three"
import { buildHitTerrainEventData, buildPickdownEventData, buildPickupEventData, getCrawlToStandEventName, getEatEventName, getHitTerrainEventName, getPickdownEventName, getPickupEventName, getPinchJudageDamageEventName, getStandToCrawlEventName } from "../../../../utils/EventUtils"
import { getIsDebug } from "../../Scene"
import { getEatRemovePickDataFrameIndex, getEatWorkFrameIndex, getPickObjectBox, getPickObjectQueueName, getPickdownWorkFrameIndex, getPickupWorkFrameIndex, getPinchWorkFrameIndex, hasPickData } from "../girl/PickPose"
import { getMaxForce } from "../utils/DamageUtils"
import * as MilltaryVehicle from "../manage/city1/milltary_vehicle/MilltaryVehicle"
import { getFirstFrameIndex, getLastFrameIndex } from "../utils/DataUtils"
import { getAllAnimationNames, getDamageAnimationNames } from "../girl/Animation"
import { getAnimationFrameCountWithoutState } from "./Const"
import { getPositionParrelToObj } from "../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getAnimationNamesExceptDamageNames = () => {
	return getAllAnimationNames().filter(name => {
		return !getDamageAnimationNames().includes(name)
	})
}

export let getAnimationBlendData = ([{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]): animationBlendData<animationName> => {
	return [
		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Initial)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Walk
		},
		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Run)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Run
		},
		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Run)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.Run
		},
		{
			condition: state => {
				return !isMoveFunc(state)
				//  && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.Idle
		},
		{
			condition: state => {
				return !isMoveFunc(state)
				//  && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Idle
		},
		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Initial)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Walk
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.Stomp, getIsDebug(state)) && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Stomp],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Stomp)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.5,
			nextAnimationName: animationName.Stomp
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Stomp)
			},
			currentAnimationNames: [animationName.Walk],
			weight: 0.5,
			nextAnimationName: animationName.Stomp
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Stomp)
			},
			currentAnimationNames: [animationName.Run],
			weight: 0.5,
			nextAnimationName: animationName.Stomp
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.StandToCrawl)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.5,
			nextAnimationName: animationName.StandToCrawl
		},
		{
			condition: state => {
				// return getFrameIndexFunc(state, animationName.StandToCrawl) >= getAnimationFrameCountWithoutState( animationName.StandToCrawl) * 6 / 7
				// return getFrameIndexFunc(state, animationName.StandToCrawl) >= 58

				// return isSpecificFrameIndexFunc(getFrameIndexFunc(state, animationName.StandToCrawl),
				// 	getAnimationFrameCountWithoutState( animationName.StandToCrawl),
				// 	getAnimationFrameCountWithoutState( animationName.StandToCrawl),
				// )
				return isEndFunc(state, animationName.StandToCrawl, getIsDebug(state))
			},
			currentAnimationNames: [animationName.StandToCrawl],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlToStand)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			weight: 0.5,
			nextAnimationName: animationName.CrawlToStand
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.CrawlToStand, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlToStand],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.BreastPress)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			weight: 0.5,
			nextAnimationName: animationName.BreastPress
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.BreastPress, getIsDebug(state))
			},
			currentAnimationNames: [animationName.BreastPress],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},


		{
			condition: state => {
				return isMoveFunc(state)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			nextAnimationName: animationName.CrawlMove
		},
		{
			condition: state => {
				return !isMoveFunc(state)
			},
			currentAnimationNames: [animationName.CrawlMove],
			nextAnimationName: animationName.KeepCrawl
		},




		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Pickup)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.5,
			nextAnimationName: animationName.Pickup
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Pickup, getIsDebug(state)) && hasPickData(state)
			},
			currentAnimationNames: [animationName.Pickup],
			nextAnimationName: animationName.KeepPick,
			noBlend: true
		},
		{
			condition: state => {
				return getFrameIndexFunc(state, animationName.Pickup) > getPickupWorkFrameIndex() && !hasPickData(state)
			},
			currentAnimationNames: [animationName.Pickup],
			nextAnimationName: animationName.Idle,
			weight: 0.5,
		},

		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Initial)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Walk
		},
		{
			condition: state => {
				return isMoveFunc(state) && isActionStateFunc(state, actionState.Run)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Run
		},
		{
			condition: state => {
				return !isMoveFunc(state) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.KeepPick
		},
		{
			condition: state => {
				return !isMoveFunc(state) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.KeepPick
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Stomp, getIsDebug(state)) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.Stomp],
			nextAnimationName: animationName.KeepPick,
			// noBlend: true
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Stomp)
			},
			currentAnimationNames: [animationName.KeepPick],
			weight: 0.5,
			nextAnimationName: animationName.Stomp
		},


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Pinch)
			},
			currentAnimationNames: [animationName.KeepPick],
			// weight: 0.5,
			nextAnimationName: animationName.Pinch,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Pinch, getIsDebug(state))
			},
			currentAnimationNames: [animationName.Pinch],
			nextAnimationName: animationName.KeepPick,
			noBlend: true
		},
		{
			condition: state => {
				return !hasPickData(state)
			},
			currentAnimationNames: [animationName.Pinch],
			weight: 0.5,
			nextAnimationName: animationName.Idle
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Eat)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Eat,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Eat, getIsDebug(state))
			},
			currentAnimationNames: [animationName.Eat],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},


		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Pickdown)
			},
			currentAnimationNames: [animationName.KeepPick],
			weight: 1,
			nextAnimationName: animationName.Pickdown
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.Pickdown, getIsDebug(state)) && !hasPickData(state)
			},
			currentAnimationNames: [animationName.Pickdown],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: state => {
				// return isEndFunc(state, animationName.Pickdown, getIsDebug(state)) && hasPickData(state)
				return getFrameIndexFunc(state, animationName.Pickdown) > getPickdownWorkFrameIndex() && hasPickData(state)
			},
			currentAnimationNames: [animationName.Pickdown],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},








		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressing)
			},
			currentAnimationNames: [
				animationName.Idle,
				animationName.KeepPick,
				animationName.Walk,
				animationName.Run
			],
			weight: 0.0,
			nextAnimationName: animationName.HeavyStressing
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressing, getIsDebug(state)) && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressing],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressing, getIsDebug(state)) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressing],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressingBreast)
			},
			currentAnimationNames: [
				animationName.Idle,
				animationName.KeepPick,
				animationName.Walk,
				animationName.Run
			],
			weight: 0.0,
			nextAnimationName: animationName.HeavyStressingBreast
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressingBreast, getIsDebug(state)) && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressingBreast],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressingBreast, getIsDebug(state)) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressingBreast],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressingTrigoneAndButt)
			},
			currentAnimationNames: [
				animationName.Idle,
				animationName.KeepPick,
				animationName.Walk,
				animationName.Run
			],
			weight: 0.0,
			nextAnimationName: animationName.HeavyStressingTrigoneAndButt
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressingTrigoneAndButt, getIsDebug(state)) && !hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: state => {
				return isEndFunc(state, animationName.HeavyStressingTrigoneAndButt, getIsDebug(state)) && hasPickDataFunc(state)
			},
			currentAnimationNames: [animationName.HeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5
		},









		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Death)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Death)
			},
			currentAnimationNames: [animationName.KeepPick],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Death)
			},
			currentAnimationNames: [animationName.Walk],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.Death)
			},
			currentAnimationNames: [animationName.Run],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},





		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressing)
			},
			currentAnimationNames: [
				animationName.KeepCrawl,
				animationName.CrawlMove,
			],
			weight: 0.0,
			nextAnimationName: animationName.CrawlHeavyStressing
		},

		{
			condition: state => {
				return isEndFunc(state, animationName.CrawlHeavyStressing, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressing],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressingBreast)
			},
			currentAnimationNames: [
				animationName.KeepCrawl,
				animationName.CrawlMove,
			],
			weight: 0.0,
			nextAnimationName: animationName.CrawlHeavyStressingBreast
		},

		{
			condition: state => {
				// return getFrameIndexFunc(state, animationName.CrawlHeavyStressingBreast) >= getAnimationFrameCountWithoutState( animationName.CrawlHeavyStressingBreast) * 5 / 6
				return isEndFunc(state, animationName.CrawlHeavyStressingBreast, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressingBreast],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressingTrigoneAndButt)
			},
			currentAnimationNames: [
				animationName.KeepCrawl,
				animationName.CrawlMove,
			],
			weight: 0.0,
			nextAnimationName: animationName.CrawlHeavyStressingTrigoneAndButt
		},

		{
			condition: state => {
				// return getFrameIndexFunc(state, animationName.CrawlHeavyStressingTrigoneAndButt) >= getAnimationFrameCountWithoutState( animationName.CrawlHeavyStressingTrigoneAndButt) * 5 / 6
				return isEndFunc(state, animationName.CrawlHeavyStressingTrigoneAndButt, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},



		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlDeath)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.CrawlDeath
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlDeath)
			},
			currentAnimationNames: [animationName.CrawlMove],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.CrawlDeath
		},





		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressing)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.HeavyStressing
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressingBreast)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.HeavyStressingBreast
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.HeavyStressingTrigoneAndButt)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.HeavyStressingTrigoneAndButt
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressing)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.CrawlHeavyStressing
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressingBreast)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.CrawlHeavyStressingBreast
		},
		{
			condition: state => {
				return isTriggerActionFunc(state, actionName.CrawlHeavyStressingTrigoneAndButt)
			},
			weight: 0.0,
			currentAnimationNames: _getAnimationNamesExceptDamageNames(),
			nextAnimationName: animationName.CrawlHeavyStressingTrigoneAndButt
		},
	]
}

export let getAnimationBlendDuration = (
	currentAnimationName, nextBlendingAnimationName
) => {
	if (
		currentAnimationName == animationName.Idle &&
		(nextBlendingAnimationName == animationName.Walk
			|| nextBlendingAnimationName == animationName.Run
		)
		||
		(
			currentAnimationName == animationName.Walk &&
			nextBlendingAnimationName == animationName.Run
		)
		||
		(
			currentAnimationName == animationName.Run &&
			nextBlendingAnimationName == animationName.Walk
		)
	) {
		return 0.1
		// return 0.5
	}

	return 0.5
}

let _getStompRangeBox = (state, [getHeightFunc, getShapeFunc]) => {
	let height = getHeightFunc(state)

	let shape = getShapeFunc(state, collisionPart.RightFoot)

	let box = shape.toBox3()

	// return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.6)
	// return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.1)
	// return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.001)
	// return box.expandByScalar(Math.sqrt(height))
	return box.expandByScalar(height * 0.2)
}

let _getStompPoint = (state, getShapeFunc) => {
	return getShapeFunc(state, collisionPart.RightFoot).center
}

let _handleMoveSound = (state, [isCollisionWithVehicleFunc, isCollisionWithCharacterFunc, judgePhaseFunc], animationName, phase) => {
	let soundId = null
	if (isCollisionWithVehicleFunc(state, animationName, phase)) {
		let v = Math.random()
		soundId = v > 0.5 ? getWalkVehicle1SoundResourceId() : getWalkVehicle2SoundResourceId()
	}
	else if (isCollisionWithCharacterFunc(state, animationName, phase)) {
		soundId = getWalkCharacterSoundResourceId()
	}
	else {
		soundId = judgePhaseFunc(phase, getWalkLeftSoundResourceId(), getWalkRightSoundResourceId())
	}

	return soundId

}

export let getAnimationCollisionData = ([isCollisionWithVehicleFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
	getShapeFunc,
	getScaleFunc,
	getHeightFunc,
	isLittleRoadFunc
]): Array<animationCollisionData<animationName>> => {
	return [
		{
			name: animationName.Walk,

			// {
			// 	// frameIndex: 0,
			// 	// toFrameIndex: 30,

			// 	track: track.ShapeDamage,
			// 	value: (state, collisionData) => {
			// 		// let { collisionShapeMap } = getGirlState(state)

			// 		// return {
			// 		// 	shape: collisionShapeMap.get(collisionPart.LeftFoot),
			// 		// 	// phase:

			// 		// 	// ,

			// 		// 	// force: ,
			// 		// 	//  damageType_

			// 		// }
			// 		return [ collisionPart.LeftFoot, collisionPart.RightFoot ]
			// 	}

			// },
			shapeDamage: [collisionPart.LeftFoot, collisionPart.RightFoot],
			timeline: [
				// {
				// 	// frameIndex: 0,
				// 	// toFrameIndex: 30,

				// 	track: track.ShapeDamage,
				// 	value: (state, collisionData) => {
				// 		// let { collisionShapeMap } = getGirlState(state)

				// 		// return {
				// 		// 	shape: collisionShapeMap.get(collisionPart.LeftFoot),
				// 		// 	// phase:

				// 		// 	// ,

				// 		// 	// force: ,
				// 		// 	//  damageType_

				// 		// }
				// 		return collisionPart.RightFoot
				// 	}

				// },

				{
					frameIndices: [5, 20],

					track: track.Audio,
					value: (state, { animationName, phase }) => {
						return _handleMoveSound(state, [isCollisionWithVehicleFunc, isCollisionWithCharacterFunc,
							(phase, soundId1, soundId2) => {
								switch (phase) {
									case walkPhase.LeftFootDown:
									case walkPhase.LeftFootMove:
										return soundId1
									case walkPhase.RightFootDown:
									case walkPhase.RightFootMove:
										return soundId2
								}
							}
						], animationName, phase)
					}
				},
				{
					frameIndices: [5, 20],

					track: track.Effect,
					value: (state, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state)) {
							return effect.ScreenShake
						}

						return null
					}

				},
			]
		},
		{
			name: animationName.Run,

			shapeDamage: [collisionPart.LeftFoot, collisionPart.RightFoot],
			timeline: [
				{
					frameIndices: [4, 14],

					track: track.Effect,
					value: (state, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndices: [4, 14],

					track: track.Audio,
					value: (state, { animationName, phase }) => {
						return _handleMoveSound(state, [isCollisionWithVehicleFunc, isCollisionWithCharacterFunc,
							(phase, soundId1, soundId2) => {
								switch (phase) {
									case runPhase.LeftFootDown:
									case runPhase.LeftFootMove:
										return soundId1
									case runPhase.RightFootDown:
									case runPhase.RightFootMove:
										return soundId2
								}
							}
						], animationName, phase)
					}
				},
			]
		},
		{
			name: animationName.Stomp,

			shapeDamage: [collisionPart.RightFoot],
			timeline: [
				{
					frameIndex: 30,

					track: track.Particle,
					value: (state, _): any => {
						let point = _getStompPoint(state, getShapeFunc)


						if (isSmallGiantessOrBiggerFunc(state)) {
							return NullableUtils.return_([[
								particle.StompDust,
								{
									// speed: 10 * Math.max(getScaleFunc(state) / 10, 1),
									speed: 10 * Math.max(getScaleFunc(state) / 10, 1) / 1.5,
									changeLife: 500,
									life: 3000,
									size: getScaleFunc(state),
									// position: point.toArray()
									position: getPositionParrelToObj(point, 3).toArray()
								}
							]])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndex: 30,

					track: track.Effect,
					value: (state, _): any => {
						// if (isMiddleGiantessOrBiggerFunc(state)) {
						// 	return effect.ScreenShake
						// }

						// return null
						if (isLittleRoadFunc(state)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndex: 30,

					track: track.Audio,
					value: (state, _): any => {
						return getStompSoundResourceId()
					}

				},
				{
					frameIndex: 30,

					track: track.RangeDamage,
					value: (state, _) => {
						return _getStompRangeBox(state, [getHeightFunc, getShapeFunc])
					}

				},
				{
					frameIndex: 30,

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getHitTerrainEventName(),
							eventData: buildHitTerrainEventData(
								_getStompPoint(state, getShapeFunc)
								, force, _getStompRangeBox(state, [getHeightFunc, getShapeFunc]))
						}
					}

				},
				{
					frameIndex: 35,

					track: track.Audio,
					value: (state, _) => {
						if (NumberUtils.isRandomRate(0.3)) {
							return NullableUtils.return_(getLaughSoundResourceId())
						}

						return NullableUtils.getEmpty()
					}

				},
			]
		},


		{
			name: animationName.StandToCrawl,

			shapeDamage: [
				collisionPart.LeftShank, collisionPart.RightShank,
				collisionPart.LeftHand, collisionPart.RightHand
			],
			timeline: [
				{
					frameIndex: 30,

					track: track.Particle,
					value: (state, _): any => {
						let leftShankPoint = getShapeFunc(state, collisionPart.LeftShank).center
						let rightShankPoint = getShapeFunc(state, collisionPart.RightShank).center

						if (isMiddleGiantessOrBiggerFunc(state)) {
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state) / 10, 1),
										changeLife: 500,
										life: 3000,
										size: getScaleFunc(state),
										position: leftShankPoint.toArray()
									}
								],
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state) / 10, 1),
										changeLife: 500,
										life: 3000,
										size: getScaleFunc(state),
										position: rightShankPoint.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndex: 60 - 1,

					track: track.Particle,
					value: (state, _): any => {
						let leftHandPoint = getShapeFunc(state, collisionPart.LeftHand).center
						let rightHandPoint = getShapeFunc(state, collisionPart.RightHand).center

						if (isMiddleGiantessOrBiggerFunc(state)) {
							let scalar = 1.5
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state) / scalar,
										position: leftHandPoint.toArray()
									}
								],
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state) / scalar,
										position: rightHandPoint.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndices: [30, 60 - 1],

					track: track.Effect,
					value: (state, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndices: [30, 60 - 1],

					track: track.Audio,
					value: (state, { animationName, phase }): any => {
						switch (phase) {
							case standToCrawlPhase.ShankDown:
								return getStandToCrawlShankSoundResourceId()
							case standToCrawlPhase.HandDown:
								return getStandToCrawlHandSoundResourceId()
						}
					}
				},

				{
					frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.StandToCrawl)),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getStandToCrawlEventName(),
							eventData: {}
						}
					}

				},
			]
		},
		{
			name: animationName.CrawlToStand,

			shapeDamage: [
				collisionPart.LeftHand, collisionPart.RightHand
			],
			timeline: [
				{
					// frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState( animationName.CrawlToStand)),
					frameIndex: getFirstFrameIndex(),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getCrawlToStandEventName(),
							eventData: {}
						}
					}

				},
			]
		},
		{
			name: animationName.BreastPress,

			shapeDamage: [
				collisionPart.Head,
				collisionPart.LeftBreast, collisionPart.RightBreast,
				collisionPart.LeftThigh, collisionPart.RightThigh,
			],
			timeline: [
				{
					frameIndex: 20,

					track: track.Audio,
					value: (state, { animationName, phase }): any => {
						return getBreastPressLaughSoundResourceId()
					}
				},
			]
		},
		{
			name: animationName.CrawlMove,

			shapeDamage: [
				collisionPart.LeftHand, collisionPart.RightHand,
				collisionPart.LeftFoot, collisionPart.RightFoot,
				collisionPart.LeftShank, collisionPart.RightShank,
			],
			timeline: [
				{
					// frameIndices: [6, 17, 23, 37],
					frameIndices: [11, 31],

					track: track.Effect,
					value: (state, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state)) {
							return effect.ScreenShake
						}

						return null
					}
				},
				{
					frameIndices: [11, 31],

					track: track.Audio,
					value: (state, { animationName, phase }) => {
						return _handleMoveSound(state, [isCollisionWithVehicleFunc, isCollisionWithCharacterFunc,
							(phase, soundId1, soundId2) => {
								return soundId1
							}
						], animationName, phase)
					}
				},
			]
		},



		{
			name: animationName.Pickup,

			shapeDamage: [],
			timeline: [
				{
					frameIndex: getPickupWorkFrameIndex(),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getPickupEventName(),
							eventData: buildPickupEventData(
								getShapeFunc(state, collisionPart.RightHand).toBox3()
							)
						}
					}

				},
			]
		},
		{
			name: animationName.Pinch,

			shapeDamage: [
				collisionPart.RightHand
			],
			timeline: [
				{
					frameIndex: getFirstFrameIndex(),

					track: track.Particle,
					value: (state, _): any => {
						let box = getPickObjectBox(state)
						let point = box.getCenter(_v1)
						let sizeLength = box.getSize(_v2).length()

						if (isSmallGiantessOrBiggerFunc(state)) {
							return NullableUtils.return_([
								[
									particle.WaterBloom,
									{
										speed: 1,
										life: 1000,
										size: Math.max(5 * sizeLength, 20),
										position: point.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.Pinch)),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getPinchJudageDamageEventName(),
							eventData: {}
						}
					}

				},
				{
					frameIndex: getFirstFrameIndex(),

					track: track.Audio,
					value: (state, { animationName, phase }): any => {
						let pickObjectQueueName = getPickObjectQueueName(state)

						return NullableUtils.getWithDefault(
							NullableUtils.map(pickObjectQueueName => {
								if (MilltaryVehicle.isMilltaryVechile(pickObjectQueueName)) {
									return getPinchMilltarySoundResourceId()
								}

								return getPinchCharacterSoundResourceId()
							}, pickObjectQueueName),
							getPinchCharacterSoundResourceId()
						)
					}
				},
			]
		},
		{
			name: animationName.Eat,

			shapeDamage: [
				collisionPart.RightHand
			],
			timeline: [
				{
					frameIndex: getEatRemovePickDataFrameIndex(),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getEatEventName(),
							eventData: {}
						}
					}
				},
				{
					frameIndex: getEatRemovePickDataFrameIndex(),

					track: track.Audio,
					value: (state, { animationName, phase }): any => {
						return getEatSoundResourceId()
					}
				},
			]
		},
		{
			name: animationName.Pickdown,

			shapeDamage: [],
			timeline: [
				{
					frameIndex: getPickdownWorkFrameIndex(),

					track: track.Event,
					value: (state, {
						force
					}): any => {
						return {
							eventName: getPickdownEventName(),
							eventData: buildPickdownEventData(
								getShapeFunc(state, collisionPart.RightHand).center
							)
						}
					}

				},
			]
		},

	]
}

export let getActionData = (): actionData<animationName> => {
	return [
		{
			name: animationName.Walk,
			force: {
				[walkPhase.LeftFootMove]: 4,
				[walkPhase.RightFootMove]: 4,
				// [walkPhase.LeftFootDown]: 12,
				// [walkPhase.RightFootDown]: 12,
				[walkPhase.LeftFootDown]: 20,
				[walkPhase.RightFootDown]: 20,
			}
		},
		{
			name: animationName.Run,
			force: {
				[runPhase.LeftFootMove]: 5,
				[runPhase.RightFootMove]: 5,
				[runPhase.LeftFootDown]: 22,
				[runPhase.RightFootDown]: 22,
			}
		},
		{
			name: animationName.Stomp,
			force: {
				[stompPhase.Up]: 5,
				[stompPhase.Down]: 30,
				[stompPhase.Range]: 3,
			}
		},


		{
			name: animationName.StandToCrawl,
			force: {
				[standToCrawlPhase.ShankDown]: 20,
				[standToCrawlPhase.HandDown]: 20,
			}
		},
		{
			name: animationName.CrawlToStand,
			force: {
				[crawlToStandPhase.HandUp]: 10,
			}
		},
		{
			name: animationName.BreastPress,
			force: {
				[breastPressPhase.Down]: 10,
				[breastPressPhase.Up]: 5,
			}
		},
		{
			name: animationName.CrawlMove,
			force: {
				[crawlMovePhase.Move]: 4,
				[crawlMovePhase.Down]: 18,
			}
		},


		{
			name: animationName.Pinch,
			force: {
				[pinchPhase.Pinch]: 4,
			}
		},
		{
			name: animationName.Eat,
			force: {
				[eatPhase.BeforeEat]: 0,
				[eatPhase.Eat]: getMaxForce(),
			}
		},
	]
}

export let getPhase = (): phaseData<animationName> => {
	return [
		{
			name: animationName.Walk,
			value: [
				{
					frameIndexRange: [0, 6],
					phase: walkPhase.RightFootDown
				},
				{
					frameIndexRange: [7, 14],
					phase: walkPhase.LeftFootMove
				},
				{
					frameIndexRange: [15, 20],
					phase: walkPhase.LeftFootDown
				},
				{
					frameIndexRange: [21, 32],
					phase: walkPhase.RightFootMove
				},
			]
		},
		{
			name: animationName.Run,
			value: [
				{
					frameIndexRange: [0, 3],
					phase: runPhase.RightFootDown
				},
				{
					frameIndexRange: [4, 9],
					phase: walkPhase.LeftFootMove
				},
				{
					frameIndexRange: [10, 14],
					phase: walkPhase.LeftFootDown
				},
				{
					frameIndexRange: [15, 20],
					phase: walkPhase.RightFootMove
				},
			]
		},
		{
			name: animationName.Stomp,
			value: [
				{
					frameIndexRange: [0, 20],
					phase: stompPhase.Up
				},
				{
					frameIndexRange: [21, 70],
					phase: stompPhase.Down
				},
			]
		},

		{
			name: animationName.StandToCrawl,
			value: [
				{
					frameIndexRange: [0, 30],
					phase: standToCrawlPhase.ShankDown,
				},
				{
					frameIndexRange: [31, 60],
					phase: standToCrawlPhase.HandDown
				},
			]
		},
		{
			name: animationName.CrawlToStand,
			value: [
				{
					frameIndexRange: [0, 30],
					phase: crawlToStandPhase.HandUp
				}
			]
		},
		{
			name: animationName.BreastPress,
			value: [
				{
					frameIndexRange: [0, 60],
					phase: breastPressPhase.Down
				},
				{
					frameIndexRange: [61, 80],
					phase: breastPressPhase.Up
				}
			]
		},

		{
			name: animationName.CrawlMove,
			value: [
				{
					frameIndexRange: [0, 7],
					phase: crawlMovePhase.Down
				},
				{
					frameIndexRange: [8, 10],
					phase: crawlMovePhase.Move
				},
				{
					frameIndexRange: [11, 24],
					phase: crawlMovePhase.Down
				},
				{
					frameIndexRange: [25, 30],
					phase: crawlMovePhase.Move
				},
				{
					frameIndexRange: [31, 37],
					phase: crawlMovePhase.Down
				},
				{
					frameIndexRange: [38, 39],
					phase: crawlMovePhase.Move
				},
			]
		},




		{
			name: animationName.Pinch,
			value: [
				{
					frameIndexRange: [0, getAnimationFrameCountWithoutState(animationName.Pinch)],
					phase: pinchPhase.Pinch
				}
			]
		},
		{
			name: animationName.Eat,
			value: [
				{
					frameIndexRange: [0, getEatWorkFrameIndex()],
					phase: eatPhase.BeforeEat
				},
				{
					frameIndexRange: [getEatWorkFrameIndex(), getAnimationFrameCountWithoutState(animationName.Eat)],
					phase: eatPhase.Eat
				}
			]
		},
	]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
	let lowValue = 0.2
	let middleValue = 0.3
	let highValue = 0.4

	return [
		{
			name: animationName.Stomp,
			value: lowValue
		},
		{
			name: animationName.BreastPress,
			value: highValue
		},
		{
			name: animationName.Eat,
			value: middleValue
		},
		{
			name: animationName.Pickup,
			value: middleValue
		},
		{
			name: animationName.Pickdown,
			value: middleValue
		},
		{
			name: animationName.Pinch,
			value: middleValue
		},
	]
}

export let getArticluatedAnimationData = (): Array<articluatedAnimationData<articluatedAnimationName>> => {
	return [
		{
			name: articluatedAnimationName.Scale,
			initial: (state, getValueFunc) => {
				let origin = getValueFunc(state)

				return { scale: origin }
			},
			tweens: (state, getParamFunc) => {
				let [scale, timeScalar] = getParamFunc(state)

				return [
					[{ scale: scale }, 1000 * timeScalar],
				]
			},
			repeatCount: 1,
		},

		{
			name: articluatedAnimationName.Stressing_Rotate1,
			initial: (state, getValueFunc) => {
				return { euler: 0 }
			},
			tweens: (state, getParamFunc) => {
				let [amplitude, timeScalar] = getParamFunc(state)

				return [
					[{ euler: -amplitude }, 500 * timeScalar],
					[{ euler: amplitude }, 1000 * timeScalar],
					[{ euler: 0 }, 500 * timeScalar],
				]
			},
			repeatCount: 2,
		},
		{
			name: articluatedAnimationName.Stressing_Move1,
			initial: (state, getValueFunc) => {
				let origin = getValueFunc(state)

				return { x: origin.x, y: origin.y, z: origin.z }
			},
			tweens: (state, getParamFunc) => {
				let [position, amplitude, timeScalar] = getParamFunc(state)

				let isXDirection = Math.random() > 0.5

				let t1, t2
				let t3 = position
				if (isXDirection) {
					t1 = _v1.set(position.x - amplitude, position.y, position.z)
					t2 = _v2.set(position.x + amplitude, position.y, position.z)
				}
				else {
					t1 = _v1.set(position.x, position.y, position.z - amplitude)
					t2 = _v2.set(position.x, position.y, position.z + amplitude)
				}


				return [
					[{ x: t1.x, y: t1.y, z: t1.z }, 500 * timeScalar],
					[{ x: t2.x, y: t2.y, z: t2.z }, 1000 * timeScalar],
					[{ x: t3.x, y: t3.y, z: t3.z }, 500 * timeScalar],
				]
			},
			repeatCount: 2,
		},


		{
			name: articluatedAnimationName.Destroyed_Rotate1,
			initial: (state, getValueFunc) => {
				return { euler: 0 }
			},
			tweens: (state, getParamFunc) => {
				let timeScalar = getParamFunc(state)

				return [
					[{ euler: 90 }, 1000 * timeScalar],
				]
			},
			repeatCount: 1,
		},
		{
			name: articluatedAnimationName.Destroyed_Move1,
			initial: (state, getValueFunc) => {
				let origin = getValueFunc(state)

				return { x: origin.x, y: origin.y, z: origin.z }
			},
			tweens: (state, getParamFunc) => {
				let [position, endY, timeScalar] = getParamFunc(state)

				return [
					[{ x: position.x, y: endY, z: position.z }, 1000 * timeScalar],
				]
			},
			repeatCount: 1,
		},


		{
			name: articluatedAnimationName.Tank_Fire,
			initial: (state, getValueFunc) => {
				let origin = getValueFunc(state)

				// return { x: origin.x, y: origin.y, z: origin.z }
				return { x: origin }
			},
			tweens: (state, getParamFunc) => {
				let [positionX, amplitude, timeScalar] = getParamFunc(state)

				let t1, t2
				// let t3 = positionX
				t1 = positionX + amplitude
				// t2 = positionX + amplitude
				t2 = positionX

				return [
					[{ x: t1 }, 500 * timeScalar],
					[{ x: t2 }, 1000 * timeScalar],
					// [{ x: t3 }, 500 * timeScalar],
				]
			},
			repeatCount: 1,
		},
	]
}