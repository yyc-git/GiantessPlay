import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "career-protocol/src/service/ServiceType"
import { state } from "career-protocol/src/state/StateType"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { api } from "type-api/src/Type"
import { getCareerData, getCharacterType, getName } from "./json/Data"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api) => {
    return {
        // init: (api: api, state) => {
        //     state = bindEvent(api, state)

        //     return Promise.resolve(state)
        // },
        // dispose: (api: api, state) => {
        //     state = unbindEvent(api, state)

        //     return Promise.resolve(state)
        // },

        getName: getName,
        getCareerData: getCareerData,
        getCharacterType: getCharacterType,
        // getCareerFeatureData: (api: api, state) => {
        //     return getState(api, state).careerFeatureData
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
            title: "Career->普通人",
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
        title: "Career->Ordinary People",
        author: "Author",
        category: "Career",
        version: "0.0.1",
    }
}