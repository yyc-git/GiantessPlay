import { List } from "immutable"
import { state } from "../../../type/StateType"
import { getGirlScale, getLevelNumber, getReviveLifeCountResourceId, getSceneChapter, getState, isGiantessCharacterType, isLittleCharacterType, setState } from "./CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { camp, collisionPart, damageData, forceSize, usedGirlEnum } from "./type/StateType"
import { name, characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getNow } from "./Time"
import { addHp, isLittleMan, getHp as getLittleManHp, setHp as setLittleManHp, getFullHp as getLittleManFullHp, getStateMachine, getLittleManState, setLittleManState } from "./little_man/LittleMan"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getDamagePartByCollisionPart, getDamagePartByJudge, isCloth, restoreCloth, updateHpData } from "./girl/Cloth"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getCampExn, getCampWithDefault } from "./manage/city1/Army"
import { isGirl, isPlayerGirl, setFullHp as setGirlBodyHp, getFullHp as getGirlFullHp, getBodyHp as getGirlBodyHp, getAllUsedMMDData, getUsedGirlByName } from "./girl/Girl"
import { setHp as setLittleManWholeHp } from "./utils/build/LittleManBuildUtils"
import { setFullHp as setGiantessWholeHp } from "./utils/build/GiantessBuildUtils"
import { buildFuncData } from "./data/FuncData"
import { isEnteringNextLevel } from "./manage/mission/Mission"
import { getAbstractState, setAbstractState } from "../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../Scene"
import { getOriginSystemVolume, getSystemVolume } from "./utils/SoundUtils"
import { handleEnemyDamage } from "./difficulty/HeatImplementer"
import { getGetClothHpDataFunc, initClothHpData } from "./utils/ClothUtils"
import { restoreShoe } from "./data/mmd/Shoe"
import { showAimCrossWhenDamage, showAimCrossWhenDestroy } from "./little_man/AimUtils"
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { scene } from "../../../../ui_layer/global/store/GlobalStoreType"
import { findValidArmyPoint, findValidArmyPoints } from "./manage/city1/generator/ArmyGenerator"
import { isDestoryRelatedStates } from "./utils/FSMStateUtils"
import { isStatic } from "./utils/OctreeObjectUtils"
import { getPlayerInitialPosition } from "./data/play/level1/map/MapData"
import { getInitialPosition } from "./little_man/Transform"
import { weaponType } from "./data/ValueType"
import { Event } from "meta3d-jiehuo-abstract"
import { buildGiantessStatusUpdateEventNameEventData, getGiantessStatusUpdateEventName, getLittleManStatusUpdateEventName } from "../../../utils/EventUtils"
import { getBody } from "./data/mmd/MMDData"
import { isEffect } from "./utils/WeaponUtils"
// import { isPlayer } from "./utils/PlayerUtils"
// import { has } from "./Status"
// import { addStatusToName, addStatusToShootTarget } from "./utils/StatusUtils"


let _getState = (state: state) => {
	return getState(state).damageData
}

let _setState = (state: state, d: damageData) => {
	return setState(state, {
		...getState(state),
		damageData: d
	})
}


export let getDamageFuncs = (state: state) => {
	return _getState(state).funcs
}

export let registerDamageData = (state: state, data) => {
	return _setState(state, {
		..._getState(state),
		funcs: getState(state).damageData.funcs.push(data),
	})
}

export let getDamageGiantessFuncExn = (state: state) => {
	return NullableUtils.getExn(_getState(state).damageGiantessFunc)
}

export let registerDamageGiantessFunc = (state: state, func) => {
	return _setState(state, {
		..._getState(state),
		damageGiantessFunc: NullableUtils.return_(func)
	})
}

export let setIsEnableComboStorm = (state: state, value) => {
	state = _setState(state, {
		..._getState(state),
		isEnableComboStorm: value,
		comboStormLayerCount: NullableUtils.return_(0)
	})

	if (!value) {
		state = _setState(state, {
			..._getState(state),
			lastComboStormDamageTime: NullableUtils.getEmpty(),
			comboStormLayerCount: NullableUtils.getEmpty()
		})
	}

	return state
}

export let getComboStormLayerCount = (state: state) => {
	return _getState(state).comboStormLayerCount
}

export let setClothDamageEnhanceLevel = (state: state, level) => {
	state = _setState(state, {
		..._getState(state),
		clothDamageEnhanceLevel: level
	})

	return state
}

export let getClothDamageEnhanceRatio = (clothDamageEnhanceLevel) => {
	return clothDamageEnhanceLevel * 0.5
}

// let _getComboStormDamageInterval = () => 2000
let _getComboStormDamageInterval = () => 1500

let _handleComboStormDamage = (state: state, forceSize: forceSize): [state, forceSize] => {
	state = NullableUtils.getWithDefault(
		NullableUtils.map(lastComboStormDamageTime => {
			if (getNow(state) - lastComboStormDamageTime < _getComboStormDamageInterval()) {
				state = _setState(state, {
					..._getState(state),
					comboStormLayerCount: NullableUtils.return_(
						NumberUtils.lessThan(NullableUtils.getWithDefault(
							_getState(state).comboStormLayerCount,
							0
						) + 1, 99)
					)
				})
			}

			return state
		}, _getState(state).lastComboStormDamageTime),
		state
	)

	forceSize += forceSize * NullableUtils.getWithDefault(
		_getState(state).comboStormLayerCount,
		0
	) * 0.1


	state = _setState(state, {
		..._getState(state),
		lastComboStormDamageTime: NullableUtils.return_(getNow(state))
	})

	return [state, forceSize]
}

let _handleClothDamageEnhance = (state: state, usedGirl, collisionPart_, forceSize: forceSize): forceSize => {
	let [damagePartByCollisionPart, actuallyDamagePartsByCollisionPart] = getDamagePartByCollisionPart(state, usedGirl, collisionPart_)
	let [damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartByJudge(state, usedGirl, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)

	if (isCloth(damagePartByJudge)) {
		forceSize += forceSize * getClothDamageEnhanceRatio(_getState(state).clothDamageEnhanceLevel)
	}

	return forceSize
}



// let _isEnableFragileGrowth = (state: state) => {
// 	return _getState(state).fragileGrowthLevel > 0
// }

export let getCrazyLevel = (state: state) => {
	return _getState(state).crazyLevel
}

export let setCrazyLevel = (state: state, level) => {
	state = _setState(state, {
		..._getState(state),
		crazyLevel: level
	})

	return state
}

export let getDamageIncreaseRatio = (crazyLevel) => {
	// return 1 + crazyLevel * 0.3
	// return 1 + crazyLevel * 0.15
	return 1 + crazyLevel * 0.2
}

export let getEmitSpeedIncreaseRatio = (crazyLevel) => {
	return 1 + crazyLevel * 0.2
	// return 1 + crazyLevel * 0.3
}

export let handleLittleManDamage = (state: state, fromName,
	weaponType, armorType,
	forceSize: forceSize) => {
	// if (_isEnableFragileGrowth(state)) {
	// 	forceSize = forceSize * 1.5
	// }

	forceSize *= getDamageIncreaseRatio(getCrazyLevel(state))

	forceSize = handleEnemyDamage(state, fromName,
		weaponType, armorType,
		forceSize)

	return forceSize
}

// export let getGetHpRatio = (fragileGrowthLevel) => {
// 	return fragileGrowthLevel / 100 + 0.02
// }

// let _handleGetHp = (state: state, forceSize: forceSize): state => {
// 	if (isDestoryRelatedStates(getStateMachine(state))) {
// 		return state
// 	}

// 	return addHp(state,
// 		forceSize * getGetHpRatio(
// 			_getState(state).fragileGrowthLevel
// 		)
// 	)
// }

// export let setFragileGrowthLevel = (state: state, level) => {
// 	state = _setState(state, {
// 		..._getState(state),
// 		fragileGrowthLevel: level
// 	})

// 	return state
// }



export let handleDamageForceSize = (state: state, fromName: name, targetName: name, collisionPart_: nullable<collisionPart>,
	weaponType_, armorType,
	forceSize: forceSize): [state, forceSize] => {
	if (
		forceSize <= 0
		// || getCampExn(state, targetName) == camp.None
		|| getCampWithDefault(state, targetName, camp.None) == camp.None
		|| isEffect(weaponType_)
	) {
		return [state, forceSize]
	}

	if (
		_getState(state).isEnableComboStorm
		&& isLittleMan(fromName)
	) {
		[state, forceSize] = _handleComboStormDamage(state, forceSize)
	}

	if (
		_getState(state).clothDamageEnhanceLevel > 0
		&& isLittleMan(fromName)
		&& !NullableUtils.isNullable(collisionPart_)
	) {
		forceSize = _handleClothDamageEnhance(state, getUsedGirlByName(targetName), NullableUtils.getExn(collisionPart_), forceSize)
	}

	// if (
	// 	_isEnableFragileGrowth(state)
	// 	&& isLittleMan(fromName)
	// ) {
	// 	state = _handleGetHp(state, forceSize)
	// }



	forceSize = handleEnemyDamage(state, fromName,
		weaponType_, armorType,
		forceSize)


	return [state, forceSize]
}



export let getLifeCount = (state: state) => {
	if (isLittleCharacterType(state)) {
		return _getState(state).lifeCountForLittleMan
	}

	return _getState(state).lifeCountForGiantess
}

export let setLifeCount = (state: state, value, characterType_) => {
	if (isEnteringNextLevel(state)) {
		return state
	}

	switch (characterType_) {
		case characterType.LittleMan:
			state = _setState(state, {
				..._getState(state),
				lifeCountForLittleMan: value
			})
			break
		case characterType.Giantess:
			state = _setState(state, {
				..._getState(state),
				lifeCountForGiantess: value
			})
			break
	}

	return state
}

// let _isPicked = (state, name: name) => {
// 	if (!hasPickData(state, usedGirl)) {
// 		return false
// 	}

// 	return name == getPickObjectName(state)
// }

export let hasLifeCount = (state: state) => {
	// let lifeCount
	// if (isLittleCharacterType(state)) {
	// 	lifeCount = _getState(state).lifeCountForLittleMan
	// }
	// else {
	// 	lifeCount = _getState(state).lifeCountForGiantess
	// }

	// return lifeCount > 0
	return getLifeCount(state) > 0
}


export let selectRandomNearArmyCrowdPoisition = (state: state, position) => {
	switch (getSceneChapter(state)) {
		// case scene.Play:
		// 	// let result = findValidArmyPoints(state, position, 30, +Infinity)

		// 	let minRange
		// 	if (isGiantessCharacterType(state)) {
		// 		minRange = 80 * NumberUtils.clamp(getGirlScale(state, usedGirl) / 50, 1, 5)
		// 	}
		// 	else {
		// 		minRange = 60
		// 	}

		// 	let result = findValidArmyPoints(state, position, minRange, +Infinity)

		// 	if (result.length == 0) {
		// 		return getPlayerInitialPosition()
		// 	}

		// 	return result[0]
		case scene.Biwu:
			if (isGiantessCharacterType(state)) {
				throw new Error("error")
			}

			switch (getLevelNumber(state)) {
				case 1:
				case 2:
					return getInitialPosition(state)
				case 3:
					return position
				default:
					throw new Error("error")
			}

		default:
			let minRange
			if (isGiantessCharacterType(state)) {
				minRange = 80 * NumberUtils.clamp(getGirlScale(state, usedGirlEnum.PlayerGirl) / 50, 1, 5)
			}
			else {
				minRange = 60
			}

			return findValidArmyPoint(state, position, minRange, +Infinity, true)
	}
}

export let isLifeCountWork = (state: state, name: name) => {
	let lifeCount
	// , getHpFunc
	if (isLittleCharacterType(state) && isLittleMan(name)) {
		lifeCount = _getState(state).lifeCountForLittleMan

		// getHpFunc = getLittleManHp
	}
	else if (isGiantessCharacterType(state) && isGirl(name)) {
		lifeCount = _getState(state).lifeCountForGiantess

		// getHpFunc = getGirlBodyHp
	}
	else {
		return false
	}

	// return !(lifeCount == 0 || getHpFunc(state) > 0)
	// return lifeCount > 0 && getHpFunc(state) <= 0
	return lifeCount > 0
}

export let handleLifeCount = (state: state, name) => {
	let lifeCount, reviveFunc, characterType_
	if (isLittleCharacterType(state) && isLittleMan(name)) {
		lifeCount = _getState(state).lifeCountForLittleMan
		reviveFunc = (state) => {
			return setLittleManHp(state, getLittleManFullHp(state))
		}
		characterType_ = characterType.LittleMan

		state = _setState(state, {
			..._getState(state),
			isLifeCountSubForLittleMan: true
		})
	}
	else if (isGiantessCharacterType(state) && isGirl(name)) {
		lifeCount = _getState(state).lifeCountForGiantess
		reviveFunc = (state) => {
			state = initClothHpData(state, getGetClothHpDataFunc(state), getAllUsedMMDData(state))
			state = updateHpData(state, usedGirlEnum.PlayerGirl)

			state = restoreCloth(state, usedGirlEnum.PlayerGirl)
			state = restoreShoe(state, usedGirlEnum.PlayerGirl)


			return state
		}
		characterType_ = characterType.Giantess

		state = _setState(state, {
			..._getState(state),
			isLifeCountSubForGiantess: true
		})
	}
	else {
		return state
	}

	state = reviveFunc(state)

	// state = setLifeCount(state, lifeCount - 1, characterType_)

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
		SoundManager.buildNeedToPlaySoundData(getReviveLifeCountResourceId(), getIsDebug(state), getOriginSystemVolume(state))
	))

	return state
}

// let _handleLifeCount = (state: state, targetName) => {
// 	let lifeCount, getHpFunc, reviveFunc, characterType_
// 	// if (isLittleCharacterType(state) && isLittleMan(targetName)) {
// 	// 	lifeCount = _getState(state).lifeCountForLittleMan

// 	// 	getHpFunc = getLittleManHp
// 	// 	reviveFunc = (state) => {
// 	// 		return setLittleManHp(state, getLittleManFullHp(state))
// 	// 	}

// 	// 	characterType_ = characterType.LittleMan
// 	// }
// 	// else if (isGiantessCharacterType(state) && isGirl(targetName)) {
// 	if (isGiantessCharacterType(state) && isGirl(targetName)) {
// 		lifeCount = _getState(state).lifeCountForGiantess

// 		getHpFunc = getGirlBodyHp
// 		reviveFunc = (state) => {
// 			state = initClothHpData(state, getGetClothHpDataFunc(state), getAllUsedMMDData(state))
// 			state = updateHpData(state, usedGirlEnum.PlayerGirl)

// 			return state
// 		}

// 		characterType_ = characterType.Giantess
// 	}
// 	else {
// 		return Promise.resolve(state)
// 	}

// 	if (
// 		lifeCount == 0
// 		|| getHpFunc(state) > 0
// 	) {
// 		return Promise.resolve(state)
// 	}

// 	state = reviveFunc(state)

// 	state = setLifeCount(state, lifeCount - 1, characterType_)

// 	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
// 		SoundManager.buildNeedToPlaySoundData(getReviveLifeCountResourceId(), getIsDebug(state), getOriginSystemVolume(state))
// 	))


// 	// if (_isPicked(state, targetName) && isLittleMan(targetName)) {
// 	// 	// return handle(module_ => {
// 	// 	// 	return module_.handlePickdown(state, targetName, -1, getGirlPosition(state, usedGirl), NullableUtils.getEmpty(), new Matrix4()).then()
// 	// 	// }, targetName)
// 	// 	return handlePickdownNotJudgeValid(state, getGirlPosition(state, usedGirl))
// 	// }


// 	return Promise.resolve(state)
// }

// let _showStatus = (state: state, fromName, targetName, damage, remainedHp) => {
// 	if (
// 		!isPlayer(state, fromName)
// 		|| isGirl(targetName)
// 		|| (damage <= 0 || remainedHp <= 0)
// 	) {
// 		return state
// 	}

// 	if (!has(state, targetName)) {
// 		state = addStatusToName(state, targetName)
// 	}

// 	return state
// }

export let handleAfterComputeDamage = (state: state, fromName, targetName, damage, remainedHp): Promise<state> => {
	// return _handleLifeCount(state, targetName)

	// state = _showStatus(state, fromName, targetName, damage, remainedHp)

	if (isLittleMan(fromName) && !isStatic(state, targetName)) {
		if (remainedHp <= 0) {
			state = showAimCrossWhenDestroy(state)
		}
		else if (damage > 0) {
			state = showAimCrossWhenDamage(state)
		}
	}


	if (isLittleMan(targetName)) {
		return Promise.resolve(state)
	}

	// if (isLifeCountWork(state, targetName)) {
	// 	state = handleLifeCount(state, targetName)
	// }

	return Promise.resolve(state)
}





let _isEnableOldSoldier = (state: state) => {
	return _getOldSoldierLevel(state) > 0
}

let _getOldSoldierLevel = (state: state) => {
	if (isLittleCharacterType(state)) {
		return _getState(state).oldSoldierLevelForLittleMan
	}

	return _getState(state).oldSoldierLevelForGiantess
}


// export let getMaxAddHpCount = (characterType_: characterType) => {
// 	switch (characterType_) {
// 		case characterType.LittleMan:
// 			return isEnableOldSoldier * 100
// 		case characterType.Giantess:
// 			return isEnableOldSoldier * 1000
// 	}
// }

let _addOldSoldierHp = (state: state, value, characterType_) => {
	switch (characterType_) {
		case characterType.LittleMan:
			state = _setState(state, {
				..._getState(state),
				oldSoldierHpForLittleMan: NullableUtils.return_(
					NullableUtils.getWithDefault(
						_getState(state).oldSoldierHpForLittleMan,
						0
					) + value)
			})
			break
		case characterType.Giantess:
			state = _setState(state, {
				..._getState(state),
				oldSoldierHpForGiantess: NullableUtils.getWithDefault(
					_getState(state).oldSoldierHpForGiantess,
					0
				) + value
			})
			break
	}

	return state
}

export let getOldSoldierHp = (state: state) => {
	switch (getCharacterType(getAbstractState(state))) {
		case characterType.LittleMan:
			return _getState(state).oldSoldierHpForLittleMan
		case characterType.Giantess:
			return _getState(state).oldSoldierHpForGiantess
		default:
			throw new Error("err")
	}
}

let _handleAddHp = (state: state, fromName) => {
	if (!_isEnableOldSoldier(state)) {
		return state
	}

	if (isLittleCharacterType(state)
		&& isLittleMan(fromName)
	) {
		// let value = 1 * _getOldSoldierLevel(state)
		let value = 2 * _getOldSoldierLevel(state)
		// let value = 5

		state = _addOldSoldierHp(state, value, characterType.LittleMan)

		return setLittleManWholeHp(state, buildFuncData(state), (state, hp) => {
			return hp + value
		}, false)
	}

	if (isGiantessCharacterType(state)
		&& isGirl(fromName)
	) {
		// let value = 10
		// let value = 3 * _getOldSoldierLevel(state)
		let value = 1 * _getOldSoldierLevel(state)

		state = _addOldSoldierHp(state, value, characterType.Giantess)

		return setGiantessWholeHp(state, buildFuncData(state), (state, hp) => {
			return hp + value
		}, false, usedGirlEnum.PlayerGirl)
	}

	return state
}

export let setOldSoldierLevel = (state: state, value, characterType_) => {
	switch (characterType_) {
		case characterType.LittleMan:
			state = _setState(state, {
				..._getState(state),
				oldSoldierLevelForLittleMan: value,
				// oldSoldierHpForLittleMan: NullableUtils.isNullable(_getState(state).oldSoldierHpForLittleMan) ? NullableUtils.return_(0) : _getState(state).oldSoldierHpForLittleMan
				oldSoldierHpForLittleMan: NullableUtils.getWithNullableDefaultFunc(_getState(state).oldSoldierHpForLittleMan, () => NullableUtils.return_(0))
			})

			state = setLittleManWholeHp(state, buildFuncData(state), (state, hp) => {
				return hp + NullableUtils.getWithDefault(
					_getState(state).oldSoldierHpForLittleMan,
					0
				)
			}, false)

			break
		case characterType.Giantess:
			state = _setState(state, {
				..._getState(state),
				oldSoldierLevelForGiantess: value,
				oldSoldierHpForGiantess: NullableUtils.getWithNullableDefaultFunc(_getState(state).oldSoldierHpForGiantess, () => NullableUtils.return_(0))
			})

			state = setGiantessWholeHp(state, buildFuncData(state), (state, hp) => {
				return hp + NullableUtils.getWithDefault(
					_getState(state).oldSoldierHpForGiantess,
					0
				)
			}, false, usedGirlEnum.PlayerGirl)

			break
	}

	return state
}



export let handleDestroy = (state: state, fromName: name, targetName: name): state => {
	if (
		// getCampExn(state, targetName) == camp.None
		getCampWithDefault(state, targetName, camp.None) == camp.None
	) {
		return state
	}

	return _handleAddHp(state, fromName)
}



export let createState = (): damageData => {
	return {
		funcs: List(),
		damageGiantessFunc: NullableUtils.getEmpty(),
		// computeDamageForceFunc: _computeDamageForceFunc,

		isEnableComboStorm: false,
		comboStormLayerCount: NullableUtils.getEmpty(),
		lastComboStormDamageTime: NullableUtils.getEmpty(),

		clothDamageEnhanceLevel: 0,

		// fragileGrowthLevel: 0,
		crazyLevel: 0,

		oldSoldierLevelForLittleMan: 0,
		oldSoldierLevelForGiantess: 0,
		oldSoldierHpForLittleMan: NullableUtils.getEmpty(),
		oldSoldierHpForGiantess: NullableUtils.getEmpty(),

		lifeCountForLittleMan: 0,
		lifeCountForGiantess: 0,
		// lifeCountForLittleMan: 2,
		// lifeCountForGiantess: 9,
		isLifeCountSubForLittleMan: false,
		isLifeCountSubForGiantess: false,
		// lifeCountForGiantess: 100,
	}
}

export let update = (state: state) => {
	let promise = Promise.resolve(state)

	if (_getState(state).isLifeCountSubForLittleMan) {
		state = setLifeCount(state, _getState(state).lifeCountForLittleMan - 1, characterType.LittleMan)

		state = _setState(state, {
			..._getState(state),
			isLifeCountSubForLittleMan: false
		})

		promise = Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
	}

	if (_getState(state).isLifeCountSubForGiantess) {
		state = setLifeCount(state, _getState(state).lifeCountForGiantess - 1, characterType.Giantess)

		state = _setState(state, {
			..._getState(state),
			isLifeCountSubForGiantess: false
		})

		promise = Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
			getBody(), usedGirlEnum.PlayerGirl
		))
	}

	return promise.then(state => {
		state = NullableUtils.getWithDefault(
			NullableUtils.map(lastComboStormDamageTime => {
				if (getNow(state) - lastComboStormDamageTime >= _getComboStormDamageInterval()) {
					state = _setState(state, {
						..._getState(state),
						comboStormLayerCount: NullableUtils.return_(0)
					})
				}

				return state
			}, _getState(state).lastComboStormDamageTime),
			state
		)

		return state
	})
}


export let dispose = (state: state) => {
	if (isEnteringNextLevel(state)) {
		return _setState(state, {
			...createState(),

			oldSoldierHpForLittleMan: _getState(state).oldSoldierHpForLittleMan,
			oldSoldierHpForGiantess: _getState(state).oldSoldierHpForGiantess,

			lifeCountForLittleMan: _getState(state).lifeCountForLittleMan,
			lifeCountForGiantess: _getState(state).lifeCountForGiantess
		})
	}

	return _setState(state, createState())
}


