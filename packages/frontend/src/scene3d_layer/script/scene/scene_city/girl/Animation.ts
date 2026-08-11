import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { getCenter, getGirl, getGirlMesh, getValue, isActionState, isTriggerAction, resetIsTriggerAction, setGirlScale, hasGirlValue, setUsedGirlData, getUsedGirlData, isPlayerGirl, isPlayerGirlByUsedGirl } from "./Girl"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { getAnimationBlendDuration } from "../data/Data"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { animationName, articluatedAnimationName } from "../data/DataType"
import { changePivotByAdd, computeGirlBoxAndSetToState, computeHeight, getGirlBox, getGirlPosition, getGirlRotation, getHeightByScale, getPivotWorldPosition, getScale, setPivotToOrigin } from "./Utils"
import { Device } from "meta3d-jiehuo-abstract"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { createIdleState, createInitialState, createKeepCrawlState, createKeepPickState, createScenarioState, getStateMachine, setStateMachine } from "./FSMState"
import { objectStateName, playerStateStatusName, pose } from "../type/StateType"
import { getIsDebug } from "../../Scene"
import { changePose, getCurrentPose, isPose } from "./Pose"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getBiggerSoundResourceId, getConfigData, getGirlScale, getSmallerSoundResourceId, isGiantessCharacterType } from "../CityScene"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getGirlVolume, getVolume } from "../utils/SoundUtils"
import { refreshBiggerTime } from "./InitWhenImportScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { updateDistanceRateOnlyOnceInOneFrame } from "../Camera"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { isDestoryRelatedStates } from "../utils/FSMStateUtils"
import { computeAnimationDurationFactor } from "../utils/GiantessUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { createFSMStateByChangeAnimationName, getAllAnimationNames as getAllAnimationNamesMod, getHeavyStressingBlockService, getHeavyStressingBreastBlockService, getHeavyStressingTrigoneAndButtBlockService, getKeepSitBlockService, getSitDeathBlockService, getUBHeavyStressingBlockService, isKeepPoseAnimation as isKeepPoseAnimationMod, handleChangeAnimationName } from "../../../../mod/SkillGiantessMod"
import { Event } from "meta3d-jiehuo-abstract"
import { getBreastPartialScaleRatio, getTorsorPartialScaleRatio } from "../utils/PartialScaleGiantessUtils"
import { getBoxVolumn } from "../utils/Box3Utils"
import { computeEnhenceValueByCarryLevel, getEnhenceByCarryLevel } from "../build/Career"

export let isPlayingAnimationByWeight = (state, usedGirl, animationName, weight) => {
	return SkinBlendAnimation.getWeight(getAbstractState(state), usedGirl, getGirlMesh(state, usedGirl), animationName) >= weight
}

export let isCompletelyPlayingAnimation = (state, usedGirl, animationName) => {
	return isPlayingAnimationByWeight(state, usedGirl, animationName, 1)
}

export let isPlayingAnimation = (state, usedGirl, animationName) => {
	return SkinBlendAnimation.getWeight(getAbstractState(state), usedGirl, getGirlMesh(state, usedGirl), animationName) > 0
}

export let getAllAnimationNames = (state: state): Array<animationName> => [
	animationName.Idle,
	//  animationName.Stomp,
	animationName.Walk, animationName.Run,

	animationName.StandToCrawl, animationName.CrawlToStand,

	animationName.KeepCrawl, animationName.CrawlMove,
	// animationName.BreastPress,


	animationName.Pickup,
	animationName.Pickdown,
	animationName.KeepPick,
	animationName.Pinch,
	animationName.Eat,



	animationName.HeavyStressing,
	animationName.HeavyStressingBreast,
	animationName.HeavyStressingTrigoneAndButt,
	animationName.Death,


	animationName.CrawlHeavyStressing,
	animationName.CrawlHeavyStressingBreast,
	animationName.CrawlHeavyStressingTrigoneAndButt,
	animationName.CrawlDeath,

	// animationName.Hello,
].concat(
	getAllAnimationNamesMod(state) as any
)

// export let getChangePoseAnimationNames = (): Array<animationName> => {
// 	return [animationName.StandToCrawl, animationName.CrawlToStand]
// }

export let getDeathAnimationNames = (state: state): Array<animationName> => [
	animationName.Death,


	animationName.CrawlDeath,

	getSitDeathBlockService(state).getForceAnimationName(),

]

export let getDamageAnimationNames = (state: state): Array<animationName> => {
	return [
		animationName.HeavyStressing,
		animationName.HeavyStressingBreast,
		animationName.HeavyStressingTrigoneAndButt,
		// animationName.Death,


		animationName.CrawlHeavyStressing,
		animationName.CrawlHeavyStressingBreast,
		animationName.CrawlHeavyStressingTrigoneAndButt,
		// animationName.CrawlDeath,

		getHeavyStressingBlockService(state).getForceAnimationName(),
		getHeavyStressingBreastBlockService(state).getForceAnimationName(),
		getHeavyStressingTrigoneAndButtBlockService(state).getForceAnimationName(),
		// getSitDeathBlockService(state).getForceAnimationName(),

		getUBHeavyStressingBlockService(state).getForceAnimationName(),

	].concat(getDeathAnimationNames(state))
}

// export let computeDuration = (state, animationName) => {
// 	// const minDuration = 1

// 	let scale = getScale(state, usedGirl)
// 	let girlMesh = getGirlMesh(state, usedGirl)

// 	let customDuration = getCustomDuration(state)

// 	// let durationFactor = getDurationFactor(state, usedGirl)

// 	let clip = MMD.findAnimationClip(getAbstractState(state), girlMesh, animationName)

// 	let duration = clip.duration
// 	// let originDuration = duration


// 	if (!NullableUtils.isNullable(customDuration)) {
// 		return NullableUtils.getExn(customDuration)
// 	}

// 	duration *= (1 + computeAnimationDurationFactor(getHeightByScale(scale)))

// 	return duration
// }

// export let computeActualDuration = (state, animationName, duration) => {
// 	const minDuration = 1

// 	// let scale = getScale(state, usedGirl)
// 	let girlMesh = getGirlMesh(state, usedGirl)

// 	let customDuration = getCustomDuration(state)

// 	let durationFactor = getDurationFactor(state, usedGirl)

// 	let clip = MMD.findAnimationClip(getAbstractState(state), girlMesh, animationName)

// 	// let duration = clip.duration
// 	let originDuration = clip.duration


// 	if (!NullableUtils.isNullable(customDuration)) {
// 		// return NullableUtils.getExn(customDuration) * durationFactor
// 		return duration * durationFactor
// 	}

// 	// duration *= (1 + computeAnimationDurationFactor(getHeightByScale(scale)))

// 	return NumberUtils.clamp(duration * durationFactor, minDuration, originDuration * 4.5)
// }

// export let computeDuration = (state, animationName) => {
// 	const minDuration = 1

// 	let scale = getScale(state, usedGirl)
// 	let girlMesh = getGirlMesh(state, usedGirl)

// 	let customDuration = getCustomDuration(state)

// 	let durationFactor = getDurationFactor(state, usedGirl)

// 	let clip = MMD.findAnimationClip(getAbstractState(state), girlMesh, animationName)

// 	let duration = clip.duration
// 	let originDuration = duration


// 	if (!NullableUtils.isNullable(customDuration)) {
// 		return [originDuration, NullableUtils.getExn(customDuration) * durationFactor]
// 	}

// 	duration *= (1 + computeAnimationDurationFactor(getHeightByScale(scale)))

// 	return [originDuration, NumberUtils.clamp(duration * durationFactor, minDuration, originDuration * 4.5)]
// }
export let computeDuration = (state, usedGirl, animationName): [number, number, number] => {
	let scale = getScale(state, usedGirl)
	let girlMesh = getGirlMesh(state, usedGirl)

	let customDuration = getCustomDuration(state, usedGirl)

	let durationFactor = getDurationFactor(state, usedGirl)
	let breastPartialScaleRatio = getBreastPartialScaleRatio(state, usedGirl)
	let torsorPartialScaleRatio = getTorsorPartialScaleRatio(state, usedGirl)

	durationFactor *= (1 + breastPartialScaleRatio * 0.5)
	durationFactor *= (1 + torsorPartialScaleRatio * 0.6)



	// if (isGiantessCharacterType(state)) {
	if (isPlayerGirlByUsedGirl(usedGirl)) {
		durationFactor /= 1 + computeEnhenceValueByCarryLevel(state, usedGirl, 5, 1)
	}







	let clip = MMD.findAnimationClip(getAbstractState(state), usedGirl, girlMesh, animationName)

	let duration = clip.duration
	let originDuration = duration


	let minDuration = NumberUtils.greaterThan(originDuration * 0.8, 1)


	if (!NullableUtils.isNullable(customDuration)) {
		return [NullableUtils.getExn(customDuration) * durationFactor, durationFactor, originDuration]
	}

	duration *= (1 + computeAnimationDurationFactor(getHeightByScale(scale)))

	let durationBefore = duration

	duration *= durationFactor

	let resultDurationFactor, resultDuration


	// if (duration < minDuration) {
	// 	resultDurationFactor = 1
	// 	resultDuration = minDuration
	// }
	// else if (duration > originDuration * 4.5) {
	// 	resultDurationFactor = 1
	// 	resultDuration = originDuration * 4.5
	// }
	// else {
	// 	resultDurationFactor = durationFactor
	// 	resultDuration = duration
	// }
	resultDuration = NumberUtils.clamp(duration, minDuration, originDuration * 4.5)

	if ((duration > originDuration * 4.5 && durationBefore > originDuration * 4.5)
		|| (duration < minDuration && durationBefore < minDuration)
	) {
		// resultDurationFactor = durationFactor
		resultDurationFactor = 1
	}
	else {
		resultDurationFactor = resultDuration / durationBefore
	}

	return [resultDuration, resultDurationFactor, originDuration]
}

export let updateAnimationDuration = (state: state, usedGirl, scale) => {
	let girlMesh = getGirlMesh(state, usedGirl)

	getConfigData(state).girlAllAnimationNames.forEach(animationName => {
		// if(animationName == animationName.Idle){
		// if (animationName == animationName.Walk) {
		//     return
		// }

		let action = MMD.findAnimationAction(getAbstractState(state), usedGirl, girlMesh, animationName)

		// SkinAnimation.setDuration(action, computeActualDuration(state, animationName, computeDuration(state, animationName)))
		SkinAnimation.setDuration(action, TupleUtils.getTuple3First(computeDuration(state, usedGirl, animationName)))

	})

	// Console.log(clip.duration)

	return state
}

export let computeAnimatonDurationFactor = (state: state, usedGirl) => {
	let [duration, _, originDuration] = computeDuration(state, usedGirl, getCurrentAnimationName(state, usedGirl))

	return duration / originDuration
}

export let playAnimationLoop = (state: state, usedGirl, animationName, noBlend) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		nextBlendingAnimationName: animationName,
		isCurrentAnimationOnlyPlayOnce: false,
		noBlend
	})
}

// export let changeState = (state: state, targetState: objectStateName) => {
// 	let nextBlendingAnimationName
// 	switch (targetState) {
// 		case objectStateName.Initial:
// 			nextBlendingAnimationName = animationName.Idle
// 			break
// 		case objectStateName.Walk:
// 			nextBlendingAnimationName = animationName.Walk
// 			break
// 		// case objectStateName.Stomp:
// 		// 	nextBlendingAnimationName = animationName.Stomp
// 		// 	break
// 		default:
// 			throw new Error("unknow state")
// 	}

// 	return playAnimationLoop(state, nextBlendingAnimationName)
// }

export let playAnimationOnlyOnce = (state: state, usedGirl, animationName, noBlend) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		nextBlendingAnimationName: animationName,
		isCurrentAnimationOnlyPlayOnce: true,
		noBlend
	})
}

export let isEnd = (state, usedGirl, animationName_, isDebug: boolean, offset = 0) => {
	// requireCheck(() => {
	// 	test("duration is too short for low offset", () => {
	// 		if (offset > 0) {
	// 			return true
	// 		}

	// 		return MMD.findAnimationClip(getAbstractState(state), getGirlMesh(state, usedGirl), animationName_).duration >= 1
	// 	})
	// }, getIsDebug(state))


	return SkinAnimation.isSpecificFrameIndex(
		SkinAnimation.getFrameIndex(
			MMD.findAnimationAction(getAbstractState(state), usedGirl, getGirlMesh(state, usedGirl), animationName_),
			getAnimationFrameCount(state, animationName_)
		),
		getAnimationFrameCount(state, animationName_),
		getAnimationFrameCount(state, animationName_),
		offset,
		isDebug
	)
}

let _isStressingOrDeathAnimation = (animationname) => {
	return animationname.includes("Stressing") || animationname.includes("Death")
}

let _updateAnimationBlendAndFSMState = (state, usedGirl, isForScenario) => {
	let girlMesh = getGirlMesh(state, usedGirl)

	if (!isForScenario) {
		state = getConfigData(state).animationBlendData.reduce((state, data) => {
			if (
				data.condition(state, usedGirl)
				&& data.currentAnimationNames.includes(getUsedGirlData(state, usedGirl).currentAnimationName)
				// (
				// 	NullableUtils.getWithDefault(
				// 		NullableUtils.map(
				// 			isCurrentAnimationName => {
				// 				return isCurrentAnimationName(state)
				// 			}, data.isCurrentAnimationName
				// 		),
				// 		getUsedGirlData(state, usedGirl).currentAnimationName == NullableUtils.getExn( data.currentAnimationName)
				// 	)
				// )
				&& data.currentAnimationNames.reduce((result, animationName_) => {
					if (result) {
						return result
					}

					return isPlayingAnimationByWeight(state, usedGirl, animationName_, NullableUtils.getWithDefault(data.weight, 1))
				}, false)
			) {
				// return setUsedGirlData(state, usedGirl,{
				// 	...getUsedGirlData(state, usedGirl),
				// 	nextBlendingAnimationName: data.nextAnimationName
				// })

				let noBlend = NullableUtils.getWithDefault(data.noBlend, false)
				state = setUsedGirlData(state, usedGirl, {
					...getUsedGirlData(state, usedGirl),
					noBlend
				})

				// TODO play keepDeath animation instead
				// if (
				// 	data.nextAnimationName == animationName.Death
				// 	||
				// 	data.nextAnimationName == animationName.CrawlDeath
				// ) {
				let isOnlyPlayOnce = NullableUtils.getWithDefault(data.isOnlyPlayOnce, false)
				if (isOnlyPlayOnce === true) {
					return playAnimationOnlyOnce(state, usedGirl, data.nextAnimationName, noBlend)
				}

				return playAnimationLoop(state, usedGirl, data.nextAnimationName, noBlend)
			}

			return state
		}, state)
	}

	let { currentAnimationName, noBlend, isCurrentAnimationOnlyPlayOnce } = getUsedGirlData(state, usedGirl)

	// let d = getUsedGirlData(state, usedGirl).createFSMStateByCurrentAnimationNameFunc(state, currentAnimationName)
	// state = d[0]
	// let fsmState = d[1]

	// let promise
	// if (NullableUtils.isNullable(fsmState)
	// 	|| isDestoryRelatedStates(getStateMachine(state))
	// ) {
	// 	promise = Promise.resolve(state)
	// }
	// else {
	// 	promise = StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), NullableUtils.getExn(fsmState), null)
	// }

	return NullableUtils.getWithDefault(
		NullableUtils.map(nextBlendingAnimationName => {
			// Console.log(
			// 	currentAnimationName, nextBlendingAnimationName
			// )
			if (currentAnimationName !== nextBlendingAnimationName) {
				if (isTriggerAction(state, usedGirl, currentAnimationName)) {
					state = resetIsTriggerAction(state, usedGirl)
				}

				let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

				if (noBlend) {

					// state = SkinBlendAnimation.playSkinAnimation(state,
					// 	helper.findAnimationAction(girl, currentAnimationName),
					// 	helper.findAnimationAction(girl, nextBlendingAnimationName),
					// 	isCurrentAnimationOnlyPlayOnce)

					SkinBlendAnimation.executeCrossFade(
						helper.findAnimationAction(girlMesh, currentAnimationName),
						helper.findAnimationAction(girlMesh, nextBlendingAnimationName),
						0
					)
				}
				else {
					SkinBlendAnimation.executeCrossFade(
						helper.findAnimationAction(girlMesh, currentAnimationName),
						helper.findAnimationAction(girlMesh, nextBlendingAnimationName),
						getAnimationBlendDuration(
							currentAnimationName, nextBlendingAnimationName
						)
					)
				}

				// if (!isForScenario) {
				state = setUsedGirlData(state, usedGirl, {
					...getUsedGirlData(state, usedGirl),
					// isResetActionCollision: false,
					currentAnimationName: nextBlendingAnimationName,
					previousAnimationName: NullableUtils.return_(currentAnimationName)
				})

				let d = getUsedGirlData(state, usedGirl).createFSMStateByChangeAnimationNameFunc(state, usedGirl, nextBlendingAnimationName)
				state = d[0]
				let fsmState = d[1]

				state = handleChangeAnimationName(state, usedGirl, nextBlendingAnimationName, currentAnimationName)

				if (NullableUtils.isNullable(fsmState)
					|| isDestoryRelatedStates(getStateMachine(state, usedGirl))
				) {
					return Promise.resolve(state)
				}

				return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine(usedGirl), getStateMachine(state, usedGirl), NullableUtils.getExn(fsmState), null)
			}

			return Promise.resolve(state)
		}, getUsedGirlData(state, usedGirl).nextBlendingAnimationName),
		Promise.resolve(state)
	)
}

let _handlePlayOnce = (state: state, usedGirl) => {
	let { isCurrentAnimationOnlyPlayOnce, currentAnimationName } = getUsedGirlData(state, usedGirl)

	if (isCurrentAnimationOnlyPlayOnce &&
		isEnd(
			state, usedGirl,
			currentAnimationName,
			getIsDebug(state)
		)
	) {
		MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).pause()
	}
	else {
		MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).resume()
	}

	return state
}

export let updateAnimation = (state: state, usedGirl): Promise<state> => {
	return _updateAnimationBlendAndFSMState(state, usedGirl, false).then(state => {
		state = setUsedGirlData(state, usedGirl, {
			...getUsedGirlData(state, usedGirl),
			nextBlendingAnimationName: NullableUtils.getEmpty()
		})

		state = updateAnimationDuration(state, usedGirl, getScale(state, usedGirl))

		// state = resetIsTriggerActionMap(state)

		state = _handlePlayOnce(state, usedGirl)

		return state
	})
}

export let restore = (state, usedGirl) => {
	MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).resume()

	return state
}

export let updateAnimationForScenario = (state: state, usedGirl): Promise<state> => {
	return _updateAnimationBlendAndFSMState(state, usedGirl, true).then(state => {
		state = setUsedGirlData(state, usedGirl, {
			...getUsedGirlData(state, usedGirl),
			nextBlendingAnimationName: NullableUtils.getEmpty()
		})

		state = updateAnimationDuration(state, usedGirl, getScale(state, usedGirl))

		state = _handlePlayOnce(state, usedGirl)

		return state
	})
}

export let getPreviousAnimationName = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).previousAnimationName
}

export let getCurrentAnimationName = <animationName>(state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).currentAnimationName as animationName
}

export let setCurrentAnimationName = (state: state, usedGirl, name) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		currentAnimationName: name,
	})
}

export let getNextAnimationName = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).nextBlendingAnimationName
}

export let isKeepPoseAnimation = (state, actionName, animationName_: animationName) => {
	if (!isKeepPoseAnimationMod(state, actionName)) {
		return false
	}

	switch (animationName_) {
		case animationName.Idle:
		case animationName.KeepPick:
		case animationName.KeepCrawl:
		case getKeepSitBlockService(state).getForceAnimationName():
			return true
		default:
			return false
	}
}

let _markIsChangeScaling = (state: state, usedGirl, isChangeScaling: boolean) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		isChangeScaling
	})
}

export let isChangeScaling = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).isChangeScaling
}

export let isBiggerScale = (state: state, usedGirl) => {
	return getScale(state, usedGirl) == getValue(state, usedGirl).scaleIncrease * 4
}

export let isBiggerBiggerAndMoreScale = (state: state, usedGirl) => {
	return getScale(state, usedGirl) >= getValue(state, usedGirl).scaleIncrease * 7
}

export let playBiggerAnimation = (state, [handleCompleteFunc, getParamFunc], usedGirl) => {
	// if (getCurrentPose(state, usedGirl) == pose.Crawl) {
	// 	state = changeToStandPosePivot(state)
	// }

	// // TODO judge is crawl pose
	// let _computeGirlMeshDiff = (state: state) => {
	// 	return getGirlPosition(state, usedGirl).clone().sub(getCenter(state)).setY(0)
	// 		.applyQuaternion(
	// 			getGirlRotation(state, usedGirl).clone().invert()
	// 		)

	// }

	// Console.log(getGirlPosition(state, usedGirl))
	// state = setPivotToOrigin(state,
	// 	NullableUtils.getExn(getUsedGirlData(state, usedGirl).girlGroupPositionDiffForChangePivot)
	// 		// .multiplyScalar(getGirlScale(state, usedGirl) / getValue(state).scaleIncrease)
	// 		.applyQuaternion(getGirlRotation(state, usedGirl))
	// )

	// state = setUsedGirlData(state, usedGirl,{
	// 	...getUsedGirlData(state, usedGirl),
	// 	girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty()
	// })



	// Console.log(getGirlPosition(state, usedGirl))




	state = updateDistanceRateOnlyOnceInOneFrame(state)

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getBiggerSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)))))

	state = _markIsChangeScaling(state, usedGirl, true)

	let tweens = playArticluatedAnimation(state,
		[
			object => {
				let state = readState()

				if (hasGirlValue(state, usedGirl)) {
					state = setGirlScale(state, usedGirl, object.scale)
				}

				writeState(state)
			},
			state => {
				return getScale(state, usedGirl)
			},
			// state => {
			// 	let currentScale = getScale(state, usedGirl)

			// 	let increaseScale
			// 	if (currentScale < 100) {
			// 		increaseScale = getValue(state).scaleIncrease * 3
			// 	}
			// 	else if (currentScale < 400) {
			// 		increaseScale = getValue(state).scaleIncrease * 6
			// 	}
			// 	else {
			// 		increaseScale = getValue(state).scaleIncrease * 10
			// 	}

			// 	return [
			// 		// getScale(state, usedGirl) + getValue(state).scaleIncrease * 2,
			// 		currentScale + increaseScale,
			// 		1
			// 	]
			// },
			getParamFunc,
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)


					state = _markIsChangeScaling(state, usedGirl, false)

					state = stopAndClearTweens(state, usedGirl)


					// state = computeGirlBoxAndSetToState(state, usedGirl)

					// let d = _computeGirlMeshDiff(state)
					// let girlMeshDiff = d.clone()
					// // .multiplyScalar(getValue(state).scaleIncrease / getGirlScale(state, usedGirl))

					// let girlGroupDiff = d.clone()
					// 	.applyQuaternion(getGirlRotation(state, usedGirl))


					// state = setUsedGirlData(state, usedGirl,{
					// 	...getUsedGirlData(state, usedGirl),
					// 	girlGroupPositionDiffForChangePivot: NullableUtils.return_(
					// 		// girlGroupDiff
					// 		d.clone()
					// 	)
					// })

					// Console.log(getGirlPosition(state, usedGirl))
					// state = changePivotByAdd(state, girlMeshDiff, girlGroupDiff)

					// Console.log(getGirlPosition(state, usedGirl))


					// if (getCurrentPose(state, usedGirl) == pose.Crawl) {
					// 	state = changeToStandPosePivot(state)
					// 	state = changeToCrawlPosePivot(state)
					// }



					return handleCompleteFunc(state).then(writeState)
				})
			},
			NullableUtils.getEmpty()
		],
		findArticluatedAnimationData(state, articluatedAnimationName.Scale)
	)

	state = addTweens(state, usedGirl, tweens)

	return state
}

export let playSmallerAnimation = (state, handleCompleteFunc, usedGirl, targetScale) => {
	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getSmallerSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)))))

	state = _markIsChangeScaling(state, usedGirl, true)

	state = updateDistanceRateOnlyOnceInOneFrame(state)

	let tweens = playArticluatedAnimation(state,
		[
			object => {
				let state = readState()

				if (hasGirlValue(state, usedGirl)) {
					state = setGirlScale(state, usedGirl,
						// Math.max(object.scale, getValue(state).scaleIncrease))
						// Math.max(object.scale, getValue(state).initialScale))
						Math.max(object.scale, getValue(state, usedGirl).minScale))
				}

				writeState(state)
			},
			state => {
				return getScale(state, usedGirl)
			},
			state => {
				return [
					// getValue(state).initialScale,
					// NumberUtils.greaterThan(
					// 	Math.floor(getGirlScale(state, usedGirl) / 2),
					// 	getValue(state).initialScale
					// ),

					// getValue(state).initialScale,
					targetScale,
					// Math.max(getGirlScale(state, usedGirl) / 30, 1)
					NumberUtils.clamp(getGirlScale(state, usedGirl) / 30, 1, 2)
				]
			},
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

					state = _markIsChangeScaling(state, usedGirl, false)


					state = stopAndClearTweens(state, usedGirl)

					return handleCompleteFunc(state).then(writeState)
				})
			},
			NullableUtils.getEmpty()
		],
		findArticluatedAnimationData(state, articluatedAnimationName.Scale)
	)

	state = addTweens(state, usedGirl, tweens)


	return state
}

export let addTweens = (state: state, usedGirl, tweens) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		tweens: getUsedGirlData(state, usedGirl).tweens.concat(tweens)
	})
}

export let stopAndClearTweens = (state: state, usedGirl) => {
	ArticluatedAnimation.stopTweens(getUsedGirlData(state, usedGirl).tweens)

	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		tweens: ArrayUtils.create()
	})
}

export let getCustomDuration = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).customDuration
}

export let setCustomDuration = (state: state, usedGirl, value) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		customDuration: NullableUtils.return_(value)
	})
}

export let removeCustomDuration = (state: state, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		customDuration: NullableUtils.getEmpty()
	})
}

export let getDurationFactor = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).durationFactor
}

export let setDurationFactor = (state: state, value, usedGirl_) => {
	return setUsedGirlData(state, usedGirl_, {
		...getUsedGirlData(state, usedGirl_),
		durationFactor: value
	})
}

// export let createFSMStateByCurrentAnimationNameDefault = (state: state, currentAnimationName: animationName): [state, nullable<fsm_state<state>>] => {
// 	let fsmState
// 	switch (currentAnimationName) {
// 		case animationName.Idle:
// 			state = changePose(state, usedGirl, pose.Stand)

// 			fsmState = createIdleState()
// 			break
// 		// case animationName.Walk:
// 		// 	fsmState = createWalkState()
// 		// 	break
// 		// case animationName.Run:
// 		// 	fsmState = createRunState()
// 		// 	break
// 		// case animationName.Stomp:
// 		// 	fsmState = createStompState()
// 		// 	break

// 		case animationName.StandToCrawl:
// 			// fsmState = createStandToCrawl()
// 			state = changePose(state, usedGirl, pose.Crawl)
// 			break
// 		// case animationName.CrawlToStand:
// 		// 	fsmState = createCrawlToStandState()
// 		// 	break
// 		case animationName.KeepCrawl:
// 			fsmState = createKeepCrawlState()
// 			break
// 		// case animationName.BreastPress:
// 		// 	fsmState = createBreastPressState()
// 		// 	break
// 		// case animationName.CrawlMove:
// 		// 	fsmState = createCrawlMoveState()
// 		// 	break


// 		case animationName.Pickup:
// 			// fsmState = createPickupState()
// 			state = changePose(state, usedGirl, pose.Pick)
// 			break
// 		case animationName.KeepPick:
// 			fsmState = createKeepPickState()
// 			break
// 		// case animationName.Pinch:
// 		// 	fsmState = createPinchState()
// 		// 	break
// 		// case animationName.Eat:
// 		// 	fsmState = createEatState()
// 		// 	break
// 		// case animationName.Pickdown:
// 		// 	fsmState = createPickdownState()
// 		// 	break




// 		// case animationName.Hello:
// 		// 	// if (!isForScenario) {
// 		// 	// 	throw new Error("err")
// 		// 	// }

// 		// 	fsmState = createScenarioState(nextBlendingAnimationName)
// 		// 	break

// 		default:
// 			// state = setUsedGirlData(state, usedGirl,{
// 			// 	...getUsedGirlData(state, usedGirl),
// 			// 	currentAnimationName: nextBlendingAnimationName
// 			// })

// 			[state, fsmState] = createFSMStateByChangeAnimationName(state, currentAnimationName)

// 			if (
// 				NullableUtils.isNullable(fsmState)
// 				&&
// 				!_isStressingOrDeathAnimation(currentAnimationName)) {
// 				fsmState = createInitialState()
// 			}
// 			else {
// 				fsmState = null
// 			}

// 			break
// 	}

// 	return [state, fsmState]
// }

export let createFSMStateByChangeAnimationNameDefault = (state: state, usedGirl, nextBlendingAnimationName: animationName): [state, nullable<fsm_state<state>>] => {
	// return [state, NullableUtils.getEmpty()]
	let fsmState
	switch (nextBlendingAnimationName) {
		case animationName.Idle:
			state = changePose(state, usedGirl, pose.Stand)

			fsmState = createIdleState(usedGirl)
			break
		// case animationName.Walk:
		// 	fsmState = createWalkState()
		// 	break
		// case animationName.Run:
		// 	fsmState = createRunState()
		// 	break
		// case animationName.Stomp:
		// 	fsmState = createStompState()
		// 	break

		case animationName.StandToCrawl:
			// fsmState = createStandToCrawl()
			state = changePose(state, usedGirl, pose.Crawl)
			break
		// case animationName.CrawlToStand:
		// 	fsmState = createCrawlToStandState()
		// 	break
		case animationName.KeepCrawl:
			fsmState = createKeepCrawlState(usedGirl)
			break
		// case animationName.BreastPress:
		// 	fsmState = createBreastPressState()
		// 	break
		// case animationName.CrawlMove:
		// 	fsmState = createCrawlMoveState()
		// 	break


		case animationName.Pickup:
			// fsmState = createPickupState()
			state = changePose(state, usedGirl, pose.Pick)
			break
		case animationName.KeepPick:
			fsmState = createKeepPickState(usedGirl)
			break
		// case animationName.Pinch:
		// 	fsmState = createPinchState()
		// 	break
		// case animationName.Eat:
		// 	fsmState = createEatState()
		// 	break
		// case animationName.Pickdown:
		// 	fsmState = createPickdownState()
		// 	break




		// case animationName.Hello:
		// 	// if (!isForScenario) {
		// 	// 	throw new Error("err")
		// 	// }

		// 	fsmState = createScenarioState(nextBlendingAnimationName)
		// 	break

		default:
			// state = setUsedGirlData(state, usedGirl,{
			// 	...getUsedGirlData(state, usedGirl),
			// 	currentAnimationName: nextBlendingAnimationName
			// })

			[state, fsmState] = createFSMStateByChangeAnimationName(state, usedGirl, nextBlendingAnimationName)

			if (
				NullableUtils.isNullable(fsmState)
				&&
				!_isStressingOrDeathAnimation(nextBlendingAnimationName)) {
				fsmState = createInitialState()
			}
			else {
				fsmState = null
			}

			break
	}

	return [state, fsmState]

}

export let resetAnimation = (state: state, usedGirl, defaultAnimationName) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		currentAnimationName: NullableUtils.return_(defaultAnimationName),
		previousAnimationName: NullableUtils.getEmpty(),
		nextBlendingAnimationName: NullableUtils.getEmpty(),

		isCurrentAnimationOnlyPlayOnce: false,
	})
}

export let dispose = (state: state, usedGirl) => {
	ArticluatedAnimation.removeTweens(getAbstractState(state), getUsedGirlData(state, usedGirl).tweens)

	state = stopAndClearTweens(state, usedGirl)

	return state
}