import { api } from "type-api/src/Type"

export let getProtocolName = () => "prop-other-protocol"

export let getBlockName = () => "prop-other-use-giantesscharacter"

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<any>(state,
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

export let getRewardCount = (api: api, state) => {
    return getState(api, state).rewardCount
}

export let setRewardCount = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            rewardCount: value
        }
    )
}

export let createState = (api: api) => {
    return {
        rewardCount: 0
    }
}
