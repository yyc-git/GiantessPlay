import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-skill-injure-single"

export let getParticleProtocolName = () => "particle-protocol"

export let getParticleBlockName = () => "particle-effect-hit-injuresingle"

export let getParticleShareProtocolName = () => "particle-share-protocol"

export let getParticleShareBlockName = () => "particle-share-default"



export let getBuffProtocolName = () => "buff-protocol"

export let getBuffArmyInjureSingleBlockName = () => "buff-army-injure-single"

export let getBuffGiantessInjureSingleBlockName = () => "buff-giantess-injure-single"



export let createState = (api: api): blockState => {
    return {
        littleMan: {
            //// TODO restore
            level: 0,
            // level: 1,
            // handledArmyMap: api.MutableRecordUtils.create(),
            // handledGiantessMap: api.MutableRecordUtils.create(),
        },
        // giantess: {
        //     //// TODO restore
        //     level: 0,
        //     // level: 1,
        //     // handledArmyMap: api.MutableRecordUtils.create(),
        //     // handledGiantessMap: api.MutableRecordUtils.create(),
        // },
    }
}

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

export let getLittleManLevel = (api: api, state) => {
    return getState(api, state).littleMan.level
}

export let setLittleManLevel = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            littleMan: {
                ...getState(api, state).littleMan,
                level: value
            }
        }
    )
}