import { api } from "type-api/src/Type"

export let getProtocolName = () => "buff-protocol"

export let getBlockName = () => "buff-bossstatus-passivebigger"

export let getUpgradeProtocolName = () => "upgrade-protocol"

export let getUpgradeBlockName = () => "upgrade-skill-passivebigger"

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState(state,
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

export let createState = (api: api) => {
    // return {
    //     oldValue: api.NullableUtils.getEmpty(),
    // pauseTime: api.NullableUtils.getEmpty(),
    //     startTime: -Infinity,
    // }
    return null
}