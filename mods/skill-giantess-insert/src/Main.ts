import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { state } from "skill-giantess-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName, createState } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { computeForceDirectionDefault, computeDamageTypeDefault, getActionData, getActionName, getAllSkillDataForLevelOrBoss, getAllSkillDataForPlayer, getAnimationBlendData, getAnimationCollisionData, getAnimationData, getAnimationFrameCount, getAllAnimationNames, getOperateRenderData, getPhase, getSkillStressingFactor, getVMDRawData, isSkillState, getForceAnimationName, isKeepPoseAnimation } from "./json/Data"
import { isActionValid, triggerAction } from "./script/Action"

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


        getActionName: getActionName,
        getAllAnimationNames: getAllAnimationNames,
        getForceAnimationName: getForceAnimationName,
        isKeepPoseAnimation: isKeepPoseAnimation,
        getOperateRenderData: getOperateRenderData,
        getAnimationBlendData: getAnimationBlendData,
        getAnimationCollisionData: getAnimationCollisionData,
        getActionData: getActionData,
        getPhase: getPhase,
        getSkillStressingFactor: getSkillStressingFactor,
        getAnimationData: getAnimationData,
        getAllSkillDataForPlayer: getAllSkillDataForPlayer,
        getAllSkillDataForLevelOrBoss: getAllSkillDataForLevelOrBoss,
        getVMDRawData: getVMDRawData,
        getAnimationFrameCount: getAnimationFrameCount,
        isSkillState: isSkillState,
        computeForceDirectionDefault: computeForceDirectionDefault,
        computeDamageTypeDefault: computeDamageTypeDefault,

        isActionValid: isActionValid,
        triggerAction: triggerAction,
    }
}

export let createBlockState: createBlockStateBlockManager<
    state
> = (api) => {
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
            title: "技能->巨大娘 插入",
            author: "官方",
            category: "技能",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Skill->Giantess Insert",
        author: "Author",
        category: "SKill",
        version: "0.0.1",
    }
}