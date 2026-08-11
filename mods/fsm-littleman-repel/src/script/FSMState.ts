import { state } from "frontend/src/scene3d_layer/type/StateType"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getName } from "../json/Data"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"


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

let _findTargetPoint = (api: api, state, currentPoint, direction, distance) => {
    let velocity = api.computeMovableVelocity(state,
        api.littleMan.updateMoveCollision, api.getLittleManName(),
        _computeVelocity(api, currentPoint, direction, distance),
        currentPoint, api.littleMan.getBox(state), api.littleMan.getStateMachine(state), false, true)

    return api.vector3.add(
        api.vector3.clone(currentPoint), velocity)
}

let _buildKey = () => "LittleMan_Repel"

export let createState = (api: api) => (): fsm_state<state> => {
    return {
        // name: getName(),
        name: objectStateName.Repel,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [direction, distance, time]) => {
            // let height = api.box3.getSize(api.littleMan.getBox(state), api.vector3.createEmpty()).y / 3

            let currentPoint = api.getLittleManWorldPosition(state)

            let validTargetPoint = _findTargetPoint(api, state, currentPoint, direction, distance)

            // state = api.littleMan.handleExitControlled(state, currentPoint)

            return api.littleMan.triggerAction(state, actionName.PickedControlled).then(state => {
                return api.buildMultipleTweens(state, [(state, object, _) => {
                    // state = api.littleMan.setPosition(state, api.vector3.create(

                    // if (!api.isDestoryRelatedStates(api.littleMan.getStateMachine(state))) {
                    if (api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Repel)) {
                        state = api.littleMan.updatePosition(state, api.vector3.create(
                            object.x,
                            object.y,
                            object.z,
                        )
                            // , api.getLittleManWorldPosition(state),
                            //     api.littleMan.setWorldPositionAndComputeBox
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
                    return time
                    // return 3000
                }], [
                    currentPoint, validTargetPoint
                ]).then(d => {
                    state = d[0]
                    let lastTween = d[1]
                    let allTweens = d[2]

                    state = api.setTweensByKey(state, _buildKey(), allTweens)

                    api.NullableUtils.getExn(lastTween).onComplete(() => {
                        let state = api.readState()

                        // api.ArticluatedAnimation.removeTweens(api.getAbstractState(state), allTweens)
                        state = api.removeTweensByKey(state, _buildKey())

                        // if (api.isDestoryRelatedStates(api.littleMan.getStateMachine(state))) {
                        if (!api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Repel)) {
                            return
                        }

                        return api.StateMachine.changeAndExecuteStateWithoutName(state, api.littleMan.setStateMachine, api.littleMan.getStateMachine(state), api.littleMan.createInitialState(), api.NullableUtils.getEmpty()).then(state => {
                            return api.littleMan.triggerAction(state, actionName.Idle)
                                .then(api.writeState)
                        })
                    })

                    return state
                })
            })
        },
        exitFunc: (state: state) => {
            state = api.removeTweensByKey(state, _buildKey())

            return Promise.resolve(state)
        }
    }
}