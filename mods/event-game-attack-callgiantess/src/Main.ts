import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "event-game-protocol/src/service/ServiceType"
import { state } from "event-game-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { getCommandName, getGameEventData, getGameEventDirectorData, getName, getScenarioData } from "./json/Data"
import { appearPlayerGiantess } from "./script/Command"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        getName: getName,
        getCommandName: getCommandName,
        getCommand: appearPlayerGiantess,
        getGameEventDirectorData: getGameEventDirectorData,
        getGameEventData: getGameEventData,
        getScenarioData: getScenarioData,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api) => {
    return null
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "游戏事件->召唤巨大娘",
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
        title: "Game Event->Call Giantess",
        author: "Author",
        category: "Game Event",
        version: "0.0.1",
    }
}