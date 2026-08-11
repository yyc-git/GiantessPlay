import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { soldier, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart, attackTarget } from "../../../type/StateType"
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
import { bulletParticle, fontType, fsm_state, labelAnimation, lodQueueIndex, name, stateMachine, staticLODContainerIndex, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Girl from "../../../girl/Girl"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { armyValue, emitPrecision, emitSpeed, emitterVolume, emitterLife, emitterSize, emitterSpeed, objectValue, weaponType, weaponValue } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/AviailableLODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getNearestCollisionPart, getRandomCollisionPart, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"

import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { parseCharacterQueue } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { queryOBBShapeCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { getShootDirection, updateAI as updateAIUtils, createMoveState as createMoveStateUtils, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, getLittleManPositionParrelToArmy, getCrowdDataUtils, getTargetDataForSoldier, handleDestroyed, handleDestroying, handleHeadShot, computeAttackFrames, isCanNotAttackByCD, computeRemainAttackFrames, addLabel } from "../../../utils/ArmyUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { buildBloodDecalQueue, buildNameInShadowQueue, createBloodData, createDestroyingState, createStressingState, removeShadow, restoreShadow, updateShadow, handlePickdown as handlePickdownUtils, isChangeToLieState, checkCurrentState, updateCharacterPosition } from "../../../utils/CharacterUtils"
import { defenseFactor, excitement, forceSize, hp, speed } from "../../../data/DataType"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils, removePickData } from "../../../girl/PickPoseUtils"
import { getGiantessPutToBreastTransformFunc, getGiantessPutToShoeTransformFunc, getGiantessTransformFunc, getGiantessUBControlledTransformFunc, getPickTransformPrefix, getPutToBreastTransformPrefix, getPutToShoeTransformPrefix, getUBControlledTransformPrefix } from "../../../utils/SkeletonUtils"
// import * as BasicBulletGun from "../../../weapon/BasicBulletGun"
import { isMaxArmySpeed } from "../../../utils/ConfigUtils"
// import { animationName } from "../../../little_man_data/DataType"
// import { getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getSwipingAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath, getMutantResourceId, getMutantResourcePath } from "../../../little_man_data/Const"
import {
    animationName, getModelData, modelName,
    getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath,
    getInfantryResourceId,
    getCommanderResourceId,
    getEmitAnimationResourcePath,
    getRocketResourceId,
    getLasererResourceId,
} from "../../../army_data/SoldierData"
import { addBoneGroup, setBonePositionOffset } from "../../../utils/BoneUtils"
import { getArmyValueForAttack, createState as createCommanderState, removePointingRange } from "./utils/CommanderUtils"
import { Console } from "meta3d-jiehuo-abstract"
import * as SoldierUtils from "./utils/SoldierUtils"
import { getDamageTypeFactor, getForceFactor } from "../../../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getAttackTargetExn, setLastAttackFrame } from "../Army"
import * as LittleManTransform from "../../../little_man/Transform"
import { getPlayerPosition } from "../../../utils/PlayerUtils"
import { generateReward } from "../../../reward/RewardGenerator"
import { isLittleMan } from "../../../little_man/LittleMan"
import { isRemoteWeapon } from "../../../utils/WeaponUtils"
import { findMaxSizeIndex } from "../../../utils/Box3Utils"
import { isControlledState, isDestoryRelatedStates, isFallState, isLieState, isNotDamageState, isRepelState } from "../../../utils/FSMStateUtils"
import { changeStandBoxToLieBox } from "../../../utils/LieUtils"
import { disposeData as disposeStaticDynamicUnitData, getEmitSpeedFactor, getMoveSpeed } from "../../../StaticDynamicUnit"
import { getModAPI } from "../../../Mod"
import { api } from "type-api/src/Type"
import { handleRepelForCharacter } from "../../../utils/RepelUtils"
import { removeTweensByKey, setTweensByKey } from "../../../TweenManager"
import { clearTargetByName } from "../../../utils/BehaviourManagerUtils"
import { isChangeToFallState } from "../../../utils/FallUtils"

const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

// enum soldierAnimationClipIndex {
//     Run = 0,
//     Shoot = 1,
//     Death = 2,
//     Shake = 3,
//     Idle = 4,
//     PickedControlled = 5,
// }

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).soldier)
}

export let setState = (state: state, soldierState: soldier) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        soldier: NullableUtils.return_(soldierState)
    })
}

// export let getNamePrefix = SoldierUtils.getNamePrefix

export let getSoldierSkinMesh = (group: Object3D) => {
    let meshes = []
    group.traverse(o => {
        if ((o as SkinnedMesh).isSkinnedMesh) {
            meshes.push(o)
        }
    })

    if (meshes.length > 1) {
        throw new Error("err")
    }

    return meshes[0]
}

export let setData = (state: state, categoryName, queue: LODQueue, shadowQueue: LODQueue) => {
    return setState(state, {
        ...getState(state),
        soldierMap: getState(state).soldierMap.set(categoryName, queue),
        shadowQueueMap: getState(state).shadowQueueMap.set(categoryName, shadowQueue)
    })
}

export let isSoldier = SoldierUtils.isSoldier

export let getAllModelQueues = SoldierUtils.getAllModelQueues

export let getClipData = (state: state, categoryName): [Array<number>, Array<number>] => {
    return [
        NullableUtils.getExn(getState(state).allClipDurations.get(categoryName)),
        NullableUtils.getExn(getState(state).allClipSteps.get(categoryName)),
    ]
}

export let setClipData = (state: state, categoryName, allClipDurations, allClipSteps) => {
    return setState(state, {
        ...getState(state),
        allClipDurations: getState(state).allClipDurations.set(categoryName, allClipDurations),
        allClipSteps: getState(state).allClipSteps.set(categoryName, allClipSteps),
    })
}

export let createState = (): soldier => {
    return {
        soldierMap: Map(),

        // glb: NullableUtils.getEmpty(),

        stateMachineMap: Map(),
        hpMap: Map(),

        lodQueueIndexMap: Map(),

        moveTweenMap: Map(),

        shadowQueueMap: Map(),

        bloodData: createBloodData(),

        allClipDurations: Map(),
        allClipSteps: Map(),

        moveDataMap: Map(),

        // crowdPositions: [],

        initialQuaternionMap: Map(),

        // rocketQueue: NullableUtils.getEmpty(),

        commander: createCommanderState(),
    }
}

export let getModelQueue = (state: state, name: string): LODQueue => {
    return LOD.getLODQueue(getAbstractState(state), name)
}

export let getModelQueueIndexNullable = (state: state, name) => {
    return getState(state).lodQueueIndexMap.get(name)
}


export let getModelQueueIndex = (state: state, name) => {
    return NullableUtils.getExn(getModelQueueIndexNullable(state, name))
}



export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    // abstractState = Collision.setPlayerMoveCollisionableContainers(abstractState, Collision.getPlayerMoveCollisionableContainers(abstractState).concat(getAllModelQueues(state)))


    state = setAbstractState(state, abstractState)

    state = buildBloodDecalQueue(state, [getState, setState])


    return state
}

export let getHpWithDefault = (state, name) => {
    return NullableUtils.getWithDefault(getState(state).hpMap.get(name), 0)
}

export let getHp = (state, name) => {
    return NullableUtils.getWithDefault(getState(state).hpMap.get(name), 0)
}

export let updateHp = (state, name, hp) => {
    return setState(state, {
        ...getState(state),
        hpMap: getState(state).hpMap.set(name, hp)
    })
}

// let _getAllLevelInstancedSkinnedMeshes = (state, name): Array<InstancedSkinnedMesh> => {
// 	return _getModelLOD(state, name).getAllLevelInstancedMeshes()
// }

let _isStressing = (state, name, damage, damageType_: damageType) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    // let forceFactor = getForceFactor(getHp(state, name), damage, 0.1)
    let forceFactor = getForceFactor(getHp(state, name), damage, 0.025)

    const factor = 0.35


    let rate = NumberUtils.clamp(1 * forceFactor * damageTypeFactor * factor, 0, 1)
    // Console.log(rate)

    return Math.random() < rate
}

export let isControlled = (state: state, fromName, damage, damageType_: damageType, direction, stateMachine, box) => {
    if (isChangeToLieState(state, stateMachine, damageType_, direction)) {
        return true
    }

    // if (isLieState(stateMachine)) {
    if (isControlledState(state, stateMachine)) {
        return false
    }

    // if (Girl.isGirl(fromName)) {
    if (damageType_ == damageType.Direct) {
        return true
    }

    return _isStressing(state, stateMachine.name, damage, damageType_)
}

let _playLieAnimation = (state: state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex) => {
    state = setAbstractState(state, GPUSkin.playOnce(
        getAbstractState(state),
        (state) => {
            checkCurrentState(state, SoldierUtils.getStateMachine, name, objectStateName.Lie)

            if (NullableUtils.isNullable(queryOBBShapeCollisionWithBox(state, box, box.getCenter(_v1), false))) {
                return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createStandupState(
                    getIdleClipIndexFunc, getStandupClipIndexFunc(name)
                ), name, NullableUtils.getEmpty())
            }

            return _playLieAnimation(state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex)
        },
        name, clipIndex
    ))

    return Promise.resolve(state)
}

export let createLieState = ([getIdleClipIndexFunc, getStandupClipIndexFunc], clipIndex, box: Box3, matrix: Matrix4): fsm_state<state> => {
    let originBox = box.clone()

    return {
        name: objectStateName.Lie,
        enterFunc: (state: state, stateMachine) => {
            // if (!StateMachine.isPreviousState(stateMachine, objectStateName.Lie)) {
            changeStandBoxToLieBox(box)
            // }

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            return _playLieAnimation(state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex)
        },
        exitFunc: (state: state, stateMachine) => {
            box.copy(originBox)

            return Promise.resolve(state)
        },
    }
}

export let createStandupState = (getIdleClipIndexFunc, clipIndex,): fsm_state<state> => {
    return {
        name: objectStateName.Standup,
        enterFunc: (state: state, stateMachine) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            state = setAbstractState(state, GPUSkin.playOnce(
                getAbstractState(state),
                (state) => {
                    checkCurrentState(state, SoldierUtils.getStateMachine, name, objectStateName.Standup)

                    return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createInitialState(
                        getIdleClipIndexFunc
                    )(), name, NullableUtils.return_(name))
                },
                name, clipIndex
            ))

            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }

}

let _buildFallKey = (name) => `${name}_Fall`

export let createFallState = ([getControlledClipIndexFunc, getIdleClipIndexFunc, getStandupClipIndexFunc, getLieClipIndexFunc]): fsm_state<state> => {
    return {
        name: objectStateName.Fall,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [
            name, index, queue,
            shadowQueue,
            originTransform,
        ]) => {
            let api = getModAPI(state)

            let currentPoint = api.TransformUtils.getPositionFromMatrix4(queue.getTransform(index))

            let targetPoint = api.vector3.setY(api.vector3.clone(currentPoint), 0)

            let validTargetPoint = api.NullableUtils.getWithDefault(
                api.findValidPosition(state, targetPoint),
                targetPoint
            )

            // if (api.isNotInMovableRanges(state,usedGirl, validTargetPoint)) {
            //     validTargetPoint = api.vector3.create(0, 0, 0)
            // }

            state = api.handleCharacterExitControlled(state,
                name, index, currentPoint, queue,
                shadowQueue,
                originTransform
            )

            state = setAbstractState(state, GPUSkin.playLastFrame(
                getAbstractState(state),
                name, getControlledClipIndexFunc(name)
            ))


            return api.buildMultipleTweens(state, [(state, object, _) => {
                if (isFallState(SoldierUtils.getStateMachine(state, name))) {
                    return updateCharacterPosition(api, state, queue, shadowQueue, index, object)
                }

                return Promise.resolve(state)
            }, data => {
                return {
                    x: data.x,
                    y: data.y,
                    z: data.z
                }
            }, (state, _p, _n) => {
                return state
            }, (previousData, currentData) => {
                // return api.NumberUtils.clamp(api.vector3.distanceTo(currentData, previousData) / 50 * 1000, 500, 5000)
                return api.computeFallTime(api, previousData, currentData)
                // return 3000
            }], [
                currentPoint, validTargetPoint
            ]).then(d => {
                state = d[0]
                let lastTween = d[1]
                let allTweens = d[2]

                state = setTweensByKey(state, _buildFallKey(name), allTweens)

                api.NullableUtils.getExn(lastTween).onComplete(() => {
                    let state = api.readState()

                    // api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)
                    state = removeTweensByKey(state, _buildFallKey(name))

                    // if (isDestoryRelatedStates(SoldierUtils.getStateMachine(state, name))) {
                    if (!isFallState(SoldierUtils.getStateMachine(state, name))) {
                        return
                    }

                    return api.StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createLieState([
                        getIdleClipIndexFunc,
                        getStandupClipIndexFunc
                    ], getLieClipIndexFunc(name),
                        api.getBoxForPick(state, queue, index, name),
                        api.getLocalTransform(state, queue, index, name)
                        // api.NullableUtils.getExn(queue.getBox(index)),
                        // api.NullableUtils.getExn(queue.getTransform(index)),
                    ), name, api.NullableUtils.return_(name))
                        .then(state => {
                            api.writeState(state)
                        })
                })

                return state
            })
        },
        exitFunc: (state: state, stateMachine) => {
            state = removeTweensByKey(state, _buildFallKey(stateMachine.name))

            return Promise.resolve(state)
        }
    }
}

export let createSoldierControlledState = (getControlledClipIndexFunc, name) => (): fsm_state<state> => {
    return {
        name: name,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            // state = setAbstractState(state, GPUSkin.playLoop(
            //     getAbstractState(state),
            //     name, getControlledClipIndexFunc(name)
            // ))
            state = setAbstractState(state, GPUSkin.playLastFrame(
                getAbstractState(state),
                name, getControlledClipIndexFunc(name)
            ))


            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }
}

// let _computeVelocity = (api: api, currentPoint, direction, distance) => {
//     let targetPoint = api.vector3.add(
//         api.vector3.clone(currentPoint),
//         api.vector3.multiplyScalar(
//             api.vector3.clone(direction),
//             distance
//         )
//     )

//     return api.vector3.sub(targetPoint, currentPoint)
// }

// let _updateMoveCollision = (api: api) => (velocity, state: state, isJudgeGirl: boolean, isOnlyCollisionWithStatic: boolean, currentPoint) => {
//     if (isJudgeGirl || !isOnlyCollisionWithStatic) {
//         throw new Error("error")
//     }

//     let targetPoint = api.vector3.add(
//         api.vector3.clone(currentPoint),
//         velocity
//     )
//     if (
//         !api.PathFind.isWalkable(
//             api.vector2.create(api.vector3.getX(targetPoint), api.vector3.getZ(targetPoint)),
//             api.getGridForJudgeWalkable(state)
//         )
//     ) {
//         return api.vector3.set(
//             api.vector3.getTempVector1(),
//             0, 0, 0
//         )
//     }

//     return velocity
// }

// let _findTargetPoint = (api: api, state, currentPoint, direction, distance,
//     name, box
// ) => {
//     let velocity = api.computeMovableVelocity(state,
//         _updateMoveCollision(api),
//         _computeVelocity(api, currentPoint, direction, distance),
//         currentPoint,
//         box,
//         SoldierUtils.getStateMachine(state, name),
//         false, true)

//     return api.vector3.add(
//         api.vector3.clone(currentPoint), velocity)
// }

// export let createRepelState = (getIdleClipIndexFunc, getControlledClipIndexFunc,
//     getShadowQueueFunc
// ): fsm_state<state> => {
//     return {
//         name: objectStateName.Repel,
//         enterFunc: (state) => {
//             return Promise.resolve(state)
//         },
//         executeFunc: (state, [
//             // name, index, queue,
//             // shadowQueue,
//             // originTransform,

//             direction, distance, time,
//             [matrix, box, name]
//         ]) => {
//             let api = getModAPI(state)

//             let currentPoint = api.TransformUtils.getPositionFromMatrix4(matrix)

//             let validTargetPoint = _findTargetPoint(api, state, currentPoint, api.vector3.fromArray(api.vector3.createEmpty(), direction), distance, name, box)

//             let queue = api.LOD.getLODQueue(api.getAbstractState(state), name)
//             let index = queue.getIndex(name)

//             let shadowQueue = getShadowQueueFunc(state, name)

//             state = api.setAbstractState(state, api.GPUSkin.playLastFrame(
//                 api.getAbstractState(state),
//                 // (state) => {
//                 // },
//                 name, getControlledClipIndexFunc(name)
//             ))

//             return api.buildMultipleTweens(state, [(state, object, _) => {
//                 if (queue.isAlive(index)) {
//                     let pos = api.vector3.create(
//                         object.x,
//                         object.y,
//                         object.z,
//                     )
//                     queue.updatePosition(
//                         index, pos,
//                         true
//                     )

//                     updateShadow(shadowQueue, index, pos)
//                 }

//                 return Promise.resolve(state)
//             }, data => {
//                 return {
//                     x: data.x,
//                     y: data.y,
//                     z: data.z
//                 }
//             }, (state, _p, _n) => {
//                 return state
//             }, (previousData, currentData) => {
//                 // return api.NumberUtils.clamp(api.vector3.distanceTo(currentData, previousData) / 50 * 1000, 500, 5000)
//                 // return api.computeFallTime(api, previousData, currentData)
//                 // return 3000
//                 return time
//             }], [
//                 currentPoint, validTargetPoint
//             ]).then(d => {
//                 state = d[0]
//                 let lastTween = d[1]
//                 let allTweens = d[2]

//                 api.NullableUtils.getExn(lastTween).onComplete(() => {
//                     let state = api.readState()

//                     api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)

//                     if (api.isDestoryRelatedStates(SoldierUtils.getStateMachine(state, name))) {
//                         return
//                     }


//                     return api.StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createInitialState(
//                         getIdleClipIndexFunc
//                     )(), name, api.NullableUtils.return_(name)).then(state => {
//                         api.writeState(state)
//                     })
//                 })

//                 return state
//             })


//             // return Promise.resolve(state)
//         },
//         exitFunc: (state: state) => {
//             return Promise.resolve(state)
//         }
//     }
// }

export let damage = (
    [
        getShakeClipIndexFunc,
        getDeathClipIndexFunc,
        getIdleClipIndexFunc,
        getLieClipIndexFunc,
        getStandupClipIndexFunc,
        createInitialStateFunc,
        getValueFunc,
        handleDestroyedFunc = (state, name, position) => state
    ],
    // armyValue: armyValue
) => {
    return (state: state, forceData,
        weaponValue_,
        fromName, damagePosition,
        // critRatioFactor,
        // attackFactor,
        transforms, boxes, names) => {
        // requireCheck(() => {
        //     test("should only has one damage data", () => {
        //         return boxes.length == 1
        //     })
        // }, getIsDebug(state))

        let armyValue: armyValue = getValueFunc(state)

        return DamageUtils.damage(
            state, [
            getHp, updateHp,

            SoldierUtils.getStateMachine,
            SoldierUtils.setStateMachine,
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                if (isChangeToLieState(state, SoldierUtils.getStateMachine(state, name), damageType_, direction)) {
                    return createLieState([
                        getIdleClipIndexFunc,
                        getStandupClipIndexFunc
                    ], getLieClipIndexFunc(name), box, matrix)
                }

                return createStressingState([getShakeClipIndexFunc, SoldierUtils.getStateMachine, SoldierUtils.setStateMachine, createInitialStateFunc])
            },
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                return createDestroyingState([getDeathClipIndexFunc, getState, setState, SoldierUtils.getStateMachine, SoldierUtils.setStateMachine,
                    getModelQueueIndexNullable,
                    disposeData,
                    handleDestroying, (state, name, position) => {
                        return handleDestroyed(state, handleDestroyedFunc, fromName, name, position)
                    }],
                    weaponValue_,
                    // forceData[1][0]
                )
            },
            isControlled,
            addLabel
        ], forceData, weaponValue_, fromName,
            damagePosition,
            [
                armyValue.armorType,
                armyValue.armorRatio, armyValue.armorStrength,
                // critRatioFactor,
                // attackFactor,
            ],
            transforms, boxes, names,
        )
    }
}



let _getInitialEulerForMoveTween = () => {
    // return new Euler(0, -Math.PI / 2, 0)
    return NullableUtils.getEmpty()
}


let _hasMoveTween = (state, name) => {
    return getState(state).moveTweenMap.has(name)
}

let _getMoveTween = (state, name) => {
    return NullableUtils.getWithDefault(getState(state).moveTweenMap.get(name), [])
}

let _addMoveTweens = (state, name, tweens) => {
    return setState(state, {
        ...getState(state),
        moveTweenMap: getState(state).moveTweenMap.set(name,
            ArrayUtils.pushArrs(
                _getMoveTween(state, name),
                tweens
            )
        )
    })
}

export let stopAndRemoveMoveDataAndTweenSoldier = (state, name) => {
    ArticluatedAnimation.stopTweens(
        _getMoveTween(state, name)
    )
    ArticluatedAnimation.removeTweens(
        getAbstractState(state), _getMoveTween(state, name)
    )

    return setState(state, {
        ...getState(state),
        moveDataMap: getState(state).moveDataMap.remove(name),
        moveTweenMap: getState(state).moveTweenMap.remove(name),
    })
}

export let createMoveState = ([
    getRunClipIndexFunc,
    getShadowQueueFunc,
    createInitialStateFunc,
],
    value: armyValue,
    modelName
) => {
    return (state) => {
        return createMoveStateUtils([
            getModelQueueIndex,
            getModelQueue,
            (state, name) => {
                return setAbstractState(state, GPUSkin.playLoop(
                    getAbstractState(state),
                    name, getRunClipIndexFunc(name)
                ))
            },
            (state, _, lODQueueIndex, name, position) => {
                let shadowQueue = getShadowQueueFunc(state, name)

                updateShadow(shadowQueue, lODQueueIndex, position)

                return state
            },
            _addMoveTweens,
            _getInitialEulerForMoveTween,
            (state, name) => {
                return NullableUtils.getExn(getState(state).moveDataMap.get(name))
            },
            _setMoveData,
            SoldierUtils.getStateMachine,
            SoldierUtils.setStateMachine,
            createInitialStateFunc,
            _hasMoveTween,
            _getMoveTween,
            stopAndRemoveMoveDataAndTweenSoldier,
            (state, name, box) => {
                return isMaxArmySpeed() ? (100 as speed) : getMoveSpeed(state, name)
            }
        ],
            getInitialQuaternion(state, modelName).clone()
        )
    }
}

export let createInitialState = (
    getIdleClipIndexFunc
) => {
    return () => {
        return {
            name: objectStateName.Initial,
            enterFunc: (state) => Promise.resolve(state),
            executeFunc: (state, name) => {
                let clipIndex = getIdleClipIndexFunc(name)

                state = setAbstractState(state, GPUSkin.playLoop(
                    getAbstractState(state),
                    name, clipIndex
                ))

                return Promise.resolve(state)
            },
            exitFunc: (state: state) => Promise.resolve(state),
        }
    }
}


let _hasMoveData = (state, name) => {
    return getState(state).moveDataMap.has(name)
}

let _setMoveData = (state, name, moveData) => {
    return setState(state, {
        ...getState(state),
        moveDataMap: getState(state).moveDataMap.set(name, moveData)
    })
}

export let updateAI = (state: state, [
    createAttackStateFunc,
    createInitialStateFunc,
    createMoveStateFunc,
],
    queue,
    value: weaponValue) => {
    let {
        emitSpeed,
        emitterSpeed,
        emitterLife,
        meleeRange,
    } = value

    return updateAIUtils(state,
        [
            SoldierUtils.getStateMachine,
            SoldierUtils.setStateMachine,
            createAttackStateFunc,
            createInitialStateFunc,
            createMoveStateFunc,
            _hasMoveData,
            _setMoveData
        ],
        // getAllModelQueues(state).reduce((result, queue) => {
        queue.getValidData(getAbstractState(state)),
        emitSpeed,
        emitterLife,
        emitterSpeed,
        meleeRange
    )
}

// export let getCrowdData = (state: state): Array<Vector3> => {
//     return getCrowdDataUtils(state, getState(state).crowdPositions)
// }

// export let setCrowdData = (state: state, crowdPositions) => {
//     return setState(state, {
//         ...getState(state),
//         crowdPositions
//     })
// }

export let disposeData = (state: state, name: name) => {
    state = disposeStaticDynamicUnitData(state, name)


    state = setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.remove(name),
        // defenseFactorMap: getState(state).defenseFactorMap.remove(name),
        // moveSpeedMap: getState(state).moveSpeedMap.remove(name),
        // attackFactorMap: getState(state).attackFactorMap.remove(name),
        // emitSpeedFactorMap: getState(state).emitSpeedFactorMap.remove(name),
        // critRatioFactorMap: getState(state).critRatioFactorMap.remove(name),
        // missRatioMap: getState(state).missRatioMap.remove(name),
        hpMap: getState(state).hpMap.remove(name),
        lodQueueIndexMap: getState(state).lodQueueIndexMap.remove(name),
        moveTweenMap: getState(state).moveTweenMap.remove(name),
        shadowQueueMap: getState(state).shadowQueueMap.remove(name),
        moveDataMap: getState(state).moveDataMap.remove(name),
    })

    state = removePointingRange(state, name)

    return state
}

export let dispose = (state: state) => {
    getAllModelQueues(state).forEach(queue => {
        queue.dispose()
    })

    state = setState(state, {
        ...createState(),
    })

    return Promise.resolve(state)
}

export let getPickedTransform = (modelName) => getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPickTransformPrefix(),

    Math.PI / 2,
    // new Vector3(1, 0, 0),
    Math.PI / 2,
    // new Vector3(0, 1, 0),
    0,
    // new Vector3(0, 0, 1),
)

export let getUBControlledTransform = (modelName) => getGiantessUBControlledTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getUBControlledTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToBreastTransform = (modelName) => getGiantessPutToBreastTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPutToBreastTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToShoeTransform = (modelName) => getGiantessPutToShoeTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPutToShoeTransformPrefix(),

    -1.7,
    0,
    0,
)

// export let isCanPickup = (state: state, name: name) => {
//     let stateMachine = SoldierUtils.getStateMachine(state, name)

//     return (
//         !isFallState(stateMachine)
//         && !isRepelState(stateMachine)
//     )
// }

export let handlePickup = (state: state, createControlledStateFunc, name: name) => {
    state = removeShadow(state, name)

    return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createControlledStateFunc(), name, NullableUtils.getEmpty())
}

export let updateTransform = updateTransformUtils

// export let handlePickdown = (state: state, [
//     createInitialStateFunc,
//     getShadowQueueFunc
// ], name: name, index: lodQueueIndex, targetPoint, queue: LODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
//     return handlePickdownUtils(state,
//         (state, name) => {
//             return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createInitialStateFunc(), name, NullableUtils.return_(name))
//         },
//         name, index, targetPoint, queue, getShadowQueueFunc(state, name), originTransform
//     )
// }

export let handlePickdown = ([
    createInitialStateFunc,
    getShadowQueueFunc
]) => {
    return (state: state, name: name, index: lodQueueIndex, targetPoint, queue: LODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
        return handlePickdownUtils(state,
            (state, name) => {
                return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createInitialStateFunc(), name, NullableUtils.return_(name))
            },
            name, index, targetPoint, queue, NullableUtils.return_(getShadowQueueFunc(state, name)), originTransform
        )
    }
}

export let handleFall = (
    [
        getControlledClipIndexFunc,
        getIdleClipIndexFunc, getStandupClipIndexFunc, getLieClipIndexFunc,
        getShadowQueueFunc
    ]
) => {
    return (state: state, name: name, index, queue, originTransform, originBox): Promise<[state, boolean]> => {
        let stateMachine = SoldierUtils.getStateMachine(state, name)

        if (!isChangeToFallState(state, stateMachine)) {
            return Promise.resolve([state, false])
        }

        return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, stateMachine, createFallState(
            [getControlledClipIndexFunc, getIdleClipIndexFunc, getStandupClipIndexFunc, getLieClipIndexFunc]
        ), name, NullableUtils.return_([
            name, index, queue,
            NullableUtils.return_(getShadowQueueFunc(state, name)),
            originTransform,
            // originBox
        ]))
            .then(state => [state, true])
    }
}

export let handleRepel = (
    [
        getIdleClipIndexFunc, getControlledClipIndexFunc,
        getShadowQueueFunc
    ]
) => {
    // return (state,
    //     direction, distance, time,
    //     [matrix, box, name]
    // ): Promise<[state, boolean]> => {
    //     return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createRepelState(
    //         getIdleClipIndexFunc, getControlledClipIndexFunc,
    //         getShadowQueueFunc
    //     ), name, NullableUtils.return_([
    //         direction, distance, time,
    //         [matrix, box, name]
    //     ]))
    // }
    return handleRepelForCharacter([
        SoldierUtils.getStateMachine,
        SoldierUtils.setStateMachine,
        getIdleClipIndexFunc, getControlledClipIndexFunc,
        getShadowQueueFunc,
        getIdleClipIndexFunc => createInitialState(getIdleClipIndexFunc)()
    ])
}

export let handleUBControl = (state: state, createControlledStateFunc, name: name) => {
    return removePickData(state, name).then(state => {
        state = removeShadow(state, name)

        // state = clearTargetByName(state, name)

        return StateMachine.changeAndExecuteState(state, SoldierUtils.setStateMachine, SoldierUtils.getStateMachine(state, name), createControlledStateFunc(), name, NullableUtils.getEmpty())
    })
}

export let handlePutToBreast = handleUBControl

export let handlePutToShoe = handleUBControl


export let updateUBControlledTransform = updateTransformUtils

export let updatePutToBreastTransform = updateUBControlledTransform

export let updatePutToShoeTransform = updateUBControlledTransform


export let getLocalTransform = getLocalTransformUtils

export let getBoxForPick = getBoxForPickUtils

export let getInitialQuaternion = (state: state, modelName) => {
    return NullableUtils.getExn(getState(state).initialQuaternionMap.get(modelName))
}

let _buildShootDeferName = (name) => `${name}_sd`


export let shoot = (state: state,
    emitFunc,
    // bulletStartLocalPosition,
    armyValue: armyValue,
    // emitSpeed: emitSpeed,
    weaponValue: weaponValue,
    initialQuaternion,

    name, clipIndex,
    idleClipIndex,
    lodQueue, lODQueueAndShadowLODQueueIndex) => {
    if (!StateMachine.isState(SoldierUtils.getStateMachine(state, name), objectStateName.Attack)
        // || getAttackTargetExn(state, name) == attackTarget.None
    ) {
        return state
    }

    let matrix = lodQueue.getTransform(lODQueueAndShadowLODQueueIndex)

    let soldierPosition = TransformUtils.getPositionFromMatrix4(matrix)
    let soldierScale = TransformUtils.getScaleFromMatrix4(matrix)
    // let targetPosition = getGirlPositionParrelToArmy(state, soldierPosition.y, getRandomCollisionPart())

    let [targetPosition, targetPart] = getTargetDataForSoldier(state, name, soldierPosition)
    if (NullableUtils.isNullable(targetPosition)) {
        return state
    }
    targetPosition = NullableUtils.getExn(targetPosition)

    let lookatQuaternion = TransformUtils.getLookatQuaternion(
        soldierPosition,
        targetPosition
    )

    TransformUtils.setQuaternionToMatrix4(matrix,
        initialQuaternion.clone().premultiply(
            lookatQuaternion
        )
    )

    let {
        emitSpeed,
    } = weaponValue


    let remainAttackFrames = computeRemainAttackFrames(state, name, emitSpeed)
    if (isCanNotAttackByCD(remainAttackFrames)) {
        state = setAbstractState(state, GPUSkin.playLoop(
            getAbstractState(state),
            name, idleClipIndex
        ))

        return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
            return Promise.resolve(shoot(state,
                emitFunc,

                armyValue,
                weaponValue,
                initialQuaternion,

                name,
                clipIndex,
                idleClipIndex,
                lodQueue, lODQueueAndShadowLODQueueIndex))
        }, remainAttackFrames, _buildShootDeferName(name)))
    }



    let newArmyValue = getArmyValueForAttack(state, armyValue, soldierPosition)
    // Console.log(armyValue)
    // Console.log(newArmyValue)

    // let bulletStartWorldPosition = getBulletStartLocalPositionFunc(soldierScale)
    //     .applyQuaternion(lookatQuaternion)
    //     .add(
    //         soldierPosition
    //     )

    state = emitFunc(state,
        // bulletStartWorldPosition,
        targetPosition,
        targetPart,
        lookatQuaternion,
        soldierPosition,
        soldierScale,
        newArmyValue,
        weaponValue,
    )


    state = setAbstractState(state, GPUSkin.playOnce(
        getAbstractState(state),
        (state) => {
            state = setAbstractState(state, GPUSkin.playLastFrame(getAbstractState(state), name, clipIndex))

            state = setLastAttackFrame(state, name, Flow.getFrameIndex(getAbstractState(state)))

            state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                return Promise.resolve(shoot(state,
                    emitFunc,

                    armyValue,
                    weaponValue,
                    initialQuaternion,

                    name, clipIndex, idleClipIndex, lodQueue, lODQueueAndShadowLODQueueIndex))
            }, computeAttackFrames(state, name, emitSpeed), _buildShootDeferName(name)))

            return Promise.resolve(state)
        },
        name, clipIndex
    ))

    return state
}

let _clearShoot = (state: state, name) => {
    return setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildShootDeferName(name)))
}

export let parseAllWeaponModels = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getRocketResourceId()), Render.getRenderer(getAbstractState(state))).then(rocket => {
        return rocket.scene.children[0] as Mesh
    })
    // .then(rocket => {
    //     return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getLasererResourceId()), Render.getRenderer(getAbstractState(state))).then(laser => {
    //         return laser.scene.children[0] as Mesh
    //     }).then(laser => {
    //         return [rocket, laser]
    //     })
    // })
}

export let getBulletStartLocalPositionFunc = (
    getBulletStartLocalPositionFunc,
    lookatQuaternion,
    soldierPosition,
    soldierScale,
) => {
    return getBulletStartLocalPositionFunc(soldierScale)
        .applyQuaternion(lookatQuaternion)
        .add(
            soldierPosition
        )
}

export let exitFuncForCreateShootState = (state: state, stateMachine) => {
    let name = stateMachine.name

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), name))

    state = _clearShoot(state, name)

    return Promise.resolve(state)
}

export let getBloodDecalQueue = (state: state) => {
    return getState(state).bloodData.bloodDecalQueue
}

export let getDeathClipIndex = (deathClipIndex, deathHeadshotClipIndex, lieClipIndex) => {
    return (name, damageType_: damageType, stateMachine: stateMachine<state>) => {
        if (
            StateMachine.isPreviousState(stateMachine, objectStateName.Lie)
            || StateMachine.isPreviousState(stateMachine, objectStateName.Standup)
        ) {
            return lieClipIndex
        }

        switch (damageType_) {
            case damageType.Weakness:
                return deathHeadshotClipIndex
            default:
                return deathClipIndex
        }
    }
}
