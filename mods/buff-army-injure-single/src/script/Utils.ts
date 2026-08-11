import { api } from "type-api/src/Type"

export let getProtocolName = () =>  "buff-protocol"

export let getBlockName = () =>  "buff-army-injure-single"

export let getParticleProtocolName = () => "particle-protocol"

export let getParticleBlockName = () => "particle-effect-injure-damage"

export let getParticleShareProtocolName = () => "particle-share-protocol"

export let getParticleShareBlockName = () => "particle-share-default"


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
        oldValue: api.NullableUtils.getEmpty(),
pauseTime: api.NullableUtils.getEmpty(),
        startTime: -Infinity,
    }
}