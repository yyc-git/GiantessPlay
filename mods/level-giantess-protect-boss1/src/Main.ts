import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "level-giantess-protocol/src/service/ServiceType"
import { state } from "level-giantess-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { addGiantess, damage, removeGiantess, triggerAction, update } from "./script/Giantess"
import { getCamp, getName, getUsedGirl, updateGiantessValue } from "./json/Data"
import { getValue } from "./json/GiantessData"
import { getRewardData } from "./json/RewardData"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        getName: getName,
        getValue: getValue,
        getRewardData: getRewardData,
        getUsedGirl: getUsedGirl,
        updateGiantessValue: updateGiantessValue,
        getCamp: getCamp,

        addGiantess: addGiantess,
        removeGiantess: removeGiantess,
        update: update,
        damage: damage,
        // dispose: dispose,
        triggerAction: triggerAction,
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
            title: "关卡巨大娘->守护关卡：Boss1",
            author: "官方",
            category: "关卡巨大娘",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Level Giantess->Protect Level: Boss1",
        author: "Author",
        category: "Level Giantess",
        version: "0.0.1",
    }
}