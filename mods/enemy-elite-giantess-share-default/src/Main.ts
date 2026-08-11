import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as eliteService } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"
import { state as eliteState } from "enemy-elite-giantess-share-protocol/src/state/StateType"
import { computeHeight, getAllModelQueues, getBlockName, getBloodDecalQueue, getClipData, getEliteGiantessSkinMesh, getInitialQuaternion, getModelQueue, getModelQueueIndex, getProtocolName, getQueue, hasQueue, getStateMachine, setClipData, setData, setStateMachine, updateWeaponValue } from "./script/Utils"
import { api, box3 } from "type-api/src/Type"
import { bindEvent, unbindEvent } from "./script/Event"
import { createState } from "./script/State"
import { addEffect, attack, exitFuncForCreateAttackState } from "./script/Attack"
import { damage, getHp, updateHp } from "./script/Damage"
import { createControlledState, createInitialState, createLieState, createStandupState, getDeathClipIndex } from "./script/FSMState"
import { generateEliteGiantesses } from "./script/Generate"
import { initWhenImportScene } from "./script/InitWhenImportScene"
import { getHpWithDefault } from "./script/LODQueueObjectUtils"
import { createMoveState, stopAndRemoveMoveDataAndTween } from "./script/Move"
import { getBoxForPick, getLocalTransform, getPickedTransform, getPutToBreastTransform, getPutToShoeTransform, getUBControlledTransform, handleFall, handlePickdown, handlePickup, handlePutToBreast, handlePutToShoe, handleUBControl, updatePutToBreastTransform, updatePutToShoeTransform, updateTransform, updateUBControlledTransform } from "./script/Pick"
import { updateAI } from "./script/Update"
import { getDeathData, getDeathHeadshotData, getIdleData, getKickLightData, getKickLightWorkFrameCount, getLieData, getMagicAttack1Data, getMagicAttack1WorkFrameCount, getPickedControlledData, getShakeData, getStandupFromLieData, getStompHeavyData, getStompHeavyWorkFrameCount, getStompLightData, getStompLightWorkFrameCount, getWalkData } from "./json/Data"
import { getRewardData } from "./json/RewardData"

let _handleRepel = (
    api: api,
    getIdleClipIndexFunc, getControlledClipIndexFunc
) => {
    // return (state,
    //     direction, distance, time,
    //     [matrix, box, name]
    // ) => {
    //     return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createRepelState(
    //         api,
    //     )(getIdleClipIndexFunc, getControlledClipIndexFunc), name, api.NullableUtils.return_([
    //         direction, distance, time,
    //         [matrix, box, name]
    //     ]))
    // }
    return api.handleRepelForCharacter([
        getStateMachine(api),
        setStateMachine(api),
        getIdleClipIndexFunc, getControlledClipIndexFunc,
        api.NullableUtils.getEmpty(),
        getIdleClipIndexFunc => createInitialState(api, getIdleClipIndexFunc)()
    ])
}


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

        // getWeaponStompLightData: getWeaponStompLightData,
        // getWeaponKickLightData: getWeaponKickLightData,

        getIdleData: getIdleData,
        getDeathData: getDeathData,
        getDeathHeadshotData: getDeathHeadshotData,
        getWalkData: getWalkData,
        getShakeData: getShakeData,
        getStompLightData: getStompLightData,
        getStompHeavyData: getStompHeavyData,
        getKickLightData: getKickLightData,
        getMagicAttack1Data: getMagicAttack1Data,
        getPickedControlledData: getPickedControlledData,
        getLieData: getLieData,
        getStandupFromLieData: getStandupFromLieData,
        getStompLightWorkFrameCount: getStompLightWorkFrameCount,
        getStompHeavyWorkFrameCount: getStompHeavyWorkFrameCount,
        getKickLightWorkFrameCount: getKickLightWorkFrameCount,
        getMagicAttack1WorkFrameCount: getMagicAttack1WorkFrameCount,

        updateWeaponValue: updateWeaponValue,
        computeHeight: computeHeight,

        attack: attack,
        exitFuncForCreateAttackState: exitFuncForCreateAttackState,
        getHp: getHp,
        updateHp: updateHp,
        damage: damage,
        getDeathClipIndex: getDeathClipIndex,
        createInitialState: createInitialState,
        createLieState: createLieState,
        createStandupState: createStandupState,
        createControlledState: createControlledState,
        generateEliteGiantesses: generateEliteGiantesses,
        initWhenImportScene: initWhenImportScene,
        // handleKickLightHitGirl: handleKickLightHitGirl,
        // handleStompLightHitLittleMan: handleStompLightHitLittleMan,
        getHpWithDefault: getHpWithDefault,
        createMoveState: createMoveState,
        stopAndRemoveMoveDataAndTween: stopAndRemoveMoveDataAndTween,
        getPickedTransform: getPickedTransform,
        getUBControlledTransform: getUBControlledTransform,
        getPutToBreastTransform: getPutToBreastTransform,
        getPutToShoeTransform: getPutToShoeTransform,
        handlePickup: handlePickup,
        updateTransform: updateTransform,
        handlePickdown: handlePickdown,
        handleFall: handleFall,
        handleRepel: _handleRepel,
        handleUBControl: handleUBControl,
        handlePutToBreast: handlePutToBreast,
        handlePutToShoe: handlePutToShoe,
        updateUBControlledTransform: updateUBControlledTransform,
        updatePutToBreastTransform: updatePutToBreastTransform,
        updatePutToShoeTransform: updatePutToShoeTransform,
        getLocalTransform: getLocalTransform,
        getBoxForPick: getBoxForPick,
        createState: createState,
        updateAI: updateAI,
        getEliteGiantessSkinMesh: getEliteGiantessSkinMesh,
        getQueue: getQueue,
        hasQueue: hasQueue,
        setData: setData,
        getClipData: getClipData,
        setClipData: setClipData,
        getInitialQuaternion: getInitialQuaternion,
        getStateMachine: getStateMachine,
        setStateMachine: setStateMachine,
        getModelQueue: getModelQueue,
        getModelQueueIndex: getModelQueueIndex,
        getAllModelQueues: getAllModelQueues,
        getBloodDecalQueue: getBloodDecalQueue,
        // getNamePrefix: getNamePrefix,
        // isEliteGiantess: isEliteGiantess,

        addEffect: addEffect,

        getRewardData: getRewardData,
    }
}

export let createBlockState: createBlockStateBlockManager<
    eliteState
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
            title: "精英巨大娘共享->默认",
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
        title: "Elite Giantess Share->Default",
        author: "Author",
        category: "Elite Giantess",
        version: "0.0.1",
    }
}