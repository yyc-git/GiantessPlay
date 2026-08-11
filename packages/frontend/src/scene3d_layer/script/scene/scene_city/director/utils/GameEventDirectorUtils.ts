import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getState, setState } from "../../CityScene"
import { getNow } from "../../Time"
import { eventName } from "../../data/director/GameEventDirectorData"
import { gameEventDirector, singleImpendingGameEventData, singleInstantGameEventData } from "../../type/StateType"
import { hasAnyImpendingGameEventData } from "../GameEventDirector"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

let _getState = (state): gameEventDirector => {
    return getState(state).gameEventDirector
}

let _setState = (state, gameEventState: gameEventDirector) => {
    return setState(state, {
        ...getState(state),
        gameEventDirector: gameEventState
    })
}

export let addImpendingGameEventData = (state: state, data: singleImpendingGameEventData) => {
    if (hasAnyImpendingGameEventData(state)) {
        return state
    }

    return _setState(state, {
        ..._getState(state),
        // impendingGameEventData: _getState(state).impendingGameEventData.push(data)
        impendingGameEventData: NullableUtils.return_(data)
    })
}

export let addInstantGameEventData = (state: state, data: singleInstantGameEventData) => {
    return _setState(state, {
        ..._getState(state),
        instantGameEventData: _getState(state).instantGameEventData.push(data)
    })
}
