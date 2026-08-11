import { actionState, collisionPart, crawlMovePhase, crawlToStandPhase, eatPhase, pinchPhase, pose, runPhase, standToCrawlPhase, stompPhase, usedGirlEnum, walkPhase } from "../type/StateType"
import { actionData, actionName, animatioNameAndActionName, animationBlendData, animationCollisionData, animationName, articluatedAnimationData, articluatedAnimationName, effect, experienceFactor, giantessForceSize, particle, phaseData, skillStressingFactor, skillStressingValue, track } from "./DataType"
import { getWalkLeftSoundResourceId, getWalkRightSoundResourceId, getWalkVehicle1SoundResourceId, getWalkVehicle2SoundResourceId, getWalkCharacterSoundResourceId, getStandToCrawlHandSoundResourceId, getStandToCrawlShankSoundResourceId, getPinchMilltarySoundResourceId, getPinchCharacterSoundResourceId, getEatSoundResourceId } from "../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { AnimationMixer, Vector3 } from "three"
import { buildStompHitTerrainEventData, buildPickdownEventData, buildPickupEventData, getCrawlToStandEventName, getEatEventName, getStompHitTerrainEventName, getPickdownEventName, getPickupEventName, getPinchJudageDamageEventName, getStandToCrawlEventName, getMoveHitTerrainEventName, buildMoveHitTerrainEventData } from "../../../../utils/EventUtils"
import { getIsDebug } from "../../Scene"
import { getEatRemovePickDataFrameIndex, getEatWorkFrameIndex, getPickObjectBox, getPickdownWorkFrameIndex, getPickupWorkFrameIndex, getPinchWorkFrameIndex, getRandomPickObjectName, hasPickData } from "../girl/PickPoseUtils"
import { getMaxForce } from "../utils/DamageUtils"
import * as MilltaryVehicle from "../manage/city1/milltary_vehicle/MilltaryVehicle"
import { getEarlyFrameIndex, getLastFrameIndex, getLateFrameIndex } from "../utils/DataUtils"
import { getAllAnimationNames, getDamageAnimationNames } from "../girl/Animation"
import { getAnimationFrameCountWithoutState } from "./Const"
import { getPositionParrelToObj } from "../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getShoeType } from "./mmd/Shoe"
import { getCollisionPartOBB } from "../girl/Collision"
import { isMilltaryVehicle } from "../manage/city1/milltary_vehicle/MilltaryVehicleUtils"
import { animationData } from "./ValueType"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { isMilltaryBuilding } from "../manage/city1/milltary_building/MilltaryBuildingUtils"
import { getSoundSetting } from "../../../../mod/SettingMod"
import { getGiantessVolume } from "../utils/SoundUtils"
import { getAnimationBlendData as getAnimationBlendDataMod, getAnimationCollisionData as getAnimationCollisionDataMod, getActionData as getActionDataMod, getPhase as getPhaseMod, getSkillStressingFactor as getSkillStressingFactorMod, getAnimationData as getAnimationDataMod, getAnimationFrameCount, } from "../../../../mod/SkillGiantessMod"
import { state } from "../../../../type/StateType"
import { getModAPI } from "../Mod"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export let getAnimationNamesExceptDamageNames = (state) => {
	return getAllAnimationNames(state).filter(name => {
		return !getDamageAnimationNames(state).includes(name)
	})
}

export let getAnimationBlendData = (state: state, [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]): animationBlendData<animationName> => {
	return [
		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Initial)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Walk
		},
		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Run)
			},
			currentAnimationNames: [animationName.Idle],
			nextAnimationName: animationName.Run
		},
		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Run)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.Run
		},
		{
			condition: (state, usedGirl) => {
				return !isMoveFunc(state, usedGirl)
				//  && !hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.Idle
		},
		{
			condition: (state, usedGirl) => {
				return !isMoveFunc(state, usedGirl)
				//  && !hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Idle
		},
		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Initial)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.Walk
		},


		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.StandToCrawl)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.5,
			nextAnimationName: animationName.StandToCrawl
		},
		{
			condition: (state, usedGirl) => {
				// return getFrameIndexFunc(state, usedGirl, animationName.StandToCrawl) >= getAnimationFrameCountWithoutState getAnimationFrameCount( animationName.StandToCrawl) * 6 / 7
				// return getFrameIndexFunc(state, usedGirl, animationName.StandToCrawl) >= 58

				// return isSpecificFrameIndexFunc(getFrameIndexFunc(state, usedGirl, animationName.StandToCrawl),
				// 	getAnimationFrameCountWithoutState( animationName.StandToCrawl), getAnimationFrameCount
				// 	getAnimationFrameCountWithoutState( animationName.StandToCrawl), getAnimationFrameCount
				// )
				return isEndFunc(state, usedGirl, animationName.StandToCrawl, getIsDebug(state))
			},
			currentAnimationNames: [animationName.StandToCrawl],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlToStand)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			weight: 0.5,
			nextAnimationName: animationName.CrawlToStand
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.CrawlToStand, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlToStand],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},

		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.BreastPress)
		// 	},
		// 	currentAnimationNames: [animationName.KeepCrawl],
		// 	weight: 0.5,
		// 	nextAnimationName: animationName.BreastPress
		// },
		// {
		// 	condition: (state, usedGirl) => {
		// 		return isEndFunc(state, usedGirl,animationName.BreastPress, getIsDebug(state))
		// 	},
		// 	currentAnimationNames: [animationName.BreastPress],
		// 	nextAnimationName: animationName.KeepCrawl,
		// 	noBlend: true
		// },


		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			nextAnimationName: animationName.CrawlMove
		},
		{
			condition: (state, usedGirl) => {
				return !isMoveFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.CrawlMove],
			nextAnimationName: animationName.KeepCrawl
		},




		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Pickup)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.5,
			nextAnimationName: animationName.Pickup
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.Pickup, getIsDebug(state)) && hasPickData(state, usedGirl)
			},
			currentAnimationNames: [animationName.Pickup],
			nextAnimationName: animationName.KeepPick,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return getFrameIndexFunc(state, usedGirl, animationName.Pickup) > getPickupWorkFrameIndex() && !hasPickData(state, usedGirl)
			},
			currentAnimationNames: [animationName.Pickup],
			nextAnimationName: animationName.Idle,
			weight: 0.5,
		},

		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Initial)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Walk
		},
		{
			condition: (state, usedGirl) => {
				return isMoveFunc(state, usedGirl) && isActionStateFunc(state, usedGirl, actionState.Run)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Run
		},
		{
			condition: (state, usedGirl) => {
				return !isMoveFunc(state, usedGirl) && hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.Walk],
			nextAnimationName: animationName.KeepPick
		},
		{
			condition: (state, usedGirl) => {
				return !isMoveFunc(state, usedGirl) && hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.Run],
			nextAnimationName: animationName.KeepPick
		},


		{
			condition: (state, usedGirl) => {
				return !hasPickData(state, usedGirl)
			},
			currentAnimationNames: [animationName.Pinch, animationName.KeepPick],
			weight: 0.5,
			nextAnimationName: animationName.Idle
		},

		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Pinch)
			},
			currentAnimationNames: [animationName.KeepPick],
			// weight: 0.5,
			nextAnimationName: animationName.Pinch,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.Pinch, getIsDebug(state))
			},
			currentAnimationNames: [animationName.Pinch],
			nextAnimationName: animationName.KeepPick,
			noBlend: true
		},

		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Eat)
			},
			currentAnimationNames: [animationName.KeepPick],
			nextAnimationName: animationName.Eat,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.Eat, getIsDebug(state))
			},
			currentAnimationNames: [animationName.Eat],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},


		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Pickdown)
			},
			currentAnimationNames: [animationName.KeepPick],
			weight: 1,
			nextAnimationName: animationName.Pickdown
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.Pickdown, getIsDebug(state)) && !hasPickData(state, usedGirl)
			},
			currentAnimationNames: [animationName.Pickdown],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				// return isEndFunc(state, usedGirl,animationName.Pickdown, getIsDebug(state)) && hasPickData(state, usedGirl)
				return getFrameIndexFunc(state, usedGirl, animationName.Pickdown) > getPickdownWorkFrameIndex() && hasPickData(state, usedGirl)
			},
			currentAnimationNames: [animationName.Pickdown],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},








		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressing)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.Idle,
		// 		animationName.KeepPick,
		// 		animationName.Walk,
		// 		animationName.Run
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.HeavyStressing
		// },

		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressing, getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressing],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressing, getIsDebug(state)) && hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressing],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},

		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingBreast)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.Idle,
		// 		animationName.KeepPick,
		// 		animationName.Walk,
		// 		animationName.Run
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.HeavyStressingBreast
		// },

		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressingBreast, getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressingBreast],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressingBreast, getIsDebug(state)) && hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressingBreast],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5,
		},

		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingTrigoneAndButt)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.Idle,
		// 		animationName.KeepPick,
		// 		animationName.Walk,
		// 		animationName.Run
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.HeavyStressingTrigoneAndButt
		// },

		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressingTrigoneAndButt, getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.Idle,
			noBlend: true
		},
		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.HeavyStressingTrigoneAndButt, getIsDebug(state)) && hasPickDataFunc(state, usedGirl)
			},
			currentAnimationNames: [animationName.HeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.KeepPick,
			weight: 0.5
		},









		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Death)
			},
			currentAnimationNames: [animationName.Idle],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Death)
			},
			currentAnimationNames: [animationName.KeepPick],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Death)
			},
			currentAnimationNames: [animationName.Walk],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Death)
			},
			currentAnimationNames: [animationName.Run],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.Death
		},





		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressing)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.KeepCrawl,
		// 		animationName.CrawlMove,
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.CrawlHeavyStressing
		// },

		{
			condition: (state, usedGirl) => {
				return isEndFunc(state, usedGirl, animationName.CrawlHeavyStressing, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressing],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressingBreast)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.KeepCrawl,
		// 		animationName.CrawlMove,
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.CrawlHeavyStressingBreast
		// },

		{
			condition: (state, usedGirl) => {
				// return getFrameIndexFunc(state, usedGirl, animationName.CrawlHeavyStressingBreast) >= getAnimationFrameCountWithoutState getAnimationFrameCount( animationName.CrawlHeavyStressingBreast) * 5 / 6
				return isEndFunc(state, usedGirl, animationName.CrawlHeavyStressingBreast, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressingBreast],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},

		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressingTrigoneAndButt)
		// 	},
		// 	currentAnimationNames: [
		// 		animationName.KeepCrawl,
		// 		animationName.CrawlMove,
		// 	],
		// 	weight: 0.0,
		// 	nextAnimationName: animationName.CrawlHeavyStressingTrigoneAndButt
		// },

		{
			condition: (state, usedGirl) => {
				// return getFrameIndexFunc(state, usedGirl, animationName.CrawlHeavyStressingTrigoneAndButt) >= getAnimationFrameCountWithoutState getAnimationFrameCount( animationName.CrawlHeavyStressingTrigoneAndButt) * 5 / 6
				return isEndFunc(state, usedGirl, animationName.CrawlHeavyStressingTrigoneAndButt, getIsDebug(state))
			},
			currentAnimationNames: [animationName.CrawlHeavyStressingTrigoneAndButt],
			nextAnimationName: animationName.KeepCrawl,
			noBlend: true
		},



		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlDeath)
			},
			currentAnimationNames: [animationName.KeepCrawl],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.CrawlDeath
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlDeath)
			},
			currentAnimationNames: [animationName.CrawlMove],
			weight: 0.0,
			isOnlyPlayOnce: true,
			nextAnimationName: animationName.CrawlDeath
		},
		// {
		// 	condition: (state, usedGirl) => {
		// 		return isTriggerActionFunc(state, usedGirl, actionName.CrawlDeath)
		// 	},
		// 	currentAnimationNames: [animationName.BreastPress],
		// 	weight: 0.0,
		// 	isOnlyPlayOnce: true,
		// 	nextAnimationName: animationName.CrawlDeath
		// },





		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressing)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.HeavyStressing
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingBreast)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.HeavyStressingBreast
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingTrigoneAndButt)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.HeavyStressingTrigoneAndButt
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressing)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.CrawlHeavyStressing
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressingBreast)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.CrawlHeavyStressingBreast
		},
		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.CrawlHeavyStressingTrigoneAndButt)
			},
			weight: 0.0,
			currentAnimationNames: getAnimationNamesExceptDamageNames(state),
			nextAnimationName: animationName.CrawlHeavyStressingTrigoneAndButt
		},

		{
			condition: (state, usedGirl) => {
				return isTriggerActionFunc(state, usedGirl, actionName.Reborn)
			},
			currentAnimationNames: [animationName.Death, animationName.CrawlDeath],
			nextAnimationName: animationName.Idle,
			noBlend: true,
		},
	]
		.concat(
			getAnimationBlendDataMod(
				state,
				[{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]
			) as any
		)
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

let _getMovePoint = (state, getShapeFunc, usedGirl, collisionPart_) => {
	return getShapeFunc(state, usedGirl, collisionPart_).center
}


let _handleMoveSound = (state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, judgePhaseFunc, isMiddleGiantessOrBiggerFunc], usedGirl, animationName, phase): string => {
	let soundId = null
	if (isCollisionWithRigidBodyFunc(state, usedGirl, animationName, phase)) {
		let v = Math.random()
		soundId = v > 0.5 ? getWalkVehicle1SoundResourceId() : getWalkVehicle2SoundResourceId()
	}
	else if (isCollisionWithCharacterFunc(state, usedGirl, animationName, phase)) {
		soundId = getWalkCharacterSoundResourceId()
	}
	else if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
		soundId = judgePhaseFunc(phase, getWalkLeftSoundResourceId(), getWalkRightSoundResourceId())
	}

	return soundId

}

export let getAnimationCollisionData = (state: state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
	getShapeFunc,
	getScaleFunc,
	getHeightFunc,
	isLittleCharacterTypeFunc
]): Array<animationCollisionData<animationName>> => {
	return [
		{
			name: animationName.Walk,

			// {
			// 	// frameIndex: 0,
			// 	// toFrameIndex: 30,

			// 	track: track.ShapeDamage,
			// 	value: (state, collisionData) => {
			// 		// let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

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
				// 		// let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

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
					value: (state, usedGirl, { animationName, phase }) => {
						return NullableUtils.return_({
							id: _handleMoveSound(state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc,
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
								, isMiddleGiantessOrBiggerFunc], usedGirl, animationName, phase),
							volume: getGiantessVolume(state, usedGirl, false)
						}) as any
					}
				},
				{
					frameIndices: [5, 20],

					track: track.Effect,
					value: (state, usedGirl, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndex: 5,

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getMoveHitTerrainEventName(),
							eventData: buildMoveHitTerrainEventData(
								_getMovePoint(state, getShapeFunc, usedGirl, collisionPart.LeftFoot),
								force,
								getCollisionPartOBB(state, usedGirl, collisionPart.LeftFoot),
								collisionPart.LeftFoot,
								getShoeType(state, usedGirl),
								usedGirl
							)
						}
					}

				},
				{
					frameIndex: 20,

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getMoveHitTerrainEventName(),
							eventData: buildMoveHitTerrainEventData(
								_getMovePoint(state, getShapeFunc, usedGirl, collisionPart.RightFoot),
								force,
								getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot),
								collisionPart.RightFoot,
								getShoeType(state, usedGirl),
								usedGirl
							)
						}
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
					value: (state, usedGirl, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndices: [4, 14],

					track: track.Audio,
					value: (state, usedGirl, { animationName, phase }) => {
						return NullableUtils.return_({
							id: _handleMoveSound(state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc,
								(phase, soundId1, soundId2) => {
									switch (phase) {
										case runPhase.LeftFootDown:
										case runPhase.LeftFootMove:
											return soundId1
										case runPhase.RightFootDown:
										case runPhase.RightFootMove:
											return soundId2
									}
								},
								isMiddleGiantessOrBiggerFunc
							], usedGirl, animationName, phase),
							volume: getGiantessVolume(state, usedGirl, false)
						}) as any
					}
				},
				{
					frameIndex: 4,

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getMoveHitTerrainEventName(),
							eventData: buildMoveHitTerrainEventData(
								_getMovePoint(state, getShapeFunc, usedGirl, collisionPart.RightFoot),
								force,
								getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot),
								collisionPart.RightFoot,
								getShoeType(state, usedGirl),
								usedGirl
							)
						}
					}

				},
				{
					frameIndex: 14,

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getMoveHitTerrainEventName(),
							eventData: buildMoveHitTerrainEventData(
								_getMovePoint(state, getShapeFunc, usedGirl, collisionPart.LeftFoot),
								force,
								getCollisionPartOBB(state, usedGirl, collisionPart.LeftFoot),
								collisionPart.LeftFoot,
								getShoeType(state, usedGirl),
								usedGirl
							)
						}
					}
				},

				{
					frameIndex: 4,

					track: track.RangeRepel,
					value: (state, usedGirl, _) => {
						let api = getModAPI(state)

						let level = api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-run-repel")

						if (level == 0) {
							return api.NullableUtils.getEmpty()
						}

						let box = api.obb.toBox3(getShapeFunc(state, usedGirl, collisionPart.RightFoot))
						box = api.box3.expandByScalar(box, 1.5 * level)

						return api.NullableUtils.return_([
							api.computeRepelDirection(api, box),
							box
						]) as any
					}
				},
				{
					frameIndex: 14,

					track: track.RangeRepel,
					value: (state, usedGirl, _) => {
						let api = getModAPI(state)

						let level = api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-run-repel")

						if (level == 0) {
							return api.NullableUtils.getEmpty()
						}

						let box = api.obb.toBox3(getShapeFunc(state, usedGirl, collisionPart.LeftFoot))
						box = api.box3.expandByScalar(box, 1.5 * level)

						return api.NullableUtils.return_([
							api.computeRepelDirection(api, box),
							box
						]) as any
					}
				},
				{
					frameIndex: 4,

					track: track.Particle,
					value: (state, usedGirl, _): any => {
						let api = getModAPI(state)

						let level = api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-run-repel")

						if (level == 0) {
							return api.NullableUtils.getEmpty()
						}

						let rightFootPoint = getShapeFunc(state, usedGirl, collisionPart.RightFoot).center

						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							let scalar = 1.5
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state, usedGirl) / scalar,
										position: rightFootPoint.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndex: 14,

					track: track.Particle,
					value: (state, usedGirl, _): any => {
						let api = getModAPI(state)

						let level = api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-run-repel")

						if (level == 0) {
							return api.NullableUtils.getEmpty()
						}

						let leftFootPoint = getShapeFunc(state, usedGirl, collisionPart.LeftFoot).center

						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							let scalar = 1.5
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state, usedGirl) / scalar,
										position: leftFootPoint.toArray()
									}
								],
							])
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
					value: (state, usedGirl, _): any => {
						let leftShankPoint = getShapeFunc(state, usedGirl, collisionPart.LeftShank).center
						let rightShankPoint = getShapeFunc(state, usedGirl, collisionPart.RightShank).center

						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500,
										life: 3000,
										size: getScaleFunc(state, usedGirl),
										position: leftShankPoint.toArray()
									}
								],
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500,
										life: 3000,
										size: getScaleFunc(state, usedGirl),
										position: rightShankPoint.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.StandToCrawl)),

					track: track.Particle,
					value: (state, usedGirl, _): any => {
						let leftHandPoint = getShapeFunc(state, usedGirl, collisionPart.LeftHand).center
						let rightHandPoint = getShapeFunc(state, usedGirl, collisionPart.RightHand).center

						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							let scalar = 1.5
							return NullableUtils.return_([
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state, usedGirl) / scalar,
										position: leftHandPoint.toArray()
									}
								],
								[
									particle.StompDust,
									{
										speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
										changeLife: 500 / scalar,
										life: 3000 / scalar,
										size: getScaleFunc(state, usedGirl) / scalar,
										position: rightHandPoint.toArray()
									}
								],
							])
						}

						return NullableUtils.getEmpty()
					}
				},
				{
					frameIndices: [30, getLastFrameIndex(getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.StandToCrawl))],

					track: track.Effect,
					value: (state, usedGirl, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return effect.ScreenShake
						}

						return null
					}

				},
				{
					frameIndices: [30, getLastFrameIndex(getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.StandToCrawl))],

					track: track.Audio,
					value: (state, usedGirl, { animationName, phase }): any => {
						if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return NullableUtils.getEmpty()
						}

						let id
						switch (phase) {
							case standToCrawlPhase.ShankDown:
								id = getStandToCrawlShankSoundResourceId()
								break
							case standToCrawlPhase.HandDown:
								id = getStandToCrawlHandSoundResourceId()
								break
						}

						return NullableUtils.return_({
							id,
							volume: getGiantessVolume(state, usedGirl, false)
						})
					}
				},

				{
					frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.StandToCrawl)),

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getStandToCrawlEventName(),
							eventData: {
								usedGirl
							}
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
					// frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState( animationName.CrawlToStand)), getAnimationFrameCount
					frameIndex: getEarlyFrameIndex(),

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getCrawlToStandEventName(),
							eventData: {
								usedGirl
							}
						}
					}

				},
			]
		},
		// {
		// 	name: animationName.BreastPress,

		// 	shapeDamage: [
		// 		collisionPart.Head,
		// 		collisionPart.LeftBreast, collisionPart.RightBreast,
		// 		collisionPart.LeftThigh, collisionPart.RightThigh,
		// 		collisionPart.Torso,
		// 		collisionPart.TrigoneAndButt,
		// 	],
		// 	timeline: [
		// 		{
		// 			frameIndex: 20,

		// 			track: track.Audio,
		// 			value: (state, usedGirl, { animationName, phase }): any => {
		// 				return NullableUtils.return_({
		// 					id: getBreastPressLaughSoundResourceId(),
		// 					volume: getGiantessVolume(state, usedGirl)
		// 				})
		// 			},
		// 		},
		// 	]
		// },
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
					value: (state, usedGirl, _): any => {
						if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
							return effect.ScreenShake
						}

						return null
					}
				},
				{
					frameIndices: [11, 31],

					track: track.Audio,
					value: (state, usedGirl, { animationName, phase }) => {
						return NullableUtils.return_({
							id: _handleMoveSound(state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc,
								(phase, soundId1, soundId2) => {
									return soundId1
								},
								isMiddleGiantessOrBiggerFunc
							], usedGirl, animationName, phase),
							volume: getGiantessVolume(state, usedGirl, false)
						}) as any
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
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getPickupEventName(),
							eventData: buildPickupEventData(
								getShapeFunc(state, usedGirl, collisionPart.RightHand).toBox3(),
								usedGirl
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
					// frameIndex: getEarlyFrameIndex(),
					frameIndices: [getEarlyFrameIndex(), 10],

					track: track.Particle,
					value: (state, usedGirl, _): any => {
						return NullableUtils.bind(box => {
							let point = box.getCenter(_v1)
							let sizeLength = box.getSize(_v2).length()

							if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
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
						}, getPickObjectBox(state, usedGirl))
					}
				},
				{
					frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.Pinch)),

					track: track.Event,
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getPinchJudageDamageEventName(),
							eventData: {
								usedGirl
							}
						}
					}

				},
				{
					// frameIndex: getEarlyFrameIndex(),
					frameIndices: [getEarlyFrameIndex(), 10],

					track: track.Audio,
					value: (state, usedGirl, { animationName, phase }): any => {
						let pickObjectName = getRandomPickObjectName(state, usedGirl)

						return NullableUtils.return_({
							id: NullableUtils.getWithDefault(
								NullableUtils.map(name => {
									if (isMilltaryVehicle(name)
										|| isMilltaryBuilding(name)
									) {
										return getPinchMilltarySoundResourceId()
									}

									return getPinchCharacterSoundResourceId()
								}, pickObjectName),
								getPinchCharacterSoundResourceId()
							),
							volume: getGiantessVolume(state, usedGirl, false)
						})
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
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getEatEventName(),
							eventData: {
								usedGirl
							}
						}
					}
				},
				{
					// frameIndex: getEatHandleFrameIndex(),
					frameIndex: getEatRemovePickDataFrameIndex(),

					track: track.Audio,
					value: (state, usedGirl, { animationName, phase }): any => {
						return NullableUtils.return_({
							id: getEatSoundResourceId(),
							volume: getGiantessVolume(state, usedGirl, false)
						})
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
					value: (state, usedGirl, {
						force
					}): any => {
						return {
							eventName: getPickdownEventName(),
							eventData: buildPickdownEventData(
								getShapeFunc(state, usedGirl, collisionPart.RightHand).center,
								usedGirl
							)
						}
					}

				},
			]
		},

	].concat(
		getAnimationCollisionDataMod(state, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
			getShapeFunc,
			getScaleFunc,
			getHeightFunc,
			isLittleCharacterTypeFunc
		]) as any
	)
}

export let getActionData = (state: state): actionData<animationName> => {
	return [
		{
			name: animationName.Walk,
			force: {
				[walkPhase.LeftFootMove]: giantessForceSize.VeryLow2,
				[walkPhase.RightFootMove]: giantessForceSize.VeryLow2,
				// [walkPhase.LeftFootDown]: 12,
				// [walkPhase.RightFootDown]: 12,
				// [walkPhase.LeftFootDown]: 20,
				// [walkPhase.RightFootDown]: 20,
				// [walkPhase.LeftFootDown]: 16,
				// [walkPhase.RightFootDown]: 16,
				[walkPhase.LeftFootDown]: giantessForceSize.Middle1,
				[walkPhase.RightFootDown]: giantessForceSize.Middle1,

			}
		},
		{
			name: animationName.Run,
			force: {
				[runPhase.LeftFootMove]: giantessForceSize.Low,
				[runPhase.RightFootMove]: giantessForceSize.Low,
				// [runPhase.LeftFootDown]: 22,
				// [runPhase.RightFootDown]: 22,
				// [runPhase.LeftFootDown]: 18,
				// [runPhase.RightFootDown]: 18,
				[runPhase.LeftFootDown]: giantessForceSize.Middle2,
				[runPhase.RightFootDown]: giantessForceSize.Middle2,
			}
		},


		{
			name: animationName.StandToCrawl,
			force: {
				// [standToCrawlPhase.ShankDown]: 20,
				// [standToCrawlPhase.HandDown]: 20,
				[standToCrawlPhase.ShankDown]: giantessForceSize.Middle3,
				[standToCrawlPhase.HandDown]: giantessForceSize.Middle3,
			}
		},
		{
			name: animationName.CrawlToStand,
			force: {
				[crawlToStandPhase.HandUp]: giantessForceSize.Middle,
			}
		},
		// {
		// 	name: animationName.BreastPress,
		// 	force: {
		// 		[breastPressPhase.Down]: 10,
		// 		[breastPressPhase.Up]: 5,
		// 	}
		// },
		{
			name: animationName.CrawlMove,
			force: {
				[crawlMovePhase.Move]: giantessForceSize.VeryLow2,
				// [crawlMovePhase.Down]: 18,
				// [crawlMovePhase.Down]: 15,
				[crawlMovePhase.Down]: giantessForceSize.Low2,
			}
		},


		{
			name: animationName.Pinch,
			force: {
				[pinchPhase.FirstPinch]: giantessForceSize.VeryLow2,
				[pinchPhase.SecondPinch]: giantessForceSize.Low2,
			}
		},
		{
			name: animationName.Eat,
			force: {
				[eatPhase.BeforeEat]: giantessForceSize.Negative,
				[eatPhase.Eat]: getMaxForce(),
			}
		},
	].concat(getActionDataMod(state) as any)
}

export let getPhase = (state: state): phaseData<animationName> => {
	return ([
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
		// {
		// 	name: animationName.Stomp,
		// 	value: [
		// 		{
		// 			frameIndexRange: [0, 20],
		// 			phase: stompPhase.Up
		// 		},
		// 		{
		// 			frameIndexRange: [21, 70],
		// 			phase: stompPhase.Down
		// 		},
		// 	]
		// },

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
		// {
		// 	name: animationName.BreastPress,
		// 	value: [
		// 		{
		// 			frameIndexRange: [0, 60],
		// 			phase: breastPressPhase.Down
		// 		},
		// 		{
		// 			frameIndexRange: [61, 80],
		// 			phase: breastPressPhase.Up
		// 		}
		// 	]
		// },

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
					// frameIndexRange: [0, getAnimationFrameCountWithoutState(animationName.Pinch)], getAnimationFrameCount
					frameIndexRange: [0, 10],
					phase: pinchPhase.FirstPinch
				},
				{
					frameIndexRange: [11, 40],
					phase: pinchPhase.SecondPinch
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
					frameIndexRange: [getEatWorkFrameIndex(), getAnimationFrameCountWithoutState(state, getAnimationFrameCount, animationName.Eat)],
					phase: eatPhase.Eat
				}
			]
		},
	] as any)
		.concat(
			getPhaseMod(state)
		)
}

export let getSkillStressingFactor = (state: state): skillStressingFactor => {
	let zeroValue = skillStressingValue.Zero
	let lowValue = skillStressingValue.Low
	let middleValue = skillStressingValue.Middle
	let highValue = skillStressingValue.High

	return [
		// {
		// 	name: animationName.Stomp,
		// 	value: lowValue
		// },
		// {
		// 	name: animationName.BreastPress,
		// 	value: highValue
		// },
		{
			name: animationName.Eat,
			value: zeroValue
		},
		{
			name: animationName.Pickup,
			value: middleValue
		},
		{
			name: animationName.Pickdown,
			value: lowValue
		},
		{
			name: animationName.Pinch,
			value: lowValue
		},
	].concat(getSkillStressingFactorMod(state) as any)
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

		// {
		// 	name: articluatedAnimationName.Light_Stressing_Giantess_Move,
		// 	initial: (state, getValueFunc) => {
		// 		let origin = getValueFunc(state)

		// 		return { x: origin.x, y: origin.y, z: origin.z }
		// 	},
		// 	tweens: (state, getParamFunc) => {
		// 		// let [position, amplitude, timeScalar] = getParamFunc(state)
		// 		let [amplitude, timeScalar] = getParamFunc(state)

		// 		// let isXDirection = Math.random() > 0.5

		// 		let t1, t2
		// 		// let t3 = position
		// 		let t3 = _v3.set(0, 0, 0)
		// 		// if (isXDirection) {
		// 		// t1 = _v1.set(position.x - amplitude, position.y, position.z)
		// 		// t2 = _v2.set(position.x + amplitude, position.y, position.z)
		// 		t1 = _v1.set(- amplitude, 0, 0)
		// 		t2 = _v2.set(+ amplitude, 0, 0)

		// 		// }
		// 		// else {
		// 		// 	t1 = _v1.set(position.x, position.y, position.z - amplitude)
		// 		// 	t2 = _v2.set(position.x, position.y, position.z + amplitude)
		// 		// }


		// 		return [
		// 			[{ x: t1.x, y: t1.y, z: t1.z }, 33 * timeScalar],
		// 			[{ x: t2.x, y: t2.y, z: t2.z }, 66 * timeScalar],
		// 			[{ x: t3.x, y: t3.y, z: t3.z }, 33 * timeScalar],
		// 		]

		// 	},
		// 	repeatCount: 2,
		// },
		{
			name: articluatedAnimationName.Light_Stressing_Giantess_Move,
			initial: (state, getValueFunc) => {
				return getValueFunc(state)
			},
			tweens: (state, getParamFunc) => {
				let [initialValue, amplitude, timeScalar] = getParamFunc(state)


				let t1, t2
				let t3 = initialValue
				t1 = { x: - amplitude }
				t2 = { x: + amplitude }


				return [
					[t1, 33 * timeScalar],
					[t2, 66 * timeScalar],
					[t3, 33 * timeScalar],
				]

			},
			repeatCount: 2,
		},
		{
			name: articluatedAnimationName.Light_Stressing_Giantess_Rotate,
			initial: (state, getValueFunc) => {
				return { euler: 0 }
			},
			tweens: (state, getParamFunc) => {
				let [amplitude, timeScalar] = getParamFunc(state)

				return [
					[{ euler: -amplitude }, 33 * timeScalar],
					[{ euler: amplitude }, 66 * timeScalar],
					[{ euler: 0 }, 33 * timeScalar],
				]
			},
			repeatCount: 2,
		},

		{
			name: articluatedAnimationName.Light_Stressing_Army_Move,
			initial: (state, getValueFunc) => {
				let origin = getValueFunc(state)

				return { x: origin.x, y: origin.y, z: origin.z }
			},
			tweens: (state, getParamFunc) => {
				let [position, amplitude, timeScalar] = getParamFunc(state)

				// let isXDirection = Math.random() > 0.5

				let t1, t2
				let t3 = position
				// if (isXDirection) {
				t1 = _v1.set(position.x - amplitude, position.y, position.z)
				t2 = _v2.set(position.x + amplitude, position.y, position.z)
				// }
				// else {
				// 	t1 = _v1.set(position.x, position.y, position.z - amplitude)
				// 	t2 = _v2.set(position.x, position.y, position.z + amplitude)
				// }


				return [
					[{ x: t1.x, y: t1.y, z: t1.z }, 33 * timeScalar],
					[{ x: t2.x, y: t2.y, z: t2.z }, 66 * timeScalar],
					[{ x: t3.x, y: t3.y, z: t3.z }, 33 * timeScalar],
				]

			},
			repeatCount: 2,
		},
	]
}

export let getAnimationData = (state: state): Partial<Record<animationName, animationData>> => {
	return MutableRecordUtils.concat(
		{
			[animationName.Walk]: {
				experienceFactor: experienceFactor.Middle
			},
			[animationName.Run]: {
				experienceFactor: experienceFactor.Middle2
			},
			[animationName.CrawlMove]: {
				experienceFactor: experienceFactor.Middle
			},

			// [animationName.Stomp]: {
			// 	experienceFactor: experienceFactor.Middle3
			// },

			// [animationName.BreastPress]: {
			// 	experienceFactor: experienceFactor.VeryHigh
			// },
			[animationName.StandToCrawl]: {
				experienceFactor: experienceFactor.Middle
			},
			[animationName.CrawlToStand]: {
				experienceFactor: experienceFactor.Low
			},

			[animationName.Pinch]: {
				experienceFactor: experienceFactor.High
			},
			[animationName.Eat]: {
				experienceFactor: experienceFactor.VeryHigh
			},
		},
		getAnimationDataMod(state)
	)
}