
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "fsm-protocol/src/service/ServiceType"
import { modProtocolName } from "./data/ModData";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { rewardData } from "../script/scene/scene_city/data/reward/RewardDataType";
import { mergeRewardData } from "../script/scene/scene_city/reward/RewardGenerator";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";

export let getLittleManRepelBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.FSMProtocol, "fsm-littleman-repel")
}

export let getLittleManFallBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.FSMProtocol, "fsm-littleman-fall")
}

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "fsm-girl-climax",
        "fsm-level-giantess-climax",

        "fsm-girl-excitement",
        "fsm-level-giantess-excitement",

        "fsm-littleman-fall",
        "fsm-littleman-repel",
    ])
}



let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.FSMProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "fsm")
}

export let isControlledState = (state: state, stateMachine) => {
    // let api = getModAPI(state)

    let api = getModAPI(state)

    return ArrayUtils.reduce<boolean, service>(
        _getAllServices(state),
        (result, service) => {
            if (result) {
                return true
            }

            return service.isControlledState(api, stateMachine)
        },
        false
    )
}

// export let isExecutingState = (state: state, stateMachine) => {
//     return ArrayUtils.reduce<boolean, service>(
//         _getAllServices(state),
//         (result, service) => {
//             if (result) {
//                 return true
//             }

//             return StateMachine.isState(stateMachine, service.getName())
//         },
//         false
//     )
// }

export let getRewardDataFSM = (state): rewardData => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(getRewardData => {
                return mergeRewardData(result, getRewardData(api, state))
            }, service.getRewardData),
            result
        )
    }, {})
}

// export let increaseLevelGiantessExcitementClimaxRate = (state: state, factor: number) => {
//     let climaxBlockName = "fsm-level-giantess-climax"
//     let excitementBlockName = "fsm-level-giantess-excitement"

//     state = setBlockState(state, modProtocolName.FSMProtocol, excitementBlockName,
//         {
//             ...getBlockStateExn<any>(state, modProtocolName.FSMProtocol, excitementBlockName),
//             rate: getBlockStateExn<any>(state, modProtocolName.FSMProtocol, excitementBlockName).rate * (1 + factor)
//         }
//     )
//     state = setBlockState(state, modProtocolName.FSMProtocol, climaxBlockName,
//         {
//             ...getBlockStateExn<any>(state, modProtocolName.FSMProtocol, climaxBlockName),
//             rate: getBlockStateExn<any>(state, modProtocolName.FSMProtocol, climaxBlockName).rate * (1 + factor)
//         }
//     )

//     return state
// }