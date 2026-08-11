import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as settingService } from "setting-protocol/src/service/ServiceType"
import { state as settingState } from "setting-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "./script/Utils"
import { getSoundSetting, setSoundSetting, setSoundSettingKey } from "./script/SoundSetting"
import { Map } from "immutable"
import { api } from "type-api/src/Type"
import { getSettingType, getUIData } from "./json/UIData"
import { getDefaultSoundSetting } from "./json/SettingData"

let _resetSoundSetting = (api, state) => {
    state = setSoundSetting(api, state, getDefaultSoundSetting(api))

    return state
}

export let getBlockService: getBlockServiceBlockManager<
    settingService
> = (api) => {
    return {
        init: (api: api, state) => {
            state = _resetSoundSetting(api, state)

            return Promise.resolve(state)
        },
        dispose: (api: api, state) => {
            // state = api.blockAPI.setBlockState(state,
            //     getProtocolName(),
            //     getBlockName(),
            //     createBlockState()
            // )
            state = _resetSoundSetting(api, state)

            return Promise.resolve(state)
        },

        getSetting: getSoundSetting as any,
        setSetting: setSoundSetting,
        setSettingKey: setSoundSettingKey,

        getDefaultSetting: getDefaultSoundSetting as any,

        getUIData: getUIData,
        getSettingType: getSettingType,
    }
}

export let createBlockState: createBlockStateBlockManager<
    settingState
> = () => {
    return {
        setting: null
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
            title: "设置->声音",
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
        title: "Setting->Sound",
        author: "Author",
        category: "Setting",
        version: "0.0.1",
    }
}