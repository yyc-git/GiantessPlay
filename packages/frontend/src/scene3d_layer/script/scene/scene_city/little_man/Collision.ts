import { state } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three"
// import { isCompletelyPlayingAnimation } from "./Animation"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
// import { MMD } from "meta3d-jiehuo-abstract"
// import { getAnimationFrameCount } from "../data/Const"
import { NumberUtils } from "meta3d-jiehuo-abstract"
// import { getBoxSizeForCompute, getGirlBox, getGirlPosition, getGirlRotation, getActualHeight, getScale } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { getConfigData, getOrbitControlsTarget } from "../CityScene"
import { effect, frameIndex, particle, track } from "../data/DataType"
import { animationName } from "../little_man_data/DataType"
import { collisionPart, crawlMovePhase, damageType, force, otherPhase, pose, runPhase, standToCrawlPhase, stompPhase, walkPhase } from "../type/StateType"
import * as Data from "../little_man_data/Data"
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
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { axis, getData } from "../data/CollisionShapeData"
import { getBox, getLittleMan, getLittleManState, getName, setLittleManState } from "./LittleMan"
import { getAnimationFrameCount } from "../little_man_data/Const"
import { isCompletelyPlayingAnimation } from "./Animation"
import { getWorldMatrix } from "./Transform"
import { Console } from "meta3d-jiehuo-abstract"
import { isSpecificFrameIndex } from "../utils/CollisionUtils"
// import { isNearGirl } from "../utils/CollisionUtils"
// import { damageWithData } from "../utils/DamageUtils"
// import { getGirlVolume } from "../utils/SoundUtils"
// import { getBone } from "../utils/MMDUtils"

const _q = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

// let _getPhase = (state: state, animationName_: animationName, frameIndex) => {
// 	return NullableUtils.getWithDefault(
// 		NullableUtils.map(
// 			data => {
// 				return data.value.filter(v => {
// 					return NumberUtils.between(frameIndex, v.frameIndexRange[0], v.frameIndexRange[1])
// 				}).map(v => {
// 					return v.phase
// 				})[0]
// 			},
// 			getConfigData(state).phaseData.find(data => {
// 				return data.name == animationName_
// 			})),
// 		otherPhase.None
// 	)
// }

// let _screenShake = (state: state) => {
// 	getLittleManState(state).screenShake.shake(getOrbitControlsTarget(state), getValue(state).screenShakeDistanceFactor * Math.pow(getScale(state), 1.0), getValue(state).screenShakeTime)

// 	return state
// }

// let _isCollisionWithObject = (isObjectFunc, state, animationName, phase: walkPhase) => {
// 	let { isComputeDamageMap } = getLittleManState(state)

// 	let isComputeActionDamageMap = NullableUtils.getExn(isComputeDamageMap.get(animationName))

// 	// let phase
// 	// switch (collisionPart_) {
// 	// 	case collisionPart.RightFoot:
// 	// 		phase = walkPhase.RightFootDown
// 	// 		break
// 	// 	case collisionPart.LeftFoot:
// 	// 		phase = walkPhase.LeftFootDown
// 	// 		break
// 	// }

// 	return isComputeActionDamageMap.reduce((result, value, name) => {
// 		if (result) {
// 			return result
// 		}

// 		if (isObjectFunc(name)) {
// 			return NullableUtils.getWithDefault(value.get(phase), false)
// 		}

// 		return false
// 	}, false)

// }

// let _isCollisionWithVehicle = (state, animationName, phase) => {
// 	return _isCollisionWithObject(name => {
// 		return Cars.isCars(name) || DynamicCars.isDynamicCar(name) || Tank.isTank(name)
// 	}, state, animationName, phase)
// }

// let _isCollisionWithCharacter = (state, animationName, phase) => {
// 	return _isCollisionWithObject(name => {
// 		return Citiyzen.isCityzen(name) || Soldier.isSoldier(name)
// 	}, state, animationName, phase)
// }

// let _getDamageType = (phase, animationName_) => {
// 	switch (animationName_) {
// 		case animationName.Walk:
// 			return phase == walkPhase.LeftFootDown || phase == walkPhase.RightFootDown ? damageType.Direct : damageType.Normal
// 		case animationName.Run:
// 			return phase == runPhase.LeftFootDown || phase == runPhase.RightFootDown ? damageType.Direct : damageType.Normal
// 		case animationName.Stomp:
// 			return phase == stompPhase.Down ? damageType.Direct : damageType.Normal


// 		case animationName.CrawlMove:
// 			return phase == crawlMovePhase.Down ? damageType.Direct : damageType.Normal

// 		// case animationName.StandToCrawl:
// 		// case animationName.CrawlToStand:
// 		default:
// 			return damageType.Direct
// 	}
// }

// let _execEffect = (state, effect_: effect) => {
// 	switch (effect_) {
// 		case effect.ScreenShake:
// 			state = _screenShake(state)
// 			break
// 		default:
// 			throw new Error("err")
// 	}

// 	return state
// }

// let _emitParticle = (state, data: Array<[particle, any]>) => {
// 	return data.reduce((state, d) => {
// 		switch (d[0]) {
// 			case particle.StompDust:
// 				state = setAbstractState(state, ParticleManager.emitStompDust(getAbstractState(state), d[1]))
// 				break
// 			case particle.WaterBloom:
// 				state = setAbstractState(state, ParticleManager.emitWaterBloom(getAbstractState(state), d[1]))
// 				break
// 			default:
// 				throw new Error("err")
// 		}

// 		return state
// 	}, state)
// }


// let _updateCollisionOBBShape = (state: state,
// 	[getCenterFunc, getWorldQuaternionFunc],
// 	littleMan, bone1Name, bone2Name, collisionPart_: collisionPart,
// 	centerFactor,
// 	size
// ) => {
// 	let data1 = getBone(state, littleMan, bone1Name)
// 	state = data1[0]
// 	let bone1 = data1[1]

// 	let data2 = getBone(state, littleMan, bone2Name)
// 	state = data2[0]
// 	let bone2 = data2[1]

// 	let w1 = bone1.getWorldPosition(_v1)
// 	let w2 = bone2.getWorldPosition(_v2)
// 	let center = getCenterFunc(w1.add(
// 		w2.sub(w1).multiplyScalar(centerFactor)
// 	).clone())
// 	// let center = w1.add(
// 	// 	w2.sub(w1).multiplyScalar(centerFactor)
// 	// ).clone()
// 	// let quat = bone2.getWorldQuaternion(_q)
// 	let quat = getWorldQuaternionFunc(state, bone1, bone2)

// 	let { collisionShapeMap } = getLittleManState(state)

// 	Collision.updateOBB(NullableUtils.getExn(collisionShapeMap.get(collisionPart_) as OBB), center, quat, size)

// 	return state
// }

// let _updateCollisionOBBShapeByOneBone = (state: state,
// 	[getCenterFunc, getWorldQuaternionFunc],
// 	littleMan, bone1Name, collisionPart_: collisionPart,
// 	size
// ) => {
// 	let data1 = getBone(state, littleMan, bone1Name)
// 	state = data1[0]
// 	let bone1 = data1[1]

// 	let w1 = bone1.getWorldPosition(_v1).clone()
// 	// let w2 = bone2.getWorldPosition(_v2)
// 	let center = getCenterFunc(w1)
// 	// let center = w1.add(
// 	// 	w2.sub(w1).multiplyScalar(centerFactor)
// 	// ).clone()
// 	// let quat = bone1.getWorldQuaternion(_q)
// 	let quat = getWorldQuaternionFunc(state, bone1)

// 	let { collisionShapeMap } = getLittleManState(state)

// 	Collision.updateOBB(NullableUtils.getExn(collisionShapeMap.get(collisionPart_) as OBB), center, quat, size)

// 	return state
// }

// let _getMinScaleAsMiddleGiantess = () => getValue(state).minScaleAsMiddleGiantess

// let _isFrameIndexUsedForReset = (frameIndex) => {
// 	return frameIndex == 0 || frameIndex == 1
// }

let _resetActionCollision = (state: state, name: animationName, frameIndex) => {
	// let { isComputeCollisionMap, isResetActionCollision } = getLittleManState(state)

	// // if (_isFrameIndexUsedForReset(frameIndex)) {
	// if (SkinAnimation.isSpecificFrameIndex(frameIndex, 0, frameCount, getIsDebug(state)) && !isResetActionCollision) {
	// 	isComputeCollisionMap = Map()
	// 	// isComputeDamageMap = Map()

	// 	isResetActionCollision = true
	// }
	// else if (SkinAnimation.isSpecificFrameIndex(frameIndex, frameCount, frameCount, getIsDebug(state))) {
	// 	isResetActionCollision = false
	// }

	// state = setLittleManState(state, {
	// 	...getLittleManState(state),
	// 	isComputeCollisionMap,
	// 	// isComputeDamageMap,
	// 	isResetActionCollision,
	// })



	let { isComputeCollisionMap, lastFrameIndexMap } = getLittleManState(state)

	if (frameIndex < NullableUtils.getWithDefault(
		lastFrameIndexMap.get(name),
		10000
	)) {
		isComputeCollisionMap = Map()
	}

	state = setLittleManState(state, {
		...getLittleManState(state),
		isComputeCollisionMap,
	})

	return state
}

// let _getMoveDirection = (velocity) => {
// 	if (velocity.equals(_v1.set(0, 0, 0))) {
// 		return buildRandomDirectionInXZ()
// 	}

// 	return velocity.clone().normalize()
// }

// let _computeForce = (state: state, animationName_: animationName, velocity: Vector3, phase): force => {
// 	let height = getActualHeight(state)

// 	let direction

// 	let actionForce = NullableUtils.getWithDefault(
// 		NullableUtils.map(
// 			(data) => {
// 				return data.force[phase]
// 			},
// 			getConfigData(state).actionData.find(data => {
// 				return data.name == animationName_
// 			}),
// 		),
// 		0
// 	)

// 	switch (animationName_) {
// 		case animationName.Walk:
// 			switch (phase) {
// 				case walkPhase.LeftFootMove:
// 				case walkPhase.RightFootMove:
// 					direction = _getMoveDirection(velocity)
// 					break
// 				case walkPhase.LeftFootDown:
// 				case walkPhase.RightFootDown:
// 					direction = buildDownDirection()
// 					break
// 			}
// 			break
// 		case animationName.Run:
// 			switch (phase) {
// 				case runPhase.LeftFootMove:
// 				case runPhase.RightFootMove:
// 					direction = _getMoveDirection(velocity)
// 					break
// 				case runPhase.LeftFootDown:
// 				case runPhase.RightFootDown:
// 					direction = buildDownDirection()
// 					break
// 			}
// 			break
// 		case animationName.Stomp:
// 			switch (phase) {
// 				case stompPhase.Up:
// 					direction = buildUpDirection()
// 					break
// 				case stompPhase.Down:
// 					direction = buildDownDirection()
// 					break
// 				case stompPhase.Range:
// 					direction = buildDownDirection()
// 					break
// 			}
// 			break

// 		case animationName.StandToCrawl:
// 			direction = buildDownDirection()
// 			break
// 		case animationName.CrawlToStand:
// 			direction = buildRandomDirectionInXZ()
// 			break
// 		case animationName.BreastPress:
// 			direction = buildRandomDirectionInXZ()
// 			break
// 		case animationName.CrawlMove:
// 			switch (phase) {
// 				case crawlMovePhase.Move:
// 					direction = _getMoveDirection(velocity)
// 					break
// 				case crawlMovePhase.Down:
// 					direction = buildDownDirection()
// 					break
// 			}
// 			break

// 		default:
// 			direction = buildRandomDirectionInXZ()
// 			break

// 	}


// 	return [actionForce * height, direction]
// }

// let _damageInRange = (state: state, velocity, rangeBox): Promise<state> => {
// 	let force = _computeForce(state, animationName.Stomp, velocity, stompPhase.Range)

// 	return ArrayUtils.reducePromise(Collision.queryRangeCollisionByBox(getAbstractState(state), rangeBox), (state, damageData) => {
// 		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

// 		if (transforms.length == 0) {
// 			return Promise.resolve(state)
// 		}

// 		return damageWithData(state, [force, damageType.Range], getName(),
// 			[transforms, boxes, names]).then(TupleUtils.getTuple2First)
// 	}, state)
// }

// let _handleDamage = (state, damageData, force, damageType_) => {
// 	if (!NullableUtils.isNullable(damageData)) {
// 		let [transforms, boxes, names] = NullableUtils.getExn(damageData)

// 		if (transforms.length == 0) {
// 			return Promise.resolve([state, []])
// 		}

// 		let [newTransforms, newBoxes, newNames] = names.reduce(([newTransforms, newBoxes, newNames], name, i) => {
// 			return [
// 				ArrayUtils.push(newTransforms, transforms[i]),
// 				ArrayUtils.push(newBoxes, boxes[i]),
// 				ArrayUtils.push(newNames, name),
// 			]
// 		}, [[], [], []])


// 		return damageWithData(state, [force, damageType_], getName(),
// 			[newTransforms, newBoxes, newNames])
// 	}

// 	return Promise.resolve([state, []])
// }

// let _isDamage = (damageMap, name, phase) => {
// 	let value = damageMap.get(name)
// 	if (NullableUtils.isNullable(value)) {
// 		return false
// 	}

// 	return value.get(phase) === true
// }

// let _markDamage = (damageMap, name, phase) => {
// 	let value = damageMap.get(name)
// 	if (NullableUtils.isNullable(value)) {
// 		value = Map()
// 		// return damageMap.set(name, Map().set(phase, true))
// 	}

// 	return damageMap.set(name, value.set(phase, true))
// }

// let _handleCollisionData = (data: Array<[Array<Matrix4>, Array<Box3>, Array<string>]>,
// 	handleLODContainerDataFunc,
// ) => {
// 	return data.map(([transforms, boxes, names]) => {
// 		let data = boxes.reduce<[Array<Matrix4>, Array<Box3>, Array<string>]>(([newTransforms, newBoxes, newNames], box, i) => {
// 			return handleLODContainerDataFunc([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i)
// 		}, [[], [], []])

// 		if (data[0].length == 0) {
// 			return NullableUtils.getEmpty()
// 		}

// 		return NullableUtils.return_(
// 			data
// 		)
// 	}).filter((damageData) => {
// 		return !NullableUtils.isNullable(damageData)
// 	}) as any
// }

// let _queryOBBShapeCollision = (shape: OBB, state: state): Array<nullable<[StaticLODContainer, [Array<Matrix4>, Array<Box3>, Array<string>]]>> => {
// 	return _handleCollisionData(Collision.queryRangeCollisionByBox(getAbstractState(state), shape.toBox3()),
// 		([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i) => {
// 			if (shape.intersectsBox3(box)) {
// 				return [
// 					ArrayUtils.push(newTransforms, transforms[i]),
// 					ArrayUtils.push(newBoxes, box),
// 					ArrayUtils.push(newNames, names[i]),
// 				]
// 			}

// 			return [newTransforms, newBoxes, newNames]
// 		}
// 	)
// }

// let _removeCollisionedOnes = (isComputeDamageMap, data, phase) => {
// 	// let mutableMap = isComputeStompDamageMap.toObject()
// 	let map = isComputeDamageMap

// 	let newData = _handleCollisionData(data,
// 		([newTransforms, newBoxes, newNames], [transforms, boxes, names], box, i) => {
// 			let name = names[i]
// 			if (_isDamage(map, name, phase)) {
// 				return [newTransforms, newBoxes, newNames]
// 			}

// 			return [
// 				ArrayUtils.push(newTransforms, transforms[i]),
// 				ArrayUtils.push(newBoxes, box),
// 				ArrayUtils.push(newNames, name),
// 			]

// 		}
// 	)

// 	// return [
// 	//     map,
// 	//     newData
// 	// ]
// 	return newData
// }

// // let _updateShapeCollision = (state, shape, isComputeDamageMap, phase, force, damageType_) => {
// // 	let collisionData = _queryOBBShapeCollision(shape, state)
// // 	let remainCollisionData = _removeCollisionedOnes(isComputeDamageMap, collisionData, phase)

// // 	return ArrayUtils.reducePromise(remainCollisionData, ([state, isComputeDamageMap], damageData) => {
// // 		return _handleDamage(state, damageData, force, damageType_).then(data => {
// // 			state = data[0]
// // 			let damageNames = data[1]

// // 			isComputeDamageMap = damageNames.reduce((isComputeDamageMap, name) => {
// // 				return _markDamage(isComputeDamageMap, name, phase)
// // 			}, isComputeDamageMap)

// // 			return [state, isComputeDamageMap]
// // 		})
// // 	}, [state, isComputeDamageMap])
// // }

// // let _getMinScaleAsSmallGiantess = () => getValue(state).minScaleAsSmallGiantess

// let _addDirectionScalar = (currentPose: pose, center: Vector3, direction, directionScalar) => {
// 	return directionScalar.filter(({ pose }) => {
// 		return pose == currentPose
// 	}).reduce((dir, { value }) => {
// 		return dir.add(direction.clone().multiplyScalar(value))
// 	}, center)
// }


export let getAnimationCollisionData = () => {
	return Data.getAnimationCollisionData()
}

export let updateAnimationCollision = (state: state) => {
	let { currentAnimationName } = getLittleManState(state)

	// let littleMan = getLittleMan(state)

	// state = updateAllCollisionShapes(state, littleMan)

	return NullableUtils.getWithDefault(
		NullableUtils.map(
			({ name, timeline }) => {
				let frameCount = getAnimationFrameCount(name)

				let frameIndex = SkinAnimation.getFrameIndex(
					SkinAnimation.getAction(getAbstractState(state), getName(), name),
					frameCount
				)

				state = _resetActionCollision(state, name, frameIndex,
				)

				state = setLittleManState(state, {
					...getLittleManState(state),
					lastFrameIndexMap: getLittleManState(state).lastFrameIndexMap.set(name, frameIndex)
				})

				// if (!isCompletelyPlayingAnimation(state, name)) {
				// 	return Promise.resolve(state)
				// }



				// let phase = _getPhase(state, name, frameIndex)

				// let force = _computeForce(state, name, velocity, phase)

				// let damageType_ = _getDamageType(phase, name)


				// let { collisionShapeMap } = getLittleManState(state)

				// return ArrayUtils.reducePromise<state, collisionPart>(shapeDamage, (state, collisionPart_: collisionPart) => {
				// 	let { isComputeDamageMap } = getLittleManState(state)

				// 	let isComputeActionDamageMap = NullableUtils.getWithDefault(
				// 		isComputeDamageMap.get(name),
				// 		Map()
				// 	)

				// 	return _updateShapeCollision(state, collisionShapeMap.get(collisionPart_), isComputeActionDamageMap, phase, force, damageType_).then(data => {
				// 		state = data[0]
				// 		isComputeActionDamageMap = data[1]

				// 		state = setLittleManState(state, {
				// 			...getLittleManState(state),
				// 			isComputeDamageMap: isComputeDamageMap.set(name, isComputeActionDamageMap)
				// 		})

				// 		return state
				// 	})
				// }, state)



				return ArrayUtils.reducePromise(timeline, (state, data, i) => {
					let frameIndices: Array<frameIndex>, frameRange
					if (!NullableUtils.isNullable(data.frameIndex)) {
						frameIndices = [NullableUtils.getExn(data.frameIndex)]
					}
					else if (!NullableUtils.isNullable(data.frameIndices)) {
						frameIndices = NullableUtils.getExn(data.frameIndices)
					}

					// if (!NullableUtils.isNullable(data.frameRange)) {
					// 	frameRange = data.frameRange
					// }
					frameRange = data.frameRange

					let { isComputeCollisionMap } = getLittleManState(state)
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
							// phase: phase,
							// force
						}

						// if (name == animationName.Shoot) {
						// 	Console.log(
						// 		frameIndex, targetFrameIndex,

						// 		// frameRange

						// 		_isSpecificFrameIndex(state, frameIndex, targetFrameIndex, frameRange, frameCount),
						// 		map.get(targetFrameIndex)
						// 	)
						// }

						let promise
						// if (SkinAnimation.isSpecificFrameIndex(frameIndex, targetFrameIndex, frameCount, getIsDebug(state))) {
						if (isSpecificFrameIndex(state, frameIndex, targetFrameIndex, frameRange, frameCount)) {
							if (map.get(targetFrameIndex) !== true) {
								map = map.set(targetFrameIndex, true)

								switch (data.track) {
									// case track.Audio:
									// 	let soundId = data.value<string>(state, valueData)

									// 	let volume = getGirlVolume(state)

									// 	state = NullableUtils.getWithDefault(NullableUtils.map(soundId => {
									// 		return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), volume)))
									// 	}, soundId),
									// 		state)
									// 	promise = Promise.resolve(state)
									// 	break
									// case track.Effect:
									// 	state = NullableUtils.getWithDefault(
									// 		NullableUtils.map(
									// 			effect_ => {
									// 				return _execEffect(state, effect_)
									// 			},
									// 			data.value<effect>(state, valueData)
									// 		),
									// 		state
									// 	)
									// 	promise = Promise.resolve(state)
									// 	break
									// case track.Particle:
									// 	state = NullableUtils.getWithDefault(
									// 		NullableUtils.map(
									// 			data => {
									// 				return _emitParticle(state, data)
									// 			},
									// 			data.value<Array<[
									// 				particle,
									// 				any
									// 			]>>(state, valueData)
									// 		),
									// 		state
									// 	)
									// 	promise = Promise.resolve(state)
									// 	break
									// case track.RangeDamage:
									// 	promise = NullableUtils.getWithDefault(
									// 		NullableUtils.map(
									// 			rangeBox => {
									// 				return _damageInRange(state, velocity, rangeBox)
									// 			},
									// 			data.value<Box3>(state, valueData)
									// 		),
									// 		Promise.resolve(state)
									// 	)
									// 	break
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
						return setLittleManState(state, {
							...getLittleManState(state),
							isComputeCollisionMap: isComputeCollisionMap.set(i, map)
						})
					})
				}, state)

			},
			getConfigData(state).littleManAnimationCollisionData.find(data => {
				return data.name == currentAnimationName
			}),
		),
		Promise.resolve(state)
	)
}

// export let queryAllOBBShapesCollisionWithBox = (
// 	state: state,
// 	point: Vector3
// )
// 	// : [nullable<Matrix4>, nullable<Box3>, nullable<string>] => {
// 	: nullable<collisionPart> => {
// 	if (!isNearGirl(state, point)) {
// 		return NullableUtils.getEmpty()
// 	}

// 	let girlBox = getGirlBox(state).clone()

// 	let size = girlBox.getSize(_v1)

// 	girlBox = girlBox.expandByVector(_v2.set(size.x / 2, 0, size.z / 2))


// 	if (!girlBox.containsPoint(point)) {
// 		// return [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()]
// 		return NullableUtils.getEmpty()
// 	}


// 	let { collisionShapeMap } = getLittleManState(state)

// 	return collisionShapeMap.entrySeq().toArray().reduce((result, [collisionPart, shape]) => {
// 		if (
// 			!NullableUtils.isNullable(result)
// 			// || !shape.toBox3().containsPoint(point)
// 			|| !shape.containsPoint(point)
// 		) {
// 			return result
// 		}

// 		return NullableUtils.return_(collisionPart)

// 		// }, [NullableUtils.getEmpty(), NullableUtils.getEmpty(), NullableUtils.getEmpty()])
// 	}, NullableUtils.getEmpty<collisionPart>())
// }

// export let getCollisionPartCenter = (state, collisionPart_) => {
// 	let { collisionShapeMap } = getLittleManState(state)

// 	return ensureCheck(collisionShapeMap.get(collisionPart_).center, (r) => {
// 		test("shouldn't be zero point", () => {
// 			return r.x != 0 && r.y != 0 && r.z != 0
// 		})
// 	}, getIsDebug(state))
// }

export let getCollisionResultWithLittleMan = (state: state, box: Box3): Array<[Array<Matrix4>, Array<Box3>, Array<string>]> => {
	if (box.intersectsBox(getBox(state))) {
		return [
			[
				[getWorldMatrix(state)],
				[getBox(state)],
				[getName()]
			]
		]
	}

	return []
}

export let simplyCollisionResultWithLittleMan = (result): nullable<[Matrix4, Box3, string]> => {
	return ArrayUtils.get(result.map(([transforms, boxes, names]) => {
		return [transforms[0], boxes[0], names[0]]
	}), 0)
}