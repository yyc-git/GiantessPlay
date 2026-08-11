import { state as blockState } from "setting-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getBlockName, getProtocolName } from "./Utils"

let _getSetting = (api, state: state) => {
    return api.NullableUtils.getExn(api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()).setting)
}

let _setSetting = (api: api, state: state, setting) => {
    return api.blockAPI.setBlockState<blockState>(state,
        getProtocolName(),
        getBlockName(), {
        ...api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()),
        setting: api.NullableUtils.return_(setting)
    })
}

export let getSoundSetting = _getSetting

export let setSoundSetting = _setSetting

export let setSoundSettingKey = (api:api, state, key, value) => {
    let setting = _getSetting(api, state)

    setting[key] = value

    return _setSetting(api, state, setting)
}
