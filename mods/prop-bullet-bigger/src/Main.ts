import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "prop-bullet-protocol/src/service/ServiceType"
import { state } from "prop-bullet-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { getBulletEmmitSoundResourceId, getPropData, getWeaponGlbResourceId, getWeaponImageResourcePath, getWeaponName, getWeaponValue, isDisable, isLockable } from "./json/Data"
import { emitParticleEmit, getAllParticlesForCollisionCheck, handleBulletHitArmy, handleBulletHitGirl } from "./script/Bullet"

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

        getWeaponValue: getWeaponValue,

        getWeaponName: getWeaponName,
        getPropData: getPropData,
        getWeaponImagePath: getWeaponImageResourcePath,
        getWeaponGlbResourceId: getWeaponGlbResourceId,
        isLockable: isLockable,
        getEmitSoundResourceId: getBulletEmmitSoundResourceId,


        handleHitGirl: api.NullableUtils.return_(handleBulletHitGirl),
        handleHitLittleMan: api.NullableUtils.getEmpty(),
        handleHitArmy: api.NullableUtils.return_(handleBulletHitArmy),
        handleHitStatic: api.NullableUtils.getEmpty(),

        emitParticleEmit: emitParticleEmit,

        getAllParticlesForCollisionCheck: getAllParticlesForCollisionCheck,
        // getPointBox: api.getPointBoxForBullet,
        getPointBox: api.getPointBoxForParticle,

        isDisable: isDisable,
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
            title: "子弹道具->变大子弹",
            author: "官方",
            category: "子弹道具",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Bullet Prop->Bigger Bullet",
        author: "Author",
        category: "Bullet Prop",
        version: "0.0.1",
    }
}