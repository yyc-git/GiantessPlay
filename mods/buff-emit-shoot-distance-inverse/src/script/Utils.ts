import { api } from "type-api/src/Type"

export let getProtocolName = () => "buff-protocol"

export let getBlockName = () => "buff-emit-shoot-distance-inverse"

// export let getBuffProtocolName = () => "buff-protocol"

// export let getBuffArmyIceSingleBlockName = () => "buff-army-ice-single"

// export let getBuffGiantessIceSingleBlockName = () => "buff-giantess-ice-single"

// export let getBuffLittleManIceSingleBlockName = () => "buff-littleman-ice-single"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleBlockName = () => "particle-effect-hit-icesingle"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"


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