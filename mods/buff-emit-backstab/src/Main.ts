import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "buff-protocol/src/service/ServiceType"
import { state } from "buff-protocol/src/state/StateType"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { getCount } from "./script/GetCount"
import { api } from "type-api/src/Type"
import { addBuff, getBuffData, getCharacterType, getImageSrc, getName, isPositive } from "./json/Data"
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
        getBuffData: getBuffData,
        addBuff: addBuff,
        getCharacterType: getCharacterType,
        isPositive: isPositive,
        getImageSrc: getImageSrc,

        // getTargetName: getTargetName,

        getCount: getCount,
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
            title: "Buff->发射 背刺",
            author: "官方",
            category: "Buff",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Buff->Emit Back Stab",
        author: "Author",
        category: "Buff",
        version: "0.0.1",
    }
}