import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-skill-enhence-stomp-rotate"

export let getSkillGiantessProtocolName = () => "skill-giantess-protocol"

export let getSkillGiantessBlockName = () => "skill-giantess-stomp"

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

export let setLevel = (api: api, state, usedGirl_, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            levelMap: api.MutableRecordUtils.set(
                getState(api, state).levelMap,
                usedGirl_,
                value
            )
        }
    )
}