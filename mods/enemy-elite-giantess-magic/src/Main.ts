import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as eliteService } from "enemy-elite-giantess-protocol/src/service/ServiceType"
import { state as eliteState } from "enemy-elite-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName, isEliteGiantess } from "./script/Utils"
import { api } from "type-api/src/Type"
import { bindEvent, getNamePrefixEliteGiantess, unbindEvent } from "./script/Event"
import { getRewardData } from "./json/RewardData"
import { damage } from "./script/Damage"
import { generateEliteGiantesses } from "./script/Generate"
import { getSnapshot, getValue } from "./json/Data"
import { getHpRatio, handleRepel } from "./script/LODQueueObjectUtils"
import { getBoxForPick, getHp, updateHp, getLocalTransform, getModelQueueIndex, getPickedTransform, handlePickdown, handlePickup, updateTransform, handleFall, getUBControlledTransform, handleUBControl, updateUBControlledTransform, getPutToBreastTransform, handlePutToBreast, updatePutToBreastTransform, getPutToShoeTransform, handlePutToShoe, updatePutToShoeTransform } from "./script/Pick"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"
import { createInitialState } from "./script/FSMState"

export let getBlockService: getBlockServiceBlockManager<
    eliteService
> = (api) => {
    return {
        init: (api: api, state) => {
            state = bindEvent(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            state = unbindEvent(api, state)

            return Promise.resolve(state)
        },

        getRewardData: getRewardData,

        damage: damage,
        generateEliteGiantesses: generateEliteGiantesses,
        isEliteGiantess: isEliteGiantess,
        getValue: getValue,
        getNamePrefixEliteGiantess: getNamePrefixEliteGiantess,

        getPickedTransform: getPickedTransform,
        getUBControlledTransform: getUBControlledTransform,
        getPutToBreastTransform: getPutToBreastTransform,
        getPutToShoeTransform: getPutToShoeTransform,
        handlePickup: handlePickup,
        updateTransform: updateTransform,
        handlePickdown: handlePickdown,
        handleFall: handleFall,
        handleRepel: handleRepel,
        handleUBControl: handleUBControl,
        handlePutToBreast: handlePutToBreast,
        handlePutToShoe: handlePutToShoe,
        updateUBControlledTransform: updateUBControlledTransform,
        updatePutToBreastTransform: updatePutToBreastTransform,
        updatePutToShoeTransform: updatePutToShoeTransform,
        getLocalTransform: getLocalTransform,
        getBoxForPick: getBoxForPick,
        getModelQueueIndex: getModelQueueIndex,
        getHp: getHp,
        getHpRatio: getHpRatio,
        getFullHp: (api, state) => getValue(api, state).hp,
        updateHp: updateHp,
        getSnapshot: getSnapshot,

        // getStateMachine: getStateMachine,
        // setStateMachine: setStateMachine,
        createInitialState: createInitialState,
    }
}

export let createBlockState: createBlockStateBlockManager<
    eliteState
> = () => {
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
            title: "精英巨大娘->魔法巨大娘",
            author: "官方",
            category: "精英巨大娘",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Elite Giantess->Magic",
        author: "Author",
        category: "Elite Giantess",
        version: "0.0.1",
    }
}