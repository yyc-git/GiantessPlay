import { api } from "type-api/src/Type"
import { getStateMachine, setStateMachine } from "./Utils"
import { damageType, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"

export let getDeathClipIndex = (api: api, deathClipIndex, deathHeadshotClipIndex, lieClipIndex) => {
    return (name, damageType_, stateMachine) => {
        if (
            api.StateMachine.isPreviousState(stateMachine, objectStateName.Lie)
            || api.StateMachine.isPreviousState(stateMachine, objectStateName.Standup)
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

export let createInitialState = (
    api: api,
    getIdleClipIndexFunc
) => {
    return () => {
        return {
            name: objectStateName.Initial,
            enterFunc: (state) => Promise.resolve(state),
            executeFunc: (state, name) => {
                let clipIndex = getIdleClipIndexFunc(name)

                state = api.setAbstractState(state, api.GPUSkin.playLoop(
                    api.getAbstractState(state),
                    name, clipIndex
                ))

                return Promise.resolve(state)
            },
            exitFunc: (state: state) => Promise.resolve(state),
        }
    }
}

let _playLieAnimation = (api: api, state: state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex) => {
    state = api.setAbstractState(state, api.GPUSkin.playOnce(
        api.getAbstractState(state),
        (state) => {
            api.checkCurrentState(state, getStateMachine(api), name, objectStateName.Lie)

            if (api.NullableUtils.isNullable(api.queryOBBShapeCollisionWithBox(state, box, api.box3.getCenter(box, api.vector3.getTempVector1()), false))) {
                return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createStandupState(api)(
                    getIdleClipIndexFunc, getStandupClipIndexFunc(name)
                ), name, api.NullableUtils.getEmpty())
            }

            return _playLieAnimation(api, state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex)
        },
        name, clipIndex
    ))

    return Promise.resolve(state)
}

export let createLieState = (api: api) => ([getIdleClipIndexFunc, getStandupClipIndexFunc], clipIndex, box, matrix): fsm_state<state> => {
    let originBox = api.box3.clone(box)

    return {
        name: objectStateName.Lie,
        enterFunc: (state: state, stateMachine) => {
            api.changeStandBoxToLieBox(box)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            return _playLieAnimation(api, state, [getIdleClipIndexFunc, getStandupClipIndexFunc], name, box, clipIndex)
        },
        exitFunc: (state: state, stateMachine) => {
            // box.copy(originBox)
            api.box3.copy(box, originBox)

            return Promise.resolve(state)
        },
    }
}

export let createStandupState = (api: api) => (getIdleClipIndexFunc, clipIndex: number): fsm_state<state> => {
    return {
        name: objectStateName.Standup,
        enterFunc: (state: state, stateMachine) => Promise.resolve(state),
        executeFunc: (state, _, stateMachine) => {
            let name = stateMachine.name

            state = api.setAbstractState(state, api.GPUSkin.playOnce(
                api.getAbstractState(state),
                (state) => {
                    api.checkCurrentState(state, getStateMachine(api), name, objectStateName.Standup)

                    return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createInitialState(
                        api,
                        getIdleClipIndexFunc
                    )(), name, api.NullableUtils.return_(name))
                },
                name, clipIndex
            ))

            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => Promise.resolve(state),
    }

}

export let createControlledState = (
    api: api,
    getControlledClipIndexFunc,
    name
) => {
    return () => {
        return {
            name,
            enterFunc: (state) => Promise.resolve(state),
            executeFunc: (state, _, stateMachine) => {
                let name = stateMachine.name

                let clipIndex = getControlledClipIndexFunc(name)

                state = api.setAbstractState(state, api.GPUSkin.playLoop(
                    api.getAbstractState(state),
                    name, clipIndex
                ))

                return Promise.resolve(state)
            },
            exitFunc: (state: state, stateMachine) => Promise.resolve(state),
        }
    }
}

export let createFallState = (api: api) => (getIdleClipIndexFunc, getStandupClipIndexFunc, clipIndex: number,
    // box, matrix
): fsm_state<state> => {
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

            return api.buildMultipleTweens(state, [(state, object, _) => {
                // if (queue.isAlive(index)) {
                if (api.isFallState(getStateMachine(api)(state, name))) {
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

                api.NullableUtils.getExn(lastTween).onComplete(() => {
                    let state = api.readState()

                    api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)

                    // if (api.isDestoryRelatedStates(getStateMachine(api)(state, name))) {
                    if (!api.isFallState(getStateMachine(api)(state, name))) {
                        return
                    }


                    return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createLieState(
                        api,
                    )([
                        getIdleClipIndexFunc,
                        getStandupClipIndexFunc
                    ], clipIndex,
                        // box, matrix
                        // api.NullableUtils.getExn(queue.getBox(index)),
                        // api.NullableUtils.getExn(queue.getTransform(index)),
                        api.getBoxForPick(state, queue, index, name),
                        api.getLocalTransform(state, queue, index, name)
                    ), name, api.NullableUtils.return_(name)).then(state => {
                        api.writeState(state)
                    })
                })

                return state
            })
        },
        exitFunc: (state: state) => {
            return Promise.resolve(state)
        }
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
//         getStateMachine(api)(state, name),
//         false, true)

//     return api.vector3.add(
//         api.vector3.clone(currentPoint), velocity)
// }

// export let createRepelState = (api: api) => (getIdleClipIndexFunc, getControlledClipIndexFunc
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
//             let currentPoint = api.TransformUtils.getPositionFromMatrix4(matrix)

//             let validTargetPoint = _findTargetPoint(api, state, currentPoint, api.vector3.fromArray(api.vector3.createEmpty(), direction), distance, name, box)

//             let queue = api.LOD.getLODQueue(api.getAbstractState(state), name)
//             let index = queue.getIndex(name)


//             state = api.setAbstractState(state, api.GPUSkin.playLastFrame(
//                 api.getAbstractState(state),
//                 name, getControlledClipIndexFunc(name)
//             ))

//             return api.buildMultipleTweens(state, [(state, object, _) => {
//                 if (queue.isAlive(index)) {
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

//                     if (api.isDestoryRelatedStates(getStateMachine(api)(state, name))) {
//                         return
//                     }


//                     return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createInitialState(
//                         api,
//                         getIdleClipIndexFunc
//                     )(), name, api.NullableUtils.return_(name)).then(state => {
//                         api.writeState(state)
//                     })
//                 })

//                 return state
//             })
//         },
//         exitFunc: (state: state) => {
//             return Promise.resolve(state)
//         }
//     }
// }