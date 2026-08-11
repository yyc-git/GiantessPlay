import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-attack-pull"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"

// export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-single"


export let getBuffProtocolName = () => "buff-protocol"

// export let getBuffArmyIceSingleBlockName = () => "buff-army-ice-single"

// export let getBuffGiantessIceSingleBlockName = () => "buff-giantess-ice-single"

export let getBuffBlockName = () => "buff-emit-pull"



export let createState = (api: api): blockState => {
    // return {
    //     littleMan: {
    //         //// TODO restore
    //         level: 0,
    //         // level: 1,
    //         // handledArmyMap: api.MutableRecordUtils.create(),
    //         // handledGiantessMap: api.MutableRecordUtils.create(),
    //     },
    //     // giantess: {
    //     //     //// TODO restore
    //     //     level: 0,
    //     //     // level: 1,
    //     //     // handledArmyMap: api.MutableRecordUtils.create(),
    //     //     // handledGiantessMap: api.MutableRecordUtils.create(),
    //     // },
    // }
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

// export let getLittleManLevel = (api: api, state) => {
//     return getState(api, state).littleMan.level
// }

// export let setLittleManLevel = (api: api, state, value) => {
//     return setState(api, state,
//         {
//             ...getState(api, state),
//             littleMan: {
//                 ...getState(api, state).littleMan,
//                 level: value
//             }
//         }
//     )
// }