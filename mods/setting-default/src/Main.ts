import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as settingService } from "setting-protocol/src/service/ServiceType"
import { state as settingState } from "setting-protocol/src/state/StateType"
import { maxUnitCount, hdLevel, mapSize, mapSparse, physicsLevel, renderAccuracyLevel, shadowLevel } from "./Type"
import { getBlockName, getProtocolName } from "./script/Utils"
import { getRenderSetting, setRenderSetting, setRenderSettingKey } from "./script/RenderSetting"
import { Map } from "immutable"
import { api } from "type-api/src/Type"
import { getSettingType, getUIData } from "./json/UIData"
import { getDefaultRenderSetting } from "./json/SettingData"

let _resetRenderSetting = (api, state) => {
    // state = setRenderSetting(api, state, getDefaultRenderSetting(api))

    if (!api.getIsProduction(state) && api.Device.isMac()) {
        state = setRenderSetting(api, state, {
            ...getRenderSetting(api, state),
            hd: hdLevel.Low,
            shadow: shadowLevel.Low,
            maxUnitCount: maxUnitCount.Small,
            renderAccuracy: renderAccuracyLevel.Low,
            physics: physicsLevel.VeryLow,
            mapSize: mapSize.Small,
            mapSparse: mapSparse.Small,
        })
    }

    return state
}

export let getBlockService: getBlockServiceBlockManager<
    settingService
> = (api) => {
    return {
        init: (api: api, state) => {
            state = _resetRenderSetting(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            // state = api.blockAPI.setBlockState(state,
            //     getProtocolName(),
            //     getBlockName(),
            //     createBlockState()
            // )
            state = _resetRenderSetting(api, state)

            return Promise.resolve(state)
        },

        getSetting: getRenderSetting as any,
        setSetting: setRenderSetting,
        setSettingKey: setRenderSettingKey,

        getDefaultSetting: getDefaultRenderSetting as any,

        //  setHD:setHD, 

        //  setShadow:setShadow, 

        //  setRenderAccuracy:setRenderAccuracy, 

        //  setIsShowBlood:setIsShowBlood, 

        //  setCrowdSize:setCrowdSize, 

        //  setPhysics:setPhysics, 

        //  setCameraRotateSpeed:setCameraRotateSpeed, 

        // getCameraRotateSpeedRatio: getCameraRotateSpeedRatio,

        //  setMapSize:setMapSize, 

        getUIData: getUIData,
        getSettingType: getSettingType,
    }
}

export let createBlockState: createBlockStateBlockManager<
    settingState
> = (api: api) => {
    return {
        setting: api.NullableUtils.return_(getDefaultRenderSetting(api))
    }
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "设置->默认",
            author: "官方",
            category: "设置",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Setting->Default",
        author: "Author",
        category: "Setting",
        version: "0.0.1",
    }
}