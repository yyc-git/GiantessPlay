import { state } from "event-game-protocol/src/state/StateType"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "event-game-protocol"

export let getBlockName = () => "event-game-protect-level-giantess1"

export let getBehaviourProtocolName = () => "behaviour-protocol"

export let getBehaviourBlockName = () => "behaviour-balance"

export let getLevelGiantessProtocolName = () => "level-giantess-protocol"

export let getLevelGiantessBlockName = () => "level-giantess-protect-boss1"

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<state>(state,
        getProtocolName(),
        getBlockName()
    )
}

export let setState = (api: api, state, s) => {
    return api.blockAPI.setBlockState(state,
        getProtocolName(),
        getBlockName(),
        s
    )
}

export let getTriggerCount = (api: api, state) => {
    return getState(api, state).triggerCount
}

export let setTriggerCount = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            triggerCount: value
        }
    )
}

export let addTriggerCount = (api: api, state) => {
    return setTriggerCount(api, state, getTriggerCount(api, state) + 1)
}

export let createState = (api: api): state => {
    return {
        triggerCount: 0
    }
}