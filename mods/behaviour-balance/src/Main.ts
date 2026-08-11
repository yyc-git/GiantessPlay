import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "behaviour-protocol/src/service/ServiceType"
import { state } from "behaviour-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { getData } from "./json/Data"
// import { buildActionNode } from "./script/BehaviourTreeManager"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        getData: getData,
        // buildActionNode: buildActionNode,
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
            title: "行为树->均衡",
            author: "官方",
            category: "行为树",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Behaviour Tree->Balance",
        author: "Author",
        category: "Behaviour Tree",
        version: "0.0.1",
    }
}