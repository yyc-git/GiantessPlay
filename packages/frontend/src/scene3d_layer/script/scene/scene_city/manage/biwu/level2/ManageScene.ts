import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState, writeState } from "../../../../../../state/State"
import { cameraType, state } from "../../../../../../type/StateType"
import * as Girl from "../../../girl/Girl"
import * as GirlBiwuLevel2 from "./Girl"
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
import { getAnimationBlendDataParam, getCharacterBloodResourceId, getCharacterShadowResourceId, getConfigData, getGirlScale, getLevelData, getName, getScene, isLittleRoad, setBehaviourTreeData, setConfigData, setLevelData, setRoad } from "../../../CityScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
// import { GrassInstance } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { dispose as disposeStaticDynamic, registerDamageData, registerDamageGiantessFunc } from "../../../StaticDynamic"
// import { isThirdPersonCamera } from "../../../Camera"
import * as Camera from "../../../Camera"
import { Event } from "meta3d-jiehuo-abstract"
import { getKeyDownEventName } from "meta3d-jiehuo-abstract/src/Event"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as UI from "../../../UI"
import { physicsLevel, resourceType, road } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as BehaviourTreeData from "../../../data/biwu/level2/behaviour_tree_data/BehaviourTreeData"
import * as GirlData from "../../../data/biwu/level2/GirlData"
import * as LittleManData from "../../../data/biwu/level2/LittleManData"
import * as BehaviourTreeManager from "../../../data/biwu/level2/behaviour_tree_data/BehaviourTreeManager"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData } from "../../../girl/PickPose"
import { getCurrentAnimationName, isChangeScaling } from "../../../girl/Animation"
import { isPose } from "../../../girl/Pose"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import * as ManageSceneLevel1 from "../level1/ManageScene"
import { getAllMMDData, getClothCollisionData, getClothHpData, getShoeData } from "../../../data/biwu/level2/mmd/MMDData"
import { getAnimationBlendData, getAnimationCollisionData, getArticluatedAnimationData } from "../../../data/biwu/level2/Data"
import { getAllAnimationNames, getLightStompAnimationNames } from "../../../data/biwu/level2/AnimationNames"
import { getAnimationFrameCountMap } from "../../../data/biwu/level2/Const"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getAnimationCollisionDataParam } from "../../../girl/Collision"
import { parseAllWeaponModelsAndEnableAllParticls } from "../../city1/ManageScene"
import { setExcitement } from "../../../girl/Excitement"
import { markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import { triggerMainEvent } from "../../../game_event/GameEvent"
import * as GameEventData from "../../../data/biwu/level2/GameEventData"
import * as ScenarioData from "../../../data/biwu/level2/ScenarioData"
import { getExitScenarioEventName } from "../../../../../../utils/EventUtils"
import { Quaternion, Vector3 } from "three"
import { Console } from "meta3d-jiehuo-abstract"
import { isEnter } from "../../../scenario/ScenarioManager"
import * as Utils from "../Utils"
import { animationName } from "../../../data/biwu/level2/DataType"
import { Flow } from "meta3d-jiehuo-abstract"
import { disposeLookat, headLookat } from "../../../girl/Lookat"
import { disposeShoe } from "../../../data/mmd/Shoe"
import { getBody } from "../../../data/mmd/MMDData"
import { isFinish } from "../../../scenario/Command"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../../utils/EventUtils"
import { handleMissionFail } from "../../city1/little_man/Mission"
import { handleMissionComplete } from "../../city1/giantess/Mission"
import { getDefaultAllCollisionParts, setAllCollisionParts } from "../../../utils/CollisionUtils"
import * as CollisionShapeData from "../../../data/CollisionShapeData"

const _q = new Quaternion();
const _v1 = new Vector3();

let _exitScenarioHandler = (state: state, { userData }) => {
    state = markWhetherNotExecuteGiantessAI(state, false)

    return Promise.resolve(state)
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

let _handleLevel = (state: state) => {
    state = setExcitement(state, 0)

    state = markWhetherNotExecuteGiantessAI(state, true)

    state = setLevelData(state, _buildHardKey(), false)

    state = ManageSceneLevel1.initProp(state, 2)

    // state = _intervalPickdownArmy(state)

    state = setAbstractState(state, Event.on(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return triggerMainEvent(state, GameEventData.eventName.Begin)
}

export let initWhenImportScene = (state: state) => {
    state = Utils.initWhenImportScene(state)

    state = setAllCollisionParts(state, getDefaultAllCollisionParts())
    state = setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: CollisionShapeData.getData(state),
    })


    state = Utils.setGirlCanDamageTarget(state)

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



            // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: GirlBiwuLevel2.damage, getValueFunc: Girl.getValue },)
            state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)


            state = registerDamageGiantessFunc(state, GirlBiwuLevel2.damage)


            return state
        })
        .then(_handleLevel)
}

export let init = ManageSceneLevel1.init

let _dispose = (state: state) => {
    state = disposeLookat(state)

    state = disposeShoe(state)

    state = setAbstractState(state, Event.off(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return state
}

let _buildHardKey = () => "Hard"

export let isHard = (state: state) => {
    return NullableUtils.getWithDefault(
        getLevelData(state, _buildHardKey()),
        false
    )
}

let _update = (state: state) => {
    state = headLookat(state,
        LittleManTransform.getWorldPosition(state),
        [animationName.Idle, animationName.Walk, animationName.Stomp, animationName.PickdownFromIdle].concat(
            getLightStompAnimationNames() as any
        )
    )

    if (!isHard(state) && isFinish(state)
        && getCurrentAnimationName(state) == animationName.Idle
        && Girl.getHp(state, getBody()) < Girl.getFullHp(state) * 0.5) {
        state = setLevelData(state, _buildHardKey(), true)

        return triggerMainEvent(state, GameEventData.eventName.Hard)
    }


    return Promise.resolve(state)
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

export let getSceneResourceId = ManageSceneLevel1.getSceneResourceId

export let getRubSoundResourceId = () => "rub"

export let getLightStompSoundResourceId = () => "lightStomp"

export let getSay1SoundResourceId = () => "biwu_level2_say1"

export let getSay2SoundResourceId = () => "biwu_level2_say2"

export let getSayPutdownNormalSoundResourceId = () => "biwu_level2_sayPutdownNormal"

export let getSayPutdownHardSoundResourceId = () => "biwu_level2_sayPutdownHard"

export let getSayHardSoundResourceId = () => "biwu_level2_sayHard"

export let getSay31SoundResourceId = () => "biwu_level2_say3_1"

export let getSay32SoundResourceId = () => "biwu_level2_say3_2"

export let getSay33SoundResourceId = () => "biwu_level2_say3_3"

export let getHeavyStressingSoundResourceId = () => "biwu_level2_heavy_stressing"

export let getLoadData = () => {
    return [
        {
            id: getSceneResourceId(),
            path: `./resource/${getName()}/scene_biwu.glb`,
            type: resourceType.ArrayBuffer
        },
    ].concat(
        [
            {
                id: getRubSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getRubSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getLightStompSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getLightStompSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },

            {
                id: getSay1SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSay1SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSay2SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSay2SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayPutdownNormalSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSayPutdownNormalSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayPutdownHardSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSayPutdownHardSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHardSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSayHardSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSay31SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSay31SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSay32SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSay32SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSay33SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level2/${getSay33SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },

            {
                id: getHeavyStressingSoundResourceId(),
                path: [`./resource/${getName()}/audio/biwu/level2/${getHeavyStressingSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
        ] as any
    )
}

export let handleBeforeLoadResource = (state: state) => {
    state = ManageSceneLevel1.setByDiffiuculty(state)

    state = setConfigData(state, {
        ...getConfigData(state),
        girlAllAnimationNames: getAllAnimationNames(),
        girlAllAnimationFrameCountMap: MutableMapUtils.concat(getConfigData(state).girlAllAnimationFrameCountMap, getAnimationFrameCountMap() as any),
        // getConfigData(state).girlValue

        articluatedAnimationData: getConfigData(state).articluatedAnimationData.concat(getArticluatedAnimationData()),

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
        shoeData: getConfigData(state).shoeData.concat(getShoeData()),
        clothCollisionData: getClothCollisionData(),

        gameEventData: GameEventData.getData(),
        scenaryData: ScenarioData.getData(Girl.getCurrentMMDCharacterName(state)),
    })

    state = setConfigData(state, {
        ...getConfigData(state),
        clothHpData: NullableUtils.return_(getClothHpData(state)),
    })

    return state
}