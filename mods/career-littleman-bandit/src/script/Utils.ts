import { api } from "type-api/src/Type"
import { state as blockState } from "career-protocol/src/state/StateType"

export let getProtocolName = () => "career-protocol"

export let getBlockName = () => "career-littleman-bandit"


export let createState = (api: api): blockState => {
    return {
        // careerFeatureData: []
    }
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

// export let getCareerFeatureData = (api: api, state) => {
//     let data = api.getCareerFeatureData(api, state)

//     return getState(api, state).careerFeatureData.map(([name, value]) => {
//         return [api.findCareerFeatureDataByName(data, name), value]
//     })
// }

// export let setCareerFeatureData = (api: api, state, value) => {
//     return setState(api, state,
//         {
//             ...getState(api, state),
//             careerFeatureData: value
//         }
//     )
// }