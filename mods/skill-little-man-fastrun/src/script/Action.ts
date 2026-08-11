import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"

let _handleFastRunAction = (api: api, state: state) => {
    // if (api.littleMan.isActionState(state, littleManActionState.Run)) {
    //     state = api.littleMan.setActionState(state, littleManActionState.Initial)

    //     return state
    // }

    state = api.littleMan.setActionState(state, littleManActionState.Run)

    return state
}



export let isActionValid = (api: api, state: state, name: actionName) => {
    if (api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Climb) && !api.isCanActionWhenClimb(state)) {
        // switch (name) {
        //     case getActionName():
        return false
        // }
    }

    // if (api.littleMan.isActionState(state, littleManActionState.Run)) {
    //     return true
    // }

    // if (!api.littleMan.isActionState(state, littleManActionState.Initial)) {
    //     return false
    // }


    // if (api.littleMan.isActionState(state, littleManActionState.Run) || api.littleMan.isActionState(state, littleManActionState.Initial)) {
    if (api.littleMan.isActionState(state, littleManActionState.Initial)) {
        return true
    }

    return false
}

export let triggerAction = (api: api, state, name: actionName): Promise<state> => {
    switch (name) {
        case getActionName():
            state = _handleFastRunAction(api, state)
            break
    }

    return Promise.resolve(state)
}

export let fastRunStartHandler = (api: api, state: state, eventData) => {
    return Promise.resolve(state)
}
