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
import * as Mission from "../../mission/Mission"
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
import { getAnimationBlendDataParam, getCharacterBloodResourceId, getCharacterShadowResourceId, getConfigData, getGirlScale, getHeavyStressingSoundResourceId, getLevelData, getLevelDataExn, getName, getScene, isLittleCharacterType, setBehaviourTreeData, setCollisionShapeData, setConfigData, setLevelData, switchToCharacterType, } from "../../../CityScene"
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
import { resourceType, characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as BehaviourTreeData from "../../../data/biwu/level1/behaviour_tree_data/BehaviourTreeData"
import * as GirlData from "../../../data/biwu/level1/GirlData"
import * as LittleManData from "../../../data/player/LittleManData"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData } from "../../../girl/PickPoseUtils"
import { getCurrentAnimationName, isChangeScaling } from "../../../girl/Animation"
import { isPose } from "../../../girl/Pose"
import { getBone, getCurrentMMDData } from "../../../utils/MMDUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion, Vector3 } from "three"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getAllMMDData, getClothHpData } from "../../../data/biwu/level1/mmd/MMDData"
import { getAllAnimationNames } from "../../../data/biwu/level1/AnimationNames"
import { getAnimationFrameCountMap } from "../../../data/biwu/level1/Const"
import { getAnimationBlendData } from "../../../data/biwu/level1/Data"
import { getAnimationCollisionDataParam, getCollisionPartCenter } from "../../../girl/Collision"
import { getAnimationCollisionData } from "../../../data/biwu/level1/Data"
import { Flow } from "meta3d-jiehuo-abstract"
import { getActionNodeId, getIdExn, markWhetherNotExecuteGiantessAI, resetFinish, setTarget, stop } from "../../../behaviour_tree/BehaviourTreeManager"
import { animationName } from "../../../data/biwu/level1/DataType"
import { triggerMainEvent } from "../../../game_event/GameEvent"
import * as GameEventData from "../../../data/biwu/level1/GameEventData"
import * as ScenarioData from "../../../data/biwu/level1/ScenarioData"
import { disposeUtils, getPropLoadData, initWhenImportSceneUtils, parseAllWeaponModelsAndEnableAllParticls, updateUtils, updateUtils2 } from "../../city1/ManageScene"
import { getExitScenarioEventName } from "../../../../../../utils/EventUtils"
import * as Utils from "../Utils"
import { getAllAliveMilltaryBuildingData, getAllAliveMilltaryVehicleData, getAllAliveSoldierData } from "../../../behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { isFinish } from "../../../scenario/Command"
import { getPickdownArmyData, setPickdownArmyData } from "../scenario/Command"
import { List } from "immutable"
import { collisionPart, littleManStrength, propName, propType, usedGirlEnum } from "../../../type/StateType"
import { disposeLookat, headLookat } from "../../../girl/Lookat"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../../utils/EventUtils"
import { isAllowMoveCollision } from "../../../girl/Move"
import { getDefaultAllCollisionParts, setAllCollisionParts } from "../../../utils/CollisionUtils"
import * as CollisionShapeData from "../../../data/CollisionShapeData"
import { addBossGiantess } from "../../../girl/boss/Girl"
import { addLittleMan } from "../../../little_man/InitWhenImportScene"
import * as ManageSceneBiwu from "../ManageScene"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { getStateMachine } from "../../../girl/FSMState"
import { generateReward, mergeRewardData } from "../../../reward/RewardGenerator"
import { buildDestroyedName, getRewardData } from "../../../data/biwu/level1/reward/RewardData"
import { getRewardPropPosition } from "../Reward"
import { getRewardPropOffset } from "./Reward"
import { Loader } from "meta3d-jiehuo-abstract"
import { getAttributeData, getClothCollisionData, getShoeData } from "../../../data/mmd/MMDData"
import { setIsNotDamage } from "../../../Status"
import { addBuff } from "../../../buff/Buff"
import { buffName } from "../../../data/buff/BuffData"
import { getAllAliveArmyCount } from "../../../utils/ArmyUtils"
import { stopAIAndAllTweensAndDefer } from "../../utils/ManageSceneUtils"
import { registerAllEliteGiantessDamageData } from "../../../../../../mod/EliteGiantessMod"
import { buildAPI } from "../../../../../../mod/Mod"
import { getAllRandomUsedMMDData } from "../../../data/biwu/MMDUtils"
import { addDestoryUnit } from "../../../Statistic"
import { handleWhenDestroying } from "../../../girl/Utils"
import { getModAPI } from "../../../Mod"
import { getMMDName } from "../../../../../../mod/MMDMod"
import { getAllSitAnimations, getAllStompAnimations, getStompBlockService, getStompRubBlockService } from "../../../../../../mod/SkillGiantessMod"
import { getUseGiantessCharacterBlockService } from "../../../../../../mod/PropOtherMod"

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();

// let _parseAndAddResources = (state: state) => {
//     return Terrain.parseAndAddResources(state)
// }

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
    let usedGirl = Utils.getUsedGirl()

    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        state = Girl.setIsOnlyDamageLittleMan(state, usedGirl, true)
        // state = setLevelData(state, _buildGirlNotDamageKey(), true)
        state = setIsNotDamage(state, Girl.buildNameByUsedGirl(usedGirl), true)
        state = isAllowMoveCollision(state, usedGirl, false)


        return triggerMainEvent(state, GameEventData.eventName.PickdownArmy1)
    }, 1))

    // state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
    // }, 10))

    return Promise.resolve(state)
}

// export let initProp = (state, factor) => {
//     // const bulletCount = Infinity

//     let bulletCount
//     switch (getAutoDifficulty(state)) {
//         case autoDifficulty.VeryEasy:
//             bulletCount = Infinity
//             break
//         case autoDifficulty.Easy:
//             bulletCount = 99
//             break
//         case autoDifficulty.Middle:
//             bulletCount = 25 * factor
//             break
//         case autoDifficulty.Hard:
//             bulletCount = 20 * factor
//             break
//         case autoDifficulty.VeryHard:
//             bulletCount = 17 * factor
//             break
//     }

//     if (getIsDebug(state)) {
//         bulletCount = Infinity
//     }

//     return LittleMan.setLittleManState(state, {
//         ...LittleMan.getLittleManState(state),
//         props: List([
//             {
//                 name: propName.BasicBullet,
//                 count: Infinity,
//                 type: propType.Bullet
//             },
//             {
//                 name: propName.LaserBullet,
//                 count: bulletCount,
//                 type: propType.Bullet
//             },
//             {
//                 name: propName.RocketBullet,
//                 count: Math.round(bulletCount / 1.3),
//                 // count: Math.round(bulletCount),
//                 type: propType.Bullet
//             },

//             {
//                 name: propName.BiggerBullet,
//                 count: 0,
//                 type: propType.Bullet
//             },
//             {
//                 name: propName.SmallerToLastBiggerCount,
//                 count: 0,
//                 type: propType.Bullet
//             },
//         ])
//     })
// }


let _handleLevel = (state: state) => {
    let usedGirl = Utils.getUsedGirl()
    state = markWhetherNotExecuteGiantessAI(state, usedGirl, true)

    state = Utils.initMap(state)


    // state = initProp(state, 1)



    // return triggerMainEvent(state, GameEventData.eventName.PickdownArmy)
    //     .then(state => {
    //         return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //             return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
    //         }, 5))
    //     })

    state = setLevelData(state, ManageSceneBiwu.buildGirlDestroyingHandlerKey(usedGirl), (state) => {
        return stopAIAndAllTweensAndDefer(state, stop, usedGirl).then(state => {
            state = generateReward(state, LittleMan.getName(), buildDestroyedName(), Girl.buildNameByUsedGirl(usedGirl),
                getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt),
                getRewardPropPosition(state, usedGirl),
                getRewardPropOffset(state),
                // getRewardCoinOffset(state)
            )

            state = addDestoryUnit(state, LittleMan.getName(), Girl.buildNameByUsedGirl(usedGirl), NullableUtils.return_(
                Girl.getCurrentMMDCharacterName(state, usedGirl)
            ))
            return Event.trigger(state, getAbstractState, getModAPI(state).event.getBossDestroyedEventName(), NullableUtils.return_({
                targetName: Girl.buildNameByUsedGirl(usedGirl),
                gemAndCoinPosition: getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt),
                propPosition: getRewardPropPosition(state, usedGirl),
            }))
        }).then(handleWhenDestroying)
    })


    state = ManageSceneBiwu.bindEvents(state)

    state = setAbstractState(state, Event.on(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))


    return triggerMainEvent(state, GameEventData.eventName.Begin).then(state => {
        return addBossGiantess(state, Girl.getAllUsedMMDData(state), new Vector3(-180, 0, 48), new Quaternion(0, 0.707, 0, 0.707)).then(
            state => {
                return addLittleMan(state, new Vector3(-155, 0, 55), new Quaternion(0, -0.707, 0, 0.707))
            }
        )
    })
    // .then(state => {
    //     // TODO remove
    //     return addBuff(state, buffName.DecreaseActionSpeed, Girl.getName(), NullableUtils.return_(usedGirlEnum.BossGiantess), 10, 3).then(state => {
    //         state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //             return addBuff(state, buffName.DecreaseActionSpeed, Girl.getName(), NullableUtils.return_(usedGirlEnum.BossGiantess), 10, 3)
    //         }, 5))

    //         return state
    //     })
    // })

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
    //     state = markWhetherNotExecuteGiantessAI(state,usedGirl, false)

    //     state = setTarget(state, usedGirl, {
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
    let usedGirl = Utils.getUsedGirl()
    return Utils.initWhenImportScene(state,
        [
            getAllAnimationNames,
            getAnimationFrameCountMap,
            getAnimationBlendData,
            getAnimationCollisionData
        ],
    ).then(state => {
        state = setAllCollisionParts(state, getDefaultAllCollisionParts())

        // state = setConfigData(state, {
        //     ...getConfigData(state),
        //     collisionShapeData: CollisionShapeData.getData(state),
        // })
        state = setCollisionShapeData(state, CollisionShapeData.getData)

        state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), BehaviourTreeData.getData([
            BehaviourTreeManager.getSettingFactorAffectBiggerRate,
            NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
            // state => {
            //     return getGirlScale(state, usedGirl) < Girl.getValue(state).minScaleAsMiddleGiantess
            // },
            Girl.getGirlState,
            () => Girl.getValue(state, usedGirl),
            isChangeScaling,
            isPose,
            BehaviourTreeManager.getVeryNearestTargetCount
        ]))

        return initWhenImportSceneUtils(state)
    })
        .then(Mission.initWhenImportScene)
        .then(state => ManageSceneBiwu.initWhenImportScene(state, getSceneResourceId()))

        // .then(state => WholeScene.initWhenImportScene(state, getSceneResourceId()))

        // .then(state => {
        //     state = Girl.setInitialTransform(state, new Vector3(-180, 0, 48), new Quaternion(0, 0.707, 0, 0.707))
        //     state = LittleMan.setInitialTransform(state, new Vector3(-155, 0, 55), new Quaternion(0, -0.707, 0, 0.707))

        //     return state
        // })
        .then(GirlBiwuLevel1.initWhenImportScene)
        .then(LittleMan.initWhenImportScene)
        // .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene).then(MapWall.initWhenImportScene)
        // // .then(WindMills.initWhenImportScene)
        // // .then(DynamicCars.initWhenImportScene)
        .then(PathFind.initWhenImportScene)
        // // .then(Citiyzen.initWhenImportScene)
        // .then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene).then(Melee.initWhenImportScene).then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene).then(Terrain.initWhenImportScene)
        .then(ArmyManager.initWhenImportScene)
        .then(BehaviourTreeManager.initWhenImportScene)

        // .then(parseAllWeaponModelsAndEnableAllParticls)
        .then(state => {
            return UI.registerBossStatusUpdateFunc(state, GirlBiwuLevel1.updateStatus)
        })
        .then(state => {
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


            // state = registerDamageData(state, { isSelfFunc: MeleeGiantess.isMeleeGiantess, damageFunc: MeleeGiantess.damage(EliteGiantess.damage), getValueFunc: MeleeGiantess.getValue },)
            state = registerAllEliteGiantessDamageData(state)

            // state = registerDamageData(state, { isSelfFunc: DynamicCars.isDynamicCar, damageFunc: DynamicCars.damage, getValueFunc: DynamicCars.getValue },)
            // state = registerDynamicData(state, { isSelfFunc: WindMills.isWindMill, damageFunc: WindMills.damage, getValueFunc: WindMills.getValue },)



            // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: Girl.damage, getValueFunc: Girl.getValue },)
            state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)

            state = registerDamageGiantessFunc(state, GirlBiwuLevel1.damage)



            return state
        })
        .then(_handleLevel)
}

// export let init = (state: state) => {
//     return _parseAndAddResources(state)

//     // .then(state => {
//     //     return setCharacterType(state, characterType.LittleMan)
//     // })
// }

// export let getAllAliveArmyCount = (state: state) => {
//     return getAllAliveSoldierData(state).length + getAllAliveMilltaryVehicleData(state).length
//         + getAllAliveMilltaryBuildingData(state).length
// }

let _update = (state: state) => {
    state = headLookat(state,
        (state, euler) => {
            return euler
        },
        usedGirlEnum.BossGiantess,
        LittleManTransform.getWorldPosition(state),
        [
            animationName.Idle,
            animationName.Walk,
            // animationName.Stomp,
            animationName.PickdownFromIdle
        ].concat(
            getAllStompAnimations(state)
        ).concat(
            getAllSitAnimations(state)
        )
    )

    // if (isDestoryRelatedStates(getStateMachine(state))) {
    return Promise.resolve(state)
    // }

    // return NullableUtils.getWithDefault(
    //     NullableUtils.map(([index, isAddArmy]) => {
    //         // if (!isFinish(state, usedGirl) || !isAddArmy || getAllAliveArmyCount(state) > 0) {
    //         //     return Promise.resolve(state)
    //         // }
    //         if (!isFinish(state, usedGirl) || !isAddArmy) {
    //             return Promise.resolve(state)
    //         }

    //         state = setPickdownArmyData(state, index, false)

    //         // switch (index) {
    //         //     case 1:
    //         //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy2_1)
    //         //     // case 2:
    //         //     //     return triggerMainEvent(state, GameEventData.eventName.PickdownArmy2_2)
    //         //     case 3:
    //         //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3)
    //         //     case 7:
    //         state = Utils.setGirlCanDamageTarget(state)
    //         state = setIsNotDamage(state, Girl.getName(), false)
    //         state = isAllowMoveCollision(state, true)

    //         return triggerMainEvent(state, GameEventData.eventName.StompLittleMan)
    //         //     // case 4:
    //         //     //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //         //     //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_2)
    //         //     //     }, 10))
    //         //     //     return Promise.resolve(state)
    //         //     // case 5:
    //         //     //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //         //     //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_3)
    //         //     //     }, 5))
    //         //     //     return Promise.resolve(state)
    //         //     // case 6:
    //         //     //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //         //     //         return triggerMainEvent(state, GameEventData.eventName.PickdownArmy3_3)
    //         //     //     }, 10))
    //         //     //     return Promise.resolve(state)
    //         //     default:
    //         //         return Promise.resolve(state)
    //         // }
    //     }, getPickdownArmyData(state)),
    //     Promise.resolve(state)
    // )
}

export let update = (state: state): Promise<state> => {
    let promise
    if (!isEnter(state)) {
        promise = GirlBiwuLevel1.update(state).then(LittleMan.update).then(Camera.update)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(ManageSceneBiwu.update)
        .then(BehaviourTreeManager.update)
        // .then(updateUtils2)
        .then(_update)
}

let _dispose = (state: state) => {
    let usedGirl = Utils.getUsedGirl()

    // state = Utils.disposeLookatLittleMan(state)
    state = disposeLookat(state, usedGirl)

    state = ArmyManager.dispose(state)

    state = setAbstractState(state, Loader.removeResource(getAbstractState(state), getSceneResourceId()))


    state = ManageSceneBiwu.unbindEvents(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))

    return state
}

export let dispose = (state: state) => {
    return disposeUtils(state)
        .then(BehaviourTreeManager.dispose)
        .then(_dispose)
        .then(writeState)
}

export let getSceneResourceId = () => "biwu_level1"

export let getSay1SoundResourceId = () => "biwu_level1_say1"

export let getSay21SoundResourceId = () => "biwu_level1_say2_1"

export let getSay3SoundResourceId = () => "biwu_level1_say3"

export let getSayStompSoundResourceId = () => "biwu_level1_sayStomp"

export let getLoadData = (state) => {
    return [
        {
            id: getSceneResourceId(),
            path: `./resource/${getName()}/map/biwu/scene_biwu.glb`,
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
    ] as any).concat(
        getPropLoadData(state)
    )
}

export let handleBeforeLoadResource = (state: state) => {
    let usedGirl = Utils.getUsedGirl()
    state = setConfigData(state, {
        ...getConfigData(state),
        // girlAllAnimationNames: getConfigData(state).girlAllAnimationNames.concat(getAllAnimationNames() as any),

        // girlAllAnimationNames: getAllAnimationNames(state),
        // girlAllAnimationFrameCountMap: MutableRecordUtils.concat(getConfigData(state).girlAllAnimationFrameCountMap, getAnimationFrameCountMap() as any),

        // animationBlendData: getConfigData(state).animationBlendData.concat(getAnimationBlendData(
        //     getAnimationBlendDataParam()
        // ) as any),
        // animationCollisionData: getConfigData(state).animationCollisionData.concat(getAnimationCollisionData(getAnimationCollisionDataParam() as any) as any),


        // littleManValue: Mission.isEnteringNextLevel(state) ? getConfigData(state).littleManValue : NullableUtils.return_(
        //     LittleManData.getValue(state)
        // ),
        littleManValue: NullableUtils.return_(
            LittleManData.getValue(state)
        ),
        // allMMDData: getConfigData(state).allMMDData.concat(getAllMMDData()),
        allMMDData: getAllMMDData(state),
        shoeData: getConfigData(state).shoeData.concat(getShoeData(state)),
        clothCollisionData: getClothCollisionData(state),


        gameEventData: NullableUtils.return_(GameEventData.getData()),
        // scenaryData: ScenarioData.getData(Girl.getCurrentMMDCharacterName(state, usedGirl)),


        rewardData: mergeRewardData(NullableUtils.getExn(getConfigData(state).rewardData), getRewardData(state)),
    })

    state = ManageSceneBiwu.handleBeforeLoadResource(state, GirlData.getValue, getClothHpData, getAllRandomUsedMMDData)

    state = setConfigData(state, {
        ...getConfigData(state),
        scenaryData: ScenarioData.getData(
            // Girl.getUsedMMDDataByUsedGirl(state, usedGirlEnum.BossGiantess)[0]
            getMMDName(state, usedGirl)
        ),
    })


    return state
}