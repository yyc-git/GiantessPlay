import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "level-giantess-protocol/src/service/ServiceType"
import { state } from "level-giantess-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { addGiantess, damage, removeGiantess, triggerAction, update } from "./script/Giantess"
import { getCamp, getName, getUsedGirl, updateGiantessValue } from "./json/Data"
import { getValue } from "./json/GiantessData"
import { getRewardData } from "./json/RewardData"
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
        getValue: getValue,
        // getValue: state => {
        //     // if (!api.hasGirlValue(state, getUsedGirl())) {
        //     //     return api.getPlayerGirlValueFromGirlData(state)
        //     // }

        //     return api.getValueByUsedGirl(state, getUsedGirl())
        // },
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
            title: "关卡巨大娘->玩家巨大娘",
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
        title: "Level Giantess->Player Giantess",
        author: "Author",
        category: "Level Giantess",
        version: "0.0.1",
    }
}