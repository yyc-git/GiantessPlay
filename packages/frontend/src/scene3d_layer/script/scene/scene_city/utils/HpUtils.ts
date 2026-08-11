import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { objectStateName } from "../type/StateType"
import { getStatusUpdateLoops } from "../girl/Girl"
import { getNow } from "../Time"
import { computeRestoreHpSpeedRate } from "../difficulty/HeatImplementer"
import { isDestoryRelatedStates, isNotDamageState } from "./FSMStateUtils"

export let restoreHp = (state: state,
    [getRestoreValueFunc,
        getLastDamageTimeFunc,
        addHpFunc,
        getHpFunc,
        getFullHpFunc,
        getStateMachineFunc
    ],
    key,
    characterType
) => {
    // return state
    // return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        let stateMachine = getStateMachineFunc(state)

        if (!isDestoryRelatedStates(stateMachine) && getHpFunc(state) > 0) {
            let [restoreHpTime, restoreHpSpeedRate] = getRestoreValueFunc(state)

            restoreHpSpeedRate = computeRestoreHpSpeedRate(state, restoreHpSpeedRate, characterType)

            let elapsed = getNow(state) - getLastDamageTimeFunc(state)

            if (elapsed > restoreHpTime && !StateMachine.isState(
                stateMachine,
                objectStateName.Destroyed
            )) {
                state = addHpFunc(state, getFullHpFunc(state) * restoreHpSpeedRate)
            }
        }

        return Promise.resolve(restoreHp(state,
            [getRestoreValueFunc,
                getLastDamageTimeFunc,
                addHpFunc,
                getHpFunc,
                getFullHpFunc,
                getStateMachineFunc,
            ],
            key,
            characterType
        ))
        // }, getStatusUpdateLoops(), key))
    }, 1.5, key))
}