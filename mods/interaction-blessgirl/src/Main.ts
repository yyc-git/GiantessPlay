import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "interaction-protocol/src/service/ServiceType"
import { state } from "interaction-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { getBlessGirlMapResourceId, getInteractionConfig, getLoadResourceIdData, getName, getTriggerData } from "./json/Data"
import { trigger } from "./script/Trigger"

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
        getLoadResourceIdData: getLoadResourceIdData,
        getInteractionConfig: getInteractionConfig,
        getMapResourceId: getBlessGirlMapResourceId,
        getTriggerData: getTriggerData,

        trigger: trigger,
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
            title: "互动->祝福女神",
            author: "官方",
            category: "互动",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Interaction->Bless Girl",
        author: "Author",
        category: "Interaction",
        version: "0.0.1",
    }
}