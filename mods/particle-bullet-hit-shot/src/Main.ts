import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "particle-protocol/src/service/ServiceType"
import { state } from "particle-protocol/src/state/StateType"
import { service as shareService } from "particle-share-protocol/src/service/ServiceType"
import { getBlockName, getProtocolName, getShareBlockName, getShareProtocolName } from "./script/Utils"
import { Map } from "immutable"
import { api } from "type-api/src/Type"
import { getColCount, getImagePath, getParticleType, getRowCount } from "./json/Data"
import { bulletParticle } from "meta3d-jiehuo-abstract/src/type/StateType"

export let getBlockService: getBlockServiceBlockManager<
    service
> = (api) => {
    return {
        init: (api: api, state) => {
            state = api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).bindEvent(api, state, [
                (api: api, state) => api.blockAPI.getBlockState<state<bulletParticle>>(state, getProtocolName(), getBlockName()),
                (api: api, state, blockState) => api.blockAPI.setBlockState(state, getProtocolName(), getBlockName(), blockState),
                createBlockState
            ])

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            state = api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).unbindEvent(api, state)

            return Promise.resolve(state)
        },

        getImagePath: getImagePath,
        getParticleType: getParticleType,

        getColCount: getColCount,
        getRowCount: getRowCount,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state<bulletParticle>
> = (api: api) => {
    return api.createParticleState()
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "粒子->散弹枪子弹击中",
            author: "官方",
            category: "粒子",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Particle->ShotBulletHit",
        author: "Author",
        category: "Particle",
        version: "0.0.1",
    }
}