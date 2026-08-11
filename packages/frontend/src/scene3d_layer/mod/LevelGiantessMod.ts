import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "level-giantess-protocol/src/service/ServiceType"
import { state as blockState } from "level-giantess-protocol/src/state/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { modProtocolName } from "./data/ModData";
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { api } from "type-api/src/Type";
import { camp, result, usedGirl, usedGirlEnum } from "../script/scene/scene_city/type/StateType";
import { getCurrentUsedGirls, hasGirlValue, hasUsedGirlData, isPlayerGiantess, isUseGirl, limitScale } from "../script/scene/scene_city/girl/Girl";
import { setGirlValue } from "../script/scene/scene_city/CityScene";
import * as WildGiantessData from "../script/scene/scene_city/data/play/level1/wild/GirlData"
import * as EnemyGiantessData from "../script/scene/scene_city/data/play/level1/enemy/GirlData"
import * as PlayerGoddessData from "../script/scene/scene_city/data/play/level1/player_goddess/GirlData"
import { getMaxScale } from "../script/scene/scene_city/girl/Utils";
import { girlValue } from "../script/scene/scene_city/data/ValueType";
import { applyTalent } from "../script/scene/scene_city/build/Talent";

export let getPlayerGiantessBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.LevelGiantessProtocol, "level-giantess-playergiantess")
}

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "level-giantess-playergiantess",
        "level-giantess-protect-boss1",
        "level-giantess-protect-boss2",
    ])
}



let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.LevelGiantessProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "levelGiantess")
}

let _getData = <Data>(state: state, func: (service: service, api: api, state: state) => Data, usedGirl: usedGirl, defaultValue) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<Data, service>(
        _getAllServices(state),
        (result, service) => {
            if (service.getUsedGirl() != usedGirl) {
                return result
            }

            // return NullableUtils.return_(func(service, api, state))
            return func(service, api, state)
        },
        // NullableUtils.getEmpty()
        defaultValue
    )
}

export let isLevelGiantess = (state: state, usedGirl) => {
    return _getData<boolean>(state, (service, api, state) => true, usedGirl, false) && isUseGirl(state, usedGirl)
}

export let isLevelGiantessExceptPlayer = (state: state, usedGirl) => {
    return _getData<boolean>(state, (service, api, state) => service.getCamp() != camp.Player, usedGirl, false) && isUseGirl(state, usedGirl)
}

export let isPlayerLevelGiantess = (state: state, usedGirl) => {
    return _getData<boolean>(state, (service, api, state) => service.getCamp() == camp.Player, usedGirl, false) && isUseGirl(state, usedGirl)
}

export let triggerAction = (state: state, usedGirl, name) => {
    let api = getModAPI(state)

    // let usedGirl = usedGirl

    return ArrayUtils.reducePromise<[state, result], service>(
        _getAllServices(state),
        (result, service) => {
            if (service.getUsedGirl() != usedGirl) {
                return Promise.resolve(result)
            }

            return service.triggerAction(api, state, usedGirl, name)
        },
        [state, result.Success]
    )
}

export let updateGirlValue = (state: state, usedGirl) => {
    return _getData<any>(state, (service, api, state) => NullableUtils.return_(
        service.updateGiantessValue(api)
    ), usedGirl, NullableUtils.getEmpty())
}

export let getUsedGirl = (state: state) => {
    return ArrayUtils.reduce<Array<usedGirl>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.push(
                result, service.getUsedGirl()
            )
        },
        []
    )
}

export let getPlayerUsedGirl = (state: state) => {
    return ArrayUtils.reduce<Array<usedGirl>, service>(
        _getAllServices(state),
        (result, service: service) => {
            if (service.getCamp() != camp.Player) {
                return result
            }

            return ArrayUtils.push(
                result, service.getUsedGirl()
            )
        },
        []
    )
}

let _handlePromise = (state: state, func: (service: service, api: api, state: state, ...otherData) => Promise<state>, usedGirl: usedGirl, ...otherData) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise<state, service>(
        _getAllServices(state),
        (state, service) => {
            if (service.getUsedGirl() != usedGirl) {
                return Promise.resolve(state)
            }

            return func(service, api, state, ...otherData)
        },
        state
    )
}

export let update = (state: state, usedGirl) => {
    return _handlePromise(state, (service, api, state) => service.update(api, state, usedGirl), usedGirl)
}

export let damage = (state: state, usedGirl, ...otherData) => {
    return _handlePromise(state, (service, api, state, ...otherData) => service.damage(api, state, usedGirl, ...otherData), usedGirl, ...otherData)
}

// let _handle = (state: state, func: (service: service, api: api, state: state) => state, usedGirl: usedGirl) => {
//     let api = getModAPI(state)

//     return ArrayUtils.reduce<state, service>(
//         _getAllServices(state),
//         (state, service) => {
//             if (service.getUsedGirl() != usedGirl) {
//                 return state
//             }

//             return func(service, api, state)
//         },
//         state
//     )
// }

// export let resetAllLevelGirlValue = (state: state, isApplyTalent) => {
//     // return _handle(state, (service, api, state) => {
//     //     return setGirlValue(state, usedGirl, service.getValue(api, state))
//     // }, usedGirl)

//     state = setGirlValue(state, usedGirlEnum.WildGiantess, WildGiantessData.getValue(state))
//     state = setGirlValue(state, usedGirlEnum.EnemyGiantess, EnemyGiantessData.getValue(state))
//     state = setGirlValue(state, usedGirlEnum.PlayerGoddess, PlayerGoddessData.getValue(state))

//     let api = getModAPI(state)

//     state = _getAllServices(state).reduce((state, service) => {
//         return setGirlValue(state, service.getUsedGirl(),
//             service.getValue(api, state)
//         )
//     }, state)


//     return ArrayUtils.reducePromise(getCurrentUsedGirls(state), (state, usedGirl) => {
//         if (isApplyTalent && isPlayerGiantess(state, usedGirl)) {
//             return applyTalent(state, usedGirl, false, true)
//         }

//         return Promise.resolve(state)
//     }, state)
// }

export let initAllLevelGirlValue = (state: state) => {
    // return _handle(state, (service, api, state) => {
    //     return setGirlValue(state, usedGirl, service.getValue(api, state))
    // }, usedGirl)

    state = setGirlValue(state, usedGirlEnum.WildGiantess, WildGiantessData.getValue(state))
    state = setGirlValue(state, usedGirlEnum.EnemyGiantess, EnemyGiantessData.getValue(state))
    state = setGirlValue(state, usedGirlEnum.PlayerGoddess, PlayerGoddessData.getValue(state))

    let api = getModAPI(state)

    state = _getAllServices(state).reduce((state, service) => {
        return setGirlValue(state, service.getUsedGirl(),
            service.getValue(api, state)
        )
    }, state)

    return Promise.resolve(state)
}

export let resetLevelGirlValue = (state: state, usedGirl: usedGirl, isApplyTalent: boolean) => {
    let value = NullableUtils.getEmpty()
    if (usedGirl == usedGirlEnum.WildGiantess) {
        value = WildGiantessData.getValue(state)
    }
    else if (usedGirl == usedGirlEnum.EnemyGiantess) {
        value = EnemyGiantessData.getValue(state)
    }
    else if (usedGirl == usedGirlEnum.PlayerGoddess) {
        value = PlayerGoddessData.getValue(state)
    }

    if (!NullableUtils.isNullable(value)) {
        state = setGirlValue(state, usedGirl, value)
    }
    else {
        let api = getModAPI(state)

        state = _getAllServices(state).reduce((state, service) => {
            if (service.getUsedGirl() == usedGirl) {
                return setGirlValue(state, service.getUsedGirl(),
                    service.getValue(api, state)
                )
            }

            return state
        }, state)

    }

    if (isApplyTalent && isPlayerGiantess(state, usedGirl)) {
        return applyTalent(state, usedGirl, false, true)
    }

    return Promise.resolve(state)
}


export let limitInitialScale = (state: state, usedGirl, newInitialScale) => {
    // if (newInitialScale >= getMaxScale(state, value)) {
    //     return value.initialScale
    // }

    // return newInitialScale
    return limitScale(state, usedGirl, newInitialScale)
}