import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-defense-stressing-decreasedamage"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"

// export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-single"


// export let getBuffProtocolName = () => "buff-protocol"

// export let getBuffArmyPoisonSingleBlockName = () => "buff-army-poison-single"

// export let getBuffGiantessPoisonSingleBlockName = () => "buff-levelMap-poison-single"



export let createState = (api: api): blockState => {
    return {
        levelMap: api.MutableRecordUtils.create()
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

export let removeData = (api: api, state, usedGirl) => {
    return setState(api, state,
        {
            ...getState(api, state),
            levelMap: api.MutableRecordUtils.remove(getState(api, state).levelMap, usedGirl)
        }
    )
}

export let getGiantessLevel = (api: api, state, usedGirl) => {
    return api.MutableRecordUtils.getWithDefault(
        getState(api, state).levelMap,
        usedGirl,
        0
    )
}

export let setGiantessLevel = (api: api, state, usedGirl, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            levelMap: api.MutableRecordUtils.set(getState(api, state).levelMap, usedGirl, value)
        }
    )
}