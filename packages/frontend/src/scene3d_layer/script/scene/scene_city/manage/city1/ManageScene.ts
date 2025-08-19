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
import * as PathFind from "./PathFind"
import * as ArmyManager from "./ArmyManager"
import { getScene, getName, setBehaviourTreeData, getGirlScale, setConfigData, getConfigData, isGiantessRoad, isLittleRoad } from "../../CityScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
// import { GrassInstance } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { dispose as disposeStaticDynamic, registerDamageData, registerDamageGiantessFunc } from "../../StaticDynamic"
// import { isThirdPersonCamera } from "../../Camera"
import * as Camera from "../../Camera"
import { isEnter } from "../../scenario/ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { getKeyDownEventName } from "meta3d-jiehuo-abstract/src/Event"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as UI from "../../UI"
import * as BehaviourTreeManager from "../../behaviour_tree/BehaviourTreeManager"
import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as BehaviourTreeData from "../../data/behaviour_tree_data/BehaviourTreeData"
import * as GirlData from "../../data/play/level1/GirlData"
import * as LittleManData from "../../data/play/level1/LittleManData"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData } from "../../girl/PickPose"
import { isChangeScaling } from "../../girl/Animation"
import { isPose } from "../../girl/Pose"
import { attackTarget, camp } from "../../type/StateType"
import { getAllMMDData, getClothHpData, getShoeData } from "../../data/mmd/MMDData"
import * as ScenarioData from "../../data/ScenarioData"
import { animationName } from "../../data/DataType"
import { disposeLookat, headLookat } from "../../girl/Lookat"
import { disposeShoe } from "../../data/mmd/Shoe"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../utils/EventUtils"
import { executeDestroyed } from "../../little_man/FSMState"
import { executeDestroying } from "../../girl/FSMState"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getDefaultAllCollisionParts, setAllCollisionParts } from "../../utils/CollisionUtils"
import * as CollisionShapeData from "../../data/CollisionShapeData"

let _parseAndAddResources = (state: state) => {
    return Terrain.parseAndAddResources(state)
}

export let parseAllWeaponModelsAndEnableAllParticls = (state: state) => {
    return Soldier.parseAllWeaponModels(state).then((rocket) => {
        return MilltaryVehicle.parseAllWeaponModels(state).then((missileVehicleMissile) => {
            return ParticleManager.enableDust(getAbstractState(state), getScene(state)
            ).then(abstractState => {
                return ParticleManager.enableStompDust(abstractState, getScene(state)
                )
            }).then(abstractState => {
                return ParticleManager.enableFlame(abstractState, getScene(state)
                )
            })
                .then(abstractState => {
                    return ParticleManager.enableBullet(abstractState, getScene(state)
                    )
                })
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
                .then(abstractState => {
                    return ParticleManager.enableShell(abstractState, getScene(state)
                    )
                }).then(abstractState => {
                    return ParticleManager.enableShellEmitOrExplode(abstractState, getScene(state)
                    )
                }).then(abstractState => {
                    return ParticleManager.enableBulletHit(abstractState, getScene(state)
                    )
                }).then(abstractState => {
                    return ParticleManager.enableLaserBulletHit(abstractState, getScene(state))
                }).then(abstractState => {
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
                    return ParticleManager.enablePropBullet(abstractState, getScene(state)
                    )
                }).then(abstractState => {
                    return ParticleManager.enablePropBulletHit(abstractState, getScene(state)
                    )
                }).then(abstactState => {
                    return setAbstractState(state, abstactState)
                })
        })
    })
}

let _destroyedHandler = (state: state, { userData }) => {
    let { fromName, toName } = NullableUtils.getExn(userData)

    if (LittleMan.isLittleMan(toName)) {
        return executeDestroyed(state)
    }

    return Promise.resolve(state)
}

let _girlDestroyingHandler = (state: state, { userData }) => {
    return executeDestroying(state)
}

let _handleLevel = (state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return ShellTurret.generateTurrets(state, MilltaryBuilding.getTurretPosition(state, ShellTurret.buildShellTurretCategoryName()), camp.LittleMan,
        attackTarget.Giantess
    ).then(TupleUtils.getTuple2First).then((state) => {
        return MissileTurret.generateTurrets(state, MilltaryBuilding.getTurretPosition(state, MissileTurret.buildMissileTurretCategoryName()),
            camp.LittleMan,
            attackTarget.Giantess
        ).then(TupleUtils.getTuple2First)
    })
}

export let initWhenImportScene = (state: state) => {
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
        .then(Girl.initWhenImportScene)
        .then(LittleMan.initWhenImportScene)
        .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene).then(MapWall.initWhenImportScene)
        // .then(WindMills.initWhenImportScene)
        .then(DynamicCars.initWhenImportScene)
        .then(PathFind.initWhenImportScene)
        .then(Citiyzen.initWhenImportScene).then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene).then(Melee.initWhenImportScene).then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene).then(Terrain.initWhenImportScene).then(ArmyManager.initWhenImportScene).then(BehaviourTreeManager.initWhenImportScene)
        .then(parseAllWeaponModelsAndEnableAllParticls).then(state => {
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


            state = registerDamageData(state, { isSelfFunc: DynamicCars.isDynamicCar, damageFunc: DynamicCars.damage, getValueFunc: DynamicCars.getValue },)
            // state = registerDynamicData(state, { isSelfFunc: WindMills.isWindMill, damageFunc: WindMills.damage, getValueFunc: WindMills.getValue },)



            // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: Girl.damage, getValueFunc: Girl.getValue },)
            state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)

            state = registerDamageGiantessFunc(state, Girl.damage)



            return state
        })
        .then(_handleLevel)
}

export let init = (state: state) => {
    return _parseAndAddResources(state)
}

export let update = (state: state): Promise<state> => {
    if (isLittleRoad(state)) {
        if (!NullableUtils.isNullable(
            BehaviourTreeManager.getTarget(state)
        )) {
            let { getPositionFunc } = NullableUtils.getExn(BehaviourTreeManager.getTarget(state))

            state = headLookat(state,
                getPositionFunc(state),
                [
                    animationName.Idle,
                    animationName.Walk,
                    animationName.Run,

                    animationName.Stomp,

                    animationName.StandToCrawl,
                    animationName.CrawlToStand,
                    animationName.KeepCrawl,
                    animationName.CrawlMove,
                    animationName.BreastPress,
                ]
            )
        }
        else {
            state = disposeLookat(state)
        }
    }

    let promise
    if (!isEnter(state)) {
        promise = Girl.update(state).then(LittleMan.update).then(Camera.update)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(Mission.update).then(DynamicCars.update).then(Citiyzen.update).then(Infantry.update).then(Rocketeer.update).then(Laserer.update).then(Commander.update).then(Melee.update).then(Tank.update).then(MissileVehicle.update).then(FlameVehicle.update).then(ShellTurret.update).then(MissileTurret.update).then(ArmyManager.update).then(BehaviourTreeManager.update)
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    state = disposeLookat(state)

    state = disposeShoe(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return Girl.dispose(state).then(LittleMan.dispose).then(Buildings.dispose).then(Cars.dispose)
        // .then(WindMills.dispose)
        .then(DynamicCars.dispose).then(Citiyzen.dispose).then(Soldier.dispose).then(MilltaryVehicle.dispose).then(MilltaryBuilding.dispose).then(TreesAndProps.dispose).then(Mission.dispose).then(Terrain.dispose).then(PathFind.dispose)
        .then(Army.dispose)
        .then(BehaviourTreeManager.dispose)
        .then(state => {
            DisposeUtils.removeAndDispose(Scene.getScene(getAbstractState(state)), scene)

            return state
        }).then(state => {
            return disposeStaticDynamic(state)
        }).then(writeState)
}

export let getSceneResourceId = () => "city1"

export let getCityzen1ResourceId = () => "cityzen1"

export let getCityzen2ResourceId = () => "cityzen2"

export let getSay1SoundResourceId = () => "play_level1_say1"

export let getHeavyStressingSoundResourceId = () => "heavy_stressing"

export let getLoadData = () => {
    return [
        {
            id: getSceneResourceId(),
            path: `./resource/${getName()}/scene.glb`,
            type: resourceType.ArrayBuffer
        },

        {
            id: getCityzen1ResourceId(),
            path: `./resource/${getName()}/cityzen/${getCityzen1ResourceId()}.glb`,
            type: resourceType.ArrayBuffer
        },
        {
            id: getCityzen2ResourceId(),
            path: `./resource/${getName()}/cityzen/${getCityzen2ResourceId()}.glb`,
            type: resourceType.ArrayBuffer
        },

        {
            id: getSay1SoundResourceId(),
            path: [`./resource/${getName()}/audio/scenario/play/level1/${getSay1SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },

        {
            id: getHeavyStressingSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getHeavyStressingSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
    ]
}

export let handleBeforeLoadResource = (state: state) => {
    state = setConfigData(state, {
        ...getConfigData(state),
        girlValue: NullableUtils.return_(
            isGiantessRoad(state) ?
                GirlData.getValueForGiantessRoad(state)
                : GirlData.getValueForLittleManRoad(state)
        ),
        littleManValue: NullableUtils.return_(
            LittleManData.getValue(state)
        ),


        allMMDData: getAllMMDData(),

        shoeData: getConfigData(state).shoeData.concat(getShoeData()),

        scenaryData: ScenarioData.getData(Girl.getCurrentMMDCharacterName(state)),
    })

    state = setConfigData(state, {
        ...getConfigData(state),
        clothHpData: NullableUtils.return_(getClothHpData(state)),
    })

    return state
}