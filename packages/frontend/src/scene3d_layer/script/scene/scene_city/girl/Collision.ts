import { state } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCurrentMMDCharacterName, getGirl, getGirlMesh, getGirlState, getIsOnlyDamageLittleMan, getName, getValue, setGirlState } from "./Girl"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { getRootMotionData } from "../data/RootMotionData"
import { isCompletelyPlayingAnimation } from "./Animation"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAnimationFrameCount } from "../data/Const"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getBoxSizeForCompute, getGirlBox, getGirlPosition, getGirlRotation, getActualHeight, getScale, getGirlWeaponType } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { getConfigData, getGirlScale, getOrbitControlsTarget, isLittleRoad } from "../CityScene"
import { animationName, effect, frameIndex, particle, track } from "../data/DataType"
import { breastPressPhase, collisionPart, crawlMovePhase, damageType, force, otherPhase, pose, runPhase, standToCrawlPhase, stompPhase, walkPhase } from "../type/StateType"
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
import { eventName } from "meta3d-jiehuo-abstract/src/type/StateType"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { LODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/LODContainer"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { axis, directionScalar, getData, sizeData } from "../data/CollisionShapeData"
import { isNearGirl, isSpecificFrameIndex } from "../utils/CollisionUtils"
import { damageWithData } from "../utils/DamageUtils"
import { getGirlVolume } from "../utils/SoundUtils"
import { getBone } from "../utils/MMDUtils"
import { getCollisionResultWithLittleMan } from "../little_man/Collision"
import { screenShake } from "../utils/EffectUtils"
import { weaponType } from "../data/ValueType"

const _q = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getPhase = (state: state, animationName_: animationName, frameIndex) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(
			data => {
				return data.value.filter(v => {
					return NumberUtils.between(frameIndex, v.frameIndexRange[0], v.frameIndexRange[1])
				}).map(v => {
					return v.phase
				})[0]
			},
			getConfigData(state).phaseData.find(data => {
				return data.name == animationName_
			})),
		otherPhase.None
	)
}

// let _screenShake = (state: state) => {
// 	getGirlState(state).screenShake.shake(getOrbitControlsTarget(state), getValue(state).screenShakeDistanceFactor * Math.pow(getScale(state), 1.0), getValue(state).screenShakeTime)

// 	return state
// }

let _isCollisionWithObject = (isObjectFunc, state, animationName, phase: walkPhase) => {
	let { isComputeDamageMap } = getGirlState(state)

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

let _isCollisionWithVehicle = (state, animationName, phase) => {
	return _isCollisionWithObject(name => {
		return Cars.isCars(name) || DynamicCars.isDynamicCar(name) || MilltaryVehicle.isMilltaryVechile(name)
	}, state, animationName, phase)
}

let _isCollisionWithCharacter = (state, animationName, phase) => {
	return _isCollisionWithObject(name => {
		return Citiyzen.isCityzen(name) || Soldier.isSoldier(name)
	}, state, animationName, phase)
}

export let computeDamageTypeDefault = (state, animationName_, phase) => {
	switch (animationName_) {
		case animationName.Walk:
			return phase == walkPhase.LeftFootDown || phase == walkPhase.RightFootDown ? damageType.Direct : damageType.Normal
		case animationName.Run:
			return phase == runPhase.LeftFootDown || phase == runPhase.RightFootDown ? damageType.Direct : damageType.Normal
		case animationName.Stomp:
			return phase == stompPhase.Down ? damageType.Direct : damageType.Normal


		case animationName.CrawlMove:
			return phase == crawlMovePhase.Down ? damageType.Direct : damageType.Normal

		// case animationName.StandToCrawl:
		// case animationName.CrawlToStand:
		default:
			return damageType.Direct
	}
}

let _getDamageType = (state: state, phase, animationName_) => {
	return getGirlState(state).computeDamageTypeFunc(state, animationName_, phase)
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
			default:
				throw new Error("err")
		}

		return state
	}, state)
}


let _updateCollisionOBBShape = (state: state,
	[getCenterFunc, getWorldQuaternionFunc],
	girl, bone1Name, bone2Name, collisionPart_: collisionPart,
	centerFactor,
	size
) => {
	let data1 = getBone(state, girl, bone1Name)
	state = data1[0]
	let bone1 = data1[1]

	let data2 = getBone(state, girl, bone2Name)
	state = data2[0]
	let bone2 = data2[1]


	let w1 = bone1.getWorldPosition(_v1)
	let w2 = bone2.getWorldPosition(_v2)
	let center = NullableUtils.getWithDefault(
		NullableUtils.bind(getCenterFunc => {
			return getCenterFunc(collisionPart_)
		}, getGirlState(state).getCenterFunc),
		getCenterFunc(w1.add(
			w2.sub(w1).multiplyScalar(centerFactor)
		).clone())

	)


	// let center = w1.add(
	// 	w2.sub(w1).multiplyScalar(centerFactor)
	// ).clone()
	// let quat = bone2.getWorldQuaternion(_q)
	let quat = getWorldQuaternionFunc(state, bone1, bone2)

	Collision.updateOBB(NullableUtils.getExn(getCollisionPartOBB(state, collisionPart_)), center, quat, size)

	return state
}

let _updateCollisionOBBShapeByOneBone = (state: state,
	[getCenterFunc, getWorldQuaternionFunc],
	girl, bone1Name, collisionPart_: collisionPart,
	size
) => {
	let data1 = getBone(state, girl, bone1Name)
	state = data1[0]
	let bone1 = data1[1]

	let center = NullableUtils.getWithDefault(
		NullableUtils.bind(getCenterFunc => {
			return getCenterFunc(collisionPart_)
		}, getGirlState(state).getCenterFunc),
		getCenterFunc(bone1.getWorldPosition(_v1).clone())
	)

	// let center = w1.add(
	// 	w2.sub(w1).multiplyScalar(centerFactor)
	// ).clone()
	// let quat = bone1.getWorldQuaternion(_q)
	let quat = getWorldQuaternionFunc(state, bone1)

	Collision.updateOBB(NullableUtils.getExn(getCollisionPartOBB(state, collisionPart_) as OBB), center, quat, size)

	return state
}

// let _isFrameIndexUsedForReset = (frameIndex) => {
// 	return frameIndex == 0 || frameIndex == 1
// }

let _resetActionCollision = (state: state, name, frameIndex) => {
	let { isComputeCollisionMap, isComputeDamageMap, lastFrameIndexMap } = getGirlState(state)

	// if (_isFrameIndexUsedForReset(frameIndex)) {
	if (frameIndex < NullableUtils.getWithDefault(
		lastFrameIndexMap.get(name),
		10000
	)) {
		isComputeCollisionMap = Map()
		isComputeDamageMap = Map()
	}

	state = setGirlState(state, {
		...getGirlState(state),
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

export let computeForce = (state: state, actionForce) => {
	return actionForce * getActualHeight(state)
}

export let computeForceDirectionDefault = (state: state, animationName_: animationName, velocity: Vector3, phase) => {
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
		case animationName.Stomp:
			switch (phase) {
				case stompPhase.Up:
					direction = buildUpDirection()
					break
				case stompPhase.Down:
					direction = buildDownDirection()
					break
				case stompPhase.Range:
					direction = buildDownDirection()
					break
			}
			break

		case animationName.StandToCrawl:
			direction = buildDownDirection()
			break
		case animationName.CrawlToStand:
			direction = buildRandomDirectionInXZ()
			break
		case animationName.BreastPress:
			switch (phase) {
				case breastPressPhase.Up:
					direction = buildUpDirection()
					break
				case breastPressPhase.Down:
					direction = buildDownDirection()
					break
			}
			break
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
			direction = buildRandomDirectionInXZ()
			break

	}

	return direction
}

let _computeForce = (state: state, animationName_: animationName, velocity: Vector3, phase): force => {
	let direction

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

	direction = getGirlState(state).computeForceDirectionFunc(state, animationName_, velocity, phase)

	return [computeForce(state, actionForce), direction]
}

let _damageInRange = (state: state, velocity, rangeBox): Promise<state> => {
	let force = _computeForce(state, animationName.Stomp, velocity, stompPhase.Range)

	return ArrayUtils.reducePromise(_queryRangeCollisionByBox(state, rangeBox), (state, damageData) => {
		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

		if (transforms.length == 0) {
			return Promise.resolve(state)
		}

		return damageWithData(state, [force, [damageType.Range, getGirlWeaponType()]], getName(),
			NullableUtils.return_(rangeBox.getCenter(new Vector3())),
			[transforms, boxes, names]).then(TupleUtils.getTuple2First)
	}, state)
}

let _handleDamage = (state, damageData, force, damageType_) => {
	if (!NullableUtils.isNullable(damageData)) {
		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

		if (transforms.length == 0) {
			return Promise.resolve([state, []])
		}

		let [newTransforms, newBoxes, newNames] = names.reduce(([newTransforms, newBoxes, newNames], name, i) => {
			return [
				ArrayUtils.push(newTransforms, transforms[i]),
				ArrayUtils.push(newBoxes, boxes[i]),
				ArrayUtils.push(newNames, name),
			]
		}, [[], [], []])


		return damageWithData(state, [force, [damageType_, getGirlWeaponType()]], getName(),
			NullableUtils.getEmpty(),
			[newTransforms, newBoxes, newNames])
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

let _queryRangeCollisionByBox = (state: state, box: Box3) => {
	if (getIsOnlyDamageLittleMan(state)) {
		return getCollisionResultWithLittleMan(state, box)
	}

	return Collision.queryRangeCollisionByBox(getAbstractState(state), box).concat(
		getCollisionResultWithLittleMan(state, box)
	)
}


let _queryOBBShapeCollision = (shape: OBB, state: state): Array<nullable<[StaticLODContainer, [Array<Matrix4>, Array<Box3>, Array<string>]]>> => {
	return _handleCollisionData(_queryRangeCollisionByBox(state, shape.toBox3()),
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

let _updateShapeCollision = (state, shape, isComputeDamageMap, phase, force, damageType_) => {
	let collisionData = _queryOBBShapeCollision(shape, state)
	let remainCollisionData = _removeCollisionedOnes(isComputeDamageMap, collisionData, phase)

	return ArrayUtils.reducePromise(remainCollisionData, ([state, isComputeDamageMap], damageData) => {
		return _handleDamage(state, damageData, force, damageType_).then(data => {
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
		() => NullableUtils.getExn(size.find((data) => {
			return data.pose == pose.All
		})),
	)

	return value
}

let _getQuaternion = (state, rotation, isUseGirlRotation, bone) => {
	let quat
	if (isUseGirlRotation) {
		quat = getGirlRotation(state).clone()
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

export let updateAllCollisionShapes = (state, girl): state => {
	let girlRotation = getGirlRotation(state)
	let girlScale = getGirlScale(state)

	let xAxis = new Vector3(1, 0, 0)
	let yAxis = new Vector3(0, 1, 0)
	let zAxis = new Vector3(0, 0, 1)

	let frontDirection = new Vector3(0, 0, 1).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let rightDirection = new Vector3(1, 0, 0).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let upDirection = new Vector3(0, 1, 0).applyQuaternion(girlRotation).multiplyScalar(girlScale)
	let currentMMDCharacterName = getCurrentMMDCharacterName(state)

	let { currentPose } = getGirlState(state)

	// let sizeFactor = getCapsuleRadiusForCompute(getGirlState(state).capsule) * 0.5
	// let sizeFactor = collisionShapeMap.get(collisionPart.Head).halfSize.x
	let sizeFactor = getBoxSizeForCompute(state) * 0.5


	return getConfigData(state).collisionShapeData.filter(data => {
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
						return _getQuaternion(state, rotation, isUseGirlRotation, bone2)
					}],
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

		return _updateCollisionOBBShapeByOneBone(state,
			[
				center => {
					center = _addDirectionScalar(currentPose, center, frontDirection, frontDirectionScalar)
					center = _addDirectionScalar(currentPose, center, rightDirection, rightDirectionScalar)
					center = _addDirectionScalar(currentPose, center, upDirection, upDirectionScalar)

					return center
				},
				(state, bone1) => {
					return _getQuaternion(state, rotation, isUseGirlRotation, bone1)
				}
			],
			girl, boneName, data.collisionPart,
			new Vector3().fromArray(_getSize(currentPose, size)).multiplyScalar(sizeFactor)
		)

	}, state)
}

export let getAnimationCollisionDataParam = () => {
	return [
		_isCollisionWithVehicle,
		_isCollisionWithCharacter,
		state => {
			return getGirlScale(state) >= getValue(state).minScaleAsSmallGiantess
		},
		state => {
			return getGirlScale(state) >= getValue(state).minScaleAsMiddleGiantess
		},
		(state, collisionPart) => {
			return getCollisionPartOBB(state, collisionPart)
		},
		getScale,
		getActualHeight,
		isLittleRoad
	]
}

export let getAnimationCollisionData = () => {
	return Data.getAnimationCollisionData(
		getAnimationCollisionDataParam() as any
	)
}

export let updateAnimationCollision = (state: state, velocity) => {
	let { currentAnimationName } = getGirlState(state)

	let girl = getGirl(state)
	let girlMesh = getGirlMesh(state)

	state = updateAllCollisionShapes(state, girl)

	return NullableUtils.getWithDefault(
		NullableUtils.map(
			({ name, shapeDamage, timeline }) => {
				let frameCount = getAnimationFrameCount(state, name)

				let frameIndex = SkinAnimation.getFrameIndex(
					MMD.findAnimationAction(getAbstractState(state), girlMesh, name),
					frameCount
				)

				state = _resetActionCollision(state, name, frameIndex,
				)


				state = setGirlState(state, {
					...getGirlState(state),
					lastFrameIndexMap: getGirlState(state).lastFrameIndexMap.set(name, frameIndex)
				})


				// if (!isCompletelyPlayingAnimation(state, name)) {
				// 	return Promise.resolve(state)
				// }


				let phase = _getPhase(state, name, frameIndex)

				let force = _computeForce(state, name, velocity, phase)

				let damageType_ = _getDamageType(state, phase, name)


				let { collisionShapeMap } = getGirlState(state)

				return ArrayUtils.reducePromise<state, collisionPart>(shapeDamage, (state, collisionPart_: collisionPart) => {
					let { isComputeDamageMap } = getGirlState(state)

					let isComputeActionDamageMap = NullableUtils.getWithDefault(
						isComputeDamageMap.get(name),
						Map()
					)

					return _updateShapeCollision(state, getCollisionPartOBB(state, collisionPart_), isComputeActionDamageMap, phase, force, damageType_).then(data => {
						state = data[0]
						isComputeActionDamageMap = data[1]

						state = setGirlState(state, {
							...getGirlState(state),
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

						let { isComputeCollisionMap } = getGirlState(state)
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
												NullableUtils.map(soundId => {
													let volume = getGirlVolume(state)

													return NullableUtils.getWithDefault(NullableUtils.map(soundId => {
														return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), volume)))
													}, soundId),
														state)
												}, data.value<string>(state, valueData)),
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
													data.value<effect>(state, valueData)
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
													]>>(state, valueData)
												),
												state
											)
											promise = Promise.resolve(state)
											break
										case track.RangeDamage:
											promise = NullableUtils.getWithDefault(
												NullableUtils.map(
													rangeBox => {
														return _damageInRange(state, velocity, rangeBox)
													},
													data.value<Box3>(state, valueData)
												),
												Promise.resolve(state)
											)
											break
										case track.Event:
											let { eventName, eventData } = data.value<{
												eventName: eventName,
												eventData: any
											}>(state, valueData)

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
							return setGirlState(state, {
								...getGirlState(state),
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

export let queryAllOBBShapesCollisionWithBox = (
	state: state,
	box: Box3, boxPositionVec,
)
	// : [nullable<Matrix4>, nullable<Box3>, nullable<string>] => {
	: nullable<collisionPart> => {
	if (!isNearGirl(state, boxPositionVec)) {
		return NullableUtils.getEmpty()
	}


	let girlBox = getGirlBox(state).clone()

	let size = girlBox.getSize(_v1)

	girlBox = girlBox.expandByVector(_v2.set(size.x / 2, 0, size.z / 2))


	if (!girlBox.intersectsBox(box)) {
		// return [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
		return NullableUtils.getEmpty()
	}


	let { collisionShapeMap } = getGirlState(state)

	return collisionShapeMap.entrySeq().toArray().reduce((result, [collisionPart, shape]) => {
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

export let getCollisionPartCenter = (state, collisionPart_) => {
	// return ensureCheck(getCollisionPartOBB(state, collisionPart_).center, (r) => {
	// 	test("shouldn't be zero point", () => {
	// 		return r.x != 0 && r.y != 0 && r.z != 0
	// 	})
	// }, getIsDebug(state))
	return getCollisionPartOBB(state, collisionPart_).center
}

export let getCollisionPartOBB = (state: state, collisionPart_) => {
	return NullableUtils.getExn(getGirlState(state).collisionShapeMap.get(collisionPart_) as OBB)
}

export let setGetCenterFunc = (state, func) => {
	return setGirlState(state, {
		...getGirlState(state),
		getCenterFunc: NullableUtils.return_(func)
	})
}

export let removeGetCenterFunc = (state) => {
	return setGirlState(state, {
		...getGirlState(state),
		getCenterFunc: NullableUtils.getEmpty()
	})
}