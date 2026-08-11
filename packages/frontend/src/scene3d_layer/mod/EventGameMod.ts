import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn } from "./Mod";
import { service } from "event-game-protocol/src/service/ServiceType"
import { modProtocolName } from "./data/ModData";
import { data } from "../script/scene/scene_city/data/director/GameEventDirectorData";
import { command_ } from "../script/scene/scene_city/data/ScenarioData";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";

// export let getCallGiantessBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, modProtocolName.EventGameProtocol, "event-game-attack-callgiantess")
// }


// export let getCallGoddessBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, modProtocolName.EventGameProtocol, "event-game-callgoddess")
// }

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "event-game-attack-callgiantess",
        "event-game-callgoddess",
        "event-game-hard",
    ])
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.EventGameProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "eventGame")
}

export let getAllGameEventDirectorData = (state: state, allServices = _getAllServices(state)): data => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<data, service>(
        allServices,
        (result, service) => {
            return ArrayUtils.push(
                result,
                service.getGameEventDirectorData(api, state)
            )
        },
        []
    )
}

export let getAllGameEventData = (state: state, allServices = _getAllServices(state)) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<any, service>(
        allServices,
        (result, service) => {
            return ArrayUtils.push(
                result,
                service.getGameEventData(api, state)
            )
        },
        []
    )
}

export let getAllScenarioData = (state: state, allServices = _getAllServices(state)) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<any, service>(
        allServices,
        (result, service) => {
            return MutableRecordUtils.concat(
                result,
                service.getScenarioData(api, state)
            )
        },
        MutableRecordUtils.create()
    )
}

export let handleGetCommand = (state: state, command: command_) => {
    let api = getModAPI(state)

    return NullableUtils.getExn(
        _getAllServices(state).find(service => service.getCommandName() == command)
    ).getCommand(api)
}