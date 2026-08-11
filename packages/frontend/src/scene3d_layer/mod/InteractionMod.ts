import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "interaction-protocol/src/service/ServiceType"
import { modProtocolName } from "./data/ModData";
import { getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";


export let getWeaponGirlBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.InteractionProtocol, "interaction-weapongirl")
}


let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        // "interaction-blessgirl",
        "interaction-weapongirl",
    ])
}

export let getAllServices = (state): Array<service> => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.InteractionProtocol, blockName)
    })
}

export let triggerInteraction = (state: state, interactionName) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise(
        getAllServices(state),
        (state, service) => {
            if (service.getName() == interactionName) {
                return service.trigger(
                    api,
                    state
                )
            }

            return Promise.resolve(state)
        },
        state
    )
}


export let getAllLoadResourceIdData = (state: state, allServices = getAllServices(state)) => {
    return ArrayUtils.reduce(
        allServices,
        (map, service) => {
            return MutableRecordUtils.concat(map, service.getLoadResourceIdData())
        },
        MutableRecordUtils.create()
    )
}

export let getAllTriggerData = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        getAllServices(state),
        (map, service) => {
            return MutableRecordUtils.concat(map, service.getTriggerData(api, state))
        },
        MutableRecordUtils.create()
    )
}

export let getAllInteractionConfig = (state: state, allServices = getAllServices(state)) => {
    return ArrayUtils.reduce(
        allServices,
        (result, service) => {
            return ArrayUtils.push(result, service.getInteractionConfig())
        },
        []
    )
}

export let getAllMapData = (state: state, allServices = getAllServices(state)) => {
    return ArrayUtils.reduce(
        allServices,
        (result, service) => {
            return ArrayUtils.push(result, [
                service.getName(),
                service.getMapResourceId(),
            ])
        },
        []
    )
}