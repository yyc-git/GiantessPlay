import { NullableUtils } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { objectStateName, damageType, camp, forceSize, autoDifficulty, collisionPart, usedGirlEnum } from "../type/StateType"
import { Box3, Matrix4, PropertyMixer, Vector2, Vector3 } from "three"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../Scene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { characterType, fontType, labelAnimation, name, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { isTreesAndProps } from "../manage/city1/TreesAndProps"
import { changeAndExecuteState, isState } from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { isCityzen } from "../manage/city1/Citiyzen"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { handleDamageForceSize, getDamageFuncs, getDamageGiantessFuncExn, handleAfterComputeDamage } from "../StaticDynamic"
import * as Girl from "../girl/Girl"
import * as LittleMan from "../little_man/LittleMan"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isDestoryRelatedStates, isNotDamageState, isControlledState } from "./FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getSceneChapter, isGiantessCharacterType, isLittleCharacterType } from "../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { buildFakeGirlWeaponValue, getActualHeight, getFactorByScale, getPivotWorldPosition, getPositionParrelToObj, getScaleIncreaseTimes } from "../girl/Utils"
import { explodeRange, weaponType, weaponValue } from "../data/ValueType"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { getCampWithDefault, getCampExn } from "../manage/city1/Army"
import { getAutoDifficulty } from "../difficulty/Difficulty"
import { addStatusToName, addStatusToNameInTime, isCanRemove } from "./StatusUtils"
import { getPlayerCamp, isNearObject, isPlayer } from "./PlayerUtils"
import { buildDeferRemoveStatusByDamageName, has, remove } from "../Status"
import { Flow } from "meta3d-jiehuo-abstract"
import { handleLightStressing } from "../utils/LightStressingArmyUtils"
import { addHitEffectForNotGirl } from "./HitEffectUtils"
import { getBoxTopPoint } from "./Box3Utils"
import { computeCrit, computeForceFactor, computeHalfSize, computeRange, isRangeWeapon } from "./WeaponUtils"
import { isSoldier } from "../manage/city1/soldier/Soldier"
import { handleHeadShot } from "./ArmyUtils"
import { isChangeToLieState } from "./CharacterUtils"
import { addBuff } from "../buff/Buff"
import { buffName } from "../data/buff/BuffData"
import { attackFactor } from "../data/DataType"
import { getAttackFactor, getCritRatioFactor, getDefenseFactor } from "../StaticDynamicUnit"
// import { computeMiss } from "./ValueUtils"
import { isEliteGiantess } from "../../../../mod/EliteGiantessMod"
import { getCameraType } from "../Camera"
import { ScreenUtils } from "meta3d-jiehuo-abstract"
import { View } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { addDamageForce } from "../Statistic"
import { Event } from "meta3d-jiehuo-abstract"
import { buildAPI } from "../../../../mod/Mod"
import { isAlive } from "./ObjectUtils"
import { getBox as getBoxLODQueueObjectUtils } from "./LODQueueObjectUtils"
import { isStatic } from "./OctreeObjectUtils"
import { getModAPI } from "../Mod"
import { isHideUI } from "../UI"
import { isPicked } from "../girl/PickPoseUtils"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();


let _executeState = (state: state,
	[
		getStateMachineFunc,
		setStateMachineFunc,
		createStateFunc,

	],
	fromName: name,
	[newTransform, newBox, newName, damage, damageType], direction) => {
	let data = [newTransform, newBox, newName, damage, damageType]

	return changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, newName), createStateFunc(state,
		fromName,
		data, direction
	), newName, [
		fromName,
		data, direction
	])
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


let _showStatus = (state: state, fromName, targetName, damage, remainedHp) => {
	if (
		// !isPlayer(state, fromName)
		Girl.isGirl(targetName)
		|| (damage <= 0 || remainedHp <= 0)
	) {
		return state
	}

	return addStatusToNameInTime(state, targetName)
}

export let getDamagePositionForLabel = (state: state, damagePosition, height, damageType_) => {
	if (damageType_ == damageType.Range) {
		return NullableUtils.getEmpty<Vector3>()
	}

	return NullableUtils.map(
		damagePosition => {
			switch (getCameraType(state)) {
				case cameraType.FirstPerson:
					return ScreenUtils.convertScreenCoordniateToWorldCoordniate(
						_v1_1.set(
							View.getWidth() / 2,
							View.getHeight() / 2 * 0.5
						),
						Camera.getCurrentCamera(getAbstractState(state)),
						false
					)
				case cameraType.ThirdPerson:
				// if (isLittleCharacterType(state)) {
				//     return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
				// }

				// return new Vector3(damagePosition.x, damagePosition.y + height / 10, damagePosition.z)
				case cameraType.No:
					return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
				default:
					throw new Error("err")
			}
		},
		damagePosition
	)

}

let _getDamagePositionForLabel = (state: state, name: name, height: number, damagePosition: nullable<Vector3>, damageType_): nullable<Vector3> => {
	if (isEliteGiantess(state, name)) {
		return getDamagePositionForLabel(state, damagePosition, height, damageType_)
	}

	return NullableUtils.getEmpty()
}

export let getHeightByDynamicName = (state, name: name) => {
	requireCheck(() => {
		test("shouldn't be static", () => {
			return !isStatic(state, name)
		})
	}, getIsDebug(state))


	if (LittleMan.isLittleMan(name)) {
		let box = LittleMan.getBox(state)
		return NullableUtils.return_(getHeight(box))
	}
	if (Girl.isGirl(name)) {
		return NullableUtils.return_(getActualHeight(state, Girl.getUsedGirlByName(name)))
	}

	return NullableUtils.getWithDefault(
		NullableUtils.map(
			getHeight,
			getBoxLODQueueObjectUtils(state, name)
		),
		1
	)
}

export let buildAddLabelFunc = (time, labelAnimation, height = 8) => (
	state, damageHp, box, damageType_, damagePosition, fromName, targetName,
) => {
	return addLabel(state, damageHp, box,
		computeFontType(
			state,
			fromName,
			targetName,
			// getPlayerCamp(),
			// camp.Enemy,
			damageType_
		),
		damagePosition, targetName,
		time,
		NullableUtils.return_(height),
		labelAnimation
	)
}

export let damage = (state: state, [
	// getDamageStatusFunc,
	// getDefenseFactorFunc,
	// // getAttackFactorFunc,
	// // getCritRatioFactorFunc,
	// getMissRatioFunc,
	getHpFunc,
	updateHpFunc,
	// updateDamageStatusFunc,
	// handleStressingFunc,
	// playDestroyingAnimationFunc

	getStateMachineFunc,
	setStateMachineFunc,
	createControlledStateFunc,
	createDestroyingStateFunc,
	// isStressingByRateFunc = (..._) => true,
	// isControlledFunc : (state: state, fromName: name, damage: number, damageType_: damageType, direction: Vector3):boolean,
	isControlledFunc = (..._) => true,
	//  => true,
	addLabelFunc = buildAddLabelFunc(2500, labelAnimation.Normal, 8)
], forceData,
	weaponValue_: weaponValue,
	fromName: name,
	damagePosition: nullable<Vector3>,
	[
		armorType,
		armorRatio,
		armorStrength,
		// critRatioFactor,
		// attackFactor
	],
	// transforms, boxes, names,
	transform, box, name,
	// ): Promise<[state, Array<string>]> => {
): Promise<[state, string]> => {
	let direction = forceData[0][1].clone()

	let heightOfFromName = getHeightByDynamicName(state, fromName)
	// if (NullableUtils.isNullable(heightOfFromName)) {
	// 	return Promise.resolve([state, []])
	// }
	// heightOfFromName = NullableUtils.getExn(heightOfFromName)

	// return ArrayUtils.reducePromise<any, any>(names, ([
	// 	state,
	// 	[
	// 		[controlledData,
	// 			destroyingData],
	// 		damagedNames
	// 	]
	// ], name, i) => {
	// }, [
	// 	state,
	// 	[
	// 		[[[], [], [], [], []],
	// 		[[], [], [], [], []]],
	// 		[]
	// 	]
	// ])



	let [[size, _d], [damageType_, _w]] = forceData

	let stateMachine = getStateMachineFunc(state, name)

	let damagedName = name

	if (isDestoryRelatedStates(stateMachine)
		// || (
		// 	Girl.isGirl(fromName)
		// 	// && (isSoldier(name) && !isChangeToLieState(damageType_, direction))
		// 	&& !isNotDamageState(stateMachine)
		// )
	) {
		// return Promise.resolve([
		// 	state, [
		// 		[controlledData,
		// 			destroyingData],
		// 		damagedNames
		// 	]
		// ])

		return Promise.resolve([
			state, damagedName
		])
	}


	// let box = boxes[i]
	// let transform = transforms[i]

	// let controlledData = null
	// let destroyingData = null

	// let defenseFactor = getDefenseFactorFunc(state, name)
	let defenseFactor = getDefenseFactor(state, name)
	let height = getHeight(box)


	let d1 = handleDamageForceSize(state, fromName, name, NullableUtils.getEmpty(),
		weaponValue_.type,
		armorType,
		size)
	state = d1[0]
	size = d1[1]


	let d2 = handleHeadShot(state, [size, damageType_], damagePosition, fromName, name, weaponValue_, box, stateMachine)
	let d3 = computeCrit(d2, weaponValue_, getCritRatioFactor(state, fromName))
	size = d3[0]
	damageType_ = d3[1]

	// let d4 = computeMiss(d3, getMissRatio(state, name))
	// size = d4[0]
	// damageType_ = d4[1]

	size = computeForceByAttackFactor(size, getAttackFactor(state, fromName))



	// let hp = getHpFunc(state, name)

	let damage = computeDamageWithDamagePosition(state,
		[defenseFactor, armorType, armorRatio, armorStrength],
		weaponValue_,
		[height, heightOfFromName],
		size,
		damageType_,
		damagePosition,
		TransformUtils.getPositionFromMatrix4(transform)
	)
	// Console.log(
	// 	name,
	// 	damage
	// )


	let userData = {
		forceSize: size,
		damage,
		damageType: damageType_,
		fromName,
		name,
		transform,
		box,
		damagePosition: NullableUtils.getWithDefaultFunc(
			damagePosition,
			() => TransformUtils.getPositionFromMatrix4(transform)
		),
		weaponValue: weaponValue_
	}
	let promise
	if (weaponValue_.type !== weaponType.EffectSelf) {
		promise = Event.triggerWithUserDataWithFilter(state, getAbstractState, getModAPI(state).event.getHandleDamageArmyEventName(), NullableUtils.return_(
			userData
		), (state, userData) => {
			// return isAlive(state, userData.name)
			return getHpFunc(state, name) > 0
			// return !isDestoryRelatedStates(stateMachine)
		})
	}
	else {
		promise = Promise.resolve(
			[state,
				userData
			]
		)
	}

	return promise.then(([state,
		{
			forceSize,
			damage,
			damageType,
			fromName,
			name,
			transform,
			box,
			damagePosition,
			weaponValue
		}
	]) => {
		// if (!isAlive(state, name)) {
		// let stateMachine = getStateMachineFunc(state, name)
		// if (isDestoryRelatedStates(stateMachine)) {
		let hp = getHpFunc(state, name)
		if (hp <= 0) {
			return [
				state,
				damagedName,
				// [[controlledData,
				// 	destroyingData],
				// 	damagedName
				// ]
				// [controlledData,
				// 	destroyingData]
				NullableUtils.getEmpty(),
				NullableUtils.getEmpty(),
			]
		}

		damageType_ = damageType
		weaponValue_ = weaponValue

		// let hp = getHpFunc(state, name)
		let remainedHp = computeHp(hp, damage)

		state = updateHpFunc(state, name, remainedHp)


		if (!(!getIsDebug(state) && (isTreesAndProps(name)
			|| isCityzen(name))
		)
			// && damage > 0
			&& damage >= 0
		) {
			// state = addLabel(state, damage, box, weaponType, damagePosition, name, 2500)
			state = addLabelFunc(state, damage, box,
				damageType_,
				//  weaponType_,
				_getDamagePositionForLabel(state, name, height, damagePosition, damageType_),
				fromName,
				name,
				// 2500,


				// getSceneChapter(state) == scene.Biwu ? getCampWithDefault(state, name, camp.Enemy) == camp.Enemy
				// 	: (isLittleCharacterType(state) ? (
				// 		// fromName == LittleMan.getName() ? true : false
				// 		fromName == Girl.getName() ? false : true
				// 	) : true)

			)
		}

		if (damage > 0) {
			state = _showStatus(state, fromName, name, damage, remainedHp)


			state = addDamageForce(state, fromName, damage)
		}

		state = addHitEffectForNotGirl(state, fromName, name, damagePosition, damageType_, weaponValue_, armorType)


		return handleAfterComputeDamage(state, fromName, name, damage, remainedHp).then(state => {
			// if (damage <= 0 || (Girl.isGirl(fromName) && isControlledState(state, stateMachine))) {
			// if (damage <= 0) {
			// 	// if (damage <= 0 && (remainedHp <= 0 || hp <= 0)) {
			// 	// 	throw new Error("err")
			// 	// }

			// 	return [
			// 		state, [
			// 			[controlledData,
			// 				destroyingData],
			// 			ArrayUtils.push(
			// 				damagedNames, name
			// 			)

			// 		]
			// 	]
			// }

			if (remainedHp > 0) {
				// if (isControlledState(state, stateMachine)) {
				// 	return [
				// 		state, [[controlledData,
				// 			destroyingData],
				// 			damagedNames
				// 		]
				// 	]
				// }
				if (isControlledFunc(state, fromName, damage, damageType_, direction, stateMachine, box)) {
					// let [newTransformsForControlled, newBoxesForControlled, newNamesForControlled, damagesForControlled, damageTypesForControlled] = controlledData

					return [
						state,
						damagedName,
						NullableUtils.return_(
							[
								transform, box, name, damage, damageType_
							]
						),
						NullableUtils.getEmpty()
					]
				}
				else {
					state = handleLightStressing(state, name, damage, transform, box)

					return [
						state,
						damagedName,
						NullableUtils.getEmpty(),
						NullableUtils.getEmpty()
						// damagedNames
						// ArrayUtils.push(
						// 	damagedNames, name
						// )

					]
				}
			}

			// let [newTransformsForDestroying, newBoxesForDestroying, newNamesForDestroying, damagesForDestroying, damageTypesForDestroying] = destroyingData

			return [
				state,
				damagedName,
				NullableUtils.getEmpty(),
				NullableUtils.return_(
					[
						transform, box, name, damage, damageType_
					]
				)
			]
		})
	})
		.then(async data => {
			state = data[0]
			let damagedName = data[1]

			if (!NullableUtils.isNullable(data[2])) {
				state = await _executeState(state,
					[
						getStateMachineFunc,
						setStateMachineFunc,
						createControlledStateFunc,
					],
					fromName,
					NullableUtils.getExn(data[2]), direction)
			}
			if (!NullableUtils.isNullable(data[3])) {
				state = await _executeState(state,
					[
						getStateMachineFunc,
						setStateMachineFunc,
						createDestroyingStateFunc,
					],
					fromName,
					NullableUtils.getExn(data[3]), direction)
			}

			return [state, damagedName]
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

export let damageWithSingleData = (state, force: [[number, Vector3], [damageType, weaponType]],
	weaponValue_,
	fromName: name,
	damagePosition: nullable<Vector3>,
	data: [Matrix4, Box3, string]): Promise<[state, Array<string>]> => {
	let [transform, box, name] = data

	return NullableUtils.getWithDefaultFunc(
		NullableUtils.map(d => {
			return d.damageFunc(state, force,
				weaponValue_,
				fromName,
				damagePosition,
				transform, box, name).then(([state, damagedName]) => [state, [damagedName]])
		}, getDamageFuncs(state).find(({ isSelfFunc }) => {
			return isSelfFunc(name)
		})),
		() => Promise.resolve([state, []])
	)
}

export let damageWithMultipleData = (state, force: [[number, Vector3], [damageType, weaponType]],
	weaponValue_,
	fromName: name,
	damagePosition: nullable<Vector3>,
	data): Promise<[state, Array<string>]> => {
	if (data.length == 0) {
		return Promise.resolve([state, []])
	}

	let [transforms, boxes, names] = data

	return ArrayUtils.reducePromise(getDamageFuncs(state).toArray(), (data, { isSelfFunc, damageFunc }) => {
		// let [newTransforms, newBoxes, newNames] = names.reduce(([newTransforms, newBoxes, newNames], name, i) => {
		// 	if (isSelfFunc(name)) {
		// 		return [
		// 			ArrayUtils.push(
		// 				newTransforms, transforms[i]
		// 			),
		// 			ArrayUtils.push(
		// 				newBoxes, boxes[i]
		// 			),
		// 			ArrayUtils.push(
		// 				newNames, name
		// 			),
		// 		]
		// 	}

		// 	return [newTransforms, newBoxes, newNames]
		// }, [[], [], []])

		// if (newTransforms.length > 0) {
		// 	let state = data[0]

		// 	return damageFunc(state, force,
		// 		weaponValue_,
		// 		fromName,
		// 		damagePosition,
		// 		// NullableUtils.getEmpty(),
		// 		// critRatioFactor,
		// 		// attackFactor,
		// 		newTransforms, newBoxes, newNames)
		// }

		// return Promise.resolve(data)
		return ArrayUtils.reducePromise(names, ([state, damagedNames], name: string, i) => {
			if (isSelfFunc(name)) {
				return damageFunc(state, force,
					weaponValue_,
					fromName,
					damagePosition,
					transforms[i], boxes[i], name).then(([state, damagedName]) => [state, ArrayUtils.push(damagedNames, damagedName)])
			}

			return Promise.resolve([state, damagedNames])
		}, data)
	}, [state, []])
}

export let damageGiantess = (state, usedGirl, forceData, fromName, collisionPart, damagePosition, weaponValue_: weaponValue,
	// critRatioFactor,
	// attackFactor,
) => {
	return getDamageGiantessFuncExn(state)(state, usedGirl, forceData, fromName, collisionPart, damagePosition, weaponValue_,
		// critRatioFactor,
		// attackFactor,
	)
}

export let destroyGiantess = (state: state, usedGirl) => {
	let weaponValue = buildFakeGirlWeaponValue(state, usedGirl, getMaxForce())

	return damageGiantess(state, usedGirl, [weaponValue.force, damageType.Direct, weaponType.Power], LittleMan.getName(), collisionPart.BoundingBox, NullableUtils.return_(getPivotWorldPosition(state, usedGirl)), weaponValue)
}

// export let computeFontType = (isAttack, damageType_, weaponType_) => {
// export let computeFontType = (isAttack: boolean, damageType_: damageType) => {
// export let computeFontType = (state, fromName, targetName, fromCamp, defaultCamp, damageType_: damageType) => {
export let computeFontType = (state, fromName, targetName, damageType_: damageType) => {
	let fontType_

	let isAttack
	if (fromName == targetName) {
		isAttack = false
	}
	else {
		// isAttack = getCampWithDefault(state, fromName, defaultCamp) == fromCamp
		// isAttack = getCampWithDefault(state, fromName, camp.None) != getCampWithDefault(state, targetName, camp.None)
		isAttack = getCampWithDefault(state, fromName, camp.None) == camp.Player
	}


	if (isAttack) {
		// switch (weaponType_) {
		// 	case weaponType.VeryHeavy:
		// 	case weaponType.Heavy:
		// 		fontType_ = fontType.HeavyAttack
		// 		break
		// 	case weaponType.Light:
		// 	case weaponType.Middle:
		// 		fontType_ = fontType.NormalAttack
		// 		break
		// 	default:
		// 		fontType_ = fontType.NormalAttack
		// 		break
		// }
		switch (damageType_) {
			case damageType.Normal:
			case damageType.Range:
			case damageType.Global:
				fontType_ = fontType.NormalAttack
				break
			case damageType.Direct:
			case damageType.Heavy:
				fontType_ = fontType.HeavyAttack
				break
			case damageType.Weakness:
				fontType_ = fontType.WeaknessAttack
				break
			case damageType.Crit:
				fontType_ = fontType.CritAttack
				break
			// case damageType.Miss:
			// 	fontType_ = fontType.MissAttack
			// 	break
			default:
				throw new Error("err")
		}
	}
	else {
		switch (damageType_) {
			case damageType.Normal:
			case damageType.Range:
			case damageType.Global:
				fontType_ = fontType.NormalDamage
				break
			case damageType.Direct:
			case damageType.Heavy:
				fontType_ = fontType.HeavyDamage
				break
			case damageType.Weakness:
				fontType_ = fontType.WeaknessDamage
				break
			case damageType.Crit:
				fontType_ = fontType.CritDamage
				break
			// case damageType.Miss:
			// 	fontType_ = fontType.MissDamage
			// 	break
			default:
				throw new Error("err")
		}
	}

	return fontType_
}

let _getLabelFactorByScale = (state: state): [number, number, number] => {
	if (!isGiantessCharacterType(state)) {
		return [1, 1, 1]
	}

	return getFactorByScale(state, usedGirlEnum.PlayerGirl, [
		{
			scale: 19,
			factor: [1, 1, 1]
		},
		{
			scale: 39,
			factor: [4, 2, 0.6]
		},
		{
			factor: [8, 4, 0.4]
		},
	])
}

export let addLabel = (state, hp, box,
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

		// let center = box.getCenter(new Vector3())
		// let height = box.getSize(_v1).y

		// position = center.setY(center.y + height / 2 * 1.5)

		let [boxTopFactor, heightFactor, sizeFactor_] = _getLabelFactorByScale(state)


		position = getBoxTopPoint(box, 0.25 * boxTopFactor, new Vector3())

		sizeFactor *= sizeFactor_
		labelHeight *= heightFactor


		isAddToSpecifyPosition = false
	}
	else {
		position = NullableUtils.getExn(damagePosition)

		isAddToSpecifyPosition = true
	}

	return setAbstractState(state, LabelManager.addLabel(getAbstractState(state), {
		targetName: targetName,

		text: `${Math.round(hp)}`,
		position: position,
		isAddToSpecifyPosition,
		time: time,
		fontType: fontType_,
		animation: animation,
		isSizeAttenuation: false,
		sizeFactor: sizeFactor,
		height: labelHeight,
	}, isHideUI(state)))
}

// let _computeDefense = (defenseFactor, height) => {
// 	return defenseFactor * height
// }

let _computeDamage = (defenseFactor, armorRatio, armorStrength, forceSize, armorPiercingForceRatio) => {
	// defenseFactor = NumberUtils.clamp(defenseFactor, 0, 1)
	// armorRatio = NumberUtils.clamp(armorRatio, 0, 1)

	// let commonForceSize = NumberUtils.greaterThan(forceSize - armorPiercingForceRatio, 0)
	// let actuallyArmorPiercingForceSize = forceSize - commonForceSize

	// return NumberUtils.greaterThan(
	// 	Math.round(NumberUtils.greaterThan(
	// 		commonForceSize * armorRatio - armorStrength, 0
	// 	) + commonForceSize * (1 - armorRatio) * (1 - defenseFactor))
	// 	+
	// 	actuallyArmorPiercingForceSize * (1 - defenseFactor),
	// 	0
	// )

	/*! handle defenseFactor >= 1 case
	* 
	*/
	// defenseFactor = NumberUtils.clamp(defenseFactor, 0, 0.99)
	defenseFactor = NumberUtils.clamp(defenseFactor, 0, 0.95)

	armorRatio = NumberUtils.clamp(armorRatio, 0, 1)
	armorPiercingForceRatio = NumberUtils.clamp(armorPiercingForceRatio, 0, 1)

	let commonForceSize = forceSize * (1 - armorPiercingForceRatio)
	let armorPiercingForceSize = forceSize * armorPiercingForceRatio


	return NumberUtils.greaterThan(
		Math.round(
			// NumberUtils.greaterThan(
			// 	commonForceSize * armorRatio - armorStrength, 0
			// ) + commonForceSize * (1 - armorRatio) * (1 - defenseFactor)

			(
				(
					NumberUtils.greaterThan(
						commonForceSize * armorRatio - armorStrength,
						0
					)
					+
					// NumberUtils.greaterThan(
					// 	commonForceSize * (1 - armorRatio) - armorStrength / 2,
					// 	0
					// )
					commonForceSize * (1 - armorRatio)
				)
				+
				armorPiercingForceSize
			) * (1 - defenseFactor)
		),
		0
	)
}

export let computeHp = (hp, damage) => {
	return Math.max(hp - damage, 0)
}

export let computeForceByHeight = (force, height) => {
	// return Math.round(force * height / 2)
	// return Math.round(force * Math.sqrt(height) * 2)
	return Math.round(force * height)
	// return Math.round(force * Math.pow(height, 0.7) * 2)
	// return Math.round(force * Math.pow(height, 0.9))
}

export let getParrelDistanceTo = (sourcePosition, targetPosition) => {
	return getPositionParrelToObj(sourcePosition, targetPosition.y).distanceTo(targetPosition)
}

export let computeDamageWithDamagePosition = (state: state, defenseData, weaponValue_: weaponValue, [height, heightOfFromName], forceSize, damageType_, damagePosition, position): number => {
	let distanceFactor
	switch (damageType_) {
		case damageType.Range:
			// let distanceFactor = 1 / position.distanceTo(NullableUtils.getExn(damagePosition))
			// if (Girl.isGirl(fromName)) {
			// 	distanceFactor = distanceFactor
			// 		* (
			// 			10 * NumberUtils.clamp(getScaleIncreaseTimes(state), 1, 5)

			// 		)
			// }


			// let distance = NumberUtils.greaterThan(position.distanceTo(NullableUtils.getExn(damagePosition)), 1)
			let distance = getParrelDistanceTo(position, NullableUtils.getExn(damagePosition))
			// if (distance <= 3) {
			// 	distanceFactor = 1
			// }
			// else if (distance <= 8) {
			// 	distanceFactor = 0.7
			// }
			// else if (distance <= 15) {
			// 	distanceFactor = 0.5
			// }
			// else {
			// 	distanceFactor = 0.3
			// }
			let range
			if (!isRangeWeapon(weaponValue_)) {
				range = Math.sqrt(heightOfFromName) * 2
			}
			else {
				let [halfSizeVec, _] = computeHalfSize(state, weaponValue_)
				let halfSize = NumberUtils.greaterThan(
					halfSizeVec.x,
					2
				)
				range = computeRange(weaponValue_.explodeRange) + halfSize
			}

			distanceFactor = NumberUtils.clamp(
				(range - distance) / range,
				0.1,
				1
			)
			break
		default:
			distanceFactor = 1
			break
	}

	return computeDamage(defenseData, weaponValue_, [height, heightOfFromName], forceSize * distanceFactor)
}

export let computeDefenseDataByHeight = ([defenseFactor, armorRatio, armorStrength], height) => {
	// armorStrength = NumberUtils.greaterThan(Math.sqrt(height) * 2, 0.5) * armorStrength
	armorStrength = NumberUtils.greaterThan(Math.sqrt(height) * 3, 0.5) * armorStrength

	// armorRatio = NumberUtils.lessThan(NumberUtils.greaterThan(Math.sqrt(height) / 5, 1) * armorRatio, 0.9)

	if (armorRatio <= 1) {
		armorRatio = NumberUtils.lessThan(NumberUtils.greaterThan(Math.sqrt(height) / 30, 0) + armorRatio, 1)
	}

	// if (defenseFactor <= 0.8) {
	// defenseFactor = NumberUtils.lessThan(NumberUtils.greaterThan(Math.sqrt(height) / 60, 0) + defenseFactor, 0.8)
	// defenseFactor = NumberUtils.greaterThan(Math.sqrt(height) / 60, 0) + defenseFactor
	// defenseFactor = NumberUtils.greaterThan(Math.sqrt(height) / 30, 0) + defenseFactor

	// defenseFactor = NumberUtils.greaterThan(Math.sqrt(height) / 40, 0) + defenseFactor
	// defenseFactor = NumberUtils.greaterThan(Math.cbrt(height) / 100, 0) + defenseFactor
	// }

	return [defenseFactor, armorRatio, armorStrength]
}

// export let computeActuallyDamage = ([defenseFactor, _, armorRatio, armorStrength], weaponValue_: weaponValue, height, force, hp): [number, number] => {
export let computeDamage = ([defenseFactor, _, armorRatio, armorStrength], weaponValue_: weaponValue, [heightOfToName, heightOfFromName], force): number => {
	[defenseFactor, armorRatio, armorStrength] = computeDefenseDataByHeight([defenseFactor, armorRatio, armorStrength], heightOfToName)



	// let armorPiercingForceRatio = NumberUtils.clamp(weaponValue_.armorPiercingForceRatio * (heightOfFromName / heightOfToName), 0, 1)
	let armorPiercingForceRatioFactor
	switch (weaponValue_.type) {
		case weaponType.Body:
		case weaponType.Common:
			armorPiercingForceRatioFactor = Math.cbrt(heightOfFromName / heightOfToName)
			break
		case weaponType.Effect:
		case weaponType.EffectSelf:
		case weaponType.Power:
			armorPiercingForceRatioFactor = 1
			break
		// case weaponType.Impact:
		// case weaponType.Common:
		// case weaponType.Power:
		// 	armorPiercingForceRatioFactor = Math.sqrt(heightOfFromName / heightOfToName)
		// 	break
		default:
			// armorPiercingForceRatioFactor = 1
			armorPiercingForceRatioFactor = Math.cbrt(1 / heightOfToName)
			break
	}
	let armorPiercingForceRatio = NumberUtils.clamp(weaponValue_.armorPiercingForceRatio * armorPiercingForceRatioFactor, 0, 1)


	// let forceFactor
	// switch (weaponValue_.type) {
	// 	case weaponType.Body:
	// 		forceFactor = 1
	// 		break
	// 	default:
	// 		forceFactor = Math.sqrt(heightOfFromName / heightOfToName)
	// 		break
	// }

	// force *= forceFactor



	let damage = _computeDamage(defenseFactor, armorRatio, armorStrength, force, armorPiercingForceRatio)

	// let remainedHp = computeHp(hp, damage)

	// // return [damage, remainedHp]
	// return [hp - remainedHp, damage]
	return damage
}

export let computeForceByAttackFactor = (force: forceSize, attackFactor: attackFactor) => {
	return force * attackFactor
}

// export let getMaxForce = () => 10000000000
// export let getMaxForce = () => 100000000000
export let getMaxForce = () => 1000000000000

export let isNotMaxForce = (force) => {
	// return force < getMaxForce() / 1000
	// return force < getMaxForce() / 10
	return force < getMaxForce() / 5
}


export let computeGiantessForceByFactor = (state: state, usedGirl, forceSize: forceSize) => {
	forceSize = forceSize * 0.5

	if (Girl.isPlayerGirlOrGiantess(state, usedGirl)) {
		// return forceSize
		return forceSize * 0.5
	}


	let levelGiantessFactor, bossGiantessFactor


	// levelGiantessFactor = 1 * Math.pow(1.5, getAutoDifficulty(state))
	// bossGiantessFactor = 0.1 * Math.pow(1.5, getAutoDifficulty(state))
	let powFactor
	if (getAutoDifficulty(state) <= autoDifficulty.VeryHard1) {
		// powFactor = 1.2
		powFactor = 1.15
	}
	else {
		// powFactor = 1.4
		// powFactor = 1.3
		// powFactor = 1.2
		powFactor = 1.25
		// powFactor = 1.1
	}
	levelGiantessFactor = 1 * Math.pow(powFactor, getAutoDifficulty(state))
	bossGiantessFactor = 0.1 * Math.pow(powFactor, getAutoDifficulty(state))

	// switch (getAutoDifficulty(state)) {
	// 	case autoDifficulty.VeryEasy:
	// 		levelGiantessFactor = 1
	// 		bossGiantessFactor = 0.1
	// 		break
	// 	case autoDifficulty.Easy:
	// 		levelGiantessFactor = 1.5
	// 		bossGiantessFactor = 0.2
	// 		break
	// 	case autoDifficulty.Middle:
	// 		levelGiantessFactor = 2
	// 		bossGiantessFactor = 0.4
	// 		break
	// 	case autoDifficulty.Hard:
	// 	case autoDifficulty.VeryHard:
	// 		// levelGiantessFactor = 2.5
	// 		levelGiantessFactor = 3
	// 		// levelGiantessFactor = 2
	// 		// bossGiantessFactor = 0.5
	// 		bossGiantessFactor = 0.6
	// 		break
	// 	case autoDifficulty.VeryHard1:
	// 		// levelGiantessFactor = 3
	// 		levelGiantessFactor = 4.5
	// 		// bossGiantessFactor = 0.6
	// 		bossGiantessFactor = 1
	// 		break
	// 	case autoDifficulty.VeryHard2:
	// 		// levelGiantessFactor = 3
	// 		levelGiantessFactor = 3
	// 		// bossGiantessFactor = 0.7
	// 		bossGiantessFactor = 1.5
	// 		break
	// 	case autoDifficulty.VeryHard3:
	// 		levelGiantessFactor = 3.5
	// 		bossGiantessFactor = 0.8
	// 		break
	// 	case autoDifficulty.VeryHard4:
	// 		levelGiantessFactor = 3.5
	// 		// bossGiantessFactor = 1.5
	// 		bossGiantessFactor = 0.9
	// 		break
	// 	case autoDifficulty.VeryHard5:
	// 		levelGiantessFactor = 4
	// 		// bossGiantessFactor = 2
	// 		bossGiantessFactor = 1
	// 		break
	// 	// case autoDifficulty.VeryHard:
	// 	// 	levelGiantessFactor = 3
	// 	// 	bossGiantessFactor = 0.8
	// 	// 	break
	// }

	// levelGiantessFactor *= 0.3
	levelGiantessFactor *= 0.6 * 3 * 0.4

	// bossGiantessFactor *= 1.5 * 1.5
	bossGiantessFactor *= 1.5 * 3 * 2 * 4 * 0.4


	if (Girl.isBossGiantess(state, usedGirl)) {
		return forceSize * bossGiantessFactor
	}

	if (Girl.isLevelGiantess(state, usedGirl)) {
		return forceSize * levelGiantessFactor
	}

	return forceSize
}

export let computeBossSpecificSkillForceByFactor = (state: state, forceSize: forceSize) => {
	let factor
	switch (getAutoDifficulty(state)) {
		case autoDifficulty.VeryEasy:
			// factor = 0.3
			factor = 0.5
			break
		case autoDifficulty.Easy:
			// factor = 0.5
			factor = 0.8
			break
		case autoDifficulty.Middle:
			factor = 1
			break
		case autoDifficulty.Hard:
			factor = 1.3
			break
		case autoDifficulty.VeryHard:
			factor = 1.6
			break
		case autoDifficulty.VeryHard1:
			// factor = 2
			factor = 1.9
			break
		case autoDifficulty.VeryHard2:
			// factor = 2.4
			factor = 2.2
			break
		case autoDifficulty.VeryHard3:
			// factor = 3
			factor = 2.5
			break
		case autoDifficulty.VeryHard4:
			// factor = 3.5
			factor = 2.8
			break
		case autoDifficulty.VeryHard5:
			// factor = 4.2
			factor = 3.1
			break
	}

	// return Math.round(forceSize * factor)
	return forceSize * factor
}

export let isDirectDestoryed = (state, name, damage) => {
	return isPicked(state, name) || !isNotMaxForce(damage)
}