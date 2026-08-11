import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as soundBackgroundService } from "sound-background-protocol/src/service/ServiceType"
import { state as soundBackgroundState } from "sound-background-protocol/src/state/StateType"
import { bindEvent, unbindEvent } from "./script/Event"
import { getBlockName, getProtocolName } from "./script/Utils"

export let getBlockService: getBlockServiceBlockManager<
    soundBackgroundService
> = (api) => {
    return {
        init: (api, state) => {
            state = bindEvent(api, state)

            return Promise.resolve(state)
        },
        dispose: (api, state) => {
            state = unbindEvent(api, state)

            // state = api.blockAPI.setBlockState(state,
            //     getProtocolName(),
            //     getBlockName(),
            //     createBlockState()
            // )

            return Promise.resolve(state)
        },
    }
}

export let createBlockState: createBlockStateBlockManager<
    soundBackgroundState
> = () => {
    return {
        loadedPlayingResourceId: null,
        playingResourceId: null
    }
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "背景声音->默认",
            author: "官方",
            category: "背景声音",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Background Sound->Default",
        author: "Author",
        category: "Background Sound",
        version: "0.0.1",
    }
}