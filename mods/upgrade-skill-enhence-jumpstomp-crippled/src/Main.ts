import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "upgrade-protocol/src/service/ServiceType"
import { state } from "upgrade-protocol/src/state/StateType"
import { createState, getBlockName, getProtocolName } from "./script/Utils"
import { api } from "type-api/src/Type"
import { getUpgradeData, getCharacterType, getImageSrc, getName, getGirlTypes } from "./json/Data"
import { bindEvent, unbindEvent } from "./script/Event"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api) => {
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
        getUpgradeData: getUpgradeData,
        getCharacterType: getCharacterType,
        // getImageSrc: getImageSrc,

        getGirlTypes: getGirlTypes,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api: api) => {
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
            title: "Upgrade->跳踩：残废",
            author: "官方",
            category: "Upgrade",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Upgrade->Jump Stomp: Crippled",
        author: "Author",
        category: "Upgrade",
        version: "0.0.1",
    }
}