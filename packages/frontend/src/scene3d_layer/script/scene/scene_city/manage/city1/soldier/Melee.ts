import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, getSwipingEmmitGirlSoundResourceId, } from "../../../CityScene"
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
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
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
import { armyValue, emitPrecision, emitSpeed, emitterVolume, emitterLife, emitterSize, emitterSpeed, objectValue, weaponValue } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/AviailableLODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getRandomCollisionPart, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getNearDistance, parseCharacterQueue } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { queryOBBShapeCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, handleCollision } from "../../../utils/ArmyUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { buildBloodDecalQueue, buildNameInShadowQueue, createBloodData, createDestroyingState, createStressingState, removeShadow, restoreShadow, updateShadow, handlePickdown as handlePickdownUtils } from "../../../utils/CharacterUtils"
import { armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, excitement, forceSize, hp, speed, armorType } from "../../../data/DataType"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as SwipingWeapon from "../../../weapon/SwipingWeapon"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
// import { animationName } from "../../../little_man_data/DataType"
// import { getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getSwipingAnimationResourcePath, getControlledAnimationResourcePath, getMeleeResourcePath, getMutantResourceId, getMutantResourcePath } from "../../../little_man_data/Const"
import {
    animationName, getModelData, modelName,
    getIdleAnimationResourcePath, getRunningAnimationResourcePath, getSwipingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getControlledAnimationResourcePath, getSwipingWorkFrameCount, getDeathHeadshotAnimationResourcePath, getLieAnimationResourcePath, getStandupFromLieAnimationResourcePath,
} from "../../../army_data/SoldierData"
import { addBoneGroup, setBonePositionOffset } from "../../../utils/BoneUtils"
import * as Soldier from "./Soldier"
import { computeTimeSecond } from "../../../utils/AnimationUtils"
import { handleSwipHitArmy, handleSwipHitGirl, handleSwipHitLittleMan, handleSwipHitStatic } from "./weapon/Swip"
import { getNamePrefixMelee, isMeleeUtils } from "./utils/SoldierUtils"
import { updateArmyValue } from "../../../difficulty/HeatImplementer"
import { getCampExn } from "../Army"
import { setAttackFactor, setCritRatioFactor, setDefenseFactor, setEmitSpeedFactor, setMoveSpeed } from "../../../StaticDynamicUnit"


const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

enum animationClipIndex {
    Run = 0,
    Swiping = 1,
    Death = 2,
    DeathHeadshot = 3,
    Shake = 4,
    Idle = 5,
    PickedControlled = 6,
    Lie = 7,
    StandupFromLie = 8,
    // FlyBack = 9,
    // StandupFromFlyBack = 10,
    // Dizzy = 11,
}

export let getNamePrefix = getNamePrefixMelee

export let buildCategoryName = getNamePrefix

export let buildSkinLODName = () => {
    return `${getNamePrefix()}_lod`
}

export let isMelee = isMeleeUtils

export let getValue = (state: state) => {
    return updateArmyValue<armyValue>(state, {
        excitement: excitement.Middle,
        // defenseFactor: defenseFactor.Low,
        defenseFactor: defenseFactor.VeryLow,
        // armorType: armorType.Heavy,
        armorType: armorType.Light,
        // armorRatio: armorRatio.Heavy,
        armorRatio: armorRatio.Light,
        armorStrength: armorStrength.Middle,
        attackFactor: attackFactor.VeryLow2,
        emitSpeedFactor: emitSpeedFactor.Low,
        critRatioFactor: critRatioFactor.Low,
        //missRatio: missRatio.VeryLow,
        // hp: hp.Middle,
        hp: hp.Low,

        moveSpeed: speed.Low,

        // emitSpeed: emitSpeed.Middle,
        emitPrecision: emitPrecision.Middle,
    })
}

export let getModelQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).soldierMap.get(buildCategoryName()))
}

export let getShadowQueue = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).shadowQueueMap.get(buildCategoryName()))
}

export let initWhenImportScene = (state: state) => {
    let { resourceId, resourcePath } = getModelData(state, modelName.Melee)

    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), resourceId), resourcePath,).then(melee => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Idle), getIdleAnimationResourcePath(getCitySceneName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Run), getRunningAnimationResourcePath(getCitySceneName())).then(run => {
                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Swiping), getSwipingAnimationResourcePath(getCitySceneName())).then(swiping => {
                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shake), getShakeAnimationResourcePath(getCitySceneName())).then(shake => {
                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Death), getDeathAnimationResourcePath(getCitySceneName())).then(death => {
                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.DeathHeadshot), getDeathHeadshotAnimationResourcePath(getCitySceneName())).then(deathHeadshot => {
                                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.PickedControlled), getControlledAnimationResourcePath(getCitySceneName())).then(pickedControlled => {
                                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Lie), getLieAnimationResourcePath(getCitySceneName())).then(lie => {
                                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.StandupFromLie), getStandupFromLieAnimationResourcePath(getCitySceneName())).then(standupFromLie => {

                                            state = Soldier.setState(state, {
                                                ...Soldier.getState(state),
                                                initialQuaternionMap: Soldier.getState(state).initialQuaternionMap.set(modelName.Melee,
                                                    Soldier.getSoldierSkinMesh(melee).quaternion.clone()
                                                ),
                                            })


                                            melee = addBoneGroup(melee)

                                            state = setBonePositionOffset(state, melee, getModelData(state, modelName.Melee).positionOffset)

                                            let data = parseCharacterQueue(
                                                state, [
                                                buildCategoryName,
                                                Soldier.getSoldierSkinMesh,
                                                Soldier.setData,
                                                buildSkinLODName,
                                                //Soldier.getFPS,
                                                box => {
                                                    return box
                                                }
                                            ],
                                                melee,
                                                [
                                                    run.animations[0],
                                                    swiping.animations[0],
                                                    death.animations[0],
                                                    deathHeadshot.animations[0],
                                                    shake.animations[0],
                                                    idle.animations[0],
                                                    pickedControlled.animations[0],
                                                    lie.animations[0],
                                                    standupFromLie.animations[0],
                                                    // flyBack.animations[0],
                                                    // standupFromFlyBack.animations[0],
                                                    // dizzy.animations[0],
                                                ],
                                                getNearDistance,
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
                })
            })
        })
    })
}

export let initialAttributes = (state, name, index) => {
    let { defenseFactor, moveSpeed, attackFactor, critRatioFactor, emitSpeedFactor } = getValue(state)

    state = setDefenseFactor(state, name, defenseFactor)
    state = setMoveSpeed(state, name, moveSpeed)
    state = setAttackFactor(state, name, attackFactor)
    state = setEmitSpeedFactor(state, name, emitSpeedFactor)
    state = setCritRatioFactor(state, name, critRatioFactor)
    // state = setMissRatio(state, name,)

    return Soldier.setState(state, {
        ...Soldier.getState(state),
        lodQueueIndexMap: Soldier.getState(state).lodQueueIndexMap.set(name, index),
        stateMachineMap: Soldier.getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
        hpMap: Soldier.getState(state).hpMap.set(name, getFullHp(state)),
    })
}


let _getIdleClipIndex = (name) => {
    return animationClipIndex.Idle
}

let _getSwipingClipIndex = (name) => {
    return animationClipIndex.Swiping
}

let _getControlledClipIndex = (name) => {
    return animationClipIndex.PickedControlled
}

let _getShakeClipIndex = (name, damageType_) => {
    return animationClipIndex.Shake
}

let _getRunClipIndex = (name) => {
    return animationClipIndex.Run
}

let _getDeathClipIndex = Soldier.getDeathClipIndex(animationClipIndex.Death, animationClipIndex.DeathHeadshot, animationClipIndex.Lie)

let _getLieClipIndex = (name) => {
    return animationClipIndex.Lie
}

let _getStandupClipIndex = (name) => {
    return animationClipIndex.StandupFromLie
}



export let damage = (damageFunc) => {
    return damageFunc(
        [
            _getShakeClipIndex,
            _getDeathClipIndex,
            _getIdleClipIndex,
            _getLieClipIndex,
            _getStandupClipIndex,
            createInitialState,
            getValue
        ]
    )
}

export let createInitialState = Soldier.createInitialState(_getIdleClipIndex)

export let createSwipingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Attack,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            let clipIndex = _getSwipingClipIndex(name)

            let lODQueueAndShadowLODQueueIndex = Soldier.getModelQueueIndex(state, name)
            let lodQueue = Soldier.getModelQueue(state, name)

            let camp_ = getCampExn(state, name)


            state = Soldier.shoot(state,
                (state,
                    targetPosition,
                    targetPart,
                    lookatQuaternion,
                    soldierPosition,
                    soldierScale,
                    armyValue,
                    weaponValue: weaponValue,
                ) => {
                    return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                        // return handleMeleeCollision(
                        //     state,
                        //     [
                        //         handleSwipHitStatic,
                        //         handleSwipHitGirl
                        //     ],
                        //     name,
                        //     1,
                        //     targetPosition,
                        //     targetPart,
                        //     soldierPosition,
                        //     lodQueue.boxes[lODQueueAndShadowLODQueueIndex],
                        //     weaponValue
                        // )
                        let direction = targetPosition.clone().sub(soldierPosition).normalize()

                        let box = lodQueue.getBox(lODQueueAndShadowLODQueueIndex)

                        let meleeRange = NullableUtils.getExn(
                            weaponValue.meleeRange
                        )


                        // let center = box.getCenter(_v1).add(direction.multiplyScalar(meleeRange / 2).setY(0))
                        // let center = box.getCenter(_v1).add(direction.multiplyScalar(meleeRange / 1.5).setY(0))
                        // let center = box.getCenter(_v1).add(direction.multiplyScalar(meleeRange / 1.2).setY(0))
                        let center = box.getCenter(_v1).add(direction.clone().multiplyScalar(meleeRange / 1.3).setY(0))
                        // let center = box.getCenter(_v1).add(direction.multiplyScalar(meleeRange / 1.5).setY(0))

                        let attackRangeBox = _b.setFromCenterAndSize(center, _v2.set(meleeRange, box.getSize(_v3).y, meleeRange))

                        if (getIsDebug(state)) {
                            addBox3Helper(getAbstractState(state), getScene(state), attackRangeBox, 0x811100)
                        }

                        return handleCollision(
                            state,
                            [
                                NullableUtils.getEmpty(),
                                handleSwipHitGirl,
                                NullableUtils.return_(handleSwipHitArmy),
                                // NullableUtils.getEmpty(),
                                handleSwipHitLittleMan
                            ],
                            // NullableUtils.return_(targetPart),
                            targetPart,
                            attackRangeBox, center,
                            name,
                            camp_,
                            direction,
                            false,
                            weaponValue,
                            // damageType.Direct
                            SwipingWeapon.getName()
                        )

                    }, computeTimeSecond(state, getSwipingWorkFrameCount(), name), name))
                },

                getValue(state),
                SwipingWeapon.getValue(state),
                Soldier.getInitialQuaternion(state, modelName.Melee),

                name, clipIndex,
                _getIdleClipIndex(state),
                lodQueue, lODQueueAndShadowLODQueueIndex)

            return Promise.resolve(state)
        },
        exitFunc: Soldier.exitFuncForCreateShootState
    }
}

export let createPickedControlledState = Soldier.createSoldierControlledState(_getControlledClipIndex, objectStateName.PickedControlled)

export let createUBControlledState = Soldier.createSoldierControlledState(_getControlledClipIndex, objectStateName.UBControlled)

export let createBreastControlledState = Soldier.createSoldierControlledState(_getControlledClipIndex, objectStateName.BreastControlled)

export let createShoeControlledState = Soldier.createSoldierControlledState(_getControlledClipIndex, objectStateName.ShoeControlled)


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


export let createMoveState = (state: state) => {
    return Soldier.createMoveState(
        [
            _getRunClipIndex,
            _getShadowQueue,
            createInitialState,
        ],
        getValue(state),
        modelName.Melee
    )
}

export let update = (state: state) => {
    return Soldier.updateAI(state, [
        createSwipingState,
        createInitialState,
        createMoveState(state)
    ],
        getModelQueue(state),
        SwipingWeapon.getValue(state))
}

// export let dispose = (state: state) => {
//     return Soldier.dispose(state)
// }


export let getPickedTransform = Soldier.getPickedTransform(modelName.Melee)

export let getUBControlledTransform = Soldier.getUBControlledTransform(modelName.Melee)

export let getPutToBreastTransform = Soldier.getPutToBreastTransform(modelName.Melee)

export let getPutToShoeTransform = Soldier.getPutToShoeTransform(modelName.Melee)


export let handlePickup = (state: state, usedGirl, name: name) => {
    return Soldier.handlePickup(state, createPickedControlledState, name)
}

export let updateTransform = Soldier.updateTransform

export let handlePickdown = Soldier.handlePickdown([createInitialState, _getShadowQueue])

export let handleFall = Soldier.handleFall([
    _getControlledClipIndex, _getIdleClipIndex, _getStandupClipIndex, _getLieClipIndex,
    _getShadowQueue
])

export let handleRepel = Soldier.handleRepel([
    _getIdleClipIndex, _getControlledClipIndex,
    _getShadowQueue
])

export let handleUBControl = (state: state, usedGirl, name: name) => {
    return Soldier.handleUBControl(state, createUBControlledState, name)
}

export let handlePutToBreast = (state: state, usedGirl, name: name) => {
    return Soldier.handlePutToBreast(state, createBreastControlledState, name)
}

export let handlePutToShoe = (state: state, usedGirl, name: name) => {
    return Soldier.handlePutToShoe(state, createShoeControlledState, name)
}


export let updateUBControlledTransform = Soldier.updateUBControlledTransform

export let updatePutToBreastTransform = Soldier.updatePutToBreastTransform

export let updatePutToShoeTransform = Soldier.updatePutToShoeTransform


export let getLocalTransform = Soldier.getLocalTransform

export let getBoxForPick = Soldier.getBoxForPick


export let getModelQueueIndex = Soldier.getModelQueueIndex

export let getHp = Soldier.getHp

export let getHpRatio = (state, name) => {
    return Soldier.getHpWithDefault(state, name) / getFullHp(state)
}

export let updateHp = Soldier.updateHp

export let getFullHp = (state: state) => {
    return getValue(state).hp
}

export let getSnapshot = () => `./resource/ui/in_game/snapshot/melee.png`

export let getModelName = () => modelName.Melee