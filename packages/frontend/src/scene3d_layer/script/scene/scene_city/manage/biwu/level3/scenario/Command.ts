import { Camera } from "meta3d-jiehuo-abstract"
import { Euler, Object3D, Quaternion, Sprite, Texture, Vector3 } from "three"
import { command, result, targetType } from "../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../../../type/StateType";
import { PathFind } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../../../../state/State";
import { computeAndSetDirectionData, convertPathPointToVec3Position, convertVec3PositionToPathPoint, isReach, optimizeFirstPathPoint, stopMove } from "../../../../behaviour_tree/action_node/WalkToTarget";
import { getPivotWorldPosition, setPivotWorldPositionAndUpdateBox, unlockGirlRotation } from "../../../../girl/Utils";
import { getGridForGirl } from "../../../../manage/city1/PathFind";
import { getGirl, getName, setTriggerAction } from "../../../../girl/Girl";
import { getIsDebug, getIsNotTestPerf } from "../../../../../Scene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { resourceId, road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Flow } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../../../../data/biwu/level3/DataType";
import { triggerAction as triggerGirlAction } from "../../Girl";
import * as CommandUtils from "../../../../utils/CommandUtils";
import * as LittleMan from "../../../../little_man/LittleMan"
import * as LittleManTransform from "../../../../little_man/Transform"
import { command as commandData, scenarioName } from "../../../../data/biwu/level3/ScenarioData";
import { enterScenario, moveCamera, playGirlAnimation, realtimeSay, say, setIsFinish } from "../../../../scenario/Command";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { playBiggerAnimation } from "../../../../girl/Animation";
import { pickdownArmy, walkToTargetPosition } from "../../scenario/Command";
import { Billboard } from "meta3d-jiehuo-abstract";
import { getPinchCharacterSoundResourceId, getScene, setLevelData } from "../../../../CityScene";
import { getCustomData, getCustomDataExn, removeCustomData, setCustomData } from "../../../../game_event/GameEvent";
import * as BehaviourTreeDataAll from "../../../../data/biwu/level3/behaviour_tree_data_all/BehaviourTreeData";
import { getNearestTargetCount } from "../../../../behaviour_tree/BehaviourTreeManager";
import * as ArmyManagerBiwu from "../../../biwu/ArmyManager"
import * as ShellTurret from "../../../city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../../city1/milltary_building/MissileTurret"
import { Event } from "meta3d-jiehuo-abstract";
import { getHeavyStressingLieEndEventName } from "../../../../../../../utils/EventUtils";
import { generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateTanks } from "../../../city1/ArmyManager";
import { getPositionY } from "../../../city1/Army";
import { getLittleManPositionYKey } from "../ArmyManager";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { getCollisionPartCenter, getCollisionPartOBB, updateAllCollisionShapes } from "../../../../girl/Collision";
import { collisionPart } from "../../../../data/biwu/level3/CollisionShapeData";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getGirlVolume } from "../../../../utils/SoundUtils";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getLevelData } from "../../../../data/biwu/level3/LevelData";

const _q1 = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

// type biggerData = {
// 	scale: number
// }

type addImageData = {
	resourceId: resourceId,
	positiion: [number, number, number],
	width: number,
	height: number,
}


type removeImageData = {
	resourceId: resourceId,
}


export let getCommand = (command_: commandData) => {
	switch (command_) {
		case commandData.handleGoToTrigone:
			return handleGoToTrigone
		case commandData.handleReachTrigone:
			return handleReachTrigone
		case commandData.addImage:
			return addImage
		case commandData.removeImage:
			return removeImage
		case commandData.initMap:
			return initMap
		case commandData.addEffectForHitNipple:
			return addEffectForHitNipple
		case commandData.onlyAddArmy:
			return onlyAddArmy
		case commandData.rightHandAddArmy:
			return rightHandAddArmy
		case commandData.rightHandOnePointAttack:
			return rightHandOnePointAttack
		case commandData.rightHandBeatAttack:
			return rightHandBeatAttack
		case commandData.leftHandRightHand:
			return leftHandRightHand
		case commandData.twoHandsOnePointAttack:
			return twoHandsOnePointAttack
		case commandData.twoHandsBeatAttack:
			return twoHandsBeatAttack
		case commandData.wait:
			return wait

		case commandData.enterScenario:
			return enterScenario
		case commandData.moveCamera:
			return moveCamera
		case commandData.playGirlAnimation:
			return playGirlAnimation
		case commandData.say:
			return say
		case commandData.realtimeSay:
			return realtimeSay
		case commandData.exitScenario:
			return exitScenario
		case commandData.markBegin:
			return markBegin
		case commandData.markFinish:
			return markFinish
		default:
			throw new Error("unknown commandData")
	}
}

export let handleGoToTrigone: command<addImageData> = (state: state, onCompleteFunc, data) => {
	state = {
		...state,
		config: {
			...state.config,
			isNotDamage: true
		}
	}

	return Promise.resolve(state)
}

export let handleReachTrigone: command<addImageData> = (state: state, onCompleteFunc, data) => {
	state = {
		...state,
		config: {
			...state.config,
			isNotDamage: false
		}
	}

	return Promise.resolve(state)
}

export let addImage: command<addImageData> = (state: state, onCompleteFunc, data) => {
	let image = Billboard.createImage(getAbstractState(state),
		data.resourceId,
		NullableUtils.return_(
			_v1.fromArray(data.positiion)
		),
		NullableUtils.getEmpty(),
		{
			isSizeAttenuation: true,
			isAlwaysShow: false,
			width: data.width,
			height: data.height,
		}
	)

	state = setCustomData(state, data.resourceId, image)

	getScene(state).add(image)

	return Promise.resolve(state)
}

export let removeImage: command<removeImageData> = (state: state, onCompleteFunc, data) => {
	let image = getCustomDataExn<Sprite>(state, data.resourceId)
	state = removeCustomData(state, data.resourceId)

	getScene(state).remove(image)

	return Promise.resolve(state)
}

export let initMap: command<removeImageData> = (state: state, onCompleteFunc, data) => {
	state = LittleMan.setMovableRanges(state, getLevelData(state).movableRange)

	state = updateAllCollisionShapes(state, getGirl(state))

	state = LittleManTransform.setPositionAndComputeBox(state, getLevelData(state).getLittleManInitPosition(state))

	return Promise.resolve(state)
}

export let exitScenario: command<null> = CommandUtils.exitScenario(animationName.KeepLie)

export let markBegin: command<nullable<string>> = (state: state, onCompleteFunc, data) => {
	state = setIsFinish(state, false)

	state = NullableUtils.getWithDefault(
		NullableUtils.map(data => {
			switch (data) {
				case scenarioName.RightHandAddArmy:
					state = setAbstractState(state, Flow.clearInterval(getAbstractState(state), _getIntervalName()))
					break
			}

			return state
		}, data),
		state
	)

	return Promise.resolve(state)
}

export let markFinish: command<nullable<string>> = (state: state, onCompleteFunc, data) => {
	state = setIsFinish(state, true)

	return Promise.resolve(state)
}

export let getNearestAllTargetCount = (state) => {
	return getNearestTargetCount(state, targetType.MilltaryBuilding) + getNearestTargetCount(state, targetType.MilltaryVehicle) + getNearestTargetCount(state, targetType.Soldier)
}


let _heavyStressingLieEndHandler = (handType) => {
	return (state: state, { userData }) => {
		state = BehaviourTreeDataAll.setHandType(state, handType)

		return Promise.resolve(state)
	}
}



// let _switchTwoAttacks = (state: state, conditionFunc, mainHandType, secondaryHandType, switchRate) => {
// 	state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
// 		if (conditionFunc(state)) {
// 			if (NumberUtils.isRandomRate(switchRate)) {
// 				if (BehaviourTreeDataAll.getHandType(state) == mainHandType) {
// 					state = BehaviourTreeDataAll.setHandType(state, secondaryHandType)
// 				}
// 			}

// 			return Promise.resolve(state)
// 		}

// 		if (BehaviourTreeDataAll.getHandType(state) == secondaryHandType) {
// 			state = BehaviourTreeDataAll.setHandType(state, mainHandType)
// 		}

// 		return Promise.resolve(state)
// 	}], 5))

// 	return state
// }

let _getIntervalName = () => "command_interval"

let _mayBackWhenNotAdd = (state: state) => {
	// return _switchTwoAttacks(state, state => !BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state), BehaviourTreeDataAll.handType.RightHandAdd, BehaviourTreeDataAll.handType.None, 0.5)
	// const backRate = 0.5
	state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
		if (
			(
				!BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)
				&& NumberUtils.isRandomRate(0.5)
			)
			||
			(
				getNearestAllTargetCount(state) >= 4
				&& NumberUtils.isRandomRate(0.1)
			)
		) {
			state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.None)

			return Promise.resolve(state)
		}

		if (BehaviourTreeDataAll.getHandType(state) == BehaviourTreeDataAll.handType.None
			&&
			(
				BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)
				&& NumberUtils.isRandomRate(0.3)
			)
		) {
			state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandAdd)
		}

		return Promise.resolve(state)
	}], 5, _getIntervalName()))

	return state
}

let _getRandomPositionInTorsorRange = (state) => {
	let {
		minX,
		maxX,
		minZ,
		maxZ,
	} = getLevelData(state).addArmyRange

	return new Vector3(
		NumberUtils.getRandomInteger(minX, maxX),
		0,
		NumberUtils.getRandomInteger(minZ, maxZ),
	)
}

export let onlyAddArmy: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandAdd)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.65
		},
		isCanAddFunc: state => {
			return getNearestAllTargetCount(state) < 10
		},
		armyAddData: [
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryBuildings, [ShellTurret.generateTurrets]]],
				condition: state => {
					// return ShellTurret.getAllModelQueues(state)[0].getValidData(getAbstractState(state)).length == 0
					return getNearestTargetCount(state, targetType.MilltaryBuilding) == 0
				},
				// position: (state) => new Vector3(-220, 0, 81),
				position: (state) => new Vector3(-220, 0, 62),
				rate: state => 0.3,
				count: 1,
				offset: -1,
				isOnBreast: true,
			},
			// {
			// 	generateFuncs: [ArmyManagerBiwu.generateMilltaryBuildings, [MissileTurret.generateTurrets]],
			// 	condition: state => {
			// 		return getNearestTargetCount(state, targetType.MilltaryBuilding) == 0
			// 	},
			// 	position: (state) => new Vector3(-220, 0, 62),
			// 	rate: state => 0.3,
			// 	count: 1,
			// 	offset: -1,
			// 	isOnBreast: true,
			// },
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryVehicles, [generateTanks]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.15,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateMelees, generateInfantrys]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.4,
				count: 2,
				offset: 2,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateLaserers]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.1,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateMelees]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 1,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
		]
	})

	state = _mayBackWhenNotAdd(state)


	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.RightHandAdd)))

	return Promise.resolve(state)
}

export let rightHandAddArmy: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandAdd)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.45
		},
		armyAddData: [
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryBuildings, [ShellTurret.generateTurrets]]],
				condition: state => {
					return getNearestTargetCount(state, targetType.MilltaryBuilding) == 0
				},
				position: (state) => new Vector3(-220, 0, 81),
				rate: state => 0.1,
				count: 1,
				offset: -1,
				isOnBreast: true,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryBuildings, [MissileTurret.generateTurrets]]],
				condition: state => {
					return getNearestTargetCount(state, targetType.MilltaryBuilding) == 0
				},
				position: (state) => new Vector3(-220, 0, 62),
				rate: state => 0.05,
				count: 1,
				offset: -1,
				isOnBreast: true,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryVehicles, [generateTanks]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.1,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryVehicles, [generateFlameVehicles]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.05,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateMilltaryVehicles, [generateMissileVehicles]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.05,
				count: 1,
				offset: 0,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateMelees, generateInfantrys]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.5,
				count: 1,
				offset: 2,
				isOnBreast: false,
			},
			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateLaserers, generateRocketeers]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.1,
				count: 1,
				offset: 2,
				isOnBreast: false,
			},

			{
				generateFuncs: [
					[
						ArmyManagerBiwu.generateMilltaryVehicles, [generateTanks, generateMissileVehicles],
					],
					[
						ArmyManagerBiwu.generateSoldiers, [generateMelees, generateLaserers, generateInfantrys]
					]
				],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 0.05,
				count: 1,
				offset: 5,
				isOnBreast: false,
			},

			{
				generateFuncs: [[ArmyManagerBiwu.generateSoldiers, [generateMelees]]],
				condition: state => true,
				position: (state) => _getRandomPositionInTorsorRange(state),
				rate: state => 1,
				count: 2,
				offset: 0,
				isOnBreast: false,
			},
		]
	})

	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.RightHandAdd)))

	return Promise.resolve(state)
}

// let _switchBetweenAddAndOnePointAttack = (state: state) => {
// 	// const addRate = 0.3

// 	// state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
// 	// 	if (BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)) {
// 	// 		if (NumberUtils.isRandomRate(addRate)) {
// 	// 			if (BehaviourTreeDataAll.getHandType(state) == BehaviourTreeDataAll.handType.RightHandOneFingerAttack) {
// 	// 				state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandAdd)
// 	// 			}
// 	// 		}

// 	// 		return Promise.resolve(state)
// 	// 	}


// 	// 	return Promise.resolve(state)
// 	// }], 5))

// 	// return state

// 	return _switchTwoAttacks(state, state => BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state), BehaviourTreeDataAll.handType.RightHandOneFingerAttack, BehaviourTreeDataAll.handType.RightHandAdd
// 	// , 0.3)
// 	, 1)
// }

let _getSwitchBetweenScenarioDataKey = () => "SwitchBetweenScenarioDataKey"

export let getSwitchBetweenScenarioDataData = (state: state) => {
	return getCustomData(state, _getSwitchBetweenScenarioDataKey())
}

export let rightHandOnePointAttack: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandOneFingerAttack)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.6
		},
		isCanAddFunc: state => {
			return getNearestAllTargetCount(state) < 10
		},
	})


	let {
		switchFromRightHandOnePointAttackRateToRightHandAddArmyRate,
		switchFromRightHandAddArmyRateToRightHandOnePointAttackRate,
	} = getLevelData(state)

	state = setCustomData(state, _getSwitchBetweenScenarioDataKey(),
		[
			[
				// state => BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state),
				state => getNearestAllTargetCount(state) < 4,
				scenarioName.RightHandOnePointAttack,
				scenarioName.RightHandAddArmy,
				switchFromRightHandOnePointAttackRateToRightHandAddArmyRate
			],
			[
				// state => !BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state),
				state => getNearestAllTargetCount(state) >= 2,
				scenarioName.RightHandAddArmy,
				scenarioName.RightHandOnePointAttack,
				switchFromRightHandAddArmyRateToRightHandOnePointAttackRate
			]
		]
	)


	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.RightHandOneFingerAttack)))

	return Promise.resolve(state)
}

export let rightHandBeatAttack: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandBeatAttack)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.6
		},
		isCanAddFunc: state => {
			return getNearestAllTargetCount(state) < 10
		},
	})


	let {
		switchFromRightHandBeatAttackRateToRightHandAddArmyRate,
		switchFromRightHandAddArmyRateToRightHandBeatAttackRate,
	} = getLevelData(state)

	state = setCustomData(state, _getSwitchBetweenScenarioDataKey(),
		[
			[
				// state => BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state),
				state => getNearestAllTargetCount(state) < 4,
				scenarioName.RightHandBeatAttack,
				scenarioName.RightHandAddArmy,
				switchFromRightHandBeatAttackRateToRightHandAddArmyRate
			],
			[
				state => getNearestAllTargetCount(state) >= 2,
				scenarioName.RightHandAddArmy,
				scenarioName.RightHandBeatAttack,
				switchFromRightHandAddArmyRateToRightHandBeatAttackRate
			]
		]
	)

	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.RightHandBeatAttack)))

	return Promise.resolve(state)
}


export let leftHandRightHand: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.5
		},
	})
	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.LeftHandRightHand)))

	return Promise.resolve(state)
}

export let twoHandsOnePointAttack: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.TwoHandsOneFingerAttack)


	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.7
		},
		isCanAddFunc: state => {
			return getNearestAllTargetCount(state) < 10
		},
	})


	let {
		switchFromTwoHandsOnePointAttackRateToRightHandAddArmyRate,
		switchFromRightHandAddArmyRateToTwoHandsOnePointAttackRate,
		switchFromTwoHandsOnePointAttackRateToLeftHandRightHandRate,
		switchFromLeftHandRightHandRateToTwoHandsOnePointAttackRate,
	} = getLevelData(state)

	state = setCustomData(state, _getSwitchBetweenScenarioDataKey(),
		[
			[
				// state => BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state),
				state => getNearestAllTargetCount(state) < 4,
				scenarioName.TwoHandsOneFingerAttack,
				scenarioName.RightHandAddArmy,
				switchFromTwoHandsOnePointAttackRateToRightHandAddArmyRate
			],
			[
				state => getNearestAllTargetCount(state) >= 2,
				scenarioName.RightHandAddArmy,
				scenarioName.TwoHandsOneFingerAttack,
				switchFromRightHandAddArmyRateToTwoHandsOnePointAttackRate
			],

			[
				state => true,
				scenarioName.TwoHandsOneFingerAttack,
				scenarioName.LeftHandRightHand,
				switchFromTwoHandsOnePointAttackRateToLeftHandRightHandRate
			],
			[
				state => true,
				scenarioName.LeftHandRightHand,
				scenarioName.TwoHandsOneFingerAttack,
				switchFromLeftHandRightHandRateToTwoHandsOnePointAttackRate
			]
		]
	)


	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.TwoHandsOneFingerAttack)))

	return Promise.resolve(state)
}

export let twoHandsBeatAttack: command<null> = (state: state, onCompleteFunc, data) => {
	state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.TwoHandsBeatAttack)

	state = BehaviourTreeDataAll.setCustomData(state, {
		...BehaviourTreeDataAll.getCustomData(state),
		getRestRateFunc: state => {
			return 0.7
		},
		isCanAddFunc: state => {
			return getNearestAllTargetCount(state) < 12
		},
	})


	let {
		switchFromTwoHandsBeatAttackRateToRightHandAddArmyRate,
		switchFromRightHandAddArmyRateToTwoHandsBeatAttackRate,
		switchFromTwoHandsBeatAttackRateToLeftHandRightHandRate,
		switchFromLeftHandRightHandRateToTwoHandsBeatAttackRate,
	} = getLevelData(state)

	state = setCustomData(state, _getSwitchBetweenScenarioDataKey(),
		[
			[
				// state => BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state),
				state => getNearestAllTargetCount(state) < 6,
				scenarioName.TwoHandsBeatAttack,
				scenarioName.RightHandAddArmy,
				switchFromTwoHandsBeatAttackRateToRightHandAddArmyRate
			],
			[
				state => getNearestAllTargetCount(state) >= 2,
				scenarioName.RightHandAddArmy,
				scenarioName.TwoHandsBeatAttack,
				switchFromRightHandAddArmyRateToTwoHandsBeatAttackRate
			],

			[
				state => true,
				scenarioName.TwoHandsBeatAttack,
				scenarioName.LeftHandRightHand,
				switchFromTwoHandsBeatAttackRateToLeftHandRightHandRate
			],
			[
				state => true,
				scenarioName.LeftHandRightHand,
				scenarioName.TwoHandsBeatAttack,
				switchFromLeftHandRightHandRateToTwoHandsBeatAttackRate
			]
		]
	)

	state = setAbstractState(state, Event.offAll(getAbstractState(state), getHeavyStressingLieEndEventName()))
	state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler(BehaviourTreeDataAll.handType.TwoHandsBeatAttack)))

	return Promise.resolve(state)
}

export let wait: command<number> = (state: state, onCompleteFunc, data) => {
	return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
		return onCompleteFunc(state)
	}, data / 1000)))
}

export let addEffectForHitNipple: command<collisionPart> = (state: state, onCompleteFunc, data) => {
	let offsetZ
	switch (data) {
		case collisionPart.LeftNipple:
			offsetZ = -6
			break
		case collisionPart.RightNipple:
			offsetZ = -3
			break
		default:
			throw new Error("err")
	}

	state = setAbstractState(state, ParticleManager.emitMilkSplash(getAbstractState(state), {
		speed: 1,
		life: 1000,
		size: 30,
		/*! need change image's anchor from left-bottom to center
		* 
		*/
		position: getCollisionPartOBB(state, data).center.clone()
			.add(_v1.set(0, 6, offsetZ))
			.toArray()
	}))

	state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getPinchCharacterSoundResourceId(), getIsDebug(state), getGirlVolume(state, LittleManTransform.getWorldPosition(state)))))

	return Promise.resolve(state)
}