import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "prop-other-protocol/src/service/ServiceType"
import { state } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { use } from "./script/Use"
import { getName, getPropData, isDisable } from "./json/Data"
import { getRewardData } from "./json/RewardData"

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
        getPropData: getPropData,
        isDisable: isDisable,
        use: use,

        getRewardData: getRewardData,
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
            title: "其它道具->巨大娘人物使用",
            author: "官方",
            category: "其它道具",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Other Prop->Giantess Character Use",
        author: "Author",
        category: "Other Prop",
        version: "0.0.1",
    }
}