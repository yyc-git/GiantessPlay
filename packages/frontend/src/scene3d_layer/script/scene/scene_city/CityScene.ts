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
import { armyCount, biggerFrequency, thirdPersonCameraTarget, cityScene, excitementIncrease, giantessScale, giantessStrength, littleManStrength, objectStateName, propCount, configData, usedGirl, propName, waterPropName, otherPropName, assistantPropName, propType, bulletPropName, usedGirlEnum, fireWay, upgradeInteractionWay } from "./type/StateType"
import { getAbstractState, getCitySceneState, mutableSetCitySceneState, setAbstractState, setCitySceneState, writeState } from "../../../state/State"
// import { Scene.findObjects, getScene as getWholeScene, setCurrentScene } from "meta3d-jiehuo-abstract"
// import { getRenderState } from "meta3d-jiehuo-abstract"
import { getAllScenes, getIsDebug } from "../Scene"
import { Device, Layer, NullableUtils } from "meta3d-jiehuo-abstract"
import { DisposeUtils } from "meta3d-jiehuo-abstract"
import { Billboard, Camera, Instance, Loader, Scene, ModelLoader, State, View, StaticLODContainer } from "meta3d-jiehuo-abstract"
// import * as Girl from "./girl/Girl"
// import * as Girl from "."
// import * as BuildCabinetBody from "./model/city1/BuildCabinetBody"
import { characterType, fontType, labelAnimation, resourceType, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as ManageSceneCity1 from "./manage/city1/ManageScene"
// import * as ManageSceneProtect from "./manage/protect/ManageScene"
import * as ManageSceneBiwuLevel1 from "./manage/biwu/level1/ManageScene"
import * as ManageSceneBiwuLevel2 from "./manage/biwu/level2/ManageScene"
import * as ManageSceneBiwuLevel3 from "./manage/biwu/level3/ManageScene"
import * as BuildSceneCity1 from "./model/city1/BuildScene"
// import * as BuildSceneProtect from "./model/protect/BuildScene"
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
import * as Map from "./manage/city1/map/Map"
// import * as WindMills from "./manage/city1/WindMills"
import * as DynamicCars from "./manage/city1/DynamicCars"
// import * as Flower from "./manage/city1/Flower"
// import * as Animated from "./manage/city1/Animated"
// import * as OtherGirls from "./manage/city1/OtherGirls"
import * as Mission from "./manage/mission/Mission"
import * as Army from "./manage/city1/Army"
import * as Citiyzen from "./manage/city1/Citiyzen"
import * as Soldier from "./manage/city1/soldier/Soldier"
import * as MilltaryVehicle from "./manage/city1/milltary_vehicle/MilltaryVehicle"
import * as MilltaryBuilding from "./manage/city1/milltary_building/MilltaryBuilding"
import * as Const from "./data/Const"
import * as Girl from "./girl/Girl"
import * as Pick from "./Pick"
import * as Camera_ from "./Camera"
import * as Operate from "./Operate"
import * as User from "./User"
import * as LittleManCamera from "./LittleManCamera"
import * as ScenarioManager from "./scenario/ScenarioManager"
import * as GameEvent from "./game_event/GameEvent"
import * as BehaviourTreeManager from "./behaviour_tree/BehaviourTreeManager"
import * as UI from "./UI"
import { Event } from "meta3d-jiehuo-abstract"
import { getOpenSettingEventName, getGiantessStatusUpdateEventName, getSwitchCharacterTypeEventName, buildSwitchCharacterTypeEventData, getBossStatusUpdateEventName, buildBossStatusUpdateEventNameEventData, getManualUIUpdateEventName } from "../../../utils/EventUtils"
import { actionName, animationName, articluatedAnimationName } from "./data/DataType"
import { List, Map as ImmutableMap } from "immutable"
import { getGirlPosition, getGirlRotation, getScale, setGirlPosition as setGirlPositionUtils } from "./girl/Utils"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { findArticluatedAnimationData, playArticluatedAnimation } from "./data/DataUtils"
import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader"
import { deepDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import * as CollisionShapeData from "./data/CollisionShapeData"
import { getAnimationBlendData, getActionData, getArticluatedAnimationData, getPhase, getAnimationData } from "./data/Data"
import * as ScenarioData from "./data/ScenarioData"
import * as GameEventDirectorData from "./data/director/GameEventDirectorData"
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
import { isPickedControlledState, isDestoryRelatedStates, isControlledStateExceptStressing } from "./utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { hasPickData } from "./girl/PickPoseUtils"
import { getAllMMDData, getBody, getClothCollisionData, getClothHpData, getFirstPersonControlsData, mmdCharacter } from "./data/mmd/MMDData"
import { getLoadData, getModelData } from "./little_man_data/ModelData"
// import * as EliteGiantessData from "./army_data/EliteGiantessData"
import * as SoldierData from "./army_data/SoldierData"
import * as MilltaryVehicleData from "./army_data/MilltaryVehicleData"
import * as MilltaryBuildingData from "./army_data/MilltaryBuildingData"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { scene } from "../../../../ui_layer/global/store/GlobalStoreType"
import * as StaticDynamic from "./StaticDynamic"
import { addLittleMan, afterInitWhenImportScene, isCanSwitchToGiantess, removeLittleMan } from "./little_man/InitWhenImportScene"
import { getPosition, getRotation } from "./little_man/Transform"
import { addPlayerGirl, removePlayerGirl, afterInitWhenImportScene as afterInitWhenImportSceneGirl } from "./girl/player/Girl"
import * as RewardGenerator from "./reward/RewardGenerator"
import * as Build from "./build/Build"
import * as Talent from "./build/Talent"
import * as ArmyDirector from "./director/ArmyDirector"
import * as GameEventDirector from "./director/GameEventDirector"
import * as Difficulty from "./difficulty/Difficulty"
import * as Status from "./Status"
import * as Buff from "./buff/Buff"
import * as StaticDynamicUnit from "./StaticDynamicUnit"
import * as Interaction from "./Interaction"
import * as Time from "./Time"
import * as Mod from "./Mod"
import * as Statistic from "./Statistic"
import * as FastProp from "./FastProp"
import * as EliteGiantess from "./EliteGiantess"
import * as Internation from "./Internation"
import * as Debug from "./Debug"
import * as TweenManager from "./TweenManager"
import { getRewardData } from "./data/reward/RewardData"
import { getBuildData, giantessUpgradeName } from "./data/build/BuildData"
import { applyAllUpgradeFuncs, getIsWait, increaseAttribute, setExperienceValue, setUpgradeInteractionWay } from "./build/Upgrade"
import * as Character from "./character/Character"
import { getOperateRenderData } from "./data/PoseData"
import { isCanSwitchToLittleMan } from "./girl/InitWhenImportScene"
import { getMMDData, getUniqueUsedMMDDataData, hasPlayerUsedMMDData } from "./utils/MMDUtils"
import { getLittleManOperateData } from "./little_man_data/OperateData"
import { getPlayerPosition } from "./utils/PlayerUtils"
import { Render } from "meta3d-jiehuo-abstract"
import { getCharacterType, isPlayerCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { getAllProps, getPropTypeTitle, hasPropsByType, subPropCount } from "./reward/Prop"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getOriginSystemVolume } from "./utils/SoundUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { useClearHatredProp } from "./utils/AttackTargetUtils"
import { buildAPI } from "../../../mod/Mod"
import * as SceneMod from "../../../mod/SceneMod"
import { count, rate } from "./data/reward/RewardDataType"
import { updateHpData } from "./girl/Cloth"
import { getCanvas, isCanvasShow, showCanvas } from "../../../../ui_layer/utils/CanvasUtils"
import { getUseGiantessCharacterBlockService, updateUseProp } from "../../../mod/PropOtherMod"
import { setAttribute } from "./utils/build/GiantessBuildUtils"
import { buildFuncData } from "./data/FuncData"
import { getWeaponShotBulletBlockService, getWeaponSubMachineBulletBlockService } from "../../../mod/PropBulletMod"
import { modProtocolName } from "../../../mod/data/ModData"
import { getCameraCache, setCameraCache } from "meta3d-jiehuo-abstract/src/storage/Storage"
import { apply as applyCareer } from "../../../mod/CareerMod"
import { luck } from "./data/ValueType"
import { handleNetworkRequest } from "../../../../ui_layer/utils/BackendUtils"
import { getPlayerUsedGirl } from "../../../mod/LevelGiantessMod"
import { getAnimationFrameCount, getOperateRenderData as getOperateRenderDataMod } from "../../../mod/SkillGiantessMod"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
// import * as Mod from "../../../mod/Mod"

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state))
}

export let setState = (state: state, citySceneState: cityScene) => {
    return setCitySceneState(state, citySceneState)
}

export let mutableSetState = (state: state, citySceneState: cityScene) => {
    return mutableSetCitySceneState(state, citySceneState)
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


export let initBeforeManageResource = (state) => {
    // state = Mod.init(state)

    state = setConfigData(state, {
        ...getConfigData(state),
        rewardData: NullableUtils.return_(getRewardData(state)),
    })

    return Difficulty.apply(state)
}

// let _giveInitReward = (state: state) => {
//     // TODO remove
//     state = RewardGenerator.generateProp(state,
//         // [
//         //     {
//         //         name: propName.RocketBullet,

//         //         getCountFunc: state => count.MostHigh,
//         //         getRateFunc: state => rate.Must,
//         //     },
//         //     {
//         //         name: propName.RocketBullet,

//         //         getCountFunc: state => count.MostHigh,
//         //         getRateFunc: state => rate.Must,
//         //     },
//         //     {
//         //         name: propName.LaserBullet,

//         //         getCountFunc: state => count.MostHigh,
//         //         getRateFunc: state => rate.Must,
//         //     },
//         //     {
//         //         name: propName.LaserBullet,

//         //         getCountFunc: state => count.MostHigh,
//         //         getRateFunc: state => rate.Must,
//         //     },
//         //     {
//         //         name: propName.LaserBullet,

//         //         getCountFunc: state => count.MostHigh,
//         //         getRateFunc: state => rate.Must,
//         //     },

//         //     {
//         //         name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

//         //         getCountFunc: state => count.MostHigh3,
//         //         getRateFunc: state => rate.Must
//         //     },
//         //     {
//         //         name: getWeaponShotBulletBlockService(state).getWeaponName(),

//         //         getCountFunc: state => count.MostHigh3,
//         //         getRateFunc: state => rate.Must
//         //     },
//         // ]
//         NumberUtils.randomSelectCount(
//             [
//                 {
//                     name: propName.RocketBullet,

//                     getCountFunc: state => count.VeryHigh,
//                     getRateFunc: state => rate.Must,
//                 },
//                 {
//                     name: propName.LaserBullet,

//                     getCountFunc: state => count.VeryHigh,
//                     getRateFunc: state => rate.Must,
//                 },

//                 {
//                     name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

//                     getCountFunc: state => count.VeryHigh,
//                     getRateFunc: state => rate.Must
//                 },
//                 {
//                     name: getWeaponShotBulletBlockService(state).getWeaponName(),

//                     getCountFunc: state => count.VeryHigh,
//                     getRateFunc: state => rate.Must
//                 },
//             ],
//             2
//         )
//         // .concat(
//         //     // NumberUtils.randomSelectCount(
//         //     //     buildAllPropOtherPropData(state),
//         //     //     2
//         //     // )
//         //     buildAllPropOtherPropData(state)
//         //     // ), getPlayerPosition(state), 10)
//         //     // ), getPlayerPosition(state), 20)
//         // )
//         ,
//         luck.Middle, getPlayerPosition(state), 10)


//     // state = RewardGenerator.generateProp(state, [
//     //     {
//     //         name: getUseGiantessCharacterBlockService(state).getName(),

//     //         getCountFunc: state => 1,
//     //         getRateFunc: state => rate.Must
//     //     },
//     //     // {
//     //     //     name: getUseArtifactBlockService(state).getName(),

//     //     //     getCountFunc: state => 1,
//     //     //     getRateFunc: state => rate.Must
//     //     // },
//     // ], 1, luck.Middle, getPlayerPosition(state), 10)

//     return state
// }

let _initInLevelBuild = (state: state) => {
    let isSkipGiantess

    let currentUsedGirls = Girl.getCurrentUsedGirls(state)

    let usedGirl = usedGirlEnum.PlayerGirl
    if (Girl.hasGirlValue(state, usedGirl)
        && Girl.hasCurrentMMDCharacterByUsedGirl(state, usedGirl)
    ) {
        state = Girl.setCurrentUsedGirls(state, [usedGirl])

        isSkipGiantess = false
    }
    else {
        isSkipGiantess = true
    }

    return Talent.applyTalent(state, usedGirl, isSkipGiantess, false).then(state => {
        let promise
        if (!Mission.isEnteringNextLevel(state)) {
            state = setExperienceValue(state, NullableUtils.getEmpty(), LittleMan.getName(), 0)
            state = setExperienceValue(state, usedGirl, Girl.buildNameByUsedGirl(usedGirl), 0)

            state = RewardGenerator.resetRewardForFirstLevel(state)

            // state = _giveInitReward(state)

            promise = Promise.resolve(state)
        }
        else {
            state = RewardGenerator.resetRewardForContinueLevel(state)

            promise = Mission.applyFuncs(state).then(state => {
                state = increaseAttribute(state)
                if (Girl.hasGirlValue(state, usedGirl)) {
                    state = updateHpData(state, usedGirl)
                }

                return applyAllUpgradeFuncs(state, isSkipGiantess)
                    .then(Buff.applyAllRemainedBuffers)
            })
        }

        return promise.then(Mission.initAfterImportScene).then(applyCareer).then(state => {
            // state = NullableUtils.getWithDefault(
            //     NullableUtils.map(currentUsedGirl => {
            //         return Girl.setCurrentUsedGirl(state, currentUsedGirl)
            //     }, currentUsedGirl),
            //     state
            // )

            return Girl.setCurrentUsedGirls(state, currentUsedGirls)
        })
    })
}

export let importScene = (state: state, sceneChapter, levelNumber: number) => {
    // state = Mod.initWhenImportScene(state)




    state = setConfigData(state, {
        ...getConfigData(state),
        firstPersonControlsData: getFirstPersonControlsData(state),
        buildData: NullableUtils.return_(getBuildData(state)),

        animationBlendData: getAnimationBlendData(state, getAnimationBlendDataParam()),

        girlAllAnimationNames: getAllAnimationNames(state),

        girlAllAnimationFrameCountMap: Const.getAnimationFrameCountMap(state, getAnimationFrameCount),
        girlAnimationData: getAnimationData(state),

        actionData: getActionData(state),
        phaseData: getPhase(state),

        animationCollisionData: Collision.getAnimationCollisionData(state),


        littleManOperateRenderData: NullableUtils.return_(getLittleManOperateData(state)),

        littleManAnimationBlendData: LittleManData.getAnimationBlendData(
            state,
            [
                {
                    isMoveFunc: state => {
                        // if (!isLittleCharacterType(state)) {
                        //     return false
                        // }

                        let usedGirl = usedGirlEnum.None

                        return CameraControls.isMoveFront(getAbstractState(state), usedGirl, characterType.LittleMan) ||
                            CameraControls.isMoveBack(getAbstractState(state), usedGirl, characterType.LittleMan) ||
                            CameraControls.isMoveLeft(getAbstractState(state), usedGirl, characterType.LittleMan) ||
                            CameraControls.isMoveRight(getAbstractState(state), usedGirl, characterType.LittleMan)

                    },
                    isTriggerActionFunc: LittleManAction.isTriggerAction,
                    isActionStateFunc: LittleManAction.isActionState,
                },
                LittleManAnimation.isEnd,
                (state: state, stateName: objectStateName) => {
                    return StateMachine.isPreviousState(LittleMan.getStateMachine(state), stateName)
                }
            ]),


        littleManAnimationCollisionData: LittleManCollision.getAnimationCollisionData(state),
        littleManSkillData: LittleManSkillData.getData(state),


        // gameEventData: NullableUtils.return_(GameEventData.getData(state)),

        // gameEventDirectorData: NullableUtils.return_(GameEventDirectorData.getData(state)),

        // rewardData: NullableUtils.return_(getRewardData(state)),
        // clothCollisionData: getClothCollisionData(state),
    })

    return Render.initWhenImportScene(getAbstractState(state), getCanvas()).then(abstractState => {
        let renderer = Render.getRenderer(abstractState)

        state = setAbstractState(state, abstractState)

        let promise

        switch (sceneChapter) {
            case scene.Play:
                switch (levelNumber) {
                    case 1:
                        state = BuildSceneCity1.build(state, renderer)

                        state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

                        promise = ManageSceneCity1.initWhenImportScene(state)
                        // .then(state => {
                        //     if (isGiantessCharacterType(state)) {
                        //         return GameEvent.triggerMainEvent(state, GameEventData.eventName.EnterCity)
                        //     }

                        //     return state
                        // })
                        break
                    default:
                        throw new Error(`not support levelNumber: ${levelNumber}`)
                }
                break
            // case scene.Protect:
            //     switch (levelNumber) {
            //         case 1:
            //             state = BuildSceneProtect.build(state, renderer)

            //             state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

            //             promise = ManageSceneProtect.initWhenImportScene(state)
            //             // .then(state => {
            //             //     if (isGiantessCharacterType(state)) {
            //             //         return GameEvent.triggerMainEvent(state, GameEventData.eventName.EnterCity)
            //             //     }

            //             //     return state
            //             // })
            //             break
            //         default:
            //             throw new Error(`not support levelNumber: ${levelNumber}`)
            //     }
            //     break
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
            default:
                promise = SceneMod.importScene(state, renderer, sceneChapter, levelNumber)
                break
        }

        return promise.then(_initInLevelBuild)
            .then(state => {
                return afterInitWhenImportScene(state).then(afterInitWhenImportSceneGirl)
            })
        // .then(state => {
        //     return setState(state, {
        //         ...getState(state),
        //         sceneChapter: sceneChapter,
        //         levelNumber: levelNumber
        //     })
        // })

    })
}


// let _isEnterScene = (state: state) => {
//     return true
// }

// // let _isGirlNearPosition = (state: state, position: [number, number, number], distance: number) => {
// // 	return getGirlPosition(state, usedGirl).distanceTo(_v1.fromArray(position)) <= distance
// // }

// let _isGirlNearBox = (state: state, box: Box3, distance: number) => {
//     return box.containsPoint(Girl.getCenter(state)) || box.distanceToPoint(Girl.getCenter(state)) <= distance
// }

export let getAnimationBlendDataParam = (): any => {
    return [
        {
            isMoveFunc: (state, usedGirl) => {
                // if (!isGiantessCharacterType(state)) {
                //     return false
                // }

                return CameraControls.isMoveFront(getAbstractState(state), usedGirl, characterType.Giantess) ||
                    CameraControls.isMoveBack(getAbstractState(state), usedGirl, characterType.Giantess) ||
                    CameraControls.isMoveLeft(getAbstractState(state), usedGirl, characterType.Giantess) ||
                    CameraControls.isMoveRight(getAbstractState(state), usedGirl, characterType.Giantess)

            },
            isTriggerActionFunc: Girl.isTriggerAction,
            isActionStateFunc: Girl.isActionState,
        },
        (state, usedGirl, animationName) => {
            return SkinAnimation.getFrameIndex(
                MMD.findAnimationAction(getAbstractState(state), usedGirl, Girl.getGirlMesh(state, usedGirl), animationName),
                Const.getAnimationFrameCount(state, animationName)
            )
        },
        SkinAnimation.isSpecificFrameIndex,
        isEnd,
        (state, usedGirl, animationName) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(
                    previousAnimationName => {
                        return previousAnimationName == animationName
                    },
                    Girl.getUsedGirlData(state, usedGirl).previousAnimationName,
                ),
                false
            )
        },
        hasPickData
    ]
}

let _createConfigData = (girlValueMap, littleManValue): configData => {
    return {
        operateRenderData: getOperateRenderData(),
        // littleManOperateRenderData: getLittleManOperateData(),
        littleManOperateRenderData: NullableUtils.getEmpty(),

        collisionShapeData: NullableUtils.getEmpty(),
        getCollisionShapeDataFunc: state => [],

        // originCollisionShapeData: NullableUtils.getEmpty(),
        // animationBlendData: getAnimationBlendData(getAnimationBlendDataParam()),
        animationBlendData: [],
        // .concat(
        //     DataBiwuLevel2.getAnimationBlendData(getAnimationBlendDataParam()) as any
        // ),
        // animationCollisionData: Collision.getAnimationCollisionData(),
        animationCollisionData: [],
        // actionData: getActionData(),
        actionData: [],
        // phaseData: getPhase(),
        phaseData: [],
        articluatedAnimationData: getArticluatedAnimationData(),
        // girlAllAnimationNames: getAllAnimationNames(),
        girlAllAnimationNames: [],
        // girlAllAnimationFrameCountMap: Const.getAnimationFrameCountMap(),
        girlAllAnimationFrameCountMap: MutableRecordUtils.create(),
        girlAnimationData: MutableRecordUtils.create(),

        girlValueMap: girlValueMap,
        // ImmutableMap(),
        littleManValue: littleManValue,
        // NullableUtils.getEmpty(),

        gameEventData: NullableUtils.getEmpty(),
        scenaryData: NullableUtils.getEmpty(),

        gameEventDirectorData: NullableUtils.getEmpty(),
        // scenaryData: ScenarioData.getData(
        //     Girl.getName()
        // ),


        // allMMDData: getAllMMDData(),
        allMMDData: [],


        // .concat(
        //     MMDDataBiwuLevel2.getAllMMDData()
        // ),
        clothCollisionData: [],
        // clothHpData: getClothHpData(),
        clothHpDataMap: ImmutableMap(),
        // firstPersonControlsData: getFirstPersonControlsData(state),
        firstPersonControlsData: [],
        shoeData: [],

        behaviourTreeDataMap: ImmutableMap(),



        littleManAnimationBlendData: [],

        littleManAnimationCollisionData: [],
        littleManSkillData: [],

        littleModelData: getModelData(),

        soldierModelData: SoldierData.getAllModelData(),
        milltaryVehicleData: MilltaryVehicleData.getAllModelData(),
        milltaryBuildingData: MilltaryBuildingData.getAllModelData(),


        // eliteGiantessModelData: EliteGiantessData.getAllModelData(),

        // rewardData: getRewardData(state),
        rewardData: NullableUtils.getEmpty(),
        // buildData: getBuildData(),
        buildData: NullableUtils.getEmpty(),
    }
}

export let createState = (): cityScene => {
    return {
        debug: Debug.createState(),

        time: Time.createState(),
        tweenManager: TweenManager.createState(),

        isFirstEnter: true,
        isMustStopLoop: false,
        isDisposed: false,

        scene: null,

        sceneChapter: scene.None,
        levelNumber: 1,
        levelData: ImmutableMap(),

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

        // eliteGiantess: EliteGiantess.createState(),

        army: Army.createState(),

        map: Map.createState(),
        mission: Mission.createState(),

        scenario: ScenarioManager.createState(),
        gameEvent: GameEvent.createState(),

        behaviourTree: BehaviourTreeManager.createState(),

        ui: UI.createState(),

        configData: _createConfigData(ImmutableMap(), NullableUtils.getEmpty()),

        // littleManSetting: {
        //     armyCount: armyCount.Middle,
        //     littleManStrength: littleManStrength.Low,
        //     giantessStrength: giantessStrength.Middle,
        //     giantessScale: giantessScale.Low,
        //     biggerFrequency: biggerFrequency.Low,
        //     propCount: propCount.Middle,
        //     isBiggerNoLimit: false,
        // },
        // giantessSetting: {
        //     armyCount: armyCount.Middle,
        //     giantessStrength: giantessStrength.Middle,
        //     giantessScale: giantessScale.Low,
        //     excitementIncrease: excitementIncrease.Middle,
        //     isBiggerNoLimit: false,
        // },

        // littleManSettingInGame: {
        //     selectTargetPrior: targetPrior.None
        // },

        // biwuSetting: {
        //     difficulty: autoDifficulty.Middle
        //     // difficulty: autoDifficulty.Hard
        //     // difficulty: autoDifficulty.Easy
        //     // difficulty: autoDifficulty.VeryEasy
        //     // difficulty: autoDifficulty.VeryHard
        // },

        climb: LittleManClimbManager.createState(),

        reward: RewardGenerator.createState(),
        build: Build.createState(),
        // prop: Prop.createState(),

        character: Character.createState(),

        armyDirector: ArmyDirector.createState(),
        gameEventDirector: GameEventDirector.createState(),

        difficulty: Difficulty.createState(),
        status: Status.createState(),
        buff: Buff.createState(),
        staticDynamicUnit: StaticDynamicUnit.createState(),

        interaction: Interaction.createState(),

        mod: Mod.createState(),

        statistic: Statistic.createState(),

        internation: Internation.createState(),

        fastProp: FastProp.createState(),

        eliteGiantess: EliteGiantess.createState(),

        operate: Operate.createState(),

        user: User.createState(),

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

export let setSceneChapter = (state: state, sceneChapter) => {
    return setState(state, {
        ...getState(state),
        sceneChapter: sceneChapter,
    })
}

export let isSceneChapter = (state: state, sceneChapter) => {
    return getSceneChapter(state) == sceneChapter
}

export let isBossLevel = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            return true
        default:
            return false
    }
}

export let isNeedClimbLevel = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            return getLevelNumber(state) == 3
        default:
            return false
    }
}


// export let isBossLevel = (state: state) => {
//     return getSceneChapter(state) == scene.Biwu
// }

export let setSceneData = (state, sceneChapter, levelNumber) => {
    let oldScene = getSceneChapter(state)

    state = setSceneChapter(state, sceneChapter)
    state = _setLevelNumber(state, levelNumber)

    if (oldScene != sceneChapter) {
        return SceneMod.clearAndRegisterSceneAllMods(state, sceneChapter)
    }

    return Promise.resolve(state)
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

export let hasLevelData = (state: state, key) => {
    return getState(state).levelData.has(key)

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

export let setConfigData = (state: state, data: configData) => {
    return setState(state, {
        ...getState(state),
        configData: data
    })
}

export let setGirlValue = (state, usedGirl_, data) => {
    return setConfigData(state, {
        ...getConfigData(state),
        girlValueMap: getConfigData(state).girlValueMap.set(
            usedGirl_,
            data
        ),
    })
}

export let getCollisionShapeData = (state) => {
    return getConfigData(state).collisionShapeData
}

export let onlySetCollisionShapeData = (state, data) => {
    return setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: NullableUtils.return_(data),
    })
}

export let setCollisionShapeData = (state, getDataFunc) => {
    return setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: NullableUtils.return_(getDataFunc(state)),
        getCollisionShapeDataFunc: getDataFunc,
        // originCollisionShapeData: NullableUtils.return_(getDataFunc(state)),
    })
}

// export let getOriginCollisionShapeData = (state) => {
//     return getConfigData(state).getCollisionShapeDataFunc(state)
// }

export let restoreCollisionShapeData = (state) => {
    return setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: NullableUtils.return_(
            getConfigData(state).getCollisionShapeDataFunc(state)
        ),
    })
}

// export let restoreCollisionShapeDataByCondition = (state, conditionFunc) => {
//     let originData = getConfigData(state).getCollisionShapeDataFunc(state)

//     return setConfigData(state, {
//         ...getConfigData(state),
//         collisionShapeData: NullableUtils.map(
//             collisionShapeData => {
//                 return collisionShapeData.map(data => {
//                     if (conditionFunc(state, data)) {
//                         return NullableUtils.getExn(originData.find(data => conditionFunc(state, data)))
//                     }

//                     return data
//                 })
//             }, getConfigData(state).collisionShapeData
//         ),
//     })
// }
export let restoreCollisionShapeDataByCondition = (state, mmdCharacter, collisionParts) => {
    let originData = getConfigData(state).getCollisionShapeDataFunc(state)

    return setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: NullableUtils.map(
            collisionShapeData => {
                return collisionShapeData.map(data => {
                    if (data.mmds.includes(mmdCharacter)
                        &&
                        collisionParts.includes(data.collisionPart)
                    ) {
                        return NullableUtils.getExn(originData.find(data2 => data2.mmds.includes(mmdCharacter)
                            &&
                            data2.collisionPart == data.collisionPart
                        ))
                    }

                    return data
                })
            }, getConfigData(state).collisionShapeData
        ),
    })
}

export let getConfigOperateRenderData = (state) => {
    return getOperateRenderDataMod(state, getConfigData(state).operateRenderData)
}


export let setGameEventData = (state, data) => {
    return setConfigData(state, {
        ...getConfigData(state),
        gameEventData: NullableUtils.return_(data),
    })
}

export let setGameEventDirectorData = (state, data) => {
    return setConfigData(state, {
        ...getConfigData(state),
        gameEventDirectorData: NullableUtils.return_(data),
    })
}

export let setScenaryData = (state, data) => {
    return setConfigData(state, {
        ...getConfigData(state),
        scenaryData: NullableUtils.return_(data),
    })
}

export let isGiantessCharacterType = (state: state) => {
    return Scene.isGiantessCharacterType(getAbstractState(state))
}

export let isGiantessCharacterTypeByUsedGirl = (state: state, usedGirl: usedGirl) => {
    // return Scene.isGiantessCharacterType(getAbstractState(state)) && usedGirl == usedGirlEnum.PlayerGirl
    return usedGirl == usedGirlEnum.PlayerGirl && isGiantessCharacterType(state)
}


export let isLittleCharacterType = (state: state) => {
    return Scene.isLittleCharacterType(getAbstractState(state))
}

export let isCharacterTypeEqual = (sourceCharacterType, targetCharacterType) => {
    return sourceCharacterType == targetCharacterType || (targetCharacterType != characterType.None && sourceCharacterType == characterType.Both)
        || (targetCharacterType == characterType.Giantess && sourceCharacterType == characterType.GiantessOrNone)
        || (targetCharacterType == characterType.LittleMan && sourceCharacterType == characterType.LittleManOrNone)
        || ((targetCharacterType == characterType.LittleMan || targetCharacterType == characterType.Giantess) && sourceCharacterType == characterType.BothOrNone)
}
export let isCharacterType = (characterType1, characterType2) => {
    return characterType1 == characterType.Both || characterType2 == characterType.Both || characterType1 == characterType2
}


export let isNoneCharacterType = (state: state) => {
    return Scene.isNoneCharacterType(getAbstractState(state))
}

// export let initAtVeryBegin = (state: state) => {
//     return Girl.initAtVeryBegin(state)
// }

// export let init = (state: state, sceneChapter, levelNumber) => {

//     let promise

//     switch (sceneChapter) {
//         case scene.Play:
//             switch (levelNumber) {
//                 case 1:
//                     promise = ManageSceneCity1.init(state)
//                     break
//                 default:
//                     throw new Error("error")
//             }
//             break
//         // case scene.Protect:
//         //     switch (levelNumber) {
//         //         case 1:
//         //             promise = ManageSceneProtect.init(state)
//         //             break
//         //         default:
//         //             throw new Error("error")
//         //     }
//         //     break
//         case scene.Biwu:
//             switch (levelNumber) {
//                 case 1:
//                     promise = ManageSceneBiwuLevel1.init(state)
//                     break
//                 case 2:
//                     promise = ManageSceneBiwuLevel2.init(state)
//                     break
//                 case 3:
//                     promise = ManageSceneBiwuLevel3.init(state)
//                     break
//                 default:
//                     throw new Error("error")
//             }
//             break
//         default:
//             promise = SceneMod.init(state, sceneChapter)
//             break
//     }


//     return promise
//     // .then(state => {
//     //     return setState(state, {
//     //         ...getState(state),
//     //         configData: {
//     //             ...getConfigData(state),
//     //             collisionShapeData: NullableUtils.return_(
//     //                 CollisionShapeData.getData(state)
//     //             )
//     //         }
//     //     })
//     // })
// }

export let init = (state: state) => {
    if (Device.isMobileByState(getAbstractState(state))) {
        state = LittleMan.setFireWay(state, fireWay.Continuous)
    }
    else {
        state = LittleMan.setFireWay(state, fireWay.Burst)
    }

    // if (getIsDebug(state)) {
    //     state = setUpgradeInteractionWay(state, upgradeInteractionWay.Manual)
    // }

    return Promise.resolve(state)
}

export let update = (state: state) => {
    /*! fix some mobile is baipin when enter level
    * 
    */
    // if (!isCanvasShow()) {
    showCanvas()
    // }

    switch (getSceneChapter(state)) {
        case scene.Play:
            switch (getLevelNumber(state)) {
                case 1:
                    return ManageSceneCity1.update(state)
                default:
                    throw new Error("error")
            }
        // case scene.Protect:
        //     switch (getLevelNumber(state)) {
        //         case 1:
        //             return ManageSceneProtect.update(state)
        //         default:
        //             throw new Error("error")
        //     }
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
            return SceneMod.update(state, getSceneChapter(state))
        // throw new Error("error")
    }
}

export let dispose = (state: state) => {
    state = Operate.dispose(state)

    state = Camera_.dispose(state)
    state = LittleManCamera.dispose(state)

    state = GameEvent.dispose(state)
    state = ScenarioManager.dispose(state)

    state = UI.dispose(state)

    state = LittleManClimbManager.dispose(state)

    state = setState(state, {
        ...getState(state),
        levelData: ImmutableMap(),
        isMustStopLoop: false
    })

    state = Debug.dispose(state)

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
        // case scene.Protect:
        //     switch (getLevelNumber(state)) {
        //         case 1:
        //             promise = ManageSceneProtect.dispose(state)
        //             break
        //         default:
        //             throw new Error("error")
        //     }
        //     break
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
            // throw new Error("error")
            promise = SceneMod.dispose(state, getSceneChapter(state))
            break
    }

    return promise.then(state => {
        let girlValueMap, littleManValue
        // if (Mission.isEnteringNextLevel(state)) {
        //     let configData = getState(state).configData
        //     girlValueMap = configData.girlValueMap
        //     littleManValue = configData.littleManValue
        // }
        // else {
        girlValueMap = ImmutableMap()
        littleManValue = NullableUtils.getEmpty()
        // }

        state = setState(state, {
            ...getState(state),
            configData: _createConfigData(girlValueMap, littleManValue)
        })

        return state
    })
        .then(state => {
            state = Mod.dispose(state)

            return setCharacterType(state, characterType.None)
        })
}

let _getCameraType = (state: state) => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            return LittleManCamera.getCameraType(state)
        case characterType.Giantess:
            return Camera_.getCameraType(state)
        default:
            throw new Error("err")
    }
}

export let setCameraType = (state: state, cameraType_) => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            return LittleManCamera.setCameraType(state, cameraType_)
        case characterType.Giantess:
            return Camera_.setCameraType(state, cameraType_)
        default:
            throw new Error("err")
    }
}

let _useCamera = (state: state, isFirstUse): state => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            state = Camera_.setCameraType(state, cameraType.No)
            break
        case characterType.Giantess:
            state = LittleManCamera.setCameraType(state, cameraType.No)
            break
        default:
            throw new Error("err")
    }

    switch (_getCameraType(state)) {
        case cameraType.FirstPerson:
            return _useFirstPerson(state)
        case cameraType.Shoot:
            return _useShoot(state)
        case cameraType.ThirdPerson:
        default:
            return useThirdPersonControls(state, isFirstUse)
        // default:
        //     throw new Error("err")

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

// export let useCurrentCameraWhenEnterScene = _useCamera

export let useCamera = (state: state, cameraType_, isFirstUse = false): state => {
    state = setCameraType(state, cameraType_)

    return _useCamera(state, isFirstUse)
}

// let _buildCameraTypeCacheKey = (characterType) => `camera_cache_cameraType_${characterType}`

// let _buildCameraTargetCacheKey = (cameraType, characterType) => `camera_cache_cameraTarget_${cameraType}_${characterType}`

// export let readCameraType = (state: state) => {
//     return getCameraCache(_buildCameraTypeCacheKey(Scene.getCharacterType(getAbstractState(state))))
// }


// export let saveCameraType = (state: state, cameraType_) => {
//     return setCameraCache(_buildCameraTypeCacheKey(Scene.getCharacterType(getAbstractState(state))), cameraType_).then(_ => state)
// }

let _readAndUseCameraType = (state: state, isFirstUse) => {
    return NullableUtils.getWithDefaultFunc(NullableUtils.map(cameraType_ => {
        return useCamera(state, cameraType_, isFirstUse)
    }, Camera_.getSavedCameraType(state, Scene.getCharacterType(getAbstractState(state)))), () => {
        return _useCamera(state, isFirstUse)
    })
}

export let restoreCameraFromSavedData = (state: state) => {
    let savedCameraType = Camera_.getSavedCameraType(state, Scene.getCharacterType(getAbstractState(state)))

    if (NullableUtils.isNullable(savedCameraType)) {
        state = Camera_.updateCameraTargetFromSavedData(state)

        return _useCamera(state, false)
    }

    let cameraType = NullableUtils.getExn(savedCameraType)

    state = Camera_.updateCameraTargetFromSavedData(state, cameraType)

    return useCamera(state, cameraType, false)
}

// export let readCameraTarget = (cameraType, characterType) => {
//     return getCameraCache(_buildCameraTargetCacheKey(cameraType, characterType))
// }

// export let saveCameraTarget = (state: state, cameraType, target) => {
//     return setCameraCache(_buildCameraTargetCacheKey(cameraType, Scene.getCharacterType(getAbstractState(state))), target).then(_ => state)
// }


export let getOrbitControlsTarget = (state: state) => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            return LittleManCamera.getOrbitControlsTarget(state)
        case characterType.Giantess:
            return Camera_.getOrbitControlsTarget(state)
        default:
            throw new Error("err")
    }
}

export let computeCameraToTargetDistance = (state: state) => {
    return Camera_.getCameraPosition(state).distanceTo(
        getOrbitControlsTarget(state)
    )
}


export let setCharacterType = (state: state, characterType_) => {
    if (Scene.getCharacterType(getAbstractState(state)) == characterType_) {
        return Promise.resolve(state)
    }

    state = setAbstractState(state, Scene.setCharacterType(getAbstractState(state), characterType_))

    return Event.trigger(state, getAbstractState, getSwitchCharacterTypeEventName(), NullableUtils.return_(buildSwitchCharacterTypeEventData(characterType_)))
}

export let enterScene = (state: state, sceneChapter: scene, levelNumber: number) => {
    // if (getIsDebug(state)) {
    //     // state = setCharacterType(state, characterType.LittleMan)
    //     state = setCharacterType(state, characterType.Giantess)
    // }

    // state = setSceneChapter(state, sceneChapter)
    // state = _setLevelNumber(state, levelNumber)

    let promise
    if (getState(state).isFirstEnter) {
        state = setState(state, {
            ...getState(state),
            isFirstEnter: false
        })

        // promise = init(state, sceneChapter, levelNumber)
        promise = Promise.resolve(state)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => {
        return importScene(state, sceneChapter, levelNumber)
    })
        // .then(state => {
        //     return Girl.showGirlAndActiveAllActions(state).then(useCurrentCameraWhenEnterScene)
        // })
        .then(state => {
            return _readAndUseCameraType(state, true)
        })
}

export let isCanSwitchCharacterType = (state: state) => {
    if (getIsWait(state)
        // || getSceneChapter(state) != scene.Play
        || isBossLevel(state)
    ) {
        return false
    }

    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            return isCanSwitchToGiantess(state)
        case characterType.Giantess:
            return isCanSwitchToLittleMan(state)
        default:
            // throw new Error("err")
            return false
    }
}

export let switchToCharacterType = (state: state, characterType_, worldPosition, worldQuaternion) => {
    // state = setAbstractState(state, CameraControls.initKeyState(getAbstractState(state)))

    let promise
    switch (characterType_) {
        case characterType.LittleMan:
            state = setAbstractState(state, CameraControls.initLittleManKeyState(getAbstractState(state)))

            promise = setCharacterType(state, characterType.LittleMan).then(state => {
                return addLittleMan(state,
                    // getGirlPosition(state, usedGirl),
                    // getGirlRotation(state, usedGirl)
                    worldPosition,
                    worldQuaternion
                )
            }).then(state => {
                if (Girl.isUseGirl(state, usedGirlEnum.PlayerGirl)) {
                    return removePlayerGirl(state)
                }

                return state
            })

            break
        case characterType.Giantess:
            state = setAbstractState(state, CameraControls.initGiantessKeyState(getAbstractState(state), usedGirlEnum.PlayerGirl))

            if (!Girl.hasCurrentMMDCharacterByUsedGirl(state, usedGirlEnum.PlayerGirl)) {
                return Promise.resolve(state)
            }

            promise = setCharacterType(state, characterType.Giantess).then(state => {
                return addPlayerGirl(state,
                    // getPosition(state),
                    // getRotation(state)
                    worldPosition,
                    worldQuaternion
                )
            }).then(removeLittleMan)

            break
        default:
            throw new Error("err")
    }

    // return promise.then(state => _useCamera(state, false))
    return promise.then(restoreCameraFromSavedData)
    // .then(state => {
    //     return Event.trigger(state, getAbstractState, getSwitchCharacterTypeEventName(), NullableUtils.return_(buildSwitchCharacterTypeEventData(characterType_)))
    // })
}

export let switchCharacterType = (state: state) => {
    let promise
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            promise = switchToCharacterType(state, characterType.Giantess,
                getPosition(state),
                getRotation(state)
            )
            break
        case characterType.Giantess:
            promise = switchToCharacterType(state, characterType.LittleMan,
                getGirlPosition(state, usedGirlEnum.PlayerGirl),
                getGirlRotation(state, usedGirlEnum.PlayerGirl)
            )
            break
        default:
            throw new Error("err")
    }

    // return promise.then(state => {
    //     return Event.trigger(state, getAbstractState, getManualUIUpdateEventName(), null)
    // })
    return promise
}




// export let getBarHpBackgroundResourcePath = () => `./resource/ui/in_game/bar_background.png`

// export let getBarHpResourcePath = () => `./resource/ui/in_game/bar_hp.png`

// export let getBarHpBackgroundResourceId = () => `getBarHpBackgroundResourceId`

// export let getBarHpResourceId = () => `getBarHpResourceId`

// export let getIceResourcePath = () => `./resource/ui/in_game/ice.png`

// export let getIceResourceId = () => getIceResourcePath()


export let getDeathResourcePath = () => `./resource/ui/in_game/death.png`

export let getDeathResourceId = () => `getDeathResourceId`


export let getCallResourcePath = () => `./resource/ui/in_game/status/call.png`

export let getCallResourceId = () => `getCallResourceId`


export let getDoorResourceId = () => `getDoorResourceId`

export let getDoorResourcePath = () => `./resource/ui/in_game/door.png`



export let getCoinResourceId = () => `getCoinResourceId`

// export let getCoinResourcePath = () => `meta3d-jiehuo-abstract/particle/coin.png`

export let getAimResourcePath = () => `./resource/ui/in_game/little_man/aim.png`

export let getAimAuxiliaryResourcePath = () => `./resource/ui/in_game/little_man/aim_auxiliary.png`

export let getLockResourcePath = () => `./resource/ui/in_game/little_man/lock.png`

export let getCrossWhenDamageResourcePath = () => `./resource/ui/in_game/little_man/crossWhenDamage.png`

export let getCrossWhenDestroyResourcePath = () => `./resource/ui/in_game/little_man/crossWhenDestroy.png`

export let getHeadShotResourcePath = () => `./resource/ui/in_game/little_man/headShot.png`

export let getAimResourceId = () => `getAimResourceId`

export let getAimAuxiliaryResourceId = () => `getAimAuxiliaryResourceId`

export let getLockResourceId = () => `getLockResourceId`

export let getCrossWhenDamageResourceId = () => `getCrossWhenDamageResourceId`

export let getCrossWhenDestroyResourceId = () => `getCrossWhenDestroyResourceId`

export let getHeadShotResourceId = () => `getHeadShotResourceId`



export let getShowDoorResourceId = () => "show_door"

export let getGetRewardResourceId = () => "get_reward"

export let getOpenChestBoxResourceId = () => "open_chestbox"

// export let getOpenBuffGirlResourceId = () => "open_buffgirl"

// export let getAddBuffResourceId = () => "add_buff"

export let getOpenFateResourceId = () => "open_fate"

export let getOpenTradeResourceId = () => "open_trade"

export let getBuyResourceId = () => "buy"




export let getGetGemResourceId = () => "get_gem"

export let getGetCoinResourceId = () => "get_coin"

export let getGetPropResourceId = () => "get_prop"

export let getUpgradeResourceId = () => "upgrade"

export let getReviveLifeCountResourceId = () => "revive_lifeCount"

export let getIncreaseAutoDifficultyResourceId = () => "increaseAutoDifficulty"


export let getCaptureSuccessResourceId = () => "capture_success"



export let getUseWaterResourceId = () => `use_water`

export let getCallGiantessResourceId = () => `call_giantess`



export let getBuildingResourceId = () => "building"

export let getHeightMapResourceId = () => "height_map"

export let getColorMapResourceId = () => "color_map"

export let getBaseMap1ResourceId = () => "base1"
export let getBaseMap2ResourceId = () => "base2"
export let getBaseMap3ResourceId = () => "base3"
export let getBaseMap4ResourceId = () => "base4"
export let getBaseMap5ResourceId = () => "base5"
export let getBaseMap6ResourceId = () => "base6"
export let getBaseMap7ResourceId = () => "base7"
export let getBaseMap8ResourceId = () => "base8"


// export let getBackgroundSoundResourceId = () => "background1"


export let getLockSoundResourceId = () => "lock"





export let getShellGunBarretEmitSoundResourceId = () => "shell_gun_barret_emit"

export let getMissileRackEmitSoundResourceId = () => "missile_rack_emit"

export let getFlameGunEmitSoundResourceId = () => "flame_gun_emit"

export let getShellGunBarretHitSoundResourceId = () => "shell_gun_barret_hit"

export let getMissileRackHitSoundResourceId = () => "missile_rack_hit"


// export let getCommanderPointingSoundResourceId = () => "commander_pointing"

// export let getBasicBulletGunEmmitSoundResourceId = () => "basic_bullet_gun_emit"

// export let getPropBulletGunEmmitSoundResourceId = () => "prop_bullet_gun_emit"


export let getRocketGunEmmitSoundResourceId = () => "rocket_gun_emit"


// export let getBasicBulletGunHitSoundResourceId = () => "basic_bullet_gun_hit"

export let getRocketGunHitSoundResourceId = () => "rocket_gun_hit"

export let getLaserBulletGunEmmitSoundResourceId = () => "laser_bullet_gun_emit"

export let getLaserBulletGunHitSoundResourceId = () => "laser_bullet_gun_hit"


// export let getPropBulletGunHitSoundResourceId = () => "prop_bullet_gun_hit"

export let getSwipingEmmitOtherSoundResourceId = () => "swiping_emit_other"

export let getSwipingEmmitGirlSoundResourceId = () => "swiping_emit_girl"

export let getNoBulletEmmitSoundResourceId = () => "no_bullet_emit"



export let getMeleeKillSoundResourceId = () => "melee_kill"

export let getRemoteKillSoundResourceId = () => "remote_kill"

export let getHeadShotSoundResourceId = () => "head_shot"

export let getHitHeadSoundResourceId = () => "hit_head"

export let getHitWeaknessSoundResourceId = () => "hit_weakness"


// export let getShellExplodeSoundResourceId = () => "shell_explode"



export let getClothDestroyedSoundResourceId = () => "cloth_destroyed"

export let getWalkLeftSoundResourceId = () => "walk_left"

export let getWalkRightSoundResourceId = () => "walk_right"

// export let getStompSoundResourceId = () => "stomp1"

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

// export let getBreastPressLaughSoundResourceId = () => "breast_press_laugh"



export let getBuildingBreakSoundResourceId = () => "building_break"

// export let getLaughSoundResourceId = () => "laugh1"

// export let getExcitementLaughSoundResourceId = () => "excitement_laugh1"

export let getCelebrateSoundResourceId = () => "celebrate"

export let getFailSoundResourceId = () => "fail"

export let getBossCompleteSoundResourceId = () => "boss_complete"

export let getShowDialogueSoundResourceId = () => "show_dialogue"

export let getHeavyStressingBreastSoundResourceId = () => "heavy_stressing_breast"

export let getHeavyStressingTrigoneAndButtSoundResourceId = () => "heavy_stressing_trigoneAndButt"

export let getDeathSoundResourceId = () => "death"


export let getKillSoldierSoundResourceId = () => "kill_soldier"




export let getHeavyStressingSoundResourceId = () => "heavy_stressing"

export let getGridResourceId = () => "grid"

export let getBuildingDamage1ResourceId = () => "building_damage1"

export let getBuildingRuinDiffuseResourceId = () => "ruin_diffuse"
export let getBuildingRuinNormalResourceId = () => "ruin_normal"
export let getBuildingRuinRoughnessResourceId = () => "ruin_roughness"

export let getBuildingBrickRoughnessResourceId = () => "building_brick"



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
    setPercentFunc,
    // usedMMDData
) => {
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

    return Event.trigger(state, getAbstractState, Mod.getModAPI(state).event.getLoadSceneResourceEventName(), NullableUtils.getEmpty()).then(state => {
        return Loader.load(getAbstractState(state), ([
            {
                id: getHeavyStressingSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getHeavyStressingSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },


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




            // {
            //     id: getBarHpBackgroundResourceId(),
            //     path: getBarHpBackgroundResourcePath(),
            //     type: resourceType.Texture
            // },
            // {
            //     id: getBarHpResourceId(),
            //     path: getBarHpResourcePath(),
            //     type: resourceType.Texture
            // },

            // {
            //     id: getCoinResourceId(),
            //     path: getCoinResourcePath(),
            //     type: resourceType.Texture
            // },


            // {
            //     id: getIceResourceId(),
            //     path: getIceResourcePath(),
            //     type: resourceType.Texture
            // },

            {
                id: getDeathResourceId(),
                path: getDeathResourcePath(),
                type: resourceType.Texture
            },


            {
                id: getCallResourceId(),
                path: getCallResourcePath(),
                type: resourceType.Texture
            },


            {
                id: getDoorResourceId(),
                path: getDoorResourcePath(),
                type: resourceType.Texture
            },

            {
                id: getAimResourceId(),
                path: getAimResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getAimAuxiliaryResourceId(),
                path: getAimAuxiliaryResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getLockResourceId(),
                path: getLockResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getCrossWhenDamageResourceId(),
                path: getCrossWhenDamageResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getCrossWhenDestroyResourceId(),
                path: getCrossWhenDestroyResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getHeadShotResourceId(),
                path: getHeadShotResourcePath(),
                type: resourceType.Texture
            },




            {
                id: getShowDoorResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getShowDoorResourceId()}.mp3`],
                type: resourceType.Audio
            },

            {
                id: getGetRewardResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getGetRewardResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getOpenChestBoxResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getOpenChestBoxResourceId()}.mp3`],
                type: resourceType.Audio
            },
            // {
            //     id: getOpenBuffGirlResourceId(),
            //     path: [`./resource/${getName()}/audio/interaction/${getOpenBuffGirlResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            // {
            //     id: getAddBuffResourceId(),
            //     path: [`./resource/${getName()}/audio/interaction/${getAddBuffResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            {
                id: getOpenFateResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getOpenFateResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getOpenTradeResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getOpenTradeResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getBuyResourceId(),
                path: [`./resource/${getName()}/audio/interaction/${getBuyResourceId()}.mp3`],
                type: resourceType.Audio
            },

            {
                id: getGetGemResourceId(),
                path: [`./resource/${getName()}/audio/build/${getGetGemResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getGetCoinResourceId(),
                path: [`./resource/${getName()}/audio/build/${getGetCoinResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getGetPropResourceId(),
                path: [`./resource/${getName()}/audio/build/${getGetPropResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getUpgradeResourceId(),
                path: [`./resource/${getName()}/audio/build/${getUpgradeResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getReviveLifeCountResourceId(),
                path: [`./resource/${getName()}/audio/build/${getReviveLifeCountResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getIncreaseAutoDifficultyResourceId(),
                path: [`./resource/${getName()}/audio/build/${getIncreaseAutoDifficultyResourceId()}.mp3`],
                type: resourceType.Audio
            },


            {
                id: getCaptureSuccessResourceId(),
                path: [`./resource/${getName()}/audio/${getCaptureSuccessResourceId()}.mp3`],
                type: resourceType.Audio
            },



            {
                id: getUseWaterResourceId(),
                path: [`./resource/${getName()}/audio/package/${getUseWaterResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getCallGiantessResourceId(),
                path: [`./resource/${getName()}/audio/package/${getCallGiantessResourceId()}.mp3`],
                type: resourceType.Audio
            },



            {
                id: getLockSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getLockSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },


            // {
            //     id: getStompLightSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getStompLightSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            // {
            //     id: getKickLightSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getKickLightSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
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
                id: getMissileRackHitSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getMissileRackHitSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },

            // {
            //     id: getCommanderPointingSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/soldier/${getCommanderPointingSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },

            // {
            //     id: getBasicBulletGunEmmitSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getBasicBulletGunEmmitSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            // {
            //     id: getPropBulletGunEmmitSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getPropBulletGunEmmitSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
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

            // {
            //     id: getBasicBulletGunHitSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getBasicBulletGunHitSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            // {
            //     id: getPropBulletGunHitSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/weapon/${getPropBulletGunHitSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
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
                id: getMeleeKillSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getMeleeKillSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getRemoteKillSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getRemoteKillSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getHeadShotSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getHeadShotSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getHitHeadSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getHitHeadSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getHitWeaknessSoundResourceId(),
                path: [`./resource/${getName()}/audio/weapon/${getHitWeaknessSoundResourceId()}.mp3`],
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
            // {
            //     id: getStompSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/${getStompSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
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
            // {
            //     id: getBreastPressLaughSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/${getBreastPressLaughSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            {
                id: getBuildingBreakSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getBuildingBreakSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            // {
            //     id: getLaughSoundResourceId(),
            //     path: [`./resource/${getName()}/audio/${getLaughSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },
            {
                id: getCelebrateSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getCelebrateSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getBossCompleteSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getBossCompleteSoundResourceId()}.mp3`],
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

            {
                id: getKillSoldierSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getKillSoldierSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },



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


            {
                id: getBuildingBrickRoughnessResourceId(),
                path: `./resource/${getName()}/building/${getBuildingBrickRoughnessResourceId()}.jpg`,
                type: resourceType.Texture
            },
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
            //     id: getChestBoxResourceId(),
            //     path: `./resource/${getName()}/interaction/${getChestBoxResourceId()}.glb`,
            //     type: resourceType.ArrayBuffer
            // },


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
            //     id: Terrain.getFootPrintResourceId(getName()),
            //     path: Terrain.getFootPrintResourcePath(getName()),
            //     type: resourceType.Texture
            // },
            {
                id: Terrain.getLeftFootPrintResourceId(getName()),
                path: Terrain.getLeftFootPrintResourcePath(getName()),
                type: resourceType.Texture
            },
            {
                id: Terrain.getRightFootPrintResourceId(getName()),
                path: Terrain.getRightFootPrintResourcePath(getName()),
                type: resourceType.Texture
            },
            {
                id: Terrain.getHeelShoePrintResourceId(getName()),
                path: Terrain.getHeelShoePrintResourcePath(getName()),
                type: resourceType.Texture
            },
            // {
            //     id: Terrain.getCommonShoePrintResourceId(getName()),
            //     path: Terrain.getCommonShoePrintResourcePath(getName()),
            //     type: resourceType.Texture
            // },
            {
                id: Terrain.getLeftCommonShoePrintResourceId(getName()),
                path: Terrain.getLeftCommonShoePrintResourcePath(getName()),
                type: resourceType.Texture
            },
            {
                id: Terrain.getRightCommonShoePrintResourceId(getName()),
                path: Terrain.getRightCommonShoePrintResourcePath(getName()),
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
                id: getBaseMap1ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap1ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap2ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap2ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap3ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap3ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap4ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap4ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap5ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap5ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap6ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap6ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap7ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap7ResourceId()}.png`,
                type: resourceType.Texture
            },
            {
                id: getBaseMap8ResourceId(),
                path: `./resource/${getName()}/terrain/base/${getBaseMap8ResourceId()}.png`,
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
        )
            // .concat(
            //     EliteGiantessData.getLoadData()
            // )
            .concat(
                getUniqueUsedMMDDataData(Girl.getAllUsedMMDData(state)).map(data => {
                    return {
                        id: data[1],
                        path: data[2],
                        type: resourceType.MMD
                    }
                })
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

            .concat(Loader.getNeedLoadResourceData(getAbstractState(state))),
            setPercentFunc).then(abstractState => {
                abstractState = Loader.clearNeedLoadResourceData(abstractState)

                return setAbstractState(state, abstractState)
            })
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

export let updateCameraDistance = (state: state) => {
    NullableUtils.forEach(value => {
        let direction = Camera_.getCameraPosition(state).clone().sub(getOrbitControlsTarget(state)).normalize()

        Camera.updatePosition(
            Camera.getCurrentCamera(getAbstractState(state)),
            getOrbitControlsTarget(state).clone().add(
                direction.multiplyScalar(
                    value
                )
            )
        )
    }, Camera_.getSavedThirdPersonCameraToTargetDistance(state, Scene.getCharacterType(getAbstractState(state))))

    return state
}

let _useThirdPersonControls = (state: state, isFirstUse) => {
    // state = setToCurrentCamera(state, Camera_.createPerspectiveCamera(), Camera.getOrbitControls(getAbstractState(state)))
    state = setToCurrentCamera(state, Camera.getOrbitControls(getAbstractState(state)))

    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            state = LittleManCamera.useThirdPersonControls(state, isFirstUse)
            break
        case characterType.Giantess:
            state = Camera_.useThirdPersonControls(state)
            break
        default:
            throw new Error("err")
    }

    state = updateCameraDistance(state)


    // return showGirlFunc(state)
    return state
}

let _useFirstPerson = (state: state) => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            state = LittleManCamera.useFirstPerfonControls(state)
            state = setToCurrentCamera(state, Camera.getFirstPersonControls(getAbstractState(state)))
            break
        case characterType.Giantess:
            state = setToCurrentCamera(state, Camera.getFirstPersonControls(getAbstractState(state)))
            state = Camera_.useFirstPersonControls(state)
            break
        default:
            throw new Error("err")
    }

    return state
}

let _useShoot = (state: state) => {
    switch (Scene.getCharacterType(getAbstractState(state))) {
        case characterType.LittleMan:
            state = LittleManCamera.useShootControls(state)
            break
        default:
            throw new Error("err")
    }

    return state
}

// export let useThirdPersonControls = (state: state) => {
//     return _useThirdPersonControls(state, Girl.immediatelyShowGirl)
// }

export let useThirdPersonControls = (state: state, isFirstUse) => {
    // return _useThirdPersonControls(state, (state) => Girl.showGirlAndActiveAllActions(state))
    state = _useThirdPersonControls(state, isFirstUse)

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

export let triggerAction = (state, usedGirl, name) => {
    return Girl.triggerAction(state, usedGirl, name).then(TupleUtils.getTuple2First)
}

export let triggerLittleManAction = LittleManAction.triggerAction

export let setActionState = Girl.setActionState

export let setLittleManActionState = LittleManAction.setActionState

export let setCurrentMMDCharacterByUsedGirl = Girl.setCurrentMMDCharacterByUsedGirl

export let setCurrentModelName = LittleMan.setCurrentModelName

export let getThirdPersonCameraTarget = Camera_.getThirdPersonCameraTarget

export let setThirdPersonCameraTarget = (state: state, thirdPersonCameraTarget_: thirdPersonCameraTarget) => {
    state = Camera_.setThirdPersonCameraTarget(state, thirdPersonCameraTarget_)

    return state
}

export let getFirstPersonCameraTarget = Camera_.getFirstPersonCameraTarget

export let setFirstPersonCameraTarget = Camera_.setFirstPersonCameraTarget


// export let setZoom = Camera_.setZoom

// export let getMaxZoom = Camera_.getMaxZoom

// export let getMinZoom = Camera_.getMinZoom

// export let getZoom = Camera_.getZoom

export let zoomIn = Camera_.zoomIn

export let zoomOut = Camera_.zoomOut

export let getDestroyedRate = Mission.getDestroyedRate

export let getGameTimeString = Mission.getGameTimeString


// export let bigger = Girl.bigger

// export let smaller = Girl.smaller


// export let isResetKeyState = (state: state) => {
//     if (isLittleCharacterType(state)) {
//         return !isPickedControlledState(LittleMan.getStateMachine(state))
//     }

//     return true
// }

export let isResetKeyState = (state: state) => {
    if (isLittleCharacterType(state)) {
        // return isPickedControlledState(LittleMan.getStateMachine(state))
        return isControlledStateExceptStressing(state, LittleMan.getStateMachine(state))
    }

    return false
}

// export let getLittleManSetting = (state: state) => {
//     return getState(state).littleManSetting
// }


// export let setLittleManSetting = (state: state, littleManSettingState) => {
//     return setState(state, {
//         ...getState(state),
//         littleManSetting: littleManSettingState
//     })
// }

// export let setLittleManSettingArmyCount = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         armyCount: value
//     })
// }

// export let setLittleManSettingLittleManStrength = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         littleManStrength: value
//     })
// }

// export let setLittleManSettingGiantessStrength = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         giantessStrength: value
//     })
// }

// export let setLittleManSettingGiantessScale = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         giantessScale: value
//     })
// }

// export let setLittleManSettingBiggerFrequency = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         biggerFrequency: value
//     })
// }

// export let setLittleManSettingPropCount = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         propCount: value
//     })
// }

// export let setLittleManSettingIsBiggerNoLimit = (state: state, value) => {
//     return setLittleManSetting(state, {
//         ...getLittleManSetting(state),
//         isBiggerNoLimit: value
//     })
// }




// export let getGiantessSetting = (state: state) => {
//     return getState(state).giantessSetting
// }


// export let setGiantessSetting = (state: state, giantessSettingState) => {
//     return setState(state, {
//         ...getState(state),
//         giantessSetting: giantessSettingState
//     })
// }

// export let setGiantessSettingArmyCount = (state: state, value) => {
//     return setGiantessSetting(state, {
//         ...getGiantessSetting(state),
//         armyCount: value
//     })
// }

// export let setGiantessSettingGiantessStrength = (state: state, value) => {
//     return setGiantessSetting(state, {
//         ...getGiantessSetting(state),
//         giantessStrength: value
//     })
// }

// export let setGiantessSettingGiantessScale = (state: state, value) => {
//     return setGiantessSetting(state, {
//         ...getGiantessSetting(state),
//         giantessScale: value
//     })
// }

// export let setGiantessSettingExcitementIncrease = (state: state, value) => {
//     return setGiantessSetting(state, {
//         ...getGiantessSetting(state),
//         excitementIncrease: value
//     })
// }

// export let setGiantessSettingIsBiggerNoLimit = (state: state, value) => {
//     return setGiantessSetting(state, {
//         ...getGiantessSetting(state),
//         isBiggerNoLimit: value
//     })
// }

// export let getIsBiggerNoLimit = (state: state) => {
//     let isBiggerNoLimit
//     if (isGiantessCharacterType(state)) {
//         isBiggerNoLimit = getGiantessSetting(state).isBiggerNoLimit
//     }
//     else {
//         isBiggerNoLimit = getLittleManSetting(state).isBiggerNoLimit
//     }

//     return isBiggerNoLimit
// }


// export let getLittleManSettingInGame = (state: state) => {
//     return getState(state).littleManSettingInGame
// }


// export let setLittleManSettingInGame = (state: state, littleManSettingState) => {
//     return setState(state, {
//         ...getState(state),
//         littleManSettingInGame: littleManSettingState
//     })
// }

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

// export let setLittleManSettingInGameIsSelectLittleManPrior = (state: state, value) => {
//     state = BehaviourTreeManager.clearTarget(state, usedGirl)

//     return setLittleManSettingInGame(state, {
//         ...getLittleManSettingInGame(state),
//         selectTargetPrior: value
//     })
// }


// export let setClothHpData = (state: state, usedGirl) => {
//     return setState(state, {
//         ...getState(state),
//         configData: {
//             ...getState(state).configData,
//             clothHpDataMap: getConfigData(state).clothHpDataMap.set(
//                 usedGirl,
//                 getClothHpData(state, usedGirl)
//             )
//         }
//     })
// }

export let setBehaviourTreeData = (state: state, key: string, data) => {
    return setState(state, {
        ...getState(state),
        configData: {
            ...getState(state).configData,
            behaviourTreeDataMap: getState(state).configData.behaviourTreeDataMap.set(key, data)
        }
    })
}

export let removeBehaviourTreeData = (state: state, key: string): state => {
    return setState(state, {
        ...getState(state),
        configData: {
            ...getState(state).configData,
            behaviourTreeDataMap: getState(state).configData.behaviourTreeDataMap.remove(key)
        }
    })
}


export let getCity1LoadData = (state) => {
    return ManageSceneCity1.getLoadData(state)
}

// export let getProtectLoadData = (state) => {
//     return ManageSceneProtect.getLoadData(state)
// }


export let getBiwuLevel1LoadData = (state) => {
    return ManageSceneBiwuLevel1.getLoadData(state)
}

export let getBiwuLevel2LoadData = (state) => {
    return ManageSceneBiwuLevel2.getLoadData(state)
}

export let getBiwuLevel3LoadData = (state) => {
    return ManageSceneBiwuLevel3.getLoadData(state)
}


// export let getBiwuSetting = (state: state) => {
//     return getState(state).biwuSetting
// }


// export let setBiwuSetting = (state: state, biwuSetting) => {
//     return setState(state, {
//         ...getState(state),
//         biwuSetting: biwuSetting
//     })
// }

// export let setBiwuSettingDifficulty = (state: state, value) => {
//     return setBiwuSetting(state, {
//         ...getBiwuSetting(state),
//         difficulty: value
//     })
// }

// export let isFirstEnter = (state: state) => {
//     return getState(state).isFirstEnter
// }

export let isEnterScene = (state: state) => {
    return Scene.isPlayerCharacterType(getAbstractState(state))
}

export let getAllValidPropTypeData = (state): Array<[propType, string]> => {
    return ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(
        getAllProps(state).filter(p =>
            isCharacterTypeEqual(p.characterType, getCharacterType(getAbstractState(state)))
            && p.count > 0
        )
            .sort((a, b) => Number(a.type) - Number(b.type))
            .map(p => [p.type, getPropTypeTitle(p.type)]).toArray(),
        (data => data[0])
    )
    // .filter(propType_ => {
    //     return hasPropsByType(state, propType_)
    // })
}

export let useArtifact = (state: state, name: string): Promise<[state, boolean]> => {
    return updateUseProp(state, (state, name) => {
        // state = subPropCount(state, name, 1)

        // // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        // //     SoundManager.buildNeedToPlaySoundData(getUseWaterResourceId(), getIsDebug(state), getOriginSystemVolume(state))
        // // ))

        // switch (name) {
        //     case artifactPropName.InfinityBig:
        //         globalThis["InfinityBig"] = true

        //         state = [
        //             usedGirlEnum.WildGiantess,
        //             usedGirlEnum.EnemyGiantess,
        //             usedGirlEnum.PlayerGoddess,
        //             usedGirlEnum.PlayerGirl,
        //         ].reduce((state, usedGirl_) => {
        //             return setAttribute(state, buildFuncData(state), (girlValue) => {
        //                 return {
        //                     ...girlValue,
        //                     maxScale: Infinity,
        //                 }
        //             }, usedGirl_)
        //         }, state)

        //         state = updateGiantessItem(state, (data) => {
        //             switch (name) {
        //                 case giantessUpgradeName.LearnBigger:
        //                 case giantessUpgradeName.ChangeToPassiveBigger:
        //                 case giantessUpgradeName.EnhanceBigger:
        //                     return {
        //                         ...data,
        //                         maxLevel: data.maxLevel * 10
        //                     }

        //                 default:
        //                     return data
        //             }
        //         })

        //         break
        // }

        // // return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
        // //     getBody()
        // // ))
        return Promise.resolve(state)
    }, name).then(state => [state, true])
}

export let useBullet = (state: state, name: bulletPropName | string): Promise<[state, boolean]> => {
    return LittleMan.switchBulletProp(state, name).then(state => {
        return [state, false]
    })
}

export let useWater = (state: state, name: waterPropName): Promise<[state, boolean]> => {
    return updateUseProp(state, (state, name) => {
        state = subPropCount(state, name, 1)

        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getUseWaterResourceId(), getIsDebug(state), getOriginSystemVolume(state))
        ))


        if (isLittleCharacterType(state)) {
            return LittleMan.useWater(state, name)
        }

        return Girl.useWater(state, usedGirlEnum.PlayerGirl, name)
    }, name).then(state => [state, false])
}

export let useAssistant = (state: state, name: assistantPropName): Promise<[state, boolean]> => {
    return updateUseProp(state, (state, name) => {
        state = subPropCount(state, name, 1)

        switch (name) {
            case assistantPropName.CallGiantess:
                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                    SoundManager.buildNeedToPlaySoundData(getCallGiantessResourceId(), getIsDebug(state), getOriginSystemVolume(state))
                ))

                // return GameEventDirector.trigger(state, GameEventDirectorData.eventName.CallGiantess)
                return GameEventDirector.triggerByFilter(state, service => service.getName(), modProtocolName.EventGameProtocol, "callgiantess")

            // .then(state => {
            //     return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), buildBossStatusUpdateEventNameEventData(
            //         getBody(),
            //         `玩家巨大娘（${Girl.getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGoddess)}）`
            //     ))
            // })
            case assistantPropName.ClearHatred:
                return useClearHatredProp(state)

            // case "CallGoddess":
            //     // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            //     //     SoundManager.buildNeedToPlaySoundData(getCallGiantessResourceId(), getIsDebug(state), getOriginSystemVolume(state))
            //     // ))

            //     state = setAttribute(state, buildFuncData(state), (girlValue) => {
            //         return {
            //             ...girlValue,
            //             maxScale: getMaxScale(state, girlValue) <= 500 ? 500 : getMaxScale(state, girlValue),
            //             hp: girlValue.hp * 5,
            //             initialScale: girlValue.initialScale * 5,
            //             scaleIncrease: girlValue.scaleIncrease * 5,
            //         }
            //     }, usedGirlEnum.PlayerGoddess)

            //     return GameEventDirector.trigger(state, GameEventDirectorData.eventName.CallGoddess)
            default:
                throw new Error("err")
        }
    }, name).then(state => [state, true])
}

export let useOther = (state: state, name: otherPropName): Promise<[state, boolean]> => {
    return updateUseProp(state, (state, name) => {
        switch (name) {
            case otherPropName.Revive:
                return Promise.resolve(state)
            default:
                throw new Error("err")
        }
    }, name).then(state => [state, false])
}


export let isMustStopLoop = (state: state) => {
    return getState(state).isMustStopLoop
}

export let markIsMustStopLoop = (state: state, value) => {
    return setState(state, {
        ...getState(state),
        isMustStopLoop: value
    })
}


export let isDisposed = (state: state) => {
    return getState(state).isDisposed
}

export let markIsDisposed = (state: state, value) => {
    return setState(state, {
        ...getState(state),
        isDisposed: value
    })
}
