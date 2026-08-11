import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service } from "scene-protocol/src/service/ServiceType"
import { state } from "scene-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { findGameEventBlockName, getBlockName, getProtocolName, createState } from "./script/Utils"
import { bindEvent, unbindEvent } from "./script/Event"
import { getNextLevelData, getScene, getSceneData } from "./json/Data"
import { initWhenImportScene } from "./script/InitWhenImportScene"
import { update } from "./script/Update"
import { dispose } from "./script/Dispose"
import { getLoadData, handleBeforeLoadResource } from "./script/Load"
import { buildScene } from "./script/BuildScene"
import { getDifficultyData } from "./json/DifficultyData"
import { updateAttackTarget } from "./script/Combat"
import { updateArmyValue, updateEliteGiantessValue } from "./script/Difficulty"
import { getAllBlockNames } from "./script/ManageMod"

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

        getScene: getScene,
        getSceneData: getSceneData,
        getAllBlockNames: getAllBlockNames,

        handleUpdate: update,
        handleDispose: dispose,
        buildScene: buildScene,
        handleInitWhenImportScene: initWhenImportScene,
        getLoadData,
        handleBeforeLoadResource,

        getDifficultyData: getDifficultyData,
        getNextLevelData: getNextLevelData,
        updateArmyValue: updateArmyValue,
        updateEliteGiantessValue: updateEliteGiantessValue,

        updateAttackTarget: updateAttackTarget,

        findGameEventBlockName: findGameEventBlockName,
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
            title: "场景->守护",
            author: "官方",
            category: "场景",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Scene->Protect",
        author: "Author",
        category: "Scene",
        version: "0.0.1",
    }
}