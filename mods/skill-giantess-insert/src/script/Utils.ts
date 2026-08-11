import { List } from "immutable"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "skill-giantess-protocol"

export let getBlockName = () => "skill-giantess-insert"

export let getKeepUBBlockName = () => "skill-giantess-keep-ub"


export let getBuffProtocolName = () => "buff-protocol"

export let getBuffGirlExcitementBlockName = () => "buff-excitement-girl"

export let getBuffLevelGiantessExcitementBlockName = () => "buff-excitement-level-giantess"

export let getState = (api: api, state): any => {
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
        pickObjectData: List()
    }
}

export let getPickObjectData = (api, state) => {
    return getState(api, state).pickObjectData
}

export let setPickObjectData = (api, state, data) => {
    return setState(api, state, {
        ...getState(api, state),
        pickObjectData: data
    })
}