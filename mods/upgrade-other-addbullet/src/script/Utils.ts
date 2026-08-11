import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-other-addbullet"

export let createState = (api: api): blockState => {
    return {
        littleMan: {
            level: 0,
            lastPosition: api.NullableUtils.getEmpty(),
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
                level: value,
            }
        }
    )
}

export let getLittleManLastPosition = (api: api, state) => {
    return getState(api, state).littleMan.lastPosition
}

export let setLittleManLastPosition = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            littleMan: {
                ...getState(api, state).littleMan,
                lastPosition: api.NullableUtils.return_(value)
            }
        }
    )
}