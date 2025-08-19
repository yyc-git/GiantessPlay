import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getScene, getBasicBulletGunEmmitSoundResourceId, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, getCommanderPointingSoundResourceId, } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { soldier, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart, commander, xzRange } from "../../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Bone, Box3, Euler, Matrix4, Mesh, Object3D, PropertyMixer, Quaternion, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../../../utils/DamageUtils"
import { toRadians } from "../../../../../../utils/QuatUtils"
import { buildDestroyedEventData, getDestroyedEventName } from "../../../utils/EventUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { buildDownDirection, buildRandomDirectionInXZ } from "../../../../../../utils/DirectionUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { InstanceSourceLOD as InstanceSourceLODType } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { bulletParticle, fontType, fsm_state, labelAnimation, lodQueueIndex, name, staticLODContainerIndex, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Girl from "../../../girl/Girl"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { armyValue, emitPrecision, emitSpeed, emitVolume, emitterLife, emitterSize, emitterSpeed, objectValue } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/LODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getRandomCollisionPart, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { parseCharacter, parseCharacterQueue } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { queryAllOBBShapesCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy } from "../../../utils/ArmyUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { buildBloodDecalQueue, buildNameInShadowQueue, createBloodData, createDestroyingState, createStressingState, removeShadow, restoreShadow, updateShadow, handlePickdown as handlePickdownUtils } from "../../../utils/CharacterUtils"
import { defenseFactor, excitement, forceSize, hp, speed } from "../../../data/DataType"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as BasicBulletGun from "../../../weapon/BasicBulletGun"
import { isMaxArmySpeed } from "../../../utils/ConfigUtils"
// import { animationName } from "../../../little_man_data/DataType"
// import { getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getSwipingAnimationResourcePath, getControlledAnimationResourcePath, getCommanderResourcePath, getMutantResourceId, getMutantResourcePath } from "../../../little_man_data/Const"
import {
    animationName, getModelData, modelName,
    getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getControlledAnimationResourcePath, getCommanderResourcePath,
    getEmitAnimationResourcePath,
    getPointingAnimationResourcePath,
    getPointingWorkFrameCount,
} from "../../../army_data/SoldierData"
import { addBoneGroup, setBonePositionOffset } from "../../../utils/BoneUtils"
import * as Soldier from "./Soldier"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { removePointingRange, setPointingRange } from "./utils/CommanderUtils"
import { computeTimeSecond } from "../../../utils/AnimationUtils"


const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

enum animationClipIndex {
    Run = 0,
    Pointing = 1,
    Death = 2,
    Shake = 3,
    Idle = 4,
    Controlled = 5,
}

export let getNamePrefix = () => `${Soldier.getNamePrefix()}_commander`

export let buildCategoryName = getNamePrefix

export let buildSkinLODName = () => {
    return `${getNamePrefix()}_lod`
}

export let isCommander = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue => {
    return {
        excitement: excitement.VeryHigh,
        defenseFactor: defenseFactor.High,
        hp: hp.Middle,

        moveSpeed: speed.Low,

        emitSpeed: emitSpeed.VerySlow,
        emitVolume: emitVolume.VeryBig,
        emitPrecision: emitPrecision.Middle,
    }
}

export let getModelQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).soldierMap.get(buildCategoryName()))
}

export let getShadowQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).shadowQueueMap.get(buildCategoryName()))
}

export let initWhenImportScene = (state: state) => {
    let { resourceId, resourcePath } = getModelData(state, modelName.Commander)

    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), resourceId), resourcePath,).then(commander => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Idle), getIdleAnimationResourcePath(getCitySceneName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Run), getRunningAnimationResourcePath(getCitySceneName())).then(run => {
                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Pointing), getPointingAnimationResourcePath(getCitySceneName())).then(pointing => {
                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shake), getShakeAnimationResourcePath(getCitySceneName())).then(shake => {
                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Death), getDeathAnimationResourcePath(getCitySceneName())).then(death => {
                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Controlled), getControlledAnimationResourcePath(getCitySceneName())).then(controlled => {

                                state = Soldier.setState(state, {
                                    ...Soldier.getState(state),
                                    initialQuaternionMap: Soldier.getState(state).initialQuaternionMap.set(modelName.Commander,
                                        Soldier.getSoldierSkinMesh(commander).quaternion.clone()
                                    ),
                                })


                                commander = addBoneGroup(commander)

                                state = setBonePositionOffset(state, commander, getModelData(state, modelName.Commander).positionOffset)

                                let data = parseCharacterQueue(
                                    state, [
                                    buildCategoryName,
                                    Soldier.getSoldierSkinMesh,
                                    Soldier.setData,
                                    buildSkinLODName,
                                    Soldier.getFPS
                                ],
                                    commander,
                                    [
                                        run.animations[0],
                                        pointing.animations[0],
                                        death.animations[0],
                                        shake.animations[0],
                                        idle.animations[0],
                                        controlled.animations[0],
                                    ],
                                    500,
                                    getScene(state)
                                )
                                state = data[0]
                                let allClipDurations = data[1]
                                let allClipSteps = data[2]

                                return Soldier.setClipData(state, buildCategoryName(), allClipDurations, allClipSteps)
                            })
                        })
                    })
                })
            })
        })
    }).then(Soldier.initWhenImportScene)
}

let _getFullHp = (state) => {
    return getValue(state).hp
}

export let initialAttributes = (state, name, index) => {
    return Soldier.setState(state, {
        ...Soldier.getState(state),
        lodQueueIndexMap: Soldier.getState(state).lodQueueIndexMap.set(name, index),
        stateMachineMap: Soldier.getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
        defenseFactorMap: Soldier.getState(state).defenseFactorMap.set(name, getValue(state).defenseFactor),
        hpMap: Soldier.getState(state).hpMap.set(name, _getFullHp(name)),
    })
}


let _getIdleClipIndex = (name) => {
    return animationClipIndex.Idle
}

let _getPointingClipIndex = (name) => {
    return animationClipIndex.Pointing
}

let _getControlledClipIndex = (name) => {
    return animationClipIndex.Controlled
}

let _getShakeClipIndex = (name) => {
    return animationClipIndex.Shake
}

let _getRunClipIndex = (name) => {
    return animationClipIndex.Run
}

let _getDeathClipIndex = (name) => {
    return animationClipIndex.Death
}

export let damage = (damageFunc) => {
    return damageFunc(
        [
            _getShakeClipIndex,
            _getDeathClipIndex,
            createInitialState,
            (state, name) => {
                return removePointingRange(state, name)
            }
        ]
    )
}

export let createInitialState = (): fsm_state<state> => {
    return {
        name: objectStateName.Initial,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            let clipIndex = _getIdleClipIndex(name)

            state = setAbstractState(state, GPUSkin.playLoop(
                getAbstractState(state),
                name, clipIndex
            ))

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

// export let createState = (): commander => {
//     return {
//         pointingRangeMap: Map()
//     }
// }

// let _getAllPointingRanges = (state: state) => {
//     return Array.from(_getState(state).pointingRangeMap.values())
// }

// let _isInXZRange = (position: Vector3, xzRange: xzRange) => {
//     return position.x > xzRange.minX && position.x < xzRange.maxX && position.z > xzRange.minZ && position.z < xzRange.maxZ
// }

// let _getIncreaseArmyValue = (armyValue: armyValue) => {
//     return {
//         ...armyValue,
//         defenseFactor: armyValue.defenseFactor * 1.2,
//         moveSpeed: armyValue.moveSpeed * 1.2,
//         emitSpeed: armyValue.emitSpeed / 1.5,
//         emitPrecision: armyValue.emitPrecision / 1.5,
//     }
// }

// export let getArmyValueForAttack = (state: state, armyValue: armyValue, soldierPosition: Vector3) => {
//     let isInRange = _getAllPointingRanges(state).reduce((isInRange, xzRange) => {
//         if (isInRange) {
//             return isInRange
//         }

//         return _isInXZRange(soldierPosition, xzRange)
//     }, false)


//     if (isInRange) {
//         return _getIncreaseArmyValue(armyValue)
//     }

//     return armyValue
// }

export let createPointingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Attack,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            let clipIndex = _getPointingClipIndex(name)

            let lODQueueAndShadowLODQueueIndex = Soldier.getModelQueueIndex(state, name)
            let lodQueue = Soldier.getModelQueue(state, name)


            state = Soldier.shoot(state,
                (state,
                    girlPosition,
                    _,
                    lookatQuaternion,
                    soldierPosition,
                    soldierScale,
                    armyValue,
                    weaponValue,
                ) => {
                    return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                        let {
                            emitSpeed,
                            emitVolume,
                            emitPrecision
                        } = armyValue

                        if (NumberUtils.isRandomRate(0.3)) {
                            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                                SoundManager.buildNeedToPlaySoundData(getCommanderPointingSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, soldierPosition, 0))
                            ))
                        }

                        state = setPointingRange(state, name, soldierPosition)

                        return Promise.resolve(state)
                    }, computeTimeSecond(getPointingWorkFrameCount()), name))
                },
                getValue(state),
                BasicBulletGun.getValue(state),
                Soldier.getInitialQuaternion(state, modelName.Commander),

                name, clipIndex, lodQueue, lODQueueAndShadowLODQueueIndex)

            return Promise.resolve(state)
        },
        exitFunc: Soldier.exitFuncForCreateShootState
    }
}

export let createControlledState = (): fsm_state<state> => {
    return {
        name: objectStateName.Controlled,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            let clipIndex = _getControlledClipIndex(name)

            state = setAbstractState(state, GPUSkin.playLoop(
                getAbstractState(state),
                name, clipIndex
            ))

            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }
}

let _getShadowQueue = (state: state, name: string) => {
    let categoryName
    if (name.includes(getNamePrefix())) {
        categoryName = buildCategoryName()
    }
    else {
        throw new Error("err")
    }

    return NullableUtils.getExn(Soldier.getState(state).shadowQueueMap.get(categoryName))
}


export let createMoveState = (state) => {
    return Soldier.createMoveState(
        [
            _getRunClipIndex,
            _getShadowQueue,
            createInitialState,
        ],
        getValue(state),
        modelName.Commander
    )
}

export let update = (state: state) => {
    return Soldier.updateAI(state, [
        createPointingState,
        createInitialState,
        createMoveState(state)
    ],
        getModelQueue(state),
        BasicBulletGun.getValue(state))
}

// export let dispose = (state: state) => {
//     return Soldier.dispose(state)
// }


export let getPickedTransform = Soldier.getPickedTransform(modelName.Commander)


export let handlePickup = (state: state, name: name) => {
    return Soldier.handlePickup(state, createControlledState, name)
}

export let updateTransform = Soldier.updateTransform

export let handlePickdown = Soldier.handlePickdown([createInitialState, _getShadowQueue])

export let getLocalTransform = Soldier.getLocalTransform

export let getBoxForPick = Soldier.getBoxForPick


export let getModelQueueIndex = Soldier.getModelQueueIndex

export let getHp = Soldier.getHp
