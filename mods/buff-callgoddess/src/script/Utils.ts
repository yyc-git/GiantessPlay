import { api } from "type-api/src/Type"

export let getProtocolName = () => "buff-protocol"

export let getBlockName = () => "buff-callgoddess"

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
    return {
        oldValue: api.MutableRecordUtils.create(),
        // pauseTime: api.NullableUtils.getEmpty(),
        // startTime: -Infinity,
        startTime: api.MutableRecordUtils.create(),
    }
}