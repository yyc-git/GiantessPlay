import { state as blockState } from "level-giantess-protocol/src/state/StateType"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "level-giantess-protocol"

export let getBlockName = () => "level-giantess-playergiantess"

export let getEventGameProtocolName = () => "event-game-protocol"

export let getEventGameBlockName = () => "event-game-callgiantess"

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<blockState>(state,
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

export let createState = (api: api): blockState => {
    return null
}
