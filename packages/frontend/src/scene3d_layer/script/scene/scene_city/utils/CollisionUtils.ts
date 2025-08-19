import { Box3, Vector3 } from "three"
import { getCenter, getGirl, getGirlState } from "../girl/Girl"
import { getGirlScale, getLevelData, getLevelDataExn, setLevelData } from "../CityScene"
import { attackRange, collisionPart, pose } from "../type/StateType"
import { getGirlBox, getPivotWorldPosition } from "../girl/Utils"
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
import { getCollisionPartCenter } from "../girl/Collision"
import { isCanAttackForRemote } from "./ArmyUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"

// const _q = new Quaternion();
// const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let isNearGirl = (state, position: Vector3) => {
	// let scale = getScale(state)
	// let d
	// if(scale < 30){
	// 	d = 1000
	// }
	// else if(scale < 100){
	// 	d = 1000
	// }

	// return getGirl(state).position.distanceToSquared(position) < 1000 * getGirlScale(state)
	// return getCenter(state).distanceToSquared(position) < 1000 * getGirlScale(state)
	return getPivotWorldPosition(state).distanceToSquared(position) < 600 * getGirlScale(state)
}

export let getAttackRangeFactor = (range: attackRange) => {
	let rangeFactor
	switch (range) {
		case attackRange.Big:
			rangeFactor = 2
			// rangeFactor = 4
			break
		case attackRange.Middle:
			// rangeFactor = 1
			rangeFactor = 0.7
			break
		case attackRange.Small:
			// rangeFactor = 0.5
			rangeFactor = 0.2
			break
	}

	return rangeFactor
}

export let isInGirlAttackRange = (state: state, position: Vector3, range: attackRange, actionName_: nullable<actionName>) => {
	let poseFactor
	switch (getCurrentPose(state)) {
		case pose.Stand:
			poseFactor = 0.4
			break
		case pose.Pick:
			poseFactor = 0.25
			break
		case pose.Crawl:
			poseFactor = 0.2
			// poseFactor = 0.25
			break
	}

	NullableUtils.forEach((actionName_) => {
		if (actionName_ == actionName.Pickup) {
			poseFactor = 0.25
		}
	}, actionName_)


	let rangeFactor = getAttackRangeFactor(range)

	return getPivotWorldPosition(state).distanceToSquared(position) < Math.pow((getGirlScale(state) * 0.9), 2) * 2.1 * poseFactor * rangeFactor
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

export let getAllCollisionParts = (state: state): any => {
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

export let getAllCollisionPartsForMelee = (state: state) => {
	switch (getCurrentPose(state)) {
		case pose.Pick:
		case pose.Stand:
			return [
				collisionPart.LeftFoot,
				collisionPart.RightFoot,
			]
		case pose.Crawl:
			return [
				// collisionPart.LeftBreast,
				// collisionPart.RightBreast,

				// collisionPart.Head,
				// collisionPart.Torso,

				collisionPart.LeftFoot,
				collisionPart.RightFoot,
				collisionPart.LeftShank,
				collisionPart.RightShank,
				collisionPart.LeftThigh,
				collisionPart.RightThigh,
				// collisionPart.LeftUpperArm,
				// collisionPart.RightUpperArm,
				// collisionPart.LeftLowerArm,
				// collisionPart.RightLowerArm,
				collisionPart.LeftHand,
				collisionPart.RightHand
			]
	}
}

export let getAllLowestCollisionParts = () => {
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

let _getRandomCollisionPartCanAttack = (state: state, name, parts, transform, emitterLife, emitterSpeed) => {
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

		if (isCanAttackForRemote(state, name, transform, emitterLife, emitterSpeed) && Math.random() < 1 / length) {
			return NullableUtils.return_(collisionPart_)
		}
	}, NullableUtils.getEmpty())

	if (NullableUtils.isNullable(result)) {
		return getNearestCollisionPart(state, TransformUtils.getPositionFromMatrix4(transform))
	}

	return NullableUtils.getExn(result)
}

export let getRandomCollisionPart = (state: state) => {
	return _getRandomCollisionPart(getAllCollisionParts(state))
}

export let getRandomCollisionPartForMelee = (state: state) => {
	return _getRandomCollisionPart(getAllCollisionPartsForMelee(state))
}

export let getRandomCollisionPartCanAttack = (state: state, name, transform, emitterLife, emitterSpeed) => {
	return _getRandomCollisionPartCanAttack(state, name, getAllCollisionParts(state), transform, emitterLife, emitterSpeed)
}

export let getNearestCollisionPart = (state: state, position: Vector3) => {
	let d = getAllCollisionParts(state).reduce(([minDistance, result], part) => {
		let distance = getCollisionPartCenter(state, part).distanceToSquared(position)

		if (distance < minDistance) {
			result = NullableUtils.return_(part)
			minDistance = distance
		}

		return [minDistance, result]
	}, [+Infinity, NullableUtils.getEmpty()])

	return NullableUtils.getExn(d[1])
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

export let handleCollisionWithEmitterCollisionableContainers = (state, direction: Vector3, pointPosition, staticLODContainerIndex: staticLODContainerIndex,
	fromName,
	[
		force, damageType, weaponType
	]) => {
	// state = emitFunc(state, pointPosition)

	return DamageUtils.damageWithData(state, [[force, direction], [damageType, weaponType]],
		fromName,
		NullableUtils.return_(pointPosition),
		[
			[LOD.getTransform(getAbstractState(state), staticLODContainerIndex)],
			[LOD.getBox(getAbstractState(state), staticLODContainerIndex)],
			[LOD.getName(getAbstractState(state), staticLODContainerIndex)]
		]).then(TupleUtils.getTuple2First)
}
