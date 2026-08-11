import { state } from "frontend/src/scene3d_layer/type/StateType"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
// import { getName } from "../json/Data"
import { api } from "type-api/src/Type"
import { objectStateName, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

let _buildKey = () => "LittleMan_Fall"

export let createState = (api: api) => (): fsm_state<state> => {
    return {
        // name: getName(),
        name: objectStateName.Fall,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, _) => {
            let currentPoint = api.getLittleManWorldPosition(state)
            let targetPoint = api.vector3.setY(api.vector3.clone(currentPoint), 0)

            let validTargetPoint = api.NullableUtils.getWithDefault(
                api.findValidPosition(state, targetPoint),
                targetPoint
            )

            if (api.isNotInMovableRanges(state, usedGirlEnum.None, validTargetPoint)) {
                validTargetPoint = api.vector3.create(0, 0, 0)
            }

            state = api.littleMan.handleExitControlled(state, currentPoint)

            return api.buildMultipleTweens(state, [(state, object, _) => {
                // state = api.littleMan.setPosition(state, api.vector3.create(

                // if (!api.isDestoryRelatedStates(api.littleMan.getStateMachine(state))) {
                // if (api.StateMachine.isState(api.littleMan.getStateMachine(state), getName())) {
                if (api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Fall)) {
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
                return api.computeFallTime(api, previousData, currentData)
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

                    // if (api.isDestoryRelatedStates(api.littleMan.getStateMachine(state)) ) {

                    // if (!api.isFallState(api.littleMan.getStateMachine(state))) {
                    if (!api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Fall)) {
                        api.writeState(state)
                        return
                    }

                    return api.StateMachine.changeAndExecuteStateWithoutName(state, api.littleMan.setStateMachine, api.littleMan.getStateMachine(state), api.littleMan.createLieState(api.littleMan.getBox(state)), api.NullableUtils.getEmpty()).then(state => {
                        api.writeState(state)
                    })
                })

                return state
            })
        },
        exitFunc: (state: state) => {
            state = api.removeTweensByKey(state, _buildKey())

            return Promise.resolve(state)
        }
    }
}