import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "career-protocol/src/service/ServiceType"
import { state } from "career-protocol/src/state/StateType"
import { getBlockName, getProtocolName, createState, getState } from "./script/Utils"
import { api } from "type-api/src/Type"
import { getCareerData, getCharacterType, getName } from "./json/Data"
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
        getCareerData: getCareerData,
        getCharacterType: getCharacterType,
        // getCareerFeatureData: (api: api, state) => {
        //     return api.ArrayUtils.clone(getState(api, state).careerFeatureData)
        // }
        // // getImageSrc: getImageSrc,
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
            title: "Career->巨大娘 随机",
            author: "官方",
            category: "Career",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Career->Giantess Random",
        author: "Author",
        category: "Career",
        version: "0.0.1",
    }
}