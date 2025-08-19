import { Vector3, Box3, DirectionalLight, PerspectiveCamera, Group, Object3D, DirectionalLightHelper, PointLight, SphereGeometry, MeshBasicMaterial, Mesh, PCFShadowMap, BasicShadowMap, MeshPhysicalMaterial, Color, Sprite, GridHelper } from "three"
// import { createLabal } from "meta3d-jiehuo-abstract"
// import { range } from "meta3d-jiehuo-abstract"
// import { getCitySceneState, getRenderState, getSceneState, setAllScenesState, setSceneState } from "../../../state/State"
import { cameraType, state } from "../../../type/StateType"
// import { createState as createCabinetState, findAllCabinets, findOriginCabinet, init as initCabinet, update as updateCabinet, dispose as disposeCabinet, playDrawerGoInArticluatedAnimation, findAllDrawers, getCabinetNumber } from "./Cabinet"
// import { addInstanceIdPostfixToObject, convertLODToInstanceMeshLOD, updateAllInstanceMatrices } from "meta3d-jiehuo-abstract"
// import { parseGlb } from "meta3d-jiehuo-abstract"
// import { getResource } from "meta3d-jiehuo-abstract"
// import { addAmbientLight, buildResourceId } from "meta3d-jiehuo-abstract"
// import { Scene.findObjects, getScene as getWholeScene, setCurrentScene } from "../Scene"
// import { getOrbitControls, setCurrentCamera, setOrbitControls } from "meta3d-jiehuo-abstract"
// import { getHeight, getWidth } from "meta3d-jiehuo-abstract"
import { armyCount, biggerFrequency, thirdPersonCameraTarget, cityScene, excitementIncrease, giantessScale, giantessStrength, littleManStrength, objectStateName, propCount, targetPrior, configData, difficulty } from "./type/StateType"
import { getAbstractState, getCitySceneState, setAbstractState, setCitySceneState } from "../../../state/State"
// import { Scene.findObjects, getScene as getWholeScene, setCurrentScene } from "meta3d-jiehuo-abstract"
// import { getRenderState } from "meta3d-jiehuo-abstract"
import { getAllScenes, getIsDebug } from "../Scene"
import { Device, Layer, NullableUtils } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import { Billboard, Camera, Instance, Loader, Scene, ModelLoader, State, View, StaticLODContainer } from "meta3d-jiehuo-abstract"
// import * as Girl from "./girl/Girl"
// import * as Girl from "."
// import * as BuildCabinetBody from "./model/city1/BuildCabinetBody"
import { road, fontType, labelAnimation, resourceType, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as ManageSceneCity1 from "./manage/city1/ManageScene"
import * as ManageSceneBiwuLevel1 from "./manage/biwu/level1/ManageScene"
import * as ManageSceneBiwuLevel2 from "./manage/biwu/level2/ManageScene"
import * as ManageSceneBiwuLevel3 from "./manage/biwu/level3/ManageScene"
import * as BuildSceneCity1 from "./model/city1/BuildScene"
import * as BuildSceneBiwuLevel1 from "./model/biwu/level1/BuildScene"
import * as BuildSceneBiwuLevel2 from "./model/biwu/level2/BuildScene"
import * as BuildSceneBiwuLevel3 from "./model/biwu/level3/BuildScene"
// import * as Trees from "./manage/city1/Trees"
import * as TreesAndProps from "./manage/city1/TreesAndProps"
import * as Buildings from "./manage/city1/Buildings"
import * as Cars from "./manage/city1/Cars"
import * as Tiles from "./manage/city1/Tiles"
import * as Mountains from "./manage/city1/Mountains"
// import * as Plant from "./manage/city1/Plant"
import * as Grass from "./manage/city1/Grass"
import * as Terrain from "./manage/city1/Terrain"
import * as Map from "./manage/city1/Map"
// import * as WindMills from "./manage/city1/WindMills"
import * as DynamicCars from "./manage/city1/DynamicCars"
// import * as Flower from "./manage/city1/Flower"
// import * as Animated from "./manage/city1/Animated"
// import * as OtherGirls from "./manage/city1/OtherGirls"
import * as Mission from "./manage/city1/Mission"
import * as Army from "./manage/city1/Army"
import * as Citiyzen from "./manage/city1/Citiyzen"
import * as Soldier from "./manage/city1/soldier/Soldier"
import * as MilltaryVehicle from "./manage/city1/milltary_vehicle/MilltaryVehicle"
import * as Tank from "./manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "./manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "./manage/city1/milltary_vehicle/FlameVehicle"
import * as MilltaryBuilding from "./manage/city1/milltary_building/MilltaryBuilding"
import * as ShellTurret from "./manage/city1/milltary_building/ShellTurret"
import * as MissileTurret from "./manage/city1/milltary_building/MissileTurret"
import * as Const from "./data/Const"
import * as Girl from "./girl/Girl"
import * as Pick from "./Pick"
import * as Camera_ from "./Camera"
import * as LittleManCamera from "./LittleManCamera"
import * as ScenarioManager from "./scenario/ScenarioManager"
import * as GameEvent from "./game_event/GameEvent"
import * as BehaviourTreeManager from "./behaviour_tree/BehaviourTreeManager"
import * as UI from "./UI"
import { Event } from "meta3d-jiehuo-abstract"
import { getOpenSettingEventName, getGiantessStatusUpdateEventName } from "../../../utils/EventUtils"
import { animationName, articluatedAnimationName } from "./data/DataType"
import { List, Map as ImmutableMap } from "immutable"
import { getScale, setGirlPosition as setGirlPositionUtils } from "./girl/Utils"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { getCurrentMMDData } from "./utils/MMDUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { findArticluatedAnimationData, playArticluatedAnimation } from "./data/DataUtils"
import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader"
import { deepDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import { getOperateRenderData, isPose } from "./girl/Pose"
import * as CollisionShapeData from "./data/CollisionShapeData"
import { getAnimationBlendData, getActionData, getArticluatedAnimationData, getPhase } from "./data/Data"
import * as GameEventData from "./data/GameEventData"
import * as ScenarioData from "./data/ScenarioData"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { getAllAnimationNames, isChangeScaling, isEnd } from "./girl/Animation"
import * as Collision from "./girl/Collision"
import * as LittleMan from "./little_man/LittleMan"
import * as LittleManAnimation from "./little_man/Animation"
import * as LittleManAction from "./little_man/Action"
import * as LittleManCollision from "./little_man/Collision"
import * as LittleManConst from "./little_man_data/Const"
import * as LittleManData from "./little_man_data/Data"
import * as LittleManDataType from "./little_man_data/DataType"
import * as LittleManSkillData from "./little_man_data/SkillData"
import * as LittleManClimbManager from "./little_man/climb/ClimbManager"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { isControlledState } from "./utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { hasPickData } from "./girl/PickPose"
import { getAllMMDData, getClothCollisionData, getClothHpData, getFirstPersonControlsData } from "./data/mmd/MMDData"
import { getLoadData, getModelData } from "./little_man_data/ModelData"
import * as SoldierData from "./army_data/SoldierData"
import * as MilltaryVehicleData from "./army_data/MilltaryVehicleData"
import * as MilltaryBuildingData from "./army_data/MilltaryBuildingData"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { scene } from "../../../../ui_layer/global/store/GlobalStoreType"
import * as StaticDynamic from "./StaticDynamic"

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state))
}

export let setState = (state: state, citySceneState: cityScene) => {
    return setCitySceneState(state, citySceneState)
}

export let getName = () => "city"

export let isWall = (name: string) => {
    return name.toLocaleLowerCase().includes("wall")
}

// let getLODContainerGroupName = (name: string) => {
//     return name == "lodContainer_group"
// }

// let _isDynamicGroup = (name: string) => {
//     return name == "dynamic_group"
// }
// export let getLODContainerGroupName = () => "lodContainer_group"

export let getDynamicGroupName = () => "dynamic_group"

export let getDynamicGroup = (state) => {
    return NullableUtils.getExn(Scene.findObjectByName(getScene(state), getDynamicGroupName()))
}

// export let getAllSceneIndices = () => [1]

// export let findLabel = (cabinet: Object3D) => {
//     return cabinet.children.filter(child => {
//         return (child as Sprite).isSprite
//     })[0] as Sprite
// }

export let getNullableScene = (state: state) => {
    return getState(state).scene
}

export let getScene = (state: state) => {
    // return NullableUtils.getExn(getNullableScene(state))
    return NullableUtils.getWithDefault(getNullableScene(state),
        Scene.createScene("")
    )
}

export let getAllSceneNumbers = () => [1]

// export let getOctree = (state: state) => {
//     return getState(state).octree
// }

// let _setContainer = (state: state, octree) => {
//     return setState(state, {
//         ...getState(state),
//         octree: octree
//     })
// }

export let importScene = (state: state, renderer, sceneChapter, levelNumber: number) => {
    let promise

    switch (sceneChapter) {
        case scene.Play:
            switch (levelNumber) {
                case 1:
                    state = BuildSceneCity1.build(state, renderer)

                    state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

                    promise = ManageSceneCity1.initWhenImportScene(state).then(state => {
                        if (isGiantessRoad(state)) {
                            return GameEvent.triggerMainEvent(state, GameEventData.eventName.EnterCity)
                        }

                        return state
                    })
                    break
                default:
                    throw new Error(`not support levelNumber: ${levelNumber}`)
            }
            break
        case scene.Biwu:
            switch (levelNumber) {
                case 1:
                    state = BuildSceneBiwuLevel1.build(state, renderer)

                    state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

                    promise = ManageSceneBiwuLevel1.initWhenImportScene(state)
                    break
                case 2:
                    state = BuildSceneBiwuLevel2.build(state, renderer)

                    state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

                    promise = ManageSceneBiwuLevel2.initWhenImportScene(state)
                    break
                case 3:
                    state = BuildSceneBiwuLevel3.build(state, renderer)

                    state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

                    promise = ManageSceneBiwuLevel3.initWhenImportScene(state)
                    break
                default:
                    throw new Error(`not support levelNumber: ${levelNumber}`)
            }
            break
    }

    return promise
    // .then(state => {
    //     return setState(state, {
    //         ...getState(state),
    //         sceneChapter: sceneChapter,
    //         levelNumber: levelNumber
    //     })
    // })
}


let _isEnterScene = (state: state) => {
    return true
}

// let _isGirlNearPosition = (state: state, position: [number, number, number], distance: number) => {
// 	return getGirlPosition(state).distanceTo(_v1.fromArray(position)) <= distance
// }

let _isGirlNearBox = (state: state, box: Box3, distance: number) => {
    return box.containsPoint(Girl.getCenter(state)) || box.distanceToPoint(Girl.getCenter(state)) <= distance
}

export let getAnimationBlendDataParam = (): any => {
    return [
        {
            isMoveFunc: state => {
                // if (!isGiantessRoad(state)) {
                //     return false
                // }

                return CameraControls.isMoveFront(getAbstractState(state), road.Giantess) ||
                    CameraControls.isMoveBack(getAbstractState(state), road.Giantess) ||
                    CameraControls.isMoveLeft(getAbstractState(state), road.Giantess) ||
                    CameraControls.isMoveRight(getAbstractState(state), road.Giantess)

            },
            isTriggerActionFunc: Girl.isTriggerAction,
            isActionStateFunc: Girl.isActionState,
        },
        (state, animationName) => {
            return SkinAnimation.getFrameIndex(
                MMD.findAnimationAction(getAbstractState(state), Girl.getGirlMesh(state), animationName),
                Const.getAnimationFrameCount(state, animationName)
            )
        },
        SkinAnimation.isSpecificFrameIndex,
        isEnd,
        (state, animationName) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(
                    previousAnimationName => {
                        return previousAnimationName == animationName
                    },
                    Girl.getGirlState(state).previousAnimationName,
                ),
                false
            )
        },
        hasPickData
    ]
}

let _createConfigData = (): configData => {
    return {
        operateRenderData: getOperateRenderData(),
        collisionShapeData: NullableUtils.getEmpty(),
        animationBlendData: getAnimationBlendData(getAnimationBlendDataParam()),
        // .concat(
        //     DataBiwuLevel2.getAnimationBlendData(getAnimationBlendDataParam()) as any
        // ),
        animationCollisionData: Collision.getAnimationCollisionData(),
        actionData: getActionData(),
        phaseData: getPhase(),
        articluatedAnimationData: getArticluatedAnimationData(),
        girlAllAnimationNames: getAllAnimationNames(),
        girlAllAnimationFrameCountMap: Const.getAnimationFrameCountMap(),

        girlValue: NullableUtils.getEmpty(),
        littleManValue: NullableUtils.getEmpty(),

        gameEventData: GameEventData.getData(),
        scenaryData: NullableUtils.getEmpty(),
        // scenaryData: ScenarioData.getData(
        //     Girl.getName()
        // ),


        // allMMDData: getAllMMDData(),
        allMMDData: [],


        // .concat(
        //     MMDDataBiwuLevel2.getAllMMDData()
        // ),
        clothCollisionData: getClothCollisionData(),
        // clothHpData: getClothHpData(),
        clothHpData: NullableUtils.getEmpty(),
        firstPersonControlsData: getFirstPersonControlsData(),
        shoeData: [],

        behaviourTreeDataMap: ImmutableMap(),



        littleManAnimationBlendData: LittleManData.getAnimationBlendData([
            {
                isMoveFunc: state => {
                    // if (!isLittleRoad(state)) {
                    //     return false
                    // }

                    return CameraControls.isMoveFront(getAbstractState(state), road.LittleMan) ||
                        CameraControls.isMoveBack(getAbstractState(state), road.LittleMan) ||
                        CameraControls.isMoveLeft(getAbstractState(state), road.LittleMan) ||
                        CameraControls.isMoveRight(getAbstractState(state), road.LittleMan)

                },
                isTriggerActionFunc: LittleManAction.isTriggerAction,
                isActionStateFunc: LittleManAction.isActionState,
            },
            LittleManAnimation.isEnd,
            (state: state, stateName: objectStateName) => {
                return StateMachine.isPreviousState(LittleMan.getStateMachine(state), stateName)
            }
        ]),

        littleManAnimationCollisionData: LittleManCollision.getAnimationCollisionData(),
        littleModelData: getModelData(),
        littleManSkillData: LittleManSkillData.getData(),

        soldierModelData: SoldierData.getAllModelData(),
        milltaryVehicleData: MilltaryVehicleData.getAllModelData(),
        milltaryBuildingData: MilltaryBuildingData.getAllModelData(),
    }
}

export let createState = (): cityScene => {
    return {
        isFirstEnter: true,
        scene: null,

        sceneChapter: scene.Play,
        levelNumber: 1,
        levelData: ImmutableMap(),

        hpMap: ImmutableMap(),

        camera: Camera_.createState(),
        littleManCamera: LittleManCamera.createState(),

        damageData: StaticDynamic.createState(),
        // perspectiveCamera: Camera_.createPerspectiveCamera(),
        // orthographicCamera: TrackableCameraControls.createOrthoCamera(),
        // octree: StaticLODContainer.create(2),
        // octreeHelper: null,
        girl: Girl.createState(),

        littleMan: LittleMan.createState(),

        terrain: Terrain.createState(),
        grass: Grass.createState(),
        // flower: Flower.createState(),
        treeAndProp: TreesAndProps.createState(),
        // plant: Plant.createState(),
        // animated: Animated.createState(),
        pick: Pick.createState(),
        // collision: Collision.createState(),
        // otherGirls: OtherGirls.createState(),
        building: Buildings.createState(),
        car: Cars.createState(),
        tile: Tiles.createState(),
        mountain: Mountains.createState(),

        // windMill: WindMills.createState(),
        dynamicCar: DynamicCars.createState(),
        cityzen: Citiyzen.createState(),
        soldier: Soldier.createState(),
        milltaryVehicle: MilltaryVehicle.createState(),
        milltaryBuilding: MilltaryBuilding.createState(),

        army: Army.createState(),

        map: Map.createState(),
        mission: Mission.createState(),

        scenario: ScenarioManager.createState(),
        gameEvent: GameEvent.createState(),

        behaviourTree: BehaviourTreeManager.createState(),

        ui: UI.createState(),

        configData: _createConfigData(),

        littleManSetting: {
            armyCount: armyCount.Middle,
            littleManStrength: littleManStrength.Low,
            giantessStrength: giantessStrength.Middle,
            giantessScale: giantessScale.Low,
            biggerFrequency: biggerFrequency.Low,
            propCount: propCount.Middle,
            isBiggerNoLimit: false,
        },
        giantessSetting: {
            armyCount: armyCount.Middle,
            giantessStrength: giantessStrength.Middle,
            giantessScale: giantessScale.Low,
            excitementIncrease: excitementIncrease.Middle,
            isBiggerNoLimit: false,
        },

        littleManSettingInGame: {
            selectTargetPrior: targetPrior.None
        },

        biwuSetting: {
            difficulty: difficulty.Middle
            // difficulty: difficulty.Hard
            // difficulty: difficulty.Easy
            // difficulty: difficulty.VeryEasy
            // difficulty: difficulty.VeryHard
        },

        climb: LittleManClimbManager.createState(),
    }
}

// export let getPerspectiveCamera = (state: state) => {
//     return NullableUtils.getExn(getState(state).perspectiveCamera)
// }

// export let getOrthoCamera = (state: state) => {
//     return NullableUtils.getExn(getState(state).orthographicCamera)
// }

export let setToCurrentCamera = (state: state, controls) => {
    // let abstractState = Camera.setCurrentCamera(getAbstractState(state), camera)
    let abstractState = Camera.setCurrentControls(getAbstractState(state), controls)

    return setAbstractState(state, abstractState)
}

export let getLevelNumber = (state: state) => {
    return getState(state).levelNumber
}

let _setLevelNumber = (state: state, levelNumber) => {
    return setState(state, {
        ...getState(state),
        levelNumber: levelNumber
    })
}

export let getSceneChapter = (state: state) => {
    return getState(state).sceneChapter
}

let _setSceneChapter = (state: state, sceneChapter) => {
    return setState(state, {
        ...getState(state),
        sceneChapter: sceneChapter,
    })
}

export let getLevelData = <Data>(state: state, key): Data => {
    return getState(state).levelData.get(key)
}

export let getLevelDataExn = <Data>(state: state, key) => {
    return NullableUtils.getExn(getLevelData<Data>(state, key))
}

export let setLevelData = <Data>(state: state, key, data: Data) => {
    return setState(state, {
        ...getState(state),
        levelData: getState(state).levelData.set(key, data)
    })
}

export let removeLevelData = (state: state, key) => {
    return setState(state, {
        ...getState(state),
        levelData: getState(state).levelData.remove(key)
    })
}

export let getConfigData = (state: state) => {
    return getState(state).configData
}

export let setConfigData = (state: state, data) => {
    return setState(state, {
        ...getState(state),
        configData: data
    })
}

export let isGiantessRoad = (state: state) => {
    return Scene.isGiantessRoad(getAbstractState(state))
}

export let isLittleRoad = (state: state) => {
    return Scene.isLittleRoad(getAbstractState(state))
}

export let init = (state: state, sceneChapter, levelNumber) => {
    let promise

    switch (sceneChapter) {
        case scene.Play:
            switch (levelNumber) {
                case 1:
                    promise = ManageSceneCity1.init(state)
                    break
                default:
                    throw new Error("error")
            }
            break
        case scene.Biwu:
            switch (levelNumber) {
                case 1:
                    promise = ManageSceneBiwuLevel1.init(state)
                    break
                case 2:
                    promise = ManageSceneBiwuLevel2.init(state)
                    break
                case 3:
                    promise = ManageSceneBiwuLevel3.init(state)
                    break
                default:
                    throw new Error("error")
            }
            break
    }


    return promise
    // .then(state => {
    //     return setState(state, {
    //         ...getState(state),
    //         configData: {
    //             ...getConfigData(state),
    //             collisionShapeData: NullableUtils.return_(
    //                 CollisionShapeData.getData(state)
    //             )
    //         }
    //     })
    // })
}

export let update = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Play:
            switch (getLevelNumber(state)) {
                case 1:
                    return ManageSceneCity1.update(state)
                default:
                    throw new Error("error")
            }
        case scene.Biwu:
            switch (getLevelNumber(state)) {
                case 1:
                    return ManageSceneBiwuLevel1.update(state)
                case 2:
                    return ManageSceneBiwuLevel2.update(state)
                case 3:
                    return ManageSceneBiwuLevel3.update(state)
                default:
                    throw new Error("error")
            }
        default:
            throw new Error("error")
    }
}

export let dispose = (state: state) => {
    state = Camera_.dispose(state)
    state = LittleManCamera.dispose(state)

    state = GameEvent.dispose(state)
    state = ScenarioManager.dispose(state)

    state = UI.dispose(state)

    state = LittleManClimbManager.dispose(state)

    state = setState(state, {
        ...getState(state),
        levelData: ImmutableMap(),
        hpMap: ImmutableMap(),
    })

    let promise
    switch (getSceneChapter(state)) {
        case scene.Play:
            switch (getLevelNumber(state)) {
                case 1:
                    promise = ManageSceneCity1.dispose(state)
                    break
                default:
                    throw new Error("error")
            }
            break
        case scene.Biwu:
            switch (getLevelNumber(state)) {
                case 1:
                    promise = ManageSceneBiwuLevel1.dispose(state)
                    break
                case 2:
                    promise = ManageSceneBiwuLevel2.dispose(state)
                    break
                case 3:
                    promise = ManageSceneBiwuLevel3.dispose(state)
                    break
                default:
                    throw new Error("error")
            }
            break
        default:
            throw new Error("error")
    }

    return promise.then(state => {
        state = setState(state, {
            ...getState(state),
            configData: _createConfigData()
        })

        return state
    })
}

let _getCameraType = (state: state) => {
    switch (Scene.getRoad(getAbstractState(state))) {
        case road.LittleMan:
            return LittleManCamera.getCameraType(state)
        case road.Giantess:
            return Camera_.getCameraType(state)
        default:
            throw new Error("err")
    }
}

export let setCameraType = (state: state, cameraType_) => {
    switch (Scene.getRoad(getAbstractState(state))) {
        case road.LittleMan:
            return LittleManCamera.setCameraType(state, cameraType_)
        case road.Giantess:
            return Camera_.setCameraType(state, cameraType_)
        default:
            throw new Error("err")
    }
}

let _useCamera = (state: state): state => {
    switch (_getCameraType(state)) {
        case cameraType.FirstPerson:
            return _useFirstPerson(state)
        case cameraType.ThirdPerson:
            return useThirdPersonControls(state)
        default:
            throw new Error("err")

        // case cameraType.Orbit:
        // default:
        //     return useOrbitControls(state)
    }
}

export let useNoCameraControl = (state: state) => {
    let abstractState = Camera.removeCurrentControls(getAbstractState(state))

    state = setAbstractState(state, abstractState)

    state = setCameraType(state, cameraType.No)

    // return Promise.resolve(state)
    return state
}

export let useCurrentCameraWhenEnterScene = _useCamera

export let useCamera = (state: state, cameraType_): state => {
    state = setCameraType(state, cameraType_)

    return _useCamera(state)
}


export let getOrbitControlsTarget = (state: state) => {
    switch (Scene.getRoad(getAbstractState(state))) {
        case road.LittleMan:
            return LittleManCamera.getOrbitControlsTarget(state)
        case road.Giantess:
            return Camera_.getOrbitControlsTarget(state)
        default:
            throw new Error("err")
    }
}

export let setRoad = (state: state, road_) => {
    return setAbstractState(state, Scene.setRoad(getAbstractState(state), road_))
}

export let enterScene = (state: state, sceneChapter: scene, levelNumber: number) => {
    // if (getIsDebug(state)) {
    //     // state = setRoad(state, road.LittleMan)
    //     state = setRoad(state, road.Giantess)
    // }

    state = _setSceneChapter(state, sceneChapter)
    state = _setLevelNumber(state, levelNumber)

    let promise
    if (getState(state).isFirstEnter) {
        state = setState(state, {
            ...getState(state),
            isFirstEnter: false
        })

        promise = init(state, sceneChapter, levelNumber)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => {
        return importScene(state, State.getRenderState(getAbstractState(state)).renderer, sceneChapter, levelNumber)
    })
        .then(state => {
            return Girl.showGirl(state).then(useCurrentCameraWhenEnterScene)
        })
}

export let getBuildingResourceId = () => "building"

export let getHeightMapResourceId = () => "height_map"

export let getColorMapResourceId = () => "color_map"

export let getBaseMapResourceId = () => "base_map"


// export let getBackgroundSoundResourceId = () => "background1"


export let getShellGunBarretEmitSoundResourceId = () => "shell_gun_barret_emit"

export let getMissileRackEmitSoundResourceId = () => "missile_rack_emit"

export let getFlameGunEmitSoundResourceId = () => "flame_gun_emit"

export let getShellGunBarretHitSoundResourceId = () => "shell_gun_barret_hit"


export let getCommanderPointingSoundResourceId = () => "commander_pointing"

export let getBasicBulletGunEmmitSoundResourceId = () => "basic_bullet_gun_emit"

export let getPropBulletGunEmmitSoundResourceId = () => "prop_bullet_gun_emit"


export let getRocketGunEmmitSoundResourceId = () => "rocket_gun_emit"

export let getRocketGunHitSoundResourceId = () => "rocket_gun_hit"

export let getLaserBulletGunEmmitSoundResourceId = () => "laser_bullet_gun_emit"

export let getLaserBulletGunHitSoundResourceId = () => "laser_bullet_gun_hit"


export let getPropBulletGunHitSoundResourceId = () => "prop_bullet_gun_hit"

export let getSwipingEmmitOtherSoundResourceId = () => "swiping_emit_other"

export let getSwipingEmmitGirlSoundResourceId = () => "swiping_emit_girl"

export let getNoBulletEmmitSoundResourceId = () => "no_bullet_emit"


// export let getShellExplodeSoundResourceId = () => "shell_explode"



export let getClothDestroyedSoundResourceId = () => "cloth_destroyed"

export let getWalkLeftSoundResourceId = () => "walk_left"

export let getWalkRightSoundResourceId = () => "walk_right"

export let getStompSoundResourceId = () => "stomp1"

export let getWalkVehicle1SoundResourceId = () => "walk_vehicle1"

export let getWalkVehicle2SoundResourceId = () => "walk_vehicle2"

export let getWalkCharacterSoundResourceId = () => "walk_character"


export let getBiggerSoundResourceId = () => "bigger"

export let getSmallerSoundResourceId = () => "smaller"

export let getStandToCrawlShankSoundResourceId = () => "stand_to_crawl_shank"

export let getStandToCrawlHandSoundResourceId = () => "stand_to_crawl_hand"

export let getEatSoundResourceId = () => "eat"

export let getPinchCharacterSoundResourceId = () => "pinch_character"

export let getPinchMilltarySoundResourceId = () => "pinch_milltaryVehicle"

export let getBreastPressLaughSoundResourceId = () => "breast_press_laugh"



export let getBuildingBreakSoundResourceId = () => "building_break"

export let getLaughSoundResourceId = () => "laugh1"

// export let getExcitementLaughSoundResourceId = () => "excitement_laugh1"

export let getCelebrateSoundResourceId = () => "celebrate"

export let getFailSoundResourceId = () => "fail"

export let getShowDialogueSoundResourceId = () => "show_dialogue"

export let getHeavyStressingBreastSoundResourceId = () => "heavy_stressing_breast"

export let getHeavyStressingTrigoneAndButtSoundResourceId = () => "heavy_stressing_trigoneAndButt"

export let getDeathSoundResourceId = () => "death"




export let getGridResourceId = () => "grid"

export let getBuildingDamage1ResourceId = () => "building_damage1"

export let getBuildingRuinDiffuseResourceId = () => "ruin_diffuse"
export let getBuildingRuinNormalResourceId = () => "ruin_normal"
export let getBuildingRuinRoughnessResourceId = () => "ruin_roughness"



export let getCharacterShadowResourceId = () => "character_shadow"

export let getCharacterBloodResourceId = () => "character_blood"


// export let getSoldierIdleAnimationResourceId = () => "soldier_idle"

// export let getSoldierShootAnimationResourceId = () => "soldier_shoot"

// export let buildFBXPath = (id) => `./resource/${getName()}/soldier/${id}.fbx`









// let _loadMMDResource = (state: state, setPercentFunc) => {
//     let promise
//     if (!Loader.isResourceLoaded(getAbstractState(state),
//         Const.getMikuResourceId(),
//     )) {
//         promise = Loader.load(getAbstractState(state), ([
//             {
//                 id: Const.getMikuResourceId(),
//                 path: [
//                     Const.getMikuResourcePath(getName()),
//                     _getVMDData()
//                 ],
//                 type: resourceType.MMD
//             },
//             // TODO perf: should load the same vmds only once
//             {
//                 id: Const.getNeruResourceId(),
//                 path: [
//                     Const.getNeruResourcePath(getName()),
//                     _getVMDData()

//                 ],
//                 type: resourceType.MMD
//             },

//             {
//                 id: Const.getLukaResourceId(),
//                 path: [
//                     Const.getLukaResourcePath(getName()),
//                     _getVMDData()
//                 ],
//                 type: resourceType.MMD
//             },
//             {
//                 id: Const.getMeikoResourceId(),
//                 path: [
//                     Const.getMeikoResourcePath(getName()),

//                     _getVMDData()

//                 ],
//                 type: resourceType.MMD
//             },

//             // {
//             //     id: Const.getHakuQPResourceId(),
//             //     path: [
//             //         Const.getHakuQPResourcePath(getName()),
//             //         [
//             //             [
//             //                 animationName.Idle,
//             //                 Const.getIdleAnimationResourcePath(getName())
//             //             ],
//             //             [
//             //                 animationName.Walk,
//             //                 Const.getWalkAnimationResourcePath(getName())
//             //             ],
//             //             [
//             //                 animationName.Stomp,
//             //                 Const.getStompAnimationResourcePath(getName())
//             //             ],
//             //         ]
//             //     ],
//             //     type: resourceType.MMD
//             // },
//             // {
//             //     id: Const.getLuoResourceId(),
//             //     path: [
//             //         Const.getLuoResourcePath(getName()),
//             //         [
//             //             [
//             //                 animationName.Idle,
//             //                 Const.getIdleAnimationResourcePath(getName())
//             //             ],
//             //             [
//             //                 animationName.Walk,
//             //                 Const.getWalkAnimationResourcePath(getName())
//             //             ],
//             //             [
//             //                 animationName.Stomp,
//             //                 Const.getStompAnimationResourcePath(getName())
//             //             ],
//             //         ]
//             //     ],
//             //     type: resourceType.MMD
//             // },

//         ] as any)
//             , setPercentFunc).then(abstractState => {
//                 return setAbstractState(state, abstractState)
//             })
//     }
//     else {
//         promise = Promise.resolve(state)
//     }


//     // let promise = Promise.resolve(state)

//     return promise
// }


export let loadResource = (state: state,
    sceneLevelLoadData,
    setPercentFunc) => {
    // let promise
    // if (!Loader.isResourceLoaded(getAbstractState(state),
    //     getSceneResourceId(),
    // )) {
    // }
    // else {
    //     promise = Promise.resolve(state)
    // }

    // return promise.then(state => {
    //     return _loadMMDResource(state, setPercentFunc)
    // })

    return Loader.load(getAbstractState(state), ([
        {
            id: getGridResourceId(),
            path: `./resource/${getName()}/ground/grid.png`,
            type: resourceType.Texture
        },



        // {
        //     id: getBackgroundSoundResourceId(),
        //     path: [`./resource/${getName()}/audio/${getBackgroundSoundResourceId()}.mp3`],
        //     type: resourceType.Audio
        // },




        {
            id: getCharacterShadowResourceId(),
            path: `./resource/${getName()}/cityzen/${getCharacterShadowResourceId()}.png`,
            type: resourceType.Texture
        },
        {
            id: getCharacterBloodResourceId(),
            path: `./resource/${getName()}/cityzen/${getCharacterBloodResourceId()}.png`,
            type: resourceType.Texture
        },

        {
            id: getShellGunBarretEmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getShellGunBarretEmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getMissileRackEmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getMissileRackEmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getShellGunBarretHitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getShellGunBarretHitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getFlameGunEmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getFlameGunEmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },

        {
            id: getCommanderPointingSoundResourceId(),
            path: [`./resource/${getName()}/audio/soldier/${getCommanderPointingSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },

        {
            id: getBasicBulletGunEmmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getBasicBulletGunEmmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getPropBulletGunEmmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getPropBulletGunEmmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getRocketGunEmmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getRocketGunEmmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getLaserBulletGunEmmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getLaserBulletGunEmmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getPropBulletGunHitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getPropBulletGunHitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getRocketGunHitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getRocketGunHitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getLaserBulletGunHitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getLaserBulletGunHitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getNoBulletEmmitSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getNoBulletEmmitSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSwipingEmmitOtherSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getSwipingEmmitOtherSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSwipingEmmitGirlSoundResourceId(),
            path: [`./resource/${getName()}/audio/weapon/${getSwipingEmmitGirlSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },







        {
            id: getClothDestroyedSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getClothDestroyedSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },

        {
            id: getWalkLeftSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getWalkLeftSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getWalkRightSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getWalkRightSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getStompSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getStompSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getWalkVehicle1SoundResourceId(),
            path: [`./resource/${getName()}/audio/${getWalkVehicle1SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getWalkVehicle2SoundResourceId(),
            path: [`./resource/${getName()}/audio/${getWalkVehicle2SoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getWalkCharacterSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getWalkCharacterSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getBiggerSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getBiggerSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getSmallerSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getSmallerSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getStandToCrawlHandSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getStandToCrawlHandSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getStandToCrawlShankSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getStandToCrawlShankSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getEatSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getEatSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getPinchCharacterSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getPinchCharacterSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getPinchMilltarySoundResourceId(),
            path: [`./resource/${getName()}/audio/${getPinchMilltarySoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getBreastPressLaughSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getBreastPressLaughSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getBuildingBreakSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getBuildingBreakSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getLaughSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getLaughSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getCelebrateSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getCelebrateSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getFailSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getFailSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getShowDialogueSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getShowDialogueSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getHeavyStressingBreastSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getHeavyStressingBreastSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getHeavyStressingTrigoneAndButtSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getHeavyStressingTrigoneAndButtSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: getDeathSoundResourceId(),
            path: [`./resource/${getName()}/audio/${getDeathSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        // {
        //     id: getExcitementLaughSoundResourceId(),
        //     path: [`./resource/${getName()}/audio/${getExcitementLaughSoundResourceId()}.mp3`],
        //     type: resourceType.Audio
        // },




        // {
        //     id: getTree1LowResourceId(),
        //     path: `./resource/${getName()}/tree1/low.glb`,
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: getTree1MiddleResourceId(),
        //     path: `./resource/${getName()}/tree1/middle.glb`,
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: getTree1HighResourceId(),
        //     path: `./resource/${getName()}/tree1/highDraco.glb`,
        //     type: resourceType.ArrayBuffer
        // },


        // {
        //     id: getBrickResourceId(),
        //     path: `./resource/${getName()}/building/brick_diffuse.jpg`,
        //     type: resourceType.Texture
        // },
        // {
        //     id: getBuildingResourceId(),
        //     path: `./resource/${getName()}/building/building.glb`,
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: getBuildingDamage1ResourceId(),
            path: `./resource/${getName()}/decal/building_damage1.png`,
            type: resourceType.Texture
        },
        {
            id: getBuildingRuinDiffuseResourceId(),
            path: `./resource/${getName()}/building/${getBuildingRuinDiffuseResourceId()}.jpg`,
            type: resourceType.Texture
        },
        {
            id: getBuildingRuinNormalResourceId(),
            path: `./resource/${getName()}/building/${getBuildingRuinNormalResourceId()}.jpg`,
            type: resourceType.Texture
        },
        {
            id: getBuildingRuinRoughnessResourceId(),
            path: `./resource/${getName()}/building/${getBuildingRuinRoughnessResourceId()}.jpg`,
            type: resourceType.Texture
        },







        // {
        //     id: getSoldierIdleAnimationResourceId(),
        //     path: `./resource/${getName()}/soldier/${getSoldierIdleAnimationResourceId()}.fbx`,
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: getSoldierShootAnimationResourceId(),
        //     path: `./resource/${getName()}/soldier/${getSoldierShootAnimationResourceId()}.fbx`,
        //     type: resourceType.ArrayBuffer
        // },




        // {
        //     id: getTankResourceId(),
        //     path: `./resource/${getName()}/milltaryVehicle/${getTankResourceId()}.glb`,
        //     type: resourceType.ArrayBuffer
        // },







        {
            id: Terrain.getFootDamage1ResourceId(getName()),
            path: Terrain.getFootDamage1ResourcePath(getName()),
            type: resourceType.Texture
        },

        // {
        //     id: getHeightMapResourceId(),
        //     path: `./resource/${getName()}/terrain/height_map.png`, type: resourceType.Image
        // },
        // {
        //     id: getColorMapResourceId(),
        //     path: `./resource/${getName()}/terrain/color_map.png`,
        //     type: resourceType.Image
        // },
        {
            id: getBaseMapResourceId(),
            path: `./resource/${getName()}/terrain/terrain_base.png`,
            type: resourceType.Texture
        },



        // {
        //     id: Const.getMikuResourceId(),
        //     path: [
        //         Const.getMikuResourcePath(getName()),
        //         _getVMDData()
        //     ],
        //     type: resourceType.MMD
        // },
        // // TODO perf: should load the same vmds only once
        // {
        //     id: Const.getNeruResourceId(),
        //     path: [
        //         Const.getNeruResourcePath(getName()),
        //         _getVMDData()

        //     ],
        //     type: resourceType.MMD
        // },

        // {
        //     id: Const.getLukaResourceId(),
        //     path: [
        //         Const.getLukaResourcePath(getName()),
        //         _getVMDData()
        //     ],
        //     type: resourceType.MMD
        // },
        // {
        //     id: Const.getMeikoResourceId(),
        //     path: [
        //         Const.getMeikoResourcePath(getName()),

        //         _getVMDData()

        //     ],
        //     type: resourceType.MMD
        // },

        // {
        //     id: Const.getHakuQPResourceId(),
        //     path: [
        //         Const.getHakuQPResourcePath(getName()),
        //         [
        //             [
        //                 animationName.Idle,
        //                 Const.getIdleAnimationResourcePath(getName())
        //             ],
        //             [
        //                 animationName.Walk,
        //                 Const.getWalkAnimationResourcePath(getName())
        //             ],
        //             [
        //                 animationName.Stomp,
        //                 Const.getStompAnimationResourcePath(getName())
        //             ],
        //         ]
        //     ],
        //     type: resourceType.MMD
        // },
        // {
        //     id: Const.getLuoResourceId(),
        //     path: [
        //         Const.getLuoResourcePath(getName()),
        //         [
        //             [
        //                 animationName.Idle,
        //                 Const.getIdleAnimationResourcePath(getName())
        //             ],
        //             [
        //                 animationName.Walk,
        //                 Const.getWalkAnimationResourcePath(getName())
        //             ],
        //             [
        //                 animationName.Stomp,
        //                 Const.getStompAnimationResourcePath(getName())
        //             ],
        //         ]
        //     ],
        //     type: resourceType.MMD
        // },


    ] as any).concat(
        sceneLevelLoadData
    ).concat(
        getLoadData().concat(
            LittleMan.getCurrentModelRelatedLoadData(state)
        )
    ).concat(
        SoldierData.getLoadData()
    ).concat(
        MilltaryVehicleData.getLoadData()
    ).concat(
        MilltaryBuildingData.getLoadData()
    ).concat(
        [
            {
                id: getCurrentMMDData(state)[1],
                path: getCurrentMMDData(state)[2],
                type: resourceType.MMD
            }
        ]


        // getAllMMDData(state).map(d => {
        //     return {
        //         id: d[1],
        //         path: d[2],
        //         type: resourceType.MMD
        //     }
        // })
        //         getCurrentMMDData(state).map(data =>{
        // return {
        //     id: data[1],
        //     path:data[2],
        //     type:resourceType.MMD
        // }
        //         })
    )
        // .concat(
        //     OtherGirls.getIndices().map(index => {
        //         return {
        //             id: OtherGirls.getResourceId(index),
        //             path: [
        //                 OtherGirls.getResourcePath(getName()),
        //                 [
        //                     [
        //                         animationName.Idle,
        //                         OtherGirls.getIdleAnimationResourcePath(getName())
        //                     ],
        //                     [
        //                         animationName.Walk,
        //                         OtherGirls.getWalkAnimationResourcePath(getName())
        //                     ],
        //                 ]
        //             ],
        //             type: resourceType.MMD
        //         }
        //     })
        // )
        , setPercentFunc).then(abstractState => {
            return setAbstractState(state, abstractState)
        })

}

export let useOrbitControls = (state: state) => {
    // state = Girl.hideGirl(state)

    // state = Camera_.disposeThirdPersonControls(state)

    // state = setToCurrentCamera(state, Camera_.createPerspectiveCamera(), Camera.getOrbitControls(getAbstractState(state)))
    // state = setToCurrentCamera(state, getCamera(state), Camera.getOrbitControls(getAbstractState(state)))
    state = setToCurrentCamera(state, Camera.getOrbitControls(getAbstractState(state)))

    state = Camera_.useOrbitControls(state)

    return Promise.resolve(state)
}

let _useThirdPersonControls = (state: state) => {
    // state = setToCurrentCamera(state, Camera_.createPerspectiveCamera(), Camera.getOrbitControls(getAbstractState(state)))
    state = setToCurrentCamera(state, Camera.getOrbitControls(getAbstractState(state)))

    switch (Scene.getRoad(getAbstractState(state))) {
        case road.LittleMan:
            state = LittleManCamera.useThirdPersonControls(state)
            break
        case road.Giantess:
            state = Camera_.useThirdPersonControls(state)
            break
        default:
            throw new Error("err")
    }

    // return showGirlFunc(state)
    return state
}

let _useFirstPerson = (state: state) => {
    switch (Scene.getRoad(getAbstractState(state))) {
        case road.LittleMan:
            state = LittleManCamera.useFirstPerfonControls(state)
            break
        case road.Giantess:
            state = setToCurrentCamera(state, Camera.getFirstPersonControls(getAbstractState(state)))
            state = Camera_.useFirstPersonControls(state)
            break
        default:
            throw new Error("err")
    }

    return state
}

// export let useThirdPersonControls = (state: state) => {
//     return _useThirdPersonControls(state, Girl.immediatelyShowGirl)
// }

export let useThirdPersonControls = (state: state) => {
    // return _useThirdPersonControls(state, (state) => Girl.showGirl(state))
    state = _useThirdPersonControls(state)

    // return Promise.resolve(state)
    return state
}


export let getCameraType = _getCameraType

// export let cull = (state: state) => {
//     switch (getLevelNumber(state)) {
//         case 1:
//             return ManageSceneCity1.cull(state)
//         case 2:
//             return ManageScene2.cull(state)
//         default:
//             throw new Error("error")
//     }
// }

export let setGirlScale = Girl.setGirlScale

export let getGirlScale = getScale

export let setGirlPosition = setGirlPositionUtils

export let getGirlCenter = Girl.getCenter

export let triggerAction = (state, name, isJudgeRun = false, isSubExcitement = true) => {
    return Girl.triggerAction(state, name, isJudgeRun, isSubExcitement).then(TupleUtils.getTuple2First)
}

export let triggerLittleManAction = LittleManAction.triggerAction

export let setActionState = Girl.setActionState

export let setLittleManActionState = LittleManAction.setActionState

export let setCurrentMMDCharacter = Girl.setCurrentMMDCharacter

export let setCurrentModelName = LittleMan.setCurrentModelName

export let getThirdPersonCameraTarget = Camera_.getThirdPersonCameraTarget

export let setThirdPersonCameraTarget = Camera_.setThirdPersonCameraTarget

export let getFirstPersonCameraTarget = Camera_.getFirstPersonCameraTarget

export let setFirstPersonCameraTarget = Camera_.setFirstPersonCameraTarget


// export let setZoom = Camera_.setZoom

// export let getMaxZoom = Camera_.getMaxZoom

// export let getMinZoom = Camera_.getMinZoom

// export let getZoom = Camera_.getZoom

export let zoomIn = Camera_.zoomIn

export let zoomOut = Camera_.zoomOut

export let getDestroyedRate = Mission.getDestroyedRate

export let getGameTime = Mission.getGameTime

let _setHp = (hpMap, hpMapForRestore, hp) => {
    return hpMap.reduce(([newHpMap, hpMapForRestore], value, name) => {
        if (hpMapForRestore.has(name)) {
            throw new Error(`name:${name} exist`)
        }

        return [
            newHpMap.set(name, hp),
            hpMapForRestore.set(name, value)
        ]
    }, [ImmutableMap(), hpMapForRestore])
}

export let setHp = (state: state, hp) => {
    let { hpMap, cityzen, car, dynamicCar, building, treeAndProp, soldier, milltaryVehicle, milltaryBuilding } = getState(state)

    let d = _setHp(
        cityzen.hpMap,
        hpMap,
        hp
    )
    cityzen.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        car.hpMap,
        hpMap,
        hp
    )
    car.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        dynamicCar.hpMap,
        hpMap,
        hp
    )
    dynamicCar.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        building.hpMap,
        hpMap,
        hp
    )
    building.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        treeAndProp.hpMap,
        hpMap,
        hp
    )
    treeAndProp.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        soldier.hpMap,
        hpMap,
        hp
    )
    soldier.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        milltaryVehicle.hpMap,
        hpMap,
        hp
    )
    milltaryVehicle.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        milltaryBuilding.hpMap,
        hpMap,
        hp
    )
    milltaryBuilding.hpMap = d[0]
    hpMap = d[1]


    return setState(state, {
        ...getState(state),
        hpMap
    })
}

export let setGirlHp = Girl.setHp

let _restoreHp = (hpMap, hpMapForRestore) => {
    return hpMap.map((value, name) => {
        return NullableUtils.getWithDefault(hpMapForRestore.get(name), value)
    })
}

export let restoreHp = (state: state) => {
    let { hpMap, cityzen, car, dynamicCar, building, treeAndProp, soldier, milltaryVehicle, milltaryBuilding } = getState(state)

    cityzen.hpMap = _restoreHp(
        cityzen.hpMap,
        hpMap
    )
    car.hpMap = _restoreHp(
        car.hpMap,
        hpMap
    )
    dynamicCar.hpMap = _restoreHp(
        dynamicCar.hpMap,
        hpMap
    )
    building.hpMap = _restoreHp(
        building.hpMap,
        hpMap
    )
    treeAndProp.hpMap = _restoreHp(
        treeAndProp.hpMap,
        hpMap
    )
    soldier.hpMap = _restoreHp(
        soldier.hpMap,
        hpMap
    )
    milltaryVehicle.hpMap = _restoreHp(
        milltaryVehicle.hpMap,
        hpMap
    )
    milltaryBuilding.hpMap = _restoreHp(
        milltaryBuilding.hpMap,
        hpMap
    )


    return setState(state, {
        ...getState(state),
        hpMap: ImmutableMap()
    })
}

export let isHPMax = (state: state) => {
    return getState(state).hpMap.count() > 0
}

let _addNameLabel = (state, box, name, status) => {
    let center = box.getCenter(new Vector3())
    let height = box.getSize(new Vector3()).y

    return setAbstractState(state, LabelManager.addLabel(getAbstractState(state), {
        targetName: name,

        text: `${name.slice(-8, name.length)}`,
        position: center.setY(center.y + height),
        time: 1000000,
        fontType: status.isVisible ? fontType.NormalAttack : fontType.HeavyAttack,
        animation: labelAnimation.Normal,
        sizeFactor: 1,
        isSizeAttenuation: false,

        isAddToSpecifyPosition: false,

        height: NullableUtils.return_(10),
    }))
}

export let showDynamicName = (state: state) => {
    state = setAbstractState(state, LabelManager.clearLabel(getAbstractState(state)))

    return Citiyzen.getAllModelQueues(state).concat(Soldier.getAllModelQueues(state)).concat([
        Tank.getTankBodyQueue(state)
    ]).concat([
        MissileVehicle.getMissileVehicleBodyQueue(state)
    ]).concat([
        FlameVehicle.getFlameVehicleBodyQueue(state)
    ]).concat([
        ShellTurret.getShellTurretBodyQueue(state)
    ]).concat([
        MissileTurret.getMissileTurretBodyQueue(state)
    ])
        .reduce((state, queue) => {
            return queue.reduce(state, (state, transform, index) => {
                let name = queue.names[index]
                let box = queue.boxes[index]
                let status = LOD.getStatusForLODQueue(getAbstractState(state), name)

                return _addNameLabel(state, box, name, status)
            })
        }, state)
}

export let showStaticName = (state: state) => {
    state = setAbstractState(state, LabelManager.clearLabel(getAbstractState(state)))

    return LOD.getAllStaticLODContainerIndices(getAbstractState(state)).reduce((state, index) => {
        let abstactState = getAbstractState(state)

        let name = LOD.getName(abstactState, index)
        let box = LOD.getBox(abstactState, index)
        let status = LOD.getStatus(abstactState, index)

        return _addNameLabel(state, box, name, status)
    }, state)
}

// export let bigger = Girl.bigger

// export let smaller = Girl.smaller


// export let isResetKeyState = (state: state) => {
//     if (isLittleRoad(state)) {
//         return !isControlledState(LittleMan.getStateMachine(state))
//     }

//     return true
// }

export let isResetKeyState = (state: state) => {
    if (isLittleRoad(state)) {
        return isControlledState(LittleMan.getStateMachine(state))
    }

    return false
}

export let getLittleManSetting = (state: state) => {
    return getState(state).littleManSetting
}


export let setLittleManSetting = (state: state, littleManSettingState) => {
    return setState(state, {
        ...getState(state),
        littleManSetting: littleManSettingState
    })
}

export let setLittleManSettingArmyCount = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        armyCount: value
    })
}

export let setLittleManSettingLittleManStrength = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        littleManStrength: value
    })
}

export let setLittleManSettingGiantessStrength = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        giantessStrength: value
    })
}

export let setLittleManSettingGiantessScale = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        giantessScale: value
    })
}

export let setLittleManSettingBiggerFrequency = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        biggerFrequency: value
    })
}

export let setLittleManSettingPropCount = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        propCount: value
    })
}

export let setLittleManSettingIsBiggerNoLimit = (state: state, value) => {
    return setLittleManSetting(state, {
        ...getLittleManSetting(state),
        isBiggerNoLimit: value
    })
}




export let getGiantessSetting = (state: state) => {
    return getState(state).giantessSetting
}


export let setGiantessSetting = (state: state, giantessSettingState) => {
    return setState(state, {
        ...getState(state),
        giantessSetting: giantessSettingState
    })
}

export let setGiantessSettingArmyCount = (state: state, value) => {
    return setGiantessSetting(state, {
        ...getGiantessSetting(state),
        armyCount: value
    })
}

export let setGiantessSettingGiantessStrength = (state: state, value) => {
    return setGiantessSetting(state, {
        ...getGiantessSetting(state),
        giantessStrength: value
    })
}

export let setGiantessSettingGiantessScale = (state: state, value) => {
    return setGiantessSetting(state, {
        ...getGiantessSetting(state),
        giantessScale: value
    })
}

export let setGiantessSettingExcitementIncrease = (state: state, value) => {
    return setGiantessSetting(state, {
        ...getGiantessSetting(state),
        excitementIncrease: value
    })
}

export let setGiantessSettingIsBiggerNoLimit = (state: state, value) => {
    return setGiantessSetting(state, {
        ...getGiantessSetting(state),
        isBiggerNoLimit: value
    })
}

export let getIsBiggerNoLimit = (state: state) => {
    let isBiggerNoLimit
    if (isGiantessRoad(state)) {
        isBiggerNoLimit = getGiantessSetting(state).isBiggerNoLimit
    }
    else {
        isBiggerNoLimit = getLittleManSetting(state).isBiggerNoLimit
    }

    return isBiggerNoLimit
}


export let getLittleManSettingInGame = (state: state) => {
    return getState(state).littleManSettingInGame
}


export let setLittleManSettingInGame = (state: state, littleManSettingState) => {
    return setState(state, {
        ...getState(state),
        littleManSettingInGame: littleManSettingState
    })
}

// export let setLittleManSettingInGameIsSelectLittleManPrior = (state: state, value) => {
//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         isSelectLittleManPrior: value
//     })
// }

// export let setLittleManSettingInGameIsSelectTankPrior = (state: state, value) => {
//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         isSelectTankPrior: value
//     })
// }

// export let setLittleManSettingInGameIsSelectSoldierPrior = (state: state, value) => {
//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         isSelectSoldierPrior: value
//     })
// }

// export let setLittleManSettingInGameIsSelectBuildingPrior = (state: state, value) => {
//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         isSelectBuildingPrior: value
//     })
// }

// export let setLittleManSettingInGameIsSelectCityzenPrior = (state: state, value) => {
//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         isSelectCityzenPrior: value
//     })
// }

export let setLittleManSettingInGameIsSelectLittleManPrior = (state: state, value) => {
    state = BehaviourTreeManager.clearTarget(state)

    return setLittleManSettingInGame(state, {
        ...getLittleManSettingInGame(state),
        selectTargetPrior: value
    })
}


export let setClothHpData = (state: state) => {
    return setState(state, {
        ...getState(state),
        configData: {
            ...getState(state).configData,
            clothHpData: NullableUtils.return_(getClothHpData(state))
        }
    })
}

export let setBehaviourTreeData = (state: state, key: string, data) => {
    return setState(state, {
        ...getState(state),
        configData: {
            ...getState(state).configData,
            behaviourTreeDataMap: getState(state).configData.behaviourTreeDataMap.set(key, data)
        }
    })
}


export let getCity1LoadData = () => {
    return ManageSceneCity1.getLoadData()
}

export let getBiwuLevel1LoadData = () => {
    return ManageSceneBiwuLevel1.getLoadData()
}

export let getBiwuLevel2LoadData = () => {
    return ManageSceneBiwuLevel2.getLoadData()
}

export let getBiwuLevel3LoadData = () => {
    return ManageSceneBiwuLevel3.getLoadData()
}


export let getBiwuSetting = (state: state) => {
    return getState(state).biwuSetting
}


export let setBiwuSetting = (state: state, biwuSetting) => {
    return setState(state, {
        ...getState(state),
        biwuSetting: biwuSetting
    })
}

export let setBiwuSettingDifficulty = (state: state, value) => {
    return setBiwuSetting(state, {
        ...getBiwuSetting(state),
        difficulty: value
    })
}