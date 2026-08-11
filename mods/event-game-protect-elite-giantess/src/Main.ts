import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "event-game-protocol/src/service/ServiceType"
import { state } from "event-game-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { getCommandName, getGameEventData, getGameEventDirectorData, getName, getScenarioData } from "./json/Data"
import { appear } from "./script/Command"
import { bindEvent, unbindEvent } from "./script/Event"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        init: (api: api, state) => {
            state = bindEvent(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            state = unbindEvent(api, state)

            return Promise.resolve(state)
        },

        getName: getName,
        getCommandName: getCommandName,
        getCommand: appear,
        getGameEventDirectorData: getGameEventDirectorData,
        getGameEventData: getGameEventData,
        getScenarioData: getScenarioData,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api) => {
    return createState(api)
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "游戏事件->守护关卡：精英巨大娘",
            author: "官方",
            category: "游戏事件",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Game Event->Protect Level: Elite Giantess",
        author: "Author",
        category: "Game Event",
        version: "0.0.1",
    }
}