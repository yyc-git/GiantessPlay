import { api } from "type-api/src/Type"

export let getProtocolName = () => "skill-giantess-protocol"

export let getBlockName = () => "skill-giantess-left-stomp"

// export let getState = (api: api, state): any => {
//     return api.blockAPI.getBlockState(state,
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

// export let createState = (api: api) => {
//     return {
//         positionOffset: api.vector3.createEmpty()
//     }
// }