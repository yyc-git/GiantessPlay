import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { StaticLODContainer } from "meta3d-jiehuo-abstract"
import { getState, setState } from "../../CityScene"
import { Render } from "meta3d-jiehuo-abstract"
import { Box3, DataUtils, DoubleSide, Group, Matrix4, Object3D, Quaternion, TextureLoader, Vector3 } from "three"
import { getIsDebug } from "../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { objectStateName, treeAndProp } from "../../type/StateType"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../Pick"
// import { getPlayerCollisionableContainers, setPlayerCollisionableContainers } from "meta3d-jiehuo-abstract/src/collision/Collision"
import { Loader } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { assertTrue, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { Flow } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { buildDownDirection, buildRandomDirection, buildRandomDirectionInXZ, computeDirectionAxis } from "../../../../../utils/DirectionUtils"
import { round, toRadians } from "../../../../../utils/QuatUtils"
// import * as DamageUtils from "../../utils/DamageUtils"
import * as DamageUtils from "../../utils/DamageUtils"
import { buildDestroyedEventData, getDestroyedEventName } from "../../utils/EventUtils"
import { Collision } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { articluatedAnimationName, defenseFactor, excitement, hp } from "../../data/DataType"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../data/DataUtils"
import { getTransformData, updateRotateTween } from "../../data/InstancedLOD2Utils"
import { objectValue } from "../../data/ValueType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { buildStatus } from "../../utils/LODContainerUtils"
import { LOD } from "meta3d-jiehuo-abstract"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const zAxis = new Vector3(0, 0, 1)


let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).treeAndProp)
}

let _setState = (state: state, treeState: treeAndProp) => {
    return setState(state, {
        ...getState(state),
        treeAndProp: NullableUtils.return_(treeState)
    })
}

export let getNamePrefix = () => "Tree"

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

export let buildTreeName = (categoryName, index) => `${categoryName}_${index}`

export let isTreesAndProps = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state: state): objectValue => {
    return {
        excitement: excitement.Low,
        defenseFactor: defenseFactor.Middle,
        hp: hp.Low
    }
}

export let addStaticLODContainerData = (state: state,
    staticLODContainer,
    details,
) => {
    return _setState(state, {
        ..._getState(state),
        treesAndProps: push(_getState(state).treesAndProps, [
            staticLODContainer,
            details,
            staticLODContainer.name
        ])
    })
}

export let createState = (): treeAndProp => {
    return {
        treesAndProps: [],
        // low: null,
        // damageAnimationStatusMap: Map(),
        stateMachineMap: Map(),
        defenseFactorMap: Map(),
        hpMap: Map(),
    }
}

// let _pickEventHandler = (state: state, { userData }) => {
//     let targets = NullableUtils.getExn(userData).targets

//     if (targets.count() == 0) {
//         if (getIsDebug(state)) {
//             state = setBoxCube(state, NullableUtils.getEmpty())
//         }

//         return Promise.resolve(state)

//     }

//     Console.log(
//         targets.get(0)
//     )

//     let [distance, _, data] = targets.get(0)
//     let [transform, box, name] = NullableUtils.getExn(data)

//     if (getIsDebug(state)) {
//         state = setBoxCube(state, NullableUtils.return_(box))
//     }

//     return Promise.resolve(state)
// }

export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    // abstractState = Event.on(abstractState, Pick.getPickEventName(), _pickEventHandler)

    // abstractState = Scene.setPickableOctrees(abstractState,
    //     Scene.getPickableOctrees(abstractState).concat(_getState(state).treesAndProps.map(data => data[0]))
    // )

    // abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(_getState(state).treesAndProps.map(data => data[0])))

    state = setAbstractState(state, abstractState)

    return Promise.resolve(state)
}

// let _updateDamageStatus = (state, name, status) => {
//     return _setState(state, {
//         ..._getState(state),
//         damageAnimationStatusMap: _getState(state).damageAnimationStatusMap.set(name, status)
//     })
// }

// let _getDamageStatus = (state, name) => {
//     return NullableUtils.getExn(_getState(state).damageAnimationStatusMap.get(name))
// }

let _getDefenseFactor = (state, name) => {
    return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
}

let _getFullHp = (state: state) => {
    return getValue(state).hp
}

let _getHp = (state, name) => {
    return NullableUtils.getExn(_getState(state).hpMap.get(name))
}

let _updateHp = (state, name, hp) => {
    return _setState(state, {
        ..._getState(state),
        hpMap: _getState(state).hpMap.set(name, hp)
    })
}

// let _handleStressing = (state, _, [matrixs, boxes, names, damages], direction) => {
//     let articluatedAnimationData = findArticluatedAnimationData(state,articluatedAnimationName.Stressing_Rotate1)

//     return names.reduce((state, name, i) => {
//         let matrix = matrixs[i]
//         let damage = damages[i]


//         let [position, quat, scale] = getTransformData(matrix)

//         playArticluatedAnimation(state,
//             [
//                 object => {
//                     updateRotateTween(matrix, object, position, quat.clone(), scale, zAxis)
//                 },
//                 state => {
//                 },
//                 state => {
//                     let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(name))
//                     let amplitude = DamageUtils.clamp(30 * damageRadio, 30)
//                     let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)

//                     return [amplitude, timeScalar]
//                 },
//                 (tweenFirst, tweenLast) => {
//                     DamageUtils.handleTweenRepeatComplete(_updateDamageStatus, tweenFirst, tweenLast, articluatedAnimationData.repeatCount, name)
//                 }
//             ],
//             articluatedAnimationData
//         )

//         return state
//     }, state)
// }

// let _handleDestroyed = (state, octree, name) => {
//     return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(octree, name)).then(state => {
//         octree.setStatus(name, buildStatus(false, false, true))

//         return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
//             octree.setStatus(name, buildStatus(false, false, false))

//             return Promise.resolve(state)
//         }, DamageUtils.getDisappearLoopCount()))
//     })
// }

// let _playDestroyingAnimation = (state, octree, [matrixs, boxes, names, damages], forceDirection) => {
//     let articluatedAnimationData = findArticluatedAnimationData(state,articluatedAnimationName.Destroyed_Rotate1)

//     return names.reduce((state, name, i) => {
//         let matrix = matrixs[i]
//         // let box = boxes[i]
//         let damage = damages[i]

//         let isDownDirection = forceDirection.equals(buildDownDirection())

//         let axis = isDownDirection ? computeDirectionAxis(buildRandomDirectionInXZ(), getIsDebug(state)) : computeDirectionAxis(forceDirection, getIsDebug(state))


//         let [position, quat, scale] = getTransformData(matrix)

//         playArticluatedAnimation(state,
//             [
//                 object => {
//                     updateRotateTween(matrix, object, position, quat.clone(), scale, axis)
//                 },
//                 state => {
//                 },
//                 state => {
//                     let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(name))
//                     let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)

//                     return timeScalar
//                 },
//                 (tweenFirst, tweenLast) => {
//                     tweenLast.onComplete(() => {
//                         let state = readState()

//                         state = _updateDamageStatus(state, name.Destroyed)

//                         return _handleDestroyed(state, octree, name).then(writeState)
//                     })
//                 }
//             ],
//             articluatedAnimationData
//         )

//         // let object = { euler: 0 }
//         // let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
//         //     .to({ euler: 90 }, 1000 * timeScalar)
//         //     .onUpdate(() => {
//         //         _updateTween(matrix, object, position, quat.clone(), scale, axis)
//         //     })
//         //     .onComplete(() => {
//         //         let state = readState()

//         //         state = _updateDamageStatus(state, name.Destroyed)

//         //         return _handleDestroyed(state, octree, name).then(writeState)
//         //     })

//         // tween.start()

//         return state
//     }, state)
// }

export let createInitialState = (): fsm_state<state> => {
    return {
        name: objectStateName.Initial,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => Promise.resolve(state),
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createStressingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Stressing,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, [
            _,
            [matrix, box, name, damage], direction
        ]: any) => {
            let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Stressing_Rotate1)

            let [position, quat, scale] = getTransformData(matrix)

            playArticluatedAnimation(state,
                [
                    object => {
                        updateRotateTween(matrix, object, position, quat.clone(), scale, zAxis)
                    },
                    state => {
                    },
                    state => {
                        let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(state))
                        let amplitude = DamageUtils.clamp(30 * damageRadio, 30)
                        let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)

                        return [amplitude, timeScalar]
                    },
                    (allTweens) => {
                        DamageUtils.handleTweenRepeatComplete(
                            [
                                _getStateMachine,
                                _setStateMachine,
                                createInitialState
                            ],

                            allTweens, articluatedAnimationData.repeatCount, name)
                    }
                ],
                articluatedAnimationData
            )

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createDestroyedState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroyed,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state,
            [fromName, name]
        ) => {
            return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(fromName, name)).then(state => {
                return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                    LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, false))

                    return Promise.resolve(state)
                }, DamageUtils.getDisappearLoopCount()))
            })

        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createDestroyingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroying,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, [
            fromName,
            [matrix, box, name, damage], forceDirection
        ]: any) => {
            LOD.setStatusByName(getAbstractState(state), name, buildStatus(false, false, true))


            let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Destroyed_Rotate1)

            let isDownDirection = forceDirection.equals(buildDownDirection())

            let axis = isDownDirection ? computeDirectionAxis(buildRandomDirectionInXZ(), getIsDebug(state)) : computeDirectionAxis(forceDirection, getIsDebug(state))


            let [position, quat, scale] = getTransformData(matrix)

            playArticluatedAnimation(state,
                [
                    object => {
                        updateRotateTween(matrix, object, position, quat.clone(), scale, axis)
                    },
                    state => {
                    },
                    state => {
                        let damageRadio = DamageUtils.computeDamageRadio(damage, _getFullHp(state))
                        let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)

                        return timeScalar
                    },
                    (allTweens) => {
                        allTweens[allTweens.length - 1].onComplete(() => {
                            let state = readState()

                            ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

                            return StateMachine.changeAndExecuteState(state, _setStateMachine, _getStateMachine(state, name), createDestroyedState(), name, [fromName, name]).then(writeState)
                        })
                    }
                ],
                articluatedAnimationData
            )

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

let _getStateMachine = (state: state, name: string) => {
    return NullableUtils.getExn(_getState(state).stateMachineMap.get(name))
}

let _setStateMachine = (state: state, name: string, stateMachine) => {
    return _setState(state, {
        ..._getState(state),
        stateMachineMap: _getState(state).stateMachineMap.set(name, stateMachine)
    })
}

export let damage = (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
    return DamageUtils.damage(
        state, [
        _getDefenseFactor, _getHp, _updateHp,

        _getStateMachine,
        _setStateMachine,
        createStressingState,
        createDestroyingState,
    ], forceData, fromName, damagePosition, transforms, boxes, names,
    )
}

export let initialAttributes = (state, name) => {
    return _setState(state, {
        ..._getState(state),
        // damageAnimationStatusMap: _getState(state).damageAnimationStatusMap.set(name.Initial),
        stateMachineMap: _getState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
        defenseFactorMap: _getState(state).defenseFactorMap.set(name, getValue(name).defenseFactor),
        hpMap: _getState(state).hpMap.set(name, _getFullHp(state)),
    })
}

export let dispose = (state: state) => {
    // state = setAbstractState(state, Event.off(getAbstractState(state), Pick.getPickEventName(), _pickEventHandler))

    _getState(state).treesAndProps.forEach(([staticLODContainer,
        details,
        name
    ]) => {
        staticLODContainer.dispose()
    })

    state = _setState(state, createState())

    return Promise.resolve(state)
}