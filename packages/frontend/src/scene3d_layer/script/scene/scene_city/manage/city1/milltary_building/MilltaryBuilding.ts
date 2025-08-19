// import { Map } from "immutable"
// import { milltaryBuilding } from "../../../type/StateType"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { attackTarget, camp, milltaryBuilding, objectStateName } from "../../../type/StateType"
import { Euler, EulerOrder, Matrix4, Mesh, Quaternion, Vector2, Vector3 } from "three"
import { Map } from "immutable"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { fsm_state, lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { clearTween } from "../../../utils/TweenUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getCollisionPartCenter, getCollisionPartOBB } from "../../../girl/Collision"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getForceFactor, getGirlPosition, getPositionParrelToObj, getWeaponTypeFactor } from "../../../girl/Utils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { armyValue, milltaryValue, weaponType, weaponValue } from "../../../data/ValueType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { getMissileVehicleMissileResourceId } from "../../../army_data/MilltaryVehicleData"
import { Render } from "meta3d-jiehuo-abstract"
import { Collision } from "meta3d-jiehuo-abstract"
import { speed } from "../../../data/DataType"
import { isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { Event } from "meta3d-jiehuo-abstract"
import { buildDestroyedEventData, getDestroyedEventName } from "../../../utils/EventUtils"
import { buildStatus } from "../../../utils/LODContainerUtils"

import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../../Scene"
import { getVolume } from "../../../utils/SoundUtils"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { updateAI as updateAIUtils, createMoveState as createMoveStateUtils, updateTurretAI, createDestroyingState, getRandomCollisionPartCanAttack, getLittleManPositionParrelToArmy, getTargetBox, getTargetPart, getTargetPositionParrelToArmy, addLabel, } from "../../../utils/ArmyUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils, updateHierachyLODQueueTransform } from "../../../girl/PickPoseUtils"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGrid } from "../PathFind"
import { playStressingAnimation } from "../../../utils/CarUtils"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import * as DamageUtils from "../../../utils/DamageUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import * as MilltaryVehicle from "../milltary_vehicle/MilltaryVehicle"
import { getModelData } from "../../../army_data/MilltaryBuildingData"
import { generateVehicleCrowd } from "../WholeScene"
import { Scene } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { getAttackTarget, setAttackTarget, setCamp } from "../Army"
import * as LittleManTransform from "../../../little_man/Transform"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let createState = (): milltaryBuilding => {
    return {
        milltaryBuildingMap: Map(),

        stateMachineMap: Map(),
        defenseFactorMap: Map(),
        hpMap: Map(),

        lodQueueIndexMap: Map(),

        fireTweenMap: Map(),

        allQueueLocalMatricesMap: Map(),

        turretPositionMap: Map(),

        initialQuaternionMap: Map(),
    }
}

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).milltaryBuilding)
}

export let setState = (state: state, value: milltaryBuilding) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        milltaryBuilding: NullableUtils.return_(value)
    })
}


export let getNamePrefix = () => "millaryBuild#"

export let isMilltaryBuilding = (name: string) => {
    return name.includes(getNamePrefix())
}


export let getInitialQuaternion = (state: state, modelName) => {
    return NullableUtils.getExn(getState(state).initialQuaternionMap.get(modelName))
}

export let getAllQueueLocalMatrices = (state: state, categoryName) => {
    return NullableUtils.getExn(getState(state).allQueueLocalMatricesMap.get(categoryName))
}

export let setAllQueueLocalMatrices = (state: state, categoryName, allQueueLocalMatrices) => {
    return setState(state, {
        ...getState(state),
        allQueueLocalMatricesMap: getState(state).allQueueLocalMatricesMap.set(categoryName, allQueueLocalMatrices)
    })
}

export let getStateMachine = (state: state, name: string) => {
    return NullableUtils.getExn(getState(state).stateMachineMap.get(name))
}

export let setStateMachine = (state: state, name: string, stateMachine) => {
    return setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.set(name, stateMachine)
    })
}

export let getTurretPosition = (state: state, categoryName): Array<Vector3> => {
    return NullableUtils.getExn(getState(state).turretPositionMap.get(categoryName))
}

export let setTurretPosition = (state: state, categoryName, positions) => {
    return setState(state, {
        ...getState(state),
        turretPositionMap: getState(state).turretPositionMap.set(categoryName, positions)
    })
}

let _getAllModelAllQueues = (state: state): Array<HierachyLODQueue> => {
    return ArrayUtils.flatten(getState(state).milltaryBuildingMap.valueSeq().toArray().map(hierachyLODQueueData => {
        return hierachyLODQueueData.valueSeq().toArray()
    }))
}


export let dispose = (state: state) => {
    _getAllModelAllQueues(state).forEach(queue => {
        // queues.forEach(queue => {
        queue.dispose()
        // })
    })

    state = setState(state, {
        ...createState(),
    })

    return Promise.resolve(state)
}

export let getModelQueueIndex = (state: state, name) => {
    return NullableUtils.getExn(getState(state).lodQueueIndexMap.get(name))
}


let _hasFireTween = (state, name) => {
    return getState(state).fireTweenMap.has(name)
}

let _getFireTween = (state, name) => {
    return NullableUtils.getWithDefault(getState(state).fireTweenMap.get(name), [])
}

export let addFireTween = (state, name, tween) => {
    return setState(state, {
        ...getState(state),
        fireTweenMap: getState(state).fireTweenMap.set(name,
            ArrayUtils.push(
                _getFireTween(state, name),
                tween
            )
        )
    })
}

export let addFireTweens = (state, name, tweens) => {
    return setState(state, {
        ...getState(state),
        fireTweenMap: getState(state).fireTweenMap.set(name,
            ArrayUtils.pushArrs(
                _getFireTween(state, name),
                tweens
            )
        )
    })
}

let _removeFireTween = (state: state, name) => {
    ArticluatedAnimation.removeTweens(getAbstractState(state), _getFireTween(state, name))

    return setState(state, {
        ...getState(state),
        fireTweenMap: getState(state).fireTweenMap.remove(name)
    })
}

export let isRoughTowardsTarget = (state, buildRoughFireRayFunc, allModelQueues, lODQueueIndex, targetBox) => {
    // let position = _getTurretForwardPointPosition(bodyQueue, missileQueue, lODQueueIndex)
    // let _ = addBox3Helper(getAbstractState(state), getCurrentScene(getAbstractState(state)), new Box3().setFromCenterAndSize(position, new Vector3(5, 5, 5)), 0xffff00)

    return buildRoughFireRayFunc(allModelQueues, lODQueueIndex).intersectsBox(
        targetBox
    )
}

export let buildTurretTween = MilltaryVehicle.buildTurretTween

export let fire = (state: state, [
    buildRoughFireRayFunc,
    rotateTowardsTargetFunc,
    fireShellFunc,
    // getRandomCollisionPartFunc
    getBodyQueueFunc,
    getWeaponValueFunc
], name, allModelQueues, lODQueueIndex, targetPart, isNotRotateTowardsTarget = false) => {
    // let isRotateTowardsTarget = isNotRotateTowardsTarget ? false : !isRoughTowardsTarget(state,
    //     buildRoughFireRayFunc,
    //     allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))

    // Console.log("fire:", isRotateTowardsTarget, isNotRotateTowardsTarget)

    // if (isRotateTowardsTarget) {
    if (!isNotRotateTowardsTarget && !isRoughTowardsTarget(state,
        buildRoughFireRayFunc,
        allModelQueues, lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
        return rotateTowardsTargetFunc(state, [(state, targetPart) => {
            state = fireShellFunc(state,
                // [
                //     fire,
                //     buildRoughFireRayFunc,
                //     rotateTowardsTargetFunc,
                //     fireShellFunc,
                // ],
                name, allModelQueues, lODQueueIndex, targetPart)

            return Promise.resolve(state)
        }, (state) => {
            state = fire(state,
                [
                    buildRoughFireRayFunc,
                    rotateTowardsTargetFunc,
                    fireShellFunc,
                    // getRandomCollisionPartFunc,
                    getBodyQueueFunc,
                    getWeaponValueFunc
                ],
                name, allModelQueues, lODQueueIndex,

                getRandomCollisionPartCanAttack(state,
                    name,
                    getWeaponValueFunc(state), getBodyQueueFunc(state),
                    lODQueueIndex),

                isNotRotateTowardsTarget
            )

            return Promise.resolve(state)
        }], name, allModelQueues, lODQueueIndex, targetPart)
    }

    return fireShellFunc(state,
        // [
        //     fire,
        //     buildRoughFireRayFunc,
        //     rotateTowardsTargetFunc,
        //     fireShellFunc,
        // ],
        name, allModelQueues, lODQueueIndex, targetPart)
    // return Promise.resolve(state)
}

export let createFireState = ([
    getModelAllQueuesFunc,
    buildRoughFireRayFunc,
    rotateTowardsTargetFunc,
    fireShellFunc,
    // getRandomCollisionPartFunc,
    getBodyQueueFunc,
    getWeaponValueFunc
],
    isNotRotateTowardsTarget = false
) => {
    return (): fsm_state<state> => {
        return {
            name: objectStateName.Attack,
            enterFunc: (state) => Promise.resolve(state),
            executeFunc: (state, name) => {
                let lODQueueIndex = getModelQueueIndex(state, name)

                let targetPart = getTargetPart(state, getBodyQueueFunc, getWeaponValueFunc, name, lODQueueIndex)

                state = fire(state,
                    [buildRoughFireRayFunc,
                        rotateTowardsTargetFunc,
                        fireShellFunc,
                        getBodyQueueFunc,
                        getWeaponValueFunc
                    ],
                    name, getModelAllQueuesFunc(state), lODQueueIndex, targetPart,
                    isNotRotateTowardsTarget
                )

                return Promise.resolve(state)
            },
            exitFunc: (state: state, stateMachine) => {
                let name = stateMachine.name

                state = clearTween(state, [
                    _hasFireTween,
                    _getFireTween,
                    _removeFireTween
                ], name)

                state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), name))

                return Promise.resolve(state)
            }
        }
    }
}

export let getBodyPosition = (bodyQueue, lODQueueIndex) => {
    let worldMatrix = bodyQueue.getWorldMatrix(lODQueueIndex)

    return TransformUtils.getPositionFromMatrix4(worldMatrix)
}

// export let buildBodyTween = (state, [
//     buildRoughFireRayFunc,
//     onFuncs,
// ], [bodyQueue, headQueue], allModelQueues, lODQueueIndex, targetPart,
//     value: armyValue & milltaryValue,
// ) => {
//     let turretPosition = getBodyPosition(headQueue, lODQueueIndex)

//     let targetPosition = getPositionParrelToObj(getCollisionPartCenter(state, targetPart), turretPosition.y)

//     let { emitPrecision } = getArmyValueForAttack(state, value, turretPosition)

//     let turretLookatQuaternion = TransformUtils.getLookatQuaternion(
//         turretPosition,
//         (targetPosition.clone().add(_v1.set(
//             emitPrecision * NumberUtils.getRandomValue1(),
//             0,
//             emitPrecision * NumberUtils.getRandomValue1(),
//         ))),
//     )

//     let turretTransform = headQueue.transforms[lODQueueIndex].clone()


//     /*! refer to:https://stackoverflow.com/questions/46172742/gimbal-lock-at-y-axis-90-degrees
//     * 
//     */
//     let eulerOrderToSolveGimbalLock: EulerOrder = 'YXZ'

//     let turretEuler = TransformUtils.getRotationEulerFromMatrix4(turretTransform, eulerOrderToSolveGimbalLock)
//     // if (turretEuler.x !== 0 || turretEuler.z !== 0) {
//     //     throw new Error("err")
//     // }


//     let bodyWorldTransform = bodyQueue.getWorldMatrix(lODQueueIndex).clone()

//     let turretWorldTransform = headQueue.getWorldMatrix(lODQueueIndex).clone()
//     let turretLookatWorldMatrix = TransformUtils.setQuaternionToMatrix4(
//         turretWorldTransform,
//         turretLookatQuaternion
//     )
//     let turretLookatLocalMatrix = bodyWorldTransform.clone().invert().multiply(
//         turretLookatWorldMatrix
//     )


//     let turretNeedRotateEuler = TransformUtils.getRotationEulerFromMatrix4(turretLookatLocalMatrix, eulerOrderToSolveGimbalLock)



//     let object = {
//         y: turretEuler.y,
//     }
//     let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
//         .to({
//             y: turretNeedRotateEuler.y,
//         }, Math.abs(turretNeedRotateEuler.y - turretEuler.y) * 1000 * value.rotateSpeed)
//         .onUpdate(() => {
//             let state = readState()

//             if (isRoughTowardsTarget(state,
//                 buildRoughFireRayFunc,
//                 allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))) {
//                 return tween.end()
//             }


//             headQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//                 turretTransform,
//                 _q.setFromEuler(_e.set(
//                     0,
//                     object.y,
//                     0,
//                     eulerOrderToSolveGimbalLock
//                 ))
//             )

//             state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

//             writeState(state)

//             return Promise.resolve()
//         })
//         .onComplete(() => {
//             let state = readState()

//             ArticluatedAnimation.removeTween(getAbstractState(state), tween)

//             NullableUtils.forEach(([onCompleteFunc, onFailFunc]) => {
//                 if (!isRoughTowardsTarget(state,
//                     buildRoughFireRayFunc,
//                     allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))) {
//                     return onFailFunc(state).then(writeState)
//                 }

//                 return onCompleteFunc(state, targetPart).then(writeState)
//             }, onFuncs)

//             return Promise.resolve()
//         })

//     return tween
// }

// export let parseAllWeaponModels = (state: state) => {
//     return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getMissileVehicleMissileResourceId()), Render.getRenderer(getAbstractState(state))).then(missileVehicleMissile => {
//         return missileVehicleMissile.scene.children[0] as Mesh
//     })
// }

export let setData = (state: state, categoryName, queue: HierachyLODQueue) => {
    return setState(state, {
        ...getState(state),
        milltaryBuildingMap: getState(state).milltaryBuildingMap.set(categoryName, NullableUtils.getWithDefault(
            getState(state).milltaryBuildingMap.get(categoryName),
            Map()
        ).set(queue.name, queue)
        ),
    })
}

export let getModelQueueByQueueName = (state: state, categoryName, queueName: string) => {
    return NullableUtils.getExn(NullableUtils.getExn(getState(state).milltaryBuildingMap.get(categoryName)).get(queueName))
}

export let getDefenseFactor = (state, name) => {
    return NullableUtils.getExn(getState(state).defenseFactorMap.get(name))
}

export let getHp = (state, name) => {
    return NullableUtils.getExn(getState(state).hpMap.get(name))
}

export let updateHp = (state, name, hp) => {
    return setState(state, {
        ...getState(state),
        hpMap: getState(state).hpMap.set(name, hp)
    })
}

export let isStressingByRate = (state: state, damage, weaponType_: weaponType) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_) * 0.8

    let forceFactor = getForceFactor(damage) * 0.8

    const factor = 0.2


    let rate = NumberUtils.clamp(1 * forceFactor * weaponTypeFactor * factor, 0, 1)

    return Math.random() < rate
}

export let damage = (state: state,
    [
        getBodyQueueFunc,
        getFullHpFunc,
        setStatusFunc,
        emitBodyExplodeFunc,
        getModelAllQueuesFunc,
        buildRoughFireRayFunc,
        rotateTowardsTargetFunc,
        fireShellFunc,
        getWeaponValueFunc
    ],
    soundResourceId, value,

    forceData, fromName, damagePosition, transforms, boxes, names) => {
    return DamageUtils.damage(
        state, [
        getDefenseFactor, getHp, updateHp,

        getStateMachine,
        setStateMachine,
        createStressingState(
            [
                getBodyQueueFunc,
                getFullHpFunc,
                getModelAllQueuesFunc,
                buildRoughFireRayFunc,
                rotateTowardsTargetFunc,
                fireShellFunc,
                getWeaponValueFunc,
            ]
        ),
        createDestroyingState([
            setStatusFunc,
            emitBodyExplodeFunc,
            getModelQueueIndex,
            getStateMachine,
            setStateMachine,
        ],
            soundResourceId, value
        ),
        isStressingByRate,
        addLabel
    ], forceData, fromName, damagePosition, transforms, boxes, names,
    )
}

export let initialAttributes = (state, [getValueFunc, getFullHpFunc], name, index) => {
    return setState(state, {
        ...getState(state),
        lodQueueIndexMap: getState(state).lodQueueIndexMap.set(name, index),
        stateMachineMap: getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
        // stateMachineMap: getState(state).stateMachineMap.set(name, StateMachine.create(name, createFireState())),
        defenseFactorMap: getState(state).defenseFactorMap.set(name, getValueFunc(state).defenseFactor),
        hpMap: getState(state).hpMap.set(name, getFullHpFunc(name)),
    })
}

export let createInitialState = (): fsm_state<state> => {
    return {
        name: objectStateName.Initial,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, name) => {
            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createControlledState = (): fsm_state<state> => {
    return {
        name: objectStateName.Controlled,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => Promise.resolve(state),
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }
}


export let emitBodyExplode = (state: state, position) => {
    state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
        speed: 0.1,
        life: 3000,
        size: 20,
        position: [position[0], position[1] - 1.5, position[2]]
    }))
    state = setAbstractState(state, ParticleManager.emitShellEmitOrExplode(getAbstractState(state), {
        speed: 1,
        life: 1500,
        size: 40,
        position: position
    }))

    return state
}

export let createStressingState = (
    [
        getBodyQueueFunc,
        getFullHpFunc,

        getModelAllQueuesFunc,
        buildRoughFireRayFunc,
        rotateTowardsTargetFunc,
        fireShellFunc,
        getWeaponValueFunc,
    ]
) => {
    return (): fsm_state<state> => {
        return {
            name: objectStateName.Stressing,
            enterFunc: (state) => Promise.resolve(state),
            executeFunc: (state, [
                _,
                [matrix, box, name, damage], direction
            ]: any) => {
                let lODQueueIndex = getModelQueueIndex(state, name)

                let stateMachine = getStateMachine(state, name)

                if (!StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)) {
                    let bodyQueueName = getBodyQueueFunc(state).name

                    return Promise.resolve(playStressingAnimation(state, [getFullHpFunc, (object, matrix) => {
                        updatePositionTween(matrix, object)

                        LOD.markNeedsUpdate(getAbstractState(state),
                            bodyQueueName,
                            lODQueueIndex, true)
                    }, (_, matrix) => {
                        return getTransformData(matrix)
                    },
                        getStateMachine,
                        setStateMachine,
                        createFireState(
                            [
                                getModelAllQueuesFunc,
                                buildRoughFireRayFunc,
                                rotateTowardsTargetFunc,
                                fireShellFunc,
                                // getRandomCollisionPartFunc,
                                getBodyQueueFunc,
                                getWeaponValueFunc
                            ]
                        )
                    ], [matrix, box, name, damage]))
                }

                return StateMachine.changeAndExecuteState(state, setStateMachine, stateMachine, createControlledState(), name, NullableUtils.getEmpty())
            },
            exitFunc: (state: state) => Promise.resolve(state),
        }
    }
}

// export let createDestroyedState = (setStatusFunc) => {
//     return (): fsm_state<state> => {
//         return {
//             name: objectStateName.Destroyed,
//             enterFunc: (state) => Promise.resolve(state),
//             executeFunc: (state,
//                 [
//                     fromName,
//                     name,
//                 ]
//             ) => {
//                 return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
//                     let lODQueueIndex = getModelQueueIndex(state, name)

//                     state = setStatusFunc(state, buildStatus(false, false, false), lODQueueIndex)

//                     return state
//                 })
//             },
//             exitFunc: (state: state) => Promise.resolve(state),
//         }
//     }
// }

// export let createDestroyingState = ([setStatusFunc,
//     emitBodyExplodeFunc
// ], soundResourceId, value: milltaryValue) => {
//     return (): fsm_state<state> => {
//         return {
//             name: objectStateName.Destroying,
//             enterFunc: (state) => Promise.resolve(state),
//             executeFunc: (state, [
//                 fromName,
//                 [matrix, box, name, damage], forceDirection
//             ]: any) => {
//                 let lODQueueIndex = getModelQueueIndex(state, name)

//                 state = setStatusFunc(state, buildStatus(false, false, true), lODQueueIndex)



//                 let stateMachine = getStateMachine(state, name)

//                 let worldMatrix
//                 if (StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)) {
//                     let d = getParentTransform(state)
//                     state = d[0]
//                     let parentTransform = d[1]

//                     worldMatrix = _m.multiplyMatrices(
//                         parentTransform, matrix
//                     )
//                 }
//                 else {
//                     worldMatrix = matrix
//                 }

//                 let point = TransformUtils.getPositionFromMatrix4(worldMatrix)


//                 state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//                     SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, value.emitterVolume,
//                         point, 0
//                     ))
//                 ))


//                 state = emitBodyExplodeFunc(state, point.toArray())



//                 return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createDestroyedState(setStatusFunc)(), name, [
//                     fromName,
//                     name
//                 ])
//             },
//             exitFunc: (state: state) => Promise.resolve(state),
//         }
//     }
// }

export let updateAI = (state: state,
    createAttackStateFunc,
    bodyQueue,
    value: weaponValue) => {
    let {
        emitterSpeed,
        emitterLife,
        meleeRange,
    } = value

    return updateTurretAI(state,
        [
            getStateMachine,
            setStateMachine,
            createAttackStateFunc,
            createInitialState,
        ],
        bodyQueue.getValidData(getAbstractState(state)),
        emitterLife,
        emitterSpeed,
    )
}

export let getPickedTransform = (modelName) => getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPickTransformPrefix(),

    new Vector3(-0.1, -0.3, 0),
    -1.6, -0.6, 1.5,
)

export let handlePickup = (state: state, name: name) => {
    return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createControlledState(), name, NullableUtils.getEmpty())
}

export let updateTransform = updateHierachyLODQueueTransform

export let handlePickdown = (getMissileVehicleBodyQueueFunc) => {
    return (state: state, name: name, index: lodQueueIndex, targetPoint, queue: HierachyLODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
        let validTargetPoint = PathFind.findValidPosition(
            new Vector2(targetPoint.x, targetPoint.z),
            getGrid(state),
            getIsDebug(state)
        )

        if (NullableUtils.isNullable(validTargetPoint)) {
            return Promise.resolve([state, false])
        }

        validTargetPoint = NullableUtils.getExn(validTargetPoint)

        let bodyQueue = getMissileVehicleBodyQueueFunc(state)

        LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, index, true)

        bodyQueue.transforms[index].copy(
            TransformUtils.setPositionToMatrix4(
                originTransform.clone(),
                validTargetPoint
            )
        )

        return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, NullableUtils.return_(name)).then(state => [state, true])
    }
}

export let getLocalTransform = getLocalTransformUtils

export let getBoxForPick = getBoxForPickUtils



export let generateTurrets = (state: state,
    [
        buildTurretNamePrefixFunc,
        initialAttributesFunc
    ],
    modelAllQueues,
    positions,
    modelName, categoryName, bodyQueue, camp_ = camp.LittleMan, attackTarget_ = attackTarget.Giantess) => {
    let modelData = getModelData(state, modelName)

    let initialTransform = new Matrix4().compose(
        new Vector3(0, 0, 0),
        getInitialQuaternion(state, modelName).clone(),
        new Vector3().setScalar(modelData.scalar)
    )

    // let positionData = getTurretPosition(state, categoryName).map(position => {
    let positionData = positions.map(position => {
        return {
            name: "",
            position,
            userData: null
        }
    })


    return _generateMilltaryBuildings(state,
        [
            (state,
                initialTransform,
                crowds,
                crowdCount,
                queue,
            ) => {
                return generateVehicleCrowd(
                    state,
                    [
                        buildTurretNamePrefixFunc,
                        initialAttributesFunc,
                    ],
                    modelAllQueues,
                    getAllQueueLocalMatrices(state, categoryName),
                    initialTransform,
                    crowds,
                    crowdCount
                )
            },
            (state, index, newPos) => {
                state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, index, true))

                let name = bodyQueue.names[index]

                state = setCamp(state, name, camp_)
                state = setAttackTarget(state, name, attackTarget_)

                return state
            },
            getStateMachine
        ],
        bodyQueue,
        initialTransform,
        positionData,
    )
}

export let buildBodyTween = (state, [
    onFuncs,
    buildRoughFireRayFunc
],
    name,
    value: armyValue,
    bodyQueue, allModelQueues, lODQueueIndex, targetPart) => {
    let bodyTransform = bodyQueue.transforms[lODQueueIndex]

    let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyTransform)


    let targetPosition = getTargetPositionParrelToArmy(state, name, bodyPosition.y, targetPart)

    let { emitPrecision, rotateSpeed } = getArmyValueForAttack(state, value, bodyPosition) as any

    let eulerOrder: EulerOrder = 'YXZ'

    let bodyLookatEuler = TransformUtils.getLookatEuler(
        bodyPosition,
        (targetPosition.clone().add(_v1.set(
            emitPrecision * NumberUtils.getRandomValue1(),
            0,
            emitPrecision * NumberUtils.getRandomValue1(),
        ))),
        eulerOrder
    )
    // let bodyLookatQuaternion = new Quaternion(0, 0, 0, 1).setFromEuler(_e.set(-90 / 180 * Math.PI, 0, 0,
    //     'YXZ'
    // )).premultiply(
    //     TransformUtils.getLookatQuaternion(
    //         bodyPosition,
    //         (targetPosition.clone().add(_v1.set(
    //             emitPrecision * NumberUtils.getRandomValue1(),
    //             0,
    //             emitPrecision * NumberUtils.getRandomValue1(),
    //         ))),
    //     )
    // )
    // let bodyLookatEuler = new Euler().setFromQuaternion(bodyLookatQuaternion, 'YXZ')

    // let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()


    let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform,
        eulerOrder
    )
    // if (bodyEuler.x !== 0 || bodyEuler.z !== 0) {
    // 	throw new Error("err")
    // }


    // // Console.log(
    // // 	"data:",
    // // 	bodyLookatEuler.y,
    // // 	bodyEuler.z,
    // // 	lODQueueIndex,
    // // 	bodyPosition,
    // // )


    // let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()
    // let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform)

    // bodyLookatEuler.set(bodyLookatEuler.x, bodyLookatEuler.y - bodyEuler.z, bodyLookatEuler.z)



    // bodyLookatEuler = _fixGimbalLock(bodyLookatEuler, bodyEuler)



    // bodyQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
    //     bodyTransform,
    //     new Quaternion(-0.707, 0, 0, 0.707)
    //         .premultiply(
    //             _q.setFromEuler(_e.set(
    //                 0,
    //                 // 0,
    //                 bodyLookatEuler.y,
    //                 0,
    //                 'YXZ'
    //             ))
    //         )
    // )

    // state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))


    let object = {
        // x: 0,
        // y: bodyEuler.z,
        y: bodyEuler.y,
        // z: 0,
    }
    let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
        .to({
            y: bodyLookatEuler.y,
        }, Math.abs(bodyLookatEuler.y - bodyEuler.y) * 1000 * rotateSpeed)
        .onUpdate(() => {
            let state = readState()

            if (isRoughTowardsTarget(state,
                buildRoughFireRayFunc,
                allModelQueues, lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
                return tween.end()
            }

            bodyQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
                bodyTransform,
                // new Quaternion(0, 0, 0, 1).setFromEuler(_e.set(-90 / 180 * Math.PI, 0, 0,
                //     // 'YXZ'
                // ))
                // new Quaternion(-0.707, 0, 0, 0.707)
                //     .premultiply(
                //         _q.setFromEuler(_e.set(
                //             0,
                //             // 0,
                //             object.y,
                //             0,
                //             'YXZ'
                //         ))
                //     )
                _q.setFromEuler(_e.set(
                    0,
                    object.y,
                    0,
                    eulerOrder
                ))
            )

            state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

            writeState(state)

            return Promise.resolve()
        })
        .onComplete(() => {
            let state = readState()

            ArticluatedAnimation.removeTween(getAbstractState(state), tween)

            NullableUtils.forEach(([onCompleteFunc, onFailFunc]) => {
                if (!NumberUtils.isNearlyEqual(
                    bodyEuler.y,
                    bodyLookatEuler.y,
                    2
                ) && !isRoughTowardsTarget(state,
                    buildRoughFireRayFunc,
                    allModelQueues,
                    lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
                    return onFailFunc(state).then(writeState)
                }

                return onCompleteFunc(state, targetPart).then(writeState)
            }, onFuncs)

            return Promise.resolve()
        })

    return tween
}

let _generateMilltaryBuildings = (state: state,
    [
        generateCrowdFunc,
        handleAfterUpdatePositionFunc,
        getStateMachineFunc
    ],
    queue: LODQueue,
    initialTransform,
    positionData,
    // [
    // 	maxVisibleCount,
    // 	crowdCount,
    // 	offsetFactor,
    // ]
): Promise<[state, Array<name>]> => {
    let data = generateCrowdFunc(state,
        initialTransform,
        positionData,
        1,
        queue,
    )
    state = data[0]
    let addedIndices = data[1]
    let addedNames = data[2]

    state = addedIndices.reduce((state, index) => {
        let newPos = TransformUtils.getPositionFromMatrix4(queue.transforms[index])
        // let newPos = pos.set(
        // 	NumberUtils.getRandomValue1() * offsetFactor + pos.x,
        // 	pos.y,
        // 	NumberUtils.getRandomValue1() * offsetFactor + pos.z,
        // )

        queue.updatePosition(index,
            newPos,
            true
        )

        state = handleAfterUpdatePositionFunc(state, index, newPos)

        return state
    }, state)

    return ArrayUtils.reducePromise(addedNames, (state, name) => {
        return StateMachine.execute(state, getStateMachineFunc(state, name), name)
    }, state).then(state => [state, addedNames])
}