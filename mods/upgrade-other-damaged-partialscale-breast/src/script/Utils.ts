import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-other-damaged-partialscale-breast"

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

export let getLevelByCharacter = (api: api, state, usedGirl_) => {
    return api.MutableRecordUtils.getWithDefault(
        getState(api, state).levelMap,
        usedGirl_,
        0
    )
}

export let getGiantessLevel = (api: api, state, usedGirl) => {
    if (usedGirl == usedGirlEnum.None) {
        return 0
    }

    return getLevelByCharacter(api, state, usedGirl)
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