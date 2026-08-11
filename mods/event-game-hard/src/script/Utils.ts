import { state } from "event-game-protocol/src/state/StateType"
import { autoDifficulty, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { api } from "type-api/src/Type"

export let getProtocolName = () => "event-game-protocol"

export let getBlockName = () => "event-game-hard"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffBlockName = () => "buff-giantess-hard"

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<state>(state,
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

export let getLastHardTime = (api: api, state) => {
    return getState(api, state).lastHardTime
}

export let setLastHardTime = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            lastHardTime: value
        }
    )
}

export let createState = (api: api): state => {
    return {
        lastHardTime: api.NullableUtils.getEmpty()
    }
}

export let findNeedHardUsedGirl = (api: api, state) => {
    return api.ArrayUtils.reduce(
        api.girl.getCurrentUsedGirls(state),
        (result, usedGirl) => {
            if (result != usedGirlEnum.None) {
                return result
            }

            if (api.isLevelGiantess(state, usedGirl) && api.getAutoDifficulty(state) >= autoDifficulty.VeryHard
                && (api.girl.getBodyHp(state, usedGirl) / api.girl.getFullHp(state, usedGirl)) > 0.05) {
                return usedGirl
            }

            return result
        },
        usedGirlEnum.None
    )
}