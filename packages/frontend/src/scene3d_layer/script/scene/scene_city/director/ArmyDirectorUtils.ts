import { state } from "../../../../type/StateType"
import { getState, setState } from "../CityScene"
import { armyDirector } from "../type/StateType"

export let getArmyDirectorState = (state): armyDirector => {
    return getState(state).armyDirector
}

export let setArmyDirectorState = (state, armyDirectorState: armyDirector) => {
    return setState(state, {
        ...getState(state),
        armyDirector: armyDirectorState
    })
}

// export let getArmyCountRatio = (state: state) => {
//     return getArmyDirectorState(state).armyCountRatio
// }

// export let setArmyCountRatio = (state: state, value) => {
//     return setArmyDirectorState(state, {
//         ...getArmyDirectorState(state),
//         armyCountRatio: value
//     })
// }

// export let computeArmyCount = (state: state, count) => {
//     return Math.round(count * (1 + getArmyCountRatio(state)))
// }
