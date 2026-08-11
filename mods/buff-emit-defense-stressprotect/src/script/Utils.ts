import { api } from "type-api/src/Type"

export let getProtocolName = () => "buff-protocol"

export let getBlockName = () => "buff-emit-defense-stressprotect"

// export let getBuffProtocolName = () => "buff-protocol"

export let getBuffArmyBlockName = () => "buff-army-stressprotect"

export let getBuffLittleManBlockName = () => "buff-littleman-stressprotect"

export let getBuffGiantessBlockName = () => "buff-giantess-stressprotect"

export let getBuffBossBlockName = () => "buff-bossstatus-stressprotect"



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
        // customData: {
        //     lastTime: 0
        // }
    }
}