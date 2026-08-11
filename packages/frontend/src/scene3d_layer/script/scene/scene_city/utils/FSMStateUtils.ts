import { StateMachine } from "meta3d-jiehuo-abstract"
import { objectStateName } from "../type/StateType"
import { stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"
import { isControlledState as isControlledStateMod } from "../../../../mod/FSMMod"
import { NullableUtils } from "meta3d-jiehuo-abstract"

export let isNotDamageState = (stateMachine) => {
    // return !(
    //     // isControlledState(state, stateMachine)
    //     StateMachine.isState(stateMachine, objectStateName.Destroying)
    //     || StateMachine.isState(stateMachine, objectStateName.Destroyed))
    return !isDestoryRelatedStates(stateMachine)
}

export let isDestoryRelatedStates = (stateMachine) => {
    return NullableUtils.isNullable(stateMachine)
        || StateMachine.isState(stateMachine, objectStateName.Destroying)
        || StateMachine.isState(stateMachine, objectStateName.Destroyed)
        || StateMachine.isState(stateMachine, objectStateName.Flatten)
}

export let isPickedControlledState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.PickedControlled)
}

export let isUBControlledState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.UBControlled)
}

export let isBreastControlledState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.BreastControlled)
}

export let isShoeControlledState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.ShoeControlled)
}

export let isFallState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Fall)
}

export let isRepelState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Repel)
}

export let isGiantessControlledState = (stateMachine: stateMachine<state>) => {
    return isPickedControlledState(stateMachine)
        || isUBControlledState(stateMachine)
        || isBreastControlledState(stateMachine)
        || isShoeControlledState(stateMachine)
}

export let isControlledStateExceptStressing = (state: state, stateMachine: stateMachine<state>) => {
    return isLieState(stateMachine)
        || isFallState(stateMachine)
        || isRepelState(stateMachine)
        || isGiantessControlledState(stateMachine)
        || isControlledStateMod(state, stateMachine)
}

export let isControlledState = (state: state, stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Stressing)
        || isControlledStateExceptStressing(state, stateMachine)
}

export let isStressingState = (state: state, stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Stressing)
}

export let isInitialState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Initial)
}

export let isStandupState = (stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Standup)
}

export let isLieState = (stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Lie) || StateMachine.isState(stateMachine, objectStateName.Standup)
}


export let isMoveState = (stateMachine) => {
    return StateMachine.isState(stateMachine, objectStateName.Move)
}


export let isFlattenState = (state: state, stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Flatten)
}