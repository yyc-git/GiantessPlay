import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"
import { fsm_state, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { objectStateName } from "../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getModAPI } from "../Mod"
import { updateCharacterPosition, updateShadow } from "./CharacterUtils"
import { isControlledStateExceptStressing, isDestoryRelatedStates, isRepelState } from "./FSMStateUtils"
import { Box3, Vector3 } from "three"
import { isLittleMan, handleRepel as handleRepelLittleMan, getName } from "../little_man/LittleMan"
import { handleRepel as handleRepelUtils } from "./LODQueueObjectUtils"
import { computeMass } from "./MassUtils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getHeight } from "./DamageUtils"
import { forceSize } from "../data/DataType"
import { isMilltaryBuilding } from "../manage/city1/milltary_building/MilltaryBuildingUtils"
import { removeTweensByKey, setTweensByKey } from "../TweenManager"
import { getBoxMaxSize } from "./Box3Utils"

let _computeVelocity = (api: api, currentPoint, direction, distance) => {
    let targetPoint = api.vector3.add(
        api.vector3.clone(currentPoint),
        api.vector3.multiplyScalar(
            api.vector3.clone(direction),
            distance
        )
    )

    return api.vector3.sub(targetPoint, currentPoint)
}

let _updateMoveCollision = (api: api) => (velocity, state: state, isJudgeGirl: boolean, isOnlyCollisionWithStatic: boolean, currentPoint) => {
    if (isJudgeGirl || !isOnlyCollisionWithStatic) {
        throw new Error("error")
    }

    let targetPoint = api.vector3.add(
        api.vector3.clone(currentPoint),
        velocity
    )
    if (
        !api.PathFind.isWalkable(
            api.vector2.create(api.vector3.getX(targetPoint), api.vector3.getZ(targetPoint)),
            api.getGridForJudgeWalkable(state)
        )
    ) {
        return api.vector3.set(
            api.vector3.getTempVector1(),
            0, 0, 0
        )
    }

    return velocity
}

export let findTargetPoint = (api: api, state,
    stateMachine,
    currentPoint, direction, distance,
    name, box
) => {
    let velocity = api.computeMovableVelocity(state,
        _updateMoveCollision(api), getName(),
        _computeVelocity(api, currentPoint, direction, distance),
        currentPoint,
        box,
        // getStateMachine(state, name),
        stateMachine,
        false, true)

    return api.vector3.add(
        api.vector3.clone(currentPoint), velocity)
}

let _buildRepelKey = (name) => `${name}_Repel`

export let createRepelStateForNonCharacter = ([getStateMachineFunc, setStateMachineFunc, getBodyQueueFunc,
    createInitialStateFunc,
    // playAnimationFunc,
    // getShadowQueueFunc
],): fsm_state<state> => {
    return {
        name: objectStateName.Repel,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [
            direction, distance, time,
            [matrix, box, name]
        ]) => {
            let api = getModAPI(state)

            let currentPoint = api.TransformUtils.getPositionFromMatrix4(matrix)

            let validTargetPoint = findTargetPoint(api, state,
                getStateMachineFunc(state, name),
                // currentPoint, api.vector3.fromArray(api.vector3.createEmpty(), direction), distance, name, box)
                currentPoint, direction, distance, name, box)

            let queue = getBodyQueueFunc(state)
            let index = queue.getIndex(name)

            // let shadowQueue = api.NullableUtils.map(getShadowQueueFunc => {
            //     return getShadowQueueFunc(state, name)
            // })

            // state = playAnimationFunc(state, name)

            return api.buildMultipleTweens(state, [(state, object, _) => {
                // if (queue.isAlive(index)) {
                if (isRepelState(getStateMachineFunc(state, name))) {
                    state = api.setAbstractState(state, api.LOD.markNeedsUpdate(api.getAbstractState(state), queue.name, index, true))

                    queue.updatePosition(
                        index, api.vector3.create(
                            object.x,
                            object.y,
                            object.z,
                        ),
                        true
                    )
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
                // return api.computeFallTime(api, previousData, currentData)
                // return 3000
                return time
            }], [
                currentPoint, validTargetPoint
            ]).then(d => {
                state = d[0]
                let lastTween = d[1]
                let allTweens = d[2]

                state = setTweensByKey(state, _buildRepelKey(name), allTweens)

                api.NullableUtils.getExn(lastTween).onComplete(() => {
                    let state = api.readState()

                    // api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)
                    state = removeTweensByKey(state, _buildRepelKey(name))

                    // if (api.isDestoryRelatedStates(getStateMachineFunc(state, name))) {
                    if (!isRepelState(getStateMachineFunc(state, name))) {
                        return
                    }


                    return api.StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createInitialStateFunc(), name, api.NullableUtils.return_(name)).then(state => {
                        api.writeState(state)
                    })
                })

                return state
            })
        },
        exitFunc: (state: state, stateMachine) => {
            state = removeTweensByKey(state, _buildRepelKey(stateMachine.name))

            return Promise.resolve(state)
        }
    }
}

export let createRepelStateForCharacter = ([getStateMachineFunc, setStateMachineFunc,
    getIdleClipIndexFunc, getControlledClipIndexFunc,
    createInitialStateFunc,
    getShadowQueueFunc
],): fsm_state<state> => {
    return {
        name: objectStateName.Repel,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [
            direction, distance, time,
            [matrix, box, name]
        ]) => {
            let api = getModAPI(state)

            let currentPoint = api.TransformUtils.getPositionFromMatrix4(matrix)

            let validTargetPoint = findTargetPoint(api, state,
                getStateMachineFunc(state, name),
                // currentPoint, api.vector3.fromArray(api.vector3.createEmpty(), direction), distance, name, box)
                currentPoint, direction, distance, name, box)

            let queue = api.LOD.getLODQueue(api.getAbstractState(state), name)
            let index = queue.getIndex(name)

            let shadowQueue = api.NullableUtils.map(getShadowQueueFunc => {
                return getShadowQueueFunc(state, name)
            }, getShadowQueueFunc)

            state = api.setAbstractState(state, api.GPUSkin.playLastFrame(
                api.getAbstractState(state),
                name, getControlledClipIndexFunc(name)
            ))


            return api.buildMultipleTweens(state, [(state, object, _) => {
                if (isRepelState(getStateMachineFunc(state, name))) {
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
                // return api.computeFallTime(api, previousData, currentData)
                // return 3000
                return time
            }], [
                currentPoint, validTargetPoint
            ]).then(d => {
                state = d[0]
                let lastTween = d[1]
                let allTweens = d[2]

                state = setTweensByKey(state, _buildRepelKey(name), allTweens)

                api.NullableUtils.getExn(lastTween).onComplete(() => {
                    let state = api.readState()

                    // api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)
                    state = removeTweensByKey(state, _buildRepelKey(name))

                    // if (api.isDestoryRelatedStates(getStateMachineFunc(state, name))) {
                    if (!isRepelState(getStateMachineFunc(state, name))) {
                        return
                    }


                    return api.StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createInitialStateFunc(getIdleClipIndexFunc), name, api.NullableUtils.return_(name)).then(state => {
                        api.writeState(state)
                    })
                })

                return state
            })
        },
        exitFunc: (state: state, stateMachine) => {
            state = removeTweensByKey(state, _buildRepelKey(stateMachine.name))

            return Promise.resolve(state)
        }
    }
}

export let handleRepelForNonCharacter = (
    [getStateMachineFunc, setStateMachineFunc, getBodyQueueFunc,
        createInitialStateFunc
    ]
) => {
    return (state,
        direction, distance, time,
        [matrix, box, name]
    ): Promise<[state, boolean]> => {
        let stateMachine = getStateMachineFunc(state, name)

        if (isControlledStateExceptStressing(state, stateMachine)) {
            return Promise.resolve(state)
        }

        return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createRepelStateForNonCharacter(
            [getStateMachineFunc, setStateMachineFunc, getBodyQueueFunc,
                createInitialStateFunc
            ]
        ), name, NullableUtils.return_([
            direction, distance, time,
            [matrix, box, name]
        ]))
    }
}


export let handleRepelForCharacter = (
    [getStateMachineFunc, setStateMachineFunc,
        getIdleClipIndexFunc, getControlledClipIndexFunc,
        getShadowQueueFunc,
        createInitialStateFunc
    ]
) => {
    return (state,
        direction, distance, time,
        [matrix, box, name]
    ): Promise<[state, boolean]> => {
        let stateMachine = getStateMachineFunc(state, name)

        if (
            isDestoryRelatedStates(stateMachine)
            || isControlledStateExceptStressing(state, stateMachine)) {
            return Promise.resolve(state)
        }

        return StateMachine.changeAndExecuteState(state, setStateMachineFunc, stateMachine, createRepelStateForCharacter(
            [getStateMachineFunc, setStateMachineFunc,
                getIdleClipIndexFunc, getControlledClipIndexFunc,
                createInitialStateFunc,
                getShadowQueueFunc,
            ]
        ), name, NullableUtils.return_([
            direction, distance, time,
            [matrix, box, name]
        ]))
    }
}


export let handleRepel = (state: state,
    direction: Vector3, distance, time,
    [matrix, box, name]
): Promise<state> => {
    if (isMilltaryBuilding(name)) {
        return Promise.resolve(state)
    }

    if (isLittleMan(name)) {
        return handleRepelLittleMan(state, direction, distance, time)
    }

    return handleRepelUtils(state, direction, distance, time, [matrix, box, name])
}

export let computeDistance = (state: state, fromName: name, fromBox: Box3, targetName: name, targetBox: Box3) => {
    let targetMaxSize = getBoxMaxSize(targetBox)

    let distance = computeMass(state, fromName, fromBox) / computeMass(state, targetName, targetBox)
    // * NumberUtils.clamp(forceSize_ / forceSize.Middle, 0.33, 3)

    if (distance < targetMaxSize * 0.1) {
        return 0
    }

    return NumberUtils.clamp(
        distance,
        targetMaxSize * 0.25,
        // targetMaxSize * 20
        targetMaxSize * 10
    )
}