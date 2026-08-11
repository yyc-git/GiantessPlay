import { fsm_state, lodQueueIndex, stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { isGirl } from "../girl/Girl"
import { damageType, objectStateName } from "../type/StateType"
import { isChangeToLieState } from "./CharacterUtils"
import { isControlledState, isDestoryRelatedStates, isFallState } from "./FSMStateUtils"
import { getAbstractState, setAbstractState } from "../../../../../business_layer/State"
import { LOD } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getModAPI } from "../Mod"
import { Flow } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { removeTweensByKey, setTweensByKey } from "../TweenManager"

export let isControlled = (isStressingFunc) => (state: state,
    fromName, damage, damageType_: damageType, direction, stateMachine: stateMachine<state>, box) => {
    if (isChangeToLieState(state, stateMachine, damageType_, direction)) {
        return true
    }

    if (isControlledState(state, stateMachine)) {
        return false
    }

    // if (isGirl(fromName)) {
    if (damageType_ == damageType.Direct) {
        return true
    }

    return isStressingFunc(state, stateMachine.name, damage, damageType_)
}

export let isChangeToFlattenState = (
    state,
    stateMachine,
    damage, damageType_,
    direction,
    fullHp,
    hp,
    fromName
) => {
    return isChangeToLieState(state, stateMachine, damageType_, direction)
        && isGirl(fromName)
        && (
            damage >= fullHp * 0.5
            || (
                hp <= fullHp * 1 / 3 && damage >= fullHp * 0.2
            )
            // damage >= fullHp * 0.05
        )
}

export let handleExitControlled = (state,
    getBodyQueueFunc,
    index: lodQueueIndex, currentPosition,
    originTransform
) => {
    let bodyQueue = getBodyQueueFunc(state)

    state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, index, true))

    bodyQueue.getTransform(index).copy(
        TransformUtils.setPositionToMatrix4(
            originTransform.clone(),
            currentPosition
        )
    )

    return state
}

let _buildFallKey = (name) => `${name}_Fall`

export let createFallState = (
    getStateMachineFunc,
    setStateMachineFunc,
    createInitialStateFunc,
) => (getBodyQueueFunc): fsm_state<state> => {
    return {
        name: objectStateName.Fall,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [
            name, index, queue,
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

            state = handleExitControlled(state,
                getBodyQueueFunc,
                index, validTargetPoint,
                originTransform
            )

            return api.buildMultipleTweens(state, [(state, object, _) => {
                // if (queue.isAlive(index)) {
                if (isFallState(getStateMachineFunc(state, name))) {
                    state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), queue.name, index, true))

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

                    // if (isDestoryRelatedStates(getStateMachineFunc(state, name))) {
                    if (!isFallState(getStateMachineFunc(state, name))) {
                        return
                    }

                    return api.StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createInitialStateFunc(), name, api.NullableUtils.return_(name))
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

export let createFlattenState = (
    getStateMachineFunc,
    setStateMachineFunc,
    createDestroyingStateFunc,
    getModelQueueIndexFunc,
    getModelQueueIndexNullableFunc,
    disposeDataFunc,
) => ([getBodyQueueFunc, setScaleYFunc,
    setStatusFunc,
    emitBodyExplodeFunc
],
    soundResourceId, weaponValue,
    //  damageType_,
    // matrix
    fromName,
    [matrix, box, name, damage, damageType_], forceDirection
): fsm_state<state> => {
        return {
            name: objectStateName.Flatten,
            enterFunc: (state: state, stateMachine) => {
                return Promise.resolve(state)
            },
            executeFunc: (state, _, stateMachine) => {
                // let name = stateMachine.name

                let bodyQueue = getBodyQueueFunc(state)

                let lODQueueIndex = getModelQueueIndexFunc(state, name)

                LOD.markNeedsUpdate(getAbstractState(state),
                    bodyQueue.name,
                    lODQueueIndex, true)


                let scale = TransformUtils.getScaleFromMatrix4(matrix)
                scale = setScaleYFunc(scale, 0.2)
                TransformUtils.setScaleToMatrix4(matrix,
                    scale
                )


                state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                    return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createDestroyingStateFunc([
                        setStatusFunc,
                        emitBodyExplodeFunc,
                        getModelQueueIndexNullableFunc,
                        disposeDataFunc,
                        getStateMachineFunc,
                        setStateMachineFunc,
                    ],
                        soundResourceId, weaponValue, damageType_
                    )(), name, NullableUtils.return_([
                        fromName,
                        [matrix, box, name, damage, damageType_], forceDirection
                    ]))
                }, 3))

                return Promise.resolve(state)
            },
            exitFunc: (state: state, stateMachine) => {
                return Promise.resolve(state)
            },
        }
    }
