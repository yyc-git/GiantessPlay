// import { Map } from "immutable"
// import { milltaryVehicle } from "../../../type/StateType"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { attackTarget, damageType, milltaryVehicle, objectStateName } from "../../../type/StateType"
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
import { getDamageTypeFactor, getForceFactor, getGirlPosition, getPositionParrelToObj } from "../../../girl/Utils"
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
import { updateAI as updateAIUtils, createMoveState as createMoveStateUtils, createDestroyingState, getRandomCollisionPartCanAttack, getTargetBox, getTargetPart, getTargetPositionParrelToArmy, getCrowdDataUtils, computeRemainAttackFrames, isCanNotAttackByCD, handleCanNotAttackForMilltaryMachine, addLabel, } from "../../../utils/ArmyUtils"
import { emitBodyExplode as emitBodyExplodeUtils, getStateMachineUtils } from "../../../utils/ArmyUtils2"
import { getGiantessPutToBreastTransformFunc, getGiantessPutToShoeTransformFunc, getGiantessTransformFunc, getGiantessUBControlledTransformFunc, getPickTransformPrefix, getPutToBreastTransformPrefix, getPutToShoeTransformPrefix, getUBControlledTransformPrefix } from "../../../utils/SkeletonUtils"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils, updateHierachyLODQueueTransform, isPicked, removePickData } from "../../../girl/PickPoseUtils"
import { PathFind } from "meta3d-jiehuo-abstract"
import { findValidPosition, getGrid } from "../PathFind"
import { playStressingAnimation } from "../../../utils/CarUtils"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import * as DamageUtils from "../../../utils/DamageUtils"
import { Flow } from "meta3d-jiehuo-abstract"
// import { getNamePrefix } from "./MilltaryVehicleUtils"
import { setAttackTarget } from "../Army"
import { isGirl } from "../../../girl/Girl"
import { setAttackFactor, setCritRatioFactor, setDefenseFactor, setEmitSpeedFactor, setMoveSpeed, disposeData as disposeStaticDynamicUnitData, getMoveSpeed } from "../../../StaticDynamicUnit"
import { getModAPI } from "../../../Mod"
import { isControlledState, isDestoryRelatedStates, isFallState, isFlattenState, isRepelState } from "../../../utils/FSMStateUtils"
import { api } from "type-api/src/Type"
import { handleRepelForNonCharacter } from "../../../utils/RepelUtils"
import { isChangeToLieState } from "../../../utils/CharacterUtils"
import { createFallState, createFlattenState, handleExitControlled, isChangeToFlattenState, isControlled } from "../../../utils/RigidBodyUtils"
import { clearTargetByName } from "../../../utils/BehaviourManagerUtils"
import { isChangeToFallState } from "../../../utils/FallUtils"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let createState = (): milltaryVehicle => {
    return {
        // tweens: [],
        milltaryVehicleMap: Map(),

        // glb: NullableUtils.getEmpty(),

        // fireRayMap: Map(),

        stateMachineMap: Map(),
        // defenseFactorMap: Map(),
        // moveSpeedMap: Map(),
        // attackFactorMap: Map(),
        // emitSpeedFactorMap: Map(),
        // critRatioFactorMap: Map(),
        // missRatioMap: Map(),
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

        // crowdPositions: [],

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

// let _getTweens = (state) => {
//     return getState(state).tweens
// }

// let _setTweens = (state, tweens) => {
//     return setState(state, {
//         ...getState(state),
//         tweens: tweens
//     })
// }


// export let getNamePrefix = () => "milltaryVehicle"

// export let isMilltaryVehicle = (name: string) => {
//     return name.includes(getNamePrefix())
// }


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
    return getStateMachineUtils(name, getState(state).stateMachineMap.get(name))
}

export let setStateMachine = (state: state, name: string, stateMachine) => {
    return setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.set(name, stateMachine)
    })
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

let _getAllModelAllQueues = (state: state): Array<HierachyLODQueue> => {
    return ArrayUtils.flatten(getState(state).milltaryVehicleMap.valueSeq().toArray().map(hierachyLODQueueData => {
        return hierachyLODQueueData.valueSeq().toArray()
    }))
}

export let disposeData = (state: state, name: name) => {
    // let queue = LOD.getLODQueue<HierachyLODQueue>(getAbstractState(state), name)

    // let allQueues = ArrayUtils.pushArrs([queue], queue.getAllChildren())

    // return allQueues.reduce((state, queue) => {
    //     let name = queue.getName(index)

    //     state = setState(state, {
    //         ...getState(state),
    //         // stateMachineMap: getState(state).stateMachineMap.remove(name),
    //         defenseFactorMap: getState(state).defenseFactorMap.remove(name),
    //         hpMap: getState(state).hpMap.remove(name),
    //         moveTweenMap: getState(state).moveTweenMap.remove(name),
    //         fireTweenMap: getState(state).fireTweenMap.remove(name),
    //         lodQueueIndexMap: getState(state).lodQueueIndexMap.remove(name),
    //         moveDataMap: getState(state).moveDataMap.remove(name),
    //     })

    //     return state
    // }, state)
    state = disposeStaticDynamicUnitData(state, name)

    return setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.remove(name),
        // defenseFactorMap: getState(state).defenseFactorMap.remove(name),
        // moveSpeedMap: getState(state).moveSpeedMap.remove(name),
        // attackFactorMap: getState(state).attackFactorMap.remove(name),
        // emitSpeedFactorMap: getState(state).emitSpeedFactorMap.remove(name),
        // critRatioFactorMap: getState(state).critRatioFactorMap.remove(name),
        // missRatioMap: getState(state).missRatioMap.remove(name),
        hpMap: getState(state).hpMap.remove(name),
        moveTweenMap: getState(state).moveTweenMap.remove(name),
        fireTweenMap: getState(state).fireTweenMap.remove(name),
        lodQueueIndexMap: getState(state).lodQueueIndexMap.remove(name),
        moveDataMap: getState(state).moveDataMap.remove(name),
    })
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

export let getModelQueueIndexNullable = (state: state, name) => {
    return getState(state).lodQueueIndexMap.get(name)
}


export let getModelQueueIndex = (state: state, name) => {
    return NullableUtils.getExn(getModelQueueIndexNullable(state, name))
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
], name, allModelQueues, lODQueueIndex, targetPart, isNotRotateTowardsTarget = false): Promise<state> => {
    // if (!StateMachine.isState(getStateMachine(state, name), objectStateName.Attack)) {
    //     return state
    // }

    // let isRotateTowardsTarget = isNotRotateTowardsTarget ? false : !isRoughTowardsTarget(state,
    //     buildRoughFireRayFunc,
    //     allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, usedGirl,  targetPart).toBox3()))

    return NullableUtils.getWithDefaultFunc(
        NullableUtils.map(targetBox => {
            if (!isNotRotateTowardsTarget && !isRoughTowardsTarget(state,
                buildRoughFireRayFunc,
                allModelQueues, lODQueueIndex, makeBoxHeightMax(targetBox))) {
                return Promise.resolve(rotateTowardsTargetFunc(state, [(state, targetPart) => {
                    let targetBox = getTargetBox(state, name, targetPart)
                    if (NullableUtils.isNullable(targetBox)) {
                        return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, NullableUtils.return_(name))
                    }
                    targetBox = NullableUtils.getExn(targetBox)


                    let data1 = handleCanNotAttackForMilltaryMachine(state, [
                        buildRoughFireRayFunc,
                        rotateTowardsTargetFunc,
                        fireShellFunc,
                        getBodyQueueFunc,
                        getWeaponValueFunc,
                        fire
                    ], name, allModelQueues, lODQueueIndex, isNotRotateTowardsTarget)
                    state = data1[0]
                    if (data1[1]) {
                        return Promise.resolve(state)
                    }

                    state = fireShellFunc(state,
                        // [
                        //     fire,
                        //     buildRoughFireRayFunc,
                        //     rotateTowardsTargetFunc,
                        //     fireShellFunc,
                        // ],
                        name, allModelQueues, lODQueueIndex, targetPart, targetBox)

                    return Promise.resolve(state)
                }, (state) => {
                    return fire(state,
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
                }], name, allModelQueues, lODQueueIndex, targetPart))
            }

            let data1 = handleCanNotAttackForMilltaryMachine(state, [
                buildRoughFireRayFunc,
                rotateTowardsTargetFunc,
                fireShellFunc,
                getBodyQueueFunc,
                getWeaponValueFunc,
                fire
            ], name, allModelQueues, lODQueueIndex, isNotRotateTowardsTarget)
            state = data1[0]
            if (data1[1]) {
                return Promise.resolve(state)
            }

            return Promise.resolve(fireShellFunc(state,
                // [
                //     fire,
                //     buildRoughFireRayFunc,
                //     rotateTowardsTargetFunc,
                //     fireShellFunc,
                // ],
                name, allModelQueues, lODQueueIndex, targetPart, targetBox))
            // return Promise.resolve(state)
        }, getTargetBox(state, name, targetPart)),
        () => {
            return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, NullableUtils.return_(name))
        }
    )

    // if (isRotateTowardsTarget) {
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

                return fire(state,
                    [buildRoughFireRayFunc,
                        rotateTowardsTargetFunc,
                        fireShellFunc,
                        getBodyQueueFunc,
                        getWeaponValueFunc
                    ],
                    name, getModelAllQueuesFunc(state), lODQueueIndex, targetPart,
                    isNotRotateTowardsTarget
                )
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

    let turretTransform = turretQueue.getTransform(lODQueueIndex).clone()


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

            let targetBox = getTargetBox(state, name, targetPart)
            if (NullableUtils.isNullable(targetBox)) {
                return tween.end()
            }
            targetBox = NullableUtils.getExn(targetBox)

            if (isRoughTowardsTarget(state,
                buildRoughFireRayFunc,
                allModelQueues, lODQueueIndex, makeBoxHeightMax(targetBox))) {
                return tween.end()
            }


            turretQueue.setTransform(lODQueueIndex, TransformUtils.setQuaternionToMatrix4(
                turretTransform,
                buildTurretUpdateQuaternionFunc(object, eulerOrderToSolveGimbalLock)
                // _q.setFromEuler(_e.set(
                //     0,
                //     object.y,
                //     0,
                //     eulerOrderToSolveGimbalLock
                // ))
            ))

            // state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))
            state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyName, lODQueueIndex, true))

            writeState(state)

            return Promise.resolve()
        })
        .onComplete(() => {
            let state = readState()

            ArticluatedAnimation.removeTween(getAbstractState(state), tween)

            let promise = Promise.resolve()
            NullableUtils.forEach(([onCompleteFunc, onFailFunc]) => {
                let targetBox = getTargetBox(state, name, targetPart)
                if (NullableUtils.isNullable(targetBox)) {
                    promise = onFailFunc(state).then(writeState)
                    return
                }
                targetBox = NullableUtils.getExn(targetBox)

                if (
                    !NumberUtils.isNearlyEqual(
                        turretEuler.y,
                        turretNeedRotateEuler.y,
                        2
                    ) &&
                    !isRoughTowardsTarget(state,
                        buildRoughFireRayFunc,
                        allModelQueues, lODQueueIndex, makeBoxHeightMax(targetBox))) {
                    promise = onFailFunc(state).then(writeState)
                    return
                }

                promise = onCompleteFunc(state, targetPart).then(writeState)
            }, onFuncs)

            // return Promise.resolve()
            return promise
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

// export let getDefenseFactor = (state, name) => {
//     return NullableUtils.getExn(getState(state).defenseFactorMap.get(name))
// }

// export let setDefenseFactor = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         defenseFactorMap: getState(state).defenseFactorMap.set(name, value)
//     })
// }

// export let getMoveSpeed = (state, name) => {
//     return NullableUtils.getExn(getState(state).moveSpeedMap.get(name))
// }

// export let setMoveSpeed = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         moveSpeedMap: getState(state).moveSpeedMap.set(name, value)
//     })
// }

// export let getAttackFactor = (state, name) => {
//     return NullableUtils.getExn(getState(state).attackFactorMap.get(name))
// }

// export let setAttackFactor = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         attackFactorMap: getState(state).attackFactorMap.set(name, value)
//     })
// }

// export let getEmitSpeedFactor = (state, name) => {
//     return NullableUtils.getExn(getState(state).emitSpeedFactorMap.get(name))
// }

// export let setEmitSpeedFactor = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         emitSpeedFactorMap: getState(state).emitSpeedFactorMap.set(name, value)
//     })
// }

// export let getCritRatioFactor = (state, name) => {
//     return NullableUtils.getExn(getState(state).critRatioFactorMap.get(name))
// }

// export let setCritRatioFactor = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         critRatioFactorMap: getState(state).critRatioFactorMap.set(name, value)
//     })
// }

// export let getMissRatio = (state, name) => {
//     return NullableUtils.getExn(getState(state).missRatioMap.get(name))
// }

// export let setMissRatio = (state, name, value) => {
//     return setState(state, {
//         ...getState(state),
//         missRatioMap: getState(state).missRatioMap.set(name, value)
//     })
// }

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

// export let isControlled = (state: state, fromName, damage, damageType_: damageType, direction, stateMachine, box) => {
//     if (isChangeToLieState(damageType_, direction)) {
//         return true
//     }

//     if (isControlledState(state, stateMachine)) {
//         return false
//     }

//     if (isGirl(fromName)) {
//         return true
//     }

//     let damageTypeFactor = getDamageTypeFactor(damageType_)

//     let forceFactor = getForceFactor(damage)

//     const factor = 0.2


//     let rate = NumberUtils.clamp(1 * forceFactor * damageTypeFactor * factor, 0, 1)

//     return Math.random() < rate
// }
export let isStressing = (state, name, damage, damageType_) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    // let forceFactor = getForceFactor(getHp(state, name), damage, 0.2)
    let forceFactor = getForceFactor(getHp(state, name), damage, 0.04)

    const factor = 0.2


    let rate = NumberUtils.clamp(1 * forceFactor * damageTypeFactor * factor, 0, 1)

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
        getWeaponValueFunc,
        setScaleYFunc
    ],
    soundResourceId, value: armyValue & milltaryValue,

    forceData, weaponValue_, fromName, damagePosition,
    // critRatioFactor,
    // attackFactor,
    transforms, boxes, names,
    isNotRotateTowardsTarget = false
) => {
    return DamageUtils.damage(
        state, [
        // getDefenseFactor,
        // // getAttackFactor,
        // // getCritRatioFactor,
        // getMissRatio,
        getHp, updateHp,

        getStateMachine,
        setStateMachine,


        (
            state,
            fromName,
            [matrix, box, name, damage, damageType_],
            direction
        ) => {
            if (
                isChangeToFlattenState(
                    state,
                    getStateMachine(state, name),
                    damage, damageType_,
                    direction,
                    getFullHpFunc(state, name),
                    getHp(state, name),
                    fromName
                )
            ) {
                return createFlattenState(
                    getStateMachine,
                    setStateMachine,
                    createDestroyingState,
                    getModelQueueIndex,
                    getModelQueueIndexNullable,
                    disposeData,
                )([
                    getBodyQueueFunc,
                    setScaleYFunc,
                    setStatusFunc,
                    emitBodyExplodeFunc
                ],
                    soundResourceId, weaponValue_,
                    fromName,
                    [matrix, box, name, damage, damageType_],
                    forceData[0][1]
                )
            }

            return createStressingState(
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
            )()
        },

        createDestroyingState([
            setStatusFunc,
            emitBodyExplodeFunc,
            getModelQueueIndexNullable,
            disposeData,
            getStateMachine,
            setStateMachine,
        ],
            soundResourceId, weaponValue_,
            forceData[1][0]
        ),
        isControlled(isStressing),
        addLabel
    ], forceData, weaponValue_, fromName, damagePosition,
        [
            value.armorType,
            value.armorRatio, value.armorStrength,
            // critRatioFactor,
            // attackFactor,
        ],
        transforms, boxes, names,
    )
}

export let initialAttributes = (state, [getValueFunc, getFullHpFunc], name, index) => {
    state = setAttackTarget(state, name, attackTarget.None)

    let { defenseFactor, moveSpeed, attackFactor, critRatioFactor, emitSpeedFactor } = getValueFunc(state)

    state = setDefenseFactor(state, name, defenseFactor)
    state = setMoveSpeed(state, name, moveSpeed)
    state = setAttackFactor(state, name, attackFactor)
    state = setEmitSpeedFactor(state, name, emitSpeedFactor)
    state = setCritRatioFactor(state, name, critRatioFactor)
    // state = setMissRatio(state, name,)


    return setState(state, {
        ...getState(state),
        lodQueueIndexMap: getState(state).lodQueueIndexMap.set(name, index),
        stateMachineMap: getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
        // stateMachineMap: getState(state).stateMachineMap.set(name, StateMachine.create(name, createFireState())),
        // defenseFactorMap: getState(state).defenseFactorMap.set(name, getValueFunc(state).defenseFactor),
        // moveSpeedMap: getState(state).moveSpeedMap.set(name, getValueFunc(state).moveSpeed),
        // attackFactorMap: getState(state).attackFactorMap.set(name, getValueFunc(state).attackFactor),
        // emitSpeedFactorMap: getState(state).emitSpeedFactorMap.set(name, getValueFunc(state).emitSpeedFactor),
        // critRatioFactorMap: getState(state).critRatioFactorMap.set(name, getValueFunc(state).critRatioFactor),
        // missRatioMap: getState(state).missRatioMap.set(name, getValueFunc(state).missRatio),
        hpMap: getState(state).hpMap.set(name, getFullHpFunc(state)),
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

let _createControlledState = (name): fsm_state<state> => {
    return {
        name: name,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => Promise.resolve(state),
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }
}

export let createPickedControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.PickedControlled)
}

export let createUBControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.UBControlled)
}

export let createBreastControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.BreastControlled)
}

export let createShoeControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.ShoeControlled)
}



// export let emitBodyExplode = (state: state, position) => {
//     state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
//         speed: 0.1,
//         life: 3000,
//         size: 20,
//         position: [position[0], position[1] - 1.5, position[2]]
//     }))
//     state = setAbstractState(state, ParticleManager.emitShellEmitOrExplode(getAbstractState(state), {
//         speed: 1,
//         life: 1500,
//         size: 40,
//         position: position
//     }))

//     return state
// }

export let emitBodyExplode = emitBodyExplodeUtils

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

export let stopAndRemoveMoveDataAndTweenMilltaryVehicle = (state, name) => {
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
            _setMoveData,
            getStateMachine,
            setStateMachine,
            createInitialState,
            _hasMoveTween,
            _getMoveTween,
            stopAndRemoveMoveDataAndTweenMilltaryVehicle,
            (state, name, box) => {
                return isMaxArmySpeed() ? (100 as speed) : getMoveSpeed(state, name)
            }
        ],
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
                [matrix, box, name, damage, damageType_], direction
            ]: any) => {
                let lODQueueIndex = getModelQueueIndex(state, name)

                let stateMachine = getStateMachine(state, name)


                // if (!StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)) {
                if (!isPicked(state, name)) {
                    let bodyQueueName = getBodyQueueFunc(state).name

                    return Promise.resolve(playStressingAnimation(state, [
                        (state, _) => state,
                        getFullHpFunc, (object, matrix) => {
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
                    ], [matrix, box, name, damage, damageType_]))
                }

                return StateMachine.changeAndExecuteState(state, setStateMachine, stateMachine, createPickedControlledState(), name, NullableUtils.getEmpty())
            },
            exitFunc: (state: state) => Promise.resolve(state),
        }
    }
}

// export let createFallState = (getBodyQueueFunc): fsm_state<state> => {
//     return {
//         name: objectStateName.Fall,
//         enterFunc: (state) => {
//             return Promise.resolve(state)
//         },
//         executeFunc: (state, [
//             name, index, queue,
//             originTransform,
//         ]) => {
//             let api = getModAPI(state)

//             let currentPoint = api.TransformUtils.getPositionFromMatrix4(queue.getTransform(index))

//             let targetPoint = api.vector3.setY(api.vector3.clone(currentPoint), 0)

//             let validTargetPoint = api.NullableUtils.getWithDefault(
//                 api.findValidPosition(state, targetPoint),
//                 targetPoint
//             )

//             // if (api.isNotInMovableRanges(state,usedGirl, validTargetPoint)) {
//             //     validTargetPoint = api.vector3.create(0, 0, 0)
//             // }

//             state = handleExitControlled(state,
//                 getBodyQueueFunc,
//                 index, validTargetPoint,
//                 originTransform
//             )

//             return api.buildMultipleTweens(state, [(state, object, _) => {
//                 if (queue.isAlive(index)) {
//                     state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), queue.name, index, true))

//                     queue.updatePosition(
//                         index, api.vector3.create(
//                             object.x,
//                             object.y,
//                             object.z,
//                         ),
//                         true
//                     )
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
//                 return api.computeFallTime(api, previousData, currentData)
//                 // return 3000
//             }], [
//                 currentPoint, validTargetPoint
//             ]).then(d => {
//                 state = d[0]
//                 let lastTween = d[1]
//                 let allTweens = d[2]

//                 api.NullableUtils.getExn(lastTween).onComplete(() => {
//                     let state = api.readState()

//                     api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)

//                     if (isDestoryRelatedStates(getStateMachine(state, name))) {
//                         return
//                     }

//                     return api.StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, api.NullableUtils.return_(name))
//                         .then(state => {
//                             api.writeState(state)
//                         })
//                 })

//                 return state
//             })
//         },
//         exitFunc: (state: state) => {
//             return Promise.resolve(state)
//         }
//     }
// }

// export let createFlattenState = ([getBodyQueueFunc, setScaleYFunc,
//     setStatusFunc,
//     emitBodyExplodeFunc
// ],
//     soundResourceId, weaponValue,
//     //  damageType_,
//     // matrix
//     fromName,
//     [matrix, box, name, damage, damageType_], forceDirection
// ): fsm_state<state> => {
//     return {
//         name: objectStateName.Flatten,
//         enterFunc: (state: state, stateMachine) => {
//             return Promise.resolve(state)
//         },
//         executeFunc: (state, _, stateMachine) => {
//             // let name = stateMachine.name

//             let bodyQueue = getBodyQueueFunc(state)

//             let lODQueueIndex = getModelQueueIndex(state, name)

//             LOD.markNeedsUpdate(getAbstractState(state),
//                 bodyQueue.name,
//                 lODQueueIndex, true)


//             let scale = TransformUtils.getScaleFromMatrix4(matrix)
//             scale = setScaleYFunc(scale, 0.2)
//             TransformUtils.setScaleToMatrix4(matrix,
//                 scale
//             )


//             state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
//                 return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createDestroyingState([
//                     setStatusFunc,
//                     emitBodyExplodeFunc,
//                     getModelQueueIndexNullable,
//                     disposeData,
//                     getStateMachine,
//                     setStateMachine,
//                 ],
//                     soundResourceId, weaponValue, damageType_
//                 )(), name, NullableUtils.return_([
//                     fromName,
//                     [matrix, box, name, damage, damageType_], forceDirection
//                 ]))
//             }, 3))

//             return Promise.resolve(state)
//         },
//         exitFunc: (state: state, stateMachine) => {
//             return Promise.resolve(state)
//         },
//     }
// }

// export let createRepelState = (getBodyQueueFunc): fsm_state<state> => {
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

//             // let queue = api.LOD.getLODQueue(api.getAbstractState(state), name)
//             let queue = getBodyQueueFunc(state)
//             let index = queue.getIndex(name)

//             // let shadowQueue = getShadowQueueFunc(state, name)

//             // state = api.setAbstractState(state, api.GPUSkin.playLastFrame(
//             //     api.getAbstractState(state),
//             //     // (state) => {
//             //     // },
//             //     name, getControlledClipIndexFunc(name)
//             // ))

//             return api.buildMultipleTweens(state, [(state, object, _) => {
//                 if (queue.isAlive(index)) {
//                     state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), queue.name, index, true))

//                     queue.updatePosition(
//                         index, api.vector3.create(
//                             object.x,
//                             object.y,
//                             object.z,
//                         ),
//                         true
//                     )
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

//                     if (api.isDestoryRelatedStates(getStateMachine(state, name))) {
//                         return
//                     }


//                     return api.StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, api.NullableUtils.return_(name)).then(state => {
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
//                 [matrix, box, name, damage, damageType_], forceDirection
//             ]: any) => {
//                 let lODQueueIndex = getModelQueueIndex(state, name)

//                 state = setStatusFunc(state, buildStatus(false, false, true), lODQueueIndex)



//                 let stateMachine = getStateMachine(state, name)

//                 let worldMatrix
//                 if (StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)) {
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
        emitSpeed,
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
        emitSpeed,
        emitterLife,
        emitterSpeed,
        // NullableUtils.getEmpty(),
        meleeRange
    )
}

export let getPickedTransform = (modelName) => getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPickTransformPrefix(),

    -1.6, 0.9, 1.5,
)

export let getUBControlledTransform = (modelName) => getGiantessUBControlledTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getUBControlledTransformPrefix(),

    1.7,
    0,
    0,
)

export let getPutToBreastTransform = (modelName) => getGiantessPutToBreastTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPutToBreastTransformPrefix(),

    1.7,
    0,
    0,
)

export let getPutToShoeTransform = (modelName) => getGiantessPutToShoeTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPutToShoeTransformPrefix(),

    0,
    0,
    0,
)


// export let isCanPickup = (state: state, name: name) => {
//     let stateMachine = getStateMachine(state, name)

//     return (
//         !isFallState(stateMachine)
//         && !isRepelState(stateMachine)
//     )
// }

export let handlePickup = (state: state, usedGirl, name: name) => {
    return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createPickedControlledState(), name, NullableUtils.getEmpty())
}

export let updateTransform = updateHierachyLODQueueTransform

// export let handleExitControlled = (state,
//     getBodyQueueFunc,
//     index: lodQueueIndex, currentPosition,
//     originTransform
// ) => {
//     let bodyQueue = getBodyQueueFunc(state)

//     state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, index, true))

//     bodyQueue.getTransform(index).copy(
//         TransformUtils.setPositionToMatrix4(
//             originTransform.clone(),
//             currentPosition
//         )
//     )

//     return state
// }

export let handlePickdown = (getBodyQueueFunc) => {
    return (state: state, name: name, index: lodQueueIndex, targetPoint, queue: HierachyLODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
        // let validTargetPoint = PathFind.findValidPosition(
        //     new Vector2(targetPoint.x, targetPoint.z),
        //     getGrid(state),
        //     getIsDebug(state)
        // )
        let validTargetPoint = findValidPosition(state, targetPoint)


        if (NullableUtils.isNullable(validTargetPoint)) {
            return Promise.resolve([state, false])
        }

        validTargetPoint = NullableUtils.getExn(validTargetPoint)

        state = handleExitControlled(state, getBodyQueueFunc,
            index, validTargetPoint,
            originTransform
        )

        return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialState(), name, NullableUtils.return_(name)).then(state => [state, true])
    }
}

export let handleFall = (getBodyQueueFunc) => {
    return (state: state, name: name, index: lodQueueIndex, queue: HierachyLODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
        let stateMachine = getStateMachine(state, name)

        if (!isChangeToFallState(state, stateMachine)) {
            return Promise.resolve([state, false])
        }

        return StateMachine.changeAndExecuteState(state, setStateMachine, stateMachine, createFallState(
            getStateMachine,
            setStateMachine,
            createInitialState,
        )(
            getBodyQueueFunc
        ), name, NullableUtils.return_([
            name, index, getBodyQueueFunc(state),
            originTransform,
        ]))
            .then(state => [state, true])
    }
}

export let handleRepel = (
    getBodyQueueFunc
) => {

    // return (state,
    //     direction, distance, time,
    //     [matrix, box, name]
    // ): Promise<[state, boolean]> => {
    //     return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createRepelState(
    //         getBodyQueueFunc
    //     ), name, NullableUtils.return_([
    //         direction, distance, time,
    //         [matrix, box, name]
    //     ]))
    // }
    return handleRepelForNonCharacter([
        getStateMachine, setStateMachine, getBodyQueueFunc, createInitialState
    ])
}

let _handleControl = (createControlledStateFunc) => (state: state, usedGirl, name: name) => {
    return removePickData(state, name).then(state => {
        return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createControlledStateFunc(), name, NullableUtils.getEmpty())
    })
}

export let handleUBControl = _handleControl(createUBControlledState)

export let handlePutToBreast = _handleControl(createBreastControlledState)

export let handlePutToShoe = _handleControl(createShoeControlledState)

export let updateUBControlledTransform = updateHierachyLODQueueTransform

export let updatePutToBreastTransform = updateUBControlledTransform

export let updatePutToShoeTransform = updateUBControlledTransform

export let getLocalTransform = getLocalTransformUtils

export let getBoxForPick = getBoxForPickUtils