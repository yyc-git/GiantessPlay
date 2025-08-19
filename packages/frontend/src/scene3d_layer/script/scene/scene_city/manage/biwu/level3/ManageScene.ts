import { Instance } from "meta3d-jiehuo-abstract"
import { getAbstractState, getConfigState, setAbstractState, setConfigState, writeState } from "../../../../../../state/State"
import { cameraType, state } from "../../../../../../type/StateType"
import * as Girl from "../../../girl/Girl"
import * as GirlBiwuLevel3 from "./Girl"
import * as LittleMan from "../../../little_man/LittleMan"
import * as ClimbManager from "../../../little_man/climb/ClimbManager"
import * as LittleManBiwuLevel3 from "./LittleMan"
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
import * as PathFind from "./PathFind"
import * as ArmyManagerBiwu from "../../biwu/ArmyManager"
import { getAnimationBlendDataParam, getBiwuSetting, getCharacterBloodResourceId, getCharacterShadowResourceId, getConfigData, getGirlScale, getName, getScene, isLittleRoad, setBehaviourTreeData, setConfigData, setLevelData, setRoad } from "../../../CityScene"
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
import * as BehaviourTreeDataAll from "../../../data/biwu/level3/behaviour_tree_data_all/BehaviourTreeData"
import * as BehaviourTreeDataLeftHand from "../../../data/biwu/level3/behaviour_tree_data_left_hand/BehaviourTreeData"
import * as BehaviourTreeDataRightHand from "../../../data/biwu/level3/behaviour_tree_data_right_hand/BehaviourTreeData"
import * as GirlData from "../../../data/biwu/level3/GirlData"
import * as LittleManData from "../../../data/biwu/level3/LittleManData"
import * as BehaviourTreeManagerAll from "../../../data/biwu/level3/behaviour_tree_data_all/BehaviourTreeManager"
import * as BehaviourTreeManagerLeftHand from "../../../data/biwu/level3/behaviour_tree_data_left_hand/BehaviourTreeManager"
import * as BehaviourTreeManagerRightHand from "../../../data/biwu/level3/behaviour_tree_data_right_hand/BehaviourTreeManager"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { hasPickData } from "../../../girl/PickPose"
import { getCurrentAnimationName, isChangeScaling, setCurrentAnimationName, setCustomDuration } from "../../../girl/Animation"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import * as ManageSceneLevel1 from "../level1/ManageScene"
import { getAllMMDData, getClothCollisionData, getClothHpData, getDamageParts } from "../../../data/biwu/level3/mmd/MMDData"
import { getActionData, getAnimationBlendData, getAnimationCollisionData, getArticluatedAnimationData, getPhase } from "../../../data/biwu/level3/Data"
import { getAllAnimationNames } from "../../../data/biwu/level3/AnimationNames"
import { getAnimationFrameCountMap, getDownArrowResourceId, getDownArrowResourcePath } from "../../../data/biwu/level3/Const"
import * as CollisionShapeData from "../../../data/biwu/level3/CollisionShapeData"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getAnimationCollisionDataParam, updateAllCollisionShapes } from "../../../girl/Collision"
import { parseAllWeaponModelsAndEnableAllParticls } from "../../city1/ManageScene"
import { setExcitement } from "../../../girl/Excitement"
import { markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import { isCurrentMainEventName, triggerMainEvent, triggerSubEvent } from "../../../game_event/GameEvent"
import * as GameEventData from "../../../data/biwu/level3/GameEventData"
import * as ScenarioData from "../../../data/biwu/level3/ScenarioData"
import { getExitScenarioEventName, getHeavyStressingLieBeginMaxEventName, getHeavyStressingLieEndEventName, getHeavyStressingLieEndMaxEventName } from "../../../../../../utils/EventUtils"
import { Matrix3, Quaternion, Vector3, Euler, Matrix4, Object3D } from "three"
import { Console } from "meta3d-jiehuo-abstract"
import { execute, isCurrentScenarioName, isEnter } from "../../../scenario/ScenarioManager"
import * as Utils from "../Utils"
import { actionName, animationName } from "../../../data/biwu/level3/DataType"
import { Flow } from "meta3d-jiehuo-abstract"
import { disposeLookat, headLookat } from "../../../girl/Lookat"
import { disposeShoe } from "../../../data/mmd/Shoe"
import { getBody } from "../../../data/mmd/MMDData"
import { isFinish } from "../../../scenario/Command"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../../utils/EventUtils"
import { handleMissionFail } from "../../city1/little_man/Mission"
import { handleMissionComplete } from "../../city1/giantess/Mission"
import { Collision } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../../Scene"
import * as ArmyManager from "./ArmyManager"
import { generateMelees } from "../../city1/ArmyManager"
import * as BodyManager from "./BodyManager"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { createClimbState } from "../../../little_man/FSMState"
import { triggerAction } from "../Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getBone, setMaterialVisibleByName } from "../../../utils/MMDUtils"
// import { hasHandTypeWhenNotStressing, setHandTypeWhenNotStressing } from "./FSMState"
import { Billboard } from "meta3d-jiehuo-abstract"
import { isInXZRange } from "../../city1/soldier/utils/CommanderUtils"
import { triggerAllGameEvents } from "../../../utils/DebugUtils"
import { createInitialState } from "./FSMState"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { getCommand, getNearestAllTargetCount, getSwitchBetweenScenarioDataData } from "./scenario/Command"
import { isStressingState } from "../../../utils/FSMStateUtils"
import { isClothsDestroyed } from "../../../girl/Cloth"
import { getLevelData } from "../../../data/biwu/level3/LevelData"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { difficulty, propName, propType } from "../../../type/StateType"
import { List } from "immutable"

const _q = new Quaternion();
const _v1 = new Vector3();

// let _exitScenarioHandler = (state: state, { userData }) => {
//     state = markWhetherNotExecuteGiantessAI(state, false)

//     return Promise.resolve(state)
// }

// // let _intervalPickdownArmy = (state: state) => {
// //     return setAbstractState(state, Flow.addInterval(getAbstractState(state), [
// //         getAbstractState,
// //         setAbstractState,
// //         state => {
// //             return isFinish(state)
// //                 && ManageSceneLevel1.getAllArmyCount(state) < 5
// //             // && NumberUtils.isRandomRate(0.1)
// //         },
// //         state => {
// //             state = markWhetherNotExecuteGiantessAI(state, true)

// //             return triggerMainEvent(state, GameEventData.eventName.PickdownArmy)
// //         }
// //     ], 5))
// // }

let _destroyedHandler = (state: state, { userData }) => {
    let { fromName, toName } = NullableUtils.getExn(userData)

    if (LittleMan.isLittleMan(toName)) {
        return handleMissionFail(state)
    }

    return Promise.resolve(state)
}

let _heavyStressingLieBeginMaxHandler = (state: state, { userData }) => {
    // state = Girl.setIsUpdatePhysics(state, false)
    return triggerSubEvent(state, GameEventData.eventName.Stressing)
}

let _heavyStressingLieEndMaxHandler = (state: state, { userData }) => {
    // state = Girl.setIsUpdatePhysics(state, true)

    return Promise.resolve(state)
}

// let _heavyStressingLieEndHandler = (state: state, { userData }) => {
//     // return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createInitialState(), null).then(state => {
//     //     return triggerAction(state, actionName.KeepLie as any).then(TupleUtils.getTuple2First)
//     // })
//     // .then(state => {
//     //     // if (BehaviourTreeDataAll.getHandType(state) === BehaviourTreeDataAll.handType.None) {
//     //     //     return BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     //     // }

//     //     // return state
//     //     // if (hasHandTypeWhenNotStressing(state)) {
//     //     //     return state
//     //     // }

//     //     // return setHandTypeWhenNotStressing(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     //     return BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     // })

//     // return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createInitialState(), null)
//     //     // return triggerAction(state, actionName.KeepLie as any).then(TupleUtils.getTuple2First)
//     //     .then(state => {
//     //         // state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     //         // return Promise.resolve(state)
//     //         return BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     //     })


//     state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.LeftHandRightHand)
//     return Promise.resolve(state)
// }

let _girlDestroyingHandler = (state: state, { userData }) => {
    state = markWhetherNotExecuteGiantessAI(state, true)

    return handleMissionComplete(state)
}

let _switchBetweenScenarioData = (state: state, data) => {
    for (let [
        judgeFunc,
        scenarioDataName1, scenarioDataName2,
        switchToScenarioDataName2Rate,
    ] of data) {
        if (
            isCurrentScenarioName(state, scenarioDataName1)
            && isFinish(state)
            && !isStressingState(getStateMachine(state))
            && BehaviourTreeDataAll.isHandAttacking(state)

            && (
                judgeFunc(state)
                && NumberUtils.isRandomRate(
                    switchToScenarioDataName2Rate
                )
            )
        ) {
            return execute(state, getCommand, scenarioDataName2)
        }
    }

    return state

    // return ArrayUtils.reduce(data, (state, [
    //     judgeFunc,
    //     scenarioDataName1, scenarioDataName2,
    //     // switchToScenarioDataName1Rate,
    //     switchToScenarioDataName2Rate,
    // ]) => {
    //     if (
    //         isCurrentScenarioName(state, scenarioDataName1)
    //         && isFinish(state)
    //         && !isStressingState(getStateMachine(state))
    //         && BehaviourTreeDataAll.isHandAttacking(state)

    //         && (
    //             // BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)
    //             judgeFunc(state)
    //             && NumberUtils.isRandomRate(
    //                 switchToScenarioDataName2Rate
    //             )
    //         )
    //     ) {
    //         return execute(state, getCommand, scenarioDataName2)
    //     }

    //     return state
    // }, state)
}

// let _switchBetweenScenarioData = (state: state,
//     scenarioDataName1, scenarioDataName2,
//     switchToScenarioDataName1Rate,
//     switchToScenarioDataName2Rate,
// ) => {
//     if (
//         isCurrentScenarioName(state, scenarioDataName1)
//         && isFinish(state)
//         && !isStressingState(getStateMachine(state))
//     ) {
//         if (
//             BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)
//             && NumberUtils.isRandomRate(
//                 switchToScenarioDataName2Rate
//             )
//         ) {
//             return execute(state, getCommand, scenarioDataName2)
//         }
//     }
//     if (
//         isCurrentScenarioName(state, scenarioDataName2)
//         && isFinish(state)
//         && !isStressingState(getStateMachine(state))
//     ) {
//         if (
//             !BehaviourTreeDataAll.getCustomData(state).isCanAddFunc(state)
//             && NumberUtils.isRandomRate(
//                 switchToScenarioDataName1Rate
//             )
//         ) {
//             return execute(state, getCommand, scenarioDataName1)
//         }
//     }

//     return Promise.resolve(state)
// }

let _handleAllGameEventsAfterFirstOne = (state: state) => {
    const data = [
        {
            currentMainEventName: GameEventData.eventName.GoToTrigone,
            condition: state => isInXZRange(LittleManTransform.getWorldPosition(state),
                getLevelData(state).torsorRange),
            nextEventName: GameEventData.eventName.ReachTrigone
        },
        {
            currentMainEventName: GameEventData.eventName.ReachTrigone,
            condition: state => true,
            nextEventName: GameEventData.eventName.OnlyAddArmy
        },
        {
            currentMainEventName: GameEventData.eventName.OnlyAddArmy,
            condition: state => {
                return isClothsDestroyed(state, getDamageParts(state))
            },
            nextEventName: GameEventData.eventName.RightHandOnePointAttack
        },
        {
            currentMainEventName: GameEventData.eventName.RightHandOnePointAttack,
            condition: state => {
                return Girl.getHp(state, getBody()) < Girl.getFullHp(state) * getLevelData(state).hpRateToRightHandBeatAttack
            },
            nextEventName: GameEventData.eventName.RightHandBeatAttack
        },
        {
            currentMainEventName: GameEventData.eventName.RightHandBeatAttack,
            condition: state => {
                return Girl.getHp(state, getBody()) < Girl.getFullHp(state) * getLevelData(state).hpRateToTwoHandsOneFingerAttack
            },
            nextEventName: GameEventData.eventName.TwoHandsOneFingerAttack
        },
        {
            currentMainEventName: GameEventData.eventName.TwoHandsOneFingerAttack,
            condition: state => {
                return Girl.getHp(state, getBody()) < Girl.getFullHp(state) * getLevelData(state).hpRateToTwoHandsBeatAttack
            },
            nextEventName: GameEventData.eventName.TwoHandsBeatAttack
        },
    ]

    let promise
    if (!state.config.isTriggerSpecificGameEvent) {
        promise = NullableUtils.getWithDefault(
            NullableUtils.map(d => triggerMainEvent(state, d.nextEventName),
                data.find(d => {
                    return isCurrentMainEventName(state, d.currentMainEventName)
                        && isFinish(state)
                        && d.condition(state)
                        && !isStressingState(getStateMachine(state))
                })
            ),
            Promise.resolve(state)
        )
    }
    else {
        // promise = Promise.resolve(state)

        // state = setCustomDuration(state, 0.5)

        state = {
            ...state,
            config: {
                ...state.config,
                isTriggerSpecificGameEvent: false
            }
        }

        state = triggerAllGameEvents(state, [GameEventData.eventName.RightHandOnePointAttack])

        promise = Promise.resolve(state)
    }

    return promise
}

let _initShadowAfter = (state: state) => {
    Girl.getGirlMesh(state).receiveShadow = true

    return state
}

let _handleLevel = (state: state) => {
    state = _initShadowAfter(state)
    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     state = Girl.setIsUpdatePhysics(state, false)

    //     return Promise.resolve(state)
    // }, 5))
    // state = Girl.setGirlState(state, {
    //     ...Girl.getGirlState(state),
    //     stateMachine: StateMachine.create(getName(), createInitialState()),
    // })


    // state = setHandTypeWhenNotStressing(state, BehaviourTreeDataAll.handType.RightHandAdd)

    // state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.RightHandAdd)

    // state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
    //     console.log("set")
    //     // state = BehaviourTreeDataAll.setHandType(state, BehaviourTreeDataAll.handType.TwoHandsBeatAttack)
    //     state = setHandTypeWhenNotStressing(state, BehaviourTreeDataAll.handType.TwoHandsBeatAttack)

    //     return Promise.resolve(state)
    // }, 10))


    // state = setExcitement(state, 0)

    // state = markWhetherNotExecuteGiantessAI(state, true)

    // state = setLevelData(state, _buildHardKey(), false)

    state = ManageSceneLevel1.initProp(state, 3)

    // // state = _intervalPickdownArmy(state)

    // state = setAbstractState(state, Event.on(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieBeginMaxEventName(), _heavyStressingLieBeginMaxHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getHeavyStressingLieEndMaxEventName(), _heavyStressingLieEndMaxHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    // return triggerMainEvent(state, GameEventData.eventName.Begin)

    state = ClimbManager.setNotClimbCollisionParts(state, [
        CollisionShapeData.collisionPart.Head,
        CollisionShapeData.collisionPart.LeftHand,
        CollisionShapeData.collisionPart.RightHand,
        CollisionShapeData.collisionPart.LeftLowerArm,
        CollisionShapeData.collisionPart.RightLowerArm,
        CollisionShapeData.collisionPart.LeftUpperArm,
        CollisionShapeData.collisionPart.RightUpperArm,
        CollisionShapeData.collisionPart.LeftBreast,
        CollisionShapeData.collisionPart.RightBreast,

        CollisionShapeData.collisionPart.RightFinger,
        CollisionShapeData.collisionPart.LeftFinger,
    ])


    // setMaterialVisibleByName(Girl.getGirlMesh(state), "旗袍", false)
    setMaterialVisibleByName(Girl.getGirlMesh(state), "项链球", false)




    state = setCurrentAnimationName(state, animationName.KeepLie)

    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createInitialState(), NullableUtils.getEmpty())
        .then(ArmyManager.initWhenImportScene)
        .then(state => {
            return triggerMainEvent(state, GameEventData.eventName.GoToTrigone)
        })
        // .then(state => {
        //     if (
        //         state.config.isTriggerSpecificGameEvent
        //     ) {
        //         state = setCustomDuration(state, 0.5)

        //         // return triggerAllGameEvents(state, [GameEventData.eventName.ReachTrigone, GameEventData.eventName.RightHandAddArmy])
        //         // return triggerAllGameEvents(state, [GameEventData.eventName.ReachTrigone, GameEventData.eventName.RightHandOnePointAttack])
        //         // return triggerAllGameEvents(state, [GameEventData.eventName.ReachTrigone, GameEventData.eventName.RightHandBeatAttack])
        //         // return triggerAllGameEvents(state, [GameEventData.eventName.ReachTrigone, GameEventData.eventName.RightHandOnePointAttack])
        //         // return triggerAllGameEvents(state, [GameEventData.eventName.ReachTrigone, GameEventData.eventName.TwoHandsOneFingerAttack])
        //         return triggerAllGameEvents(state, [GameEventData.eventName.TwoHandsOneFingerAttack])
        //     }

        //     return state
        // })
        .then(state => {
            state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
                return _handleAllGameEventsAfterFirstOne(state)
                // }], 5, "handleAllGameEventsAfterFirstOne"))
            }], 2, "handleAllGameEventsAfterFirstOne"))

            state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
                state = NullableUtils.getWithDefault(
                    NullableUtils.map(data => {
                        return _switchBetweenScenarioData(state,
                            getSwitchBetweenScenarioDataData(state)
                        )
                    }, getSwitchBetweenScenarioDataData(state)),
                    state
                )

                return Promise.resolve(state)
            }], 10, "switchBetweenScenarioData"))

            return state
        })
}


export enum climbPlane {
    None,
    Verticle,
    Horrizon,
}

export enum climbDirection {
    None,
    Verticle,
    Horrizon,
}


let _initConfig = (state: state) => {
    state = {
        ...state,
        config: {
            ...state.config,
            isStaticCastShadow: false,
            isGirlRestoreHp: false
        }
    }

    // Buildings.getAllDetails(state).map(details => details.map(d => d.group)).forEach(groups => {
    //     groups.forEach(group => {
    //         group.castShadow = false
    //         group.receiveShadow = false
    //     })
    // })

    return state
}

export let initWhenImportScene = (state: state) => {
    state = _initConfig(state)

    state = BodyManager.initWhenImportScene(state)

    state = Utils.initWhenImportScene(state)

    state = setConfigData(state, {
        ...getConfigData(state),
        collisionShapeData: CollisionShapeData.getData(state),
    })

    // state = Utils.setGirlCanDamageTarget(state)

    state = setBehaviourTreeData(state,
        BehaviourTreeDataAll.getKey(),
        BehaviourTreeDataAll.getData([
        ]))
    state = setBehaviourTreeData(state,
        BehaviourTreeDataLeftHand.getKey(),
        BehaviourTreeDataLeftHand.getData([
        ]))
    state = setBehaviourTreeData(state,
        BehaviourTreeDataRightHand.getKey(),
        BehaviourTreeDataRightHand.getData([
        ]))

    return Scene.initWhenImportScene(getAbstractState(state)).then(abstractState => {
        return setAbstractState(state, abstractState)
    })
        .then(UI.initWhenImportScene)
        .then(Mission.initWhenImportScene)
        .then(state => WholeScene.initWhenImportScene(state, getSceneResourceId()))

        .then(state => {
            // state = Girl.setInitialTransform(state, new Vector3(-180, 0, 48), new Quaternion(0, 0.707, 0, 0.707))
            // state = Girl.setInitialTransform(state, new Vector3(-30, 0, 48), new Quaternion(0, 0.707, 0, 0.707))
            state = Girl.setInitialTransform(state, new Vector3(90, 0, 70), new Quaternion(0, 0.707, 0, 0.707))
            // state = Girl.setInitialTransform(state, new Vector3(-18000, 0, 48), new Quaternion(0, 0.707, 0, 0.707))

            // state = LittleMan.setInitialTransform(state, new Vector3(-155, 0, 55), new Quaternion(0, -0.707, 0, 0.707))
            // state = LittleMan.setInitialTransform(state, new Vector3(-160, 15, 55), new Quaternion(0, -0.707, 0, 0.707))

            // state = LittleMan.setInitialTransform(state, new Vector3(-160, 0, 55), new Quaternion(0, -0.707, 0, 0.707))


            state = LittleMan.setInitialTransform(state, new Vector3(64, 0, 76), new Quaternion(0, -0.707, 0, 0.707))



            // if (getIsDebug(state)) {
            //     state = setConfigState(state, {
            //         ...getConfigState(state),
            //         isFastMove: true
            //     })
            // }


            // // // TODO remove
            // let scene = Scene.getCurrentScene(getAbstractState(state))
            // let obb = Collision.createOBB(scene, getAbstractState(state)).set(
            //     new Vector3(-180, 0, 55),
            //     new Vector3(10, 10, 10),
            //     new Matrix3()
            // )


            // let obb2 = Collision.createOBB(scene, getAbstractState(state)).set(
            //     new Vector3(-170, 20, 55),
            //     // new Vector3(10, 10, 10),
            //     new Vector3(10, 10, 10),
            //     // new Matrix3()
            //     new Matrix3()
            //         .setFromMatrix4(
            //             new Matrix4().makeRotationFromEuler(new Euler(0, 0, Math.PI / 4))
            //         )
            // )
            // // let obb2 = Collision.createOBB(scene, getAbstractState(state)).set(
            // //     new Vector3(-190, 0.5, 55),
            // //     new Vector3(10, 10, 10),
            // //     // new Matrix3()
            // //     new Matrix3()
            // // )


            // let obb3 = Collision.createOBB(scene, getAbstractState(state)).set(
            //     new Vector3(-130, 0, 65),
            //     new Vector3(10, 10, 10),
            //     new Matrix3().setFromMatrix4(
            //         // new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 4, Math.PI / 4, 0))
            //         new Matrix4().makeRotationFromEuler(new Euler(0, 0, Math.PI / 4))
            //     )
            // )

            // let obb4 = Collision.createOBB(scene, getAbstractState(state)).set(
            //     new Vector3(-140, 0, 45),
            //     new Vector3(10, 10, 10),
            //     new Matrix3()
            //     // .setFromMatrix4(
            //     //     new Matrix4().makeRotationFromEuler(new Euler(Math.PI / 4, Math.PI / 4, 0))
            //     // )
            // )



            // globalThis["obbs"] = [obb, obb2, obb3, obb4]








            return state
        })

        .then(ClimbManager.initWhenImportScene)
        .then(GirlBiwuLevel3.initWhenImportScene)
        .then(LittleManBiwuLevel3.initWhenImportScene)


        .then(Buildings.initWhenImportScene).then(Cars.initWhenImportScene).then(Mountains.initWhenImportScene).then(TreesAndProps.initWhenImportScene).then(MapWall.initWhenImportScene)
        // .then(WindMills.initWhenImportScene)
        // .then(DynamicCars.initWhenImportScene)
        .then(PathFind.initWhenImportScene)
        // .then(Citiyzen.initWhenImportScene)
        .then(Infantry.initWhenImportScene).then(Rocketeer.initWhenImportScene).then(Laserer.initWhenImportScene).then(Commander.initWhenImportScene).then(Melee.initWhenImportScene).then(Tank.initWhenImportScene).then(MissileVehicle.initWhenImportScene).then(FlameVehicle.initWhenImportScene).then(ShellTurret.initWhenImportScene).then(MissileTurret.initWhenImportScene).then(Terrain.initWhenImportScene).then(ArmyManagerBiwu.initWhenImportScene)

        .then(BehaviourTreeManagerAll.initWhenImportScene)
        .then(BehaviourTreeManagerLeftHand.initWhenImportScene)
        .then(BehaviourTreeManagerRightHand.initWhenImportScene)

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



            // state = registerDamageData(state, { isSelfFunc: Girl.isGirl, damageFunc: GirlBiwuLevel3.damage, getValueFunc: Girl.getValue },)
            state = registerDamageData(state, { isSelfFunc: LittleMan.isLittleMan, damageFunc: LittleMan.damage, getValueFunc: LittleMan.getValue },)


            state = registerDamageGiantessFunc(state, GirlBiwuLevel3.damage)


            return state
        })
        .then(_handleLevel)
}

export let init = ManageSceneLevel1.init

let _dispose = (state: state) => {
    state = disposeLookat(state)

    // state = disposeShoe(state)

    // state = setAbstractState(state, Event.off(getAbstractState(state), getExitScenarioEventName(), _exitScenarioHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), _destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getHeavyStressingLieBeginMaxEventName(), _heavyStressingLieBeginMaxHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getHeavyStressingLieEndMaxEventName(), _heavyStressingLieEndMaxHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getHeavyStressingLieEndEventName(), _heavyStressingLieEndHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return state
}

// let _buildHardKey = () => "Hard"

// export let isHard = (state: state) => {
//     return NullableUtils.getWithDefault(
//         getLevelData(state, _buildHardKey()),
//         false
//     )
// }

// let _triggerGameEvents = (state: state) => {
//     if (
//         isCurrentMainEventName(state, GameEventData.eventName.GoToTrigone)
//         && isFinish(state)
//         && isInXZRange(LittleManTransform.getWorldPosition(state),
//             getTorsorRange())
//     ) {
//         return triggerMainEvent(state, GameEventData.eventName.ReachTrigone)
//     }

//     if (
//         isCurrentMainEventName(state, GameEventData.eventName.ReachTrigone)
//         && isFinish(state)
//     ) {
//         return triggerMainEvent(state, GameEventData.eventName.RightHandAddArmy)
//     }



//     return state
// }

let _update = (state: state) => {
    state = headLookat(state,
        LittleManTransform.getWorldPosition(state),
        getAllAnimationNames()
    )

    // if (!isHard(state) && isFinish(state)
    //     && getCurrentAnimationName(state) == animationName.Idle
    //     && Girl.getHp(state, getBody()) < Girl.getFullHp(state) * 0.5) {
    //     state = setLevelData(state, _buildHardKey(), true)

    //     return triggerMainEvent(state, GameEventData.eventName.Hard)
    // }


    return BodyManager.update(state)
    // .then(_triggerGameEvents)
}

export let update = (state: state): Promise<state> => {
    let promise
    if (!isEnter(state)) {
        promise = Girl.update(state).then(LittleManBiwuLevel3.update).then(Camera.update)
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(Mission.update)
        // .then(DynamicCars.update)
        // .then(Citiyzen.update)
        .then(Infantry.update).then(Rocketeer.update).then(Laserer.update).then(Commander.update).then(Melee.update).then(Tank.update).then(MissileVehicle.update).then(FlameVehicle.update).then(ShellTurret.update).then(MissileTurret.update).then(ArmyManagerBiwu.update)
        .then(BehaviourTreeManagerAll.update)
        .then(BehaviourTreeManagerLeftHand.update)
        .then(BehaviourTreeManagerRightHand.update)
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
        .then(BehaviourTreeManagerAll.dispose)
        .then(BehaviourTreeManagerLeftHand.dispose)
        .then(BehaviourTreeManagerRightHand.dispose)
        .then(state => {
            DisposeUtils.removeAndDispose(Scene.getScene(getAbstractState(state)), scene)

            return state
        }).then(state => {
            return disposeStaticDynamic(state)
        })
        .then(_dispose)
        .then(writeState)
}


export let getSceneResourceId = () => "biwu_level3"

export let getBeatSoundResourceId = () => "beat"

export let getAddSoundResourceId = () => "add"

export let getSayGoSoundResourceId = () => "biwu_level3_sayGo"

export let getSayReachSoundResourceId = () => "biwu_level3_sayReach"

export let getSayOnlySoundResourceId = () => "biwu_level3_sayOnly"

export let getSayAddSoundResourceId = () => "biwu_level3_sayAdd"

export let getSayOneSoundResourceId = () => "biwu_level3_sayOne"

export let getSayBeatSoundResourceId = () => "biwu_level3_sayBeat"

export let getSayLeftRightSoundResourceId = () => "biwu_level3_sayLeftRight"

export let getSayTwoOneSoundResourceId = () => "biwu_level3_sayTwoOne"

export let getSayTwoBeatSoundResourceId = () => "biwu_level3_sayTwoBeat"

export let getSayStressing1SoundResourceId = () => "biwu_level3_sayStressing1"

export let getSayStressing2SoundResourceId = () => "biwu_level3_sayStressing2"

export let getSayStressing3SoundResourceId = () => "biwu_level3_sayStressing3"

export let getSayHitRightNipple1SoundResourceId = () => "biwu_level3_sayHitRightNipple1"

export let getSayHitRightNipple2SoundResourceId = () => "biwu_level3_sayHitRightNipple2"

export let getSayHitRightNipple3SoundResourceId = () => "biwu_level3_sayHitRightNipple3"

export let getSayHitLeftNipple1SoundResourceId = () => "biwu_level3_sayHitLeftNipple1"

export let getSayHitLeftNipple2SoundResourceId = () => "biwu_level3_sayHitLeftNipple2"

export let getSayHitLeftNipple3SoundResourceId = () => "biwu_level3_sayHitLeftNipple3"

export let getLoadData = () => {
    return [
        {
            id: getSceneResourceId(),
            path: `./resource/${getName()}/scene_biwu_level3.glb`,
            type: resourceType.ArrayBuffer
        },
    ].concat(
        [
            {
                id: getDownArrowResourceId(),
                path: getDownArrowResourcePath(),
                type: resourceType.Texture
            },


            {
                id: getBeatSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getBeatSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },

            {
                id: getAddSoundResourceId(),
                path: [`./resource/${getName()}/audio/${getAddSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },


            {
                id: getSayGoSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayGoSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayReachSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayReachSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayOnlySoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayOnlySoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayAddSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayAddSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayOneSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayOneSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayBeatSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayBeatSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayLeftRightSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayLeftRightSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayTwoOneSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayTwoOneSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayTwoBeatSoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayTwoBeatSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayStressing1SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayStressing1SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayStressing2SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayStressing2SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayStressing3SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayStressing3SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitRightNipple1SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitRightNipple1SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitRightNipple2SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitRightNipple2SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitRightNipple3SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitRightNipple3SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitLeftNipple1SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitLeftNipple1SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitLeftNipple2SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitLeftNipple2SoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getSayHitLeftNipple3SoundResourceId(),
                path: [`./resource/${getName()}/audio/scenario/biwu/level3/${getSayHitLeftNipple3SoundResourceId()}.mp3`],
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
        actionData: getActionData(),
        phaseData: getPhase(),


        girlValue: NullableUtils.return_(
            GirlData.getValue(state)
        ),
        littleManValue: NullableUtils.return_(
            LittleManData.getValue(state)
        ),
        allMMDData: getAllMMDData(),
        // shoeData: getConfigData(state).shoeData.concat(getShoeData()),
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