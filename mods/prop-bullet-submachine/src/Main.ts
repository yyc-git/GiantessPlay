import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "prop-bullet-protocol/src/service/ServiceType"
import { state } from "prop-bullet-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { getSubMachineBulletEmmitSoundResourceId, getPropData, getWeaponGlbResourceId, getWeaponImageResourcePath, getWeaponName, getWeaponValue, isLockable } from "./json/Data"
import { emitParticleEmit, getAllParticlesForCollisionCheck, handleSubMachineBulletHitArmy, handleSubMachineBulletHitGirl, handleSubMachineBulletHitLittleMan, handleSubMachineBulletHitStatic } from "./script/SubMachineBullet"

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
        getEmitSoundResourceId: getSubMachineBulletEmmitSoundResourceId,


        handleHitGirl: api.NullableUtils.return_(handleSubMachineBulletHitGirl),
        handleHitLittleMan: api.NullableUtils.return_(handleSubMachineBulletHitLittleMan),
        handleHitArmy: api.NullableUtils.return_(handleSubMachineBulletHitArmy),
        handleHitStatic: api.NullableUtils.return_(handleSubMachineBulletHitStatic),

        emitParticleEmit: emitParticleEmit,

        getAllParticlesForCollisionCheck: getAllParticlesForCollisionCheck,
        getPointBox: api.getPointBoxForBullet,
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
            title: "子弹道具->冲锋枪子弹",
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
        title: "Bullet Prop->SubMachine Bullet",
        author: "Author",
        category: "Bullet Prop",
        version: "0.0.1",
    }
}