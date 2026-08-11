import { api } from "type-api/src/Type";
import { getState, getStateMachine, setState, setStateMachine } from "./Utils";

let _hasMoveData = api => (state, name) => {
    return getState(api, state).moveDataMap.has(name)
}

let _setMoveData = api => (state, name, moveData) => {
    return setState(api, state, {
        ...getState(api, state),
        moveDataMap: api.MutableMapUtils.set(getState(api, state).moveDataMap, name, moveData)
    })
}

export let updateAI = (api: api, state,
    [
        createAttackStateFunc,
        createInitialStateFunc,
        createMoveStateFunc,
        getWeaponValueFunc
    ],
    queue
) => {
    return api.updateEliteGiantessAI(state,
        [
            getStateMachine(api),
            setStateMachine(api),
            createAttackStateFunc,
            createInitialStateFunc,
            createMoveStateFunc,
            _hasMoveData(api),
            _setMoveData(api),
            getWeaponValueFunc
        ],
        queue.getValidData(api.getAbstractState(state)),
    )
}