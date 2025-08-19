import { LOD } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import * as Soldier from "./soldier/Soldier"
import * as Infantry from "./soldier/Infantry"
import * as Rocketeer from "./soldier/Rocketeer"
import * as Laserer from "./soldier/Laserer"
import * as Commander from "./soldier/Commander"
import * as Melee from "./soldier/Melee"
import * as MilltaryBuilding from "./milltary_building/MilltaryBuilding"
import * as MissileTurret from "./milltary_building/MissileTurret"
import * as ShellTurret from "./milltary_building/ShellTurret"
import * as MilltaryVehicle from "./milltary_vehicle/MilltaryVehicle"
import * as Tank from "./milltary_vehicle/Tank"
import * as MissileVehicle from "./milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "./milltary_vehicle/FlameVehicle"
import * as BasicBulletGun from "../../weapon/BasicBulletGun"
import * as PropBulletGun from "../../weapon/PropBulletGun"
import * as RocketGun from "../../weapon/RocketGun"
import * as MissileRack from "../../weapon/MissileRack"
import * as LaserGun from "../../weapon/LaserGun"
import * as ShellGunBarrel from "../../weapon/ShellGunBarrel"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { generateCharacterCrowd, generateVehicleCrowd } from "./WholeScene"
import { Box3, Euler, LinearMipMapLinearFilter, Matrix4, Quaternion, Vector3 } from "three"
import { Flow } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { updateShadow } from "../../utils/CharacterUtils"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { isEnter } from "../../scenario/ScenarioManager"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { bulletParticle, crowdSize, missileVehicleMissileParticle, name, rocketParticle, shellParticle, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { checkCollisionWithArmy, checkParticleCollisionWithStatic, checkParticleRangeCollisionWithStatic, checkRangeCollisionWithArmy, getParticleNeedCollisionCheckLoopCount, handleAllCollisions, handleCollisionWithArmy, handleCollisionWithLittleMan, isCollisionWithLittleMan, setParticleNeedCollisionCheckLoopCount } from "../../utils/ArmyUtils"
import { armyCount, attackRange, attackTarget, camp, collisionPart, damageType, particleNeedCollisionCheckLoopFrames } from "../../type/StateType"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCollisionPartOBB, queryAllOBBShapesCollisionWithBox } from "../../girl/Collision"
import * as Girl from "../../girl/Girl"
import * as DamageUtils from "../../utils/DamageUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { armyValue, weaponValue } from "../../data/ValueType"
import { getIsDebug, getIsNotTestPerf } from "../../../Scene"
import { getGiantessSetting, getLittleManSetting, isGiantessRoad } from "../../CityScene"
import { handleCollisionWithEmitterCollisionableContainers, isInGirlAttackRange } from "../../utils/CollisionUtils"
import * as GiantessArmyManager from "./giantess/ArmyManager"
import * as LittleManArmyManager from "./little_man/ArmyManager"
import * as LittleMan from "../../little_man/LittleMan"
import { handlePropBulletHitGirl, handlePropBulletHitLittleMan, handlePropBulletHitStatic } from "../../little_man/Gun"
import { getModelData, modelName } from "../../army_data/SoldierData"
import * as MilltaryVehicleData from "../../army_data/MilltaryVehicleData"
import { handleRocketHitGirl, handleRocketHitLittleMan, handleRocketHitStatic } from "./soldier/weapon/Rocket"
import { handleBasicBulletHitGirl, handleBasicBulletHitLittleMan, handleBasicBulletHitStatic } from "./soldier/weapon/BasicBullet"
import { getBox, remove } from "meta3d-jiehuo-abstract/src/particle/instance/RocketEmitter"
import * as MissileVehicleMissileEmitter from "meta3d-jiehuo-abstract/src/particle/instance/MissileVehicleMissileEmitter"
import { handleLaserHitGirl, handleLaserHitLittleMan, handleLaserHitStatic } from "./soldier/weapon/Laser"
import { handleShellHitGirl, handleShellHitLittleMan, handleShellHitStatic } from "./milltary_vehicle/weapon/Shell"
import { handleMissileHitGirl, handleMissileHitLittleMan, handleMissileHitStatic } from "./milltary_vehicle/weapon/Missile"
import { Scene } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getCampExn, setAttackTarget, setCamp } from "./Army"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"

const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


let _generate = (state: state,
	[
		generateCrowdFunc,
		handleAfterUpdatePositionFunc,
		getStateMachineFunc
	],
	queue: LODQueue,
	initialTransform,
	crowds,
	[
		maxVisibleCount,
		crowdCount,
		offsetFactor,
	]
): Promise<state> => {
	// const maxVisibleCount = 10
	// const crowdCount = 10
	// const offsetFactor = 5

	let visibleCount = queue.names.reduce((count, name) => {
		if (LOD.getStatusForLODQueue(getAbstractState(state), name).isVisible) {
			return count + 1
		}

		return count
	}, 0)

	if (visibleCount >= maxVisibleCount) {
		return Promise.resolve(state)
	}


	// let initialTransform = new Matrix4().compose(
	// 	new Vector3(0, 0, 0),
	// 	new Quaternion(),
	// 	new Vector3().set(1, 1, 1).multiplyScalar(0.23)
	// )

	// let crowd1 = {
	// 	name: "",
	// 	position: new Vector3(
	// 		-300, 0, -80
	// 	),
	// 	userData: null
	// }

	let data = generateCrowdFunc(state,
		initialTransform,
		crowds,
		crowdCount,
		queue,
	)
	state = data[0]
	let addedIndices = data[1]
	let addedNames = data[2]

	state = addedIndices.reduce((state, index) => {
		let pos = TransformUtils.getPositionFromMatrix4(queue.transforms[index])
		let newPos = pos.set(
			NumberUtils.getRandomValue1() * offsetFactor + pos.x,
			pos.y,
			NumberUtils.getRandomValue1() * offsetFactor + pos.z,
		)

		queue.updatePosition(index,
			newPos,
			true
		)

		state = handleAfterUpdatePositionFunc(state, index, newPos)

		return state
	}, state)

	return ArrayUtils.reducePromise(addedNames, (state, name) => {
		return StateMachine.execute(state, getStateMachineFunc(state, name), name)
	}, state)
}

let _getCrowdScalar = (state: state) => {
	if (isGiantessRoad(state)) {
		return GiantessArmyManager.getCrowdScalar(state)
	}
	else {
		return LittleManArmyManager.getCrowdScalar(state)
	}
}

let _randomSelectTwoCrowdData = (state: state, crowdData: Array<Vector3>) => {
	requireCheck(() => {
		test("crowdData.length > 0", () => {
			return crowdData.length > 0
		})
	}, getIsDebug(state))

	let result = crowdData.filter(position => {
		return !isInGirlAttackRange(state, position, attackRange.Middle, NullableUtils.getEmpty())
	})

	if (getIsDebug(state) && getIsNotTestPerf(state)) {
		return [crowdData[0]]
	}

	if (result.length < 2) {
		return [crowdData[0], crowdData[0]]
	}

	let index1 = NumberUtils.clamp(NumberUtils.getRandomInteger(0, result.length), 0, result.length - 1)
	let index2 = index1
	while (index2 == index1) {
		index2 = NumberUtils.clamp(NumberUtils.getRandomInteger(0, result.length), 0, result.length - 1)
	}

	return [result[index1], result[index2]]
}


let _generateSoldiers = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		buildCategoryNameFunc,
		initialAttributesFunc,
	],
	factor,
	modelName,
	categoryName,
	shadowQueue,
	modelQueue,
	camp_,
	attackTarget_,
	crowdPositions
): Promise<state> => {
	// let scalar = getCrowdScalarFunc(state)

	// let crowdCountFactor = getCrowdCountFactorFunc(state)
	// if (isGiantessRoad(state)) {
	// 	crowdCountFactor = GiantessArmyManager.getSoldierCrowdCountFactor(state)
	// }
	// else {
	// 	crowdCountFactor = LittleManArmyManager.getSoldierCrowdCountFactor(state)
	// }

	// const maxVisibleCount = NumberUtils.greaterThan(Math.floor(20 * scalar), 1)
	// const crowdCount = NumberUtils.greaterThan(Math.floor(crowdCountFactor * scalar), 1)
	// const offsetFactor = NumberUtils.greaterThan(Math.floor(5 * Math.max(scalar / 2, 1)), 5)

	const maxVisibleCount = Math.floor(NumberUtils.greaterThan(getMaxVisibleCountFunc(state) * factor, 1))
	const crowdCount = Math.floor(NumberUtils.greaterThan(getCrowdCountFunc(state) * factor, 1))
	// const offsetFactor = Math.floor(NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 5))
	const offsetFactor = Math.floor(NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 0))


	let modelData = getModelData(state, modelName)

	let initialTransform = new Matrix4().compose(
		new Vector3(0, 0, 0),
		// new Quaternion(),
		// new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)),
		// modelData.quaternion.clone(),
		Soldier.getInitialQuaternion(state, modelName).clone(),
		// new Vector3().set(1, 1, 1).multiplyScalar(0.23)
		new Vector3().setScalar(modelData.scalar)
	)

	// let crowdData = _randomSelectTwoCrowdData(state, Soldier.getCrowdData(state)).map(position => {
	// 	return {
	// 		name: "",
	// 		position,
	// 		userData: null
	// 	}
	// })

	let crowdData = crowdPositions.map(position => {
		return {
			name: "",
			position,
			userData: null
		}
	})



	// let crowdData = [ {
	// 	name: "",
	// 	position: new Vector3(
	// 		-300, 0, -80
	// 	),
	// 	userData: null
	// } ]


	// let shadowQueue = Rocketeer.getShadowQueue(state)

	return _generate(state,
		[
			(state,
				initialTransform,
				crowds,
				crowdCount,
				queue,
			) => {
				return generateCharacterCrowd(state,
					[
						buildCategoryNameFunc,
						initialAttributesFunc
					],
					initialTransform,
					crowds,
					crowdCount,
					queue,
					// Rocketeer.getShadowQueue(state),
					shadowQueue,
					Soldier.getClipData(state, categoryName),
				)
			},
			(state, index, newPos) => {
				updateShadow(shadowQueue, index, newPos)

				let name = modelQueue.names[index]

				state = setCamp(state, name, camp_)
				state = setAttackTarget(state, name, attackTarget_)

				return state
			},
			Soldier.getStateMachine
		],
		// Rocketeer.getModelQueue(state),
		modelQueue,
		initialTransform,
		crowdData,
		[
			maxVisibleCount,
			crowdCount,
			offsetFactor,
		]
	)
}

export let getMaxVisibleCount = (state: state) => {
	if (isGiantessRoad(state)) {
		return GiantessArmyManager.getMaxVisibleCount(state)
	}
	else {
		return LittleManArmyManager.getMaxVisibleCount(state)
	}
}

export let getCrowdCount = (state: state) => {
	if (isGiantessRoad(state)) {
		return GiantessArmyManager.getCrowdCount(state)
	}
	else {
		return LittleManArmyManager.getCrowdCount(state)
	}
}

export let getOffsetFactor = (state: state) => {
	if (isGiantessRoad(state)) {
		return GiantessArmyManager.getOffsetFactor(state)
	}
	else {
		return LittleManArmyManager.getOffsetFactor(state)
	}
}

export let getCrowdPositions = (state: state) => {
	return _randomSelectTwoCrowdData(state, Soldier.getCrowdData(state))
}

export let generateRocketeers = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor,
	camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
	return _generateSoldiers(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Rocketeer.buildCategoryName,
		Rocketeer.initialAttributes,
	],
		factor,
		modelName.Rocketeer,
		Rocketeer.buildCategoryName(),
		Rocketeer.getShadowQueue(state),
		Rocketeer.getModelQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateInfantrys = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
	return _generateSoldiers(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Infantry.buildCategoryName,
		Infantry.initialAttributes,
	],
		factor,
		modelName.Infantry,
		Infantry.buildCategoryName(),
		Infantry.getShadowQueue(state),
		Infantry.getModelQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateLaserers = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
	return _generateSoldiers(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Laserer.buildCategoryName,
		Laserer.initialAttributes,
	],
		factor,
		modelName.Laserer,
		Laserer.buildCategoryName(),
		Laserer.getShadowQueue(state),
		Laserer.getModelQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateCommanders = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
	return _generateSoldiers(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Commander.buildCategoryName,
		Commander.initialAttributes,
	],
		factor,
		modelName.Commander,
		Commander.buildCategoryName(),
		Commander.getShadowQueue(state),
		Commander.getModelQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateMelees = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
	return _generateSoldiers(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Melee.buildCategoryName,
		Melee.initialAttributes,
	],
		factor,
		modelName.Melee,
		Melee.buildCategoryName(),
		Melee.getShadowQueue(state),
		Melee.getModelQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateSoldiers = (state: state): Promise<state> => {
	return generateRocketeers(state,
		[
			getMaxVisibleCount,
			getCrowdCount,
			getOffsetFactor
		],
		getCrowdPositions(state),
		0.2
	).then(state => generateInfantrys(state,
		[
			getMaxVisibleCount,
			getCrowdCount,
			getOffsetFactor
		],
		getCrowdPositions(state),
		0.2)).then(state => generateLaserers(state,
			[
				getMaxVisibleCount,
				getCrowdCount,
				getOffsetFactor
			],
			getCrowdPositions(state),
			0.2)).then(state => generateCommanders(state,
				[
					getMaxVisibleCount,
					getCrowdCount,
					getOffsetFactor
				],
				getCrowdPositions(state),
				0.1)).then(state => generateMelees(state,
					[
						getMaxVisibleCount,
						getCrowdCount,
						getOffsetFactor
					],
					getCrowdPositions(state),
					0.3))
}

let _generateMilltaryVehicles = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		buildNamePrefixFunc,
		initialAttributesFunc,
	],
	factor,
	categoryName,
	modelName,
	modelAllQueues,
	bodyQueue,
	camp_,
	attackTarget_,
	crowdPositions
): Promise<state> => {
	// let scalar = getCrowdScalarFunc(state)

	// let crowdCountFactor
	// if (isGiantessRoad(state)) {
	// 	crowdCountFactor = GiantessArmyManager.getMilltaryVehicleCrowdCountFactor(state)
	// }
	// else {
	// 	crowdCountFactor = LittleManArmyManager.getMilltaryVehicleCrowdCountFactor(state)
	// }


	// const maxVisibleCount = NumberUtils.greaterThan(Math.floor(10 * scalar), 1)
	// const crowdCount = NumberUtils.greaterThan(Math.floor(crowdCountFactor * scalar), 1)
	// const offsetFactor = NumberUtils.greaterThan(Math.floor(5 * Math.max(scalar / 2, 1)), 5)

	const maxVisibleCount = Math.floor(NumberUtils.greaterThan(getMaxVisibleCountFunc(state) * factor, 1))
	const crowdCount = Math.floor(NumberUtils.greaterThan(getCrowdCountFunc(state) * factor, 1))
	// const offsetFactor = Math.floor(NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 5))
	const offsetFactor = Math.floor(NumberUtils.greaterThan(getOffsetFactorFunc(state) * factor, 0))


	// let initialTransform = new Matrix4().compose(
	// 	new Vector3(0, 0, 0),
	// 	new Quaternion(-0.707, 0.0, 0, 0.707),
	// 	new Vector3().set(1, 1, 1)
	// 		.multiplyScalar(5)
	// 		.multiplyScalar(0.025)
	// )

	let modelData = MilltaryVehicleData.getModelData(state, modelName)

	let initialTransform = new Matrix4().compose(
		new Vector3(0, 0, 0),
		MilltaryVehicle.getInitialQuaternion(state, modelName).clone(),
		new Vector3().setScalar(modelData.scalar)
	)


	// let crowdData = _randomSelectTwoCrowdData(state, MilltaryVehicle.getCrowdData(state)).map(position => {
	// 	return {
	// 		name: "",
	// 		position,
	// 		userData: null
	// 	}
	// })
	let crowdData = crowdPositions.map(position => {
		return {
			name: "",
			position,
			userData: null
		}
	})

	return _generate(state,
		[
			(state,
				initialTransform,
				crowds,
				crowdCount,
				queue,
			) => {
				return generateVehicleCrowd(
					state,
					[
						// Tank.buildTankNamePrefix,
						// Tank.initialAttributes,
						buildNamePrefixFunc,
						initialAttributesFunc,
					],
					// Tank.getModelAllQueues(state),
					modelAllQueues,
					MilltaryVehicle.getAllQueueLocalMatrices(state, categoryName),
					initialTransform,
					crowds,
					crowdCount
				)
			},
			(state, index, newPos) => {
				state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, index, true))

				let name = bodyQueue.names[index]
				state = setCamp(state, name, camp_)
				state = setAttackTarget(state, name, attackTarget_)

				return state
			},
			MilltaryVehicle.getStateMachine
		],
		// Tank.getTankBodyQueue(state),
		bodyQueue,
		initialTransform,
		crowdData,
		[
			maxVisibleCount,
			crowdCount,
			offsetFactor,
		]
	)
}

export let generateTanks = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess): Promise<state> => {
	return _generateMilltaryVehicles(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		Tank.buildTankNamePrefix,
		Tank.initialAttributes,
	],
		factor,
		Tank.buildTankCategoryName(),
		MilltaryVehicleData.modelName.Tank,
		Tank.getModelAllQueues(state),
		Tank.getTankBodyQueue(state),
		camp_,
		attackTarget_,
		crowdPositions,
	)
}

export let generateMissileVehicles = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess): Promise<state> => {
	return _generateMilltaryVehicles(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		MissileVehicle.buildMissileVehicleNamePrefix,
		MissileVehicle.initialAttributes,
	],
		factor,
		MissileVehicle.buildMissileVehicleCategoryName(),
		MilltaryVehicleData.modelName.MissileVehicle,
		MissileVehicle.getModelAllQueues(state),
		MissileVehicle.getMissileVehicleBodyQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateFlameVehicles = (state: state,
	[
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
	],
	crowdPositions,
	factor, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess): Promise<state> => {
	return _generateMilltaryVehicles(state, [
		getMaxVisibleCountFunc,
		getCrowdCountFunc,
		getOffsetFactorFunc,
		FlameVehicle.buildFlameVehicleNamePrefix,
		FlameVehicle.initialAttributes,
	],
		factor,
		FlameVehicle.buildFlameVehicleCategoryName(),
		MilltaryVehicleData.modelName.FlameVehicle,
		FlameVehicle.getModelAllQueues(state),
		FlameVehicle.getFlameVehicleBodyQueue(state),
		camp_,
		attackTarget_,
		crowdPositions
	)
}

export let generateMilltaryVehicles = (state: state): Promise<state> => {
	return generateTanks(state,
		[
			getMaxVisibleCount,
			getCrowdCount,
			getOffsetFactor
		],
		getCrowdPositions(state),
		0.2).then(state => generateMissileVehicles(state,
			[
				getMaxVisibleCount,
				getCrowdCount,
				getOffsetFactor
			],
			getCrowdPositions(state),
			0.15)).then(state => generateFlameVehicles(state,
				[
					getMaxVisibleCount,
					getCrowdCount,
					getOffsetFactor
				],
				getCrowdPositions(state),
				0.15))
}

let _generateArmy = (state: state): Promise<state> => {
	let loopCount = 2000

	if (isEnter(state) || (getIsDebug(state) && getIsNotTestPerf(state))) {
		// return Promise.resolve(_generateArmy(state))
		// return Promise.resolve(state)


		return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
			return _generateArmy(state)
		}, loopCount)))
	}

	return generateSoldiers(state).then(generateMilltaryVehicles).then(state => {
		return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
			return _generateArmy(state)
			// }, 100))
		}, loopCount))
	})
}

export let initWhenImportScene = (state: state) => {
	return _generateArmy(state)
}



export let updateParticleCollision = (state: state, [

	// emitFunc,

	handleHitStaticFunc,
	handleHitGirlFunc,
	handleHitArmyFunc,
	handleHitLittleManFunc,

	getAllParticlesForCollisionCheckFunc,

	getPointBoxFunc,
	getRangePointBoxFunc,

	removeParticleFunc,
],
	{
		force, type,
		emitterSize,
	}: weaponValue,
) => {
	let halfSizeScalar
	let halfSize = new Vector3().setScalar(emitterSize / 5)
	switch (getParticleNeedCollisionCheckLoopCount(state)) {
		case particleNeedCollisionCheckLoopFrames.One:
			halfSizeScalar = 1
			break
		case particleNeedCollisionCheckLoopFrames.Two:
			halfSizeScalar = 1.5
			break
		case particleNeedCollisionCheckLoopFrames.Three:
			halfSizeScalar = 2
			break
		case particleNeedCollisionCheckLoopFrames.Four:
			halfSizeScalar = 2.5
			break
	}
	halfSize.multiplyScalar(halfSizeScalar)

	let [count, allParticlesForCollisionCheck] = getAllParticlesForCollisionCheckFunc(getAbstractState(state))

	return ArrayUtils.reducePromise(allParticlesForCollisionCheck, (state, particle: shellParticle | bulletParticle | rocketParticle | missileVehicleMissileParticle, i) => {
		if (i >= count) {
			return Promise.resolve(state)
		}

		state = setParticleNeedCollisionCheckLoopCount(state, particle)

		// let point = new Vector3().fromArray(particle.position)
		let pointPosition = particle.position
		let pointPositionVec = new Vector3().fromArray(pointPosition)
		let pointBox = getPointBoxFunc(state, pointPositionVec, halfSize, halfSizeScalar, particle)

		// _b.setFromCenterAndSize(
		// 	pointPositionVec,
		// 	halfSize
		// )

		if (!NullableUtils.isNullable(getRangePointBoxFunc)) {
			getRangePointBoxFunc = NullableUtils.getExn(getRangePointBoxFunc)

			return handleAllCollisions(
				state, [
				handleHitStaticFunc,
				handleHitGirlFunc,
				handleHitArmyFunc,
				handleHitLittleManFunc,
				removeParticleFunc,
			],
				force, type,
				damageType.Normal,
				pointBox,
				pointBox,
				pointPosition,
				pointPositionVec,
				particle,
				false,
				false
			).then(([state, isCollisioned]) => {
				if (!isCollisioned) {
					return state
				}

				return handleAllCollisions(
					state, [
					handleHitStaticFunc,
					handleHitGirlFunc,
					handleHitArmyFunc,
					handleHitLittleManFunc,
					removeParticleFunc,
				],
					force, type,
					damageType.Normal,
					getRangePointBoxFunc(state, pointBox),
					pointBox,
					pointPosition,
					pointPositionVec,
					particle,
					true,
					true
				).then(TupleUtils.getTuple2First)
			})
		}

		return handleAllCollisions(
			state, [
			handleHitStaticFunc,
			handleHitGirlFunc,
			handleHitArmyFunc,
			handleHitLittleManFunc,
			removeParticleFunc,
		],
			force, type,
			damageType.Normal,
			pointBox,
			pointBox,
			pointPosition,
			pointPositionVec,
			particle,
			false,
			true
		).then(TupleUtils.getTuple2First)
	}, state)
}

export let getPointBoxForParticle = (state: state, pointPositionVec, halfSize, halfSizeScalar, particle) => {
	return _b.setFromCenterAndSize(
		pointPositionVec,
		halfSize
	)
}

let _getPointBoxForInstanceParticle = (state: state, getBoxFunc, halfSizeScalar, particle: rocketParticle,) => {
	return getBoxFunc(getAbstractState(state), particle.id).expandByScalar(
		// Math.max(
		// 	halfSizeScalar,
		// 	// 1
		// 	0.1
		// )
		halfSizeScalar
	)
}

export let getPointBoxForRocket = (state: state, pointPositionVec, halfSize, halfSizeScalar, particle: rocketParticle) => {
	// return _getPointBoxForInstanceParticle(state, getBox, halfSizeScalar * 0.7, particle)
	// return _getPointBoxForInstanceParticle(state, getBox, halfSizeScalar * 0.3, particle)
	// return _getPointBoxForInstanceParticle(state, getBox, halfSizeScalar * 0.1, particle)
	return _getPointBoxForInstanceParticle(state, getBox, 0, particle)
	// .expandByVector(
	// 	// _v1.set(0.7, 0, 0.7)
	// 	_v1.set(1, 0, 1)
	// )
}

export let getRangePointBoxForRocket = (state: state, pointBox) => {
	// return _getPointBoxForInstanceParticle(state, getBox, halfSizeScalar * 0.7, particle)
	return pointBox.clone()
		.expandByVector(
			// _v1.set(0.7, 0, 0.7)
			_v1.set(2, 1, 2)
		)
}

export let getPointBoxForMissile = (state: state, pointPositionVec, halfSize, halfSizeScalar, particle: rocketParticle) => {
	// return _getPointBoxForInstanceParticle(state, MissileVehicleMissileEmitter.getBox, halfSizeScalar * 0.7, particle)
	return _getPointBoxForInstanceParticle(state, MissileVehicleMissileEmitter.getBox, halfSizeScalar * 0.3, particle)
}

export let getRangePointBoxForMissile = (state: state, pointBox) => {
	return pointBox.clone()
		.expandByVector(
			_v1.set(4, 2, 4)
		)
}

export let removeParticle = (state: state, particle) => {
	ParticleManager.markParticleRemove(particle)

	return state
}

export let removeParticleAndRocket = (state: state, particle) => {
	return setAbstractState(state, remove(getAbstractState(state), particle))
}

export let removeParticleAndMissile = (state: state, particle) => {
	return setAbstractState(state, MissileVehicleMissileEmitter.remove(getAbstractState(state), particle))
}

export let update = (state: state) => {
	return updateParticleCollision(state, [NullableUtils.return_(handleBasicBulletHitStatic),
		handleBasicBulletHitGirl,
	NullableUtils.getEmpty(),
		handleBasicBulletHitLittleMan,
	ParticleManager.getAllBulletParticlesForCollisionCheck,
		getPointBoxForParticle,
	NullableUtils.getEmpty(),
		removeParticle
	],
		BasicBulletGun.getValue(state),
	).then(state => {
		return updateParticleCollision(state, [NullableUtils.return_(handleRocketHitStatic),
			handleRocketHitGirl,
		NullableUtils.getEmpty(),
			handleRocketHitLittleMan,
		ParticleManager.getAllRocketParticlesForCollisionCheck,
			getPointBoxForRocket,
		NullableUtils.return_(getRangePointBoxForRocket),
			removeParticleAndRocket
		],
			RocketGun.getValue(state),
		)
	}).then(state => {
		return updateParticleCollision(state, [
			NullableUtils.return_(handleLaserHitStatic),
			handleLaserHitGirl,
			NullableUtils.getEmpty(),
			handleLaserHitLittleMan,
			ParticleManager.getAllLaserBulletParticlesForCollisionCheck,
			getPointBoxForParticle,
			NullableUtils.getEmpty(),
			removeParticle
		],
			LaserGun.getValue(state),
		)
	}).then(state => {
		return updateParticleCollision(state, [
			NullableUtils.return_(handlePropBulletHitStatic),
			handlePropBulletHitGirl,
			NullableUtils.getEmpty(),
			handlePropBulletHitLittleMan,
			ParticleManager.getAllPropBulletParticlesForCollisionCheck,
			getPointBoxForParticle,
			NullableUtils.getEmpty(),
			removeParticle
		],
			PropBulletGun.getValue(state)
		)
	}).then(state => {
		return updateParticleCollision(state, [
			NullableUtils.return_(handleShellHitStatic),
			handleShellHitGirl,
			NullableUtils.getEmpty(),
			handleShellHitLittleMan,
			ParticleManager.getAllShellParticlesForCollisionCheck,
			getPointBoxForParticle,
			NullableUtils.getEmpty(),
			removeParticle
		],
			ShellGunBarrel.getValue(state)
		)
	}).then(state => {
		return updateParticleCollision(state, [
			NullableUtils.return_(handleMissileHitStatic),
			handleMissileHitGirl,
			NullableUtils.getEmpty(),
			handleMissileHitLittleMan,
			ParticleManager.getAllMissileVehicleMissileParticlesForCollisionCheck,
			getPointBoxForMissile,
			NullableUtils.return_(getRangePointBoxForMissile),
			removeParticleAndMissile
		],
			MissileRack.getValue(state),
		)
	})
}

// export let checkCollisionWithArmy = (state: state, box: Box3, camp: camp): nullable<[Matrix4, Box3, name]> => {
// 	let allContainers = _getAllContainers(state)
// 	let abstactState = getAbstractState(state)

// 	let data = allContainers.reduce((data, container) => {
// 		if (!NullableUtils.isNullable(data[0])) {
// 			return data
// 		}

// 		return container.queryByBoxAndCamp(abstactState, getCampExn, state, box, camp)
// 	}, [null, null, null])

// 	if (NullableUtils.isNullable(data[0])) {
// 		return NullableUtils.getEmpty()
// 	}

// 	return NullableUtils.return_([
// 		NullableUtils.getExn(data[0]),
// 		NullableUtils.getExn(data[1]),
// 		NullableUtils.getExn(data[2])
// 	])
// }

// export let checkRangeCollisionWithArmy = (state: state, box: Box3, camp: camp): [Array<Matrix4>, Array<Box3>, Array<name>] => {
// export let checkRangeCollisionWithArmy = (state: state, box: Box3, camp: camp): Array<[Matrix4, Box3, name]> => {
// 	let allContainers = _getAllContainers(state)
// 	let abstactState = getAbstractState(state)

// 	return ArrayUtils.zip(...allContainers.reduce<any>(([transforms, boxes, names], container) => {
// 		return container.queryRangeByBoxAndCamp(abstactState, getCampExn, state, box, camp, transforms, boxes, names)
// 	}, [[], [], []]))
// }

// export let handleHitLittleMan = (state: state,
// 	[removeParticleFunc, handleHitLittleManFunc],
// 	pointBox,
// 	particle, pointPositionVec,
// 	pointPosition,
// 	force, type
// ) => {
// 	if (isCollisionWithLittleMan(state, pointBox)) {
// 		return handleHitLittleManFunc(
// 			state, (state) => {
// 				return handleCollisionWithLittleMan(state,
// 					removeParticleFunc,
// 					particle, pointPositionVec,
// 					[LittleMan.getName()],
// 					particle.fromName,
// 					[force, damageType.Normal, type])
// 			}, pointPosition,
// 			pointBox,
// 			particle.direction
// 		)
// 	}
// }

