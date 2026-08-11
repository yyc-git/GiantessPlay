import { api } from "type-api/src/Type"

export let getProtocolName = () => "buff-protocol"

export let getBlockName = () => "buff-emit-poison-single"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffArmyPoisonSingleBlockName = () => "buff-army-poison-single"

export let getBuffGiantessPoisonSingleBlockName = () => "buff-giantess-poison-single"

export let getBuffLittleManPoisonSingleBlockName = () => "buff-littleman-poison-single"

export let getParticleProtocolName = () => "particle-protocol"

export let getParticleBlockName = () => "particle-effect-hit-poisonsingle"

export let getParticleShareProtocolName = () => "particle-share-protocol"

export let getParticleShareBlockName = () => "particle-share-default"


export let getState = (api: api, state):any => {
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