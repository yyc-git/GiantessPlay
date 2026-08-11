import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-skill-ice-overwrite"

export let getParticleShareProtocolName = () => "particle-share-protocol"

export let getParticleProtocolName = () => "particle-protocol"

export let getParticleShareBlockName = () => "particle-share-default"

export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-overwrite"


export let getBuffProtocolName = () => "buff-protocol"

export let getBuffArmyIceOverwriteBlockName = () => "buff-army-ice-overwrite"

export let getBuffGiantessIceOverwriteBlockName = () => "buff-giantess-ice-overwrite"



export let createState = (api: api): blockState => {
    return {
        littleMan: {
            //// TODO restore
            level: 0,
            // level: 1,
            handledArmyMap: api.MutableRecordUtils.create(),
            handledGiantessMap: api.MutableRecordUtils.create(),
        },
        // giantess: {
        //     //// TODO restore
        //     level: 0,
        //     // level: 1,
        //     handledArmyMap: api.MutableRecordUtils.create(),
        //     // handledGiantessMap: api.MutableRecordUtils.create(),
        // },
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
                level: value
            }
        }
    )
}

export let hasLittleManHandleArmy = (api: api, state, id, name) => {
    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(
            names => {
                return names.includes(name)
            },
            api.MutableRecordUtils.get(
                getState(api, state).littleMan.handledArmyMap,
                id
            )
        ),
        false
    )
}

export let addLittleManHandleArmy = (api: api, state, id, name) => {
    // return setState(api, state,
    //     {
    //         ...getState(api, state),
    //         littleMan: {
    //             ...getState(api, state).littleMan,
    //             handledArmyMap:
    //                 api.ArrayUtils.push(
    //                     api.NullableUtils.getWithDefault(
    //                         api.MutableRecordUtils.get(
    //                             getState(api, state).littleMan.handledArmyMap,
    //                             id
    //                         ),
    //                         []
    //                     ),
    //                     name
    //                 )



    //         }
    //     }
    // )

    let _ = api.MutableRecordUtils.set(
        getState(api, state).littleMan.handledArmyMap,
        id,
        api.ArrayUtils.push(
            api.NullableUtils.getWithDefault(
                api.MutableRecordUtils.get(
                    getState(api, state).littleMan.handledArmyMap,
                    id
                ),
                []
            ),
            name
        )
    )


    return state
}

export let hasLittleManHandleGiantess = (api: api, state, id) => {
    return api.MutableRecordUtils.has(
        getState(api, state).littleMan.handledGiantessMap,
        id
    )
}

export let markLittleManHandleGiantess = (api: api, state, id) => {
    api.MutableRecordUtils.set(
        getState(api, state).littleMan.handledGiantessMap,
        id,
        true
    )

    return state
}

export let clearLittleManHandleMaps = (api: api, state, id) => {
    api.MutableRecordUtils.remove(
        getState(api, state).littleMan.handledArmyMap,
        id,
    )
    api.MutableRecordUtils.remove(
        getState(api, state).littleMan.handledGiantessMap,
        id,
    )

    return state
}


// export let getGiantessLevel = (api: api, state, usedGirl) => {
//     return getState(api, state).giantess.level
// }

// export let setGiantessLevel = (api: api, state, value) => {
//     return setState(api, state,
//         {
//             ...getState(api, state),
//             giantess: {
//                 ...getState(api, state).giantess,
//                 level: value
//             }
//         }
//     )
// }

// export let hasGiantessHandleArmy = (api: api, state, id, name) => {
//     return api.NullableUtils.getWithDefault(
//         api.NullableUtils.map(
//             names => {
//                 return names.includes(name)
//             },
//             api.MutableRecordUtils.get(
//                 getState(api, state).giantess.handledArmyMap,
//                 id
//             )
//         ),
//         false
//     )
// }

// export let addGiantessHandleArmy = (api: api, state, id, name) => {
//     let _ = api.MutableRecordUtils.set(
//         getState(api, state).giantess.handledArmyMap,
//         id,
//         api.ArrayUtils.push(
//             api.NullableUtils.getWithDefault(
//                 api.MutableRecordUtils.get(
//                     getState(api, state).giantess.handledArmyMap,
//                     id
//                 ),
//                 []
//             ),
//             name
//         )
//     )


//     return state
// }