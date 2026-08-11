import { Box3, Vector3 } from "three"
import { getGirlScale, getLevelData, getLevelDataExn, isGiantessCharacterType, isLittleCharacterType, setLevelData } from "../CityScene"
import { attackRange, collisionPart, pose, usedGirlEnum } from "../type/StateType"
import { getActualHeight, getGirlBox, getGirlPositionParrelToObj, getPivotWorldPosition } from "../girl/Utils"
import { state } from "../../../../type/StateType"
import { getCurrentPose } from "../girl/Pose"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB"
import { getTuple2Last } from "meta3d-jiehuo-abstract/src/utils/TupleUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
// import { getScale } from "../girl/Utils"
import * as DamageUtils from "../utils/DamageUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { actionName } from "../data/DataType"
import { getCollisionPartCenter, getCollisionPartOBB } from "../girl/Collision"
import { isCanAttackForRemote } from "./ArmyUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getCenter, getCurrentUsedGirls, isGirl, isUseGirl } from "../girl/Girl"
import { isSoldier } from "../manage/city1/soldier/utils/SoldierUtils"
import { isEliteGiantess } from "../../../../mod/EliteGiantessMod"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getNearDistance } from "../manage/city1/WholeScene"
import { isMilltaryVehicle } from "../manage/city1/milltary_vehicle/MilltaryVehicleUtils"
import { getMaxValue } from "meta3d-jiehuo-abstract/src/utils/Vector3Utils"
import { Console } from "meta3d-jiehuo-abstract"
import { isLittleMan } from "../little_man/LittleMan"
import { isMilltaryBuilding } from "../manage/city1/milltary_building/MilltaryBuildingUtils"
import { getIsControlledData } from "../girl/PickPoseUtils"
import { getPlayerName } from "./PlayerUtils"

// const _q = new Quaternion();
// const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getVeryNearGirlDistance = (state, usedGirl, height = getActualHeight(state, usedGirl)) => {
	// return 100 * Math.sqrt(getActualHeight(state)) / 4
	// return NumberUtils.greaterThan(height * 3, 200)
	return NumberUtils.greaterThan(height * 1.5, 20)
	// return NumberUtils.greaterThan(getActualHeight(state), 50)
}


export let getNearGirlDistance = (state, usedGirl, height = getActualHeight(state, usedGirl)) => {
	// return 100 * Math.sqrt(getActualHeight(state)) / 4
	// return NumberUtils.greaterThan(height * 3, 200)
	return NumberUtils.greaterThan(height * 3, 20)
	// return NumberUtils.greaterThan(getActualHeight(state), 50)
}


export let isMiddleDistanceFromGirl = (state, usedGirl, position: Vector3) => {
	if (!isUseGirl(state, usedGirl)) {
		return false
	}

	return getGirlPositionParrelToObj(state, usedGirl, position.y).distanceTo(position) >= getNearGirlDistance(state, usedGirl) * 2
}

export let isSmallDistanceFromGirl = (state, usedGirl, position: Vector3) => {
	if (!isUseGirl(state, usedGirl)) {
		return false
	}

	return getGirlPositionParrelToObj(state, usedGirl, position.y).distanceTo(position) < getNearGirlDistance(state, usedGirl)
}

let _isNearGirl = (state, computeDistanceFunc, position: Vector3) => {
	return ArrayUtils.reduce(
		getCurrentUsedGirls(state),
		(isNear, usedGirl) => {
			if (isNear) {
				return isNear
			}

			return getGirlPositionParrelToObj(state, usedGirl, position.y).distanceTo(position) < computeDistanceFunc(state, usedGirl)
		},
		false
	)
}

export let isNearGirl = (state, position: Vector3) => {
	return _isNearGirl(state, (state, usedGirl) => getNearGirlDistance(state, usedGirl), position)
}


export let isVeryNearGirl = (state, position: Vector3) => {
	// return ArrayUtils.reduce(
	// 	getCurrentUsedGirls(state),
	// 	(isNear, usedGirl) => {
	// 		if (isNear) {
	// 			return isNear
	// 		}

	// 		return getPivotWorldPosition(state, usedGirl).distanceToSquared(position) < 600 * getGirlScale(state, usedGirl)
	// 	},
	// 	false
	// )
	return _isNearGirl(state, (state, usedGirl) => _getVeryNearGirlDistance(state, usedGirl), position)
}

// export let getAllAttackRanges = () => [
// 	attackRange.StompRange,
// 	attackRange.BreastPressRange,
// 	attackRange.PickRange
// ]

export let getAllValidAttackRanges = (state, usedGirl) => {
	let result
	switch (getCurrentPose(state, usedGirl)) {
		case pose.Stand:
			result = [
				// attackRange.StompRange,
				attackRange.PrecisionStompRange,
				attackRange.RangeStompRange,
				attackRange.PickRange
			]
			break
		case pose.Pick:
			result = [
				attackRange.PickRange
			]
			break
		case pose.Crawl:
			result = [
				attackRange.BreastPressRange
			]
			break
	}

	return result
}

// export let getValidRandomAttackRangeForWalkToTarget = (state) => {
// 	// let api = getModAPI(state)

// 	// return ArrayUtils.randomShuffle(
// 	//     getAllAttackRanges().filter(attackRange => {
// 	//         return api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange, api.NullableUtils.getEmpty())
// 	//     })
// 	// )
// 	return ArrayUtils.randomShuffle(getAllValidAttackRanges(state, usedGirl).filter(attackRange_ => attackRange_ !== attackRange.RangeStompRange))[0]
// }



export let getAttackRangeFactor = (range: attackRange) => {
	let rangeFactor
	switch (range) {
		case attackRange.InfinityRange:
			rangeFactor = +Infinity
			break
		case attackRange.PrecisionStompRange:
			// rangeFactor = 2
			// rangeFactor = 4

			// rangeFactor = 0.7
			// rangeFactor = 0.4
			// rangeFactor = 0.3
			rangeFactor = 0.68
			break
		case attackRange.RangeStompRange:
			// rangeFactor = 1.4
			// rangeFactor = 1
			// rangeFactor = 0.9
			rangeFactor = 1.2
			break
		case attackRange.JumpStompRange:
			rangeFactor = 1
			break
		case attackRange.SprayMilkRange:
			// rangeFactor = 1.0
			rangeFactor = 0.8
			break
		case attackRange.BreastPressRange:
			// rangeFactor = 0.96
			// rangeFactor = 0.8
			rangeFactor = 0.76
			// rangeFactor = 0.7
			break
		case attackRange.CrawlLickRange:
			// rangeFactor = 0.85
			rangeFactor = 1.1
			break
		case attackRange.CrawlBeatRange:
			rangeFactor = 0.78
			break
		case attackRange.PickRange:
			// rangeFactor = 0.5
			// rangeFactor = 0.25
			// rangeFactor = 0.15

			// rangeFactor = 0.38
			rangeFactor = 0.45
			break

		case attackRange.SitRange:
			rangeFactor = 1.1
			break
		// case attackRange.PrecisionSitRange:
		// 	rangeFactor = 1.1
		// 	break
		case attackRange.SitRubRange:
			rangeFactor = 0.15
			break
	}

	return rangeFactor
}

export let getShankLength = (state: state, usedGirl) => {
	let leftShank = getCollisionPartOBB(state, usedGirl, collisionPart.LeftShank)

	return getMaxValue(leftShank.getSize(_v1))
}

let _getLegLength = (state: state, usedGirl) => {
	let leftThigh = getCollisionPartOBB(state, usedGirl, collisionPart.LeftThigh)
	let leftShank = getCollisionPartOBB(state, usedGirl, collisionPart.LeftShank)

	return getMaxValue(leftThigh.getSize(_v1)) + getMaxValue(leftShank.getSize(_v2))
}

export let isInGirlAttackRange = (state: state, usedGirl, position: Vector3, range: attackRange, actionName_: nullable<actionName>) => {
	// let poseFactor
	// switch (getCurrentPose(state, usedGirl)) {
	// 	case pose.Stand:
	// 		poseFactor = 0.4
	// 		break
	// 	case pose.Pick:
	// 		poseFactor = 0.25
	// 		break
	// 	case pose.Crawl:
	// 		poseFactor = 0.2
	// 		// poseFactor = 0.25
	// 		break
	// }

	// // NullableUtils.forEach((actionName_) => {
	// // 	switch (actionName_) {
	// // 		case actionName.Pickup:
	// // 			poseFactor = 0.25
	// // 			break
	// // 		// case actionName.Stomp:
	// // 		// 	poseFactor *= 2
	// // 		// 	break
	// // 	}
	// // }, actionName_)

	// let rangeFactor = getAttackRangeFactor(range)

	// // return getPivotWorldPosition(state, usedGirl).distanceToSquared(position) < Math.pow((getGirlScale(state, usedGirl) * 0.9), 2) * 2.1 * poseFactor * rangeFactor
	// return DamageUtils.getParrelDistanceTo(getPivotWorldPosition(state, usedGirl), position) < (getGirlScale(state, usedGirl) * 0.9) * 2.1 * poseFactor * rangeFactor



	let legLength = _getLegLength(state, usedGirl)
	let rangeFactor = getAttackRangeFactor(range)

	// Console.log(`rangeFactor=${DamageUtils.getParrelDistanceTo(getCenter(state), position) / legLength}`)

	return DamageUtils.getParrelDistanceTo(getCenter(state, usedGirl), position) < legLength * rangeFactor
}


export let getDefaultAllCollisionParts = () => {
	return [
		collisionPart.Torso,

		collisionPart.TrigoneAndButt,
		collisionPart.LeftBreast,
		collisionPart.RightBreast,

		collisionPart.Head,

		collisionPart.LeftFoot,
		collisionPart.RightFoot,
		collisionPart.LeftShank,
		collisionPart.RightShank,
		collisionPart.LeftThigh,
		collisionPart.RightThigh,
		collisionPart.LeftUpperArm,
		collisionPart.RightUpperArm,
		collisionPart.LeftLowerArm,
		collisionPart.RightLowerArm,
		collisionPart.LeftHand,
		collisionPart.RightHand
	]
}

export let getAllCollisionParts = <collisionPart>(state: state, usedGirl): any => {
	if (!isUseGirl(state, usedGirl)) {
		// return []
		throw new Error("should use girl")
	}

	return getLevelDataExn(state, "allCollisionParts")
	// return [
	// 	collisionPart.Torso,

	// 	collisionPart.TrigoneAndButt,
	// 	collisionPart.LeftBreast,
	// 	collisionPart.RightBreast,

	// 	collisionPart.Head,

	// 	collisionPart.LeftFoot,
	// 	collisionPart.RightFoot,
	// 	collisionPart.LeftShank,
	// 	collisionPart.RightShank,
	// 	collisionPart.LeftThigh,
	// 	collisionPart.RightThigh,
	// 	collisionPart.LeftUpperArm,
	// 	collisionPart.RightUpperArm,
	// 	collisionPart.LeftLowerArm,
	// 	collisionPart.RightLowerArm,
	// 	collisionPart.LeftHand,
	// 	collisionPart.RightHand
	// ]
}

export let setAllCollisionParts = (state: state, allCollisionParts) => {
	return setLevelData(state, "allCollisionParts", allCollisionParts)
}

export let getAllCollisionPartsForMelee = (state: state, usedGirl) => {
	if (!isUseGirl(state, usedGirl)) {
		return []
	}

	switch (getCurrentPose(state, usedGirl)) {
		case pose.Pick:
		case pose.Stand:
			return [
				collisionPart.LeftFoot,
				collisionPart.RightFoot,
			]
		case pose.Crawl:
			return [
				collisionPart.LeftFoot,
				collisionPart.RightFoot,
				collisionPart.LeftShank,
				collisionPart.RightShank,
				collisionPart.LeftThigh,
				collisionPart.RightThigh,
				collisionPart.LeftHand,
				collisionPart.RightHand
			]
		case pose.Sit:
			return [
				collisionPart.LeftFoot,
				collisionPart.RightFoot,
				collisionPart.LeftShank,
				collisionPart.RightShank,
				collisionPart.LeftThigh,
				collisionPart.RightThigh,
				collisionPart.LeftHand,
				collisionPart.RightHand
			]
	}
}

export let getAllLowestCollisionParts = (state: state, usedGirl) => {
	if (!isUseGirl(state, usedGirl)) {
		return []
	}

	return [
		collisionPart.LeftFoot,
		collisionPart.RightFoot,
		collisionPart.LeftHand,
		collisionPart.RightHand
	]
}

let _getRandomCollisionPart = (parts) => {
	let length = parts.length

	return NullableUtils.getWithDefault(
		parts.reduce((result, collisionPart_) => {
			if (!NullableUtils.isNullable(result)) {
				return result
			}

			if (Math.random() < 1 / length) {
				return NullableUtils.return_(collisionPart_)
			}
		}, NullableUtils.getEmpty()),
		parts[0]
	)
}

let _getRandomCollisionPartCanAttack = (state: state, usedGirl, name, parts, transform, box, emitterLife, emitterSpeed) => {
	let length = parts.length

	// return NullableUtils.getWithDefault(
	// 	parts.reduce((result, collisionPart_) => {
	// 		if (!NullableUtils.isNullable(result)) {
	// 			return result
	// 		}

	// 		if (Math.random() < 1 / length) {
	// 			return NullableUtils.return_(collisionPart_)
	// 		}
	// 	}, NullableUtils.getEmpty()),
	// 	parts[0]
	// )

	let result = parts.reduce((result, collisionPart_) => {
		if (!NullableUtils.isNullable(result)) {
			return result
		}

		if (isCanAttackForRemote(state, name, transform, box, emitterLife, emitterSpeed) && Math.random() < 1 / length) {
			return NullableUtils.return_(collisionPart_)
		}
	}, NullableUtils.getEmpty())

	if (NullableUtils.isNullable(result)) {
		return getNearestCollisionPart(state, usedGirl, TransformUtils.getPositionFromMatrix4(transform))
	}

	return NullableUtils.getExn(result)
}

export let getRandomCollisionPart = (state: state, usedGirl) => {
	return _getRandomCollisionPart(getAllCollisionParts(state, usedGirl))
}

export let getRandomCollisionPartForMelee = (state: state, usedGirl) => {
	return _getRandomCollisionPart(getAllCollisionPartsForMelee(state, usedGirl))
}

export let getRandomCollisionPartCanAttack = (state: state, usedGirl, name, transform, box, emitterLife, emitterSpeed) => {
	return _getRandomCollisionPartCanAttack(state, usedGirl, name, getAllCollisionParts(state, usedGirl), transform, box, emitterLife, emitterSpeed)
}

export let getNearestCollisionPart = (state: state, usedGirl, position: Vector3) => {
	let allCollisionParts = getAllCollisionParts(state, usedGirl)

	let d = allCollisionParts.reduce(([minDistance, result], part) => {
		let distance = getCollisionPartCenter(state, usedGirl, part).distanceToSquared(position)

		if (distance < minDistance) {
			result = NullableUtils.return_(part)
			minDistance = distance
		}

		return [minDistance, result]
	}, [+Infinity, NullableUtils.getEmpty()])

	return NullableUtils.getWithDefault(
		d[1],
		ArrayUtils.getExn(allCollisionParts, 0)
	)
}

export let getNearestUsedGirl = (state: state, position: Vector3, name = getPlayerName(state)) => {
	let usedGirl = TupleUtils.getTuple2Last(getIsControlledData(state, name))

	if (usedGirl != usedGirlEnum.None) {
		return usedGirl
	}

	return TupleUtils.getTuple2First(ArrayUtils.reduce(
		getCurrentUsedGirls(state),
		([result, distance], usedGirl) => {
			let d = getGirlPositionParrelToObj(state, usedGirl, position.y).distanceTo(position)

			if (d < distance) {
				return [usedGirl, d]
			}

			return [result, distance]
		},
		[usedGirlEnum.None, +Infinity]
	))
}

export let isSpecificFrameIndex = (state, frameIndex, targetFrameIndex, targetFrameRange: nullable<number>, frameCount) => {
	if (!NullableUtils.isNullable(targetFrameRange)) {
		targetFrameRange = NullableUtils.getExn(targetFrameRange)

		return ArrayUtils.range(targetFrameIndex, targetFrameIndex + targetFrameRange).reduce((result, targetFrameIndex) => {
			if (result) {
				return result
			}

			if (SkinAnimation.isSpecificFrameIndex(frameIndex, targetFrameIndex, frameCount, 0, getIsDebug(state))) {
				return true
			}

			return result
		}, false)
	}

	return SkinAnimation.isSpecificFrameIndex(frameIndex, targetFrameIndex, frameCount, 0, getIsDebug(state))
}

export let checkCollisionWithStatic = (state: state, pointBox: Box3): nullable<number> => {
	return LOD.getOctreeForStaticLODContainer(getAbstractState(state)).queryByBoxForParticle(getAbstractState(state), pointBox)
}

export let checkRangeCollisionWithStatic = (state: state, pointBox: Box3): Array<number> => {
	return LOD.getOctreeForStaticLODContainer(getAbstractState(state)).queryRangeByBox(getAbstractState(state), pointBox)
}

export let handleCollisionWithEmitterCollisionableContainers = (state, direction: Vector3, damagePosition, staticLODContainerIndex: staticLODContainerIndex,
	fromName,
	[
		force, damageType, weaponType
	], weaponValue_,
	// critRatioFactor,
	// attackFactor,
) => {
	// state = emitFunc(state, pointPosition)

	return DamageUtils.damageWithSingleData(state, [[force, direction], [damageType, weaponType]],
		weaponValue_,
		fromName,
		// NullableUtils.return_(pointPosition),
		damagePosition,
		// critRatioFactor,
		// attackFactor,
		[
			LOD.getTransform(getAbstractState(state), staticLODContainerIndex),
			LOD.getBox(getAbstractState(state), staticLODContainerIndex),
			LOD.getName(getAbstractState(state), staticLODContainerIndex)
			// ]).then(TupleUtils.getTuple2First)
		])
}


export let isVehicle = (state, name) => {
	return isMilltaryVehicle(name)
}

export let isRigidBody = (state, name) => {
	return isVehicle(state, name) || isMilltaryBuilding(name)
}

export let isCharacter = (state, name) => {
	return isSoldier(name) || isEliteGiantess(state, name) || isLittleMan(name) || isGirl(name)
}