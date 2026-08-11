import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-defense-buqu"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"

// export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-single"


// export let getBuffProtocolName = () => "buff-protocol"

// export let getBuffArmyPoisonSingleBlockName = () => "buff-army-poison-single"

// export let getBuffGiantessPoisonSingleBlockName = () => "buff-levelMap-poison-single"



export let createState = (api: api): blockState => {
    return {
        littleMan: {
            level: 0,
            // level: 1,
            oldValue: api.NullableUtils.getEmpty()
        },
        giantess: {
            level: 0,
            // level: 1,
            oldValue: api.NullableUtils.getEmpty()
        },
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

export let getLittleManOldValue = (api: api, state) => {
    return getState(api, state).littleMan.oldValue
}

export let setLittleManOldValue = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            littleMan: {
                ...getState(api, state).littleMan,
                oldValue: api.NullableUtils.return_(value)
            }
        }
    )
}

export let removeLittleManOldValue = (api: api, state) => {
    return setState(api, state,
        {
            ...getState(api, state),
            littleMan: {
                ...getState(api, state).littleMan,
                oldValue: api.NullableUtils.getEmpty()
            }
        }
    )
}

export let getGiantessLevel = (api: api, state, usedGirl) => {
    return getState(api, state).giantess.level
}

export let setGiantessLevel = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            giantess: {
                ...getState(api, state).giantess,
                level: value
            }
        }
    )
}

export let getGiantessOldValue = (api: api, state) => {
    return getState(api, state).giantess.oldValue
}

export let setGiantessOldValue = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            giantess: {
                ...getState(api, state).giantess,
                oldValue: api.NullableUtils.return_(value)
            }
        }
    )
}

export let removeGiantessOldValue = (api: api, state) => {
    return setState(api, state,
        {
            ...getState(api, state),
            giantess: {
                ...getState(api, state).giantess,
                oldValue: api.NullableUtils.getEmpty()
            }
        }
    )
}