import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState, writeState } from "../../../../../../state/State"
import { cameraType, state } from "../../../../../../type/StateType"
import * as Girl from "../../../girl/Girl"
import * as GirlBiwuLevel1 from "./Girl"
import * as LittleMan from "../../../little_man/LittleMan"
import * as LittleManTransform from "../../../little_man/Transform"
import * as Terrain from "../../city1/Terrain"
import * as MapWall from "../../city1/MapWall"
import * as TreesAndProps from "../../city1/TreesAndProps"
import * as Mountains from "../../city1/Mountains"
// import * as Grass1 from "../../city1/Grass1"
import * as Buildings from "../../city1/Buildings"
import * as Cars from "../../city1/Cars"
// import * as WindMills from "../../city1/WindMills"
// import * as DynamicCars from "../../city1/DynamicCars"
import * as WholeScene from "../../city1/WholeScene"
import * as Mission from "../../city1/Mission"
// import * as Citiyzen from "../../city1/Citiyzen"
import * as Army from "../../city1/Army"
import * as Soldier from "../../city1/soldier/Soldier"
import * as SoldierBiwu from "../Soldier"
import * as MilltaryVehicleBiwu from "../MilltaryVehicle"
import * as MilltaryBuildingBiwu from "../MilltaryBuilding"
import * as Infantry from "../../city1/soldier/Infantry"
import * as Rocketeer from "../../city1/soldier/Rocketeer"
import * as Laserer from "../../city1/soldier/Laserer"
import * as Commander from "../../city1/soldier/Commander"
import * as Melee from "../../city1/soldier/Melee"
import * as MilltaryVehicle from "../../city1/milltary_vehicle/MilltaryVehicle"
import * as Tank from "../../city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../../city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../../city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "../../city1/milltary_building/MilltaryBuilding"
import * as ShellTurret from "../../city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../city1/milltary_building/MissileTurret"
import * as PathFind from "../../biwu/PathFind"
import * as ArmyManager from "../../biwu/ArmyManager"
import { getAnimationBlendDataParam, getBiwuSetting, getCharacterBloodResourceId, getCharacterShadowResourceId, getConfigData, getGirlScale, getLevelData, getLevelDataExn, getName, getScene, isLittleRoad, setBehaviourTreeData, setConfigData, setLevelData, setLittleManSettingLittleManStrength, setRoad } from "../../../CityScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
// import { GrassInstance } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { dispose as disposeStaticDynamic, registerDamageData, registerDamageGiantessFunc } from "../../../StaticDynamic"
// import { isThirdPersonCamera } from "../../../Camera"
import * as Camera from "../../../Camera"
import { isEnter } from "../../../scenario/ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { getKeyDownEventName } from "meta3d-jiehuo-abstract/src/Event"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as UI from "../../../UI"
import * as BehaviourTreeManager from "../../../data/biwu/level1/behaviour_tree_data/BehaviourTreeManager"
import { physicsLevel, resourceType, road } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as BehaviourTreeData from "../../../data/biwu/level1/behaviour_tree_data/BehaviourTreeData"
import * as GirlData from "../../../data/biwu/level1/GirlData"
import * as LittleManData from "../../../data/biwu/level1/LittleManData"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData } from "../../../girl/PickPose"
import { getCurrentAnimationName, isChangeScaling } from "../../../girl/Animation"
import { isPose } from "../../../girl/Pose"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { getBone } from "../../../utils/MMDUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getPivotWorldPosition } from "../../../girl/Utils"
import { Euler, Quaternion, Vector3 } from "three"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getAllMMDData, getClothHpData } from "../../../data/biwu/level1/mmd/MMDData"
import { getAllAnimationNames } from "../../../data/biwu/level1/AnimationNames"
import { getAnimationFrameCountMap } from "../../../data/biwu/level1/Const"
import { getAnimationBlendData } from "../../../data/biwu/level1/Data"
import { getAnimationCollisionDataParam } from "../../../girl/Collision"
import { getAnimationCollisionData } from "../../../data/biwu/level1/Data"
import { Flow } from "meta3d-jiehuo-abstract"
import { getActionNodeId, getIdExn, markWhetherNotExecuteGiantessAI, resetFinish, setTarget } from "../../../behaviour_tree/BehaviourTreeManager"
import { animationName } from "../../../data/biwu/level1/DataType"
import { triggerMainEvent } from "../../../game_event/GameEvent"
import * as GameEventData from "../../../data/biwu/level1/GameEventData"
import * as ScenarioData from "../../../data/biwu/level1/ScenarioData"
import { getHeavyStressingSoundResourceId, parseAllWeaponModelsAndEnableAllParticls } from "../../city1/ManageScene"
import { getExitScenarioEventName } from "../../../../../../utils/EventUtils"
import * as Utils from "../Utils"
import { getAllAliveMilltaryBuildingData, getAllAliveMilltaryVehicleData, getAllAliveSoldierData } from "../../../behaviour_tree/action_node/SelectTarget"
import { isFinish } from "../../../scenario/Command"
import { getPickdownArmyData, setPickdownArmyData } from "../scenario/Command"
import { List } from "immutable"
import { difficulty, littleManStrength, propName, propType } from "../../../type/StateType"
import { disposeLookat, headLookat } from "../../../girl/Lookat"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../../utils/EventUtils"
import { handleMissionFail } from "../../city1/little_man/Mission"
import { handleMissionComplete } from "../../city1/giantess/Mission"
import { getIsDebug } from "../../../../Scene"
import { isAllowMoveCollision } from "../../../girl/Move"
import { getDefaultAllCollisionParts, setAllCollisionParts } from "../../../utils/CollisionUtils"
import * as CollisionShapeData from "../../../data/CollisionShapeData"

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();

let _parseAndAddResources = (state: state) => {
    return Terrain.parseAndAddResources(state)
}

// let _exitScenarioHandler = (state: state, { userData }) => {
//     let { id, result } = NullableUtils.getExn(userData)

//     // if (result == behaviourTreeNodeExecuteResult.Fail) {
//     // throw new Error("err")
//     // }

//     switch (id) {
//         case WalkToTargetPosition.getId():
//             return PickdownArmy.pickdownArmy(state, PickdownArmy.getId(), NullableUtils.getEmpty())
//                 .then(([state, result]) => {
//                     if (result == behaviourTreeNodeExecuteResult.Fail) {
//                         throw new Error("err")
//                     }

//                     return state
//                 })
//         case PickdownArmy.getId():
//             state = resetFinish(state)
//             break
//     }

//     return Promise.resolve(state)
// }

let _exitScenarioHandler = (state: state, { userData }) => {
    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        state = Girl.setIsOnlyDamageLittleMan(state, true)
        state = setLevelData(state, _buildGirlNotDamageKey(), true)
        state = isAllowMoveCollision(state, false)

        return triggerMainEvent(state, GameEventData.eventName.PickdownArmy1)
    }, 1))

    // state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
    // }, 10))

    return Promise.resolve(state)
}

let _buildGirlNotDamageKey = () => "GirlNotDamage"

export let isGirlNotDamage = (state: state) => {
    return NullableUtils.getWithDefault(
        getLevelData(state, _buildGirlNotDamageKey()),
        false
    )
}

export let initProp = (state, factor) => {
    // const bulletCount = Infinity

    let bulletCount
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
            bulletCount = Infinity
            break
        case difficulty.Easy:
            bulletCount = 99
            break
        case difficulty.Middle:
            bulletCount = 25 * factor
            break
        case difficulty.Hard:
            bulletCount = 20 * factor
            break
        case difficulty.VeryHard:
            bulletCount = 17 * factor
            break
    }

    if (getIsDebug(state)) {
        bulletCount = Infinity
    }

    return LittleMan.setLittleManState(state, {
        ...LittleMan.getLittleManState(state),
        props: List([
            {
                name: propName.BasicBullet,
                count: Infinity,
                type: propType.Bullet
            },
            {
                name: propName.LaserBullet,
                count: bulletCount,
                type: propType.Bullet
            },
            {
                name: propName.RocketBullet,
                count: Math.round(bulletCount / 1.3),
                // count: Math.round(bulletCount),
                type: propType.Bullet
            },

            {
                name: propName.BiggerBullet,
                count: 0,
                type: propType.Bullet
            },
            {
                name: propName.SmallestBullet,
                count: 0,
                type: propType.Bullet
            },
        ])
    })
}

let _destroyedHandler = (state: state, { userData }) => {
    let { fromName, toName } = NullableUtils.getExn(userData)

    if (LittleMan.isLittleMan(toName)) {
        return handleMissionFail(state)
    }

    return Promise.resolve(state)
}

let _girlDestroyingHandler = (state: state, { userData }) => {
    state = markWhetherNotExecuteGiantessAI(state, true)

    return handleMissionComplete(state)
}

export let setByDiffiuculty = (state: state) => {
    let littleManStrength_
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
            littleManStrength_ = littleManStrength.High
            break
        case difficulty.Easy:
        case difficulty.Middle:
        case difficulty.Hard:
            littleManStrength_ = littleManStrength.Middle
            break
        case difficulty.VeryHard:
            littleManStrength_ = littleManStrength.Low
            break
    }
    state = setLittleManSettingLittleManStrength(state, littleManStrength_)

    return state
}

let _handleLevel = (state: state) => {
    state = markWhetherNotExecuteGiantessAI(state, true)

    state = initProp(state, 1)



    // return triggerMainEvent(state, GameEventData.eventName.PickdownArmy)
    //     .then(state => {
    //         return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //             return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
    //         }, 5))
    //     })

    state = setAbstractState(state, Event.on(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))


    return triggerMainEvent(state, GameEventData.eventName.Begin)

    // return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)

    // state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     state = WalkToTargetPosition.setTargetPosition(state, _v1.set(
    //         -147, 0, 50
    //     ))

    //     // return WalkToTargetPosition.walkToTargetPosition(state, getIdExn(state, WalkToTargetPosition.getKey()), NullableUtils.getEmpty())
    //     return WalkToTargetPosition.walkToTargetPosition(state, WalkToTargetPosition.getId(), NullableUtils.getEmpty())
    //         .then(([state, result]) => {
    //             if (result == behaviourTreeNodeExecuteResult.Fail) {
    //                 throw new Error("err")
    //             }

    //             return state
    //         })
    // }, 0.5))


    // state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     state = markWhetherNotExecuteGiantessAI(state, false)

    //     state = setTarget(state, {
    //         isAliveFunc: (state) => {
    //             return true
    //         },
    //         getPositionFunc: (state) => {
    //             return LittleManTransform.getPosition(state)
    //         },

    //         name: LittleMan.getName(),
    //         index: NullableUtils.getEmpty(),
    //         type: targetType.LittleMan
    //     }, LittleMan.getBox(state))

    //     return Promise.resolve(state)
    // }, 5))

    // state = setAbstractState(state, Event.on(getAbstractState(state), getActioNodeFinishEventName(), _exitScenarioHandler))

    // return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
    state = Utils.initWhenImportScene(state)

    state = setAllCollisionParts(state, getDefaultAllCollisionParts())

    state = setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: CollisionShapeData.getData(state),
    })

    state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), BehaviourTreeData.getData([
        BehaviourTreeManager.getSettingFactorAffectRate,
        NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
        state => {
            return getGirlScale(state) < Girl.getValue(state).minScaleAsMiddleGiantess
        },
        Girl.getGirlState,
        () => Girl.getValue(state),
        isChangeScaling,
        isPose,
        BehaviourTreeManager.getNearestTargetCount
    ]))

    return Scene.initWhenImportScene(getAbstractState(state)).then(abstractState => {
        return setAbstractState(state, abstractState)
    })
        .then(UI.initWhenImportScene)
        .then(Mission.initWhenImportScene)
        .then(state => WholeScene.initWhenImportScene(state, getSceneResourceId()))

        .then(state => {
            state = Girl.setInitialTransform(state, new Vector3(-180, 0, 48), new Quaternion(0, 0.707, 0, 0.707))
            state = LittleMan.setInitialTransform(state, new Vector3(-155, 0, 55), new Quaternion(0, -0.707, 0, 0.707))

            return state
        })
        .then(Girl.initWhenImportScene)
        .then(LittleMan.initWhenImportScene)
        .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene).then(MapWall.initWhenImportScene)
        // .then(WindMills.initWhenImportScene)
        // .then(DynamicCars.initWhenImportScene)
        .then(PathFind.initWhenImportScene)
        // .then(Citiyzen.initWhenImportScene)
        .then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene).then(Melee.initWhenImportScene).then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene).then(Terrain.initWhenImportScene).then(ArmyManager.initWhenImportScene).then(BehaviourTreeManager.initWhenImportScene)
        .then(parseAllWeaponModelsAndEnableAllParticls).then(state => {
            state = registerDamageData(state, { isSelfFunc: TreesAndProps.isTreesAndProps, damageFunc: TreesAndProps.damage, getValueFunc: TreesAndProps.getValue },)
            state = registerDamageData(state, { isSelfFunc: Buildings.isBuildings, damageFunc: Buildings.damage, getValueFunc: Buildings.getValue },)
            state = registerDamageData(state, { isSelfFunc: Cars.isCars, damageFunc: Cars.damage, getValueFunc: Cars.getValue },)

            // state = registerDamageData(state, { isSelfFunc: Citiyzen.isCityzen, damageFunc: Citiyzen.damage, getValueFunc: Citiyzen.getValue },)

            state = registerDamageData(state, { isSelfFunc: Infantry.isInfantry, damageFunc: Infantry.damage(SoldierBiwu.damage), getValueFunc: Infantry.getValue },)
            state = registerDamageData(state, { isSelfFunc: Rocketeer.isRocketeer, damageFunc: Rocketeer.damage(SoldierBiwu.damage), getValueFunc: Rocketeer.getValue },)
            state = registerDamageData(state, { isSelfFunc: Laserer.isLaserer, damageFunc: Laserer.damage(SoldierBiwu.damage), getValueFunc: Laserer.getValue },)
            state = registerDamageData(state, { isSelfFunc: Commander.isCommander, damageFunc: Commander.damage(SoldierBiwu.damage), getValueFunc: Commander.getValue },)
            state = registerDamageData(state, { isSelfFunc: Melee.isMelee, damageFunc: Melee.damage(SoldierBiwu.damage), getValueFunc: Melee.getValue },)

            state = registerDamageData(state, { isSelfFunc: Tank.isTank, damageFunc: Tank.damage(MilltaryVehicleBiwu.damage), getValueFunc: Tank.getValue },)
            state = registerDamageData(state, { isSelfFunc: MissileVehicle.isMissileVehicle, damageFunc: MissileVehicle.damage(MilltaryVehicleBiwu.damage), getValueFunc: MissileVehicle.getValue },)
            state = registerDamageData(state, { isSelfFunc: FlameVehicle.isFlameVehicle, damageFunc: FlameVehicle.damage(MilltaryVehicleBiwu.damage), getValueFunc: FlameVehicle.getValue },)

            state = registerDamageData(state, { isSelfFunc: ShellTurret.isShellTurret, damageFunc: ShellTurret.damage(MilltaryBuildingBiwu.damage), getValueFunc: ShellTurret.getValue },)
            state = registerDamageData(state, { isSelfFunc: MissileTurret.isMissileTurret, damageFunc: MissileTurret.damage(MilltaryBuildingBiwu.damage), getValueFunc: MissileTurret.getValue },)

            // state = registerDamageData(state, { isSelfFunc: DynamicCars.isDynamicCar, damageFunc: DynamicCars.damage, getValueFunc: DynamicCars.getValue },)
            // state = registerDynamicData(state, { isSelfFunc: WindMills.isWindMill, damageFunc: WindMills.damage, getValueFunc: WindMills.getValue },)



            // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: Girl.damage, getValueFunc: Girl.getValue },)
            state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)

            state = registerDamageGiantessFunc(state, GirlBiwuLevel1.damage)



            return state
        })
        .then(_handleLevel)
}

export let init = (state: state) => {
    return _parseAndAddResources(state)

    // .then(state => {
    //     return setRoad(state, road.LittleMan)
    // })
}

export let getAllArmyCount = (state: state) => {
    return getAllAliveSoldierData(state).length + getAllAliveMilltaryVehicleData(state).length
        + getAllAliveMilltaryBuildingData(state).length
}

let _update = (state: state) => {
    state = headLookat(state,
        LittleManTransform.getWorldPosition(state),
        [
            animationName.Idle,
            animationName.Walk,
            animationName.Stomp,
            animationName.PickdownFromIdle
        ]
    )

    return NullableUtils.getWithDefault(
        NullableUtils.map(([index, isAddArmy]) => {
            if (!isFinish(state) || !isAddArmy || getAllArmyCount(state) > 0) {
                return Promise.resolve(state)
            }

            state = setPickdownArmyData(state, index, false)

            switch (index) {
                case 1:
                    return triggerMainEvent(state, GameEventData.eventName.PickdownArmy2_1)
                case 2:
                    return triggerMainEvent(state, GameEventData.eventName.PickdownArmy2_2)
                case 3:
                    return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3)
                case 7:
                    state = Utils.setGirlCanDamageTarget(state)
                    state = setLevelData(state, _buildGirlNotDamageKey(), false)
                    state = isAllowMoveCollision(state, true)

                    return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
                // case 4:
                //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_2)
                //     }, 10))
                //     return Promise.resolve(state)
                // case 5:
                //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_3)
                //     }, 5))
                //     return Promise.resolve(state)
                // case 6:
                //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_3)
                //     }, 10))
                //     return Promise.resolve(state)
                default:
                    return Promise.resolve(state)
            }
        }, getPickdownArmyData(state)),
        Promise.resolve(state)
    )
}

export let update = (state: state): Promise<state> => {
    let promise
    if (!isEnter(state)) {
        promise = Girl.update(state).then(LittleMan.update).then(Camera.update)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(Mission.update)
        // .then(DynamicCars.update)
        // .then(Citiyzen.update)
        .then(Infantry.update).then(Rocketeer.update).then(Laserer.update).then(Commander.update).then(Melee.update).then(Tank.update).then(MissileVehicle.update).then(FlameVehicle.update).then(ShellTurret.update).then(MissileTurret.update).then(ArmyManager.update).then(BehaviourTreeManager.update)
        .then(_update)
}

let _dispose = (state: state) => {
    // state = Utils.disposeLookatLittleMan(state)
    state = disposeLookat(state)

    state = ArmyManager.dispose(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return state
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    return Girl.dispose(state).then(LittleMan.dispose).then(Buildings.dispose).then(Cars.dispose)
        // .then(WindMills.dispose)
        // .then(DynamicCars.dispose)
        // .then(Citiyzen.dispose)
        .then(Soldier.dispose).then(MilltaryVehicle.dispose).then(MilltaryBuilding.dispose).then(TreesAndProps.dispose).then(Mission.dispose).then(Terrain.dispose).then(PathFind.dispose)
        .then(Army.dispose)
        .then(BehaviourTreeManager.dispose)
        .then(state => {
            DisposeUtils.removeAndDispose(Scene.getScene(getAbstractState(state)), scene)

            return state
        }).then(state => {
            return disposeStaticDynamic(state)
        })
        .then(_dispose)
        .then(writeState)
}

export let getSceneResourceId = () => "biwu_level1"

export let getSay1SoundResourceId = () => "biwu_level1_say1"

export let getSay21SoundResourceId = () => "biwu_level1_say2_1"

export let getSay3SoundResourceId = () => "biwu_level1_say3"

export let getSayStompSoundResourceId = () => "biwu_level1_sayStomp"

export let getLoadData = () => {
    return [
        {
            id: getSceneResourceId(),
            path: `./resource/${getName()}/scene_biwu.glb`,
            type: resourceType.ArrayBuffer
        },
    ].concat([
        {
            id: getSay1SoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/biwu/level1/${getSay1SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSay21SoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/biwu/level1/${getSay21SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSay3SoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/biwu/level1/${getSay3SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSayStompSoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/biwu/level1/${getSayStompSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },

        {
            id: getHeavyStressingSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getHeavyStressingSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
    ] as any)
}

export let handleBeforeLoadResource = (state: state) => {
    state = setByDiffiuculty(state)

    state = setConfigData(state, {
        ...getConfigData(state),
        // girlAllAnimationNames: getConfigData(state).girlAllAnimationNames.concat(getAllAnimationNames() as any),
        girlAllAnimationNames: getAllAnimationNames(),
        girlAllAnimationFrameCountMap: MutableMapUtils.concat(getConfigData(state).girlAllAnimationFrameCountMap, getAnimationFrameCountMap() as any),

        animationBlendData: getConfigData(state).animationBlendData.concat(getAnimationBlendData(
            getAnimationBlendDataParam()
        ) as any),
        animationCollisionData: getConfigData(state).animationCollisionData.concat(getAnimationCollisionData(getAnimationCollisionDataParam() as any) as any),

        girlValue: NullableUtils.return_(
            GirlData.getValue(state)
        ),
        littleManValue: NullableUtils.return_(
            LittleManData.getValue(state)
        ),
        // allMMDData: getConfigData(state).allMMDData.concat(getAllMMDData()),
        allMMDData: getAllMMDData(),


        gameEventData: GameEventData.getData(),
        scenaryData: ScenarioData.getData(Girl.getCurrentMMDCharacterName(state)),
    })

    state = setConfigData(state, {
        ...getConfigData(state),
        clothHpData: NullableUtils.return_(getClothHpData(state)),
    })

    return state
}