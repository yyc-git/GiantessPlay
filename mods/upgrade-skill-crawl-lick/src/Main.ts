import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "upgrade-protocol/src/service/ServiceType"
import { state } from "upgrade-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "./script/Utils"
import { api } from "type-api/src/Type"
import { getUpgradeData, getCharacterType, getImageSrc, getName } from "./json/Data"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api) => {
    return {
        getName: getName,
        getUpgradeData: getUpgradeData,
        getCharacterType: getCharacterType,
        // getImageSrc: getImageSrc,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api: api) => {
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
            title: "Upgrade->学习趴舔",
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
        title: "Upgrade->Learn Crawl Lick",
        author: "Author",
        category: "Upgrade",
        version: "0.0.1",
    }
}