import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "weapon-protocol/src/service/ServiceType"
import { state } from "weapon-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { handleStompHeavyHitArmy, handleStompHeavyHitGirl, handleStompHeavyHitLittleMan, handleStompHeavyHitStatic } from "./script/StompHeavy"
import { bindEvent, unbindEvent } from "./script/Event"
import { getStompHeavyData, getName } from "./json/Data"

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

        getWeaponValue: getStompHeavyData,
        getWeaponName: getName,

        handleHitGirl: api.NullableUtils.return_(handleStompHeavyHitGirl),
        handleHitLittleMan: api.NullableUtils.return_(handleStompHeavyHitLittleMan),
        handleHitArmy: api.NullableUtils.return_(handleStompHeavyHitArmy),
        handleHitStatic: api.NullableUtils.return_(handleStompHeavyHitStatic),

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
            title: "武器->重踩",
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
        title: "Weapon->StompHeavy",
        author: "Author",
        category: "Weapon",
        version: "0.0.1",
    }
}