// import { Map } from "immutable"
// import { milltaryVehicle } from "../../../type/StateType"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { attackTarget, milltaryVehicle, objectStateName } from "../../../type/StateType"
import { Euler, EulerOrder, Matrix4, Mesh, Quaternion, Vector2, Vector3 } from "three"
import { Map } from "immutable"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { fsm_state, lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getRandomCollisionPart } from "../../../utils/CollisionUtils"
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
import { updateAI as updateAIUtils, createMoveState as createMoveStateUtils, createDestroyingState, getRandomCollisionPartCanAttack, getTargetBox, getTargetPart, getTargetPositionParrelToArmy, getCrowdDataUtils, } from "../../../utils/ArmyUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils, updateHierachyLODQueueTransform } from "../../../girl/PickPoseUtils"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGrid } from "../PathFind"
import { playStressingAnimation } from "../../../utils/CarUtils"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import * as DamageUtils from "../../../utils/DamageUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getAttackTarget } from "../Army"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let createState = (): milltaryVehicle => {
    return {
        milltaryVehicleMap: Map(),

        // glb: NullableUtils.getEmpty(),

        // fireRayMap: Map(),

        stateMachineMap: Map(),
        defenseFactorMap: Map(),
        hpMap: Map(),

        lodQueueIndexMap: Map(),

        moveTweenMap: Map(),
        fireTweenMap: Map(),

        // shadowQueueMap: Map(),

        // bloodDecalOriginBox: null,
        // bloodDecalQueue: null,
        // aviailableBloodDecalNames: [],

        allQueueLocalMatricesMap: Map(),
        moveDataMap: Map(),

        crowdPositions: [],

        initialQuaternionMap: Map(),
    }
}

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).milltaryVehicle)
}

export let setState = (state: state, value: milltaryVehicle) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        milltaryVehicle: NullableUtils.return_(value)
    })
}


export let getNamePrefix = () => "milltaryVehicle"

export let isMilltaryVechile = (name: string) => {
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


export let getCrowdData = (state: state): Array<Vector3> => {
    return getCrowdDataUtils(state, getState(state).crowdPositions)
}

export let setCrowdData = (state: state, crowdPositions) => {
    return setState(state, {
        ...getState(state),
        crowdPositions
    })
}

let _getAllModelAllQueues = (state: state): Array<HierachyLODQueue> => {
    return ArrayUtils.flatten(getState(state).milltaryVehicleMap.valueSeq().toArray().map(hierachyLODQueueData => {
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

export let fire = (state: state, [
    buildRoughFireRayFunc,
    rotateTowardsTargetFunc,
    fireShellFunc,
    getBodyQueueFunc,
    getWeaponValueFunc
], name, allModelQueues, lODQueueIndex, targetPart, isNotRotateTowardsTarget = false) => {
    // if (!StateMachine.isState(getStateMachine(state, name), objectStateName.Attack)) {
    //     return state
    // }

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
                    getBodyQueueFunc,
                    getWeaponValueFunc
                ],
                name, allModelQueues, lODQueueIndex,
                getTargetPart(state,
                    getBodyQueueFunc,
                    getWeaponValueFunc,
                    name, lODQueueIndex),
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

                let targetPart = getTargetPart(state,
                    getBodyQueueFunc,
                    getWeaponValueFunc,
                    name, lODQueueIndex)

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

export let getTurretPosition = (turretQueue, lODQueueIndex) => {
    let turretWorldMatrix = turretQueue.getWorldMatrix(lODQueueIndex)

    return TransformUtils.getPositionFromMatrix4(turretWorldMatrix)
    // .setY(0)
}

export let buildTurretTween = (state, [
    buildRoughFireRayFunc,
    onFuncs,
    buildTurretUpdateQuaternionFunc = (object, eulerOrderToSolveGimbalLock) => {
        return _q.setFromEuler(_e.set(
            0,
            object.y,
            0,
            eulerOrderToSolveGimbalLock
        ))
    }
    // ], [bodyQueue, turretQueue], allModelQueues, lODQueueIndex, targetPart,
],
    name,
    turretQueue,
    allModelQueues,

    bodyWorldTransform,
    bodyName,
    lODQueueIndex, targetPart,
    value: armyValue & milltaryValue,
) => {
    let turretPosition = getTurretPosition(turretQueue, lODQueueIndex)

    let targetPosition = getTargetPositionParrelToArmy(state, name, turretPosition.y, targetPart)

    let { emitPrecision } = getArmyValueForAttack(state, value, turretPosition)

    let turretLookatQuaternion = TransformUtils.getLookatQuaternion(
        turretPosition,
        (targetPosition.clone().add(_v1.set(
            emitPrecision * NumberUtils.getRandomValue1(),
            0,
            emitPrecision * NumberUtils.getRandomValue1(),
        ))),
    )

    let turretTransform = turretQueue.transforms[lODQueueIndex].clone()


    /*! refer to:https://stackoverflow.com/questions/46172742/gimbal-lock-at-y-axis-90-degrees
    * 
    */
    let eulerOrderToSolveGimbalLock: EulerOrder = 'YXZ'

    let turretEuler = TransformUtils.getRotationEulerFromMatrix4(turretTransform, eulerOrderToSolveGimbalLock)
    // if (turretEuler.x !== 0 || turretEuler.z !== 0) {
    //     throw new Error("err")
    // }


    // let bodyWorldTransform = bodyQueue.getWorldMatrix(lODQueueIndex).clone()

    let turretWorldTransform = turretQueue.getWorldMatrix(lODQueueIndex).clone()
    let turretLookatWorldMatrix = TransformUtils.setQuaternionToMatrix4(
        turretWorldTransform,
        turretLookatQuaternion
    )
    let turretLookatLocalMatrix = bodyWorldTransform.clone().invert().multiply(
        turretLookatWorldMatrix
    )


    let turretNeedRotateEuler = TransformUtils.getRotationEulerFromMatrix4(turretLookatLocalMatrix, eulerOrderToSolveGimbalLock)

    let object = {
        y: turretEuler.y,
    }
    let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
        .to({
            y: turretNeedRotateEuler.y,
        }, Math.abs(turretNeedRotateEuler.y - turretEuler.y) * 1000 * value.rotateSpeed)
        .onUpdate(() => {
            let state = readState()

            if (isRoughTowardsTarget(state,
                buildRoughFireRayFunc,
                allModelQueues, lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
                return tween.end()
            }


            turretQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
                turretTransform,
                buildTurretUpdateQuaternionFunc(object, eulerOrderToSolveGimbalLock)
                // _q.setFromEuler(_e.set(
                //     0,
                //     object.y,
                //     0,
                //     eulerOrderToSolveGimbalLock
                // ))
            )

            // state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))
            state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyName, lODQueueIndex, true))

            writeState(state)

            return Promise.resolve()
        })
        .onComplete(() => {
            let state = readState()

            ArticluatedAnimation.removeTween(getAbstractState(state), tween)

            NullableUtils.forEach(([onCompleteFunc, onFailFunc]) => {
                if (
                    !NumberUtils.isNearlyEqual(
                        turretEuler.y,
                        turretNeedRotateEuler.y,
                        2
                    ) &&
                    !isRoughTowardsTarget(state,
                        buildRoughFireRayFunc,
                        allModelQueues, lODQueueIndex, makeBoxHeightMax(getTargetBox(state, name, targetPart)))) {
                    return onFailFunc(state).then(writeState)
                }

                return onCompleteFunc(state, targetPart).then(writeState)
            }, onFuncs)

            return Promise.resolve()
        })

    return tween
}

export let parseAllWeaponModels = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getMissileVehicleMissileResourceId()), Render.getRenderer(getAbstractState(state))).then(missileVehicleMissile => {
        return missileVehicleMissile.scene.children[0] as Mesh
    })
}

export let setData = (state: state, categoryName, queue: HierachyLODQueue) => {
    return setState(state, {
        ...getState(state),
        milltaryVehicleMap: getState(state).milltaryVehicleMap.set(categoryName, NullableUtils.getWithDefault(
            getState(state).milltaryVehicleMap.get(categoryName),
            Map()
        ).set(queue.name, queue)
        ),
    })
}

export let getModelQueueByQueueName = (state: state, categoryName, queueName: string) => {
    return NullableUtils.getExn(NullableUtils.getExn(getState(state).milltaryVehicleMap.get(categoryName)).get(queueName))
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
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let forceFactor = getForceFactor(damage)

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

    forceData, fromName, damagePosition, transforms, boxes, names,
    isNotRotateTowardsTarget = false
) => {
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
                getWeaponValueFunc
            ],
            isNotRotateTowardsTarget
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
        isStressingByRate
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

export let createMoveState = ([
    getBodyQueueFunc,
    getInitialEulerForTweenToFaceNegativeXFunc,
],
    value: armyValue,
    modelName,
) => {
    return (state: state): fsm_state<state> => {
        return createMoveStateUtils([
            getModelQueueIndex,
            getBodyQueueFunc,
            (state, name) => state,
            (state, lodQueue, lODQueueIndex, name, position) => {
                return setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), lodQueue.name, lODQueueIndex, true))
            },
            _addMoveTweens,
            getInitialEulerForTweenToFaceNegativeXFunc,
            (state, name) => {
                return NullableUtils.getExn(getState(state).moveDataMap.get(name))
            },
            getStateMachine,
            setStateMachine,
            createInitialState,
            _hasMoveTween,
            _getMoveTween,
            (state, name) => {
                ArticluatedAnimation.removeTweens(
                    getAbstractState(state), _getMoveTween(state, name)
                )

                return setState(state, {
                    ...getState(state),
                    moveDataMap: getState(state).moveDataMap.remove(name),
                    moveTweenMap: getState(state).moveTweenMap.remove(name),

                })
            },
        ],
            isMaxArmySpeed() ? (100 as speed) : value.moveSpeed,
            getInitialQuaternion(state, modelName),
        )
    }
}

export let createStressingState = (
    [
        getBodyQueueFunc,
        getFullHpFunc,

        getModelAllQueuesFunc,
        buildRoughFireRayFunc,
        rotateTowardsTargetFunc,
        fireShellFunc,
        getWeaponValueFunc
    ],
    isNotRotateTowardsTarget
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
                                getBodyQueueFunc,
                                getWeaponValueFunc
                            ],
                            isNotRotateTowardsTarget
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
    createMoveStateFunc,
],
    bodyQueue,
    value: weaponValue) => {
    let {
        emitterSpeed,
        emitterLife,
        meleeRange,
    } = value

    return updateAIUtils(state,
        [
            getStateMachine,
            setStateMachine,
            createAttackStateFunc,
            createInitialState,
            createMoveStateFunc,
            _hasMoveData,
            _setMoveData
        ],
        bodyQueue.getValidData(getAbstractState(state)),
        emitterLife,
        emitterSpeed,
        // NullableUtils.getEmpty(),
        meleeRange
    )
}

export let getPickedTransform = (modelName) => getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPickTransformPrefix(),

    new Vector3(0.0, -0.4, 0.3
    ),
    -1.6, 0.9, 1.5,
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