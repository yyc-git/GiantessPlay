import { StateMachine } from "meta3d-jiehuo-abstract"
import { objectStateName } from "../type/StateType"
import { stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"

export let isNotDamageState = (stateMachine) => {
    return !(StateMachine.isState(stateMachine, objectStateName.Stressing)
        || StateMachine.isState(stateMachine, objectStateName.Destroying)
        || StateMachine.isState(stateMachine, objectStateName.Destroyed))
}

export let isDestoryRelatedStates = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Destroying)
        || StateMachine.isState(stateMachine, objectStateName.Destroyed)
}

export let isControlledState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Controlled)
}

export let isStressingState = (stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Stressing)
}
