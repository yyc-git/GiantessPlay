import { LOD } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import * as Soldier from "../city1/soldier/Soldier"
import * as Infantry from "../city1/soldier/Infantry"
import * as Rocketeer from "../city1/soldier/Rocketeer"
import * as Laserer from "../city1/soldier/Laserer"
import * as Commander from "../city1/soldier/Commander"
import * as Melee from "../city1/soldier/Melee"
import * as MilltaryVehicle from "../city1/milltary_vehicle/MilltaryVehicle"
import * as Tank from "../city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../city1/milltary_vehicle/FlameVehicle"
import * as BasicBulletGun from "../../weapon/BasicBulletGun"
import * as PropBulletGun from "../../weapon/PropBulletGun"
import * as RocketGun from "../../weapon/RocketGun"
import * as MissileRack from "../../weapon/MissileRack"
import * as LaserGun from "../../weapon/LaserGun"
import * as ShellGunBarrel from "../../weapon/ShellGunBarrel"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { generateCharacterCrowd, generateVehicleCrowd } from "../city1/WholeScene"
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
import { bulletParticle, crowdSize, missileVehicleMissileParticle, rocketParticle, shellParticle, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { checkParticleCollisionWithStatic, getParticleNeedCollisionCheckLoopCount, setParticleNeedCollisionCheckLoopCount } from "../../utils/ArmyUtils"
import { armyCount, attackRange, attackTarget, camp, damageType, difficulty, particleNeedCollisionCheckLoopFrames } from "../../type/StateType"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { queryAllOBBShapesCollisionWithBox } from "../../girl/Collision"
import * as Girl from "../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { armyValue, weaponValue } from "../../data/ValueType"
import { getIsDebug, getIsNotTestPerf } from "../../../Scene"
import { getBiwuSetting, getGiantessSetting, getLittleManSetting, isGiantessRoad } from "../../CityScene"
import { handleCollisionWithEmitterCollisionableContainers, isInGirlAttackRange } from "../../utils/CollisionUtils"
import * as GiantessArmyManager from "../city1/giantess/ArmyManager"
import * as LittleManArmyManager from "../city1/little_man/ArmyManager"
import { handlePropBulletHitArmy, handlePropBulletHitGirl, handlePropBulletHitLittleMan, handlePropBulletHitStatic } from "../../little_man/Gun"
import { getModelData, modelName } from "../../army_data/SoldierData"
import * as MilltaryVehicleData from "../../army_data/MilltaryVehicleData"
import { handleRocketHitArmy, handleRocketHitGirl, handleRocketHitLittleMan, handleRocketHitStatic } from "../city1/soldier/weapon/Rocket"
import { handleBasicBulletHitArmy, handleBasicBulletHitGirl, handleBasicBulletHitLittleMan, handleBasicBulletHitStatic } from "../city1/soldier/weapon/BasicBullet"
import { getBox, remove } from "meta3d-jiehuo-abstract/src/particle/instance/RocketEmitter"
import * as MissileVehicleMissileEmitter from "meta3d-jiehuo-abstract/src/particle/instance/MissileVehicleMissileEmitter"
import { handleLaserHitArmy, handleLaserHitGirl, handleLaserHitLittleMan, handleLaserHitStatic } from "../city1/soldier/weapon/Laser"
import { handleShellHitGirl, handleShellHitLittleMan, handleShellHitStatic } from "../city1/milltary_vehicle/weapon/Shell"
import { handleMissileHitGirl, handleMissileHitLittleMan, handleMissileHitStatic } from "../city1/milltary_vehicle/weapon/Missile"
import { generateCommanders, generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateTanks, getPointBoxForMissile, getPointBoxForParticle, getPointBoxForRocket, getRangePointBoxForMissile, getRangePointBoxForRocket, removeParticle, removeParticleAndMissile, removeParticleAndRocket, updateParticleCollision } from "../city1/ArmyManager"
import { Event } from "meta3d-jiehuo-abstract"
import { getPickdownFromIdleWorkEventName } from "../../../../../utils/EventUtils"
import { generateTurrets as generateShellTurrets } from "../city1/milltary_building/ShellTurret"
import { generateTurrets as generateMissileTurrets } from "../city1/milltary_building/MissileTurret"
import { getPickdownArmyDataExn, setPickdownArmyData } from "./scenario/Command"

// TODO duplicate

const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

export let generateSoldiers = (state, func, count, point, offset = 5) => {
    return func(state,
        [
            // (state) => count,
            (state) => 50,
            (state) => Math.round(count),
            (state) => offset,
        ],
        // [point.clone().setY(0)],
        [point],
        1,
        camp.Giantess,
        attackTarget.LittleMan
    )
}

export let generateMilltaryVehicles = generateSoldiers

export let generateMilltaryBuildings = (state, func, count, point, offset) => {
    return func(state,
        // [point.clone().setY(0)],
        [point],
        camp.Giantess,
        attackTarget.LittleMan
    ).then(([state, _]) => state)
}

let _pickdownArmyWorkEndHandler = (state: state, { userData }) => {
    let { point } = NullableUtils.getExn(userData)

    let [index, _] = getPickdownArmyDataExn(state)

    let factor
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
            factor = 0.5
            break
        case difficulty.Easy:
            factor = 0.8
            break
        case difficulty.Middle:
            factor = 1
            break
        case difficulty.Hard:
            factor = 1.5
            break
        case difficulty.VeryHard:
            factor = 2
            break
    }

    let generateIndex
    if (index <= 3) {
        generateIndex = NumberUtils.getRandomInteger(1, 3)
    }
    else if (index <= 7) {
        generateIndex = NumberUtils.getRandomInteger(4, 7)
    }
    else {
        generateIndex = index
    }

    let promise
    switch (generateIndex) {
        case 1:
            promise = ArrayUtils.reducePromise([generateMelees], (state, func) => {
                return generateSoldiers(state, func, 2 * factor, point)
            }, state)
            break
        case 2:
            promise = generateSoldiers(state, generateInfantrys, 3 * factor, point)
            break
        case 3:
            promise = ArrayUtils.reducePromise([generateTanks, generateFlameVehicles], (state, func) => {
                return generateMilltaryVehicles(state, func, 1 * factor, point)
            }, state)
            break
        case 4:
            promise = ArrayUtils.reducePromise([generateRocketeers, generateLaserers, generateInfantrys, generateMelees, generateCommanders], (state, func) => {
                return generateSoldiers(state, func, 2 * factor, point, 8)
            }, state)
            break
        case 5:
            promise = ArrayUtils.reducePromise([generateTanks, generateFlameVehicles, generateMissileVehicles], (state, func) => {
                return generateMilltaryVehicles(state, func, 1 * factor, point, 8)
            }, state)
            break
        case 6:
            promise = ArrayUtils.reducePromise([generateRocketeers, generateLaserers, generateInfantrys, generateMelees], (state, func) => {
                return generateSoldiers(state, func, 2 * factor, point)
            }, state).then(state => generateMilltaryBuildings(state, generateShellTurrets, 1, point, 1))
            break
        case 7:
            promise = generateMilltaryBuildings(state, generateMissileTurrets, 1, point, 1)
            break
        case 8:
            promise = ArrayUtils.reducePromise([generateRocketeers, generateLaserers, generateInfantrys, generateMelees], (state, func) => {
                return generateSoldiers(state, func, 4 * factor, point, 15)
            }, state)
            break
        default:
            throw new Error("err")
    }

    return promise.then(state => {
        return setPickdownArmyData(state, index, true)
    })
}

export let initWhenImportScene = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getPickdownFromIdleWorkEventName(), _pickdownArmyWorkEndHandler))

    return Promise.resolve(state)
}

export let update = (state: state) => {
    return updateParticleCollision(state, [
        NullableUtils.return_(handleBasicBulletHitStatic),
        handleBasicBulletHitGirl,
        NullableUtils.return_(handleBasicBulletHitArmy),
        // NullableUtils.getEmpty(),
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
        NullableUtils.return_(handleRocketHitArmy),
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
            NullableUtils.return_(handleLaserHitArmy),
            // NullableUtils.getEmpty(),
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
            // NullableUtils.return_(handleShellHitArmy),
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
            // NullableUtils.return_(handleMissileHitArmy),
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

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getPickdownFromIdleWorkEventName(), _pickdownArmyWorkEndHandler))

    return state
}