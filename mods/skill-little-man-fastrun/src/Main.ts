import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "skill-little-man-protocol/src/service/ServiceType"
import { state } from "skill-little-man-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import {
    getActionName, getAnimationName,
    getOperateData,
    getAnimationBlendData,
    getAllAnimationNamesExceptDeathAnimations,
    getAnimationCollisionData,
    getSkillData,
    getLoadData,
    getAnimationFrameCountMap,
    getAllAnimationNames,
} from "./json/Data"
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
        getAnimationName: getAnimationName,
        getOperateData,
        getAnimationBlendData,
        getAllAnimationNames: getAllAnimationNames,
        getAllAnimationNamesExceptDeathAnimations,
        getAnimationCollisionData,
        getSkillData,
        getLoadData,
        getAnimationFrameCountMap: getAnimationFrameCountMap,

        isActionValid: isActionValid,
        triggerAction: triggerAction,
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
            title: "技能->小人 快跑",
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
        title: "Skill->Little Man Fast Run",
        author: "Author",
        category: "SKill",
        version: "0.0.1",
    }
}