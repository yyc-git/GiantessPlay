import { state } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "prop-other-protocol"

export let getBlockName = () => "prop-artifact-specificgiantess"

export let getMMDProtocolName = () => "mmd-character-protocol"


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
