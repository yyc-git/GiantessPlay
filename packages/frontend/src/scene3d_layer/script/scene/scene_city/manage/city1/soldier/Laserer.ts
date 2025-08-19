import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getScene, getBasicBulletGunEmmitSoundResourceId, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getLaserBulletGunEmmitSoundResourceId } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { soldier, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart } from "../../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Bone, Box3, Euler, Matrix4, Mesh, Object3D, Quaternion, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
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
import { isMaxArmySpeed } from "../../../utils/ConfigUtils"
// import { animationName } from "../../../little_man_data/DataType"
// import { getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getSwipingAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath, getMutantResourceId, getMutantResourcePath } from "../../../little_man_data/Const"
import {
    animationName, getModelData, modelName,
    getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath,
    getInfantryResourceId,
    getCommanderResourceId,
    getEmitAnimationResourcePath,
    getLasererResourceId,
    getEmitWorkFrameCount,
    getShootWorkFrameCount,
} from "../../../army_data/SoldierData"
import { addBoneGroup, setBonePositionOffset } from "../../../utils/BoneUtils"
import * as Soldier from "./Soldier"
import * as LaserGun from "../../../weapon/LaserGun"
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
    Shoot = 1,
    Death = 2,
    Shake = 3,
    Idle = 4,
    Controlled = 5,
}

export let getNamePrefix = () => `${Soldier.getNamePrefix()}_laserer`

export let buildCategoryName = getNamePrefix

export let buildSkinLODName = () => {
    return `${getNamePrefix()}_lod`
}

export let isLaserer = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue => {
    return {
        excitement: excitement.High,
        defenseFactor: defenseFactor.Low,
        hp: hp.Low,

        moveSpeed: speed.Low,

        emitSpeed: emitSpeed.Middle,
        emitVolume: emitVolume.Small,
        emitPrecision: emitPrecision.High,
    }
}

export let getModelQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).soldierMap.get(buildCategoryName()))
}

export let getShadowQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).shadowQueueMap.get(buildCategoryName()))
}

export let initWhenImportScene = (state: state) => {
    let { resourceId, resourcePath } = getModelData(state, modelName.Laserer)

    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), resourceId), resourcePath,).then(rocketeer => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Idle), getIdleAnimationResourcePath(getCitySceneName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Run), getRunningAnimationResourcePath(getCitySceneName())).then(run => {
                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shoot), getShootingAnimationResourcePath(getCitySceneName())).then(shoot => {
                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shake), getShakeAnimationResourcePath(getCitySceneName())).then(shake => {
                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Death), getDeathAnimationResourcePath(getCitySceneName())).then(death => {
                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Controlled), getControlledAnimationResourcePath(getCitySceneName())).then(controlled => {

                                state = Soldier.setState(state, {
                                    ...Soldier.getState(state),
                                    initialQuaternionMap: Soldier.getState(state).initialQuaternionMap.set(modelName.Laserer,
                                        Soldier.getSoldierSkinMesh(rocketeer).quaternion.clone()
                                    ),
                                })


                                rocketeer = addBoneGroup(rocketeer)

                                state = setBonePositionOffset(state, rocketeer, getModelData(state, modelName.Laserer).positionOffset)

                                let data = parseCharacterQueue(
                                    state, [
                                    buildCategoryName,
                                    Soldier.getSoldierSkinMesh,
                                    Soldier.setData,
                                    buildSkinLODName,
                                    Soldier.getFPS
                                ],
                                    rocketeer,
                                    [
                                        run.animations[0],
                                        shoot.animations[0],
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

let _getShootClipIndex = (name) => {
    return animationClipIndex.Shoot
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

let _getBulletStartLocalPosition = (soldierScale) => {
    // return new Vector3(-0.915845, 7.97347, 4.49601).multiply(soldierScale)
    return new Vector3(-0.915845, 10.97347, 4.49601).multiply(soldierScale)
}

export let createShootState = (): fsm_state<state> => {
    return {
        name: objectStateName.Attack,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            let clipIndex = _getShootClipIndex(name)

            let lODQueueAndShadowLODQueueIndex = Soldier.getModelQueueIndex(state, name)
            let lodQueue = Soldier.getModelQueue(state, name)


            state = Soldier.shoot(state,
                (state,
                    targetPosition,
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
                        let {
                            emitterSpeed,
                            emitterLife,
                            emitterSize,
                        } = weaponValue

                        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                            SoundManager.buildNeedToPlaySoundData(getLaserBulletGunEmmitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, soldierPosition, 0))
                        ))

                        state = setAbstractState(state, ParticleManager.emitLaserBullet(getAbstractState(state), {
                            fromName: name,
                            speed: emitterSpeed,
                            life: emitterLife,
                            size: emitterSize,
                            position: Soldier.getBulletStartLocalPositionFunc(_getBulletStartLocalPosition,
                                lookatQuaternion,
                                soldierPosition,
                                soldierScale,
                            ).toArray(),
                            direction: getShootDirection(
                                targetPosition.clone().sub(soldierPosition).normalize(),
                                emitPrecision
                            ).toArray(),
                        }, getParticleNeedCollisionCheckLoopCount(state)))

                        return Promise.resolve(state)
                    }, computeTimeSecond(getShootWorkFrameCount()), name))
                },


                getValue(state),
                LaserGun.getValue(state),
                Soldier.getInitialQuaternion(state, modelName.Laserer),

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
        modelName.Laserer,
    )
}

export let update = (state: state) => {
    return Soldier.updateAI(state, [
        createShootState,
        createInitialState,
        createMoveState(state)
    ],
        getModelQueue(state),
        LaserGun.getValue(state))
}

// export let dispose = (state: state) => {
//     return Soldier.dispose(state)
// }


export let getPickedTransform = Soldier.getPickedTransform(modelName.Laserer)

export let handlePickup = (state: state, name: name) => {
    return Soldier.handlePickup(state, createControlledState, name)
}

export let updateTransform = Soldier.updateTransform

export let handlePickdown = Soldier.handlePickdown([createInitialState, _getShadowQueue])

export let getLocalTransform = Soldier.getLocalTransform

export let getBoxForPick = Soldier.getBoxForPick


export let getModelQueueIndex = Soldier.getModelQueueIndex

export let getHp = Soldier.getHp