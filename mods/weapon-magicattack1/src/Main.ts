import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "weapon-protocol/src/service/ServiceType"
import { state } from "weapon-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { emitParticleEmit, getAllParticlesForCollisionCheck, handleMagicAttack1HitGirl, handleMagicAttack1HitStatic } from "./script/MagicAttack1"
import { bindEvent, unbindEvent } from "./script/Event"
import { getMagicAttack1Data, getName } from "./json/Data"

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

        getWeaponValue: getMagicAttack1Data,
        getWeaponName: getName,

        handleHitGirl: api.NullableUtils.return_(handleMagicAttack1HitGirl),
        handleHitLittleMan: api.NullableUtils.getEmpty(),
        handleHitArmy: api.NullableUtils.getEmpty(),
        handleHitStatic: api.NullableUtils.return_(handleMagicAttack1HitStatic),

        emitParticleEmit: emitParticleEmit,

        getAllParticlesForCollisionCheck: getAllParticlesForCollisionCheck,
        getPointBox: api.NullableUtils.return_(api.getPointBoxForParticle),
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
            title: "武器->魔法攻击1",
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
        title: "Weapon->MagicAttack1",
        author: "Author",
        category: "Weapon",
        version: "0.0.1",
    }
}