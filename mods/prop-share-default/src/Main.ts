import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "prop-share-protocol/src/service/ServiceType"
import { state } from "prop-share-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getUseWaterResourceId } from "./json/Data"
import { bindEvent, unbindEvent } from "./script/Event"
import { getBlockName, getProtocolName } from "./script/Utils"

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

        getUseWaterResourceId: getUseWaterResourceId,
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
            title: "道具共享->默认",
            author: "官方",
            category: "道具共享",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Prop Share->Default",
        author: "Author",
        category: "Prop Share",
        version: "0.0.1",
    }
}