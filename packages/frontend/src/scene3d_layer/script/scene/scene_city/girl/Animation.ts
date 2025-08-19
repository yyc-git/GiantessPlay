import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { getCenter, getGirl, getGirlMesh, getGirlState, getName, getValue, isActionState, isTriggerAction, resetIsTriggerAction, setGirlScale, setGirlState } from "./Girl"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { getAnimationBlendDuration } from "../data/Data"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { animationName, articluatedAnimationName } from "../data/DataType"
import { changePivotByAdd, computeGirlBox, getGirlPosition, getGirlRotation, getScale, setPivotToOrigin } from "./Utils"
import { Device } from "meta3d-jiehuo-abstract"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { createInitialState, createKeepCrawlState, createKeepPickState, createScenarioState, getStateMachine, setStateMachine } from "./FSMState"
import { objectStateName, pose } from "../type/StateType"
import { getIsDebug } from "../../Scene"
import { changePose, getCurrentPose, isPose } from "./Pose"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getBiggerSoundResourceId, getConfigData, getGiantessSetting, getGirlScale, getIsBiggerNoLimit, getLittleManSetting, getSmallerSoundResourceId, isGiantessRoad } from "../CityScene"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getGirlVolume, getVolume } from "../utils/SoundUtils"
import { refreshBiggerTime } from "./InitWhenImportScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { updateDistanceRate } from "../Camera"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"

export let isPlayingAnimationByWeight = (state, animationName, weight) => {
	return SkinBlendAnimation.getWeight(getAbstractState(state), getGirlMesh(state), animationName) >= weight
}

export let isCompletelyPlayingAnimation = (state, animationName) => {
	return isPlayingAnimationByWeight(state, animationName, 1)
}

export let isPlayingAnimation = (state, animationName) => {
	return SkinBlendAnimation.getWeight(getAbstractState(state), getGirlMesh(state), animationName) > 0
}

export let getAllAnimationNames = () => [
	animationName.Idle, animationName.Stomp, animationName.Walk, animationName.Run,

	animationName.StandToCrawl, animationName.CrawlToStand,

	animationName.KeepCrawl, animationName.CrawlMove,
	animationName.BreastPress,


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

	animationName.Hello,
]

// export let getChangePoseAnimationNames = (): Array<animationName> => {
// 	return [animationName.StandToCrawl, animationName.CrawlToStand]
// }

export let getDamageAnimationNames = (): Array<animationName> => [
	animationName.HeavyStressing,
	animationName.HeavyStressingBreast,
	animationName.HeavyStressingTrigoneAndButt,
	animationName.Death,


	animationName.CrawlHeavyStressing,
	animationName.CrawlHeavyStressingBreast,
	animationName.CrawlHeavyStressingTrigoneAndButt,
	animationName.CrawlDeath,
]

export let updateAnimationDuration = (state: state, scale) => {
	let girlMesh = getGirlMesh(state)

	let customDuration = getCustomDuration(state)

	getConfigData(state).girlAllAnimationNames.forEach(animationName => {
		// if(animationName == animationName.Idle){
		// if (animationName == animationName.Walk) {
		//     return
		// }

		let clip = MMD.findAnimationClip(getAbstractState(state), girlMesh, animationName)
		let action = MMD.findAnimationAction(getAbstractState(state), girlMesh, animationName)

		let duration = clip.duration
		let originDuration = duration

		if (scale <= 25) {
			// duration *= 1 + scale / 10

			// duration *= 1 + scale / 20

			duration *= 1 + scale / 30
		}
		else {
			// let oldScale = (1 + 25 / 20)
			let oldScale = (1 + 25 / 30)
			// let newScale = 1 + scale / 30
			let newScale = 1 + scale / 40

			duration *= newScale > oldScale ? newScale : oldScale
		}

		// action.setDuration(clip.duration * (1 + scale / 25))

		// action.setDuration(Math.min(duration, originDuration * 3))

		if (!NullableUtils.isNullable(customDuration)) {
			SkinAnimation.setDuration(action, NullableUtils.getExn(customDuration))
		}
		else {
			SkinAnimation.setDuration(action, Math.min(duration, originDuration * 4.5))
		}

		// Console.log(`${animationName}:`, duration)
	})

	// Console.log(clip.duration)

	return state
}

export let playAnimationLoop = (state: state, animationName, noBlend) => {
	return setGirlState(state, {
		...getGirlState(state),
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

export let playAnimationOnlyOnce = (state: state, animationName, noBlend) => {
	return setGirlState(state, {
		...getGirlState(state),
		nextBlendingAnimationName: animationName,
		isCurrentAnimationOnlyPlayOnce: true,
		noBlend
	})
}

export let isEnd = (state, animationName_, isDebug: boolean, offset = 0) => {
	// requireCheck(() => {
	// 	test("duration is too short for low offset", () => {
	// 		if (offset > 0) {
	// 			return true
	// 		}

	// 		return MMD.findAnimationClip(getAbstractState(state), getGirlMesh(state), animationName_).duration >= 1
	// 	})
	// }, getIsDebug(state))


	return SkinAnimation.isSpecificFrameIndex(
		SkinAnimation.getFrameIndex(
			MMD.findAnimationAction(getAbstractState(state), getGirlMesh(state), animationName_),
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

let _updateAnimationBlendAndFSMState = (state, isForScenario) => {
	let girlMesh = getGirlMesh(state)

	if (!isForScenario) {
		state = getConfigData(state).animationBlendData.reduce((state, data) => {
			if (
				data.condition(state)
				&& data.currentAnimationNames.includes(getGirlState(state).currentAnimationName)
				// (
				// 	NullableUtils.getWithDefault(
				// 		NullableUtils.map(
				// 			isCurrentAnimationName => {
				// 				return isCurrentAnimationName(state)
				// 			}, data.isCurrentAnimationName
				// 		),
				// 		getGirlState(state).currentAnimationName == NullableUtils.getExn( data.currentAnimationName)
				// 	)
				// )
				&& data.currentAnimationNames.reduce((result, animationName_) => {
					if (result) {
						return result
					}

					return isPlayingAnimationByWeight(state, animationName_, NullableUtils.getWithDefault(data.weight, 1))
				}, false)
			) {
				// return setGirlState(state, {
				// 	...getGirlState(state),
				// 	nextBlendingAnimationName: data.nextAnimationName
				// })

				let noBlend = NullableUtils.getWithDefault(data.noBlend, false)
				state = setGirlState(state, {
					...getGirlState(state),
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
					return playAnimationOnlyOnce(state, data.nextAnimationName, noBlend)
				}

				return playAnimationLoop(state, data.nextAnimationName, noBlend)
			}

			return state
		}, state)
	}

	let { currentAnimationName, noBlend, isCurrentAnimationOnlyPlayOnce } = getGirlState(state)

	return NullableUtils.getWithDefault(
		NullableUtils.map(nextBlendingAnimationName => {
			// Console.log(
			// 	currentAnimationName, nextBlendingAnimationName
			// )
			if (currentAnimationName !== nextBlendingAnimationName) {
				if (isTriggerAction(state, currentAnimationName)) {
					state = resetIsTriggerAction(state)
				}

				let helper = MMD.getMMDAnimationHelper(getAbstractState(state))

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
				state = setGirlState(state, {
					...getGirlState(state),
					// isResetActionCollision: false,
					currentAnimationName: nextBlendingAnimationName,
					previousAnimationName: NullableUtils.return_(currentAnimationName)
				})

				let d = getGirlState(state).createFSMStateByAnimationNameFunc(state, nextBlendingAnimationName)
				state = d[0]
				let fsmState = d[1]

				if (NullableUtils.isNullable(fsmState)) {
					return Promise.resolve(state)
				}

				return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), NullableUtils.getExn(fsmState), null)
			}

			return Promise.resolve(state)
		}, getGirlState(state).nextBlendingAnimationName),
		Promise.resolve(state)
	)
}

let _handlePlayOnce = (state: state) => {
	let { isCurrentAnimationOnlyPlayOnce, currentAnimationName } = getGirlState(state)

	if (isCurrentAnimationOnlyPlayOnce &&
		isEnd(
			state,
			currentAnimationName,
			getIsDebug(state)
		)
	) {
		MMD.getMMDAnimationHelper(getAbstractState(state)).pause()
	}
	else {
		MMD.getMMDAnimationHelper(getAbstractState(state)).resume()
	}

	return state
}

export let updateAnimation = (state: state): Promise<state> => {
	return _updateAnimationBlendAndFSMState(state, false).then(state => {
		state = setGirlState(state, {
			...getGirlState(state),
			nextBlendingAnimationName: NullableUtils.getEmpty()
		})

		state = updateAnimationDuration(state, getScale(state))

		// state = resetIsTriggerActionMap(state)

		state = _handlePlayOnce(state)

		return state
	})
}

export let restore = (state) => {
	MMD.getMMDAnimationHelper(getAbstractState(state)).resume()

	return state
}

export let updateAnimationForScenario = (state: state): Promise<state> => {
	return _updateAnimationBlendAndFSMState(state, true).then(state => {
		state = setGirlState(state, {
			...getGirlState(state),
			nextBlendingAnimationName: NullableUtils.getEmpty()
		})

		state = updateAnimationDuration(state, getScale(state))

		state = _handlePlayOnce(state)

		return state
	})
}

export let getPreviousAnimationName = (state: state) => {
	return getGirlState(state).previousAnimationName
}

export let getCurrentAnimationName = <animationName>(state: state) => {
	return getGirlState(state).currentAnimationName as animationName
}

export let setCurrentAnimationName = (state: state, name) => {
	return setGirlState(state, {
		...getGirlState(state),
		currentAnimationName: name,
	})
}

export let getNextAnimationName = (state: state) => {
	return getGirlState(state).nextBlendingAnimationName
}

export let isKeepPoseAnimation = (name: animationName) => {
	switch (name) {
		case animationName.Idle:
		case animationName.KeepPick:
		case animationName.KeepCrawl:
			return true
		default:
			return false
	}
}

let _markIsChangeScaling = (state: state, isChangeScaling: boolean) => {
	return setGirlState(state, {
		...getGirlState(state),
		isChangeScaling
	})
}

export let isChangeScaling = (state: state) => {
	return getGirlState(state).isChangeScaling
}

export let isBiggerScale = (state: state) => {
	return getScale(state) == getValue(state).minScale * 4
}

export let isBiggerBiggerAndMoreScale = (state: state) => {
	return getScale(state) >= getValue(state).minScale * 7
}

export let playBiggerAnimation = (state, [handleCompleteFunc, getParamFunc]) => {
	// if (getCurrentPose(state) == pose.Crawl) {
	// 	state = changeToStandPosePivot(state)
	// }

	// // TODO judge is crawl pose
	// let _computeGirlMeshDiff = (state: state) => {
	// 	return getGirlPosition(state).clone().sub(getCenter(state)).setY(0)
	// 		.applyQuaternion(
	// 			getGirlRotation(state).clone().invert()
	// 		)

	// }

	// Console.log(getGirlPosition(state))
	// state = setPivotToOrigin(state,
	// 	NullableUtils.getExn(getGirlState(state).girlGroupPositionDiffForChangePivot)
	// 		// .multiplyScalar(getGirlScale(state) / getValue(state).minScale)
	// 		.applyQuaternion(getGirlRotation(state))
	// )

	// state = setGirlState(state, {
	// 	...getGirlState(state),
	// 	girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty()
	// })



	// Console.log(getGirlPosition(state))




	state = updateDistanceRate(state)

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getBiggerSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

	state = _markIsChangeScaling(state, true)

	playArticluatedAnimation(state,
		[
			object => {
				let state = readState()

				state = setGirlScale(state,
					getIsBiggerNoLimit(state) ? object.scale : Math.min(object.scale, getValue(state).maxScale))

				writeState(state)
			},
			state => {
				return getScale(state)
			},
			// state => {
			// 	let currentScale = getScale(state)

			// 	let increaseScale
			// 	if (currentScale < 100) {
			// 		increaseScale = getValue(state).minScale * 3
			// 	}
			// 	else if (currentScale < 400) {
			// 		increaseScale = getValue(state).minScale * 6
			// 	}
			// 	else {
			// 		increaseScale = getValue(state).minScale * 10
			// 	}

			// 	return [
			// 		// getScale(state) + getValue(state).minScale * 2,
			// 		currentScale + increaseScale,
			// 		1
			// 	]
			// },
			getParamFunc,
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)


					state = _markIsChangeScaling(state, false)



					// state = computeGirlBox(state)

					// let d = _computeGirlMeshDiff(state)
					// let girlMeshDiff = d.clone()
					// // .multiplyScalar(getValue(state).minScale / getGirlScale(state))

					// let girlGroupDiff = d.clone()
					// 	.applyQuaternion(getGirlRotation(state))


					// state = setGirlState(state, {
					// 	...getGirlState(state),
					// 	girlGroupPositionDiffForChangePivot: NullableUtils.return_(
					// 		// girlGroupDiff
					// 		d.clone()
					// 	)
					// })

					// Console.log(getGirlPosition(state))
					// state = changePivotByAdd(state, girlMeshDiff, girlGroupDiff)

					// Console.log(getGirlPosition(state))


					// if (getCurrentPose(state) == pose.Crawl) {
					// 	state = changeToStandPosePivot(state)
					// 	state = changeToCrawlPosePivot(state)
					// }



					return handleCompleteFunc(state).then(writeState)
				})
			}
		],
		findArticluatedAnimationData(state, articluatedAnimationName.Scale)
	)


	return state
}

export let playSmallerToHalfSizeAnimation = (state, handleCompleteFunc) => {
	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getSmallerSoundResourceId(), getIsDebug(state), getGirlVolume(state))))

	state = _markIsChangeScaling(state, true)

	state = updateDistanceRate(state)

	playArticluatedAnimation(state,
		[
			object => {
				let state = readState()

				state = setGirlScale(state,
					Math.max(object.scale, getValue(state).minScale))

				writeState(state)
			},
			state => {
				return getScale(state)
			},
			state => {
				return [
					// getValue(state).initialScale,
					NumberUtils.greaterThan(
						Math.floor(getGirlScale(state) / 2),
						getValue(state).initialScale
					),
					Math.max(getGirlScale(state) / 30, 1)
				]
			},
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

					state = _markIsChangeScaling(state, false)

					return handleCompleteFunc(state).then(writeState)
				})

			}
		],
		findArticluatedAnimationData(state, articluatedAnimationName.Scale)
	)


	return state
}

export let getCustomDuration = (state: state) => {
	return getGirlState(state).customDuration
}

export let setCustomDuration = (state: state, value) => {
	return setGirlState(state, {
		...getGirlState(state),
		customDuration: NullableUtils.return_(value)
	})
}

export let removeCustomDuration = (state: state) => {
	return setGirlState(state, {
		...getGirlState(state),
		customDuration: NullableUtils.getEmpty()
	})
}

export let createFSMStateByAnimationNameDefault = (state: state, nextBlendingAnimationName: animationName): [state, nullable<fsm_state<state>>] => {
	let fsmState
	switch (nextBlendingAnimationName) {
		case animationName.Idle:
			state = changePose(state, pose.Stand)

			fsmState = createInitialState()
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

		// case animationName.StandToCrawl:
		// 	fsmState = createStandToCrawl()
		// 	break
		// case animationName.CrawlToStand:
		// 	fsmState = createCrawlToStandState()
		// 	break
		case animationName.KeepCrawl:
			fsmState = createKeepCrawlState()
			break
		// case animationName.BreastPress:
		// 	fsmState = createBreastPressState()
		// 	break
		// case animationName.CrawlMove:
		// 	fsmState = createCrawlMoveState()
		// 	break


		// case animationName.Pickup:
		// 	fsmState = createPickupState()
		// 	break
		case animationName.KeepPick:
			fsmState = createKeepPickState()
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




		case animationName.Hello:
			// if (!isForScenario) {
			// 	throw new Error("err")
			// }

			fsmState = createScenarioState(nextBlendingAnimationName)
			break

		default:
			// state = setGirlState(state, {
			// 	...getGirlState(state),
			// 	currentAnimationName: nextBlendingAnimationName
			// })

			if (!_isStressingOrDeathAnimation(nextBlendingAnimationName)) {
				fsmState = createInitialState()
			}
			else {
				fsmState = null
			}

			break
	}

	return [state, fsmState]
}