import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-other-partialscale-torsor"

export let createState = (api: api): blockState => {
    return null
}

// export let getState = (api: api, state) => {
//     return api.blockAPI.getBlockState<blockState>(state,
//         getProtocolName(),
//         getBlockName()
//     )
// }

// export let setState = (api: api, state, s) => {
//     return api.blockAPI.setBlockState(state,
//         getProtocolName(),
//         getBlockName(),
//         s
//     )
// }

// export let getGiantessLevel = (api: api, state, usedGirl) => {
//     return getState(api, state).giantess.level
// }

// export let setGiantessLevel = (api: api, state, value) => {
//     return setState(api, state,
//         {
//             ...getState(api, state),
//             giantess: {
//                 ...getState(api, state).giantess,
//                 level: value,
//             }
//         }
//     )
// }
