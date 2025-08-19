import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { objectStateName, damageType, camp } from "../type/StateType"
import { Box3, PropertyMixer, Vector3 } from "three"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../Scene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { fontType, labelAnimation, name, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { isTreesAndProps } from "../manage/city1/TreesAndProps"
import { changeAndExecuteState, isState } from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { isCityzen } from "../manage/city1/Citiyzen"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getDamageFuncs, getDamageGiantessFuncExn } from "../StaticDynamic"
import * as Girl from "../girl/Girl"
import * as LittleMan from "../little_man/LittleMan"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isDestoryRelatedStates, isNotDamageState, isStressingState } from "./FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getSceneChapter, isLittleRoad } from "../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getScaleIncreaseTimes } from "../girl/Utils"
import { weaponType } from "../data/ValueType"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { getCamp, getCampExn } from "../manage/city1/Army"

const _v1 = new Vector3();
const _v2 = new Vector3();


let _executeState = (state: state,
	[
		getStateMachineFunc,
		setStateMachineFunc,
		createStateFunc,

	],
	fromName: name,
	[newTransforms, newBoxes, newNames, damages], direction) => {
	return ArrayUtils.reducePromise(newNames, (state, newName, i) => {
		return changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, newName), createStateFunc(state), newName, [
			fromName,
			[newTransforms[i], newBoxes[i], newName, damages[i]], direction
		])
	}, state)
}

// let _destroying = (
// 	state, [
// 		getStateMachineFunc,
// 		setStateMachineFunc,
// 		createDestroyingStateFunc,
// 	], container, [newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying],
// 	direction
// ) => {
// 	// requireCheck(() => {
// 	// 	test("damage should > 0", () => {
// 	// 		return damagesForDestroying.reduce((result, size) => {
// 	// 			if (!result) {
// 	// 				return result
// 	// 			}

// 	// 			if (size <= 0) {
// 	// 				return false
// 	// 			}

// 	// 			return result
// 	// 		}, true)
// 	// 	})
// 	// }, getIsDebug(state))

// 	// state = newNamesForDestroying.reduce((state, name) => {
// 	// 	return updateDamageStatusFunc(state, name.Destroying)
// 	// }, state)


// 	// state = playDestroyingAnimationFunc(
// 	// 	state, container, [newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying], direction
// 	// )

// 	// return state
// 	return newNamesForDestroying.reduce((state, newName, i) => {
// 		return changeState(state, getStateMachineFunc(state, newName), createDestroyingStateFunc(state)).then(([state, stateMachine]) => {
// 			state = setStateMachineFunc(state, newName, stateMachine)

// 			return execute(state, stateMachine,
// 				[
// 					container, [newTransformsForDestroying[i], newBoxesForDestroying[i], newName, damagesForDestroying[i]], direction
// 				]
// 			)
// 		})
// 	}, state)

// }

// let _getDestroySize = (robustSize, forceSize) => {
// 	// if (mustDestroyed) {
// 	// 	return forceSize
// 	// }

// 	return forceSize - robustSize
// }

export let damage = (state: state, [
	// getDamageStatusFunc,
	getDefenseFactorFunc,
	getHpFunc,
	updateHpFunc,
	// updateDamageStatusFunc,
	// handleStressingFunc,
	// playDestroyingAnimationFunc

	getStateMachineFunc,
	setStateMachineFunc,
	createStressingStateFunc,
	createDestroyingStateFunc,
	isStressingByRateFunc = (..._) => true,
	addLabelFunc = (
		state, damageHp, box, damageType_, weaponType_, damagePosition, targetName,
		// time,
	) => addLabel(state, damageHp, box,
		computeFontType(isLittleRoad(state) ? (
			fromName == Girl.getName() ? false : true
		) : true, damageType_, weaponType_),
		damagePosition, targetName, 2500,
		NullableUtils.return_(10),
	)
], forceData, fromName: name,
	damagePosition: nullable<Vector3>,
	transforms, boxes, names,
): Promise<[state, Array<string>]> => {
	let [[size, direction], [damageType_, weaponType_]] = forceData

	let data = names.reduce(([
		state,
		[
			[stressingData,
				destroyingData],
			damagedNames
		]
	], name, i) => {
		let stateMachine = getStateMachineFunc(state, name)

		if (isDestoryRelatedStates(stateMachine)
			|| (
				Girl.isGirl(fromName) && !isNotDamageState(stateMachine)
			)
		) {
			return [
				state, [
					[stressingData,
						destroyingData],
					damagedNames
				]
			]
		}

		let box = boxes[i]
		let transform = transforms[i]


		let defenseFactor = getDefenseFactorFunc(state, name)
		let height = box.getSize(_v1).y

		let hp = getHpFunc(state, name)

		// let [actuallyDamage, damage, remainedHp] = computeActuallyDamage(defenseFactor, height, size, hp)
		let [actuallyDamage, damage, remainedHp] = computeActuallyDamageWithDamagePosition(state, defenseFactor, height, size,
			damageType_,
			damagePosition,
			TransformUtils.getPositionFromMatrix4(transform),
			hp)
		// Console.log(
		// 	name,
		// 	actuallyDamage
		// )


		state = updateHpFunc(state, name, remainedHp)

		if (!(!getIsDebug(state) && (isTreesAndProps(name)
			|| isCityzen(name))
		)
			// && actuallyDamage > 0
			&& actuallyDamage >= 0
		) {
			// state = addLabel(state, damage, box, weaponType, damagePosition, name, 2500)
			state = addLabelFunc(state, actuallyDamage, box,
				damageType_, weaponType_,
				NullableUtils.getEmpty(), name,
				// 2500,


				// getSceneChapter(state) == scene.Biwu ? getCamp(state, name, camp.Giantess) == camp.Giantess
				// 	: (isLittleRoad(state) ? (
				// 		// fromName == LittleMan.getName() ? true : false
				// 		fromName == Girl.getName() ? false : true
				// 	) : true)

			)
		}

		if (damage <= 0 || (Girl.isGirl(fromName) && isStressingState(stateMachine))) {
			// if (damage <= 0 && (remainedHp <= 0 || hp <= 0)) {
			// 	throw new Error("err")
			// }

			return [
				state, [
					[stressingData,
						destroyingData],
					ArrayUtils.push(
						damagedNames, name
					)

				]
			]
		}

		if (remainedHp > 0) {
			if (
				Girl.isGirl(fromName) || isStressingByRateFunc(state, damage, weaponType_)
			) {
				let [newTransformsForStressing, newBoxesForStressing, newNamesForStressing, damagesForStressing] = stressingData

				return [
					state, [[[ArrayUtils.push(newTransformsForStressing, transform), ArrayUtils.push(newBoxesForStressing, box), ArrayUtils.push(newNamesForStressing, name), ArrayUtils.push(damagesForStressing, damage)],
						destroyingData],
					ArrayUtils.push(
						damagedNames, name
					)
					]
				]
			}

			return [
				state, [[stressingData,
					destroyingData],
					damagedNames
				]
			]
		}

		let [newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying] = destroyingData

		return [
			state, [[stressingData,
				[ArrayUtils.push(newTransformsForDestroying, transform), ArrayUtils.push(newBoxesForDestroying, box), ArrayUtils.push(newNamesForDestroying, name), ArrayUtils.push(damagesForDestroying, damage)],],
			ArrayUtils.push(
				damagedNames, name
			)
			]
		]
	}, [
		state,
		[
			[[[], [], [], []],
			[[], [], [], []]],
			[]
		]
	])
	state = data[0]
	let [
		damageData,
		damagedNames
	] = data[1]
	let [[newTransformsForStressing, newBoxesForStressing, newNamesForStressing, damagesForStressing],
		[newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying]] = damageData


	// let promise = Promise.resolve(state)
	// if (newTransformsForStressing.length > 0) {
	// 	promise = _executeState(state,
	// 		[
	// 			getStateMachineFunc,
	// 			setStateMachineFunc,
	// 			createStressingStateFunc,

	// 		],
	// 		container,
	// 		[newTransformsForStressing, newBoxesForStressing, newNamesForStressing, damagesForStressing], direction)
	// }
	// if (newTransformsForDestroying.length > 0) {
	// 	promise = _executeState(
	// 		state,
	// 		[
	// 			getStateMachineFunc,
	// 			setStateMachineFunc,
	// 			createDestroyingStateFunc,
	// 		],
	// 		container, [newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying],
	// 		direction
	// 	)
	// }
	return _executeState(state,
		[
			getStateMachineFunc,
			setStateMachineFunc,
			createStressingStateFunc,

		],
		fromName,
		[newTransformsForStressing, newBoxesForStressing, newNamesForStressing, damagesForStressing], direction).then(state => {
			return _executeState(
				state,
				[
					getStateMachineFunc,
					setStateMachineFunc,
					createDestroyingStateFunc,
				],
				fromName,
				[newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying],
				direction
			)
		}).then(state => {
			return [state, damagedNames]
		})
}

export let clamp = (value, base) => {
	return Math.max(Math.min(value, base * 1.5), base * 0.5)
}

export let computeDamageRadio = (damage, fullHp) => {
	return damage / fullHp
}

export let getHeight = (box: Box3) => {
	return box.getSize(_v1).y
}

// export let setRetoreToInitialStatusTime = (state, [getDamageStatusFunc, updateDamageStatusFunc], name, loopCount) => {
// 	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		if (getDamageStatusFunc(state, name) == damageAnimationStatus.Stressing) {
// 			state = updateDamageStatusFunc(state, name.Initial)
// 		}

// 		return Promise.resolve(state)
// 	}, loopCount))

// 	return state
// }

// export let setRetoreToInitialStatusTime2 = (state, [getDamageStatusFunc, updateDamageStatusFunc, handleFunc], name, loopCount) => {
// 	state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		if (getDamageStatusFunc(state, name) == damageAnimationStatus.Stressing) {
// 			state = updateDamageStatusFunc(state, name.Initial)

// 			state = handleFunc(state, name)
// 		}

// 		return Promise.resolve(state)
// 	}, loopCount))

// 	return state
// }

export let handleTweenRepeatComplete = (
	[
		getStateMachineFunc,
		setStateMachineFunc,
		createStateFunc
	],
	allTweens, repeatMaxCount: number, name) => {
	let repeatCount = 0

	allTweens[allTweens.length - 1].onComplete(() => {
		repeatCount += 1

		if (repeatCount < repeatMaxCount) {
			allTweens[0].start()

			return Promise.resolve()
		}

		let state = readState()

		ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

		let stateMachine = getStateMachineFunc(state, name)

		if (isDestoryRelatedStates(stateMachine)) {
			return Promise.resolve(state)
		}

		return changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createStateFunc(state), name, name).then(writeState)
	})
}

export let handleTweenRepeatComplete2 = (handleCompleteFunc, allTweens, repeatMaxCount: number) => {
	let repeatCount = 0

	allTweens[allTweens.length - 1].onComplete(() => {
		repeatCount += 1

		if (repeatCount < repeatMaxCount) {
			allTweens[0].start()

			return
		}

		let state = readState()

		ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

		return handleCompleteFunc(state).then(writeState)
	})
}

export let handleTweenRepeatComplete3 = ([handleEachCompleteFunc, isRepeatStartFunc, handleWholeCompleteFunc], allTweens, repeatMaxCount: number) => {
	let repeatCount = 0

	allTweens[allTweens.length - 1].onComplete(() => {
		repeatCount += 1

		if (repeatCount < repeatMaxCount && isRepeatStartFunc(readState())) {
			allTweens[0].start()

			return handleEachCompleteFunc(readState()).then(writeState)
		}

		let state = readState()

		ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

		return handleEachCompleteFunc(state).then(handleWholeCompleteFunc).then(writeState)
	})
}

export let getDisappearLoopCount = () => 1000

export let getArmyDisappearLoopCount = () => 200

export let getStressingTimeScalar = (damageRadio) => {
	return Math.min(clamp(0.3 * damageRadio, 0.2), 0.5)
}

export let damageWithData = (state, force: [[number, Vector3], [damageType, weaponType]], fromName: name,
	damagePosition: nullable<Vector3>,
	[transforms, boxes, names]): Promise<[state, Array<string>]> => {
	return ArrayUtils.reducePromise<[state, Array<string>], any>(getDamageFuncs(state).toArray(), (data, { isSelfFunc, damageFunc }) => {
		let [newTransforms, newBoxes, newNames] = names.reduce(([newTransforms, newBoxes, newNames], name, i) => {
			if (isSelfFunc(name)) {
				return [
					ArrayUtils.push(
						newTransforms, transforms[i]
					),
					ArrayUtils.push(
						newBoxes, boxes[i]
					),
					ArrayUtils.push(
						newNames, name
					),
				]
			}

			return [newTransforms, newBoxes, newNames]
		}, [[], [], []])

		if (newTransforms.length > 0) {
			let state = data[0]

			return damageFunc(state, force, fromName,
				damagePosition,
				// NullableUtils.getEmpty(),
				newTransforms, newBoxes, newNames)
		}

		return Promise.resolve(data)
	}, [state, []])
}

export let damageGiantess = (state, forceData, collisionPart, damagePosition) => {
	return getDamageGiantessFuncExn(state)(state, forceData, collisionPart, damagePosition)
}

export let computeFontType = (isAttack, damageType_, weaponType_) => {
	let fontType_

	if (isAttack) {
		switch (weaponType_) {
			case weaponType.VeryHeavy:
			case weaponType.Heavy:
				fontType_ = fontType.HeavyAttack
				break
			case weaponType.Light:
			case weaponType.Middle:
				fontType_ = fontType.NormalAttack
				break
			default:
				fontType_ = fontType.NormalAttack
				break
		}
	}
	else {
		switch (damageType_) {
			case damageType.Direct:
				fontType_ = fontType.HeavyDamage
				break
			case damageType.Normal:
			case damageType.Range:
				fontType_ = fontType.NormalDamage
				break
			default:
				fontType_ = fontType.NormalDamage
				break
		}
	}

	return fontType_
}

export let addLabel = (state, damageHp, box,

	// damageType_, weaponType_,
	fontType_: fontType,
	damagePosition: nullable<Vector3>, targetName, time,
	// isAttack: boolean,
	labelHeight,
	animation = labelAnimation.Normal,
	sizeFactor: number = 2,
) => {
	// let fontType_ = computeFontType(isAttack, damageType_, weaponType_)

	let position, isAddToSpecifyPosition
	if (NullableUtils.isNullable(damagePosition)) {

		let center = box.getCenter(new Vector3())
		let height = box.getSize(_v1).y

		position = center.setY(center.y + height / 2 * 1.5)

		isAddToSpecifyPosition = false
	}
	else {
		position = NullableUtils.getExn(damagePosition)

		isAddToSpecifyPosition = true
	}

	return setAbstractState(state, LabelManager.addLabel(getAbstractState(state), {
		targetName: targetName,

		text: `${damageHp}`,
		position: position,
		isAddToSpecifyPosition,
		time: time,
		fontType: fontType_,
		animation: animation,
		isSizeAttenuation: false,
		sizeFactor: sizeFactor,
		height: labelHeight,
	}))
}

let _computeDefense = (defenseFactor, height) => {
	return defenseFactor * height
}

let _computeDamage = (defense, forceSize) => {
	return Math.floor(Math.max(forceSize - defense, 0))
}

let _computeHp = (hp, damage) => {
	return Math.max(hp - damage, 0)
}

export let computeActuallyDamageWithDamagePosition = (state: state, defenseFactor, height, forceSize, damageType_, damagePosition, position, hp): [number, number, number] => {
	let distanceFactor
	switch (damageType_) {
		case damageType.Range:
			distanceFactor = NumberUtils.clamp(
				// 1 / (position.distanceTo(NullableUtils.getExn(damagePosition)) / 10),
				1 / (position.distanceTo(NullableUtils.getExn(damagePosition)) / (
					10 * NumberUtils.clamp(getScaleIncreaseTimes(state), 1, 5)

				)),
				0.1,
				1
			)
			break
		default:
			distanceFactor = 1
	}

	return computeActuallyDamage(defenseFactor, height, forceSize * distanceFactor, hp)
}

export let computeActuallyDamage = (defenseFactor, height, force, hp): [number, number, number] => {
	let defense = _computeDefense(defenseFactor, height)

	let damage = _computeDamage(defense, force)

	let remainedHp = _computeHp(hp, damage)

	// return [damage, remainedHp]
	return [hp - remainedHp, damage, remainedHp]
}

export let getMaxForce = () => 10000000