import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "weapon-protocol/src/service/ServiceType"
import { state } from "weapon-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { handleStompLightHitArmy, handleStompLightHitGirl, handleStompLightHitLittleMan, handleStompLightHitStatic } from "./script/StompLight"
import { bindEvent, unbindEvent } from "./script/Event"
import { getStompLightData, getName } from "./json/Data"

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

        getWeaponValue: getStompLightData,
        getWeaponName: getName,

        handleHitGirl: api.NullableUtils.return_(handleStompLightHitGirl),
        handleHitLittleMan: api.NullableUtils.return_(handleStompLightHitLittleMan),
        handleHitArmy: api.NullableUtils.return_(handleStompLightHitArmy),
        handleHitStatic: api.NullableUtils.return_(handleStompLightHitStatic),

        getAllParticlesForCollisionCheck: api.NullableUtils.getEmpty(),
        getPointBox: api.NullableUtils.getEmpty(),
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
            title: "武器->轻踩",
            author: "官方",
            category: "武器",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Weapon->StompLight",
        author: "Author",
        category: "Weapon",
        version: "0.0.1",
    }
}