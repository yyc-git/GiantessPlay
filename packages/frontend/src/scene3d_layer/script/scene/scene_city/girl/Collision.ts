import { state } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { buildNameByUsedGirl, getCurrentMMDCharacterName, getGirl, getGirlMesh, getIsOnlyDamageLittleMan, getUsedGirlData, setUsedGirlData } from "./Girl"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Matrix4, Object3D, Quaternion, Ray, Vector3 } from "three"
import { getRootMotionData } from "../data/RootMotionData"
import { getCurrentAnimationName, isCompletelyPlayingAnimation } from "./Animation"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getBoxSizeForCompute, getGirlBox, getGirlPosition, getGirlRotation, getActualHeight, getScale, getGirlWeaponType, buildFakeGirlWeaponValue, isMiddleGiantess, isBigGiantess, getBigGirlBox, computeGirlBox, getPivotWorldPosition } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { getCollisionShapeData, getConfigData, getGirlScale, getOrbitControlsTarget, isLittleCharacterType } from "../CityScene"
import { animationName, computeDirectionFunc, effect, frameIndex, giantessForceSize, particle, track } from "../data/DataType"
import { camp, collisionPart, crawlMovePhase, damageType, force, forceSize, otherPhase, pose, rangePhase, runPhase, standToCrawlPhase, stompPhase, walkPhase } from "../type/StateType"
import * as Data from "../data/Data"
import * as Cars from "../manage/city1/Cars"
import * as DynamicCars from "../manage/city1/DynamicCars"
import * as Citiyzen from "../manage/city1/Citiyzen"
// import * as Infantry from "../manage/city1/soldier/Infantry"
import * as Soldier from "../manage/city1/soldier/Soldier"
import * as MilltaryVehicle from "../manage/city1/milltary_vehicle/MilltaryVehicle"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { Map } from "immutable"
import { buildDownDirection, buildRandomDirectionInXZ, buildUpDirection } from "../../../../utils/DirectionUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer"
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB"
import { Instance } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getDamageFuncs } from "../StaticDynamic"
import { Event } from "meta3d-jiehuo-abstract"
import { eventName, usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { LODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/LODContainer"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { directionScalar, sizeData } from "mmd-character-protocol/src/service/ServiceType"
import { isCharacter, isNearGirl, isRigidBody, isSpecificFrameIndex, isVehicle, isVeryNearGirl } from "../utils/CollisionUtils"
import { computeGiantessForceByFactor, damageWithMultipleData, damageWithSingleData, isNotMaxForce } from "../utils/DamageUtils"
import { getGirlVolume } from "../utils/SoundUtils"
import { getBone } from "../utils/MMDUtils"
import { getCollisionResultWithLittleMan } from "../little_man/Collision"
import { screenShake } from "../utils/EffectUtils"
import { weaponType, weaponValue } from "../data/ValueType"
import { getAllArmyContainers, getCampExn } from "../manage/city1/Army"
import { updateForce } from "./player/Girl"
import { filter } from "meta3d-jiehuo-abstract/src/utils/MutableRecordUtils"
import { expandOBB } from "../utils/OBBUtils"
import { isEliteGiantess } from "../../../../mod/EliteGiantessMod"
import { getPickObjectData } from "./PickPoseUtils"
import { getHandBox } from "../utils/SkeletonUtils"
import { getCimingName, getLipusiName, getSunxiaomeiName } from "../../../../mod/MMDMod"
import { getStompBlockService, computeForceDirectionDefault as computeForceDirectionDefaultMod, computeDamageTypeDefault as computeDamageTypeDefaultMod } from "../../../../mod/SkillGiantessMod"
import { computeDistance, handleRepel } from "../utils/RepelUtils"
import { getIsAllowFriendDamage } from "../difficulty/HeatImplementer"
import { getPlayerCamp, isCanDamageLittleMan, isPlayerCamp } from "../utils/PlayerUtils"

const _q = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getPhase = (state: state, animationName_: animationName, frameIndex) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(
			data => {
				return NullableUtils.getWithDefault(
					data.value.filter(v => {
						return NumberUtils.between(frameIndex, v.frameIndexRange[0], v.frameIndexRange[1])
					}).map(v => {
						return v.phase
					})[0],
					otherPhase.EmptyPhase
				)
			},
			getConfigData(state).phaseData.find(data => {
				return data.name == animationName_
			})),
		otherPhase.NoPhase
	)
}

// let _screenShake = (state: state) => {
// 	getUsedGirlData(state, usedGirl).screenShake.shake(getOrbitControlsTarget(state), getValue(state).screenShakeDistanceFactor * Math.pow(getScale(state, usedGirl), 1.0), getValue(state).screenShakeTime)

// 	return state
// }

let _isCollisionWithObject = (isObjectFunc, state, usedGirl, animationName, phase: walkPhase) => {
	let { isComputeDamageMap } = getUsedGirlData(state, usedGirl)

	let isComputeActionDamageMap = NullableUtils.getExn(isComputeDamageMap.get(animationName))

	// let phase
	// switch (collisionPart_) {
	// 	case collisionPart.RightFoot:
	// 		phase = walkPhase.RightFootDown
	// 		break
	// 	case collisionPart.LeftFoot:
	// 		phase = walkPhase.LeftFootDown
	// 		break
	// }

	return isComputeActionDamageMap.reduce((result, value, name) => {
		if (result) {
			return result
		}

		if (isObjectFunc(name)) {
			return NullableUtils.getWithDefault(value.get(phase), false)
		}

		return false
	}, false)

}

let _isCollisionWithRigidBody = (state, usedGirl, animationName, phase) => {
	return _isCollisionWithObject(name => {
		// return Cars.isCars(name) || DynamicCars.isDynamicCar(name) || MilltaryVehicle.isMilltaryVehicle(name)
		return isRigidBody(state, name)
	}, state, usedGirl, animationName, phase)
}

let _isCollisionWithCharacter = (state, usedGirl, animationName, phase) => {
	return _isCollisionWithObject(name => {
		// return Citiyzen.isCityzen(name) || 
		return isCharacter(state, name)
	}, state, usedGirl, animationName, phase)
}

export let computeDamageTypeDefault = (state, animationName_, phase) => {
	switch (animationName_) {
		case animationName.Walk:
			return phase == walkPhase.LeftFootDown || phase == walkPhase.RightFootDown ? damageType.Direct : damageType.Normal
		case animationName.Run:
			return phase == runPhase.LeftFootDown || phase == runPhase.RightFootDown ? damageType.Direct : damageType.Normal
		// case animationName.Stomp:
		// 	return phase == stompPhase.Down ? damageType.Direct : damageType.Normal


		case animationName.CrawlMove:
			return phase == crawlMovePhase.Down ? damageType.Direct : damageType.Normal

		// case animationName.StandToCrawl:
		// case animationName.CrawlToStand:
		default:
			return computeDamageTypeDefaultMod(state, animationName_, phase)
	}
}

let _getDamageType = (state: state, usedGirl, phase, animationName_) => {
	return getUsedGirlData(state, usedGirl).computeDamageTypeFunc(state, animationName_, phase)
}

let _execEffect = (state, effect_: effect) => {
	switch (effect_) {
		case effect.ScreenShake:
			state = screenShake(state)
			break
		default:
			throw new Error("err")
	}

	return state
}

let _emitParticle = (state, data: Array<[particle, any]>) => {
	return data.reduce((state, d) => {
		switch (d[0]) {
			case particle.StompDust:
				state = setAbstractState(state, ParticleManager.emitStompDust(getAbstractState(state), d[1]))
				break
			case particle.WaterBloom:
				state = setAbstractState(state, ParticleManager.emitWaterBloom(getAbstractState(state), d[1]))
				break
			case particle.Milk:
				state = setAbstractState(state, ParticleManager.emitMilkSplash(getAbstractState(state), d[1]))
				break
			default:
				throw new Error("err")
		}

		return state
	}, state)
}


let _updateCollisionOBBShape = (state: state,
	[getCenterFunc, getWorldQuaternionFunc],
	usedGirl,
	girl, bone1Name, bone2Name, collisionPart_: collisionPart,
	centerFactor,
	size
) => {
	let data1 = getBone(state, usedGirl, girl, bone1Name, collisionPart_)
	state = data1[0]
	let bone1 = data1[1]

	let data2 = getBone(state, usedGirl, girl, bone2Name, collisionPart_)
	state = data2[0]
	let bone2 = data2[1]

	if (NullableUtils.isNullable(bone1)) {
		throw new Error(`null: bone1: ${bone1Name}, collisionPart_:${collisionPart_}, mmdCharacterName: ${getCurrentMMDCharacterName(state, usedGirl)}`)
	}
	if (NullableUtils.isNullable(bone2)) {
		throw new Error(`null: bone2: ${bone1Name}, collisionPart_:${collisionPart_}, mmdCharacterName: ${getCurrentMMDCharacterName(state, usedGirl)}`)
	}


	let w1 = bone1.getWorldPosition(_v1)
	let w2 = bone2.getWorldPosition(_v2)
	let center = NullableUtils.getWithDefault(
		NullableUtils.bind(getCenterFunc => {
			return getCenterFunc(collisionPart_)
		}, getUsedGirlData(state, usedGirl).getCenterFunc),
		getCenterFunc(w1.add(
			w2.sub(w1).multiplyScalar(centerFactor)
		).clone())

	)


	// let center = w1.add(
	// 	w2.sub(w1).multiplyScalar(centerFactor)
	// ).clone()
	// let quat = bone2.getWorldQuaternion(_q)
	let quat = getWorldQuaternionFunc(state, bone1, bone2)

	Collision.updateOBB(NullableUtils.getExn(getCollisionPartOBB(state, usedGirl, collisionPart_)), center, quat, size)

	return state
}

let _updateCollisionOBBShapeByOneBone = (state: state,
	[getCenterFunc, getWorldQuaternionFunc],
	usedGirl,
	girl, bone1Name, collisionPart_: collisionPart,
	size
) => {
	let data1 = getBone(state, usedGirl, girl, bone1Name, collisionPart_)
	state = data1[0]
	let bone1 = data1[1]

	if (NullableUtils.isNullable(bone1)) {
		throw new Error(`null: bone1: ${bone1Name}, collisionPart_:${collisionPart_}, mmdCharacterName: ${getCurrentMMDCharacterName(state, usedGirl)}`)
	}

	let center = NullableUtils.getWithDefault(
		NullableUtils.bind(getCenterFunc => {
			return getCenterFunc(collisionPart_)
		}, getUsedGirlData(state, usedGirl).getCenterFunc),
		getCenterFunc(bone1.getWorldPosition(_v1).clone())
	)

	// let center = w1.add(
	// 	w2.sub(w1).multiplyScalar(centerFactor)
	// ).clone()
	// let quat = bone1.getWorldQuaternion(_q)
	let quat = getWorldQuaternionFunc(state, bone1)

	Collision.updateOBB(NullableUtils.getExn(getCollisionPartOBB(state, usedGirl, collisionPart_) as OBB), center, quat, size)

	return state
}

// let _isFrameIndexUsedForReset = (frameIndex) => {
// 	return frameIndex == 0 || frameIndex == 1
// }

let _resetActionCollision = (state: state, usedGirl, name, frameIndex) => {
	let { isComputeCollisionMap, isComputeDamageMap, lastFrameIndexMap } = getUsedGirlData(state, usedGirl)

	// if (_isFrameIndexUsedForReset(frameIndex)) {
	if (frameIndex < NullableUtils.getWithDefault(
		lastFrameIndexMap.get(name),
		10000
	)) {
		isComputeCollisionMap = Map()
		isComputeDamageMap = Map()
	}

	state = setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		isComputeCollisionMap,
		isComputeDamageMap,
	})

	return state
}

let _getMoveDirection = (velocity) => {
	if (velocity.equals(_v1.set(0, 0, 0))) {
		return buildRandomDirectionInXZ()
	}

	return velocity.clone().normalize()
}

// export let computeForce = (state: state, actionForce) => {
// 	// return actionForce * getActualHeight(state)
// 	return actionForce
// }

export let computeForceDirectionDefault = (state: state, usedGirl, animationName_: animationName, velocity: Vector3, phase) => {
	let direction
	switch (animationName_) {
		case animationName.Walk:
			switch (phase) {
				case walkPhase.LeftFootMove:
				case walkPhase.RightFootMove:
					direction = _getMoveDirection(velocity)
					break
				case walkPhase.LeftFootDown:
				case walkPhase.RightFootDown:
					direction = buildDownDirection()
					break
			}
			break
		case animationName.Run:
			switch (phase) {
				case runPhase.LeftFootMove:
				case runPhase.RightFootMove:
					direction = _getMoveDirection(velocity)
					break
				case runPhase.LeftFootDown:
				case runPhase.RightFootDown:
					direction = buildDownDirection()
					break
			}
			break
		// case animationName.Stomp:
		// case getStompBlockService(state).getAnimationName():
		// 	switch (phase) {
		// 		case stompPhase.Up:
		// 			direction = buildUpDirection()
		// 			break
		// 		case stompPhase.Down:
		// 			direction = buildDownDirection()
		// 			break
		// 		case rangePhase.Range:
		// 			direction = buildDownDirection()
		// 			break
		// 	}
		// 	break

		case animationName.StandToCrawl:
			direction = buildDownDirection()
			break
		case animationName.CrawlToStand:
			direction = buildRandomDirectionInXZ()
			break
		// case animationName.BreastPress:
		// 	switch (phase) {
		// 		case breastPressPhase.Up:
		// 			direction = buildUpDirection()
		// 			break
		// 		case breastPressPhase.Down:
		// 			direction = buildDownDirection()
		// 			break
		// 	}
		// 	break
		case animationName.CrawlMove:
			switch (phase) {
				case crawlMovePhase.Move:
					direction = _getMoveDirection(velocity)
					break
				case crawlMovePhase.Down:
					direction = buildDownDirection()
					break
			}
			break

		default:
			direction = computeForceDirectionDefaultMod(state, animationName_, velocity, phase)
			break

	}

	return direction
}

let _getWeaponValue = (state: state, usedGirl, animationName_: animationName, phase): weaponValue => {
	let actionForce = NullableUtils.getWithDefault(
		NullableUtils.map(
			(data) => {
				return data.force[phase]
			},
			getConfigData(state).actionData.find(data => {
				return data.name == animationName_
			}),
		),
		0
	)

	actionForce = computeGiantessForceByFactor(state, usedGirl, actionForce)

	actionForce = updateForce(state, animationName_, phase, actionForce)

	return buildFakeGirlWeaponValue(state, usedGirl, actionForce)
}

let _getWeaponValueData = (state: state, usedGirl, animationName_: animationName, velocity: Vector3, phase): [weaponValue, Vector3] => {
	let direction = getUsedGirlData(state, usedGirl).computeForceDirectionFunc(state, usedGirl, animationName_, velocity, phase)

	return [_getWeaponValue(state, usedGirl, animationName_, phase), direction]
}

let _splitByCamp = (state, fromCamp: camp, [transforms, boxes, names]) => {
	return ArrayUtils.reduce(names, ([enemyCampData, friendCampData], name, i) => {
		if (getCampExn(state, name) == fromCamp) {
			return [
				enemyCampData,
				[
					ArrayUtils.push(
						friendCampData[0],
						transforms[i]
					),
					ArrayUtils.push(
						friendCampData[1],
						boxes[i]
					),
					ArrayUtils.push(
						friendCampData[2],
						name
					),
				]
			]
		}

		return [
			[
				ArrayUtils.push(
					enemyCampData[0],
					transforms[i]
				),
				ArrayUtils.push(
					enemyCampData[1],
					boxes[i]
				),
				ArrayUtils.push(
					enemyCampData[2],
					name
				),
			],
			friendCampData
		]
	}, [[[], [], []], [[], [], []]])
}

let _damageWithMultipleData = (state, usedGirl, force, weaponValue, forceDirection, damageType_, damagePosition, data) => {
	return damageWithMultipleData(state, [[force, forceDirection], [damageType_, getGirlWeaponType()]],
		weaponValue,
		buildNameByUsedGirl(usedGirl),
		damagePosition,
		data)
}

let _isNotDamage = (force) => {
	return force < 0
}

let _getFriendForce = (state: state, weaponValue) => {
	if (getIsAllowFriendDamage(state)) {
		return weaponValue.force
	}

	if (isNotMaxForce(weaponValue.force)) {
		return 0
	}

	return weaponValue.force
}

let _damageInRange = (state: state, usedGirl, velocity, rangeBox): Promise<state> => {
	// let [weaponValue, forceDirection] = _getWeaponValueData(state, animationName.Stomp, velocity, rangePhase.Range)
	// let [weaponValue, forceDirection] = _getWeaponValueData(state, getStompBlockService(state).getForceAnimationName(), velocity, rangePhase.Range)
	let [weaponValue, forceDirection] = _getWeaponValueData(state, usedGirl, getCurrentAnimationName(state, usedGirl), velocity, rangePhase.Range)

	let damagePosition = NullableUtils.return_(rangeBox.getCenter(new Vector3()))

	let fromCamp = getCampExn(state, buildNameByUsedGirl(usedGirl))

	return ArrayUtils.reducePromise(_queryRangeCollisionByBox(state, usedGirl, rangeBox), (state, damageData) => {
		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

		if (transforms.length == 0 || _isNotDamage(weaponValue.force)) {
			return Promise.resolve(state)
		}

		let [enemyCampData, friendCampData] = _splitByCamp(state, fromCamp, [transforms, boxes, names])

		return _damageWithMultipleData(state, usedGirl, _getFriendForce(state, weaponValue), weaponValue, forceDirection, damageType.Range, damagePosition, friendCampData).then(TupleUtils.getTuple2First)
			.then(state => {
				return _damageWithMultipleData(state, usedGirl, weaponValue.force, weaponValue, forceDirection, damageType.Range, damagePosition, enemyCampData).then(TupleUtils.getTuple2First)
			})
		// return _damageWithMultipleData(state, weaponValue.force, weaponValue, forceDirection, damageType.Range, damagePosition, [transforms, boxes, names]).then(TupleUtils.getTuple2First)
	}, state)
}

let _handleRangeRepel = (state: state, computeDirectionFunc, usedGirl, rangeBox): Promise<state> => {
	let weaponValue = _getWeaponValue(state, usedGirl, getCurrentAnimationName(state, usedGirl), rangePhase.Range)

	let damagePosition = NullableUtils.return_(rangeBox.getCenter(new Vector3()))

	// let fromCamp = getCampExn(state, getName())

	return ArrayUtils.reducePromise(_queryRangeCollisionByBox(state, usedGirl, rangeBox), (state, damageData) => {
		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

		if (transforms.length == 0) {
			return Promise.resolve(state)
		}

		return ArrayUtils.reducePromise(transforms, (state, transform, i) => {
			let box = boxes[i]
			let name = names[i]

			let distance = computeDistance(state, buildNameByUsedGirl(usedGirl), getGirlBox(state, usedGirl), name, box)

			if (distance == 0) {
				return Promise.resolve(state)
			}

			let forceDirection = computeDirectionFunc(state, box)

			return handleRepel(state, forceDirection, distance, 1000, [transform, box, name])
				.then(state => {
					if (weaponValue.force > 0
						|| _isNotDamage(weaponValue.force)
					) {
						// let force
						// if (getCampExn(state, names[0]) == fromCamp) {
						// 	force = 0
						// }
						// else {
						// 	force = weaponValue.force
						// }

						// return damageWithSingleData(state, [[force, forceDirection], [damageType.Range, getGirlWeaponType()]], weaponValue, getName(),
						// 	damagePosition,
						// 	[transform, box, name])
						// 	.then(TupleUtils.getTuple2First)

						return damageWithSingleData(state, [[weaponValue.force, forceDirection], [damageType.Range, getGirlWeaponType()]], weaponValue, buildNameByUsedGirl(usedGirl),
							damagePosition,
							[transform, box, name])
							.then(TupleUtils.getTuple2First)
					}

					return state
				})
		}, state)
	}, state)
}

let _handleDamage = (state, usedGirl, damageData, [weaponValue, forceDirection], damageType_) => {
	if (!NullableUtils.isNullable(damageData)) {
		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

		// let value = getValue(state)

		if (transforms.length == 0 || _isNotDamage(weaponValue.force)) {
			return Promise.resolve([state, []])
		}

		let fromCamp = getCampExn(state, buildNameByUsedGirl(usedGirl))

		if (transforms.length == 1) {
			let force
			if (getCampExn(state, names[0]) == fromCamp) {
				force = _getFriendForce(state, weaponValue)
			}
			else {
				force = weaponValue.force
			}

			return damageWithSingleData(state, [[force, forceDirection], [damageType_, getGirlWeaponType()]], weaponValue, buildNameByUsedGirl(usedGirl),
				NullableUtils.getEmpty(),
				[transforms[0], boxes[0], names[0]])
			// return damageWithSingleData(state, [[weaponValue.force, forceDirection], [damageType_, getGirlWeaponType()]], weaponValue, getName(),
			// 	NullableUtils.getEmpty(),
			// 	[transforms[0], boxes[0], names[0]])
		}

		let [newTransforms, newBoxes, newNames] = names.reduce(([newTransforms, newBoxes, newNames], name, i) => {
			return [
				ArrayUtils.push(newTransforms, transforms[i]),
				ArrayUtils.push(newBoxes, boxes[i]),
				ArrayUtils.push(newNames, name),
			]
		}, [[], [], []])


		let [enemyCampData, friendCampData] = _splitByCamp(state, fromCamp, [newTransforms, newBoxes, newNames])

		return _damageWithMultipleData(state, usedGirl, _getFriendForce(state, weaponValue), weaponValue, forceDirection, damageType_, NullableUtils.getEmpty(), friendCampData).then(TupleUtils.getTuple2First).then(state => {
			return _damageWithMultipleData(state, usedGirl, weaponValue.force, weaponValue, forceDirection, damageType_, NullableUtils.getEmpty(), enemyCampData)
		})
		// return _damageWithMultipleData(state, weaponValue.force, weaponValue, forceDirection, damageType_, NullableUtils.getEmpty(), [newTransforms, newBoxes, newNames])
	}

	return Promise.resolve([state, []])
}

let _isDamage = (damageMap, name, phase) => {
	let value = damageMap.get(name)
	if (NullableUtils.isNullable(value)) {
		return false
	}

	return value.get(phase) === true
}

let _markDamage = (damageMap, name, phase) => {
	let value = damageMap.get(name)
	if (NullableUtils.isNullable(value)) {
		value = Map()
		// return damageMap.set(name, Map().set(phase, true))
	}

	return damageMap.set(name, value.set(phase, true))
}

let _handleCollisionData = (data: Array<[Array<Matrix4>, Array<Box3>, Array<string>]>,
	handleLODContainerDataFunc,
) => {
	return data.map(([transforms, boxes, names]) => {
		let data = boxes.reduce<[Array<Matrix4>, Array<Box3>, Array<string>]>(([newTransforms, newBoxes, newNames], box, i) => {
			return handleLODContainerDataFunc([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i)
		}, [[], [], []])

		if (data[0].length == 0) {
			return NullableUtils.getEmpty()
		}

		return NullableUtils.return_(
			data
		)
	}).filter((damageData) => {
		return !NullableUtils.isNullable(damageData)
	}) as any
}

let _queryRangeCollisionByBox = (state: state, usedGirl, box: Box3) => {
	// let isAllowFriendDamage = getIsAllowFriendDamage(state)
	let camp = getCampExn(state, buildNameByUsedGirl(usedGirl))

	let isCanDamageLittleMan_ = isCanDamageLittleMan(state, camp)

	if (getIsOnlyDamageLittleMan(state, usedGirl)
		&& isCanDamageLittleMan_
	) {
		return getCollisionResultWithLittleMan(state, box)
	}

	return Collision.queryRangeCollisionByBox(getAbstractState(state), getCampExn, state,
		getAllArmyContainers(state),
		// box, getCampExn(state, getName())).concat(
		box,
		// isAllowFriendDamage ? NullableUtils.getEmpty() : NullableUtils.return_(
		// 	camp
		// )
		NullableUtils.getEmpty()
	).concat(
		// getCollisionResultWithLittleMan(state, box)
		isCanDamageLittleMan_ ? getCollisionResultWithLittleMan(state, box) : []
	)
}

export let queryBoxShapeCollision = (shape: Box3, state: state, usedGirl): Array<nullable<[Array<Matrix4>, Array<Box3>, Array<string>]>> => {
	return _handleCollisionData(_queryRangeCollisionByBox(state, usedGirl, shape),
		([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i) => {
			if (shape.intersectsBox(box)) {
				return [
					ArrayUtils.push(newTransforms, transforms[i]),
					ArrayUtils.push(newBoxes, box),
					ArrayUtils.push(newNames, names[i]),
				]
			}

			return [newTransforms, newBoxes, newNames]
		}
	)
}

// export let queryOBBShapeCollision = (shape: OBB, state: state): Array<nullable<[StaticLODContainer, [Array<Matrix4>, Array<Box3>, Array<string>]]>> => {
export let queryOBBShapeCollision = (shape: OBB, state: state, usedGirl): Array<nullable<[Array<Matrix4>, Array<Box3>, Array<string>]>> => {
	return _handleCollisionData(_queryRangeCollisionByBox(state, usedGirl, shape.toBox3()),
		([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i) => {
			if (shape.intersectsBox3(box)) {
				return [
					ArrayUtils.push(newTransforms, transforms[i]),
					ArrayUtils.push(newBoxes, box),
					ArrayUtils.push(newNames, names[i]),
				]
			}

			return [newTransforms, newBoxes, newNames]
		}
	)
}

let _removeCollisionedOnes = (isComputeDamageMap, data, phase) => {
	// let mutableMap = isComputeStompDamageMap.toObject()
	let map = isComputeDamageMap

	let newData = _handleCollisionData(data,
		([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i) => {
			let name = names[i]
			if (_isDamage(map, name, phase)) {
				return [newTransforms, newBoxes, newNames]
			}

			return [
				ArrayUtils.push(newTransforms, transforms[i]),
				ArrayUtils.push(newBoxes, box),
				ArrayUtils.push(newNames, name),
			]

		}
	)

	// return [
	//     map,
	//     newData
	// ]
	return newData
}

let _updateShapeCollision = (state, usedGirl, collisionData, isComputeDamageMap, phase, weaponValueData, damageType_) => {
	// let collisionData = queryOBBShapeCollision(shape, state)
	// let remainCollisionData = _removeCollisionedOnes(isComputeDamageMap, collisionData, phase)

	return ArrayUtils.reducePromise(collisionData, ([state, isComputeDamageMap], damageData) => {
		return _handleDamage(state, usedGirl, damageData, weaponValueData, damageType_).then(data => {
			state = data[0]
			let damageNames = data[1]

			isComputeDamageMap = damageNames.reduce((isComputeDamageMap, name) => {
				return _markDamage(isComputeDamageMap, name, phase)
			}, isComputeDamageMap)

			return [state, isComputeDamageMap]
		})
	}, [state, isComputeDamageMap])
}

// let _getMinScaleAsSmallGiantess = () => getValue(state).minScaleAsSmallGiantess

let _addDirectionScalar = (currentPose: pose, center: Vector3, direction, directionScalar: directionScalar<pose>) => {
	// return directionScalar.filter((d) => {
	// 	return d.pose == currentPose || d.pose == pose.All
	// }).reduce((dir, { value }) => {
	// 	return dir.add(direction.clone().multiplyScalar(value))
	// }, center)

	if (directionScalar.length == 0) {
		return center
	}

	let d = directionScalar.find((d) => {
		return d.pose == currentPose
	})

	let value
	if (!NullableUtils.isNullable(d)) {
		value = NullableUtils.getExn(d).value
	}
	else {
		d = directionScalar.find((d) => {
			return d.pose == pose.All
		})

		if (!NullableUtils.isNullable(d)) {
			value = NullableUtils.getExn(d).value
		}
		else {
			return center
		}
	}

	return center.add(direction.clone().multiplyScalar(value))
}


let _getSize = (currentPose: pose, size: sizeData<pose>): [number, number, number] => {
	// return ArrayUtils.getExn(size.filter((data) => {
	// 	return data.pose == currentPose || data.pose == pose.All
	// }), 0).value


	let { value } = NullableUtils.getWithDefaultFunc(
		size.find((data) => {
			return data.pose == currentPose
		}),
		() => NullableUtils.getWithDefaultFunc(size.find((data) => {
			return data.pose == pose.All
		}),
			() => size.find((data) => {
				return data.pose == pose.Stand
			})
		),
	)

	return value
}

let _getQuaternion = (state, usedGirl, rotation, isUseGirlRotation, bone) => {
	let quat
	if (isUseGirlRotation) {
		quat = getGirlRotation(state, usedGirl).clone()
	}
	else {
		quat = bone.getWorldQuaternion(_q)
	}

	if (!ArrayUtils.isArraysEqual(rotation, [0, 0, 0])) {
		return TransformUtils.rotate(
			quat,
			new Euler(...rotation)
		)
	}

	return quat
}

// let _handleSpeciallyCaseForOneBone = (currentMMDCharacterName, boneName, collisionPart_) => {
// 	switch (currentMMDCharacterName) {
// 		case getCimingName():
// 		case getLipusiName():
// 			if (NullableUtils.isNullable(boneName)) {
// 				switch (collisionPart_) {
// 					case collisionPart.RightFoot:
// 						return "右足首"
// 					case collisionPart.LeftFoot:
// 						return "左足首"
// 					default:
// 						throw new Error(`error, collisionPart_: ${collisionPart_}`)
// 				}
// 			}

// 			return boneName
// 		case getSunxiaomeiName():
// 			if (NullableUtils.isNullable(boneName)) {
// 				switch (collisionPart_) {
// 					case collisionPart.RightFoot:
// 						return "右足ＩＫ"
// 					case collisionPart.LeftFoot:
// 						return "左足ＩＫ"
// 					default:
// 						throw new Error(`error, collisionPart_: ${collisionPart_}`)
// 				}
// 			}

// 			return boneName
// 		default:
// 			return boneName
// 	}
// }

export let updateAllCollisionShapes = (state, usedGirl, girl): state => {
	let girlRotation = getGirlRotation(state, usedGirl)
	let girlScale = getGirlScale(state, usedGirl)

	let xAxis = new Vector3(1, 0, 0)
	let yAxis = new Vector3(0, 1, 0)
	let zAxis = new Vector3(0, 0, 1)

	let frontDirection = new Vector3(0, 0, 1).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let rightDirection = new Vector3(1, 0, 0).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let upDirection = new Vector3(0, 1, 0).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let currentMMDCharacterName = getCurrentMMDCharacterName(state, usedGirl)

	let { currentPose } = getUsedGirlData(state, usedGirl)

	// let sizeFactor = getCapsuleRadiusForCompute(getUsedGirlData(state, usedGirl).capsule) * 0.5
	// let sizeFactor = collisionShapeMap.get(collisionPart.Head).halfSize.x
	let sizeFactor = getBoxSizeForCompute(state, usedGirl) * 0.5


	return getCollisionShapeData(state).filter(data => {
		return data.mmds.includes(currentMMDCharacterName)
	}).reduce((state, data) => {
		if (!NullableUtils.isNullable(data.twoBones)) {
			let {
				bone1Name,
				bone2Name,

				centerFactor,
				frontDirectionScalar = [],
				rightDirectionScalar = [],
				upDirectionScalar = [],

				size,

				isUseGirlRotation,
				rotation = [0, 0, 0]
				// rotationOffset = 0,
				// rotationAxis = axis.X,
			} = NullableUtils.getExn(data.twoBones)

			return _updateCollisionOBBShape(state,
				[
					center => {
						center = _addDirectionScalar(currentPose, center, frontDirection, frontDirectionScalar)
						center = _addDirectionScalar(currentPose, center, rightDirection, rightDirectionScalar)
						center = _addDirectionScalar(currentPose, center, upDirection, upDirectionScalar)

						return center
					},
					(state, bone1, bone2) => {
						return _getQuaternion(state, usedGirl, rotation, isUseGirlRotation, bone2)
					}],
				usedGirl,
				girl, bone1Name, bone2Name, data.collisionPart,
				centerFactor,
				new Vector3().fromArray(_getSize(currentPose, size)).multiplyScalar(sizeFactor)
			)
		}

		let {
			boneName,

			frontDirectionScalar = [],
			rightDirectionScalar = [],
			upDirectionScalar = [],

			size,

			isUseGirlRotation = false,
			rotation = [0, 0, 0]
		} = NullableUtils.getExn(data.oneBone)

		// boneName = _handleSpeciallyCaseForOneBone(currentMMDCharacterName, boneName, data.collisionPart)

		return _updateCollisionOBBShapeByOneBone(state,
			[
				center => {
					center = _addDirectionScalar(currentPose, center, frontDirection, frontDirectionScalar)
					center = _addDirectionScalar(currentPose, center, rightDirection, rightDirectionScalar)
					center = _addDirectionScalar(currentPose, center, upDirection, upDirectionScalar)

					return center
				},
				(state, bone1) => {
					return _getQuaternion(state, usedGirl, rotation, isUseGirlRotation, bone1)
				}
			],
			usedGirl,
			girl, boneName, data.collisionPart,
			new Vector3().fromArray(_getSize(currentPose, size)).multiplyScalar(sizeFactor)
		)

	}, state)
}

export let getAnimationCollisionDataParam = () => {
	return [
		_isCollisionWithRigidBody,
		_isCollisionWithCharacter,
		state => {
			// return getGirlScale(state, usedGirl) >= getValue(state).minScaleAsSmallGiantess
			return true
		},
		(state, usedGirl) => {
			// return getGirlScale(state, usedGirl) >= getValue(state).minScaleAsMiddleGiantess
			return isMiddleGiantess(state, usedGirl) || isBigGiantess(state, usedGirl)
		},
		(state, usedGirl, collisionPart) => {
			return getCollisionPartOBB(state, usedGirl, collisionPart)
		},
		getScale,
		getActualHeight,
		isLittleCharacterType
	]
}

export let getAnimationCollisionData = (state) => {
	return Data.getAnimationCollisionData(
		state,
		getAnimationCollisionDataParam() as any,
	)
}

let _getPickObjectCollisionData = (state: state, usedGirl, isComputeActionDamageMap, phase) => {
	let handBox = getHandBox(state, usedGirl)
	let pickObjectData = getPickObjectData(state, usedGirl).filter(d => {
		return !_isDamage(isComputeActionDamageMap, d.name, phase) && !NullableUtils.isNullable(d.getLocalTransformFunc(state, d.queue, d.index, d.name))
	})

	return [[
		pickObjectData.map(d => {
			// if (_isDamage(isComputeActionDamageMap, d.name, phase)) {
			// 	return null
			// }

			// let queue = NullableUtils.getExn(d.queue)
			// let index = d.index

			// return queue.getTransform(index)
			return d.getTransformFunc(
				state,
				usedGirl,
				// d.getLocalTransformFunc(state, d.queue, d.index, d.name),
				handBox,
				d.name
			)
		}).toArray(),
		pickObjectData.map(d => {
			// if (_isDamage(isComputeActionDamageMap, d.name, phase)) {
			// 	return null
			// }

			// let queue = NullableUtils.getExn(d.queue)
			// let index = d.index

			// return queue.getBox(index)
			return d.getBoxFunc(state, d.queue, d.index, d.name)
		}).toArray(),
		pickObjectData.map(d => {
			// if (_isDamage(isComputeActionDamageMap, d.name, phase)) {
			// 	return null
			// }

			return d.name
		}).toArray(),
	]]
}


let _computeCollisionData = (state, usedGirl, collisionPart_, name: animationName, isComputeActionDamageMap, phase) => {
	let collisionData
	switch (name) {
		case animationName.Eat:
		case animationName.Pinch:
			// return expandOBB(obb.clone(), 2)
			// return ArrayUtils.groupByStep(
			// 	getPickObjectData(state, usedGirl).map(d => {
			// 		let queue = NullableUtils.getExn(d.queue)
			// 		let index = d.index

			// 		return [
			// 			queue.getTransform(index),
			// 			queue.getBox(index),
			// 			d.name
			// 		]
			// 	}).toArray(),
			// 	3
			// )
			collisionData = _getPickObjectCollisionData(state, usedGirl, isComputeActionDamageMap, phase)
			break
		default:
			let obb = getCollisionPartOBB(state, usedGirl, collisionPart_)

			collisionData = queryOBBShapeCollision(obb, state, usedGirl)
			break
	}

	return _removeCollisionedOnes(isComputeActionDamageMap, collisionData, phase)
}

export let updateAnimationCollision = (state: state, usedGirl, velocity) => {
	let { currentAnimationName } = getUsedGirlData(state, usedGirl)

	let girl = getGirl(state, usedGirl)
	let girlMesh = getGirlMesh(state, usedGirl)

	state = updateAllCollisionShapes(state, usedGirl, girl)

	return NullableUtils.getWithDefault(
		NullableUtils.map(
			({ name, shapeDamage, timeline }) => {
				let frameCount = getAnimationFrameCount(state, name)

				let frameIndex = SkinAnimation.getFrameIndex(
					MMD.findAnimationAction(getAbstractState(state), usedGirl, girlMesh, name),
					frameCount
				)

				state = _resetActionCollision(state, usedGirl, name, frameIndex,
				)


				state = setUsedGirlData(state, usedGirl, {
					...getUsedGirlData(state, usedGirl),
					lastFrameIndexMap: getUsedGirlData(state, usedGirl).lastFrameIndexMap.set(name, frameIndex)
				})


				// if (!isCompletelyPlayingAnimation(state, name)) {
				// 	return Promise.resolve(state)
				// }


				let phase = _getPhase(state, name, frameIndex)

				if (phase == otherPhase.EmptyPhase) {
					return Promise.resolve(state)
				}

				let weaponValueData = _getWeaponValueData(state, usedGirl, name, velocity, phase)
				let force = [weaponValueData[0].force, weaponValueData[1]] as force

				let damageType_ = _getDamageType(state, usedGirl, phase, name)


				let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

				return ArrayUtils.reducePromise<state, collisionPart>(shapeDamage, (state, collisionPart_: collisionPart) => {
					let { isComputeDamageMap } = getUsedGirlData(state, usedGirl)

					let isComputeActionDamageMap = NullableUtils.getWithDefault(
						isComputeDamageMap.get(name),
						Map()
					)

					return _updateShapeCollision(state, usedGirl, _computeCollisionData(state, usedGirl, collisionPart_, name, isComputeActionDamageMap, phase), isComputeActionDamageMap, phase, weaponValueData, damageType_).then(data => {
						state = data[0]
						isComputeActionDamageMap = data[1]

						state = setUsedGirlData(state, usedGirl, {
							...getUsedGirlData(state, usedGirl),
							isComputeDamageMap: isComputeDamageMap.set(name, isComputeActionDamageMap)
						})

						return state
					})
				}, state).then(state => {
					return ArrayUtils.reducePromise(timeline, (state, data, i) => {
						let frameIndices: Array<frameIndex>, frameRange
						if (!NullableUtils.isNullable(data.frameIndex)) {
							frameIndices = [NullableUtils.getExn(data.frameIndex)]
						}
						else {
							frameIndices = NullableUtils.getExn(data.frameIndices)
						}

						frameRange = data.frameRange

						let { isComputeCollisionMap } = getUsedGirlData(state, usedGirl)
						let map = NullableUtils.getWithDefault(
							isComputeCollisionMap.get(i),
							Map()
						)

						return ArrayUtils.reducePromise(frameIndices, (state, targetFrameIndex) => {
							// requireCheck(() => {
							// 	test("targetFrameIndex shouldn't be frame index used for reset", () => {
							// 		return !_isFrameIndexUsedForReset(targetFrameIndex)
							// 	})
							// }, getIsDebug(state))

							let valueData = {
								frameIndex: targetFrameIndex,
								animationName: name,
								phase: phase,
								force
							}

							let promise
							if (isSpecificFrameIndex(state, frameIndex, targetFrameIndex, frameRange, frameCount)) {
								if (map.get(targetFrameIndex) !== true) {
									map = map.set(targetFrameIndex, true)

									switch (data.track) {
										case track.Audio:
											state = NullableUtils.getWithDefault(
												NullableUtils.map(({ id, volume, isLoop, isStop }) => {
													// let volume = getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl))

													if (isStop === true) {
														return setAbstractState(state, SoundManager.stop(getAbstractState(state), id))
													}

													return NullableUtils.getWithDefault(NullableUtils.map(id => {
														return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(id, getIsDebug(state), volume, NullableUtils.getWithDefault(
															isLoop,
															false
														))))
													}, id),
														state)
												}, data.value<{ id: string, volume: number, isLoop?: boolean, isStop?: boolean, }>(state, usedGirl, valueData)),
												state
											)

											promise = Promise.resolve(state)
											break
										case track.Effect:
											state = NullableUtils.getWithDefault(
												NullableUtils.map(
													effect_ => {
														return _execEffect(state, effect_)
													},
													data.value<effect>(state, usedGirl, valueData)
												),
												state
											)
											promise = Promise.resolve(state)
											break
										case track.Particle:
											state = NullableUtils.getWithDefault(
												NullableUtils.map(
													data => {
														return _emitParticle(state, data)
													},
													data.value<Array<[
														particle,
														any
													]>>(state, usedGirl, valueData)
												),
												state
											)
											promise = Promise.resolve(state)
											break
										case track.RangeDamage:
											promise = NullableUtils.getWithDefault(
												NullableUtils.map(
													rangeBox => {
														return _damageInRange(state, usedGirl, velocity, rangeBox)
													},
													data.value<Box3>(state, usedGirl, valueData)
												),
												Promise.resolve(state)
											)
											break
										case track.RangeRepel:
											promise = NullableUtils.getWithDefault(
												NullableUtils.map(
													([computeDirectionFunc, rangeBox]) => {
														return _handleRangeRepel(state, computeDirectionFunc, usedGirl, rangeBox)
													},
													data.value<[computeDirectionFunc, Box3]>(state, usedGirl, valueData)
												),
												Promise.resolve(state)
											)
											break
										case track.Event:
											let { eventName, eventData } = data.value<{
												eventName: eventName,
												eventData: any
											}>(state, usedGirl, valueData)

											promise = Event.trigger<state>(state, getAbstractState, eventName, eventData)
											break
										default:
											throw new Error("err")
									}
								}
								else {
									promise = Promise.resolve(state)
								}
							}
							else {
								promise = Promise.resolve(state)
							}

							return promise
						}, state).then(state => {
							return setUsedGirlData(state, usedGirl, {
								...getUsedGirlData(state, usedGirl),
								isComputeCollisionMap: isComputeCollisionMap.set(i, map)
							})
						})
					}, state)
				})

			},
			getConfigData(state).animationCollisionData.find(data => {
				return data.name == currentAnimationName
			}),
		),
		Promise.resolve(state)
	)
}

export let isCollisionWithGirlBox = (
	state: state,
	usedGirl,
	box: Box3
): nullable<collisionPart> => {
	// let girlBox = getGirlBox(state, usedGirl).clone()
	let girlBox = getBigGirlBox(state, usedGirl)

	if (girlBox.intersectsBox(box)) {
		return NullableUtils.return_(collisionPart.BoundingBox)
	}

	return NullableUtils.getEmpty()
}

export let queryOBBShapeCollisionWithBox = (
	state: state,
	usedGirl,
	box: Box3, boxPositionVec,
	isCheckGirlBox = true,
	filterCollisionShapesFunc = data => data,
)
	// : [nullable<Matrix4>, nullable<Box3>, nullable<string>] => {
	: nullable<collisionPart> => {
	if (!isVeryNearGirl(state, boxPositionVec)) {
		return NullableUtils.getEmpty()
	}


	// let girlBox = getGirlBox(state, usedGirl).clone()

	// let size = girlBox.getSize(_v1)

	// girlBox = girlBox.expandByVector(_v2.set(size.x / 2, 0, size.z / 2))


	if (isCheckGirlBox && !getBigGirlBox(state, usedGirl).intersectsBox(box)) {
		// return [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
		return NullableUtils.getEmpty()
	}


	let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

	return collisionShapeMap.entrySeq().toArray().filter(filterCollisionShapesFunc).reduce((result, [collisionPart, shape]) => {
		if (
			!NullableUtils.isNullable(result)
			// || !shape.toBox3().containsPoint(point)
			|| !shape.intersectsBox3(box)
		) {
			return result
		}

		return NullableUtils.return_(collisionPart)

		// }, [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()])
	}, NullableUtils.getEmpty<collisionPart>())
}

export let queryAllOBBShapesCollisionWithBox = (
	state: state,
	usedGirl,
	box: Box3, boxPositionVec,
	isCheckGirlBox = true
): Array<collisionPart> => {
	if (!isVeryNearGirl(state, boxPositionVec)) {
		return []
	}


	// let girlBox = getGirlBox(state, usedGirl).clone()

	// let size = girlBox.getSize(_v1)

	// girlBox = girlBox.expandByVector(_v2.set(size.x / 2, 0, size.z / 2))


	if (isCheckGirlBox && !getBigGirlBox(state, usedGirl).intersectsBox(box)) {
		// return [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
		return []
	}


	let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

	return collisionShapeMap.entrySeq().toArray().reduce((result, [collisionPart, shape]) => {
		if (
			// !NullableUtils.isNullable(result)
			!shape.intersectsBox3(box)
		) {
			return result
		}

		return ArrayUtils.push(result, collisionPart)
	}, [])
}

export let queryAllOBBShapesCollisionWithRay = (
	state: state,
	usedGirl,
	ray: Ray,
	isCheckGirlBox = true
): Array<[Vector3, collisionPart]> => {
	if (isCheckGirlBox && !ray.intersectsBox(getBigGirlBox(state, usedGirl))) {
		return []
	}

	let { collisionShapeMap } = getUsedGirlData(state, usedGirl)

	return collisionShapeMap.entrySeq().toArray().reduce((result, [collisionPart, shape]) => {
		return NullableUtils.getWithDefault(
			NullableUtils.map(
				([hitPoint, _]) => {
					return ArrayUtils.push(result, [hitPoint.clone(), collisionPart])
				}, shape.intersectRay(ray, [_v1, _v2])
			),
			result
		)
	}, [])
}

export let getCollisionPartCenter = (state, usedGirl, collisionPart_) => {
	// return ensureCheck(getCollisionPartOBB(state, usedGirl, collisionPart_).center, (r) => {
	// 	test("shouldn't be zero point", () => {
	// 		return r.x != 0 && r.y != 0 && r.z != 0
	// 	})
	// }, getIsDebug(state))
	return getCollisionPartOBB(state, usedGirl, collisionPart_).center
}

export let getCollisionPartOBB = (state: state, usedGirl, collisionPart_) => {
	return NullableUtils.getExn(getUsedGirlData(state, usedGirl).collisionShapeMap.get(collisionPart_) as OBB)
}

export let hasCollisionPartOBB = (state: state, usedGirl) => {
	return getUsedGirlData(state, usedGirl).collisionShapeMap.has(collisionPart.Head)
}

export let setGetCenterFunc = (state, func, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		getCenterFunc: NullableUtils.return_(func)
	})
}

export let removeGetCenterFunc = (state, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		getCenterFunc: NullableUtils.getEmpty()
	})
}