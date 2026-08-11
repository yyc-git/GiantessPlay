import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState, writeState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import * as Girl from "../../girl/Girl"
import * as LittleMan from "../../little_man/LittleMan"
import * as Terrain from "./Terrain"
import * as MapWall from "./MapWall"
import * as TreesAndProps from "./TreesAndProps"
import * as Mountains from "./Mountains"
// import * as Grass1 from "./Grass1"
import * as Buildings from "./Buildings"
import * as Cars from "./Cars"
// import * as WindMills from "./WindMills"
import * as DynamicCars from "./DynamicCars"
import * as WholeScene from "./WholeScene"
import * as MissionAll from "../mission/Mission"
import * as Mission from "./Mission"
import * as Citiyzen from "./Citiyzen"
import * as Army from "./Army"
import * as Soldier from "./soldier/Soldier"
import * as Infantry from "./soldier/Infantry"
import * as Rocketeer from "./soldier/Rocketeer"
import * as Laserer from "./soldier/Laserer"
import * as Commander from "./soldier/Commander"
import * as Melee from "./soldier/Melee"
import * as MilltaryVehicle from "./milltary_vehicle/MilltaryVehicle"
import * as Tank from "./milltary_vehicle/Tank"
import * as MissileVehicle from "./milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "./milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "./milltary_building/MilltaryBuilding"
import * as ShellTurret from "./milltary_building/ShellTurret"
import * as MissileTurret from "./milltary_building/MissileTurret"
// import * as EliteGiantess from "./elite_giantess/EliteGiantess"
// import * as MeleeGiantess from "./elite_giantess/MeleeGiantess"
import * as PathFind from "./PathFind"
import * as ArmyManager from "./ArmyManager"
import { getScene, getName, setBehaviourTreeData, getGirlScale, setConfigData, getConfigData, isGiantessCharacterType, isLittleCharacterType, setCharacterType, switchCharacterType, switchToCharacterType, setGameEventDirectorData, setScenaryData, setCollisionShapeData, isGiantessCharacterTypeByUsedGirl } from "../../CityScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
// import { GrassInstance } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { update as updateStaticDynamic, dispose as disposeStaticDynamic, isLifeCountWork, registerDamageData, registerDamageGiantessFunc, hasLifeCount, setLifeCount } from "../../StaticDynamic"
// import { isThirdPersonCamera } from "../../Camera"
import * as Camera from "../../Camera"
import { isEnter, update as updateScenarioManager } from "../../scenario/ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { getKeyDownEventName, getPointerDownEventName } from "meta3d-jiehuo-abstract/src/Event"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as UI from "../../UI"
import * as BehaviourTreeManager from "../../behaviour_tree/BehaviourTreeManager"
import { resourceType, characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as PlayerGirlData from "../../data/player/GirlData"
import * as LittleManData from "../../data/player/LittleManData"
import * as WildGiantessData from "../../data/play/level1/wild/GirlData"
import * as EnemyGiantessData from "../../data/play/level1/enemy/GirlData"
// import * as PlayerGoddessData from "../../data/play/level1/player_goddess/GirlData"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData, isEatingFromPick, isPicked, removeFromAllData, removePickData } from "../../girl/PickPoseUtils"
import { getCurrentAnimationName, isChangeScaling } from "../../girl/Animation"
import { isPose } from "../../girl/Pose"
import { attackTarget, camp, littleManActionState, missionFinishStatus, propName, usedGirlEnum } from "../../type/StateType"
import { getAllMMDData, getClothCollisionData, getClothHpData, getShoeData } from "../../data/mmd/MMDData"
import * as ScenarioData from "../../data/ScenarioData"
import { actionName, animationName, forceSize } from "../../data/DataType"
import { disposeLookat, headLookat } from "../../girl/Lookat"
import { disposeShoe, restoreShoe } from "../../data/mmd/Shoe"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../utils/EventUtils"
// import { handlePickDataWhenExecuteDestroyed } from "../../little_man/FSMState"
import { executeDestroying } from "../../girl/FSMState"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getDefaultAllCollisionParts, setAllCollisionParts } from "../../utils/CollisionUtils"
import * as CollisionShapeData from "../../data/CollisionShapeData"
import { disposeMMDResource, getCurrentMMDData, setUsedMMDData } from "../../utils/MMDUtils"
import { Matrix4, Quaternion, Vector3 } from "three"
import { getImagePath as getLaserResourcePath } from "meta3d-jiehuo-abstract/src/particle/LaserBulletEmitter"
import * as RewardGenerator from "../../reward/RewardGenerator"
import * as Character from "../../character/Character"
import * as Build from "../../build/Build"
import * as Difficulty from "../../difficulty/Difficulty"
import * as Time from "../../Time"
import * as Statistic from "../../Statistic"
import * as FastProp from "../../FastProp"
import * as EliteGiantess from "../../EliteGiantess"
import * as TweenManager from "../../TweenManager"
import * as User from "../../User"
import { buildAllLocalAndBulletProps } from "../../reward/Prop"
import { getRandomMapLoadData, initWhenImportScene as initWhenImportSceneMap, dispose as disposeMap } from "./map/Map"
import * as GameEventDirector from "../../director/GameEventDirector"
import * as GameEventData from "../../data/GameEventData"
import * as ArmyDirector from "../../director/ArmyDirector"
import { getRewardData } from "../../data/play/level1/reward/RewardData"
import { getGetClothHpDataFunc, initClothHpData } from "../../utils/ClothUtils"
import { getIsProduction } from "meta3d-jiehuo-abstract/src/state/State"
import { Stats } from "meta3d-jiehuo-abstract"
import { Outline } from "meta3d-jiehuo-abstract"
import * as Status from "../../Status"
import * as Buff from "../../buff/Buff"
import * as StaticDynamicUnit from "../../StaticDynamicUnit"
import { disposeAllData, isStatic } from "../../utils/OctreeObjectUtils"
import { List } from "immutable"
import { addBuff } from "../../buff/Buff"
import { buffName } from "../../data/buff/BuffData"
import * as Interaction from "../../Interaction"
import { getAllRandomUsedMMDData } from "../../data/play/level1/MMDUtils"
import { updateStatus } from "../../girl/utils/LevelGirlUtils2"
import { buildAPI, disposeAllMods } from "../../../../../mod/Mod"
import { isEliteGiantess, registerAllEliteGiantessDamageData } from "../../../../../mod/EliteGiantessMod"
import { pointdownHandle } from "../../data/biwu/level2/behaviour_tree_data/action_node/utils/QTEUtils"
import { enableParticle } from "../../../../../mod/ParticleMod"
import { resetPlayerGirlValue } from "../../girl/player/Girl"
import { update as updateSettingMod } from "../../../../../mod/SettingMod"
import { getData } from "../../data/director/GameEventDirectorData"
import { getModAPI } from "../../Mod"
import { buildBuildingAndTreeAndInteractionConfig, getInteractionLoadData, getLoadResourceIdData } from "../../data/play/level1/map/MapData"
import { resetLevelGirlValue } from "../../girl/utils/LevelGirlUtils"
import { getUsedGirl, initAllLevelGirlValue } from "../../../../../mod/LevelGiantessMod"
import { getAllMapData } from "../../../../../mod/InteractionMod"
import { initWhenImportScene as initWhenImportSceneArmyUtils, isArmy, isArmyExceptEliteGiantess, setInstanceColor } from "../../utils/ArmyUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getEnhenceArmyLevel, getEnhenceEliteGiantessLevel } from "../../difficulty/HeatImplementer"
import { getEliteGiantessDamageBiggerBlockService, getEliteGiantessPassiveBiggerBlockService, getEmitBackStabBlockService, getEmitDecreaseScaleBlockService, getEmitDefenseIncreaseDefenseBlockService, getEmitDoorShieldBlockService, getEmitFragileGrowthBlockService, getEmitHpRatioDirectBlockService, getEmitHpRatioInverseBlockService, getEmitIceSingleBlockService, getEmitPoisonSingleBlockService, getEmitPullBlockService, getEmitShootDistanceDirectBlockService, getEmitShootDistanceInverseBlockService, getEmitStressprotectBlockService } from "../../../../../mod/BuffMod"
import { service } from "buff-protocol/src/service/ServiceType"
import { getIsDebug } from "../../../Scene"
import { isPlayerCamp } from "../../utils/PlayerUtils"
import { getAllSitAnimations, getAllStompAnimations, getLeftStompBlockService, getStompBlockService, getStompRubBlockService } from "../../../../../mod/SkillGiantessMod"
import { hasStudyAction } from "../../utils/build/GiantessBuildUtils"
import { buildFuncData } from "../../data/FuncData"
// import { markNearPlayerRangeNotGenerateArmy } from "./generator/ArmyGenerator"
// import { resetPlayerGoddessValue } from "../../girl/player_goddess/Girl"
// import { resetSpecificWildGiantessBlockState } from "../../../../../mod/PropOtherMod"



const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();


// let _parseAndAddResources = (state: state) => {
//     return Terrain.parseAndAddResources(state)
// }

export let parseAllWeaponModelsAndEnableAllParticls = (state: state) => {
    return Soldier.parseAllWeaponModels(state).then((rocket) => {
        return MilltaryVehicle.parseAllWeaponModels(state).then((missileVehicleMissile) => {
            return enableParticle(state, getScene(state))
                .then(state => {
                    return ParticleManager.enableDust(getAbstractState(state), getScene(state)
                    ).then(abstractState => {
                        return ParticleManager.enableStompDust(abstractState, getScene(state)
                        )
                    }).then(abstractState => {
                        return ParticleManager.enableFlame(abstractState, getScene(state)
                        )
                    })
                        // .then(abstractState => {
                        //     return ParticleManager.enableBullet(abstractState, getScene(state)
                        //     )
                        // })
                        .then(abstractState => {
                            return ParticleManager.enableRocket(abstractState, getScene(state),
                                rocket
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableMissileVehicleMissile(abstractState, getScene(state),
                                missileVehicleMissile
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableLaserBullet(abstractState, getScene(state))
                        })
                        // .then(abstractState => {
                        //     return ParticleManager.enableSubMachineBullet(abstractState, getScene(state))
                        // })
                        // .then(abstractState => {
                        //     return ParticleManager.enableFireball(abstractState, getScene(state))
                        // })
                        .then(abstractState => {
                            return ParticleManager.enableShell(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableShellEmitOrExplode(abstractState, getScene(state)
                            )
                        })

                        // .then(abstractState => {
                        //     return ParticleManager.enableBulletHit(abstractState, getScene(state)
                        //     )
                        // })
                        .then(abstractState => {
                            return ParticleManager.enableLaserBulletHit(abstractState, getScene(state))
                        })
                        // .then(abstractState => {
                        //     return ParticleManager.enableSubMachineBulletHit(abstractState, getScene(state))
                        // })
                        // .then(abstractState => {
                        //     return ParticleManager.enableFireballHit(abstractState, getScene(state))
                        // })
                        .then(abstractState => {
                            return ParticleManager.enableWaterBloom(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableMilkSplash(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableClothDestroyed(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableBlink(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableSwipingHit(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableProtect(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableGem(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableCoin(abstractState, getScene(state)
                            )
                        })
                        // .then(abstractState => {
                        //     return ParticleManager.enablePropBullet(abstractState, getScene(state)
                        //     )
                        // })
                        .then(abstractState => {
                            return ParticleManager.enablePropBulletHit(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableBloodHit(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableSparkLightHit(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableSparkHeavyHit(abstractState, getScene(state)
                            )
                        }).then(abstractState => {
                            return ParticleManager.enableWeaknessHit(abstractState, getScene(state)
                            )
                        }).then(abstactState => {
                            return setAbstractState(state, abstactState)
                        })
                })
        })
    })
}

export let destroyedHandler = (state: state, { userData }) => {
    let { fromName, toName } = NullableUtils.getExn(userData)

    // if (Army.isAttackTarget(state, fromName, toName)) {
    state = Army.clearAttackTargetObjectOrBuilding(state, toName)
    // }

    // if (isPicked(state, toName) && !Girl.isGirl(fromName)) {
    // if (isPicked(state, toName) && !isEatingFromPick(state)) {

    let promise = Promise.resolve(state)
    if (!isEatingFromPick(state, Girl.getUsedGirlByName(fromName))) {
        promise = removeFromAllData(state, toName)
    }
    return promise.then(state => {
        state = Statistic.addDestoryUnit(state, fromName, toName,
            Girl.isGirl(toName) ? NullableUtils.return_(
                Girl.getCurrentMMDCharacterName(state, Girl.getUsedGirlByName(toName))
            ) : NullableUtils.getEmpty()
        )

        if (isStatic(state, toName)) {
            return Promise.resolve(state)
        }

        if (
            !hasLifeCount(state)
            &&
            (
                LittleMan.isLittleMan(toName)
                || (Girl.isGirl(toName) && isGiantessCharacterTypeByUsedGirl(state, Girl.getUsedGirlByName(toName)))
            )
        ) {
            // return handlePickDataWhenExecuteDestroyed(state)
            return MissionAll.handleMissionFail(state, missionFinishStatus.FailByDestoyed)
        }

        return Promise.resolve(state)
    })
}

// let _girlDestroyingHandler = (state: state, { userData }) => {
//     return executeDestroying(state)
// }

export let handleLevel = (state) => {
    // state = RewardGenerator.setDisabledProps(state, List([
    //     propName.Revive,
    // ]))

    state = Girl.setIsCanActiveSmallerFunc(state, (state, usedGirl) => {
        if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
            // return getBiggerWay(state) != biggerWay.Passive
            // return getBiggerWay(state) == biggerWay.Active || getBiggerWay(state) == biggerWay.None
            return hasStudyAction(state, buildFuncData(state), actionName.Bigger)
        }

        return true
        // &&
        // /*! TODO if add action like LightStomp, need add it here(into arr) to avoid trigger smaller action after trigger these action(this can make these action not work)
        // * 
        // */
        // [].reduce((result, actionName) => {
        //     if (!result) {
        //         return result
        //     }

        //     return !Girl.isActionTriggering(state, actionName)
        // }, true)
    })


    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getPointerDownEventName(), pointdownHandle))
    // state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    // return ShellTurret.generateTurrets(state, MilltaryBuilding.getTurretPosition(state, ShellTurret.buildShellTurretCategoryName()), camp.Enemy,
    // ).then(TupleUtils.getTuple2First).then((state) => {
    //     return MissileTurret.generateTurrets(state, MilltaryBuilding.getTurretPosition(state, MissileTurret.buildMissileTurretCategoryName()),
    //         camp.Player,
    //     ).then(TupleUtils.getTuple2First).then(
    //         state => {
    return switchToCharacterType(state, characterType.LittleMan,
        NullableUtils.getExn(LittleMan.getLittleManState(state).initialPosition),
        NullableUtils.getExn(LittleMan.getLittleManState(state).initialQuaternion)
        // _v1.set(-281, 0, -65),
        // _v1.set(0, 0, 0),
        // _q.set(0, -0.707, 0, 0.707)
    )
    // }
    //     )
    // })
    // .then(state => {
    //     // TODO remove
    //     // return addBuff(state, buffName.IncreaseMoveSpeed, LittleMan.getName(), NullableUtils.getEmpty(), 5, 3).then(state => {
    //     //     state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     //         return addBuff(state, buffName.IncreaseMoveSpeed, LittleMan.getName(), NullableUtils.getEmpty(), 5, 5)
    //     //     }, 3))

    //     //     return state
    //     // })
    //     return addBuff(state, buffName.DecreaseActionSpeed, Girl.getName(), NullableUtils.return_(usedGirlEnum.WildGiantess), 10, 3).then(state => {
    //         state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //             return addBuff(state, buffName.DecreaseActionSpeed, Girl.getName(), NullableUtils.return_(usedGirlEnum.WildGiantess), 10, 3)
    //         }, 5))

    //         return state
    //     })
    // })
}

// let _disposeData = (state: state, usedGirl) => {
//     // if (!isGiantessCharacterType(state) && !Girl.isPlayerGiantess(state, usedGirl)) {
//     // if (!isGiantessCharacterType(state) && !Girl.isPlayerGiantess(state, usedGirl) && !Girl.isWildGiantess(state, usedGirl)) {
//     if (!Girl.isPlayerGirl(state, usedGirl) && !Girl.isPlayerGiantess(state, usedGirl) && !Girl.isWildGiantess(state, usedGirl)) {
//         state = disposeMMDResource(state, Girl.getGirl(state, usedGirl), getCurrentMMDData(state, usedGirl)[1])

//         state = Girl.setUsedGirlData(state, usedGirl, Girl.createUsedGirlData(usedGirl))

//         return state
//     }

//     return state
// }


// let _addGirlHandler = (state: state, { userData }) => {
//     // let { usedMMDData } = NullableUtils.getExn(userData)

//     state = resetCloth(state, usedGirl, Girl.getAllUsedMMDData(state), CollisionShapeData.getData(state))

//     return Promise.resolve(state)
// }

// let _removeGirlHandler = (state: state, { userData }) => {
//     let { usedGirl } = NullableUtils.getExn(userData)

// state = _disposeData(state, usedGirl)

//     // if (!isGiantessCharacterType(state)) {
//     // state = resetCloth(state, usedGirl, usedMMDData, CollisionShapeData.getData(state))
//     // }

//     return Promise.resolve(state)
// }


let _handleLevel = (state: state) => {
    return handleLevel(state)
    // .then(state => {
    //     state = setAbstractState(state, Event.on(getAbstractState(state), getModAPI(state).event.getAfterRemoveGirlEventName(), _removeGirlHandler))

    //     return state
    // })
}

let _addBuffs = (api, state, allBuffServices, enhenceLevel, name, maxCount: number) => {
    let autoDifficulty = Difficulty.getAutoDifficulty(state)

    // let countFactor = NumberUtils.clamp(autoDifficulty / 2, 1, 2)
    let countFactor = NumberUtils.clamp(autoDifficulty / 4, 1, 2)
    // let levelFactor = Math.floor(NumberUtils.clamp(autoDifficulty / 2, 0, 2))
    let levelFactor = Math.floor(NumberUtils.clamp(autoDifficulty / 4, 0, 2))

    let count = NumberUtils.lessThan(Math.round(enhenceLevel / 5) + countFactor, maxCount)

    if (allBuffServices.length == 0 || count == 0) {
        return Promise.resolve(state)
    }

    if (getIsDebug(state)) {
        maxCount = allBuffServices.length
        count = maxCount
    }

    let services = NumberUtils.randomSelectCount(
        allBuffServices,
        NumberUtils.getRandomInteger(1, count)
    )

    state = setInstanceColor(state, name, [1, 0, 0], services.length / maxCount)

    return ArrayUtils.reducePromise(services, (state, service: service) => {
        let maxSuperPositionCount = Buff.findBuffData(state, service.getName()).maxSuperPositionCount

        return service.addBuff(api, state, name, NullableUtils.getEmpty(), NumberUtils.getRandomInteger(
            NumberUtils.lessThan(1 + levelFactor, maxSuperPositionCount),
            maxSuperPositionCount))
    }, state)
}

let _getGenerateArmyHander = (state: state, { userData }) => {
    let { names } = NullableUtils.getExn(userData)


    let allBuffServicesForEliteGiantess: Array<service> = [
        getEliteGiantessPassiveBiggerBlockService(state),
        getEliteGiantessDamageBiggerBlockService(state),

        getEmitPoisonSingleBlockService(state),
        getEmitIceSingleBlockService(state),
        getEmitStressprotectBlockService(state),
        getEmitFragileGrowthBlockService(state),
        getEmitDoorShieldBlockService(state),
        getEmitDecreaseScaleBlockService(state),
        getEmitPullBlockService(state),
        getEmitDefenseIncreaseDefenseBlockService(state),
    ]
    let allSelectOneBuffServicesForEliteGiantess: Array<Array<service>> = [
        [
            getEmitHpRatioDirectBlockService(state),
            getEmitHpRatioInverseBlockService(state),
        ],
        [
            getEmitShootDistanceDirectBlockService(state),
            getEmitShootDistanceInverseBlockService(state),
        ]
    ]

    let allBuffServicesForArmy: Array<service> = [
        getEmitBackStabBlockService(state),

        getEmitPoisonSingleBlockService(state),
        getEmitIceSingleBlockService(state),
        getEmitStressprotectBlockService(state),
        getEmitFragileGrowthBlockService(state),
        getEmitDoorShieldBlockService(state),
        // getEmitDecreaseScaleBlockService(state),
        getEmitPullBlockService(state),
        // getEmitDefenseIncreaseDefenseBlockService(state),
    ]
    let allSelectOneBuffServicesForArmyy: Array<Array<service>> = [
        [
            getEmitHpRatioDirectBlockService(state),
            getEmitHpRatioInverseBlockService(state),
        ],
        [
            getEmitShootDistanceDirectBlockService(state),
            getEmitShootDistanceInverseBlockService(state),
        ]
    ]



    allBuffServicesForEliteGiantess = allBuffServicesForEliteGiantess.concat(
        allSelectOneBuffServicesForEliteGiantess.map(NumberUtils.randomSelect)
    )
    allBuffServicesForArmy = allBuffServicesForArmy.concat(
        allSelectOneBuffServicesForArmyy.map(NumberUtils.randomSelect)
    )



    // const maxCount = 3
    // const maxCountForArmy = 4
    // const maxCountForEliteGiantess = 5
    const maxCountForArmy = 3
    const maxCountForEliteGiantess = 3

    let api = getModAPI(state)

    let enhenceEliteGiantessLevel = getEnhenceEliteGiantessLevel(state)
    let enhenceArmyLevel = getEnhenceArmyLevel(state)
    // let enhenceArmyLevel = 10

    // let rateFactor1 = NumberUtils.clamp(Difficulty.getAutoDifficulty(state) / 1.5, 1, 2)
    let rateFactor1 = NumberUtils.clamp(Difficulty.getAutoDifficulty(state) / 3, 1, 2)
    // let rateFactor21 = NumberUtils.clamp(enhenceEliteGiantessLevel / 4, 1, 2)
    // let rateFactor22 = NumberUtils.clamp(enhenceArmyLevel / 4, 1, 2)
    let rateFactor21 = NumberUtils.clamp(enhenceEliteGiantessLevel / 6, 1, 2)
    let rateFactor22 = NumberUtils.clamp(enhenceArmyLevel / 6, 1, 2)

    return ArrayUtils.reducePromise(
        ArrayUtils.filter(names, name => {
            return !isPlayerCamp(state, name)
        }),
        (state, name: string) => {
            if (
                isEliteGiantess(state, name)
                // && NumberUtils.isRandomRate(0.2 * rateFactor1 * rateFactor21)
                && NumberUtils.isRandomRate(0.15 * rateFactor1 * rateFactor21)
                // && true
            ) {
                return _addBuffs(api, state, allBuffServicesForEliteGiantess, enhenceEliteGiantessLevel, name, maxCountForEliteGiantess)
            }
            else if (
                isArmyExceptEliteGiantess(name)
                // && NumberUtils.isRandomRate(0.1 * rateFactor1 * rateFactor22)
                && NumberUtils.isRandomRate(0.07 * rateFactor1 * rateFactor22)
                // && true
            ) {
                return _addBuffs(api, state, allBuffServicesForArmy, enhenceArmyLevel, name, maxCountForArmy)
            }

            return Promise.resolve(state)
        }, state)
}

export let initWhenImportSceneUtils = (state: state) => {
    let api = getModAPI(state)

    state = setAbstractState(state, Event.on(getAbstractState(state), api.event.getGenerateArmyEventName(), _getGenerateArmyHander))



    if (getIsDebug(state)) {
        state = setLifeCount(state, 3, characterType.LittleMan)
        state = setLifeCount(state, 3, characterType.Giantess)
    }



    return Event.trigger(state, getAbstractState, getModAPI(state).event.getInitWhenImportSceneEventName(), NullableUtils.getEmpty()).then(state => {
        return Scene.initWhenImportScene(getAbstractState(state), getAbstractState)
            .then(Outline.initWhenImportScene)
            .then(abstractState => {
                // if (!getIsProduction(abstractState)) {
                // if (getIsDebug(state)) {
                if (!getIsProduction(abstractState)) {
                    // abstractState = Stats.addStats(abstractState, Render.getRenderer(abstractState))

                    abstractState = Stats.initWhenImportScene(abstractState)
                }

                return abstractState
            })
            .then(abstractState => {
                return setAbstractState(state, abstractState)
            })
    })
        .then(UI.initWhenImportScene)
        // .then(Camera.initWhenImportScene)
        // .then(MissionAll.initWhenImportScene)
        // .then(state => WholeScene.initWhenImportScene(state, sceneResourceId))
        // .then(state => initWhenImportSceneMap(state))
        // .then(Girl.initWhenImportScene)
        // .then(LittleMan.initWhenImportScene)
        .then(Time.initWhenImportScene)
        .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene)
        // .then(WindMills.initWhenImportScene)
        .then(DynamicCars.initWhenImportScene)
        // .then(PathFind.initWhenImportScene)
        // .then(Army.initWhenImportScene)
        .then(Citiyzen.initWhenImportScene).then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene)
        .then(Melee.initWhenImportScene)
        .then(Soldier.initWhenImportScene)
        .then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene)

        .then(initWhenImportSceneArmyUtils)

        // .then(MeleeGiantess.initWhenImportScene)
        // .then(EliteGiantess.initWhenImportScene)

        .then(Terrain.initWhenImportScene).then(ArmyManager.initWhenImportScene)
        // .then(Interaction.initWhenImportScene)
        .then(parseAllWeaponModelsAndEnableAllParticls)
}

export let resgisterDamageData = (state: state) => {
    state = registerDamageData(state, { isSelfFunc: TreesAndProps.isTreesAndProps, damageFunc: TreesAndProps.damage, getValueFunc: TreesAndProps.getValue },)
    state = registerDamageData(state, { isSelfFunc: Buildings.isBuildings, damageFunc: Buildings.damage, getValueFunc: Buildings.getValue },)
    state = registerDamageData(state, { isSelfFunc: Cars.isCars, damageFunc: Cars.damage, getValueFunc: Cars.getValue },)

    state = registerDamageData(state, { isSelfFunc: Citiyzen.isCityzen, damageFunc: Citiyzen.damage, getValueFunc: Citiyzen.getValue },)

    state = registerDamageData(state, { isSelfFunc: Infantry.isInfantry, damageFunc: Infantry.damage(Soldier.damage), getValueFunc: Infantry.getValue },)
    state = registerDamageData(state, { isSelfFunc: Rocketeer.isRocketeer, damageFunc: Rocketeer.damage(Soldier.damage), getValueFunc: Rocketeer.getValue },)
    state = registerDamageData(state, { isSelfFunc: Laserer.isLaserer, damageFunc: Laserer.damage(Soldier.damage), getValueFunc: Laserer.getValue },)
    state = registerDamageData(state, { isSelfFunc: Commander.isCommander, damageFunc: Commander.damage(Soldier.damage), getValueFunc: Commander.getValue },)
    state = registerDamageData(state, { isSelfFunc: Melee.isMelee, damageFunc: Melee.damage(Soldier.damage), getValueFunc: Melee.getValue },)

    state = registerDamageData(state, { isSelfFunc: Tank.isTank, damageFunc: Tank.damage(MilltaryVehicle.damage), getValueFunc: Tank.getValue },)
    state = registerDamageData(state, { isSelfFunc: MissileVehicle.isMissileVehicle, damageFunc: MissileVehicle.damage(MilltaryVehicle.damage), getValueFunc: MissileVehicle.getValue },)
    state = registerDamageData(state, { isSelfFunc: FlameVehicle.isFlameVehicle, damageFunc: FlameVehicle.damage(MilltaryVehicle.damage), getValueFunc: FlameVehicle.getValue },)


    state = registerDamageData(state, { isSelfFunc: ShellTurret.isShellTurret, damageFunc: ShellTurret.damage(MilltaryBuilding.damage), getValueFunc: ShellTurret.getValue },)
    state = registerDamageData(state, { isSelfFunc: MissileTurret.isMissileTurret, damageFunc: MissileTurret.damage(MilltaryBuilding.damage), getValueFunc: MissileTurret.getValue },)



    // state = registerDamageData(state, { isSelfFunc: MeleeGiantess.isMeleeGiantess, damageFunc: MeleeGiantess.damage(EliteGiantess.damage), getValueFunc: MeleeGiantess.getValue },)
    state = registerAllEliteGiantessDamageData(state)



    state = registerDamageData(state, { isSelfFunc: DynamicCars.isDynamicCar, damageFunc: DynamicCars.damage, getValueFunc: DynamicCars.getValue },)
    // state = registerDynamicData(state, { isSelfFunc: WindMills.isWindMill, damageFunc: WindMills.damage, getValueFunc: WindMills.getValue },)



    // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: Girl.damage, getValueFunc: Girl.getValue },)
    state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)

    state = registerDamageGiantessFunc(state, Girl.damage)



    return state
}

export let initWhenImportScene = (state: state) => {
    state = setGameEventDirectorData(state, getData(state))

    return setCharacterType(state, characterType.LittleMan).then(state => {
        state = setAllCollisionParts(state, getDefaultAllCollisionParts())

        // state = setConfigData(state, {
        //     ...getConfigData(state),
        //     collisionShapeData: CollisionShapeData.getData(state),
        // })
        state = setCollisionShapeData(state, CollisionShapeData.getData)


        // state = setBehaviourTreeData(state, BehaviourTreeManager.getKey(), BehaviourTreeData.getData([
        //     BehaviourTreeManager.getSettingFactorAffectBiggerRate,
        //     NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
        //     state => {
        //         return getGirlScale(state, usedGirl) < Girl.getValue(state).minScaleAsMiddleGiantess
        //     },
        //     Girl.
        //     () => Girl.getValue(state),
        //     isChangeScaling,
        //     isPose,
        //     BehaviourTreeManager.getVeryNearestTargetCount
        // ]))

        // state = BehaviourTreeManager.markWhetherNotExecuteGiantessAI(state,usedGirl, true)

        return initWhenImportSceneUtils(state)
    })
        .then(GameEventDirector.initWhenImportScene)
        .then(ArmyDirector.initWhenImportScene)

        .then(state => initWhenImportSceneMap(state, buildBuildingAndTreeAndInteractionConfig(state),
            getLoadResourceIdData(state),
            getAllMapData(state)
        ))
        // return Scene.initWhenImportScene(getAbstractState(state)).then(abstractState => {
        //     return setAbstractState(state, abstractState)
        // })
        //     .then(UI.initWhenImportScene)
        .then(MissionAll.initWhenImportScene)
        //     .then(state => WholeScene.initWhenImportScene(state, getSceneResourceId()))
        .then(Girl.initWhenImportScene)
        .then(LittleMan.initWhenImportScene)
        // .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene).then(MapWall.initWhenImportScene)
        // // .then(WindMills.initWhenImportScene)
        // .then(DynamicCars.initWhenImportScene)
        // .then(PathFind.initWhenImportScene)
        // .then(Citiyzen.initWhenImportScene).then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene).then(Melee.initWhenImportScene).then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene).then(Terrain.initWhenImportScene).then(ArmyManager.initWhenImportScene)

        .then(BehaviourTreeManager.initWhenImportScene)

        // .then(parseAllWeaponModelsAndEnableAllParticls)
        .then(state => {
            return UI.registerBossStatusUpdateFunc(state, updateStatus)
        })
        .then(resgisterDamageData)
        .then(_handleLevel)
}

// export let init = (state: state) => {
//     return _parseAndAddResources(state)
// }

export let updateUtils2 = (state: state) => {
    // return MissionAll.update(state)
    // .then(DynamicCars.update).then(Citiyzen.update)

    return Event.trigger(state, getAbstractState, getModAPI(state).event.getUpdateEventName(), NullableUtils.getEmpty()).then(Infantry.update)
        .then(Rocketeer.update).then(Laserer.update).then(Commander.update).then(Melee.update).then(Tank.update).then(MissileVehicle.update).then(FlameVehicle.update).then(ShellTurret.update).then(MissileTurret.update)
        // .then(MeleeGiantess.update)

        .then(ArmyManager.update)
        .then(RewardGenerator.update)
        .then(Build.update)
        .then(Difficulty.update)
        .then(Status.update)
        .then(Interaction.update)
        // .then(GameEventDirector.update)
        .then(updateStaticDynamic)
        .then(updateSettingMod)
        .then(GameEventDirector.update)
        .then(updateScenarioManager)
}

export let updateUtils = (state: state) => {
    return updateUtils2(state).then(
        state =>
            BehaviourTreeManager.update(state)
    )
}

export let updateHeadLookatTarget = (state: state, usedGirl) => {
    if (isLittleCharacterType(state)) {
        if (
            //     !NullableUtils.isNullable(
            //     BehaviourTreeManager.getTarget(state, usedGirl)
            // )
            // && NullableUtils.getExn(BehaviourTreeManager.getTarget(state, usedGirl)).isAliveFunc(state)
            BehaviourTreeManager.hasTarget(state, usedGirl)
        ) {
            let { getPositionFunc } = NullableUtils.getExn(BehaviourTreeManager.getTarget(state, usedGirl))

            state = headLookat(state,
                (state, euler) => {
                    switch (getCurrentAnimationName(state, usedGirl)) {
                        case animationName.CrawlMove:
                            euler.x = 0
                            return euler
                        // case animationName.BreastPress:
                        //     euler.x = 0
                        //     euler.y = 0
                        //     return euler
                        default:
                            return euler
                    }
                },
                usedGirl,
                getPositionFunc(state),
                [
                    animationName.Idle,
                    animationName.Walk,
                    animationName.Run,

                    // animationName.Stomp,

                    // TODO restore
                    // animationName.StandToCrawl,
                    // animationName.CrawlToStand,
                    // animationName.KeepCrawl,
                    // animationName.CrawlMove,
                    // animationName.BreastPress,
                ]
                    .concat(
                        getAllStompAnimations(state)
                    )
                    .concat(
                        getAllSitAnimations(state)
                    )
            )
        }
        else {
            state = disposeLookat(state, usedGirl)
        }
    }

    return state
}

export let update = (state: state): Promise<state> => {
    // return promise.then(Mission.update).then(updateUtils)
    // .then(markNearPlayerRangeNotGenerateArmy)

    return Mission.update(state).then(updateUtils).then(state => {
        let promise
        if (!isEnter(state)) {
            promise = ArrayUtils.reducePromise(Girl.getCurrentUsedGirls(state), (state, usedGirl) => {
                return Girl.update(state, usedGirl).then(state => updateHeadLookatTarget(state, usedGirl))
            }, state)

            promise = promise.then(LittleMan.update).then(Camera.update)
        }
        else {
            promise = Promise.resolve(state)
        }

        return promise
    })
}

let _triggerDisposeEventForMod = (state) => {
    return Event.trigger(state, getAbstractState, getModAPI(state).event.getDisposeEventName(), NullableUtils.getEmpty())
        .then(disposeAllMods)
}

export let disposeUtils2 = (state: state) => {
    let scene = getScene(state)

    let api = getModAPI(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), api.event.getGenerateArmyEventName(), _getGenerateArmyHander))

    return _triggerDisposeEventForMod(state)
        .then(Girl.dispose)
        .then(LittleMan.dispose).then(Buildings.dispose).then(Cars.dispose)
        .then(disposeMap)

        .then(Soldier.dispose).then(MilltaryVehicle.dispose).then(MilltaryBuilding.dispose)
        // .then(EliteGiantess.dispose)


        .then(TreesAndProps.dispose).then(MissionAll.dispose).then(Terrain.dispose).then(PathFind.dispose)
        .then(Army.dispose)
        // .then(BehaviourTreeManager.dispose)
        .then(RewardGenerator.dispose)
        .then(Character.dispose)
        .then(Build.dispose)
        .then(Difficulty.dispose)
        .then(Status.dispose)
        .then(Buff.dispose)
        .then(StaticDynamicUnit.dispose)
        .then(Time.dispose)
        .then(TweenManager.dispose)
        .then(User.dispose)
        .then(Interaction.dispose)
        .then(Statistic.dispose)
        .then(FastProp.dispose)
        .then(EliteGiantess.dispose)
        // .then(state => {
        //     DisposeUtils.removeAndDispose(Scene.getScene(getAbstractState(state)), scene)

        //     return state
        // })
        .then(state => {
            return disposeStaticDynamic(state)
        }).then(writeState)
}

export let disposeUtils = (state: state) => {
    return disposeUtils2(state)
        .then(BehaviourTreeManager.dispose)
}

export let disposePlayLevel = (state: state) => {
    state = ArrayUtils.reduce(Girl.getCurrentUsedGirls(state), (state, usedGirl) => {
        state = disposeLookat(state, usedGirl)
        return disposeShoe(state, usedGirl)
    }, state)


    // state = clearSceneLoadData(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getPointerDownEventName(), pointdownHandle))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return disposeUtils(state)
        .then(GameEventDirector.dispose)
}

export let dispose = (state: state) => {
    // state = setAbstractState(state, Event.off(getAbstractState(state), getModAPI(state).event.getAfterRemoveGirlEventName(), _removeGirlHandler))

    return disposePlayLevel(state)
        .then(ArmyDirector.dispose)
}

// export let getCityzen1ResourceId = () => "cityzen1"

// export let getCityzen2ResourceId = () => "cityzen2"

export let getSay1SoundResourceId = () => "play_level1_say1"



// export let getLaserBulletResourceId = () => getLaserResourcePath()


export let getPropLoadData = (state: state) => {
    // return buildAllProps(state, 0).toArray().map(p => {
    return buildAllLocalAndBulletProps(state, 0).toArray().map(p => {
        return {
            id: p.name,
            path: p.imageSrc,
            type: resourceType.Texture
        }
    })
}


export let getLoadData = (state: state) => {
    return [
        // getRandomMapLoadData(state),

        // {
        //     id: getCityzen1ResourceId(),
        //     path: `./resource/${getName()}/cityzen/${getCityzen1ResourceId()}.glb`,
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: getCityzen2ResourceId(),
        //     path: `./resource/${getName()}/cityzen/${getCityzen2ResourceId()}.glb`,
        //     type: resourceType.ArrayBuffer
        // },

        {
            id: getSay1SoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/play/level1/${getSay1SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
    ].concat(
        getRandomMapLoadData(state, getInteractionLoadData(state)) as any
    ).concat(
        getPropLoadData(state) as any
    )
}

export let createAllUsedGirlData = (state: state) => {
    return [
        usedGirlEnum.WildGiantess,
        usedGirlEnum.EnemyGiantess,
        usedGirlEnum.PlayerGoddess,
        usedGirlEnum.PlayerGirl,
        usedGirlEnum.BossGiantess,
        ...getUsedGirl(state)
    ].reduce((state, usedGirl) => {
        state = Girl.setUsedGirlData(state, usedGirl, Girl.createUsedGirlData(usedGirl))

        return BehaviourTreeManager.initUsedGirlData(state, usedGirl)
    }, state)

}

export let handleBeforeLoadResourcePlayLevel = (state: state, character) => {
    state = createAllUsedGirlData(state)

    state = Girl.setCurrentMMDCharacterByUsedGirl(state, character, usedGirlEnum.PlayerGirl)


    state = setConfigData(state, {
        ...getConfigData(state),
        littleManValue: NullableUtils.return_(
            LittleManData.getValue(state)
        ),


        allMMDData: getAllMMDData(state),

        shoeData: getConfigData(state).shoeData.concat(getShoeData(state)),

        clothCollisionData: getClothCollisionData(state),
    })

    return state
}

export let setPlayerMMDValue = (state: state) => {
    state = resetPlayerGirlValue(state)
    // state = resetPlayerGoddessValue(state)

    return state
}

export let setCurrentMMDCharacter = (state: state, usedMMDData) => {
    // return setCurrentMMDCharacter(state, NullableUtils.getExn(usedMMDData.find(d => d.usedGirl == getGirlState(state).currentUsedGirl)).data[0])
    return usedMMDData.reduce((state, data) => {
        return Girl.setCurrentMMDCharacterByUsedGirl(state, data.data[0], data.usedGirl)
    }, state)
}


export let handleBeforeLoadResource = (state: state, character) => {
    state = handleBeforeLoadResourcePlayLevel(state, character)

    return initAllLevelGirlValue(state).then(state => {
        state = setConfigData(state, {
            ...getConfigData(state),
            // girlValueMap: getConfigData(state).girlValueMap.set(
            //     usedGirlEnum.WildGiantess,
            //     WildGiantessData.getValue(state)
            // ).set(
            //     usedGirlEnum.EnemyGiantess,
            //     EnemyGiantessData.getValue(state)
            // ),


            gameEventData: NullableUtils.return_(GameEventData.getData(state)),

            rewardData: RewardGenerator.mergeRewardData(NullableUtils.getExn(getConfigData(state).rewardData), getRewardData(state)),
        })

        let allUsedMMDData = getAllRandomUsedMMDData(state)
        // state = resetSpecificWildGiantessBlockState(state)

        state = setUsedMMDData(state, allUsedMMDData)

        state = setCurrentMMDCharacter(state, allUsedMMDData)

        state = setPlayerMMDValue(state)


        state = initClothHpData(state, getClothHpData, allUsedMMDData)

        // state = Girl.setUsedGirlData(state, usedGirl,{
        //     ...Girl.getUsedGirlData(state, usedGirl),
        //     usedMMDData: getAllUsedMMDData(state)
        // })
        // state = setUsedMMDData(state, allUsedMMDData)

        state = setScenaryData(state, ScenarioData.getData(state))

        return state
    })
}