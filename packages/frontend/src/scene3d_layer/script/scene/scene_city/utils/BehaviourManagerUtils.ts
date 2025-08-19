import { state } from "../../../../type/StateType"
import { getState, setState } from "../CityScene"
import { getKey } from "../behaviour_tree/BehaviourTreeManager"
import { behaviourTree } from "../type/StateType"

export let getBehaviourTreeState = (state: state): behaviourTree => {
    return getState(state).behaviourTree
}

export let setBehaviourTreeState = (state: state, behaviourTreeState: behaviourTree) => {
    return setState(state, {
        ...getState(state),
        behaviourTree: behaviourTreeState
    })
}

export let markIsRunning = (state: state, isRunning: boolean, key = getKey()) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        isRunningMap: getBehaviourTreeState(state).isRunningMap.set(key, isRunning)
    })
}
