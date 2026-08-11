import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "fsm-protocol/src/service/ServiceType"
import { state } from "fsm-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName} from "./script/Utils"
import { getName, isControlledState } from "./json/Data"
import { createState } from "./script/FSMState"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api: api) => {
    return {
        init: (api: api, state) => {
            // state = bindEvent(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            // state = unbindEvent(api, state)

            return Promise.resolve(state)
        },

        getName: getName,
        isControlledState: isControlledState,
        createState: createState
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
            title: "有限自动机->玩家小人角色击退状态",
            author: "官方",
            category: "有限自动机",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "FSM->Player LittleMan Character Repel",
        author: "Author",
        category: "FSM",
        version: "0.0.1",
    }
}